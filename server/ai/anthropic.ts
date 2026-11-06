// Anthropic adapter using the official SDK (@anthropic-ai/sdk).
// Streaming via messages.stream, structured output via messages.parse with a Zod schema.
// Server-side refusal fallback ("fallbacks": "default") is enabled on models that support it.

import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import type * as z4 from "zod/v4";
import type { ZodType } from "zod";
import { AIError, type AIProvider, type GenParams, type ModelInfo, type StreamChunk } from "./provider";

// Pricing snapshot used only for cost estimates in the UI (USD per million tokens).
export const ANTHROPIC_MODELS: ModelInfo[] = [
  { id: "claude-opus-5-5", label: "Claude Opus 5.5", inputPerM: 4, outputPerM: 20, note: "Default. Most capable Opus." },
  { id: "claude-sonnet-5-5", label: "Claude Sonnet 5.5", inputPerM: 2, outputPerM: 10, note: "Faster, lower cost." },
  { id: "claude-haiku-5-5", label: "Claude Haiku 5.5", inputPerM: 0.1, outputPerM: 0.5, note: "Fastest; good for patient dialogue." },
  { id: "claude-fable-5-1", label: "Claude Fable 5.1", inputPerM: 10, outputPerM: 50, note: "Highest capability and cost." },
];

const FALLBACK_MODELS = new Set(["claude-opus-5-5", "claude-sonnet-5-5", "claude-fable-5-1"]);

function fallbackParams(model: string): { betas?: string[]; fallbacks?: "default" } {
  return FALLBACK_MODELS.has(model) ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" } : {};
}

function mapError(e: unknown): AIError {
  if (e instanceof AIError) return e;
  if (e instanceof Anthropic.APIUserAbortError) return new AIError("aborted", "Request cancelled.");
  if (e instanceof Anthropic.APIConnectionTimeoutError) return new AIError("timeout", "The provider did not respond in time.");
  if (e instanceof Anthropic.APIConnectionError) return new AIError("network", "Could not reach the provider.");
  if (e instanceof Anthropic.AuthenticationError) return new AIError("auth", "The API key was rejected.");
  if (e instanceof Anthropic.PermissionDeniedError) return new AIError("auth", "The API key does not have permission for this model.");
  if (e instanceof Anthropic.RateLimitError) return new AIError("rate", "The provider rate limit was reached. Try again shortly.");
  if (e instanceof Anthropic.BadRequestError) return new AIError("other", "The provider rejected the request.");
  if (e instanceof Anthropic.APIError) return new AIError("other", `Provider error (${e.status ?? "unknown"}).`);
  return new AIError("other", "Unexpected provider error.");
}

export function createAnthropicProvider(apiKey: string): AIProvider {
  const client = new Anthropic({ apiKey });
  return {
    id: "anthropic",
    models: () => ANTHROPIC_MODELS,

    async *stream(p: GenParams): AsyncGenerator<StreamChunk> {
      try {
        const stream = client.beta.messages.stream(
          {
            model: p.model,
            max_tokens: p.maxTokens,
            system: p.system,
            messages: p.messages,
            output_config: { effort: p.effort ?? "medium" },
            ...fallbackParams(p.model),
          },
          { signal: p.signal, timeout: p.timeoutMs, maxRetries: p.maxRetries },
        );
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            yield { type: "text", text: event.delta.text };
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") throw new AIError("refusal", "The model declined this request.");
        yield { type: "done", usage: { inputTokens: final.usage.input_tokens, outputTokens: final.usage.output_tokens }, model: final.model };
      } catch (e) {
        throw mapError(e);
      }
    },

    async json<T>(p: GenParams & { schema: ZodType<T>; schemaName: string }) {
      try {
        const response = await client.beta.messages.parse(
          {
            model: p.model,
            max_tokens: p.maxTokens,
            system: p.system,
            messages: p.messages,
            output_config: { effort: p.effort ?? "medium", format: betaZodOutputFormat(p.schema as unknown as z4.ZodType<T>) },
            ...fallbackParams(p.model),
          },
          { signal: p.signal, timeout: p.timeoutMs, maxRetries: p.maxRetries },
        );
        if (response.stop_reason === "refusal") throw new AIError("refusal", "The model declined this request.");
        const checked = p.schema.safeParse(response.parsed_output);
        if (!checked.success) throw new AIError("invalid-output", "The model returned output that failed validation.");
        return {
          data: checked.data,
          usage: { inputTokens: response.usage.input_tokens, outputTokens: response.usage.output_tokens },
          model: response.model,
        };
      } catch (e) {
        throw mapError(e);
      }
    },
  };
}

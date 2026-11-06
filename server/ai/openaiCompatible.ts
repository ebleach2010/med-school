// Generic adapter for providers exposing an OpenAI-compatible Chat Completions endpoint
// (POST {baseUrl}/chat/completions with server-sent events when stream: true).
// Structured output is requested as JSON and always re-validated with Zod.

import type { ZodType } from "zod";
import { AIError, type AIProvider, type GenParams, type ModelInfo, type StreamChunk } from "./provider";

export function createOpenAICompatibleProvider(apiKey: string, baseUrl: string, modelIds: string[]): AIProvider {
  const models: ModelInfo[] = modelIds.map((id) => ({ id, label: id, inputPerM: 0, outputPerM: 0, note: "Pricing unknown; cost shown as 0." }));
  const url = `${baseUrl.replace(/\/$/, "")}/chat/completions`;

  async function post(p: GenParams, body: Record<string, unknown>): Promise<Response> {
    let lastErr: AIError | null = null;
    for (let attempt = 0; attempt <= p.maxRetries; attempt++) {
      const timeout = AbortSignal.timeout(p.timeoutMs);
      const signal = p.signal ? AbortSignal.any([p.signal, timeout]) : timeout;
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({ model: p.model, max_tokens: p.maxTokens, messages: [{ role: "system", content: p.system }, ...p.messages], ...body }),
          signal,
        });
        if (res.status === 401 || res.status === 403) throw new AIError("auth", "The API key was rejected.");
        if (res.status === 429 || res.status >= 500) {
          lastErr = new AIError(res.status === 429 ? "rate" : "other", `Provider returned ${res.status}.`);
          await new Promise((r) => setTimeout(r, 500 * 2 ** attempt));
          continue;
        }
        if (!res.ok) throw new AIError("other", `Provider returned ${res.status}.`);
        return res;
      } catch (e) {
        if (e instanceof AIError) throw e;
        if (p.signal?.aborted) throw new AIError("aborted", "Request cancelled.");
        if ((e as Error).name === "TimeoutError") lastErr = new AIError("timeout", "The provider did not respond in time.");
        else lastErr = new AIError("network", "Could not reach the provider.");
      }
    }
    throw lastErr ?? new AIError("other", "Request failed.");
  }

  return {
    id: "openai-compatible",
    models: () => models,

    async *stream(p: GenParams): AsyncGenerator<StreamChunk> {
      const res = await post(p, { stream: true, stream_options: { include_usage: true } });
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let usage = { inputTokens: 0, outputTokens: 0 };
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";
          for (const line of lines) {
            const t = line.trim();
            if (!t.startsWith("data:")) continue;
            const data = t.slice(5).trim();
            if (data === "[DONE]") continue;
            try {
              const j = JSON.parse(data);
              const delta = j.choices?.[0]?.delta?.content;
              if (delta) yield { type: "text", text: delta };
              if (j.usage) usage = { inputTokens: j.usage.prompt_tokens ?? 0, outputTokens: j.usage.completion_tokens ?? 0 };
            } catch {
              // Ignore malformed keep-alive lines.
            }
          }
        }
      } catch (e) {
        if (p.signal?.aborted) throw new AIError("aborted", "Request cancelled.");
        throw new AIError("network", (e as Error).message);
      }
      yield { type: "done", usage, model: p.model };
    },

    async json<T>(p: GenParams & { schema: ZodType<T>; schemaName: string }) {
      const res = await post(
        { ...p, system: `${p.system}\n\nRespond with a single JSON object only, no prose.` },
        { response_format: { type: "json_object" } },
      );
      const j = await res.json();
      const text: string = j.choices?.[0]?.message?.content ?? "";
      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch {
        throw new AIError("invalid-output", "The model did not return valid JSON.");
      }
      const checked = p.schema.safeParse(parsed);
      if (!checked.success) throw new AIError("invalid-output", "The model returned output that failed validation.");
      return { data: checked.data, usage: { inputTokens: j.usage?.prompt_tokens ?? 0, outputTokens: j.usage?.completion_tokens ?? 0 }, model: p.model };
    },
  };
}

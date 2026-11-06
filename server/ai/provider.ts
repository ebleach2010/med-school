// Provider adapter interface. The app talks to this interface only, so vendors can be
// swapped. Adapters run server-side; keys never reach the browser.

import type { ZodType } from "zod";
import type { ProviderId } from "../secrets";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export type Effort = "low" | "medium" | "high";

export interface GenParams {
  system: string;
  messages: ChatMessage[];
  model: string;
  maxTokens: number;
  effort?: Effort;
  signal?: AbortSignal;
  timeoutMs: number;
  maxRetries: number;
}

export interface Usage {
  inputTokens: number;
  outputTokens: number;
}

export type StreamChunk = { type: "text"; text: string } | { type: "done"; usage: Usage; model: string };

export interface ModelInfo {
  id: string;
  label: string;
  /** Estimated USD per million tokens. Shown as an estimate; verify current pricing with the provider. */
  inputPerM: number;
  outputPerM: number;
  note?: string;
}

export type AIErrorKind = "missing-key" | "auth" | "rate" | "timeout" | "network" | "aborted" | "invalid-output" | "refusal" | "limit" | "other";

export class AIError extends Error {
  constructor(public kind: AIErrorKind, message: string) {
    super(message);
    this.name = "AIError";
  }
}

export interface AIProvider {
  id: ProviderId;
  models(): ModelInfo[];
  stream(p: GenParams): AsyncGenerator<StreamChunk>;
  json<T>(p: GenParams & { schema: ZodType<T>; schemaName: string }): Promise<{ data: T; usage: Usage; model: string }>;
}

export function estimateCost(models: ModelInfo[], model: string, usage: Usage): number {
  const m = models.find((x) => x.id === model);
  if (!m) return 0;
  return (usage.inputTokens * m.inputPerM + usage.outputTokens * m.outputPerM) / 1_000_000;
}

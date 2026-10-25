// AI service: chooses the configured provider, enforces per-session and daily limits,
// records usage and estimated cost, and maps failures to clear states. Callers fall back to
// rule-based behavior whenever this throws.

import type { ZodType } from "zod";
import type { DB } from "../db";
import { getSetting, setSetting } from "../db";
import { getKey, getOpenAIBaseUrl, mask, type ProviderId } from "../secrets";
import { log } from "../log";
import { createAnthropicProvider, ANTHROPIC_MODELS } from "./anthropic";
import { createOpenAICompatibleProvider } from "./openaiCompatible";
import { AIError, estimateCost, type AIProvider, type ChatMessage, type Effort, type ModelInfo, type StreamChunk } from "./provider";

export type AIRole = "patient" | "tutor" | "grader" | "author" | "test";

export interface AISettings {
  enabled: boolean;
  provider: ProviderId;
  model: string;
  patientModel: string;
  openaiModels: string[];
  timeoutMs: number;
  maxRetries: number;
  sessionCallLimit: number;
  dailyCostLimitUsd: number;
}

export const DEFAULT_AI_SETTINGS: AISettings = {
  enabled: true,
  provider: "anthropic",
  model: "claude-opus-5-5",
  patientModel: "claude-haiku-5-5",
  openaiModels: [],
  timeoutMs: 60000,
  maxRetries: 2,
  sessionCallLimit: 80,
  dailyCostLimitUsd: 5,
};

const ROLE_EFFORT: Record<AIRole, Effort> = { patient: "low", tutor: "medium", grader: "low", author: "high", test: "low" };
const ROLE_MAX_TOKENS: Record<AIRole, number> = { patient: 2000, tutor: 8000, grader: 2000, author: 32000, test: 1000 };

export type ProviderFactory = (provider: ProviderId, key: string, settings: AISettings) => AIProvider;

const defaultFactory: ProviderFactory = (provider, key, settings) =>
  provider === "anthropic" ? createAnthropicProvider(key) : createOpenAICompatibleProvider(key, getOpenAIBaseUrl() ?? "", settings.openaiModels);

export class AIService {
  constructor(private db: DB, private factory: ProviderFactory = defaultFactory) {}

  settings(): AISettings {
    return { ...DEFAULT_AI_SETTINGS, ...getSetting<Partial<AISettings>>(this.db, "ai", {}) };
  }

  updateSettings(patch: Partial<AISettings>): AISettings {
    const next = { ...this.settings(), ...patch };
    next.timeoutMs = Math.max(5000, Math.min(300000, next.timeoutMs));
    next.maxRetries = Math.max(0, Math.min(5, next.maxRetries));
    next.sessionCallLimit = Math.max(1, Math.min(1000, next.sessionCallLimit));
    next.dailyCostLimitUsd = Math.max(0, Math.min(500, next.dailyCostLimitUsd));
    setSetting(this.db, "ai", next);
    return next;
  }

  models(): ModelInfo[] {
    const s = this.settings();
    if (s.provider === "anthropic") return ANTHROPIC_MODELS;
    return s.openaiModels.map((id) => ({ id, label: id, inputPerM: 0, outputPerM: 0 }));
  }

  /** Public status. Contains a masked key only. */
  status() {
    const s = this.settings();
    const k = getKey(s.provider);
    const today = this.usageSince(Date.now() - 24 * 3600 * 1000);
    return {
      mode: !s.enabled ? "disabled" : k.key ? "live" : "demo",
      provider: s.provider,
      keySource: k.source,
      maskedKey: mask(k.key),
      openaiBaseUrl: s.provider === "openai-compatible" ? getOpenAIBaseUrl() ?? null : null,
      settings: s,
      models: this.models(),
      usage24h: today,
    };
  }

  usageSince(ts: number) {
    const row = this.db
      .prepare("SELECT COUNT(*) AS calls, COALESCE(SUM(input_tokens),0) AS input, COALESCE(SUM(output_tokens),0) AS output, COALESCE(SUM(cost_usd),0) AS cost, COALESCE(SUM(1 - ok),0) AS failures FROM ai_usage WHERE ts >= ?")
      .get(ts) as { calls: number; input: number; output: number; cost: number; failures: number };
    return row;
  }

  usageByRole(ts: number) {
    return this.db
      .prepare("SELECT role, COUNT(*) AS calls, COALESCE(SUM(input_tokens),0) AS input, COALESCE(SUM(output_tokens),0) AS output, COALESCE(SUM(cost_usd),0) AS cost FROM ai_usage WHERE ts >= ? GROUP BY role")
      .all(ts);
  }

  private provider(): { p: AIProvider; s: AISettings } {
    const s = this.settings();
    if (!s.enabled) throw new AIError("missing-key", "AI features are turned off in settings.");
    const k = getKey(s.provider);
    if (!k.key) throw new AIError("missing-key", "No API key configured. The app is running in demo mode.");
    if (s.provider === "openai-compatible" && !getOpenAIBaseUrl()) throw new AIError("missing-key", "No base URL configured for the OpenAI-compatible provider.");
    return { p: this.factory(s.provider, k.key, s), s };
  }

  private checkLimits(sessionId: string, s: AISettings) {
    const calls = (this.db.prepare("SELECT COUNT(*) AS n FROM ai_usage WHERE session_id = ?").get(sessionId) as { n: number }).n;
    if (calls >= s.sessionCallLimit) throw new AIError("limit", `Session limit of ${s.sessionCallLimit} AI calls reached. Raise it in Settings or continue in demo mode.`);
    const cost = this.usageSince(Date.now() - 24 * 3600 * 1000).cost;
    if (s.dailyCostLimitUsd > 0 && cost >= s.dailyCostLimitUsd) throw new AIError("limit", `Daily estimated cost limit of $${s.dailyCostLimitUsd.toFixed(2)} reached.`);
  }

  private record(role: AIRole, provider: string, model: string, usage: { inputTokens: number; outputTokens: number }, sessionId: string, ok: boolean, error?: string) {
    const cost = estimateCost(this.models(), model, usage);
    this.db
      .prepare("INSERT INTO ai_usage (ts, role, provider, model, input_tokens, output_tokens, cost_usd, session_id, ok, error) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .run(Date.now(), role, provider, model, usage.inputTokens, usage.outputTokens, cost, sessionId, ok ? 1 : 0, error ?? null);
    return cost;
  }

  modelFor(role: AIRole, s: AISettings): string {
    return role === "patient" && s.patientModel ? s.patientModel : s.model;
  }

  async *stream(role: AIRole, sessionId: string, system: string, messages: ChatMessage[], signal?: AbortSignal): AsyncGenerator<StreamChunk & { cost?: number }> {
    const { p, s } = this.provider();
    this.checkLimits(sessionId, s);
    const model = this.modelFor(role, s);
    try {
      for await (const chunk of p.stream({ system, messages, model, maxTokens: ROLE_MAX_TOKENS[role], effort: ROLE_EFFORT[role], signal, timeoutMs: s.timeoutMs, maxRetries: s.maxRetries })) {
        if (chunk.type === "done") {
          const cost = this.record(role, p.id, chunk.model, chunk.usage, sessionId, true);
          yield { ...chunk, cost };
        } else yield chunk;
      }
    } catch (e) {
      const err = e instanceof AIError ? e : new AIError("other", "Unexpected error.");
      this.record(role, p.id, model, { inputTokens: 0, outputTokens: 0 }, sessionId, false, err.kind);
      log.warn(`AI ${role} stream failed: ${err.kind}`);
      throw err;
    }
  }

  async json<T>(role: AIRole, sessionId: string, system: string, messages: ChatMessage[], schema: ZodType<T>, schemaName: string, signal?: AbortSignal): Promise<T> {
    const { p, s } = this.provider();
    this.checkLimits(sessionId, s);
    const model = this.modelFor(role, s);
    try {
      const r = await p.json({ system, messages, model, maxTokens: ROLE_MAX_TOKENS[role], effort: ROLE_EFFORT[role], signal, timeoutMs: s.timeoutMs, maxRetries: s.maxRetries, schema, schemaName });
      this.record(role, p.id, r.model, r.usage, sessionId, true);
      return r.data;
    } catch (e) {
      const err = e instanceof AIError ? e : new AIError("other", "Unexpected error.");
      this.record(role, p.id, model, { inputTokens: 0, outputTokens: 0 }, sessionId, false, err.kind);
      log.warn(`AI ${role} json failed: ${err.kind}`);
      throw err;
    }
  }

  /** Connection test with a tiny request. */
  async test(sessionId: string): Promise<{ ok: boolean; latencyMs?: number; model?: string; error?: string; kind?: string }> {
    const started = Date.now();
    try {
      let text = "";
      let model = "";
      for await (const c of this.stream("test", sessionId, "You are a connection test. Reply with the single word OK.", [{ role: "user", content: "Connection test." }])) {
        if (c.type === "text") text += c.text;
        else model = c.model;
      }
      return { ok: text.length > 0, latencyMs: Date.now() - started, model };
    } catch (e) {
      const err = e as AIError;
      return { ok: false, error: err.message, kind: err.kind };
    }
  }
}

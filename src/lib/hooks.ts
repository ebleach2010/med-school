import { useEffect, useState } from "react";
import { api } from "./api";
import { useLearner } from "./store";

export function useReducedMotion(): boolean {
  const { settings } = useLearner();
  const [sys, setSys] = useState(() => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    if (typeof matchMedia === "undefined") return;
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setSys(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return settings.reducedMotion === "on" || (settings.reducedMotion === "system" && sys);
}

export interface ReviewOverride {
  version: number;
  status: "reviewed" | "pending" | "changes-requested";
  reviewer: string;
  note: string | null;
  ts: number;
}

let reviewCache: Record<string, ReviewOverride> | null = null;
const reviewListeners = new Set<(r: Record<string, ReviewOverride>) => void>();

export function refreshReviews() {
  api<Record<string, ReviewOverride>>("/api/reviews")
    .then((r) => {
      reviewCache = r;
      reviewListeners.forEach((l) => l(r));
    })
    .catch(() => undefined);
}

/** Human review decisions stored on the server, keyed by content id. */
export function useReviewOverrides(): Record<string, ReviewOverride> {
  const [r, setR] = useState<Record<string, ReviewOverride>>(reviewCache ?? {});
  useEffect(() => {
    reviewListeners.add(setR);
    if (!reviewCache) refreshReviews();
    return () => {
      reviewListeners.delete(setR);
    };
  }, []);
  return r;
}

export interface AIStatus {
  mode: "live" | "demo" | "disabled";
  provider: string;
  keySource: string;
  maskedKey: string | null;
  openaiBaseUrl: string | null;
  settings: {
    enabled: boolean;
    provider: "anthropic" | "openai-compatible";
    model: string;
    patientModel: string;
    openaiModels: string[];
    timeoutMs: number;
    maxRetries: number;
    sessionCallLimit: number;
    dailyCostLimitUsd: number;
  };
  models: { id: string; label: string; inputPerM: number; outputPerM: number; note?: string }[];
  usage24h: { calls: number; input: number; output: number; cost: number; failures: number };
}

let aiCache: AIStatus | null = null;
const aiListeners = new Set<(s: AIStatus | null) => void>();

export function setAIStatus(s: AIStatus | null) {
  aiCache = s;
  aiListeners.forEach((l) => l(s));
}

export function useAIStatus(): AIStatus | null {
  const [s, setS] = useState<AIStatus | null>(aiCache);
  useEffect(() => {
    aiListeners.add(setS);
    if (!aiCache) api<AIStatus>("/api/ai/status").then(setAIStatus).catch(() => setAIStatus(null));
    return () => {
      aiListeners.delete(setS);
    };
  }, []);
  return s;
}

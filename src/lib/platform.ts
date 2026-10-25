// Build flavor. The standalone build runs without the app server (for example as a
// hosted page) and is compiled with VITE_STANDALONE=1.

export const STANDALONE = import.meta.env.VITE_STANDALONE === "1";

interface ClaudeHost {
  use(name: string): Promise<unknown>;
}

/** A host capability (claude.ai page runtime), or null where the page runs elsewhere. */
export async function hostCapability<T>(name: string): Promise<T | null> {
  const host = (window as unknown as { claude?: ClaudeHost }).claude;
  if (!host?.use) return null;
  try {
    return ((await host.use(name)) as T) ?? null;
  } catch {
    return null;
  }
}

export interface SampleFn {
  (input: string | { role: "user" | "assistant"; content: string }[], options?: { onText?: (u: { text: string; delta: string }) => void; signal?: AbortSignal; cache?: boolean; modelTier?: "quick" | "default" | "complex" }): Promise<{ text: string; truncated: boolean }>;
  json<T = unknown>(input: string, options?: { signal?: AbortSignal; modelTier?: "quick" | "default" | "complex"; cache?: boolean }): Promise<T>;
}

export interface DownloadsCap {
  save(req: { filename: string; data: string }): Promise<{ status: string }>;
}

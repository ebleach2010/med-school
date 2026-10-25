// API client. A per-tab session id is sent so the server can apply per-session AI limits.

function sessionId(): string {
  try {
    let id = sessionStorage.getItem("nt-session");
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem("nt-session", id);
    }
    return id;
  } catch {
    return "anonymous";
  }
}

export class ApiError extends Error {
  constructor(public status: number, message: string, public kind?: string, public issues?: unknown) {
    super(message);
  }
}

/**
 * In the standalone build (no app server) requests are answered in the browser by a
 * local handler registered at startup. The default build never registers one.
 */
export type LocalHandler = (method: string, path: string, body: unknown) => Promise<unknown>;
export type LocalStream = (path: string, body: unknown, h: StreamHandlers, signal: AbortSignal) => Promise<void>;
let localHandler: LocalHandler | null = null;
let localStream: LocalStream | null = null;
export function setLocalApi(handler: LocalHandler, stream: LocalStream) {
  localHandler = handler;
  localStream = stream;
}

export async function api<T>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  if (localHandler) {
    try {
      return (await localHandler((init.method ?? "GET").toUpperCase(), path, init.json)) as T;
    } catch (e) {
      const err = e as { status?: number; message?: string; kind?: string; issues?: unknown };
      throw new ApiError(err.status ?? 400, err.message ?? "Request failed.", err.kind, err.issues);
    }
  }
  const headers: Record<string, string> = { "x-session-id": sessionId(), ...(init.headers as Record<string, string>) };
  let body = init.body;
  if (init.json !== undefined) {
    headers["content-type"] = "application/json";
    body = JSON.stringify(init.json);
  }
  let res: Response;
  try {
    res = await fetch(path, { ...init, headers, body });
  } catch {
    throw new ApiError(0, "The app server is not reachable. Offline features still work; encounters need the server.");
  }
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new ApiError(res.status, data?.error ?? `Request failed (${res.status})`, data?.kind, data?.issues);
  return data as T;
}

export interface StreamHandlers {
  onText: (t: string) => void;
  onDone?: (info: { usage: { inputTokens: number; outputTokens: number }; model: string; cost?: number }) => void;
  onError?: (e: { error: string; kind?: string }) => void;
}

/** POST and read server-sent events. Abort with the returned controller. */
export function streamApi(path: string, json: unknown, h: StreamHandlers): AbortController {
  const ctrl = new AbortController();
  if (localStream) {
    localStream(path, json, h, ctrl.signal).catch((e) => h.onError?.({ error: (e as Error).message ?? "Request failed." }));
    return ctrl;
  }
  (async () => {
    let res: Response;
    try {
      res = await fetch(path, { method: "POST", headers: { "content-type": "application/json", "x-session-id": sessionId() }, body: JSON.stringify(json), signal: ctrl.signal });
    } catch (e) {
      if ((e as Error).name !== "AbortError") h.onError?.({ error: "The app server is not reachable." });
      return;
    }
    if (!res.ok || !res.body) {
      const data = await res.json().catch(() => ({}));
      h.onError?.({ error: data.error ?? `Request failed (${res.status})`, kind: data.kind });
      return;
    }
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const parts = buf.split("\n\n");
        buf = parts.pop() ?? "";
        for (const part of parts) {
          let event = "message";
          let data = "";
          for (const line of part.split("\n")) {
            if (line.startsWith("event:")) event = line.slice(6).trim();
            else if (line.startsWith("data:")) data += line.slice(5).trim();
          }
          if (!data) continue;
          const parsed = JSON.parse(data);
          if (event === "text") h.onText(parsed);
          else if (event === "done") h.onDone?.(parsed);
          else if (event === "error") h.onError?.(parsed);
        }
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") h.onError?.({ error: "The stream was interrupted." });
    }
  })();
  return ctrl;
}

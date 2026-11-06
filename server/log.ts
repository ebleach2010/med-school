// Logging with secret redaction. Never log request bodies from AI routes or headers.

const KEY_PATTERNS = [/sk-ant-[A-Za-z0-9_\-]{8,}/g, /sk-[A-Za-z0-9_\-]{16,}/g, /Bearer\s+[A-Za-z0-9._\-]{12,}/gi, /x-api-key["':\s]+[A-Za-z0-9._\-]{12,}/gi];

const extraSecrets = new Set<string>();

/** Register a secret value so it is masked if it ever appears in a log line. */
export function registerSecret(value: string | undefined): void {
  if (value && value.length >= 8) extraSecrets.add(value);
}

export function redact(text: string): string {
  let out = text;
  for (const s of extraSecrets) out = out.split(s).join("[REDACTED]");
  for (const re of KEY_PATTERNS) out = out.replace(re, "[REDACTED]");
  return out;
}

function fmt(args: unknown[]): string {
  return args
    .map((a) => {
      if (a instanceof Error) return `${a.name}: ${a.message}`;
      if (typeof a === "string") return a;
      try {
        return JSON.stringify(a);
      } catch {
        return String(a);
      }
    })
    .join(" ");
}

export const log = {
  info: (...args: unknown[]) => console.log(redact(fmt(args))),
  warn: (...args: unknown[]) => console.warn(redact(fmt(args))),
  error: (...args: unknown[]) => console.error(redact(fmt(args))),
};

// Server-side secret storage. Keys come from environment variables or data/secrets.json
// (created with mode 0600). Keys are never returned to the client; only a masked form is.

import fs from "node:fs";
import path from "node:path";
import { registerSecret } from "./log";

export type ProviderId = "anthropic" | "openai-compatible";

interface SecretFile {
  anthropicKey?: string;
  openaiKey?: string;
  openaiBaseUrl?: string;
}

function secretsPath(): string {
  return path.join(process.env.DATA_DIR ?? "data", "secrets.json");
}

function readFile(): SecretFile {
  try {
    return JSON.parse(fs.readFileSync(secretsPath(), "utf8")) as SecretFile;
  } catch {
    return {};
  }
}

function writeFile(data: SecretFile): void {
  const p = secretsPath();
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2), { mode: 0o600 });
  fs.chmodSync(p, 0o600);
}

export function getKey(provider: ProviderId): { key?: string; source: "env" | "file" | "none" } {
  const env = provider === "anthropic" ? process.env.ANTHROPIC_API_KEY : process.env.OPENAI_COMPATIBLE_API_KEY;
  if (env) {
    registerSecret(env);
    return { key: env, source: "env" };
  }
  const f = readFile();
  const key = provider === "anthropic" ? f.anthropicKey : f.openaiKey;
  if (key) {
    registerSecret(key);
    return { key, source: "file" };
  }
  return { source: "none" };
}

export function getOpenAIBaseUrl(): string | undefined {
  return process.env.OPENAI_COMPATIBLE_BASE_URL ?? readFile().openaiBaseUrl;
}

export function setKey(provider: ProviderId, key: string, baseUrl?: string): void {
  const f = readFile();
  if (provider === "anthropic") f.anthropicKey = key.trim();
  else {
    f.openaiKey = key.trim();
    if (baseUrl) f.openaiBaseUrl = baseUrl.trim();
  }
  registerSecret(key.trim());
  writeFile(f);
}

export function clearKey(provider: ProviderId): void {
  const f = readFile();
  if (provider === "anthropic") delete f.anthropicKey;
  else delete f.openaiKey;
  writeFile(f);
}

/** "sk-ant-...wxyz": enough to recognize, never enough to use. */
export function mask(key?: string): string | null {
  if (!key) return null;
  const tail = key.slice(-4);
  const head = key.startsWith("sk-ant-") ? "sk-ant-" : key.slice(0, 3);
  return `${head}...${tail}`;
}

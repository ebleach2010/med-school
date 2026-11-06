// Progress storage for the hosted page: each viewer's own private documents in the
// page's `db` store (data/users/<id>/...), so progress follows the viewer's Claude account
// across devices. Attempts are split into chunks to stay under the per-document size cap.
// Where the store is unavailable, the page keeps working with browser storage only.

import { hostCapability } from "../lib/platform";

interface DocRef {
  get(): Promise<{ exists: boolean; data(): Record<string, unknown> | undefined }>;
  set(data: Record<string, unknown>): Promise<void>;
}
interface Db {
  doc(path: string): DocRef;
}
interface UserCap {
  id(): Promise<string | null>;
}

const CHUNK = 250;
let ctx: Promise<{ db: Db; uid: string } | null> | null = null;
const lastWritten = new Map<string, string>();
let chain: Promise<void> = Promise.resolve();

function context() {
  ctx ??= (async () => {
    const [db, user] = await Promise.all([hostCapability<Db>("db"), hostCapability<UserCap>("user")]);
    if (!db || !user) return null;
    const uid = await user.id().catch(() => null);
    return uid ? { db, uid } : null;
  })();
  return ctx;
}

export async function cloudAvailable(): Promise<boolean> {
  return (await context()) !== null;
}

export async function cloudLoadProgress(): Promise<unknown> {
  const c = await context();
  if (!c) return null;
  try {
    const main = await c.db.doc(`data/users/${c.uid}/state`).get();
    if (!main.exists) return null;
    const data = { ...(main.data() as Record<string, unknown>) };
    const n = Number(data.attemptChunks ?? 0);
    const attempts: unknown[] = [];
    for (let i = 0; i < n; i++) {
      const d = await c.db.doc(`data/users/${c.uid}/attempts-${i}`).get();
      if (d.exists) attempts.push(...((d.data()?.items as unknown[]) ?? []));
    }
    delete data.attemptChunks;
    return { ...data, attempts };
  } catch {
    return null;
  }
}

export function cloudSaveProgress(state: Record<string, unknown>): Promise<void> {
  // Serialize saves so each document gets one write at a time.
  chain = chain.then(async () => {
    const c = await context();
    if (!c) return;
    const attempts = (state.attempts as unknown[]) ?? [];
    const chunks = Math.ceil(attempts.length / CHUNK);
    const writes: [string, Record<string, unknown>][] = [];
    for (let i = 0; i < chunks; i++) writes.push([`data/users/${c.uid}/attempts-${i}`, { items: attempts.slice(i * CHUNK, (i + 1) * CHUNK) }]);
    const { attempts: _omit, ...rest } = state;
    writes.push([`data/users/${c.uid}/state`, { ...rest, attemptChunks: chunks }]);
    for (const [path, body] of writes) {
      const json = JSON.stringify(body);
      if (lastWritten.get(path) === json) continue;
      try {
        await c.db.doc(path).set(body);
        lastWritten.set(path, json);
      } catch {
        // Not writable for this viewer (for example a view-only share): browser storage still holds progress.
        return;
      }
    }
  });
  return chain;
}

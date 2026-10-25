// Learner state store: persisted to localStorage on every change and synced to the server
// (debounced). The sync code (profile id) lets another device pull the same progress.

import { useSyncExternalStore } from "react";
import type { Attempt, LearnerState } from "../../shared/types";
import { freshState, migrate, applyAttempt, makeAttempt, scheduleTestOutChecks, type AttemptInput } from "../../shared/learner";
import { now, setClockOffsetDays } from "../../shared/clock";
import { api } from "./api";

const KEY = "neuro-tutor:v1";

function readLocal(): LearnerState | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? migrate(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

let state: LearnerState = readLocal() ?? freshState(crypto.randomUUID(), Date.now());
setClockOffsetDays(state.settings.clockOffsetDays);
const listeners = new Set<() => void>();
let syncTimer: ReturnType<typeof setTimeout> | null = null;
export let lastSync: { ok: boolean; at: number } | null = null;

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked; the server copy still syncs.
  }
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    api(`/api/progress/${state.profileId}`, { method: "PUT", json: state })
      .then(() => (lastSync = { ok: true, at: Date.now() }))
      .catch(() => (lastSync = { ok: false, at: Date.now() }));
  }, 2500);
}

export function getState(): LearnerState {
  return state;
}

export function setState(next: LearnerState) {
  state = next;
  setClockOffsetDays(state.settings.clockOffsetDays);
  persist();
  listeners.forEach((l) => l());
}

export function update(fn: (s: LearnerState) => LearnerState) {
  setState({ ...fn(state), updatedAt: now() });
}

export function useLearner(): LearnerState {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
  );
}

export function recordAttempt(input: AttemptInput): Attempt {
  const a = makeAttempt(input, now(), crypto.randomUUID());
  setState(applyAttempt(state, a, input.item.usage.includes("review")));
  return a;
}

export function setSelfReport(attemptId: string, selfReport: Attempt["selfReport"]) {
  update((s) => ({ ...s, attempts: s.attempts.map((a) => (a.id === attemptId ? { ...a, selfReport } : a)) }));
}

export function setResume(route: string, label: string) {
  update((s) => ({ ...s, resume: { route, label, ts: now() } }));
}

export function testOut(moduleId: string, itemIds: string[]) {
  setState(scheduleTestOutChecks(state, moduleId, itemIds, now()));
}

/** On first load with an empty local state, adopt the server copy if one exists. */
export async function pullFromServer(profileId = state.profileId): Promise<boolean> {
  try {
    const r = await api<{ state: unknown }>(`/api/progress/${profileId}`);
    const remote = migrate(r.state);
    if (!remote) return false;
    if (remote.profileId !== state.profileId || remote.updatedAt > state.updatedAt) {
      setState(remote);
      return true;
    }
  } catch {
    // Offline: local copy remains authoritative.
  }
  return false;
}

export function exportState(): string {
  return JSON.stringify(state, null, 2);
}

export function importState(text: string): boolean {
  try {
    const s = migrate(JSON.parse(text));
    if (!s) return false;
    setState(s);
    return true;
  } catch {
    return false;
  }
}

export function resetState() {
  setState(freshState(crypto.randomUUID(), Date.now()));
}

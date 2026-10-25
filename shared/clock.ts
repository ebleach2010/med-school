// A controllable clock so delayed review and retention can be tested without waiting.
// The offset is a learner setting, shown in the UI whenever it is non-zero.

let offsetMs = 0;

export const DAY_MS = 24 * 60 * 60 * 1000;

export function setClockOffsetDays(days: number): void {
  offsetMs = days * DAY_MS;
}

export function getClockOffsetDays(): number {
  return offsetMs / DAY_MS;
}

export function now(): number {
  return Date.now() + offsetMs;
}

export function dayKey(ts: number): string {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

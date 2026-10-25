// Spaced retrieval scheduling (Leitner boxes with confidence adjustment).
// Every scheduling decision can be explained in plain language ("why is this due?").

import type { Attempt, ReviewEntry } from "./types";
import { DAY_MS } from "./clock";

/** Interval in days for each box. Box 0 is "relearn soon". */
export const BOX_DAYS = [0.5, 1, 3, 7, 16, 35, 80, 180];

export function intervalDays(box: number): number {
  return BOX_DAYS[Math.max(0, Math.min(BOX_DAYS.length - 1, box))];
}

export function schedule(itemId: string, moduleId: string, reason: ReviewEntry["reason"], nowTs: number, startBox = 1): ReviewEntry {
  return {
    itemId,
    moduleId,
    box: startBox,
    addedAt: nowTs,
    dueAt: nowTs + intervalDays(startBox) * DAY_MS,
    reason,
    history: [],
  };
}

/** Update an entry after a review attempt. */
export function applyReview(entry: ReviewEntry, attempt: Pick<Attempt, "score" | "confidence" | "ts">): ReviewEntry {
  let box = entry.box;
  if (attempt.score >= 0.8) {
    box += attempt.confidence === "sure" ? 1 : attempt.confidence === "guess" ? 0 : 1;
    if (attempt.confidence === "guess") box = Math.max(box, 1);
  } else if (attempt.score >= 0.5) {
    box = Math.max(1, box - 1);
  } else {
    box = 0;
  }
  return {
    ...entry,
    box,
    lastReviewedAt: attempt.ts,
    dueAt: attempt.ts + intervalDays(box) * DAY_MS,
    history: [...entry.history, { ts: attempt.ts, score: attempt.score }],
  };
}

export function isDue(entry: ReviewEntry, nowTs: number): boolean {
  return entry.dueAt <= nowTs;
}

function fmtDays(d: number): string {
  if (d < 1) return `${Math.round(d * 24)} hours`;
  const r = Math.round(d);
  return `${r} day${r === 1 ? "" : "s"}`;
}

export function whyDue(entry: ReviewEntry, nowTs: number): string {
  const last = entry.history[entry.history.length - 1];
  const reasonText: Record<ReviewEntry["reason"], string> = {
    lesson: "from a lesson you completed",
    missed: "because you missed it",
    "test-out": "to check retention of a module you tested out of",
    "placement-gap": "because placement showed a gap here",
    case: "from a patient encounter",
  };
  const overdue = nowTs - entry.dueAt;
  const status = overdue > DAY_MS ? ` It is ${fmtDays(overdue / DAY_MS)} overdue.` : "";
  if (!last) return `Added ${reasonText[entry.reason]}. First check scheduled ${fmtDays(intervalDays(entry.box))} later.${status}`;
  const when = fmtDays((nowTs - last.ts) / DAY_MS);
  if (last.score < 0.5) return `You missed this ${when} ago, so it comes back quickly for relearning.${status}`;
  return `You recalled this ${when} ago. Each successful recall spaces the next check further apart (now ${fmtDays(intervalDays(entry.box))}).${status}`;
}

/** Estimated probability of recall now, using an exponential forgetting curve. */
export function recallProbability(entry: ReviewEntry, nowTs: number): number {
  const lastTs = entry.lastReviewedAt ?? entry.addedAt;
  const stabilityDays = intervalDays(entry.box) * 1.6 + 0.5;
  const elapsed = Math.max(0, (nowTs - lastTs) / DAY_MS);
  return Math.exp(-elapsed / stabilityDays);
}

export function moduleRetention(entries: ReviewEntry[], moduleId: string, nowTs: number): number | null {
  const mine = entries.filter((e) => e.moduleId === moduleId);
  if (!mine.length) return null;
  return mine.reduce((s, e) => s + recallProbability(e, nowTs), 0) / mine.length;
}

/** Interleave due items so consecutive reviews come from different modules where possible. */
export function interleave(entries: ReviewEntry[]): ReviewEntry[] {
  const byModule = new Map<string, ReviewEntry[]>();
  for (const e of [...entries].sort((a, b) => a.dueAt - b.dueAt)) {
    if (!byModule.has(e.moduleId)) byModule.set(e.moduleId, []);
    byModule.get(e.moduleId)!.push(e);
  }
  const out: ReviewEntry[] = [];
  const queues = [...byModule.values()];
  while (queues.some((q) => q.length)) {
    for (const q of queues) {
      const next = q.shift();
      if (next) out.push(next);
    }
  }
  return out;
}

export function dueEntries(reviews: Record<string, ReviewEntry>, nowTs: number): ReviewEntry[] {
  return interleave(Object.values(reviews).filter((e) => isDue(e, nowTs)));
}

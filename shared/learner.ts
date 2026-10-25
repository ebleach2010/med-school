// Pure learner-state transitions. The client store calls these; tests call them directly.

import type { AssessmentItem, Attempt, Confidence, LearnerState, ReviewEntry } from "./types";
import type { ItemGrade } from "./grading";
import { applyReview, schedule } from "./scheduler";
import { evaluateStars } from "./stars";
import { dayKey } from "./clock";

export function freshState(profileId: string, nowTs: number): LearnerState {
  return {
    schemaVersion: 1,
    profileId,
    createdAt: nowTs,
    updatedAt: nowTs,
    settings: { sessionMinutes: 10, reducedMotion: "system", theme: "system", textScale: 1, showTimers: false, clockOffsetDays: 0, noticeAcknowledged: false },
    placement: null,
    attempts: [],
    reviews: {},
    stars: [],
    lessonProgress: {},
    challenges: {},
    testedOut: [],
    encounters: {},
    resume: null,
    activity: {},
  };
}

/** Validate and upgrade an imported or stored state. Returns null if unusable. */
export function migrate(raw: unknown): LearnerState | null {
  if (!raw || typeof raw !== "object") return null;
  const s = raw as Partial<LearnerState>;
  if (s.schemaVersion !== 1 || typeof s.profileId !== "string" || !Array.isArray(s.attempts)) return null;
  const base = freshState(s.profileId, s.createdAt ?? Date.now());
  return {
    ...base,
    ...s,
    settings: { ...base.settings, ...(s.settings ?? {}) },
    reviews: s.reviews ?? {},
    stars: s.stars ?? [],
    lessonProgress: s.lessonProgress ?? {},
    challenges: s.challenges ?? {},
    testedOut: s.testedOut ?? [],
    encounters: s.encounters ?? {},
    activity: s.activity ?? {},
  } as LearnerState;
}

export interface AttemptInput {
  item: Pick<AssessmentItem, "id" | "version" | "skill" | "modules" | "presentation" | "family" | "difficulty" | "usage">;
  grade: Pick<ItemGrade, "score" | "tag" | "answerSummary" | "keySummary">;
  context: Attempt["context"];
  confidence: Confidence;
  durationMs: number;
  hintsUsed?: number;
  selfReport?: Attempt["selfReport"];
  transfer?: boolean;
  dimensions?: Attempt["dimensions"];
}

export function makeAttempt(input: AttemptInput, nowTs: number, id: string): Attempt {
  return {
    id,
    itemId: input.item.id,
    itemVersion: input.item.version,
    context: input.context,
    ts: nowTs,
    score: input.grade.score,
    correct: input.grade.score >= 0.8,
    confidence: input.confidence,
    tag: input.grade.tag,
    selfReport: input.selfReport,
    hintsUsed: input.hintsUsed ?? 0,
    durationMs: input.durationMs,
    skill: input.item.skill,
    modules: input.item.modules,
    presentation: input.item.presentation,
    family: input.item.family,
    answerSummary: input.grade.answerSummary,
    keySummary: input.grade.keySummary,
    transfer: input.transfer ?? input.item.difficulty >= 2,
    dimensions: input.dimensions,
  };
}

/**
 * Record an attempt: update review scheduling, evaluate stars (never removing earned ones),
 * and log activity. Returns a new state object.
 */
export function applyAttempt(state: LearnerState, attempt: Attempt, reviewable: boolean): LearnerState {
  const reviews: Record<string, ReviewEntry> = { ...state.reviews };
  const existing = reviews[attempt.itemId];
  const moduleId = attempt.modules[0] ?? "general";
  if (existing && (attempt.context === "review" || attempt.context === "challenge")) {
    reviews[attempt.itemId] = applyReview(existing, attempt);
  } else if (!existing && reviewable) {
    const reason: ReviewEntry["reason"] =
      attempt.context === "placement" ? (attempt.score < 0.8 ? "placement-gap" : "test-out") : attempt.context === "case" ? "case" : attempt.score < 0.8 ? "missed" : "lesson";
    // Missed items come back soon (box 0); known ones start at box 1 or 2.
    const startBox = attempt.score < 0.8 ? 0 : attempt.confidence === "sure" ? 2 : 1;
    reviews[attempt.itemId] = schedule(attempt.itemId, moduleId, reason, attempt.ts, startBox);
  }

  const attempts = [...state.attempts, attempt];
  let stars = state.stars;
  for (const m of attempt.modules) {
    const awards = evaluateStars(m, attempts, stars);
    if (awards.length) stars = [...stars, ...awards];
  }

  const day = dayKey(attempt.ts);
  const prev = state.activity[day] ?? { minutes: 0, items: 0 };
  const activity = { ...state.activity, [day]: { minutes: prev.minutes + Math.min(attempt.durationMs, 15 * 60000) / 60000, items: prev.items + 1 } };

  return { ...state, attempts, reviews, stars, activity, updatedAt: attempt.ts };
}

/** Schedule occasional retention checks for a module the learner skipped. */
export function scheduleTestOutChecks(state: LearnerState, moduleId: string, itemIds: string[], nowTs: number): LearnerState {
  const reviews = { ...state.reviews };
  for (const id of itemIds) {
    if (!reviews[id]) reviews[id] = schedule(id, moduleId, "test-out", nowTs, 3);
  }
  return { ...state, reviews, testedOut: state.testedOut.includes(moduleId) ? state.testedOut : [...state.testedOut, moduleId] };
}

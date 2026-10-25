// Personalized path: prerequisite order, placement verdicts, stars and due reviews.

import type { LearnerState, Lesson, Module } from "./types";
import { moduleVerdict, type ModuleVerdict } from "./placement";
import { starsFor } from "./stars";
import { dueEntries } from "./scheduler";

export type PathStatus = "done" | "tested-out" | "can-skip" | "remediate" | "next" | "locked" | "planned";

export interface PathEntry {
  moduleId: string;
  status: PathStatus;
  reason: string;
  placement: ModuleVerdict;
}

/** Topological order (Kahn) with a stable tie-break by the module array order. */
export function topoOrder(modules: Module[]): Module[] {
  const byId = new Map(modules.map((m) => [m.id, m]));
  const indeg = new Map(modules.map((m) => [m.id, m.prerequisites.filter((p) => byId.has(p)).length]));
  const order: Module[] = [];
  const ready = modules.filter((m) => indeg.get(m.id) === 0);
  while (ready.length) {
    const m = ready.shift()!;
    order.push(m);
    for (const n of modules) {
      if (n.prerequisites.includes(m.id)) {
        indeg.set(n.id, indeg.get(n.id)! - 1);
        if (indeg.get(n.id) === 0) ready.push(n);
      }
    }
    ready.sort((a, b) => modules.indexOf(a) - modules.indexOf(b));
  }
  if (order.length !== modules.length) throw new Error("Prerequisite cycle in curriculum");
  return order;
}

export function buildPath(modules: Module[], state: LearnerState, nowTs: number): PathEntry[] {
  const placementAttempts = state.attempts.filter((a) => a.context === "placement");
  const entries = new Map<string, PathEntry>();
  for (const m of topoOrder(modules)) {
    const pv = moduleVerdict(placementAttempts.filter((a) => a.modules.includes(m.id)), nowTs).verdict;
    const stars = starsFor(m.id, state.stars);
    let status: PathStatus;
    let reason: string;
    if (m.status === "planned") {
      status = "planned";
      reason = "Planned content, not yet written.";
    } else if (state.testedOut.includes(m.id)) {
      status = "tested-out";
      reason = "Tested out. Occasional retention checks will still appear.";
    } else if (stars.some((s) => s.star >= 2)) {
      status = "done";
      reason = "Applied in a new case.";
    } else if (pv === "test-out") {
      status = "can-skip";
      reason = "Placement suggests you already know this. Skip it or take the challenge.";
    } else {
      const prereqsOk = m.prerequisites.every((p) => {
        const e = entries.get(p);
        return !e || ["done", "tested-out", "can-skip", "planned"].includes(e.status);
      });
      if (pv === "gap") {
        status = prereqsOk ? "remediate" : "locked";
        reason = prereqsOk ? "Placement found a gap here." : "Gap found, but a prerequisite comes first.";
      } else {
        status = prereqsOk ? "next" : "locked";
        reason = prereqsOk ? "Ready to learn." : "Recommended after its prerequisites (you can still open it).";
      }
    }
    entries.set(m.id, { moduleId: m.id, status, reason, placement: pv });
  }
  return [...entries.values()];
}

export interface Recommendation {
  kind: "placement" | "review" | "lesson" | "case" | "challenge" | "speed";
  route: string;
  title: string;
  why: string;
  minutes: number;
}

export function recommendNext(modules: Module[], lessons: Lesson[], state: LearnerState, nowTs: number): Recommendation {
  if (!state.placement || state.placement.status !== "complete") {
    return {
      kind: "placement",
      route: "/placement",
      title: state.placement ? "Resume placement" : "Take the placement assessment",
      why: "A short adaptive check so the path skips what you know and targets gaps.",
      minutes: 12,
    };
  }
  const due = dueEntries(state.reviews, nowTs);
  if (due.length >= 5) {
    return { kind: "review", route: "/review", title: `Review ${due.length} due items`, why: "Retrieval now, before these fade, is the most efficient study.", minutes: Math.ceil(due.length * 0.6) };
  }
  const path = buildPath(modules, state, nowTs);
  const pick = path.find((p) => p.status === "remediate") ?? path.find((p) => p.status === "next");
  if (pick) {
    const mod = modules.find((m) => m.id === pick.moduleId)!;
    const lesson = mod.lessons.map((id) => lessons.find((l) => l.id === id)).find((l) => l && !state.lessonProgress[l.id]?.completedAt);
    if (lesson) {
      return {
        kind: "lesson",
        route: `/lesson/${lesson.id}`,
        title: lesson.title,
        why: pick.status === "remediate" ? `Placement found a gap in ${mod.title}.` : `Next in your path: ${mod.title}.`,
        minutes: lesson.minutes,
      };
    }
    return {
      kind: "case",
      route: `/cases`,
      title: `Apply ${mod.title} in a patient encounter`,
      why: "Lessons done. Star 2 needs a correct application to a new case.",
      minutes: 10,
    };
  }
  if (due.length) {
    return { kind: "review", route: "/review", title: `Review ${due.length} due item${due.length > 1 ? "s" : ""}`, why: "Keeps retention up.", minutes: Math.ceil(due.length * 0.6) };
  }
  return { kind: "speed", route: "/speed", title: "Two-question speed round", why: "Mixed practice across topics.", minutes: 5 };
}

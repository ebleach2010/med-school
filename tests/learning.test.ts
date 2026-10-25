import { describe, expect, it } from "vitest";
import { freshState, makeAttempt, applyAttempt, migrate } from "../shared/learner";
import { gradeItem } from "../shared/grading";
import { estimate } from "../shared/mastery";
import { nextPlacementItem, placementReport } from "../shared/placement";
import { buildPath, recommendNext } from "../shared/recommend";
import { dueEntries, whyDue, moduleRetention } from "../shared/scheduler";
import { DAY_MS } from "../shared/clock";
import { ITEMS, ITEM_BY_ID, SCREENING_IDS } from "../content/items";
import { MODULES, MODULE_BY_ID } from "../content/curriculum";
import { LESSONS } from "../content/lessons";
import type { AssessmentItem, Confidence, LearnerState } from "../shared/types";
import type { ItemResponse } from "../shared/grading";

const T0 = Date.UTC(2026, 9, 1);
let n = 0;

function correctResponse(i: AssessmentItem): ItemResponse {
  switch (i.format) {
    case "mcq":
      return { kind: "mcq", optionId: i.options.find((o) => o.correct)!.id, reasoningOptionId: i.reasoning?.options.find((o) => o.correct)?.id };
    case "multi-select":
      return { kind: "multi-select", optionIds: i.options.filter((o) => o.correct).map((o) => o.id) };
    case "free-text":
      return { kind: "free-text", text: i.modelAnswer };
    case "localization":
      return { kind: "localization", region: i.correct[0] };
    case "select-tests":
      return { kind: "select-tests", optionIds: i.options.filter((o) => o.category === "necessary").map((o) => o.id) };
    case "order-priority":
      return { kind: "order-priority", order: i.order.flat() };
  }
}

function answer(s: LearnerState, item: AssessmentItem, ok: boolean, ts: number, context: "placement" | "lesson" | "review" | "challenge" = "placement", confidence: Confidence = "sure"): LearnerState {
  const grade = ok ? gradeItem(item, correctResponse(item)) : gradeItem(item, { kind: "idk" });
  const a = makeAttempt({ item, grade, context, confidence: ok ? confidence : "idk", durationMs: 20000 }, ts, `a${n++}`);
  return applyAttempt(s, a, item.usage.includes("review"));
}

function runPlacement(policy: (item: AssessmentItem) => boolean): LearnerState {
  let s = freshState("p", T0);
  s = { ...s, placement: { status: "in-progress", startedAt: T0, answered: [] } };
  let t = T0;
  for (let k = 0; k < 40; k++) {
    const pick = nextPlacementItem(s.placement!, s.attempts.filter((a) => a.context === "placement"), ITEMS, SCREENING_IDS, t);
    if (!pick) break;
    const item = ITEM_BY_ID.get(pick.itemId)!;
    s = answer(s, item, policy(item), (t += 60000));
    s = { ...s, placement: { ...s.placement!, answered: [...s.placement!.answered, item.id] } };
  }
  return { ...s, placement: { ...s.placement!, status: "complete", finishedAt: t } };
}

describe("mastery requires independent evidence", () => {
  it("one correct answer is never mastery", () => {
    const item = ITEMS[0];
    const s = answer(freshState("x", T0), item, true, T0);
    expect(estimate(s.attempts, T0).status).not.toBe("demonstrated");
  });
  it("repeating the same item does not create mastery", () => {
    let s = freshState("x", T0);
    for (let k = 0; k < 6; k++) s = answer(s, ITEMS[0], true, T0 + k * 1000);
    expect(estimate(s.attempts, T0 + 10000).status).not.toBe("demonstrated");
  });
});

describe("placement changes the recommended path", () => {
  const strong = runPlacement(() => true);
  const weak = runPlacement(() => false);

  it("answers adaptively beyond the screening block and stops", () => {
    expect(strong.placement!.answered.length).toBeGreaterThan(SCREENING_IDS.length);
    expect(strong.placement!.answered.length).toBeLessThanOrEqual(30);
  });

  it("strong performance lets modules be skipped; weak performance triggers remediation", () => {
    const sp = buildPath(MODULES, strong, T0 + DAY_MS);
    const wp = buildPath(MODULES, weak, T0 + DAY_MS);
    expect(sp.some((p) => p.status === "can-skip")).toBe(true);
    expect(wp.some((p) => p.status === "remediate")).toBe(true);
    expect(wp.some((p) => p.status === "can-skip")).toBe(false);
    const rs = recommendNext(MODULES, LESSONS, strong, T0 + DAY_MS);
    const rw = recommendNext(MODULES, LESSONS, weak, T0 + DAY_MS);
    expect(rs.route).not.toBe(rw.route);
  });

  it("reports strengths and gaps separately", () => {
    const rs = placementReport(strong.attempts, MODULES, T0 + DAY_MS);
    const rw = placementReport(weak.attempts, MODULES, T0 + DAY_MS);
    expect(rs.strengths.length).toBeGreaterThan(0);
    expect(rw.gaps.length).toBeGreaterThan(0);
    expect(rw.strengths.length).toBe(0);
  });
});

describe("stars, spaced review, and a controlled clock", () => {
  const mod = MODULE_BY_ID.get("f-localization")!;
  const items = ITEMS.filter((i) => i.modules.includes(mod.id));

  it("awards stars only for demonstrated achievement, and star 3 only after a delay", () => {
    let s = freshState("s", T0);
    const recog = items.filter((i) => i.difficulty === 1).slice(0, 2);
    for (const it of recog) s = answer(s, it, true, T0 + 1000, "lesson");
    expect(s.stars.filter((x) => x.moduleId === mod.id).map((x) => x.star)).toEqual([1]);

    const app = items.find((i) => i.difficulty >= 2 && !recog.some((r) => r.presentation === i.presentation))!;
    s = answer(s, app, true, T0 + 2000, "lesson");
    expect(s.stars.filter((x) => x.moduleId === mod.id).map((x) => x.star).sort()).toEqual([1, 2]);

    // Same day review does not earn star 3.
    const other = items.find((i) => i.id !== app.id && i.usage.includes("review") && !recog.includes(i))!;
    s = answer(s, other, true, T0 + 3000, "review");
    expect(s.stars.some((x) => x.moduleId === mod.id && x.star === 3)).toBe(false);

    // Four days later (controlled clock) a correct review earns star 3.
    s = answer(s, other, true, T0 + 4 * DAY_MS, "review");
    expect(s.stars.some((x) => x.moduleId === mod.id && x.star === 3)).toBe(true);

    // Later failures never remove earned stars.
    const before = s.stars.length;
    s = answer(s, app, false, T0 + 10 * DAY_MS, "review");
    expect(s.stars.length).toBe(before);
  });

  it("schedules reviews, makes them due with time, and explains why", () => {
    const it = items.find((i) => i.usage.includes("review"))!;
    let s = answer(freshState("r", T0), it, true, T0, "lesson");
    expect(dueEntries(s.reviews, T0 + 1000)).toHaveLength(0);
    const later = T0 + 10 * DAY_MS;
    const due = dueEntries(s.reviews, later);
    expect(due.map((d) => d.itemId)).toContain(it.id);
    expect(whyDue(due[0], later)).toMatch(/overdue|scheduled/);
    const retNow = moduleRetention(Object.values(s.reviews), it.modules[0], T0 + DAY_MS)!;
    const retLater = moduleRetention(Object.values(s.reviews), it.modules[0], later)!;
    expect(retLater).toBeLessThan(retNow);
    s = answer(s, it, true, later, "review");
    expect(s.reviews[it.id].dueAt).toBeGreaterThan(later + DAY_MS);
  });

  it("missed items come back sooner than known items", () => {
    const [a, b] = items.filter((i) => i.usage.includes("review"));
    let s = answer(freshState("m", T0), a, true, T0, "lesson");
    s = answer(s, b, false, T0, "lesson");
    expect(s.reviews[b.id].dueAt).toBeLessThan(s.reviews[a.id].dueAt);
  });
});

describe("persistence", () => {
  it("progress survives a serialize and reload round trip", () => {
    let s = freshState("persist", T0);
    s = answer(s, ITEMS[1], true, T0 + 1, "lesson");
    const reloaded = migrate(JSON.parse(JSON.stringify(s)));
    expect(reloaded).toEqual(s);
  });
  it("rejects malformed imports", () => {
    expect(migrate({ schemaVersion: 2 })).toBeNull();
    expect(migrate("nonsense")).toBeNull();
  });
});

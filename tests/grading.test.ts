import { describe, expect, it } from "vitest";
import { gradeFreeText, matchConcept } from "../shared/text";
import { gradeItem, orderScore } from "../shared/grading";
import { ITEMS, ITEM_BY_ID } from "../content/items";
import type { AnswerKey, SelectTestsItem } from "../shared/types";

const key: AnswerKey = {
  full: [{ id: "gbs", label: "Guillain-Barre syndrome", patterns: ["guillain barre", "aidp", "acute inflammatory demyelinating polyneuropathy"] }],
  partial: [{ concept: { id: "neuropathy", label: "Neuropathy", patterns: ["neuropathy", "polyneuropathy"] }, credit: 0.5, feedback: "Name the syndrome." }],
  overlySpecific: [{ concept: { id: "mfs", label: "Miller Fisher", patterns: ["miller fisher"] }, credit: 0.4, feedback: "Too specific." }],
  wrong: [{ concept: { id: "mg", label: "Myasthenia", patterns: ["myasthenia gravis"] }, tag: "misconception", feedback: "Reflexes are lost here." }],
};

describe("free-text grading accepts clinical meaning", () => {
  it.each(["Guillain-Barré syndrome", "GBS", "guillian barre", "Guillain Barre", "AIDP", "acute inflamatory demyelinating polyneuropathy"])("accepts %s", (a) => {
    expect(gradeFreeText(a, key).score).toBe(1);
  });
  it("gives partial credit for a correct but incomplete answer", () => {
    const g = gradeFreeText("an acute polyneuropathy", key);
    expect(g.score).toBe(0.5);
    expect(g.verdict).toBe("partial");
  });
  it("flags overly specific answers", () => {
    expect(gradeFreeText("Miller Fisher variant", key).verdict).toBe("overly-specific");
  });
  it("explains common wrong answers", () => {
    const g = gradeFreeText("MG", key);
    expect(g.score).toBe(0);
    expect(g.feedback).toMatch(/Reflexes/);
  });
  it("does not credit negated mentions", () => {
    expect(gradeFreeText("not GBS", key).score).toBe(0);
    expect(matchConcept("doesn't look like guillain barre", key.full[0]).matched).toBe(false);
  });
  it("does not merge different words that share a stem", () => {
    expect(matchConcept("meningioma", { id: "m", label: "", patterns: ["meningitis"] }).matched).toBe(false);
    expect(matchConcept("encephalopathy", { id: "e", label: "", patterns: ["encephalitis"] }).matched).toBe(false);
  });
});

describe("structured item grading", () => {
  it("unnecessary tests never raise the investigation score", () => {
    const item = ITEMS.find((i) => i.format === "select-tests") as SelectTestsItem;
    const necessary = item.options.filter((o) => o.category === "necessary").map((o) => o.id);
    const extra = item.options.filter((o) => o.category === "unnecessary").map((o) => o.id);
    const base = gradeItem(item, { kind: "select-tests", optionIds: necessary }).score;
    const padded = gradeItem(item, { kind: "select-tests", optionIds: [...necessary, ...extra] }).score;
    expect(base).toBe(1);
    expect(padded).toBeLessThan(base);
    const everything = gradeItem(item, { kind: "select-tests", optionIds: item.options.map((o) => o.id) }).score;
    expect(everything).toBeLessThan(1);
  });
  it("order scoring respects parallel groups", () => {
    expect(orderScore([["a", "b"], ["c"]], ["b", "a", "c"])).toBe(1);
    expect(orderScore([["a"], ["b"], ["c"]], ["c", "b", "a"])).toBe(0);
  });
  it("detects a right answer reached with weak reasoning", () => {
    const item = ITEM_BY_ID.get("li-umn-predict")!;
    if (item.format !== "mcq" || !item.reasoning) throw new Error("fixture");
    const right = item.options.find((o) => o.correct)!.id;
    const weak = item.reasoning.options.find((o) => !o.correct)!.id;
    const g = gradeItem(item, { kind: "mcq", optionId: right, reasoningOptionId: weak });
    expect(g.tag).toBe("weak-reasoning");
    expect(g.score).toBeLessThan(1);
  });
  it("records I don't know as a knowledge gap without friction", () => {
    const g = gradeItem(ITEMS[0], { kind: "idk" });
    expect(g.verdict).toBe("idk");
    expect(g.tag).toBe("knowledge-gap");
  });
  it("every free-text model answer earns full credit", () => {
    for (const i of ITEMS) if (i.format === "free-text") expect(gradeItem(i, { kind: "free-text", text: i.modelAnswer }).score, i.id).toBe(1);
  });
});

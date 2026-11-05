import { afterAll, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { generateQuestions, generateCase, GenerationError, type AskJson } from "../content/cases/generation";
import { CASE_BY_ID } from "../content/cases";
import { gradeItem } from "../shared/grading";
import { freshState, makeAttempt, applyAttempt } from "../shared/learner";
import { estimate } from "../shared/mastery";
import { openDb } from "../server/db";
import { createApp } from "../server/app";
import { AIService } from "../server/ai/service";
import type { AIProvider } from "../server/ai/provider";

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "nt-gen-"));
process.env.DATA_DIR = tmp;
afterAll(() => fs.rmSync(tmp, { recursive: true, force: true }));

const q = (stem: string, correct: number[]) => ({
  skill: "localization",
  difficulty: 2,
  presentation: `tag ${stem}`,
  vignette: "A 60-year-old has weakness — worse in the arm.",
  stem,
  options: ["Cortex", "Pons", "Root", "Muscle"].map((text, i) => ({ text, correct: correct.includes(i), feedback: "Because." })),
  rationale: "The pattern of weakness and reflexes localizes the lesion to the cortex.",
});

const asJson = (value: unknown): AskJson => async () => structuredClone(value);
const caseJson = (id: string) => ({ ...structuredClone(CASE_BY_ID.get(id)!), id: "draft" });

describe("generated questions", () => {
  it("keeps well-formed questions, drops ones with zero or two correct answers, and strips em dashes", async () => {
    const r = await generateQuestions(asJson({ questions: [q("Where is the lesion?", [0]), q("Which two are both right?", [0, 1]), q("Which one has no answer?", [])] }), { moduleId: "f-localization" });
    expect(r.items).toHaveLength(1);
    expect(r.dropped).toBe(2);
    const it0 = r.items[0];
    expect(it0.id.startsWith("gen-")).toBe(true);
    expect(it0.meta.generated).toBe(true);
    expect(it0.usage).toEqual([]);
    expect(it0.vignette).not.toContain("—");
    const right = it0.options.find((o) => o.correct)!;
    expect(gradeItem(it0, { kind: "mcq", optionId: right.id }).score).toBe(1);
  });

  it("fails cleanly when nothing usable comes back", async () => {
    await expect(generateQuestions(asJson({ nope: true }), { moduleId: "f-localization" })).rejects.toBeInstanceOf(GenerationError);
  });

  it("attempts on generated questions never earn stars or count as mastery", async () => {
    const { items } = await generateQuestions(asJson({ questions: [1, 2, 3, 4, 5, 6].map((n) => q(`Question ${n}?`, [0])) }), { moduleId: "f-localization" });
    let s = freshState("p", Date.UTC(2026, 9, 1));
    for (const [k, item] of items.entries()) {
      const grade = gradeItem(item, { kind: "mcq", optionId: item.options.find((o) => o.correct)!.id });
      const a = makeAttempt({ item, grade, context: "practice", confidence: "sure", durationMs: 9000, generated: true }, Date.UTC(2026, 9, 1 + k * 4), `a${k}`);
      s = applyAttempt(s, a, false);
    }
    expect(s.attempts).toHaveLength(6);
    expect(s.stars).toEqual([]);
    expect(Object.keys(s.reviews)).toEqual([]);
    expect(estimate(s.attempts, Date.UTC(2026, 10, 1)).status).toBe("unassessed");
  });
});

describe("generated cases", () => {
  it("accepts a coherent case and relabels it as generated, synthetic, and unreviewed", async () => {
    const c = await generateCase(asJson(caseJson("s-cts")), { moduleId: "c-polyneuropathy-radiculopathy", mode: "speed" });
    expect(c.id.startsWith("gen-case-")).toBe(true);
    expect(c.generated).toBe(true);
    expect(c.review).toBe("pending");
    expect(c.modes).toEqual(["speed"]);
    expect(c.modules).toEqual(["c-polyneuropathy-radiculopathy"]);
  });

  it("drops sources that are not in the module's verified list", async () => {
    const draft = { ...caseJson("n-cord-1"), sources: ["made-up-2031"] };
    const c = await generateCase(asJson(draft), { moduleId: "c-spinal-emergencies", mode: "full" });
    expect(c.sources).not.toContain("made-up-2031");
  });

  it("sends the checker's problems back once, and uses the repaired draft", async () => {
    const broken = { ...caseJson("n-cord-1"), hidden: { ...caseJson("n-cord-1").hidden, keyFindings: ["no-such-finding"] } };
    const prompts: string[] = [];
    const ask: AskJson = async (prompt) => {
      prompts.push(prompt);
      return prompts.length === 1 ? broken : caseJson("n-cord-1");
    };
    const c = await generateCase(ask, { moduleId: "c-spinal-emergencies", mode: "emergency" });
    expect(prompts).toHaveLength(2);
    expect(prompts[1]).toContain("no-such-finding");
    expect(c.modes).toEqual(["emergency"]);
  });

  it("rejects a case whose patient names the diagnosis, even after a repair round", async () => {
    const leaky = caseJson("s-cts");
    leaky.history[0] = { ...leaky.history[0], say: `My doctor said it is ${leaky.hidden.leakTerms[0]}.` };
    await expect(generateCase(asJson(leaky), { moduleId: "c-polyneuropathy-radiculopathy", mode: "speed" })).rejects.toMatchObject({ problems: expect.arrayContaining([expect.stringContaining("leaks")]) });
  });

  it("rejects a speed case without a speed presentation", async () => {
    const draft = caseJson("n-cord-1");
    await expect(generateCase(asJson(draft), { moduleId: "c-spinal-emergencies", mode: "speed" })).rejects.toBeInstanceOf(GenerationError);
  });
});

describe("generation over the API (server, with an API key)", () => {
  function makeApp(json: AIProvider["json"]) {
    const db = openDb(":memory:");
    const factory = () => ({ id: "anthropic", models: () => [{ id: "claude-opus-5-5", label: "x", inputPerM: 4, outputPerM: 20 }], stream: async function* () {}, json }) as unknown as AIProvider;
    return createApp({ db, ai: new AIService(db, factory) });
  }
  const post = (app: ReturnType<typeof createApp>, url: string, body: unknown) => app.request(url, { method: "POST", headers: { "content-type": "application/json", "x-session-id": "t" }, body: JSON.stringify(body) });

  it("needs a key", async () => {
    delete process.env.ANTHROPIC_API_KEY;
    const app = makeApp((async () => ({ data: {}, usage: { inputTokens: 0, outputTokens: 0 }, model: "m" })) as AIProvider["json"]);
    expect((await post(app, "/api/generate/questions", { moduleId: "f-localization" })).status).toBeGreaterThanOrEqual(400);
  });

  it("returns questions, and stores a generated case that can then be played", async () => {
    process.env.ANTHROPIC_API_KEY = "sk-ant-test-env-key-000000000000";
    let next: unknown = { questions: [q("Where is the lesion here?", [0])] };
    const app = makeApp((async () => ({ data: structuredClone(next), usage: { inputTokens: 1, outputTokens: 1 }, model: "m" })) as AIProvider["json"]);
    const qs = (await (await post(app, "/api/generate/questions", { moduleId: "f-localization" })).json()) as { items: unknown[] };
    expect(qs.items).toHaveLength(1);

    next = caseJson("n-cord-1");
    const res = await post(app, "/api/generate/case", { moduleId: "c-spinal-emergencies", mode: "full" });
    expect(res.status).toBe(200);
    const summary = (await res.json()) as { id: string; generated: boolean };
    expect(summary.generated).toBe(true);
    const list = (await (await app.request("/api/cases")).json()) as { id: string }[];
    expect(list.some((c) => c.id === summary.id)).toBe(true);
    const enc = await post(app, "/api/encounters", { caseId: summary.id, mode: "full" });
    expect(enc.status).toBe(200);
    const view = JSON.stringify(await enc.json());
    expect(view).not.toContain("leakTerms");
    delete process.env.ANTHROPIC_API_KEY;
  });
});

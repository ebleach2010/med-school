import { afterAll, beforeAll, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { openDb } from "../server/db";
import { createApp } from "../server/app";
import { AIService } from "../server/ai/service";
import { AIError, type AIProvider } from "../server/ai/provider";
import { redact, registerSecret } from "../server/log";
import { CASE_BY_ID } from "../content/cases";
import { INVESTIGATIONS } from "../content/investigations";

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "nt-test-"));
process.env.DATA_DIR = tmp;
delete process.env.ANTHROPIC_API_KEY;

function makeApp(provider?: Partial<AIProvider>) {
  const db = openDb(":memory:");
  const factory = () =>
    ({
      id: "anthropic",
      models: () => [{ id: "claude-opus-5-5", label: "x", inputPerM: 4, outputPerM: 20 }],
      stream: async function* () {
        yield { type: "text" as const, text: "Hello" };
        yield { type: "done" as const, usage: { inputTokens: 10, outputTokens: 2 }, model: "claude-opus-5-5" };
      },
      json: async () => {
        throw new AIError("network", "offline");
      },
      ...provider,
    }) as AIProvider;
  const ai = new AIService(db, factory);
  return { app: createApp({ db, ai }), db };
}

async function j(app: ReturnType<typeof createApp>, method: string, url: string, body?: unknown) {
  const res = await app.request(url, { method, headers: { "content-type": "application/json", "x-session-id": "test" }, body: body ? JSON.stringify(body) : undefined });
  return { status: res.status, body: await res.json(), text: "" };
}

afterAll(() => fs.rmSync(tmp, { recursive: true, force: true }));

describe("encounters keep hidden state on the server", () => {
  const { app } = makeApp();
  let id = "";
  const cs = CASE_BY_ID.get("n-stroke-1")!;

  beforeAll(async () => {
    const r = await j(app, "POST", "/api/encounters", { caseId: cs.id, mode: "emergency" });
    expect(r.status).toBe(200);
    id = r.body.id;
  });

  it("case list and active encounter views do not leak the answer", async () => {
    const list = JSON.stringify((await j(app, "GET", "/api/cases")).body);
    const view = JSON.stringify((await j(app, "GET", `/api/encounters/${id}`)).body);
    for (const text of [list, view]) {
      expect(text).not.toContain(cs.hidden.diagnosisLabel);
      expect(text).not.toContain("leakTerms");
      expect(text).not.toContain("teachingPoints");
      expect(text).not.toContain("interpretationChecks");
    }
  });

  it("answers from patient-knowable facts only and stays consistent", async () => {
    const a = await j(app, "POST", `/api/encounters/${id}/ask`, { question: "What did the CT scan show?" });
    const last = a.body.events[a.body.events.length - 1];
    expect(last.kind).toBe("patient");
    expect(last.text).toMatch(/don't know/i);
    const b1 = await j(app, "POST", `/api/encounters/${id}/ask`, { intent: "onset" });
    const b2 = await j(app, "POST", `/api/encounters/${id}/ask`, { intent: "onset" });
    expect(b1.body.events.at(-1).text).toBe(b2.body.events.at(-1).text);
  });

  it("results arrive only after turnaround; unmodeled tests say so", async () => {
    const unmodeled = INVESTIGATIONS.find((i) => i.turnaroundMin <= 600 && !cs.results.some((r) => r.investigation === i.id) && !cs.normalInvestigations.includes(i.id))!;
    await j(app, "POST", `/api/encounters/${id}/order`, { investigations: ["ct-head", unmodeled.id] });
    let v = (await j(app, "GET", `/api/encounters/${id}`)).body;
    expect(v.pendingOrders.map((o: { inv: string }) => o.inv)).toContain("ct-head");
    v = (await j(app, "POST", `/api/encounters/${id}/wait`, { minutes: 700 })).body;
    const results = v.events.filter((e: { kind: string }) => e.kind === "result").map((e: { text: string }) => e.text).join("\n");
    expect(results).toMatch(/CT head/i);
    expect(results).toMatch(/not modeled/i);
    expect(JSON.stringify(v)).toMatch(/fast-forward/i);
  });

  it("recognizes urgent actions, penalizes unnecessary tests, and grades meaning not wording", async () => {
    await j(app, "POST", `/api/encounters/${id}/submit`, { endpoint: "diagnosis", diagnosis: "L MCA ischaemic strok", localization: "cortex-left", differential: ["stroke mimic hypoglycemia"], keyFindings: [], reasoning: "", nextSteps: "" });
    const r = await j(app, "POST", `/api/encounters/${id}/interpret`, { answers: {} });
    const g = r.body.grade;
    expect(g.dimensions.diagnosis.score).toBe(1);
    expect(g.dimensions.investigations.details.join(" ")).toMatch(/Not indicated/);
    expect(g.dimensions.actions.details.join(" ")).toMatch(/Missed/);
    expect(g.debrief.diagnosisLabel).toBe(cs.hidden.diagnosisLabel);
  });

  it("unnecessary tests do not improve the score", async () => {
    const run = async (extra: string[]) => {
      const e = (await j(app, "POST", "/api/encounters", { caseId: cs.id, mode: "full" })).body.id;
      await j(app, "POST", `/api/encounters/${e}/order`, { investigations: [...cs.hidden.necessaryInvestigations, ...extra] });
      await j(app, "POST", `/api/encounters/${e}/submit`, { endpoint: "diagnosis", diagnosis: "x", differential: [], keyFindings: [], reasoning: "", nextSteps: "" });
      return (await j(app, "POST", `/api/encounters/${e}/interpret`, { answers: {} })).body.grade.dimensions.investigations.score;
    };
    const lean = await run([]);
    const padded = await run(["genetic-panel", "muscle-biopsy", "fdg-pet", "vep"]);
    expect(lean).toBe(1);
    expect(padded).toBeLessThan(lean);
  });
});

describe("two-question speed round", () => {
  const { app } = makeApp();
  it("enforces the limit consistently and grades equivalent answers", async () => {
    const v = (await j(app, "POST", "/api/speed/next", { exclude: [] })).body;
    expect(v.requestLimit).toBe(2);
    expect((await j(app, "POST", `/api/encounters/${v.id}/speed-request`, { kind: "history", id: "onset" })).status).toBe(200);
    expect((await j(app, "POST", `/api/encounters/${v.id}/speed-request`, { kind: "investigation", id: "cbc" })).status).toBe(200);
    const third = await j(app, "POST", `/api/encounters/${v.id}/speed-request`, { kind: "exam", id: "gait" });
    expect(third.status).toBe(400);
    expect((await j(app, "POST", `/api/encounters/${v.id}/ask`, { question: "anything else?" })).status).toBe(400);
    const cs = CASE_BY_ID.get(v.caseId)!;
    const sub = await j(app, "POST", `/api/encounters/${v.id}/speed-submit`, { diagnosis: cs.hidden.diagnosisLabel.toUpperCase() });
    expect(sub.body.grade.dimensions.diagnosis.score).toBe(1);
  });
  it("skip reveals the explanation", async () => {
    const v = (await j(app, "POST", "/api/speed/next", { exclude: [] })).body;
    const sub = await j(app, "POST", `/api/encounters/${v.id}/speed-submit`, { skip: true });
    expect(sub.body.grade.debrief.speedExplanation).toBeTruthy();
  });
});

describe("AI integration fallbacks and secrets", () => {
  it("demo mode works without a key and the tutor explains why it is unavailable", async () => {
    const { app } = makeApp();
    const s = (await j(app, "GET", "/api/ai/status")).body;
    expect(s.mode).toBe("demo");
    const e = (await j(app, "POST", "/api/encounters", { caseId: "n-mg-1", mode: "full" })).body.id;
    const r = await j(app, "POST", `/api/encounters/${e}/ask`, { question: "When did this start?", useAI: true });
    expect(r.status).toBe(200);
    expect(r.body.note).toMatch(/rule-based/);
    const lessonTutor = await app.request("/api/ai/tutor", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ kind: "lesson", lessonId: "l-nmj", messages: [{ role: "user", content: "hi" }] }) });
    const text = await lessonTutor.text();
    expect(text).toMatch(/missing-key/);
  });

  it("stores keys server-side and only ever returns a masked form", async () => {
    const { app } = makeApp();
    const secret = "sk-ant-api03-TESTSECRETVALUE-1234567890abcdef";
    const r = await j(app, "POST", "/api/ai/key", { provider: "anthropic", key: secret });
    expect(JSON.stringify(r.body)).not.toContain(secret);
    expect(r.body.maskedKey).toBe("sk-ant-...cdef");
    expect(r.body.mode).toBe("live");
    const file = fs.readFileSync(path.join(tmp, "secrets.json"), "utf8");
    expect(file).toContain(secret);
    expect(fs.statSync(path.join(tmp, "secrets.json")).mode & 0o077).toBe(0);
    registerSecret(secret);
    expect(redact(`calling with ${secret}`)).not.toContain(secret);
    await j(app, "DELETE", "/api/ai/key?provider=anthropic");
  });

  it("AI patient replies that leak the answer are replaced by the rule-based reply", async () => {
    process.env.ANTHROPIC_API_KEY = "sk-ant-test-env-key-000000000000";
    const { app } = makeApp({
      json: (async () => ({ data: { reply: "It's myasthenia gravis, doctor.", usedFactIds: [] }, usage: { inputTokens: 1, outputTokens: 1 }, model: "m" })) as AIProvider["json"],
    });
    const e = (await j(app, "POST", "/api/encounters", { caseId: "n-mg-1", mode: "full" })).body.id;
    const r = await j(app, "POST", `/api/encounters/${e}/ask`, { question: "What do you think is going on?", useAI: true });
    expect(r.body.note).toMatch(/risked revealing/);
    expect(JSON.stringify(r.body.events)).not.toMatch(/myasthenia/i);
    delete process.env.ANTHROPIC_API_KEY;
  });

  it("the tutor refuses to discuss an encounter before submission, then streams after", async () => {
    process.env.ANTHROPIC_API_KEY = "sk-ant-test-env-key-000000000000";
    const { app } = makeApp();
    const e = (await j(app, "POST", "/api/encounters", { caseId: "n-gbs-1", mode: "full" })).body.id;
    const early = await app.request("/api/ai/tutor", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ kind: "encounter", encounterId: e, messages: [{ role: "user", content: "what is it?" }] }) });
    expect(early.status).toBe(409);
    await j(app, "POST", `/api/encounters/${e}/submit`, { endpoint: "diagnosis", diagnosis: "GBS", differential: [], keyFindings: [], reasoning: "", nextSteps: "" });
    await j(app, "POST", `/api/encounters/${e}/interpret`, { answers: {} });
    const late = await app.request("/api/ai/tutor", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ kind: "encounter", encounterId: e, messages: [{ role: "user", content: "explain" }] }) });
    const text = await late.text();
    expect(text).toContain("event: text");
    expect(text).toContain("event: done");
    delete process.env.ANTHROPIC_API_KEY;
  });

  it("rejects malformed AI-drafted cases instead of storing them", async () => {
    process.env.ANTHROPIC_API_KEY = "sk-ant-test-env-key-000000000000";
    const { app, db } = makeApp({
      json: (async () => ({ data: { id: "bad", version: 1 }, usage: { inputTokens: 1, outputTokens: 1 }, model: "m" })) as AIProvider["json"],
    });
    const r = await j(app, "POST", "/api/proposals/ai-draft", { kind: "case", topic: "something", sourceIds: ["graus2016-ae"] });
    expect(r.status).toBeGreaterThanOrEqual(400);
    expect((db.prepare("SELECT COUNT(*) AS n FROM proposals").get() as { n: number }).n).toBe(0);
    delete process.env.ANTHROPIC_API_KEY;
  });
});

describe("progress sync", () => {
  it("stores and returns learner state", async () => {
    const { app } = makeApp();
    const state = { schemaVersion: 1, profileId: "abc", attempts: [], createdAt: 1, updatedAt: 2 };
    expect((await j(app, "PUT", "/api/progress/abc", state)).status).toBe(200);
    expect((await j(app, "GET", "/api/progress/abc")).body.state.profileId).toBe("abc");
    expect((await j(app, "PUT", "/api/progress/abc", { ...state, profileId: "other" })).status).toBe(400);
  });
});

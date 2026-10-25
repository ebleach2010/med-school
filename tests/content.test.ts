import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { CASES } from "../content/cases";
import { INVESTIGATION_IDS } from "../content/investigationIds";
import { validateCase } from "../shared/caseValidate";
import { answerQuestion, containsLeak, INTENTS } from "../shared/dialogue";
import { gradeFreeText } from "../shared/text";
import { SOURCES } from "../content/sources";

const ids = new Set<string>(INVESTIGATION_IDS);

describe("cases are internally coherent", () => {
  it.each(CASES.map((c) => [c.id, c] as const))("%s validates", (_id, c) => {
    expect(validateCase(c, ids).filter((i) => i.severity === "error")).toEqual([]);
    expect(gradeFreeText(c.hidden.diagnosisLabel, c.hidden.diagnosis).score).toBe(1);
  });
});

describe("patient dialogue never reveals hidden answers", () => {
  const probes = [
    ...INTENTS.map((i) => i.ask),
    "What is your diagnosis?",
    "What did the MRI show?",
    "Are your reflexes brisk?",
    "What were your antibody results?",
    "What do you think is wrong with you?",
    "Tell me everything.",
  ];
  it.each(CASES.map((c) => [c.id, c] as const))("%s", (_id, c) => {
    for (const q of probes) {
      const r = answerQuestion(c, q);
      expect(containsLeak(r.text, c.hidden.leakTerms), `${q} -> ${r.text}`).toBeNull();
    }
    expect(answerQuestion(c, "What did your MRI show?").kind).toBe("clinical-knowledge");
  });
});

describe("evidence and copy rules", () => {
  it("all sources are verified, dated, and linked", () => {
    for (const s of SOURCES) {
      expect(s.verified).toBe(true);
      expect(s.url).toMatch(/^https:\/\//);
      expect(s.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
  it("content validator passes (cross references, citations, em dashes)", () => {
    const out = execFileSync("npx", ["tsx", "scripts/validate-content.ts"], { encoding: "utf8" });
    expect(out).toContain("Content valid.");
  });
  it("interface copy has no em dashes", () => {
    const files: string[] = [];
    const walk = (d: string) => {
      for (const f of fs.readdirSync(d)) {
        const p = path.join(d, f);
        if (fs.statSync(p).isDirectory()) walk(p);
        else if (/\.(tsx?|css|html)$/.test(f)) files.push(p);
      }
    };
    walk("src");
    walk("content");
    walk("shared");
    files.push("index.html");
    for (const f of files) expect(fs.readFileSync(f, "utf8").includes("—"), f).toBe(false);
  });
  it("client code never imports hidden case content", () => {
    const offenders: string[] = [];
    const walk = (d: string) => {
      for (const f of fs.readdirSync(d)) {
        const p = path.join(d, f);
        if (fs.statSync(p).isDirectory()) walk(p);
        else if (/from\s+["'][^"']*(content\/cases|server\/)/.test(fs.readFileSync(p, "utf8"))) offenders.push(p);
      }
    };
    walk("src");
    expect(offenders).toEqual([]);
  });
});

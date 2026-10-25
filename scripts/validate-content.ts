// Content validator: run with `npm run validate:content`.
// Checks cross-references, citations, answer-key self-consistency, case coherence,
// and interface copy rules. Exits non-zero on any error.

import { SOURCE_BY_ID } from "../content/sources";
import { MODULES, MODULE_BY_ID } from "../content/curriculum";
import { INVESTIGATION_IDS } from "../content/investigationIds";
import { validateCase } from "../shared/caseValidate";
import { gradeFreeText } from "../shared/text";
import type { AssessmentItem, CaseDef, ContentMeta } from "../shared/types";

const errors: string[] = [];
const warnings: string[] = [];
const invIds = new Set<string>(INVESTIGATION_IDS);
const EM_DASH = "—";

async function tryImport<T>(path: string, name: string): Promise<T | undefined> {
  try {
    const mod = await import(path);
    return mod[name] as T;
  } catch (e) {
    warnings.push(`Could not import ${path} (${(e as Error).message.split("\n")[0]})`);
    return undefined;
  }
}

function checkSources(where: string, ids: string[]) {
  for (const id of ids) {
    const s = SOURCE_BY_ID.get(id);
    if (!s) errors.push(`${where}: unknown source id "${id}"`);
    else if (!s.verified) errors.push(`${where}: cites unverified source "${id}"`);
  }
}

function checkMeta(where: string, m: ContentMeta) {
  checkSources(where, m.sources);
  if (m.provenance !== "synthetic" && !m.sources.length) warnings.push(`${where}: source-grounded content with no sources`);
}

function scanDashes(where: string, value: unknown) {
  const text = JSON.stringify(value);
  if (text.includes(EM_DASH)) errors.push(`${where}: contains an em dash`);
}

async function main() {
  // Curriculum
  for (const m of MODULES) {
    checkMeta(`module ${m.id}`, m.meta);
    for (const p of m.prerequisites) if (!MODULE_BY_ID.has(p)) errors.push(`module ${m.id}: unknown prerequisite ${p}`);
    if (m.status === "complete" && !m.lessons.length) errors.push(`module ${m.id}: marked complete with no lessons`);
  }
  scanDashes("curriculum", MODULES);

  // Items
  const items = (await tryImport<AssessmentItem[]>("../content/items/index", "ITEMS")) ?? [];
  const itemIds = new Set<string>();
  for (const it of items) {
    if (itemIds.has(it.id)) errors.push(`item ${it.id}: duplicate id`);
    itemIds.add(it.id);
    checkMeta(`item ${it.id}`, it.meta);
    for (const mid of it.modules) if (!MODULE_BY_ID.has(mid)) errors.push(`item ${it.id}: unknown module ${mid}`);
    if (it.format === "free-text" && gradeFreeText(it.modelAnswer, it.answer).score < 1) errors.push(`item ${it.id}: model answer fails its own key`);
    if (it.format === "mcq" && it.options.filter((o) => o.correct).length !== 1) errors.push(`item ${it.id}: MCQ needs exactly one correct option`);
    if (it.format === "select-tests" && !it.options.some((o) => o.category === "necessary")) errors.push(`item ${it.id}: no necessary option`);
    if (it.format === "order-priority") {
      const flat = it.order.flat();
      if (flat.length !== it.steps.length || !it.steps.every((s) => flat.includes(s.id))) errors.push(`item ${it.id}: order does not cover steps exactly`);
    }
  }
  scanDashes("items", items);
  for (const m of MODULES) for (const ci of m.challengeItems) if (items.length && !itemIds.has(ci)) errors.push(`module ${m.id}: challenge item ${ci} not found`);
  const screening = (await tryImport<string[]>("../content/items/index", "SCREENING_IDS")) ?? [];
  for (const s of screening) if (!itemIds.has(s)) errors.push(`screening id ${s} not found`);

  // Lessons
  const lessons = (await tryImport<import("../shared/types").Lesson[]>("../content/lessons/index", "LESSONS")) ?? [];
  for (const l of lessons) {
    checkMeta(`lesson ${l.id}`, l.meta);
    if (!MODULE_BY_ID.get(l.moduleId)?.lessons.includes(l.id)) errors.push(`lesson ${l.id}: not listed in module ${l.moduleId}`);
    for (const s of l.steps) {
      if ((s.kind === "predict" || s.kind === "apply") && !itemIds.has(s.itemId)) errors.push(`lesson ${l.id}: item ${s.itemId} not found`);
      if (s.kind === "summary") for (const r of s.reviewItemIds) if (!itemIds.has(r)) errors.push(`lesson ${l.id}: review item ${r} not found`);
    }
  }
  scanDashes("lessons", lessons);
  for (const m of MODULES) for (const lid of m.lessons) if (lessons.length && !lessons.some((l) => l.id === lid)) errors.push(`module ${m.id}: lesson ${lid} missing`);

  // Glossary
  const glossary = (await tryImport<import("../shared/types").Term[]>("../content/glossary", "GLOSSARY")) ?? [];
  const termIds = new Set(glossary.map((t) => t.id));
  scanDashes("glossary", glossary);
  const markup = /\[\[([^|\]]+)\|/g;
  for (const blob of [JSON.stringify(lessons), JSON.stringify(items)]) {
    for (const m of blob.matchAll(markup)) if (glossary.length && !termIds.has(m[1])) errors.push(`glossary term "${m[1]}" referenced but not defined`);
  }

  // Investigations
  const invs = (await tryImport<import("../shared/types").Investigation[]>("../content/investigations", "INVESTIGATIONS")) ?? [];
  if (invs.length) {
    const have = new Set(invs.map((i) => i.id));
    for (const id of INVESTIGATION_IDS) if (!have.has(id)) errors.push(`investigation catalog missing ${id}`);
    for (const i of invs) {
      if (!invIds.has(i.id)) errors.push(`investigation ${i.id} not in INVESTIGATION_IDS`);
      checkMeta(`investigation ${i.id}`, i.meta);
      for (const b of i.bundle ?? []) if (!b) errors.push(`investigation ${i.id}: empty bundle member`);
    }
    scanDashes("investigations", invs);
  }

  // Antibodies
  const abs = (await tryImport<import("../shared/types").AntibodyEntry[]>("../content/antibodies", "ANTIBODIES")) ?? [];
  for (const a of abs) checkMeta(`antibody ${a.id}`, a.meta);
  scanDashes("antibodies", abs);

  // Cases
  const cases = (await tryImport<CaseDef[]>("../content/cases/index", "CASES")) ?? [];
  const caseIds = new Set<string>();
  for (const c of cases) {
    if (caseIds.has(c.id)) errors.push(`case ${c.id}: duplicate id`);
    caseIds.add(c.id);
    checkSources(`case ${c.id}`, c.sources);
    for (const mid of c.modules) if (!MODULE_BY_ID.has(mid)) errors.push(`case ${c.id}: unknown module ${mid}`);
    for (const issue of validateCase(c, invIds)) (issue.severity === "error" ? errors : warnings).push(`case ${c.id}: ${issue.message}`);
  }
  scanDashes("cases", cases);

  console.log(`Checked ${MODULES.length} modules, ${lessons.length} lessons, ${items.length} items, ${glossary.length} terms, ${invs.length} investigations, ${abs.length} antibodies, ${cases.length} cases.`);
  for (const w of warnings) console.log(`warning: ${w}`);
  for (const e of errors) console.log(`ERROR: ${e}`);
  if (errors.length) {
    console.log(`${errors.length} error(s).`);
    process.exit(1);
  }
  console.log("Content valid.");
}

main();

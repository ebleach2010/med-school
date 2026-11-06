// Writes docs/COVERAGE.md from the content itself, so the matrix cannot drift from reality.
// Run: npm run coverage

import fs from "node:fs";
import { DOMAINS, MODULES } from "../content/curriculum";
import { LESSONS } from "../content/lessons";
import { ITEMS } from "../content/items";
import { CASES } from "../content/cases";
import { INVESTIGATIONS } from "../content/investigations";
import { ANTIBODIES, ANTIBODY_COVERAGE } from "../content/antibodies";
import { GLOSSARY } from "../content/glossary";
import { SOURCES, SOURCES_COVERAGE_DATE } from "../content/sources";
import { SKILLS, SKILL_LABELS } from "../shared/types";
import type { ContentMeta } from "../shared/types";

const lines: string[] = [];
const p = (s = "") => lines.push(s);

function reviewCounts(metas: Pick<ContentMeta, "review" | "provenance">[]) {
  const c = { reviewed: 0, pending: 0, changes: 0, synthetic: 0 };
  for (const m of metas) {
    if (m.provenance === "synthetic") c.synthetic++;
    if (m.review === "reviewed") c.reviewed++;
    else if (m.review === "changes-requested") c.changes++;
    else c.pending++;
  }
  return c;
}

p("# Content coverage");
p();
p(`Generated from the content files by \`npm run coverage\`. Source registry checked ${SOURCES_COVERAGE_DATE}; antibody inventory coverage date ${ANTIBODY_COVERAGE.coverageDate}.`);
p();
p("Review status below is the status recorded in the content files. Approvals made in the in-app review workspace are stored in the server database and shown in the app's Reference > Coverage tab.");
p();
p("## Totals");
p();
p("| Content | Count | Reviewed | AI draft, awaiting review | Synthetic |");
p("|---|---|---|---|---|");
const rows: [string, Pick<ContentMeta, "review" | "provenance">[]][] = [
  ["Modules with content", MODULES.filter((m) => m.status !== "planned").map((m) => m.meta)],
  ["Lessons", LESSONS.map((l) => l.meta)],
  ["Assessment items", ITEMS.map((i) => i.meta)],
  ["Patient cases", CASES.map((c) => ({ review: c.review, provenance: c.provenance }))],
  ["Investigations", INVESTIGATIONS.map((i) => i.meta)],
  ["Antibody entries", ANTIBODIES.map((a) => a.meta)],
];
for (const [label, metas] of rows) {
  const c = reviewCounts(metas);
  p(`| ${label} | ${metas.length} | ${c.reviewed} | ${c.pending} | ${c.synthetic} |`);
}
p(`| Glossary terms | ${GLOSSARY.length} | | | |`);
p(`| Verified sources | ${SOURCES.length} | | | |`);
p();
p("## Coverage matrix by domain");
p();
p("| Domain | Complete | Partial | Planned | Lessons | Items | Full cases | Speed cases |");
p("|---|---|---|---|---|---|---|---|");
for (const d of DOMAINS) {
  const mods = MODULES.filter((m) => m.domain === d.id);
  const ids = new Set(mods.map((m) => m.id));
  const cases = CASES.filter((c) => c.modules.some((m) => ids.has(m)));
  p(
    `| ${d.title} | ${mods.filter((m) => m.status === "complete").length} | ${mods.filter((m) => m.status === "partial").length} | ${mods.filter((m) => m.status === "planned").length} | ${LESSONS.filter((l) => ids.has(l.moduleId)).length} | ${ITEMS.filter((i) => i.modules.some((m) => ids.has(m))).length} | ${cases.filter((c) => !c.modes.includes("speed")).length} | ${cases.filter((c) => c.modes.includes("speed")).length} |`,
  );
}
p();
p("## Modules");
p();
p("| Module | Status | Lessons | Items | Cases |");
p("|---|---|---|---|---|");
for (const m of MODULES) {
  p(`| ${m.title} | ${m.status} | ${m.lessons.length} | ${ITEMS.filter((i) => i.modules.includes(m.id)).length} | ${CASES.filter((c) => c.modules.includes(m.id)).length} |`);
}
p();
p("## Assessment items by ability");
p();
p("| Ability | Items | Distinct presentations |");
p("|---|---|---|");
for (const s of SKILLS) {
  const its = ITEMS.filter((i) => i.skill === s);
  p(`| ${SKILL_LABELS[s]} | ${its.length} | ${new Set(its.map((i) => i.presentation)).size} |`);
}
p();
p("## Encounter modes");
p();
for (const mode of ["full", "emergency", "uncertainty", "longitudinal", "speed"] as const) p(`- ${mode}: ${CASES.filter((c) => c.modes.includes(mode)).length} cases`);
p();
p("## Known gaps in the antibody reference");
p();
for (const g of ANTIBODY_COVERAGE.gaps) p(`- **${g.name}**: ${g.reason}`);
p();
fs.mkdirSync("docs", { recursive: true });
fs.writeFileSync("docs/COVERAGE.md", lines.join("\n") + "\n");
console.log("Wrote docs/COVERAGE.md");

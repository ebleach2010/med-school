// One file per built-out module. Each module file under content/modules exports CONTENT, a
// ModuleContent (or null while the module is still planned). The curriculum, lessons, items,
// glossary, and source registry merge these in, so modules can be written independently.

import type { AssessmentItem, ContentMeta, Lesson, SkillId, Source, Term } from "../../shared/types";

export interface ModuleContent {
  moduleId: string;
  /** Replaces the planned curriculum entry; the module is then shown as complete. */
  module: {
    title?: string;
    summary: string;
    objectives: [SkillId, string][];
    prerequisites?: string[];
    lessons: string[];
    challengeItems: string[];
    skills: SkillId[];
    minutes: number;
    sources: string[];
  };
  lessons: Lesson[];
  items: AssessmentItem[];
  /** New glossary terms. Ids already in the main glossary or another module are skipped. */
  terms: Term[];
  /** New registry sources, each verified on the web with how it was checked. */
  sources: Source[];
}

export const BUILD_DATE = "2026-11-06";

export function meta(id: string, sources: string[]): ContentMeta {
  return { id, version: 1, provenance: "source-grounded", review: "pending", author: "ai-draft", sources, lastVerified: BUILD_DATE };
}

/** A glossary term: plain meaning, precise meaning, optional pronunciation, and an example. */
export function term(id: string, name: string, aliases: string[], plain: string, medical: string, pronunciation: string | undefined, example: string, moduleId: string, related: string[] = []): Term {
  const out: Term = { id, term: name, plain, medical, example, moduleId, related };
  if (aliases.length) out.aliases = aliases;
  if (pronunciation) out.pronunciation = pronunciation;
  return out;
}

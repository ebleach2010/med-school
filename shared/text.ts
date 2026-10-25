// Text normalization and typo-tolerant concept matching for free-text answers.
// Grading looks for clinical meaning: spelling errors, abbreviations, word order and
// equivalent phrasings are accepted; negated mentions ("not stroke") are ignored.

import type { AnswerKey, Concept, ErrorTag } from "./types";

/** Abbreviations and common variants, expanded before matching. Keys are single tokens. */
export const ABBREVIATIONS: Record<string, string> = {
  mg: "myasthenia gravis",
  gbs: "guillain barre syndrome",
  aidp: "acute inflammatory demyelinating polyradiculoneuropathy",
  cidp: "chronic inflammatory demyelinating polyradiculoneuropathy",
  lems: "lambert eaton myasthenic syndrome",
  les: "lambert eaton syndrome",
  ms: "multiple sclerosis",
  nmosd: "neuromyelitis optica spectrum disorder",
  nmo: "neuromyelitis optica",
  mogad: "mog antibody associated disease",
  adem: "acute disseminated encephalomyelitis",
  als: "amyotrophic lateral sclerosis",
  mnd: "motor neuron disease",
  tia: "transient ischemic attack",
  sah: "subarachnoid hemorrhage",
  ich: "intracerebral hemorrhage",
  cva: "stroke",
  mca: "middle cerebral artery",
  aca: "anterior cerebral artery",
  pca: "posterior cerebral artery",
  ica: "internal carotid artery",
  lvo: "large vessel occlusion",
  hsv: "herpes simplex virus",
  vzv: "varicella zoster virus",
  ae: "autoimmune encephalitis",
  nmdar: "nmda receptor",
  nmda: "nmda",
  lgi1: "lgi1",
  ino: "internuclear ophthalmoplegia",
  mlf: "medial longitudinal fasciculus",
  cn: "cranial nerve",
  umn: "upper motor neuron",
  lmn: "lower motor neuron",
  se: "status epilepticus",
  gtc: "generalized tonic clonic",
  gtcs: "generalized tonic clonic seizure",
  iih: "idiopathic intracranial hypertension",
  gca: "giant cell arteritis",
  csf: "cerebrospinal fluid",
  lp: "lumbar puncture",
  ct: "ct",
  cta: "ct angiography",
  mri: "mri",
  mra: "mr angiography",
  eeg: "eeg",
  emg: "electromyography",
  ncs: "nerve conduction studies",
  rns: "repetitive nerve stimulation",
  ivig: "intravenous immunoglobulin",
  plex: "plasma exchange",
  plasmapheresis: "plasma exchange",
  tpa: "thrombolysis",
  alteplase: "thrombolysis",
  tenecteplase: "thrombolysis",
  tnk: "thrombolysis",
  ivt: "thrombolysis",
  evt: "thrombectomy",
  mt: "thrombectomy",
  abx: "antibiotics",
  dvt: "deep vein thrombosis",
  pres: "posterior reversible encephalopathy syndrome",
  rcvs: "reversible cerebral vasoconstriction syndrome",
  cvst: "cerebral venous sinus thrombosis",
  cvt: "cerebral venous thrombosis",
  scd: "subacute combined degeneration",
  pml: "progressive multifocal leukoencephalopathy",
  cjd: "creutzfeldt jakob disease",
  fnd: "functional neurological disorder",
  pnes: "psychogenic nonepileptic seizures",
  nes: "nonepileptic seizures",
  dx: "diagnosis",
  ddx: "differential",
  r: "right",
  l: "left",
  lt: "left",
  rt: "right",
  bilat: "bilateral",
  w: "with",
  "w/": "with",
};

const STOPWORDS = new Set(["the", "a", "an", "of", "and", "or", "to", "in", "on", "with", "due", "secondary", "is", "it", "its", "this", "that", "likely", "probably", "probable", "possible", "most", "i", "think", "would", "be", "my", "dx", "diagnosis", "from", "by", "for", "at", "as", "s"]);

const NEGATORS = new Set(["not", "no", "without", "unlikely", "exclude", "excluded", "excluding", "rule", "ruled", "never", "non", "dont", "doesnt", "isnt", "wasnt", "cant", "cannot", "nor"]);

/** Lowercase, strip accents and punctuation, split hyphens and slashes. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9+]+/g, " ")
    .trim();
}

export function tokenize(text: string): string[] {
  const out: string[] = [];
  for (const raw of normalize(text).split(/\s+/)) {
    if (!raw) continue;
    const exp = ABBREVIATIONS[raw];
    if (exp) out.push(...exp.split(" "));
    else out.push(raw);
  }
  return out.map(stem);
}

/** Very light stemming so plurals and simple suffixes match. */
export function stem(t: string): string {
  if (t.length > 5 && t.endsWith("ies")) return t.slice(0, -3) + "y";
  if (t.length > 4 && /(ches|shes|xes|zes|sses)$/.test(t)) return t.slice(0, -2);
  if (t.length > 3 && t.endsWith("s") && !t.endsWith("ss") && !t.endsWith("us") && !t.endsWith("is")) return t.slice(0, -1);
  return t;
}

/** Spelling variants that are equivalent (British/American, common shorthand). */
const SPELLING: [RegExp, string][] = [
  [/haem/g, "hem"],
  [/aemia/g, "emia"],
  [/oedema/g, "edema"],
  [/ischaem/g, "ischem"],
  [/oesophag/g, "esophag"],
  [/paralyses/g, "paralysis"],
];

function canon(t: string): string {
  let s = t;
  for (const [re, rep] of SPELLING) s = s.replace(re, rep);
  return s;
}

/** Edit distance counting an adjacent transposition as one edit (optimal string alignment). */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length];
}

/** Token equality with typo tolerance proportional to word length. */
export function tokenMatches(answerTok: string, patternTok: string): boolean {
  const a = canon(answerTok);
  const p = canon(patternTok);
  if (a === p) return true;
  // Short tokens (gene names, abbreviations, numbers) must match exactly.
  if (p.length <= 3 || /\d/.test(p)) return false;
  const tol = p.length >= 9 ? 2 : p.length >= 5 ? 1 : 0;
  if (tol > 0 && Math.abs(a.length - p.length) <= tol && levenshtein(a, p) <= tol) return true;
  // Suffix variants of long words ("angiogram" vs "angiography", "myasthenic" vs "myasthenia"),
  // without merging different words that share a stem ("meningitis" vs "meningioma").
  const shorter = Math.min(a.length, p.length);
  if (shorter >= 7 && Math.abs(a.length - p.length) <= 2) {
    let common = 0;
    while (common < shorter && a[common] === p[common]) common++;
    if (common >= Math.max(shorter - 2, 7)) return true;
  }
  return false;
}

export interface MatchResult {
  matched: boolean;
  negated: boolean;
  pattern?: string;
}

/** Extra content tokens allowed inside a phrase ("MCA on the left" still matches "left mca"). */
const PHRASE_SLACK = 1;

/**
 * Find placements of one phrase in the token list: all content tokens present, in any
 * order, with at most PHRASE_SLACK extra content tokens inside the span. Each placement
 * anchors on an occurrence of the first token and takes the nearest match for the others.
 */
function findPhrase(tokens: string[], phrase: string, used: Set<number>): number[][] {
  const ptoks = [...new Set(tokenize(phrase).filter((t) => !STOPWORDS.has(t)))];
  if (!ptoks.length) return [];
  const out: number[][] = [];
  for (let a = 0; a < tokens.length; a++) {
    if (used.has(a) || !tokenMatches(tokens[a], ptoks[0])) continue;
    const positions = [a];
    let ok = true;
    for (const pt of ptoks.slice(1)) {
      let best = -1;
      for (let i = 0; i < tokens.length; i++) {
        if (used.has(i) || positions.includes(i) || !tokenMatches(tokens[i], pt)) continue;
        // Nearest to the tokens already placed; ties go to the later token.
        const d = Math.min(...positions.map((q) => Math.abs(i - q)));
        const bd = best === -1 ? Infinity : Math.min(...positions.map((q) => Math.abs(best - q)));
        if (d < bd || (d === bd && i > best)) best = i;
      }
      if (best === -1) {
        ok = false;
        break;
      }
      positions.push(best);
    }
    if (!ok) continue;
    const lo = Math.min(...positions);
    const hi = Math.max(...positions);
    let content = 0;
    for (let i = lo; i <= hi; i++) if (!STOPWORDS.has(tokens[i])) content++;
    if (content <= ptoks.length + PHRASE_SLACK) out.push(positions);
  }
  return out;
}

function isNegatedAt(tokens: string[], positions: number[], part: string): boolean {
  if (tokenize(part).some((t) => NEGATORS.has(t))) return false;
  const first = Math.min(...positions);
  return tokens.slice(Math.max(0, first - 3), first).some((t) => NEGATORS.has(t));
}

/**
 * Does the answer express this concept? A pattern is one phrase, or several phrases joined
 * with " + " that must all appear anywhere (for answers combining a cause and a test, for
 * example "aneurysm + cta"). A phrase preceded within three tokens by a negator ("not",
 * "no", "unlikely", "rule out") is treated as negated and does not count.
 */
export function matchConcept(answer: string, concept: Concept, exclude: Set<number> = new Set()): MatchResult & { positions?: number[] } {
  const tokens = tokenize(answer);
  let sawNegated = false;
  for (const pattern of concept.patterns) {
    const parts = pattern.split(/\s\+\s/);
    const used = new Set<number>(exclude);
    let ok = true;
    let negated = false;
    for (const part of parts) {
      const placements = findPhrase(tokens, part, used);
      if (!placements.length) {
        ok = false;
        break;
      }
      // Prefer a placement that is not negated ("not left MCA, right MCA").
      const clean = placements.find((p) => !isNegatedAt(tokens, p, part));
      const chosen = clean ?? placements[0];
      if (!clean) negated = true;
      chosen.forEach((p) => used.add(p));
    }
    if (!ok) continue;
    if (negated) {
      sawNegated = true;
      continue;
    }
    return { matched: true, negated: false, pattern, positions: [...used].filter((i) => !exclude.has(i)) };
  }
  return { matched: false, negated: sawNegated };
}

export interface FreeTextGrade {
  score: number;
  verdict: "correct" | "partial" | "overly-specific" | "incorrect" | "blank";
  feedback: string;
  tag?: ErrorTag;
  matchedConcept?: string;
}

/**
 * Grade a free-text answer against an answer key. Order of precedence: a full-credit
 * concept wins; then overly specific; then partial; then known wrong answers.
 */
export function gradeFreeText(answer: string, key: AnswerKey): FreeTextGrade {
  if (!normalize(answer)) return { score: 0, verdict: "blank", feedback: "No answer given." };

  const wrongHitsExcluding = (exclude: Set<number>) => (key.wrong ?? []).filter((w) => matchConcept(answer, w.concept, exclude).matched);

  for (const c of key.full) {
    const m = matchConcept(answer, c);
    if (m.matched) {
      // Wrong concepts may not reuse the words of the accepted answer.
      const competing = wrongHitsExcluding(new Set(m.positions ?? []));
      if (competing.length) {
        // Hedged answers listing a wrong alternative still get credit for the right idea,
        // but the feedback points out the competing claim.
        return {
          score: 0.75,
          verdict: "partial",
          feedback: `You named the right answer (${c.label}) but also committed to something that does not fit: ${competing[0].feedback}`,
          tag: "weak-reasoning",
          matchedConcept: c.id,
        };
      }
      return { score: 1, verdict: "correct", feedback: `Accepted as ${c.label}.`, matchedConcept: c.id };
    }
  }
  const wrongHits = wrongHitsExcluding(new Set());
  for (const o of key.overlySpecific ?? []) {
    if (matchConcept(answer, o.concept).matched) {
      return { score: o.credit, verdict: "overly-specific", feedback: o.feedback, tag: "overly-specific", matchedConcept: o.concept.id };
    }
  }
  // A specific wrong answer ("left MCA") outranks a generic partial match ("MCA").
  if (wrongHits.length) {
    const w = wrongHits[0];
    return { score: 0, verdict: "incorrect", feedback: w.feedback, tag: w.tag, matchedConcept: w.concept.id };
  }
  let best: FreeTextGrade | null = null;
  for (const p of key.partial ?? []) {
    if (matchConcept(answer, p.concept).matched && (!best || p.credit > best.score)) {
      best = { score: p.credit, verdict: "partial", feedback: p.feedback, tag: "incomplete", matchedConcept: p.concept.id };
    }
  }
  if (best) return best;
  return {
    score: 0,
    verdict: "incorrect",
    feedback: "That answer did not match the expected concept or any accepted equivalent.",
    tag: "knowledge-gap",
  };
}

/** Escape-free plain text from content markup `[[id|text]]`. */
export function stripMarkup(s: string): string {
  return s.replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, "$2").replace(/\[\[([^\]]+)\]\]/g, "$1");
}

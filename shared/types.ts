// Core content and learner models.
// Content (curriculum, lessons, items, reference entries) is plain data validated by
// shared/schemas.ts. Hidden case state (content/cases) is imported by the server only.

// ---------------------------------------------------------------------------
// Evidence layer
// ---------------------------------------------------------------------------

export type SourceKind =
  | "guideline"
  | "consensus-criteria"
  | "trial"
  | "review"
  | "primary-research"
  | "lab-catalog"
  | "curriculum";

export interface Source {
  id: string;
  kind: SourceKind;
  /** Formatted citation exactly as published. */
  citation: string;
  title: string;
  authors: string;
  journal?: string;
  year: number;
  doi?: string;
  pmid?: string;
  url: string;
  /** ISO date the bibliographic details and URL were last checked. */
  lastVerified: string;
  /** How it was verified, plus any currency caveat (newer version exists, etc.). */
  verificationNote: string;
  /** False when we could not confirm details. Unverified sources are never shown as support. */
  verified: boolean;
}

/** Where a piece of content came from. */
export type Provenance = "source-grounded" | "synthetic" | "adapted-published";

/** Human review state. AI-authored content starts as "pending". */
export type ReviewState = "reviewed" | "pending" | "changes-requested";

export interface ContentMeta {
  id: string;
  /** Increment on any change to medical meaning. Attempts store the version they saw. */
  version: number;
  provenance: Provenance;
  review: ReviewState;
  /** Who drafted it. "ai-draft" means a model drafted it from the cited sources. */
  author: "ai-draft" | "human";
  sources: string[];
  /** ISO date sources were last checked against this content. */
  lastVerified: string;
  changelog?: { version: number; date: string; note: string }[];
}

// ---------------------------------------------------------------------------
// Curriculum
// ---------------------------------------------------------------------------

export const SKILLS = [
  "terminology",
  "localization",
  "mechanism",
  "history-exam",
  "differential",
  "investigation-selection",
  "interpretation",
  "emergency",
  "uncertainty",
] as const;
export type SkillId = (typeof SKILLS)[number];

export const SKILL_LABELS: Record<SkillId, string> = {
  terminology: "Medical terminology",
  localization: "Neuroanatomy and localization",
  mechanism: "Mechanisms and pathophysiology",
  "history-exam": "History and examination",
  differential: "Differential diagnosis",
  "investigation-selection": "Choosing investigations",
  interpretation: "Interpreting results",
  emergency: "Emergency recognition and management",
  uncertainty: "Uncertainty and limits of evidence",
};

export type Level = "foundation" | "clerkship" | "resident" | "advanced";

export interface Domain {
  id: string;
  title: string;
  group: "foundations" | "examination" | "clinical" | "advanced";
  order: number;
}

export type ModuleStatus = "complete" | "partial" | "planned";

export interface Objective {
  id: string;
  text: string;
  skill: SkillId;
}

export interface Module {
  id: string;
  title: string;
  domain: string;
  level: Level;
  summary: string;
  objectives: Objective[];
  prerequisites: string[];
  lessons: string[];
  /** Assessment items that can be used for a challenge (skip) test. */
  challengeItems: string[];
  skills: SkillId[];
  status: ModuleStatus;
  /** Estimated minutes to complete the instructional content. */
  minutes: number;
  meta: ContentMeta;
}

// ---------------------------------------------------------------------------
// Glossary
// ---------------------------------------------------------------------------

export interface Term {
  id: string;
  term: string;
  aliases?: string[];
  plain: string;
  medical: string;
  pronunciation?: string;
  example: string;
  moduleId?: string;
  related?: string[];
}

// ---------------------------------------------------------------------------
// Free-text answer matching
// ---------------------------------------------------------------------------

/**
 * A clinical concept with the phrasings that mean it. A pattern matches when all of
 * its tokens appear in the answer (typo tolerant, abbreviations expanded, negation aware).
 */
export interface Concept {
  id: string;
  label: string;
  patterns: string[];
}

export interface AnswerKey {
  /** Any of these earns full credit. */
  full: Concept[];
  /** Correct but incomplete (for example a syndrome when a mechanism was asked). */
  partial?: { concept: Concept; credit: number; feedback: string }[];
  /** More specific than the evidence supports. */
  overlySpecific?: { concept: Concept; credit: number; feedback: string }[];
  /** Common wrong answers with targeted feedback. */
  wrong?: { concept: Concept; tag: ErrorTag; feedback: string }[];
}

// ---------------------------------------------------------------------------
// Assessment items
// ---------------------------------------------------------------------------

export type ErrorTag =
  | "knowledge-gap"
  | "slip"
  | "terminology"
  | "misconception"
  | "weak-reasoning"
  | "overly-specific"
  | "incomplete"
  | "unsafe-priority";

export type ItemFormat =
  | "mcq"
  | "multi-select"
  | "free-text"
  | "localization"
  | "select-tests"
  | "order-priority";

export type Usage = "placement" | "lesson" | "review" | "challenge";

/** Schematic figure rendered by the client. Never presented as a patient study. */
export type Schematic =
  | { kind: "ncs"; pattern: "normal" | "demyelinating" | "axonal" | "conduction-block" }
  | { kind: "rns"; pattern: "normal" | "decrement" | "increment" }
  | { kind: "eeg"; pattern: "normal-alpha" | "focal-spikes" | "gspw-3hz" | "lpds" | "edb" | "seizure-evolution" | "diffuse-slowing" }
  | { kind: "csf-table"; rows: { analyte: string; value: string; ref: string; flag?: "H" | "L" }[] }
  | { kind: "eye-gaze"; finding: "left-ino" | "right-cn6" | "right-cn3" | "left-cn4" | "normal" }
  | { kind: "territory"; territory: "left-mca" | "right-mca" | "left-aca" | "left-pca" | "lacunar-left-ic" | "basilar" };

export interface ItemBase {
  id: string;
  version: number;
  format: ItemFormat;
  skill: SkillId;
  modules: string[];
  difficulty: 1 | 2 | 3;
  /**
   * Clinical presentation tag. Items with different presentations count as transfer
   * evidence; items sharing a `family` are variants and are not independent.
   */
  presentation: string;
  family?: string;
  usage: Usage[];
  /** Short vignette (optional) then the question. `[[term-id|shown text]]` marks glossary terms. */
  vignette?: string;
  stem: string;
  schematic?: Schematic;
  /** Feedback explaining the mechanism, shown after answering. */
  rationale: string;
  meta: ContentMeta;
}

export interface McqOption {
  id: string;
  text: string;
  correct?: boolean;
  tag?: ErrorTag;
  feedback?: string;
}

export interface McqItem extends ItemBase {
  format: "mcq";
  options: McqOption[];
  /** Optional follow-up asking which finding best supports the answer (reasoning check). */
  reasoning?: { stem: string; options: McqOption[] };
}

export interface MultiSelectItem extends ItemBase {
  format: "multi-select";
  options: McqOption[];
}

export interface FreeTextItem extends ItemBase {
  format: "free-text";
  answer: AnswerKey;
  /** What a model answer looks like, shown after grading. */
  modelAnswer: string;
  placeholder?: string;
}

export type NeuraxisRegion =
  | "cortex-left"
  | "cortex-right"
  | "subcortical-left"
  | "subcortical-right"
  | "midbrain"
  | "pons"
  | "medulla"
  | "cerebellum"
  | "cord-cervical"
  | "cord-thoracic"
  | "cord-lumbosacral"
  | "anterior-horn"
  | "root"
  | "plexus"
  | "peripheral-nerve"
  | "nmj"
  | "muscle";

export interface LocalizationItem extends ItemBase {
  format: "localization";
  correct: NeuraxisRegion[];
  partial?: { region: NeuraxisRegion; credit: number; feedback: string }[];
}

export type TestCategory = "necessary" | "reasonable" | "unnecessary" | "harmful";

export interface SelectTestsItem extends ItemBase {
  format: "select-tests";
  options: { id: string; label: string; category: TestCategory; why: string }[];
}

export interface OrderPriorityItem extends ItemBase {
  format: "order-priority";
  steps: { id: string; text: string }[];
  /** Correct order. Steps in the same inner array may occur in any order (parallel). */
  order: string[][];
}

export type AssessmentItem =
  | McqItem
  | MultiSelectItem
  | FreeTextItem
  | LocalizationItem
  | SelectTestsItem
  | OrderPriorityItem;

// ---------------------------------------------------------------------------
// Lessons
// ---------------------------------------------------------------------------

export type AnimationId =
  | "motor-pathway"
  | "nmj"
  | "conduction"
  | "vascular-territories"
  | "eye-movements"
  | "seizure-eeg";

export interface ExplainLayers {
  simpler?: string;
  mechanism?: string;
  compare?: string;
  deeper?: string;
}

export type LessonStep =
  | { kind: "hook"; title: string; body: string }
  | { kind: "explain"; title: string; body: string; layers?: ExplainLayers }
  | { kind: "animation"; title: string; animation: AnimationId; preset?: string; caption: string; task?: string }
  | { kind: "predict"; title: string; itemId: string }
  | { kind: "apply"; title: string; itemId: string }
  | { kind: "summary"; title: string; points: string[]; reviewItemIds: string[] };

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  /** The coherent concept this lesson teaches, in one sentence. */
  concept: string;
  minutes: number;
  steps: LessonStep[];
  meta: ContentMeta;
}

// ---------------------------------------------------------------------------
// Investigations (public catalog)
// ---------------------------------------------------------------------------

export type InvestigationCategory =
  | "bedside"
  | "blood"
  | "csf"
  | "microbiology"
  | "imaging"
  | "neurophysiology"
  | "autonomic"
  | "genetic"
  | "pathology"
  | "other";

export interface Analyte {
  name: string;
  unit: string;
  refRange: string;
  note?: string;
}

export interface Investigation {
  id: string;
  name: string;
  aliases: string[];
  category: InvestigationCategory;
  /** Members of a bundle; a bundle counts as one request in speed rounds. */
  bundle?: string[];
  question: string;
  indications: string;
  urgency: string;
  specimen: string;
  /** Typical turnaround used by the simulator, in minutes. */
  turnaroundMin: number;
  turnaroundNote: string;
  limitations: string;
  positiveMeans: string;
  negativeMeans: string;
  next: string;
  /** Relative resource cost, used to discourage indiscriminate ordering. */
  cost: 1 | 2 | 3 | 4;
  analytes?: Analyte[];
  labVariation?: string;
  /** Text returned by the simulator when a case lists this investigation as normal. */
  normalResult: string;
  normalValues?: ResultValue[];
  meta: ContentMeta;
}

// ---------------------------------------------------------------------------
// Antibody / autoimmune marker reference
// ---------------------------------------------------------------------------

export type EvidenceStrength = "established" | "probable" | "emerging" | "uncertain";
export type Availability = "clinical" | "limited-clinical" | "research-only";

export interface AntibodyEntry {
  id: string;
  name: string;
  aliases: string[];
  target: string;
  category: "neural-surface" | "neural-intracellular" | "neuromuscular" | "peripheral-nerve" | "demyelinating" | "systemic";
  phenotypes: string[];
  typical: string;
  unusual: string;
  findings: { exam?: string; mri?: string; eeg?: string; csf?: string };
  specimen: string;
  method: string;
  titerInterpretation: string;
  falsePositive: string;
  falseNegative: string;
  specificity: string;
  cancer: string;
  evidence: EvidenceStrength;
  availability: Availability;
  meta: ContentMeta;
}

// ---------------------------------------------------------------------------
// Cases (hidden state, server only) and their public summaries
// ---------------------------------------------------------------------------

export type EncounterMode = "full" | "emergency" | "speed" | "longitudinal" | "uncertainty";
export type EndpointType = "diagnosis" | "syndrome" | "ranked-differential" | "further-evaluation";

export interface HistoryFact {
  id: string;
  /** Intent ids from shared/dialogue.ts INTENTS. */
  intents: string[];
  /** Additional phrases that should trigger this fact. */
  patterns?: string[];
  /** What the patient (or informant) says, in lay language. */
  say: string;
  /** Clinician-language summary shown in the findings list. */
  finding: string;
  key?: boolean;
}

export interface ExamFinding {
  /** Maneuver id from shared/exam.ts. */
  maneuver: string;
  finding: string;
  abnormal: boolean;
  key?: boolean;
}

export interface ResultValue {
  analyte: string;
  value: string;
  unit?: string;
  ref?: string;
  flag?: "H" | "L" | "critical";
}

export interface CaseResult {
  investigation: string;
  summary: string;
  values?: ResultValue[];
  report?: string;
  schematic?: Schematic;
  /** Override catalog turnaround for this case. */
  turnaroundMin?: number;
  /** Shown in the debrief: what this result means here. */
  interpretation: string;
  abnormal: boolean;
  key?: boolean;
}

export interface UrgentAction {
  id: string;
  /** Action ids (shared/actions.ts) or investigation ids that satisfy this. */
  satisfiedBy: string[];
  label: string;
  /** Simulated minutes from encounter start. Missing means "before submission". */
  deadlineMin?: number;
  why: string;
  consequence: string;
}

export interface Deterioration {
  atMin: number;
  /** Prevented if any of these action ids were done before atMin. */
  preventedBy: string[];
  message: string;
  vitals?: string;
}

export interface CaseDef {
  id: string;
  version: number;
  /** Non-revealing label, for example "Case N3: sudden speech difficulty". */
  label: string;
  modes: EncounterMode[];
  difficulty: 1 | 2 | 3;
  /** Revealed only after submission. */
  modules: string[];
  provenance: Provenance;
  review: ReviewState;
  sources: string[];
  adaptation?: { source: string; license: string; altered: string[] };
  presentation: {
    age: number;
    sex: "female" | "male";
    setting: string;
    chiefComplaint: string;
    opening: string;
    vitals: string;
    /** Who answers questions. */
    speaker: "patient" | "family";
    speakerNote?: string;
  };
  history: HistoryFact[];
  /** Said when a recognized intent has no specific fact: a pertinent negative. */
  defaultNegative: string;
  exam: ExamFinding[];
  results: CaseResult[];
  /** Investigations explicitly normal for this case (catalog normal text is used). */
  normalInvestigations: string[];
  hidden: {
    endpoint: EndpointType;
    diagnosis: AnswerKey;
    diagnosisLabel: string;
    localization: { regions: NeuraxisRegion[]; explanation: string };
    /** Ids of history facts, exam maneuvers or results that support the conclusion. */
    keyFindings: string[];
    mustConsider: { concept: Concept; why: string }[];
    necessaryInvestigations: string[];
    reasonableInvestigations: string[];
    harmfulActions: { id: string; why: string }[];
    urgentActions: UrgentAction[];
    deteriorations?: Deterioration[];
    /** Words that would leak the answer in patient dialogue. */
    leakTerms: string[];
    interpretationChecks: { id: string; investigation: string; question: string; answer: AnswerKey; modelAnswer: string }[];
    teachingPoints: string[];
    /** For ranked-differential or further-evaluation endpoints. */
    acceptableNextSteps?: Concept[];
    rankedRequired?: Concept[];
  };
  speed?: {
    presentation: string;
    highYield: string[];
    explanation: string;
  };
  visits?: {
    id: string;
    label: string;
    intervalNote: string;
    update: string;
    question: { stem: string; answer: AnswerKey; modelAnswer: string };
  }[];
}

/** What the client sees before submission. Contains nothing from `hidden`. */
export interface CaseSummary {
  id: string;
  label: string;
  modes: EncounterMode[];
  difficulty: 1 | 2 | 3;
  provenance: Provenance;
  review: ReviewState;
  age: number;
  sex: "female" | "male";
  setting: string;
  chiefComplaint: string;
  adaptationSource?: string;
}

// ---------------------------------------------------------------------------
// Learner state (client persisted, synced to server)
// ---------------------------------------------------------------------------

export type Confidence = "sure" | "think" | "guess" | "idk";

export interface Attempt {
  id: string;
  itemId: string;
  itemVersion: number;
  context: "placement" | "lesson" | "review" | "challenge" | "case" | "speed";
  ts: number;
  score: number;
  correct: boolean;
  confidence: Confidence;
  tag?: ErrorTag;
  selfReport?: "didnt-know" | "slip" | "mixed-terms" | "guessed";
  hintsUsed: number;
  durationMs: number;
  skill: SkillId;
  modules: string[];
  presentation: string;
  family?: string;
  /** Snapshot so the attempt stays interpretable after content changes. */
  answerSummary: string;
  keySummary: string;
  /** For case attempts: separate dimension scores. */
  dimensions?: Partial<Record<"diagnosis" | "reasoning" | "actions" | "investigations" | "interpretation" | "localization", number>>;
  transfer?: boolean;
}

export interface ReviewEntry {
  itemId: string;
  moduleId: string;
  box: number;
  dueAt: number;
  addedAt: number;
  lastReviewedAt?: number;
  reason: "lesson" | "missed" | "test-out" | "placement-gap" | "case";
  history: { ts: number; score: number }[];
}

export interface StarAward {
  star: 1 | 2 | 3;
  moduleId: string;
  earnedAt: number;
  evidence: string[];
  how: string;
}

export interface PlacementState {
  status: "in-progress" | "complete";
  startedAt: number;
  finishedAt?: number;
  answered: string[];
  current?: string;
  endedEarly?: boolean;
}

export interface ResumePoint {
  route: string;
  label: string;
  ts: number;
}

export interface LearnerSettings {
  sessionMinutes: 3 | 5 | 10 | 20 | 0;
  reducedMotion: "system" | "on" | "off";
  theme: "system" | "light" | "dark";
  textScale: 1 | 1.125 | 1.25;
  showTimers: boolean;
  clockOffsetDays: number;
  noticeAcknowledged: boolean;
}

export interface LearnerState {
  schemaVersion: 1;
  profileId: string;
  createdAt: number;
  updatedAt: number;
  settings: LearnerSettings;
  placement: PlacementState | null;
  attempts: Attempt[];
  reviews: Record<string, ReviewEntry>;
  stars: StarAward[];
  lessonProgress: Record<string, { step: number; completedAt?: number; lessonVersion: number }>;
  challenges: Record<string, { passed: boolean; ts: number; attemptIds: string[] }>;
  testedOut: string[];
  encounters: Record<string, { caseLabel: string; mode: EncounterMode; startedAt: number; submitted: boolean }>;
  resume: ResumePoint | null;
  activity: Record<string, { minutes: number; items: number }>;
}

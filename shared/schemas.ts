// Zod schemas for content that can be generated or proposed at runtime (AI-authored cases,
// antibody update proposals) and for learner state import. Anything generated must pass
// these schemas and the semantic validators before it can even be stored as a draft.

import { z } from "zod";

const regions = z.enum([
  "cortex-left", "cortex-right", "subcortical-left", "subcortical-right", "midbrain", "pons", "medulla", "cerebellum",
  "cord-cervical", "cord-thoracic", "cord-lumbosacral", "anterior-horn", "root", "plexus", "peripheral-nerve", "nmj", "muscle",
]);

export const conceptSchema = z.object({ id: z.string().min(1), label: z.string().min(1), patterns: z.array(z.string().min(1)).min(1) });

const errorTag = z.enum(["knowledge-gap", "slip", "terminology", "misconception", "weak-reasoning", "overly-specific", "incomplete", "unsafe-priority"]);

export const answerKeySchema = z.object({
  full: z.array(conceptSchema).min(1),
  partial: z.array(z.object({ concept: conceptSchema, credit: z.number().min(0).max(1), feedback: z.string() })).optional(),
  overlySpecific: z.array(z.object({ concept: conceptSchema, credit: z.number().min(0).max(1), feedback: z.string() })).optional(),
  wrong: z.array(z.object({ concept: conceptSchema, tag: errorTag, feedback: z.string() })).optional(),
});

const resultValue = z.object({ analyte: z.string(), value: z.string(), unit: z.string().optional(), ref: z.string().optional(), flag: z.enum(["H", "L", "critical"]).optional() });

export const caseSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  version: z.number().int().min(1),
  label: z.string().min(3),
  modes: z.array(z.enum(["full", "emergency", "speed", "longitudinal", "uncertainty"])).min(1),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  modules: z.array(z.string()),
  provenance: z.enum(["source-grounded", "synthetic", "adapted-published"]),
  review: z.enum(["reviewed", "pending", "changes-requested"]),
  sources: z.array(z.string()),
  presentation: z.object({
    age: z.number().int().min(0).max(110),
    sex: z.enum(["female", "male"]),
    setting: z.string(),
    chiefComplaint: z.string(),
    opening: z.string(),
    vitals: z.string(),
    speaker: z.enum(["patient", "family"]),
    speakerNote: z.string().optional(),
  }),
  history: z.array(z.object({ id: z.string(), intents: z.array(z.string()), patterns: z.array(z.string()).optional(), say: z.string(), finding: z.string(), key: z.boolean().optional() })).min(3),
  defaultNegative: z.string(),
  exam: z.array(z.object({ maneuver: z.string(), finding: z.string(), abnormal: z.boolean(), key: z.boolean().optional() })),
  results: z.array(
    z.object({
      investigation: z.string(),
      summary: z.string(),
      values: z.array(resultValue).optional(),
      report: z.string().optional(),
      turnaroundMin: z.number().optional(),
      interpretation: z.string(),
      abnormal: z.boolean(),
      key: z.boolean().optional(),
    }),
  ),
  normalInvestigations: z.array(z.string()),
  hidden: z.object({
    endpoint: z.enum(["diagnosis", "syndrome", "ranked-differential", "further-evaluation"]),
    diagnosis: answerKeySchema,
    diagnosisLabel: z.string(),
    localization: z.object({ regions: z.array(regions), explanation: z.string() }),
    keyFindings: z.array(z.string()),
    mustConsider: z.array(z.object({ concept: conceptSchema, why: z.string() })),
    necessaryInvestigations: z.array(z.string()),
    reasonableInvestigations: z.array(z.string()),
    harmfulActions: z.array(z.object({ id: z.string(), why: z.string() })),
    urgentActions: z.array(z.object({ id: z.string(), satisfiedBy: z.array(z.string()), label: z.string(), deadlineMin: z.number().optional(), why: z.string(), consequence: z.string() })),
    deteriorations: z.array(z.object({ atMin: z.number(), preventedBy: z.array(z.string()), message: z.string(), vitals: z.string().optional() })).optional(),
    leakTerms: z.array(z.string()).min(1),
    interpretationChecks: z.array(z.object({ id: z.string(), investigation: z.string(), question: z.string(), answer: answerKeySchema, modelAnswer: z.string() })),
    teachingPoints: z.array(z.string()).min(1),
    acceptableNextSteps: z.array(conceptSchema).optional(),
    rankedRequired: z.array(conceptSchema).optional(),
  }),
  speed: z.object({ presentation: z.string(), highYield: z.array(z.string()), explanation: z.string() }).optional(),
});

export const antibodyProposalSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  aliases: z.array(z.string()),
  target: z.string(),
  category: z.enum(["neural-surface", "neural-intracellular", "neuromuscular", "peripheral-nerve", "demyelinating", "systemic"]),
  phenotypes: z.array(z.string()).min(1),
  typical: z.string(),
  unusual: z.string(),
  findings: z.object({ exam: z.string().optional(), mri: z.string().optional(), eeg: z.string().optional(), csf: z.string().optional() }),
  specimen: z.string(),
  method: z.string(),
  titerInterpretation: z.string(),
  falsePositive: z.string(),
  falseNegative: z.string(),
  specificity: z.string(),
  cancer: z.string(),
  evidence: z.enum(["established", "probable", "emerging", "uncertain"]),
  availability: z.enum(["clinical", "limited-clinical", "research-only"]),
  /** Evidence offered for the proposal: registry source ids or URLs that a reviewer must verify. */
  evidenceCited: z.array(z.string()).min(1),
  changeSummary: z.string(),
});

export const patientReplySchema = z.object({
  reply: z.string().min(1).max(600),
  usedFactIds: z.array(z.string()),
});

export const equivalenceSchema = z.object({
  equivalentConceptId: z.string().nullable(),
  confidence: z.enum(["high", "medium", "low"]),
  rationale: z.string().max(400),
});

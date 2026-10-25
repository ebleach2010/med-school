import type { EncounterMode, ResultValue, Schematic } from "../../shared/types";

export interface EncEvent {
  t: number;
  kind: "presentation" | "learner" | "patient" | "exam" | "order" | "result" | "action" | "system" | "ddx" | "warning";
  text: string;
  ref?: string;
  abnormal?: boolean;
  values?: ResultValue[];
  schematic?: Schematic;
  report?: string;
  ai?: boolean;
}

export interface DimensionResult {
  score: number;
  weight: number;
  summary: string;
  details: string[];
}

export interface EncounterGrade {
  overall: number;
  dimensions: Record<"diagnosis" | "localization" | "reasoning" | "actions" | "investigations" | "interpretation", DimensionResult>;
  diagnosisVerdict: string;
  debrief: {
    diagnosisLabel: string;
    endpoint: string;
    localization: string;
    teachingPoints: string[];
    keyFindings: { id: string; text: string; discovered: boolean; cited: boolean }[];
    mustConsider: { label: string; why: string; considered: boolean }[];
    urgent: { label: string; met: boolean; at?: number; deadline?: number; why: string; consequence: string }[];
    harmful: { label: string; why: string }[];
    investigations: { id: string; name: string; category: string; ordered: boolean }[];
    interpretation: { question: string; answer: string; modelAnswer: string; score: number; feedback: string }[];
    results: { investigation: string; name: string; interpretation: string }[];
    speedExplanation?: string;
    highYield?: string[];
    provenance: string;
    sources: string[];
    modules: string[];
  };
  simMinutes: number;
  fastForwardMinutes: number;
  notes: string[];
}

export interface EncounterView {
  id: string;
  caseId?: string;
  mode: EncounterMode;
  status: "active" | "interpreting" | "submitted";
  simMinutes: number;
  fastForwardMinutes: number;
  case: {
    label: string;
    age: number;
    sex: string;
    setting: string;
    chiefComplaint: string;
    speaker: "patient" | "family";
    speakerNote?: string;
    provenance: "source-grounded" | "synthetic" | "adapted-published";
    review: "reviewed" | "pending" | "changes-requested";
    adaptation?: { source: string; license: string; altered: string[] };
    hasVisits: boolean;
  };
  events: EncEvent[];
  pendingOrders: { inv: string; readyAt: number }[];
  actions: { id: string; at: number }[];
  ddx: { label: string; rank: number }[];
  requestsUsed: number;
  requestLimit: number | null;
  findings: { id: string; text: string; source: "history" | "exam" | "result" }[];
  interpretation?: { id: string; question: string; result: { text: string; values?: ResultValue[]; schematic?: Schematic; report?: string }; orderedByLearner: boolean }[];
  grade?: EncounterGrade;
  modules?: string[];
  visits?: { id: string; label: string }[];
  note?: string;
}

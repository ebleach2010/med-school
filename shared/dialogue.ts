// Rule-based patient dialogue for demo mode (and as a fallback when the AI provider fails).
// The patient only "knows" history facts written in the patient's voice. Examination
// findings and investigation results are never available to the patient.

import type { CaseDef, HistoryFact } from "./types";
import { tokenize, tokenMatches } from "./text";

export interface Intent {
  id: string;
  label: string;
  group: "presenting" | "neuro" | "systemic" | "background";
  /** Canned question used by structured history chips. */
  ask: string;
  patterns: string[];
}

export const INTENTS: Intent[] = [
  // Presenting complaint
  { id: "onset", label: "Onset", group: "presenting", ask: "When and how did this start?", patterns: ["when start", "when did", "how long", "start", "began", "begin", "onset", "first notice", "sudden", "gradual", "how did it come on", "what time"] },
  { id: "course", label: "Course", group: "presenting", ask: "Has it been getting better, worse, or staying the same?", patterns: ["worse", "better", "progress", "changed since", "come and go", "constant", "same since", "getting", "evolv", "spread"] },
  { id: "fatigability", label: "Fatigability", group: "presenting", ask: "Is it worse after activity or at the end of the day?", patterns: ["end of day", "evening", "tire", "tired", "fatigue", "after exercise", "after activity", "rest", "repeated use", "worse with use", "worse later"] },
  { id: "triggers", label: "Triggers and relievers", group: "presenting", ask: "Does anything bring it on or make it better?", patterns: ["trigger", "bring on", "makes worse", "makes better", "relieve", "help", "position", "cough", "strain"] },
  { id: "previous-episodes", label: "Previous episodes", group: "presenting", ask: "Has anything like this happened before?", patterns: ["before", "previous", "happened before", "ever had", "prior episode", "first time", "similar"] },
  // Neurological symptoms
  { id: "weakness", label: "Weakness", group: "neuro", ask: "Have you noticed any weakness?", patterns: ["weak", "strength", "cant lift", "lift", "drop thing", "legs give way", "climb stairs", "stand up from chair", "comb hair", "grip", "paralys"] },
  { id: "numbness", label: "Numbness or tingling", group: "neuro", ask: "Any numbness or tingling?", patterns: ["numb", "tingl", "pins and needles", "sensation", "burning", "feel things", "cant feel"] },
  { id: "speech", label: "Speech", group: "neuro", ask: "Any trouble speaking or finding words?", patterns: ["speech", "speak", "talk", "word", "slur", "understand", "language"] },
  { id: "swallowing", label: "Swallowing", group: "neuro", ask: "Any trouble swallowing or choking?", patterns: ["swallow", "chok", "food stuck", "cough when eating", "drink come out nose"] },
  { id: "breathing", label: "Breathing", group: "neuro", ask: "Any shortness of breath?", patterns: ["breath", "breathing", "short of breath", "lying flat", "air"] },
  { id: "vision", label: "Vision", group: "neuro", ask: "Any change in your vision?", patterns: ["vision", "see", "sight", "blur", "blind", "eye pain", "visual"] },
  { id: "double-vision", label: "Double vision", group: "neuro", ask: "Any double vision?", patterns: ["double vision", "seeing double", "diplopia", "two image", "double"] },
  { id: "eyelid", label: "Eyelids", group: "neuro", ask: "Any drooping of your eyelids?", patterns: ["eyelid", "lid", "droop eye", "ptosis"] },
  { id: "face", label: "Face", group: "neuro", ask: "Any weakness or droop of the face?", patterns: ["face", "facial", "smile", "mouth droop", "drool"] },
  { id: "chewing", label: "Chewing", group: "neuro", ask: "Any trouble chewing?", patterns: ["chew", "jaw tire", "jaw"] },
  { id: "headache", label: "Headache", group: "neuro", ask: "Any headache?", patterns: ["headache", "head pain", "head hurt", "head ache", "migraine"] },
  { id: "dizziness", label: "Dizziness or balance", group: "neuro", ask: "Any dizziness, spinning, or imbalance?", patterns: ["dizzy", "vertigo", "spin", "balance", "unsteady", "off balance", "lightheaded"] },
  { id: "hearing", label: "Hearing", group: "neuro", ask: "Any change in hearing or ringing in the ears?", patterns: ["hearing", "hear", "ringing", "tinnitus", "ear"] },
  { id: "consciousness", label: "Loss of consciousness", group: "neuro", ask: "Did you pass out or lose consciousness?", patterns: ["pass out", "faint", "black out", "lose consciousness", "collapse", "unresponsive", "knocked out"] },
  { id: "seizure", label: "Seizures", group: "neuro", ask: "Any seizures, shaking, or jerking episodes?", patterns: ["seizure", "fit", "shak", "convuls", "jerk", "stare spell", "bite tongue", "wet yourself"] },
  { id: "confusion", label: "Confusion or memory", group: "neuro", ask: "Any confusion or memory problems?", patterns: ["confus", "memory", "forget", "disorient", "think clearly", "mixed up"] },
  { id: "behavior", label: "Behavior and mood", group: "neuro", ask: "Any change in mood, behavior, or perception?", patterns: ["behav", "personality", "mood", "psych", "hallucin", "acting", "paranoi", "agitat", "anxious", "depress", "strange", "seeing things", "hearing voices"] },
  { id: "movements", label: "Involuntary movements", group: "neuro", ask: "Any tremor, twitching, or movements you can't control?", patterns: ["tremor", "twitch", "involuntary", "movement", "fidget", "rigid", "slowness", "grimac"] },
  { id: "coordination", label: "Coordination", group: "neuro", ask: "Any clumsiness or coordination problems?", patterns: ["clums", "coordinat", "miss", "drop thing", "handwriting"] },
  { id: "bladder-bowel", label: "Bladder and bowel", group: "neuro", ask: "Any change in bladder or bowel control?", patterns: ["bladder", "urin", "pee", "bowel", "incontinen", "constipat", "retention", "toilet", "pass water"] },
  { id: "back-pain", label: "Back or neck pain", group: "neuro", ask: "Any back or neck pain?", patterns: ["back pain", "back hurt", "spine", "back", "neck pain"] },
  { id: "pain", label: "Pain", group: "neuro", ask: "Are you in pain anywhere?", patterns: ["pain", "hurt", "ache", "sore"] },
  // Systemic
  { id: "fever", label: "Fever", group: "systemic", ask: "Any fever, chills, or sweats?", patterns: ["fever", "temperature", "hot", "chill", "sweat", "rigor", "shiver"] },
  { id: "neck-stiffness", label: "Neck stiffness", group: "systemic", ask: "Any neck stiffness?", patterns: ["neck stiff", "stiff neck", "neck"] },
  { id: "photophobia", label: "Light sensitivity", group: "systemic", ask: "Does light bother your eyes?", patterns: ["light", "bright", "photophobia"] },
  { id: "nausea", label: "Nausea or vomiting", group: "systemic", ask: "Any nausea or vomiting?", patterns: ["nause", "vomit", "throw up", "sick to stomach"] },
  { id: "rash", label: "Rash", group: "systemic", ask: "Any rash or skin changes?", patterns: ["rash", "skin", "spot", "bruis"] },
  { id: "weight", label: "Weight and appetite", group: "systemic", ask: "Any weight loss or change in appetite?", patterns: ["weight", "appetite", "eating", "lost weight"] },
  { id: "recent-illness", label: "Recent illness", group: "systemic", ask: "Have you been unwell recently, for example a cold or stomach bug?", patterns: ["recent illness", "recently ill", "been ill", "been sick", "unwell", "infection", "cold", "flu", "diarrh", "stomach bug", "sick recently", "sore throat", "cough"] },
  { id: "sleep", label: "Sleep", group: "systemic", ask: "How have you been sleeping?", patterns: ["sleep", "insomnia", "awake at night", "nap"] },
  { id: "autonomic", label: "Autonomic symptoms", group: "systemic", ask: "Any lightheadedness on standing, palpitations, or sweating changes?", patterns: ["lightheaded stand", "palpitat", "heart rac", "sweating change", "dry mouth"] },
  // Background
  { id: "pmh", label: "Past medical history", group: "background", ask: "Do you have any medical conditions?", patterns: ["medical history", "past history", "health problem", "condition", "illness", "diabetes", "blood pressure", "hypertension", "heart", "cancer", "surgery", "operation"] },
  { id: "meds", label: "Medications", group: "background", ask: "What medications do you take?", patterns: ["medication", "medicine", "pill", "prescription", "take anything", "blood thinner", "anticoagul", "warfarin", "aspirin", "drug you take", "tablet"] },
  { id: "allergies", label: "Allergies", group: "background", ask: "Any allergies?", patterns: ["allerg"] },
  { id: "family", label: "Family history", group: "background", ask: "Does anything run in your family?", patterns: ["family", "parent", "relative", "run in", "mother", "father", "sibling", "brother", "sister"] },
  { id: "social", label: "Work and home", group: "background", ask: "Tell me about your work and home life.", patterns: ["work", "job", "live", "home", "occupation", "student", "retired"] },
  { id: "alcohol", label: "Alcohol", group: "background", ask: "How much alcohol do you drink?", patterns: ["alcohol", "drink", "beer", "wine", "spirits"] },
  { id: "smoking", label: "Smoking", group: "background", ask: "Do you smoke?", patterns: ["smok", "cigarette", "tobacco", "vape"] },
  { id: "recreational-drugs", label: "Recreational drugs", group: "background", ask: "Do you use any recreational drugs?", patterns: ["recreational", "cocaine", "cannabis", "marijuana", "heroin", "street drug", "inject", "amphetamine", "use drug", "drug use", "do drug", "take drug", "nitrous"] },
  { id: "travel", label: "Travel", group: "background", ask: "Any recent travel?", patterns: ["travel", "abroad", "trip", "overseas"] },
  { id: "pregnancy", label: "Pregnancy", group: "background", ask: "Is there any chance you could be pregnant?", patterns: ["pregnan", "period", "contracept"] },
  { id: "immunization", label: "Vaccinations", group: "background", ask: "Are your vaccinations up to date?", patterns: ["vaccin", "immuniz", "shot"] },
  { id: "contacts", label: "Sick contacts", group: "background", ask: "Has anyone around you been unwell?", patterns: ["sick contact", "anyone else", "contact", "around you", "household", "dorm"] },
  { id: "trauma", label: "Injury", group: "background", ask: "Any recent fall or injury?", patterns: ["fall", "fell", "injur", "hit head", "accident", "trauma", "bang"] },
  { id: "concerns", label: "Concerns", group: "background", ask: "What are you most worried about?", patterns: ["worried", "concern", "what do you think", "afraid", "expect"] },
];

/** Questions a patient cannot answer from lived experience. */
const CLINICAL_KNOWLEDGE = [
  "mri", "ct", "scan result", "reflex", "antibod", "lab result", "blood result", "test result", "csf", "eeg", "emg", "nerve conduction", "biopsy result", "your diagnosis", "what disease", "babinski", "plantar", "titer", "white cell", "protein level",
];

export const INTENT_BY_ID = new Map(INTENTS.map((i) => [i.id, i]));

function patternScore(tokens: string[], pattern: string): number {
  const ptoks = tokenize(pattern);
  if (!ptoks.length) return 0;
  for (const pt of ptoks) {
    if (!tokens.some((t) => t === pt || (pt.length >= 4 && t.startsWith(pt)) || tokenMatches(t, pt))) return 0;
  }
  return ptoks.length;
}

export interface IntentMatch {
  id: string;
  score: number;
}

export function classify(question: string): { intents: IntentMatch[]; clinicalKnowledge: boolean } {
  const tokens = tokenize(question);
  const scores: IntentMatch[] = [];
  for (const intent of INTENTS) {
    let best = 0;
    for (const p of intent.patterns) best = Math.max(best, patternScore(tokens, p));
    if (best > 0) scores.push({ id: intent.id, score: best });
  }
  scores.sort((a, b) => b.score - a.score);
  const clinicalKnowledge = CLINICAL_KNOWLEDGE.some((p) => patternScore(tokens, p) > 0);
  // Keep strong matches; a generic "pain" match is dropped if something more specific matched.
  const top = scores.filter((s, i) => i === 0 || s.score >= Math.max(1, scores[0].score - 1)).slice(0, 3);
  const filtered = top.length > 1 ? top.filter((s) => s.id !== "pain") : top;
  return { intents: filtered, clinicalKnowledge };
}

export interface PatientReply {
  text: string;
  factIds: string[];
  intents: string[];
  kind: "facts" | "negative" | "unknown" | "clinical-knowledge";
}

function factMatchesQuestion(fact: HistoryFact, question: string): number {
  if (!fact.patterns?.length) return 0;
  const tokens = tokenize(question);
  let best = 0;
  for (const p of fact.patterns) best = Math.max(best, patternScore(tokens, p));
  return best;
}

/**
 * Answer a free-text question using only patient-knowable facts. Unrecognized questions get
 * a neutral "not sure what you mean" rather than a fabricated answer.
 */
export function answerQuestion(c: Pick<CaseDef, "history" | "defaultNegative" | "presentation">, question: string): PatientReply {
  const { intents, clinicalKnowledge } = classify(question);
  const byPattern = c.history
    .map((f) => ({ f, s: factMatchesQuestion(f, question) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.f);
  const intentIds = intents.map((i) => i.id);
  const byIntent = c.history.filter((f) => f.intents.some((i) => intentIds.includes(i)));
  const facts = [...new Map([...byPattern, ...byIntent].map((f) => [f.id, f])).values()].slice(0, 3);

  if (facts.length) {
    return { text: facts.map((f) => f.say).join(" "), factIds: facts.map((f) => f.id), intents: intentIds, kind: "facts" };
  }
  if (clinicalKnowledge) {
    const who = c.presentation.speaker === "family" ? "We don't" : "I don't";
    return {
      text: `${who} know anything about results like that. You would need to examine or test for it.`,
      factIds: [],
      intents: intentIds,
      kind: "clinical-knowledge",
    };
  }
  if (intents.length) {
    return { text: c.defaultNegative, factIds: [], intents: intentIds, kind: "negative" };
  }
  return {
    text: c.presentation.speaker === "family" ? "Sorry, I'm not sure what you're asking. Could you put it another way?" : "Sorry, I'm not sure what you mean. Could you ask that another way?",
    factIds: [],
    intents: [],
    kind: "unknown",
  };
}

/** Replace any leaked answer terms; used to screen AI-generated patient replies. */
export function containsLeak(text: string, leakTerms: string[]): string | null {
  const tokens = tokenize(text);
  for (const term of leakTerms) {
    const ttoks = tokenize(term);
    if (ttoks.length && ttoks.every((tt) => tokens.some((t) => t === tt || (tt.length >= 6 && tokenMatches(t, tt))))) return term;
  }
  return null;
}

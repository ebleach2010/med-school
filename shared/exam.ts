// Examination maneuvers available in the simulator. Cases define abnormal findings; any
// maneuver a case does not define returns its normal text (the case author asserts it is
// normal). Each maneuver costs simulated time.

export interface Maneuver {
  id: string;
  group: ExamGroup;
  label: string;
  normal: string;
  minutes: number;
  /** What this maneuver tests, shown on hover/long-press to teach the exam. */
  tests: string;
}

export type ExamGroup =
  | "general"
  | "mental-status"
  | "meningeal"
  | "cranial-nerves"
  | "motor"
  | "reflexes"
  | "sensory"
  | "coordination"
  | "gait"
  | "special";

export const EXAM_GROUP_LABELS: Record<ExamGroup, string> = {
  general: "General",
  "mental-status": "Mental status",
  meningeal: "Meningeal signs",
  "cranial-nerves": "Cranial nerves",
  motor: "Motor",
  reflexes: "Reflexes",
  sensory: "Sensory",
  coordination: "Coordination",
  gait: "Gait and balance",
  special: "Special tests",
};

export const MANEUVERS: Maneuver[] = [
  { id: "general-appearance", group: "general", label: "General appearance", normal: "Comfortable, well perfused, no distress.", minutes: 1, tests: "Overall illness severity, distress, perfusion." },
  { id: "skin", group: "general", label: "Skin inspection", normal: "No rash, petechiae, or skin lesions.", minutes: 1, tests: "Rash (for example petechiae in meningococcal disease), stigmata of systemic disease." },
  { id: "cardiac", group: "general", label: "Heart and pulse", normal: "Regular rhythm, no murmur.", minutes: 1, tests: "Atrial fibrillation or murmur as a source of embolism." },
  { id: "orthostatic-vitals", group: "general", label: "Lying and standing blood pressure", normal: "No orthostatic drop in blood pressure.", minutes: 3, tests: "Orthostatic hypotension (a fall of at least 20 systolic or 10 diastolic within 3 minutes of standing)." },
  { id: "spine-tenderness", group: "general", label: "Spinal tenderness", normal: "No spinal tenderness or deformity.", minutes: 1, tests: "Focal tenderness suggesting fracture, infection, or tumor." },

  { id: "consciousness", group: "mental-status", label: "Level of consciousness (GCS)", normal: "Alert. GCS 15 (E4 V5 M6).", minutes: 1, tests: "Arousal and responsiveness using the Glasgow Coma Scale." },
  { id: "orientation", group: "mental-status", label: "Orientation", normal: "Oriented to person, place, and time.", minutes: 1, tests: "Orientation, a coarse screen of attention and memory." },
  { id: "attention", group: "mental-status", label: "Attention", normal: "Months of the year backward without error.", minutes: 1, tests: "Sustained attention. Impaired in delirium." },
  { id: "memory", group: "mental-status", label: "Short-term memory", normal: "Recalls 3 of 3 words at 5 minutes.", minutes: 2, tests: "Encoding and recall (hippocampal and limbic function)." },
  { id: "language", group: "mental-status", label: "Language (fluency, comprehension, naming, repetition)", normal: "Fluent speech, follows commands, names and repeats normally.", minutes: 2, tests: "Aphasia type: fluency (frontal), comprehension (temporal), repetition (perisylvian connections)." },
  { id: "neglect", group: "mental-status", label: "Neglect and extinction", normal: "No neglect. No extinction to double simultaneous stimulation.", minutes: 1, tests: "Hemispatial neglect, usually from nondominant (often right) parietal lesions." },
  { id: "speech-articulation", group: "mental-status", label: "Articulation (dysarthria)", normal: "Articulation clear.", minutes: 1, tests: "Dysarthria is a motor speech problem, distinct from aphasia (a language problem)." },

  { id: "neck-stiffness", group: "meningeal", label: "Neck stiffness", normal: "Neck supple.", minutes: 1, tests: "Meningeal irritation. Absence does not exclude meningitis." },
  { id: "kernig-brudzinski", group: "meningeal", label: "Kernig and Brudzinski signs", normal: "Kernig and Brudzinski signs negative.", minutes: 1, tests: "Meningeal irritation. Specific but insensitive." },

  { id: "visual-acuity", group: "cranial-nerves", label: "Visual acuity", normal: "Acuity 20/20 each eye.", minutes: 1, tests: "Optic nerve and anterior visual pathway (CN II)." },
  { id: "visual-fields", group: "cranial-nerves", label: "Visual fields", normal: "Full to confrontation.", minutes: 1, tests: "Field defects localize along the visual pathway." },
  { id: "pupils", group: "cranial-nerves", label: "Pupils", normal: "Equal, round, reactive to light. No relative afferent pupillary defect.", minutes: 1, tests: "Afferent (CN II) and efferent (CN III parasympathetic, sympathetic) pupil pathways." },
  { id: "fundoscopy", group: "cranial-nerves", label: "Fundoscopy", normal: "Sharp optic disc margins, spontaneous venous pulsations present.", minutes: 2, tests: "Papilledema (raised intracranial pressure), optic disc swelling or pallor." },
  { id: "eye-movements", group: "cranial-nerves", label: "Eye movements", normal: "Full eye movements, no nystagmus, no diplopia.", minutes: 1, tests: "CN III, IV, VI, internuclear (MLF) and supranuclear gaze pathways." },
  { id: "sustained-upgaze", group: "cranial-nerves", label: "Sustained upgaze (fatigability)", normal: "No ptosis or fatigue after 60 seconds of upgaze.", minutes: 2, tests: "Fatigable ptosis, typical of neuromuscular junction disorders." },
  { id: "facial-sensation", group: "cranial-nerves", label: "Facial sensation", normal: "Facial sensation intact in all three trigeminal divisions.", minutes: 1, tests: "Trigeminal nerve (CN V) and its brainstem nuclei." },
  { id: "facial-strength", group: "cranial-nerves", label: "Facial strength", normal: "Symmetric facial strength, including forehead.", minutes: 1, tests: "CN VII. Forehead sparing suggests a central (upper motor neuron) lesion." },
  { id: "hearing", group: "cranial-nerves", label: "Hearing", normal: "Hearing grossly intact bilaterally.", minutes: 1, tests: "CN VIII (cochlear)." },
  { id: "hints", group: "cranial-nerves", label: "Head impulse, nystagmus, test of skew (HINTS)", normal: "Not applicable: no acute vestibular syndrome. No nystagmus.", minutes: 3, tests: "Distinguishes peripheral from central causes in acute continuous vertigo with nystagmus." },
  { id: "palate", group: "cranial-nerves", label: "Palate and gag", normal: "Palate elevates symmetrically.", minutes: 1, tests: "CN IX and X." },
  { id: "tongue", group: "cranial-nerves", label: "Tongue", normal: "Tongue midline, no wasting or fasciculations.", minutes: 1, tests: "CN XII. Fasciculations suggest lower motor neuron disease." },
  { id: "neck-flexion", group: "cranial-nerves", label: "Neck flexion and shoulder shrug", normal: "Neck flexion and shoulder shrug full strength.", minutes: 1, tests: "Neck flexor weakness is common in neuromuscular disease; shrug tests CN XI." },

  { id: "inspection", group: "motor", label: "Inspection (wasting, fasciculations)", normal: "No wasting or fasciculations.", minutes: 1, tests: "Lower motor neuron signs." },
  { id: "tone", group: "motor", label: "Tone", normal: "Normal tone in all limbs.", minutes: 1, tests: "Spasticity (UMN, velocity dependent), rigidity (extrapyramidal), hypotonia (LMN, cerebellar, acute UMN)." },
  { id: "pronator-drift", group: "motor", label: "Pronator drift", normal: "No pronator drift.", minutes: 1, tests: "Subtle upper motor neuron weakness of the arm." },
  { id: "strength-arms", group: "motor", label: "Strength, arms", normal: "Power 5/5 throughout both arms.", minutes: 2, tests: "Pattern: pyramidal (extensors weaker in arms), proximal, distal, myotomal, or nerve territory." },
  { id: "strength-legs", group: "motor", label: "Strength, legs", normal: "Power 5/5 throughout both legs.", minutes: 2, tests: "Pattern: pyramidal (flexors weaker in legs), proximal, distal, myotomal, or nerve territory." },
  { id: "fatigable-weakness", group: "motor", label: "Repeated testing for fatigability", normal: "No fatigable weakness with repeated testing.", minutes: 2, tests: "Weakness that worsens with repetition suggests a neuromuscular junction disorder." },

  { id: "reflexes-arms", group: "reflexes", label: "Reflexes, arms", normal: "Biceps, triceps, brachioradialis 2+ and symmetric.", minutes: 1, tests: "Increased in UMN lesions; reduced or absent in LMN, root, nerve, or some NMJ disorders." },
  { id: "reflexes-legs", group: "reflexes", label: "Reflexes, legs", normal: "Knee and ankle 2+ and symmetric.", minutes: 1, tests: "Increased in UMN lesions; reduced or absent in neuropathy or radiculopathy." },
  { id: "plantar", group: "reflexes", label: "Plantar responses", normal: "Flexor (downgoing) bilaterally.", minutes: 1, tests: "An extensor plantar (Babinski sign) indicates corticospinal tract dysfunction." },
  { id: "hoffmann", group: "reflexes", label: "Hoffmann sign", normal: "Hoffmann sign absent.", minutes: 1, tests: "Upper motor neuron sign in the arm." },
  { id: "clonus", group: "reflexes", label: "Ankle clonus", normal: "No clonus.", minutes: 1, tests: "Sustained clonus indicates hyperreflexia from an upper motor neuron lesion." },
  { id: "jaw-jerk", group: "reflexes", label: "Jaw jerk", normal: "Jaw jerk not brisk.", minutes: 1, tests: "A brisk jaw jerk places an UMN lesion above the pons." },

  { id: "pinprick", group: "sensory", label: "Pinprick and temperature", normal: "Pinprick intact throughout.", minutes: 2, tests: "Spinothalamic pathway; pattern localizes (glove and stocking, dermatomal, level, hemibody)." },
  { id: "vibration-proprioception", group: "sensory", label: "Vibration and joint position", normal: "Vibration and joint position sense intact at toes.", minutes: 2, tests: "Dorsal column pathway and large fibers." },
  { id: "sensory-level", group: "sensory", label: "Search for a sensory level", normal: "No sensory level on the trunk.", minutes: 2, tests: "A horizontal level on the trunk localizes to the spinal cord." },
  { id: "saddle-sensation", group: "sensory", label: "Saddle sensation and anal tone", normal: "Saddle sensation intact; normal anal tone.", minutes: 2, tests: "Cauda equina and conus function." },

  { id: "finger-nose", group: "coordination", label: "Finger to nose", normal: "Accurate, no intention tremor.", minutes: 1, tests: "Limb ataxia from the ipsilateral cerebellar hemisphere. Interpret in light of weakness." },
  { id: "heel-shin", group: "coordination", label: "Heel to shin", normal: "Accurate bilaterally.", minutes: 1, tests: "Leg ataxia." },
  { id: "rapid-alternating", group: "coordination", label: "Rapid alternating movements", normal: "Normal rhythm and speed.", minutes: 1, tests: "Dysdiadochokinesia (cerebellar); slowing with decrement suggests bradykinesia." },

  { id: "gait", group: "gait", label: "Gait", normal: "Normal casual gait.", minutes: 1, tests: "Gait pattern: spastic, ataxic, steppage, waddling, parkinsonian, functional." },
  { id: "romberg", group: "gait", label: "Romberg", normal: "Romberg negative.", minutes: 1, tests: "Proprioceptive loss: steady eyes open, falls eyes closed." },
  { id: "tandem", group: "gait", label: "Tandem gait", normal: "Tandem gait normal.", minutes: 1, tests: "Midline cerebellar (vermis) function and balance." },

  { id: "single-breath-count", group: "special", label: "Single breath count", normal: "Counts to 30 in one breath.", minutes: 1, tests: "Bedside screen of respiratory muscle weakness. Pair with measured vital capacity." },
  { id: "involuntary-movements", group: "special", label: "Observe for involuntary movements", normal: "No involuntary movements.", minutes: 2, tests: "Tremor, chorea, dystonia, myoclonus, orofacial dyskinesias." },
  { id: "hoover", group: "special", label: "Hoover sign", normal: "Not applicable: no unilateral leg weakness.", minutes: 1, tests: "A positive diagnostic sign of functional leg weakness: hip extension returns during contralateral hip flexion." },
];

export const MANEUVER_BY_ID = new Map(MANEUVERS.map((m) => [m.id, m]));

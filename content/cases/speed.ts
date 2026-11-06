// Two-question speed-round cases. Synthetic vignettes, AI drafted, pending human review.
// Hidden state: imported by the server only.

import type { CaseDef, Concept } from "../../shared/types";

const c = (id: string, label: string, patterns: string[]): Concept => ({ id, label, patterns });

const NEG = "No, nothing like that.";
// Avoid the bare word "we": the matcher expands it to "wernicke encephalopathy".
const NEG_FAMILY = "No, nothing like that that I've noticed.";

// ---------------------------------------------------------------------------
// S1 Bell palsy
// ---------------------------------------------------------------------------
const sBell: CaseDef = {
  id: "s-bell",
  version: 1,
  label: "Speed S1: facial droop",
  modes: ["speed"],
  difficulty: 1,
  modules: ["f-localization"],
  provenance: "synthetic",
  review: "pending",
  sources: ["baugh2013-bells"],
  presentation: {
    age: 41,
    sex: "male",
    setting: "Primary care same-day appointment",
    chiefComplaint: "Right side of the face not moving properly",
    opening: "I woke up yesterday and the right side of my face just won't move properly. Drinks dribble out of the corner of my mouth.",
    vitals: "BP 128/78, HR 76, T 36.8 C, RR 14, SpO2 99% on room air",
    speaker: "patient",
  },
  history: [
    { id: "h-onset", intents: ["onset"], say: "I noticed it when I woke up yesterday morning. The day before, I had an ache behind my right ear.", finding: "Onset on waking, preceded by retroauricular ache", key: true },
    { id: "h-course", intents: ["course"], say: "It got worse over the first day or so, and since last night it seems to have stopped getting worse.", finding: "Progressed over about 36 hours, now plateaued" },
    { id: "h-face", intents: ["face", "eyelid"], patterns: ["taste", "eyebrow", "forehead", "close eye"], say: "The whole right side of my face is weak. I can't close my right eye properly or raise that eyebrow, drinks dribble out on the right, and food tastes a bit strange.", finding: "Whole right hemiface weakness including brow, incomplete eye closure, altered taste", key: true },
    { id: "h-eye", intents: ["vision"], say: "My right eye feels dry and gritty, but my vision is fine.", finding: "Right eye dryness, normal vision" },
    { id: "h-ear", intents: ["hearing", "pain"], say: "Apart from that ache behind my ear the day before, there's no real pain. Loud sounds seem oddly loud in my right ear, but I can hear fine.", finding: "Right hyperacusis, mild retroauricular pain" },
    { id: "h-background", intents: ["pmh", "meds", "allergies", "immunization"], say: "I'm healthy with no medical problems. I don't take any regular medicines, I have no allergies, and my vaccinations are up to date.", finding: "No past history, no medications" },
    { id: "h-social", intents: ["social", "alcohol", "smoking", "recreational-drugs", "concerns", "travel"], patterns: ["tick", "hiking", "camping", "woods"], say: "I teach high school. I don't smoke, I have a glass of wine at weekends, and I don't use drugs. No hiking, camping, or tick bites lately. I was terrified it was a stroke.", finding: "Teacher, no tick exposure; worried about stroke" },
  ],
  defaultNegative: NEG,
  exam: [
    { maneuver: "facial-strength", finding: "Right-sided weakness of the whole face, including the forehead: cannot raise the right eyebrow or wrinkle the right forehead, incomplete right eye closure with the eye rolling upward on attempted closure, flattened right nasolabial fold, and mouth drooping on the right.", abnormal: true, key: true },
    { maneuver: "skin", finding: "No vesicles in the right ear canal, on the auricle, or on the palate. No rash elsewhere.", abnormal: false, key: true },
  ],
  results: [
    { investigation: "poc-glucose", summary: "Glucose 104 mg/dL", values: [{ analyte: "Glucose", value: "104", unit: "mg/dL", ref: "70 to 140" }], interpretation: "Normal. Checking glucose is reasonable before corticosteroids, but it does not help make the diagnosis.", abnormal: false },
    { investigation: "mri-brain-gad", summary: "Mild enhancement of the right facial nerve; no mass, no infarct", report: "Mild smooth enhancement of the right facial nerve in the labyrinthine segment and geniculate ganglion. No mass in the internal auditory canal, cerebellopontine angle, or parotid. No infarct or demyelinating lesion.", interpretation: "Facial nerve enhancement is common and nonspecific in idiopathic facial palsy. Routine imaging is not recommended; reserve it for atypical features such as no recovery by about 3 months, other cranial nerve signs, or slow progression.", abnormal: true },
  ],
  normalInvestigations: ["ct-head", "mri-brain", "cbc", "bmp", "crp-esr", "hiv", "cta-head-neck", "lp-basic", "ecg"],
  hidden: {
    endpoint: "diagnosis",
    diagnosis: {
      full: [c("bell", "Bell palsy (idiopathic peripheral facial nerve palsy)", ["bell palsy", "bells palsy", "idiopathic facial nerve palsy", "idiopathic facial palsy", "idiopathic facial paralysis", "idiopathic peripheral facial", "idiopathic lower motor neuron facial", "idiopathic facial weakness", "idiopathic cn7 palsy", "idiopathic cranial nerve vii", "idiopathic cranial nerve 7", "idiopathic seventh nerve palsy"])],
      partial: [
        { concept: c("lmn-facial", "Peripheral (lower motor neuron) facial nerve palsy", ["facial nerve palsy", "peripheral facial palsy", "peripheral facial nerve", "lower motor neuron facial", "cn7 palsy", "cn vii palsy", "cranial nerve vii palsy", "cranial nerve 7 palsy", "seventh nerve palsy", "facial nerve paralysis", "facial nerve lesion", "facial palsy"]), credit: 0.75, feedback: "Right localization: weakness including the forehead is a lower motor neuron facial nerve lesion. With no vesicles, no other cranial nerve signs, and an abrupt onset, name the most likely cause: idiopathic (Bell) palsy." },
      ],
      overlySpecific: [
        { concept: c("hsv-facial", "Herpes simplex reactivation", ["herpes simplex", "hsv"]), credit: 0.5, feedback: "HSV reactivation is a proposed mechanism for Bell palsy, but it cannot be proven at the bedside and testing for it is not part of care. Name the clinical diagnosis: Bell palsy." },
      ],
      wrong: [
        { concept: c("stroke", "Stroke", ["stroke", "cva", "transient ischemic attack", "tia", "cerebral infarct", "central facial palsy", "upper motor neuron facial"]), tag: "misconception", feedback: "The forehead is weak. The upper face receives input from both hemispheres, so a central (upper motor neuron) lesion spares the forehead. Whole-face weakness with no limb signs points to the facial nerve itself." },
        { concept: c("ramsay", "Ramsay Hunt syndrome", ["ramsay hunt", "herpes zoster oticus", "zoster", "vzv"]), tag: "weak-reasoning", feedback: "Ramsay Hunt syndrome (VZV) causes severe ear pain and vesicles in the ear canal, auricle, or palate, often with hearing loss or vertigo. None were found here." },
        { concept: c("lyme", "Lyme disease", ["lyme", "borrelia"]), tag: "weak-reasoning", feedback: "Lyme disease is worth asking about, but there was no tick exposure, rash, or travel to an endemic area." },
        { concept: c("tn", "Trigeminal neuralgia", ["trigeminal"]), tag: "terminology", feedback: "The trigeminal nerve (CN V) carries facial sensation and powers chewing. Facial expression is CN VII." },
      ],
    },
    diagnosisLabel: "Bell palsy (idiopathic peripheral facial nerve palsy)",
    localization: { regions: ["peripheral-nerve"], explanation: "Right facial nerve (CN VII), peripheral to its brainstem nucleus, most likely within the narrow labyrinthine segment of the facial canal. Forehead involvement excludes a central lesion; hyperacusis and taste change place it proximal to the nerve to stapedius and chorda tympani." },
    keyFindings: ["facial-strength", "h-face", "h-onset", "skin"],
    mustConsider: [
      { concept: c("mc-stroke", "Stroke", ["stroke", "central facial"]), why: "A central lesion spares the forehead and usually has arm or speech involvement; check both before settling on a peripheral cause." },
      { concept: c("mc-ramsay", "Ramsay Hunt syndrome", ["ramsay hunt", "zoster"]), why: "Look in the ear and mouth for vesicles: VZV changes treatment and prognosis." },
      { concept: c("mc-lyme", "Lyme disease", ["lyme"]), why: "A common treatable cause of facial palsy (often bilateral) in endemic areas." },
      { concept: c("mc-tumor", "Tumor (parotid or skull base)", ["tumor", "parotid", "mass"]), why: "Slowly progressive palsy, recurrent ipsilateral palsy, or no recovery by 3 months needs imaging." },
    ],
    necessaryInvestigations: [],
    reasonableInvestigations: ["poc-glucose"],
    harmfulActions: [{ id: "thrombolysis", why: "This is a peripheral facial nerve palsy, not a stroke; thrombolysis carries bleeding risk with no benefit." }],
    urgentActions: [],
    leakTerms: ["Bell palsy", "Bell", "Bells palsy", "facial palsy", "facial nerve palsy", "idiopathic facial"],
    interpretationChecks: [],
    teachingPoints: [
      "Forehead involvement means a lower motor neuron facial nerve lesion; central lesions spare the forehead because the upper face has bilateral cortical input.",
      "Bell palsy is a clinical diagnosis: routine laboratory tests and imaging are not recommended in typical cases.",
      "Oral corticosteroids started within 72 hours improve recovery, and eye protection prevents corneal injury from incomplete closure.",
      "Look for vesicles (Ramsay Hunt), other cranial nerve signs, bilateral weakness, and slow progression: each points away from Bell palsy.",
    ],
  },
  speed: {
    presentation: "A 41-year-old man woke yesterday unable to move the right side of his face, and drinks now dribble from the right corner of his mouth. He had an ache behind the right ear the day before. He is otherwise well.",
    highYield: ["facial-strength", "skin", "pronator-drift"],
    explanation: "Weakness of the whole right face including the forehead indicates a lower motor neuron (facial nerve) lesion, because central lesions spare the bilaterally innervated forehead. Testing facial strength makes that distinction, while a look in the ear and mouth for vesicles (Ramsay Hunt) and a check for limb drift (stroke) exclude the main alternatives. With an abrupt onset and nothing else abnormal, the diagnosis is Bell palsy.",
  },
};

// ---------------------------------------------------------------------------
// S2 Internuclear ophthalmoplegia
// ---------------------------------------------------------------------------
const inoConcept = c("ino", "Internuclear ophthalmoplegia (MLF lesion)", ["internuclear ophthalmoplegia", "internuclear ophthalmoparesis", "ino", "medial longitudinal fasciculus", "mlf lesion", "mlf syndrome"]);
const demyelConcept = c("demyelination", "Demyelination suspected", ["demyelination", "demyelinating", "multiple sclerosis", "ms"]);
const sIno: CaseDef = {
  id: "s-ino",
  version: 1,
  label: "Speed S2: double vision",
  modes: ["speed"],
  difficulty: 2,
  modules: ["f-ocular-motor", "c-ms"],
  provenance: "synthetic",
  review: "pending",
  sources: ["montalban2025-mcdonald"],
  presentation: {
    age: 29,
    sex: "female",
    setting: "Neurology urgent clinic",
    chiefComplaint: "Seeing double for three days",
    opening: "For three days I've been seeing double, mostly when I look to the right.",
    vitals: "BP 116/72, HR 70, T 36.7 C, RR 14, SpO2 99% on room air",
    speaker: "patient",
  },
  history: [
    { id: "h-onset", intents: ["onset"], say: "It started three days ago. I noticed it over a morning, not in an instant.", finding: "Subacute onset over hours, 3 days ago" },
    { id: "h-course", intents: ["course", "triggers"], say: "It's about the same, maybe slightly worse. It seems a little worse after a hot bath.", finding: "Stable to slightly worse; heat sensitivity" },
    { id: "h-diplopia", intents: ["double-vision", "vision"], patterns: ["look", "looking", "one way", "direction", "side by side"], say: "The two images are side by side, and it's much worse when I look to the right. If I cover either eye it goes away. Looking straight ahead it's almost fine.", finding: "Binocular horizontal diplopia, worse on right gaze", key: true },
    { id: "h-prior", intents: ["previous-episodes", "numbness"], say: "Last year my right leg went tingly and numb for about three weeks and then settled on its own. I never saw anyone about it.", finding: "Possible prior sensory episode a year ago (historical, not objectively documented)", key: true },
    { id: "h-background", intents: ["pmh", "meds", "allergies", "immunization", "pregnancy"], say: "I'm healthy otherwise. I take the contraceptive pill and nothing else. No allergies, vaccinations up to date, and I'm not pregnant.", finding: "Oral contraceptive only" },
    { id: "h-social", intents: ["social", "alcohol", "smoking", "recreational-drugs", "concerns"], say: "I'm a graphic designer, so this is a real problem at work. I don't smoke, I drink socially, and I don't use drugs. I'm worried there's something serious going on in my brain.", finding: "Graphic designer; nonsmoker" },
  ],
  defaultNegative: NEG,
  exam: [
    { maneuver: "eye-movements", finding: "On rightward gaze the left eye fails to adduct fully, and the right (abducting) eye shows jerk nystagmus. Leftward gaze is full. Convergence is preserved. Vertical movements full. No ptosis.", abnormal: true, key: true },
    { maneuver: "hints", finding: "Not applicable: no acute vestibular syndrome. No spontaneous nystagmus in primary gaze; abducting nystagmus of the right eye on right gaze only. No skew deviation.", abnormal: true },
  ],
  results: [
    { investigation: "mri-brain-gad", summary: "Single enhancing lesion in the left dorsal pons", report: "A 6 mm ovoid T2/FLAIR hyperintense lesion in the left dorsal pontine tegmentum near the floor of the fourth ventricle, in the region of the medial longitudinal fasciculus, with ring-like enhancement. No other brain lesions.", interpretation: "Confirms a lesion of the left MLF and its inflammatory appearance suggests demyelination. A single lesion does not show dissemination in space, so multiple sclerosis cannot yet be diagnosed.", abnormal: true, key: true },
    { investigation: "mri-brain", summary: "Single lesion in the left dorsal pons", report: "A 6 mm ovoid T2/FLAIR hyperintense lesion in the left dorsal pontine tegmentum near the floor of the fourth ventricle. No other brain lesions. Contrast not given.", interpretation: "Localizes the syndrome to the left MLF. Contrast would show whether the lesion is active.", abnormal: true },
    { investigation: "csf-ocb", summary: "Four CSF-specific oligoclonal bands", report: "Four IgG oligoclonal bands present in CSF and absent in paired serum.", interpretation: "Intrathecal IgG synthesis supports an inflammatory demyelinating process, but bands alone do not establish multiple sclerosis.", abnormal: true },
    { investigation: "lp-basic", summary: "WBC 6/uL, protein 41 mg/dL, glucose normal", values: [{ analyte: "White cells", value: "6", unit: "/uL", ref: "0 to 5", flag: "H" }, { analyte: "Protein", value: "41", unit: "mg/dL", ref: "15 to 45" }, { analyte: "Glucose", value: "60", unit: "mg/dL", ref: "40 to 70" }], interpretation: "Mild lymphocytic pleocytosis, compatible with demyelination; markedly abnormal CSF would suggest an alternative such as infection or NMOSD.", abnormal: true },
  ],
  normalInvestigations: ["mri-spine", "aqp4-ab", "mog-ab", "achr-ab", "cbc", "bmp", "tsh", "b12-mma", "ct-head", "vep", "syphilis-serology", "hiv", "ana-ena", "pregnancy-test"],
  hidden: {
    endpoint: "syndrome",
    diagnosis: {
      full: [inoConcept],
      partial: [
        { concept: c("cis", "Clinically isolated syndrome", ["clinically isolated syndrome", "cis"]), credit: 0.75, feedback: "A reasonable frame, but name the syndrome and localization: a left internuclear ophthalmoplegia from a lesion of the left medial longitudinal fasciculus." },
        { concept: c("brainstem", "Brainstem lesion", ["brainstem lesion", "pontine lesion", "pons lesion", "brainstem demyelination", "demyelinating lesion", "demyelination"]), credit: 0.5, feedback: "Close: the lesion is in the brainstem, specifically the left medial longitudinal fasciculus, which produces an internuclear ophthalmoplegia (failed adduction of the left eye with abducting nystagmus of the right eye)." },
      ],
      overlySpecific: [
        { concept: c("ms", "Multiple sclerosis", ["multiple sclerosis", "ms", "relapsing remitting"]), credit: 0.5, feedback: "Demyelination is the leading suspicion in a young woman with an INO, but multiple sclerosis requires MRI evidence of dissemination in space (and time, or a supportive CSF or other biomarker) under the McDonald criteria, plus exclusion of mimics. From the bedside the supportable answer is the syndrome: left INO from an MLF lesion, demyelination suspected." },
      ],
      wrong: [
        { concept: c("cn6", "Sixth nerve palsy", ["sixth nerve", "abducens", "cn6", "cn vi", "cranial nerve vi", "cranial nerve 6", "lateral rectus"]), tag: "knowledge-gap", feedback: "In a sixth nerve palsy the eye fails to abduct. Here abduction is full; it is adduction of the left eye that fails, with nystagmus in the abducting right eye: an internuclear ophthalmoplegia." },
        { concept: c("cn3", "Third nerve palsy", ["third nerve", "oculomotor", "cn3", "cn iii", "cranial nerve iii", "cranial nerve 3"]), tag: "weak-reasoning", feedback: "A third nerve palsy would also impair elevation and depression and usually causes ptosis or a dilated pupil. Isolated adduction failure with preserved convergence is an INO." },
        { concept: c("mg", "Myasthenia gravis", ["myasthenia", "myasthenia gravis"]), tag: "weak-reasoning", feedback: "Myasthenia can mimic an INO, but look for fatigability and ptosis; preserved convergence and a pontine lesion point to a true MLF lesion." },
      ],
    },
    diagnosisLabel: "Left internuclear ophthalmoplegia from a left MLF lesion, demyelination suspected",
    localization: { regions: ["pons"], explanation: "Left medial longitudinal fasciculus in the dorsal pons, which carries signals from the right abducens nucleus to the left medial rectus subnucleus. An INO is named for the side of the eye that fails to adduct. Preserved convergence shows the medial rectus and third nerve are intact." },
    keyFindings: ["eye-movements", "h-diplopia", "mri-brain-gad", "h-prior"],
    mustConsider: [
      { concept: c("mc-ms", "Multiple sclerosis", ["multiple sclerosis", "ms", "demyelination"]), why: "The commonest cause of INO in young adults; requires MRI and McDonald criteria to diagnose." },
      { concept: c("mc-mg", "Myasthenia gravis", ["myasthenia"]), why: "Can produce a pseudo-INO; check for fatigable weakness and ptosis." },
      { concept: c("mc-stroke", "Brainstem stroke", ["stroke", "infarct"]), why: "The commonest cause of INO in older vascular patients, typically unilateral and abrupt." },
    ],
    necessaryInvestigations: ["mri-brain-gad"],
    reasonableInvestigations: ["mri-spine", "csf-ocb", "lp-basic", "aqp4-ab"],
    harmfulActions: [],
    urgentActions: [],
    leakTerms: ["internuclear ophthalmoplegia", "INO", "medial longitudinal fasciculus", "MLF", "multiple sclerosis", "MS", "demyelination", "demyelinating"],
    interpretationChecks: [],
    teachingPoints: [
      "An INO is failed adduction of the eye on the side of the MLF lesion, with nystagmus of the abducting opposite eye; convergence is usually preserved.",
      "In young adults INO is most often demyelinating, and bilateral INO is especially suggestive of multiple sclerosis; in older adults it is usually vascular.",
      "Multiple sclerosis is diagnosed with MRI evidence of dissemination and exclusion of mimics under the McDonald criteria, not from a single bedside sign.",
    ],
    rankedRequired: [inoConcept, demyelConcept],
  },
  speed: {
    presentation: "A 29-year-old woman has had double vision for three days, with two images side by side that are worse when she looks to the right. She is otherwise well and takes only the contraceptive pill.",
    highYield: ["eye-movements", "mri-brain-gad"],
    explanation: "Examining eye movements shows the left eye failing to adduct with nystagmus of the abducting right eye and preserved convergence: a left internuclear ophthalmoplegia from a lesion of the left medial longitudinal fasciculus. In a young woman demyelination is the leading cause, and contrast MRI confirms an active pontine lesion. A single lesion does not yet meet criteria for multiple sclerosis, so the supportable answer is the syndrome with demyelination suspected.",
  },
};

// ---------------------------------------------------------------------------
// S3 Pupil-involving third nerve palsy
// ---------------------------------------------------------------------------
const sCn3: CaseDef = {
  id: "s-cn3",
  version: 1,
  label: "Speed S3: droopy eyelid",
  modes: ["speed"],
  difficulty: 2,
  modules: ["f-ocular-motor"],
  provenance: "synthetic",
  review: "pending",
  sources: [],
  presentation: {
    age: 52,
    sex: "female",
    setting: "Emergency department",
    chiefComplaint: "Drooping right eyelid and pain behind the eye",
    opening: "My right eyelid has come down over the last day, and I've got a nasty pain behind that eye.",
    vitals: "BP 158/92, HR 84, T 36.9 C, RR 16, SpO2 98% on room air",
    speaker: "patient",
  },
  history: [
    { id: "h-onset", intents: ["onset"], say: "Yesterday morning I got an ache behind my right eye and forehead, and by the evening the eyelid had started to droop.", finding: "Subacute onset over hours, retro-orbital pain first", key: true },
    { id: "h-course", intents: ["course"], say: "The eyelid has dropped further overnight and now covers most of the eye.", finding: "Progressive ptosis over 24 hours" },
    { id: "h-diplopia", intents: ["double-vision", "eyelid"], say: "When I lift the eyelid I see two images, one higher than the other and off to the side.", finding: "Oblique binocular diplopia when lid lifted", key: true },
    { id: "h-pain", intents: ["pain", "headache"], say: "It's a constant, steady ache behind the right eye, about 7 out of 10. It didn't come on like a thunderclap.", finding: "Constant retro-orbital pain, not thunderclap", key: true },
    { id: "h-vision", intents: ["vision", "photophobia"], say: "My right eye is a bit blurry up close and bright light bothers that eye.", finding: "Blurred near vision and photophobia in the right eye" },
    { id: "h-background", intents: ["pmh", "meds", "allergies", "immunization"], say: "I have high blood pressure and take amlodipine. I don't have diabetes as far as I know. No allergies.", finding: "Hypertension on amlodipine; no known diabetes" },
    { id: "h-family", intents: ["family"], say: "My mother died suddenly of a bleed in her head when she was 60.", finding: "Family history of sudden death from intracranial hemorrhage" },
    { id: "h-social", intents: ["social", "alcohol", "smoking", "recreational-drugs", "concerns"], say: "I'm an office manager. I've smoked a pack a day for 30 years. I have a glass of wine some evenings, no drugs. After what happened to my mum, I'm scared.", finding: "Smoker, 30 pack-years" },
  ],
  defaultNegative: NEG,
  exam: [
    { maneuver: "eye-movements", finding: "Near-complete right ptosis. The right eye rests down and out, with impaired adduction, elevation, and depression. Abduction is full and the eye intorts on attempted downgaze (CN VI and IV intact).", abnormal: true, key: true },
    { maneuver: "pupils", finding: "Right pupil 7 mm and unreactive to light and near; left pupil 3 mm and brisk. No relative afferent pupillary defect.", abnormal: true, key: true },
  ],
  results: [
    { investigation: "cta-head-neck", summary: "7 mm aneurysm at the right ICA and posterior communicating artery junction", report: "A 7 mm saccular aneurysm arising at the junction of the right internal carotid and posterior communicating arteries, projecting posterolaterally. No other aneurysm. Cervical vessels normal.", interpretation: "Explains a painful pupil-involving third nerve palsy by direct compression. The aneurysm is enlarging or symptomatic and is at high risk of rupture: urgent neurovascular treatment is needed.", abnormal: true, key: true },
    { investigation: "ct-head", summary: "No hemorrhage", report: "No subarachnoid, intraparenchymal, or intraventricular blood. No mass.", interpretation: "No rupture yet. A normal noncontrast CT does not exclude an aneurysm; vascular imaging is required.", abnormal: false },
    { investigation: "mra-head-neck", summary: "7 mm right posterior communicating artery aneurysm", report: "Saccular aneurysm of about 7 mm at the right ICA and posterior communicating artery junction.", interpretation: "Equivalent to CTA for this purpose; either should be obtained urgently.", abnormal: true },
    { investigation: "mri-brain", summary: "No parenchymal lesion; flow void near the right posterior communicating artery", report: "No infarct, mass, or hemorrhage. A rounded 7 mm flow void adjacent to the right posterior communicating artery origin, abutting the right oculomotor nerve, better characterized by angiography.", interpretation: "Suggests the aneurysm, but angiographic imaging is required to define it.", abnormal: true },
    { investigation: "poc-glucose", summary: "Glucose 108 mg/dL", values: [{ analyte: "Glucose", value: "108", unit: "mg/dL", ref: "70 to 140" }], interpretation: "No hyperglycemia. Even in a diabetic, a painful palsy with a dilated pupil needs vascular imaging.", abnormal: false },
  ],
  normalInvestigations: ["cbc", "bmp", "coag", "crp-esr", "ecg", "lp-basic", "achr-ab"],
  hidden: {
    endpoint: "diagnosis",
    diagnosis: {
      full: [c("pcom", "Posterior communicating artery aneurysm compressing the third nerve", ["posterior communicating artery aneurysm", "posterior communicating aneurysm", "pcom aneurysm", "pcomm aneurysm", "p comm aneurysm", "aneurysm + third nerve", "aneurysm + oculomotor", "aneurysm + cn3", "aneurysm + cn iii", "aneurysm + cranial nerve iii", "aneurysm + cranial nerve 3", "aneurysmal third nerve palsy", "aneurysmal oculomotor"])],
      partial: [
        { concept: c("aneurysm", "Intracranial aneurysm", ["aneurysm"]), credit: 0.75, feedback: "Right cause. Name the site and the syndrome: a posterior communicating artery aneurysm compressing the third nerve, which runs beside it." },
        { concept: c("compressive-cn3", "Compressive third nerve palsy", ["compressive third nerve", "compressive oculomotor", "compressive cn3", "third nerve compression", "oculomotor compression"]), credit: 0.75, feedback: "Right mechanism. The compressive lesion to name is a posterior communicating artery aneurysm until vascular imaging proves otherwise." },
        { concept: c("cn3", "Third nerve palsy", ["third nerve palsy", "oculomotor nerve palsy", "oculomotor palsy", "cn3 palsy", "cn iii palsy", "cranial nerve iii palsy", "cranial nerve 3 palsy", "third nerve", "oculomotor nerve"]), credit: 0.5, feedback: "Correct nerve, but a painful third nerve palsy with a dilated pupil must be treated as a posterior communicating artery aneurysm until CTA or MRA proves otherwise." },
      ],
      wrong: [
        { concept: c("micro", "Microvascular third nerve palsy", ["microvascular", "diabetic third nerve", "ischemic third nerve", "ischemic oculomotor", "diabetic oculomotor", "vasculopathic", "diabetic cn3"]), tag: "unsafe-priority", feedback: "Microvascular palsies usually spare the pupil because the parasympathetic fibers run on the outside of the nerve, where compression hits them first. A dilated, unreactive pupil means compression until imaging proves otherwise." },
        { concept: c("mg", "Myasthenia gravis", ["myasthenia"]), tag: "knowledge-gap", feedback: "Myasthenia never affects the pupil." },
        { concept: c("horner", "Horner syndrome", ["horner"]), tag: "knowledge-gap", feedback: "Horner syndrome causes a mild ptosis with a small pupil. Here the pupil is large and the eye cannot elevate, depress, or adduct." },
        { concept: c("migraine", "Migraine", ["migraine"]), tag: "unsafe-priority", feedback: "Ophthalmoplegic migraine is rare and a diagnosis of exclusion; a dilated pupil with pain demands vascular imaging." },
      ],
    },
    diagnosisLabel: "Pupil-involving right third nerve palsy from a posterior communicating artery aneurysm",
    localization: { regions: ["peripheral-nerve"], explanation: "Right oculomotor nerve in the subarachnoid space, where it passes next to the junction of the internal carotid and posterior communicating arteries. The superficial pupillomotor fibers are compressed first, explaining the dilated pupil." },
    keyFindings: ["pupils", "eye-movements", "h-pain", "cta-head-neck"],
    mustConsider: [
      { concept: c("mc-sah", "Subarachnoid hemorrhage", ["subarachnoid", "sah"]), why: "A symptomatic aneurysm may already have leaked; CT (and LP if CT is negative and suspicion is high) answers this." },
      { concept: c("mc-micro", "Microvascular palsy", ["microvascular", "ischemic"]), why: "Common in diabetes and hypertension but usually pupil sparing; it is a diagnosis made after vascular imaging, not instead of it." },
      { concept: c("mc-apoplexy", "Pituitary apoplexy", ["pituitary apoplexy", "apoplexy"]), why: "Sudden headache with ophthalmoplegia and sometimes visual loss." },
      { concept: c("mc-cavernous", "Cavernous sinus lesion", ["cavernous sinus"]), why: "Would usually involve CN IV, VI, or V1 as well." },
    ],
    necessaryInvestigations: ["cta-head-neck", "ct-head"],
    reasonableInvestigations: ["mra-head-neck", "poc-glucose"],
    harmfulActions: [{ id: "discharge-followup", why: "An unsecured symptomatic aneurysm can rupture within days; attributing the palsy to microvascular disease without vascular imaging is dangerous." }],
    urgentActions: [
      { id: "u-vascular", satisfiedBy: ["cta-head-neck", "mra-head-neck"], label: "Urgent vascular imaging (CTA or MRA)", why: "A painful pupil-involving third nerve palsy is a posterior communicating artery aneurysm until proven otherwise.", consequence: "Missed aneurysm with risk of catastrophic subarachnoid hemorrhage." },
      { id: "u-neurosurg", satisfiedBy: ["neurosurgery"], label: "Urgent neurosurgical or neurointerventional referral", why: "A symptomatic aneurysm needs prompt securing by coiling or clipping.", consequence: "Rupture before treatment carries high mortality." },
    ],
    leakTerms: ["aneurysm", "posterior communicating", "third nerve palsy", "oculomotor palsy", "oculomotor nerve", "third nerve"],
    interpretationChecks: [],
    teachingPoints: [
      "Pupil involvement plus pain makes a third nerve palsy compressive until proven otherwise; the classic culprit is a posterior communicating artery aneurysm.",
      "Pupillomotor fibers lie on the surface of the nerve, so compression dilates the pupil early, whereas microvascular ischemia of the nerve core usually spares it.",
      "CTA or MRA is the high-yield test; a normal noncontrast CT does not exclude an aneurysm.",
    ],
  },
  speed: {
    presentation: "A 52-year-old woman who smokes developed an ache behind her right eye yesterday, followed by a progressively drooping right eyelid. When she lifts the lid she sees double.",
    highYield: ["pupils", "cta-head-neck"],
    explanation: "Ptosis with the eye down and out and a dilated unreactive pupil is a pupil-involving third nerve palsy, and with pain it is compressive until proven otherwise. The pupil examination separates this from a usually pupil-sparing microvascular palsy, and CTA shows the posterior communicating artery aneurysm that needs urgent treatment before it ruptures.",
  },
};

// ---------------------------------------------------------------------------
// S4 Carotid dissection with Horner syndrome
// ---------------------------------------------------------------------------
const sHorner: CaseDef = {
  id: "s-horner",
  version: 1,
  label: "Speed S4: neck pain",
  modes: ["speed"],
  difficulty: 2,
  modules: ["c-cvt-dissection"],
  provenance: "synthetic",
  review: "pending",
  sources: [],
  presentation: {
    age: 44,
    sex: "male",
    setting: "Emergency department",
    chiefComplaint: "Left neck pain and a droopy left eyelid",
    opening: "I've had pain on the left side of my neck for a few days, and this morning my wife said my left eyelid looks droopy.",
    vitals: "BP 136/84, HR 78, T 36.6 C, RR 14, SpO2 99% on room air",
    speaker: "patient",
  },
  history: [
    { id: "h-onset", intents: ["onset", "trauma"], say: "Five days ago I jarred my neck on a trampoline with my kids. The next day a pain started on the left side of my neck and ran up behind my left eye.", finding: "Minor neck trauma 5 days ago, then ipsilateral neck pain", key: true },
    { id: "h-course", intents: ["course"], say: "The pain has been there constantly since then. The droopy eyelid was new this morning.", finding: "Persistent pain; new ptosis today" },
    { id: "h-pain", intents: ["pain", "back-pain", "headache", "neck-stiffness"], say: "It's a sharp, nagging ache on the left side of my neck that goes up into the left side of my head and around the eye.", finding: "Left neck pain radiating to periorbital region", key: true },
    { id: "h-eye", intents: ["eyelid", "vision"], say: "My left eyelid is a bit droopy and that eye looks smaller in the mirror. My eyesight itself is fine.", finding: "Left ptosis and apparent miosis, normal vision", key: true },
    { id: "h-hearing", intents: ["hearing"], say: "Since yesterday I've heard a whooshing in my left ear in time with my heartbeat.", finding: "Left pulsatile tinnitus" },
    { id: "h-background", intents: ["pmh", "meds", "allergies", "immunization"], say: "I'm healthy. I get the odd migraine but nothing like this, and I take nothing regularly. No allergies.", finding: "Occasional migraine, no medications" },
    { id: "h-social", intents: ["social", "alcohol", "smoking", "recreational-drugs", "concerns"], say: "I'm an accountant. I don't smoke, I have a few beers on weekends, and no drugs. I'm worried something's wrong with my eye.", finding: "Accountant, nonsmoker" },
  ],
  defaultNegative: NEG,
  exam: [
    { maneuver: "pupils", finding: "Left pupil 3 mm, right 5 mm in room light; the anisocoria increases in dim light (left 4 mm, right 7 mm), with dilation lag on the left. Both react briskly to light. No relative afferent pupillary defect.", abnormal: true, key: true },
    { maneuver: "eye-movements", finding: "Full eye movements, no diplopia, no nystagmus. Mild (2 mm) left ptosis with slight elevation of the left lower lid.", abnormal: true, key: true },
  ],
  results: [
    { investigation: "cta-head-neck", summary: "Tapered narrowing of the left cervical ICA with intimal flap", report: "Flame-shaped tapering of the left cervical internal carotid artery beginning about 2 cm above the bifurcation, with an intimal flap and a crescentic intramural hematoma. Distal flow preserved. Intracranial vessels normal.", interpretation: "Left internal carotid artery dissection. The oculosympathetic fibers that run on the carotid wall are stretched by the intramural hematoma, producing the Horner syndrome.", abnormal: true, key: true },
    { investigation: "mra-head-neck", summary: "Intramural hematoma of the left cervical ICA", report: "Crescentic T1 hyperintense intramural hematoma on fat-saturated images with luminal narrowing of the left cervical internal carotid artery.", interpretation: "Confirms left internal carotid artery dissection; MRI with fat saturation is particularly sensitive for intramural hematoma.", abnormal: true, key: true },
    { investigation: "mri-brain", summary: "No infarct", report: "No restricted diffusion. No hemorrhage or mass.", interpretation: "No stroke yet, but the risk of embolic stroke is highest in the first weeks after dissection.", abnormal: false },
    { investigation: "carotid-us", summary: "High-resistance, reduced flow in the left ICA", report: "Reduced, high-resistance flow in the left internal carotid artery; the dissection site above the bifurcation is not well seen.", interpretation: "Suggestive but limited: ultrasound often misses distal dissections, so CTA or MRA is preferred.", abnormal: true },
  ],
  normalInvestigations: ["ct-head", "cbc", "bmp", "coag", "ecg", "crp-esr", "poc-glucose", "cxr", "ct-chest"],
  hidden: {
    endpoint: "diagnosis",
    diagnosis: {
      full: [c("dissection", "Internal carotid artery dissection", ["carotid dissection", "carotid artery dissection", "internal carotid dissection", "ica dissection", "cervical artery dissection", "cervical arterial dissection", "carotid + dissection", "dissecting carotid"])],
      partial: [
        { concept: c("horner", "Horner syndrome", ["horner", "horner syndrome", "oculosympathetic palsy", "oculosympathetic paresis", "oculosympathetic"]), credit: 0.5, feedback: "Right syndrome. A painful Horner syndrome with neck pain after minor trauma is an internal carotid artery dissection until imaging proves otherwise: name the cause." },
        { concept: c("dissection-only", "Arterial dissection", ["dissection"]), credit: 0.75, feedback: "Right mechanism. Name the vessel: the oculosympathetic fibers run on the internal carotid artery, so this is a carotid dissection." },
      ],
      wrong: [
        { concept: c("vertebral", "Vertebral artery dissection", ["vertebral dissection", "vertebral artery dissection"]), tag: "weak-reasoning", feedback: "Vertebral dissection causes posterior neck or occipital pain and posterior circulation symptoms; it causes Horner syndrome only with a lateral medullary stroke and other brainstem signs. Anterolateral neck pain with an isolated Horner points to the carotid." },
        { concept: c("cluster", "Cluster headache", ["cluster"]), tag: "unsafe-priority", feedback: "Cluster attacks are brief, recurrent, and strictly periorbital with tearing and nasal symptoms. Persistent neck pain with a new Horner after trauma needs vascular imaging." },
        { concept: c("cn3", "Third nerve palsy", ["third nerve", "oculomotor", "cn3"]), tag: "knowledge-gap", feedback: "A third nerve palsy causes a large pupil and ophthalmoplegia. Here the ptotic side has the small pupil and eye movements are full." },
        { concept: c("pancoast", "Pancoast tumor", ["pancoast", "apical lung"]), tag: "weak-reasoning", feedback: "An apical lung tumor causes a gradual Horner with shoulder and arm pain in smokers; the trauma, acute neck pain, and pulsatile tinnitus point to dissection." },
      ],
    },
    diagnosisLabel: "Left internal carotid artery dissection with painful Horner syndrome",
    localization: { regions: ["peripheral-nerve"], explanation: "Third-order (postganglionic) oculosympathetic fibers traveling on the wall of the left cervical internal carotid artery. Facial sweating is usually spared because those fibers follow the external carotid." },
    keyFindings: ["pupils", "eye-movements", "h-pain", "h-onset", "cta-head-neck"],
    mustConsider: [
      { concept: c("mc-vert", "Vertebral artery dissection", ["vertebral"]), why: "The other cervical artery dissection, with posterior circulation stroke risk." },
      { concept: c("mc-stroke", "Ischemic stroke or TIA", ["stroke", "tia"]), why: "Dissection causes embolic stroke; ask about and examine for transient or fixed deficits." },
      { concept: c("mc-cluster", "Cluster headache", ["cluster"]), why: "Can cause a partial Horner, but only during attacks." },
      { concept: c("mc-pancoast", "Apical lung tumor", ["pancoast", "lung"]), why: "A painful Horner in a smoker with arm pain." },
    ],
    necessaryInvestigations: ["cta-head-neck"],
    reasonableInvestigations: ["mra-head-neck", "mri-brain", "ct-head"],
    harmfulActions: [
      { id: "discharge-followup", why: "Stroke risk after dissection is highest in the first days to weeks; he needs vascular imaging and antithrombotic treatment before leaving." },
      { id: "thrombolysis", why: "There is no acute ischemic deficit to treat." },
    ],
    urgentActions: [
      { id: "u-imaging", satisfiedBy: ["cta-head-neck", "mra-head-neck"], label: "Urgent neck vessel imaging (CTA or MRA)", why: "Confirms dissection and guides treatment.", consequence: "Missed dissection with risk of stroke." },
      { id: "u-antithrombotic", satisfiedBy: ["antiplatelet", "anticoagulation"], label: "Start antithrombotic therapy once hemorrhage is excluded", why: "Antiplatelet or anticoagulant therapy reduces the risk of embolic stroke after dissection.", consequence: "Preventable embolic stroke." },
    ],
    leakTerms: ["dissection", "Horner", "oculosympathetic", "carotid dissection"],
    interpretationChecks: [],
    teachingPoints: [
      "A painful Horner syndrome is carotid dissection until proven otherwise, especially after neck trauma, even minor.",
      "Horner syndrome is mild ptosis plus miosis; the anisocoria is greater in the dark because the affected pupil dilates poorly.",
      "CTA or MRA with fat-saturated sequences confirms dissection; ultrasound can miss distal lesions.",
      "Pulsatile tinnitus, lower cranial nerve palsies, and dysgeusia are other local signs of carotid dissection.",
    ],
  },
  speed: {
    presentation: "A 44-year-old man has had constant left-sided neck pain spreading behind his left eye since jarring his neck on a trampoline five days ago. This morning his wife noticed his left eyelid drooping.",
    highYield: ["pupils", "cta-head-neck", "mra-head-neck"],
    explanation: "The pupil exam shows a small left pupil that dilates poorly in the dark, which with mild ptosis is a left Horner syndrome; with neck pain after minor trauma it is a carotid dissection until proven otherwise. CTA or MRA confirms the dissection, which needs antithrombotic treatment to prevent stroke.",
  },
};

// ---------------------------------------------------------------------------
// S5 Wernicke encephalopathy
// ---------------------------------------------------------------------------
const sWernicke: CaseDef = {
  id: "s-wernicke",
  version: 1,
  label: "Speed S5: confusion and unsteadiness",
  modes: ["speed"],
  difficulty: 1,
  modules: ["c-toxic-nutritional"],
  provenance: "synthetic",
  review: "pending",
  sources: ["sechi2007-wernicke"],
  presentation: {
    age: 56,
    sex: "male",
    setting: "Emergency department",
    chiefComplaint: "Confused and unsteady for two days",
    opening: "My brother has been muddled and wobbly on his feet for two days, and he keeps saying he's seeing double.",
    vitals: "BP 104/66, HR 108, T 36.4 C, RR 16, SpO2 97% on room air",
    speaker: "family",
    speakerNote: "His sister answers; he is too confused to give a reliable history.",
  },
  history: [
    { id: "h-onset", intents: ["onset", "nausea", "recent-illness"], say: "He's been getting more confused over the past two or three days. Before that he'd been vomiting on and off for about a week and barely eating.", finding: "Subacute confusion after a week of vomiting and poor intake", key: true },
    { id: "h-course", intents: ["course"], say: "He's worse today than yesterday.", finding: "Progressive" },
    { id: "h-confusion", intents: ["confusion", "behavior"], say: "He doesn't know what day it is and keeps asking the same questions. He's drowsy and just not himself.", finding: "Disorientation, drowsiness, poor memory", key: true },
    { id: "h-gait", intents: ["dizziness", "coordination"], say: "He's very unsteady. He walks with his feet wide apart and has to hold on to the walls.", finding: "Gait ataxia", key: true },
    { id: "h-vision", intents: ["double-vision", "vision"], say: "He says he's seeing two of everything.", finding: "Diplopia", key: true },
    { id: "h-alcohol", intents: ["alcohol", "weight"], say: "He drinks very heavily, most of a bottle of spirits every day for years, and lately he drinks instead of eating. He's lost a lot of weight this year.", finding: "Heavy daily alcohol use, malnutrition, weight loss", key: true },
    { id: "h-background", intents: ["pmh", "meds", "allergies", "immunization"], say: "He's had pancreatitis twice. As far as I know he doesn't take any regular medicines, and he has no allergies.", finding: "Recurrent pancreatitis; no medications" },
    { id: "h-social", intents: ["social", "smoking", "recreational-drugs", "concerns"], say: "He lives alone since his divorce and lost his job last year. He smokes, but no drugs that I know of. We're scared he's had a stroke.", finding: "Lives alone, unemployed, smoker" },
  ],
  defaultNegative: NEG_FAMILY,
  exam: [
    { maneuver: "general-appearance", finding: "Thin, unkempt, and mildly dehydrated. Not tremulous or sweating.", abnormal: true },
    { maneuver: "consciousness", finding: "Drowsy but rousable to voice. GCS 13 (E3 V4 M6).", abnormal: true },
    { maneuver: "orientation", finding: "Disoriented to date and place.", abnormal: true, key: true },
    { maneuver: "attention", finding: "Cannot say the months backward; loses track after three.", abnormal: true },
    { maneuver: "memory", finding: "Recalls 0 of 3 words at 5 minutes.", abnormal: true },
    { maneuver: "eye-movements", finding: "Bilateral horizontal gaze-evoked nystagmus. Bilateral incomplete abduction with horizontal diplopia. Vertical gaze full.", abnormal: true, key: true },
    { maneuver: "hints", finding: "Not applicable: not an acute vestibular syndrome. Bilateral gaze-evoked nystagmus as described under eye movements.", abnormal: true },
    { maneuver: "gait", finding: "Wide-based, unsteady truncal ataxia; cannot walk without support.", abnormal: true, key: true },
    { maneuver: "tandem", finding: "Unable to attempt tandem gait.", abnormal: true },
    { maneuver: "romberg", finding: "Cannot stand with feet together even with eyes open, so Romberg cannot be interpreted.", abnormal: true },
    { maneuver: "heel-shin", finding: "Mildly inaccurate bilaterally.", abnormal: true },
    { maneuver: "reflexes-legs", finding: "Knee reflexes 1+; ankle reflexes absent bilaterally.", abnormal: true },
    { maneuver: "vibration-proprioception", finding: "Vibration reduced at the toes; joint position sense intact.", abnormal: true },
    { maneuver: "pinprick", finding: "Pinprick reduced in a stocking distribution to the ankles.", abnormal: true },
    { maneuver: "skin", finding: "Several spider angiomas on the upper chest and palmar erythema. No rash.", abnormal: true },
  ],
  results: [
    { investigation: "poc-glucose", summary: "Glucose 84 mg/dL", values: [{ analyte: "Glucose", value: "84", unit: "mg/dL", ref: "70 to 140" }], interpretation: "Not hypoglycemic, so hypoglycemia does not explain the picture. If glucose is ever given to a malnourished drinker, give thiamine first or together.", abnormal: false },
    { investigation: "bmp", summary: "Mild hyponatremia and hypokalemia", values: [{ analyte: "Sodium", value: "132", unit: "mmol/L", ref: "135 to 145", flag: "L" }, { analyte: "Potassium", value: "3.1", unit: "mmol/L", ref: "3.5 to 5.0", flag: "L" }, { analyte: "Bicarbonate", value: "20", unit: "mmol/L", ref: "22 to 29", flag: "L" }, { analyte: "Creatinine", value: "0.8", unit: "mg/dL", ref: "0.7 to 1.3" }], interpretation: "Electrolyte losses from vomiting and poor intake; sodium of 132 does not explain encephalopathy.", abnormal: true },
    { investigation: "lft", summary: "Alcohol-pattern liver enzyme rise", values: [{ analyte: "AST", value: "142", unit: "U/L", ref: "10 to 40", flag: "H" }, { analyte: "ALT", value: "61", unit: "U/L", ref: "7 to 56", flag: "H" }, { analyte: "GGT", value: "310", unit: "U/L", ref: "8 to 61", flag: "H" }, { analyte: "Bilirubin", value: "1.4", unit: "mg/dL", ref: "0.1 to 1.2", flag: "H" }, { analyte: "Albumin", value: "3.0", unit: "g/dL", ref: "3.5 to 5.0", flag: "L" }], interpretation: "Consistent with heavy alcohol use and malnutrition, without liver failure.", abnormal: true },
    { investigation: "thiamine-level", summary: "Whole-blood thiamine low (resulted days later)", values: [{ analyte: "Thiamine (whole blood)", value: "42", unit: "nmol/L", ref: "70 to 180", flag: "L" }], turnaroundMin: 4320, interpretation: "Confirms deficiency, but the result takes days and treatment must never wait for it.", abnormal: true },
    { investigation: "mri-brain", summary: "Symmetric signal change in medial thalami, mammillary bodies, and periaqueductal gray", report: "Symmetric T2/FLAIR hyperintensity in the medial thalami, mammillary bodies, and periaqueductal gray matter. No infarct or hemorrhage.", interpretation: "The classic distribution of Wernicke encephalopathy. MRI is insensitive, so a normal scan would not exclude it.", abnormal: true, key: true },
  ],
  normalInvestigations: ["ct-head", "ammonia", "tox-screen", "cbc", "ecg", "urinalysis", "blood-cultures", "lp-basic", "eeg-routine", "crp-esr", "coag", "cxr"],
  hidden: {
    endpoint: "diagnosis",
    diagnosis: {
      full: [c("wernicke", "Wernicke encephalopathy", ["wernicke", "wernicke encephalopathy", "wernicke korsakoff", "thiamine deficiency", "thiamine deficiency encephalopathy", "vitamin b1 deficiency", "b1 deficiency"])],
      partial: [
        { concept: c("korsakoff", "Korsakoff syndrome", ["korsakoff"]), credit: 0.5, feedback: "Korsakoff syndrome is the chronic amnestic state that can follow. The acute triad of confusion, ophthalmoplegia, and ataxia is Wernicke encephalopathy, a thiamine emergency." },
        { concept: c("encephalopathy", "Encephalopathy", ["encephalopathy", "delirium"]), credit: 0.25, feedback: "Name the cause: confusion, ophthalmoplegia, and ataxia in a malnourished drinker is Wernicke encephalopathy from thiamine deficiency." },
      ],
      wrong: [
        { concept: c("hepatic", "Hepatic encephalopathy", ["hepatic encephalopathy", "hepatic"]), tag: "weak-reasoning", feedback: "Hepatic encephalopathy causes asterixis and fluctuating confusion but not ophthalmoplegia, and liver function here is preserved." },
        { concept: c("withdrawal", "Alcohol withdrawal", ["withdrawal", "delirium tremens", "dts"]), tag: "weak-reasoning", feedback: "Withdrawal causes tremor, sweating, and agitation. Ophthalmoplegia and ataxia point to thiamine deficiency, which can coexist and must be treated." },
        { concept: c("stroke", "Stroke", ["stroke", "cerebellar infarct"]), tag: "weak-reasoning", feedback: "Bilateral eye movement signs, symmetric ataxia, and confusion over days in a malnourished drinker fit thiamine deficiency better than a single vascular event." },
        { concept: c("intox", "Intoxication", ["intoxication", "drunk"]), tag: "unsafe-priority", feedback: "Assuming intoxication is the classic way this treatable emergency is missed; he has not been drinking for days and has ophthalmoplegia." },
      ],
    },
    diagnosisLabel: "Wernicke encephalopathy (acute thiamine deficiency)",
    localization: { regions: ["subcortical-left", "subcortical-right", "midbrain", "cerebellum"], explanation: "Symmetric periventricular structures with high thiamine-dependent metabolism: medial thalami and mammillary bodies (confusion, memory), periaqueductal gray and ocular motor nuclei (ophthalmoplegia, nystagmus), and cerebellar vermis (truncal ataxia)." },
    keyFindings: ["eye-movements", "gait", "orientation", "h-alcohol", "h-onset", "mri-brain"],
    mustConsider: [
      { concept: c("mc-hypo", "Hypoglycemia", ["hypoglycemia", "glucose"]), why: "Check at once; treat it, with thiamine before or alongside glucose." },
      { concept: c("mc-hepatic", "Hepatic encephalopathy", ["hepatic"]), why: "Common in drinkers and can coexist." },
      { concept: c("mc-head", "Subdural hematoma", ["subdural", "head injury"]), why: "Falls are common in heavy drinkers; image if there is any focal sign or trauma." },
      { concept: c("mc-withdrawal", "Alcohol withdrawal", ["withdrawal"]), why: "May coexist and needs its own treatment." },
    ],
    necessaryInvestigations: ["poc-glucose"],
    reasonableInvestigations: ["bmp", "lft", "mri-brain", "ct-head", "ammonia", "thiamine-level"],
    harmfulActions: [{ id: "dextrose", why: "He is not hypoglycemic. Glucose given to a thiamine-deficient patient before thiamine can precipitate or worsen Wernicke encephalopathy." }],
    urgentActions: [
      { id: "u-thiamine", satisfiedBy: ["thiamine"], label: "Give IV thiamine immediately, before or with any glucose", why: "Wernicke encephalopathy is reversible if treated early; delay risks permanent Korsakoff amnesia or death.", consequence: "Progression to irreversible memory loss, coma, or death." },
    ],
    leakTerms: ["Wernicke", "Korsakoff", "thiamine deficiency", "thiamine"],
    interpretationChecks: [],
    teachingPoints: [
      "The full triad of confusion, ophthalmoplegia, and ataxia is present in a minority; treat on suspicion in anyone malnourished or drinking heavily.",
      "Give IV thiamine before or with glucose; never wait for a thiamine level or MRI.",
      "Vomiting, bariatric surgery, hyperemesis, and cancer are nonalcoholic settings for Wernicke encephalopathy.",
      "MRI changes in the medial thalami, mammillary bodies, and periaqueductal gray support the diagnosis but are often absent.",
    ],
  },
  speed: {
    presentation: "A 56-year-old man is brought in by his sister after two days of increasing confusion and unsteadiness, and he says he is seeing double. He had been vomiting and barely eating for a week before that.",
    highYield: ["eye-movements", "alcohol", "gait"],
    explanation: "Confusion with nystagmus and abduction weakness plus a wide-based truncal ataxia is the Wernicke triad, and heavy alcohol use with poor intake supplies the thiamine deficiency. Asking about alcohol and examining eye movements and gait discriminate this from intoxication, withdrawal, or hepatic encephalopathy. IV thiamine must be given at once, before or with glucose, without waiting for tests.",
  },
};

// ---------------------------------------------------------------------------
// S6 Subacute combined degeneration (nitrous oxide)
// ---------------------------------------------------------------------------
const sB12: CaseDef = {
  id: "s-b12",
  version: 1,
  label: "Speed S6: tingling feet",
  modes: ["speed"],
  difficulty: 2,
  modules: ["c-toxic-nutritional"],
  provenance: "synthetic",
  review: "pending",
  sources: [],
  presentation: {
    age: 24,
    sex: "male",
    setting: "Neurology outpatient clinic",
    chiefComplaint: "Tingling feet and unsteadiness for six weeks",
    opening: "My feet and fingers have been tingling for about six weeks, and now I'm unsteady on my feet, especially in the dark.",
    vitals: "BP 122/74, HR 72, T 36.6 C, RR 14, SpO2 99% on room air",
    speaker: "patient",
  },
  history: [
    { id: "h-onset", intents: ["onset"], say: "About six weeks ago my toes started tingling, and a week or two later my fingertips did too.", finding: "Subacute distal paresthesias, feet then hands" },
    { id: "h-course", intents: ["course"], say: "It's crept up to my knees and keeps getting worse.", finding: "Progressive over 6 weeks" },
    { id: "h-numb", intents: ["numbness"], say: "Pins and needles in both feet up to the knees and in my fingertips. My feet feel like they're wrapped in cotton wool.", finding: "Distal paresthesias in all four limbs", key: true },
    { id: "h-balance", intents: ["dizziness", "coordination"], patterns: ["dark", "shower", "eyes closed"], say: "I feel unsteady when I walk, much worse in the dark. I nearly fell washing my hair in the shower with my eyes shut.", finding: "Sensory ataxia worse without vision", key: true },
    { id: "h-weak", intents: ["weakness"], say: "My legs feel a bit stiff and weak going up stairs.", finding: "Mild leg weakness and stiffness" },
    { id: "h-drugs", intents: ["recreational-drugs"], patterns: ["drug", "laughing gas", "nitrous", "balloon", "whippet", "canister", "cream charger"], say: "I've been inhaling laughing gas from balloons most weekends for about a year. Lately it's been dozens of canisters a night.", finding: "Heavy recreational nitrous oxide use", key: true },
    { id: "h-background", intents: ["pmh", "meds", "allergies", "immunization"], patterns: ["diet", "vegetarian", "vegan", "meat"], say: "I'm healthy and don't take any medicines or supplements. No allergies. I eat meat; I'm not vegetarian.", finding: "No medications; omnivorous diet" },
    { id: "h-social", intents: ["social", "alcohol", "smoking", "concerns"], say: "I'm a university student in a shared house. I have a few beers at weekends and don't smoke. I'm scared I'll end up in a wheelchair.", finding: "Student; modest alcohol" },
  ],
  defaultNegative: NEG,
  exam: [
    { maneuver: "vibration-proprioception", finding: "Vibration absent at the toes and ankles and reduced at the knees; reduced at the fingertips. Joint position sense lost at both great toes.", abnormal: true, key: true },
    { maneuver: "romberg", finding: "Romberg positive: steady with eyes open, sways and nearly falls with eyes closed.", abnormal: true, key: true },
    { maneuver: "gait", finding: "Broad-based, stamping gait, worse with eyes closed.", abnormal: true },
    { maneuver: "tandem", finding: "Unable to tandem walk.", abnormal: true },
    { maneuver: "reflexes-legs", finding: "Knee reflexes brisk (3+) bilaterally; ankle reflexes absent.", abnormal: true, key: true },
    { maneuver: "plantar", finding: "Extensor bilaterally.", abnormal: true, key: true },
    { maneuver: "pinprick", finding: "Mildly reduced pinprick in a stocking distribution to the mid shins.", abnormal: true },
    { maneuver: "strength-legs", finding: "Hip flexion 4+/5 bilaterally; otherwise 5/5.", abnormal: true },
    { maneuver: "heel-shin", finding: "Mildly inaccurate bilaterally, worse with eyes closed.", abnormal: true },
  ],
  results: [
    { investigation: "b12-mma", summary: "Low-normal B12 with high methylmalonic acid and homocysteine", values: [{ analyte: "Vitamin B12", value: "312", unit: "pg/mL", ref: "200 to 900" }, { analyte: "Methylmalonic acid", value: "1.8", unit: "umol/L", ref: "0.4 or less", flag: "H" }, { analyte: "Homocysteine", value: "48", unit: "umol/L", ref: "5 to 15", flag: "H" }], interpretation: "Functional B12 deficiency: nitrous oxide oxidizes cobalamin and inactivates it, so serum B12 can look normal while MMA and homocysteine are high.", abnormal: true, key: true },
    { investigation: "mri-spine", summary: "Dorsal column T2 signal C2 to C6", report: "Symmetric T2 hyperintensity in the dorsal columns from C2 to C6, with an inverted V appearance on axial images. No cord compression or enhancement.", interpretation: "The typical appearance of subacute combined degeneration.", abnormal: true, key: true },
    { investigation: "cbc", summary: "Mild macrocytosis without anemia", values: [{ analyte: "Hemoglobin", value: "13.8", unit: "g/dL", ref: "13.5 to 17.5" }, { analyte: "MCV", value: "101", unit: "fL", ref: "80 to 100", flag: "H" }], interpretation: "Macrocytosis supports B12 dysfunction; anemia is often absent in neurological presentations.", abnormal: true },
    { investigation: "ncs-emg", summary: "Mild length-dependent axonal sensorimotor neuropathy", report: "Reduced sural and superficial peroneal sensory amplitudes and mildly reduced peroneal motor amplitudes with normal conduction velocities.", interpretation: "Explains the absent ankle jerks alongside brisk knees: neuropathy coexisting with myelopathy.", abnormal: true },
  ],
  normalInvestigations: ["bmp", "tsh", "hiv", "syphilis-serology", "lft", "mri-brain", "crp-esr", "poc-glucose", "ct-head", "lp-basic"],
  hidden: {
    endpoint: "diagnosis",
    diagnosis: {
      full: [c("scd", "Subacute combined degeneration from functional B12 deficiency", ["subacute combined degeneration", "scd", "b12 deficiency myelopathy", "b12 deficiency myeloneuropathy", "b12 myelopathy", "cobalamin deficiency myelopathy", "nitrous oxide myelopathy", "nitrous oxide myeloneuropathy", "b12 + myelopathy", "b12 + myeloneuropathy", "b12 + dorsal column", "nitrous oxide + myelopathy", "nitrous oxide + dorsal column", "cobalamin + myelopathy"])],
      partial: [
        { concept: c("b12", "B12 deficiency", ["b12 deficiency", "vitamin b12", "cobalamin deficiency", "nitrous oxide", "b12"]), credit: 0.75, feedback: "Right cause. Name the neurological syndrome: subacute combined degeneration of the dorsal columns and corticospinal tracts, often with a neuropathy." },
        { concept: c("myelopathy", "Myelopathy", ["myelopathy", "dorsal column", "myeloneuropathy"]), credit: 0.5, feedback: "Right localization. The cause here is functional B12 deficiency from nitrous oxide, producing subacute combined degeneration." },
      ],
      wrong: [
        { concept: c("gbs", "Guillain-Barre syndrome", ["guillain barre", "gbs", "aidp"]), tag: "weak-reasoning", feedback: "Guillain-Barre syndrome causes areflexia. Brisk knees and extensor plantars indicate corticospinal tract involvement, and Romberg-positive sensory ataxia points to the dorsal columns." },
        { concept: c("ms", "Multiple sclerosis", ["multiple sclerosis", "ms"]), tag: "weak-reasoning", feedback: "Symmetric dorsal column and corticospinal signs with a neuropathy and heavy nitrous oxide use point to functional B12 deficiency, not demyelination." },
        { concept: c("copper", "Copper deficiency", ["copper"]), tag: "weak-reasoning", feedback: "Copper deficiency myelopathy is a close mimic, but the nitrous oxide history and raised MMA and homocysteine point to B12." },
        { concept: c("tabes", "Tabes dorsalis", ["tabes", "neurosyphilis"]), tag: "weak-reasoning", feedback: "Tabes dorsalis causes dorsal column loss with areflexia and lightning pains, not brisk knees with extensor plantars." },
      ],
    },
    diagnosisLabel: "Subacute combined degeneration from nitrous oxide induced functional vitamin B12 deficiency",
    localization: { regions: ["cord-cervical", "cord-thoracic", "peripheral-nerve"], explanation: "Dorsal columns (vibration and position loss, Romberg sign) and lateral corticospinal tracts (brisk knees, extensor plantars) of the cervical and thoracic cord, plus a length-dependent peripheral neuropathy (absent ankle jerks)." },
    keyFindings: ["h-drugs", "vibration-proprioception", "romberg", "reflexes-legs", "plantar", "b12-mma", "mri-spine"],
    mustConsider: [
      { concept: c("mc-copper", "Copper deficiency", ["copper"]), why: "Produces an identical myeloneuropathy, especially after bariatric surgery or zinc excess." },
      { concept: c("mc-compression", "Cervical cord compression", ["compression", "spondylotic"]), why: "Image the cord to exclude a structural cause of myelopathy." },
      { concept: c("mc-hiv", "HIV vacuolar myelopathy", ["hiv"]), why: "A treatable infectious mimic." },
      { concept: c("mc-syphilis", "Neurosyphilis", ["syphilis", "tabes"]), why: "Dorsal column syndrome with a treatable cause." },
    ],
    necessaryInvestigations: ["b12-mma"],
    reasonableInvestigations: ["mri-spine", "cbc", "ncs-emg", "hiv", "syphilis-serology"],
    harmfulActions: [],
    urgentActions: [],
    leakTerms: ["subacute combined degeneration", "B12", "vitamin B12", "cobalamin", "myelopathy"],
    interpretationChecks: [],
    teachingPoints: [
      "Brisk knees with absent ankle jerks and extensor plantars is the classic combination of myelopathy plus neuropathy in B12 deficiency.",
      "Nitrous oxide inactivates B12, so serum B12 may be normal; methylmalonic acid and homocysteine reveal the functional deficiency.",
      "Treatment is prompt B12 replacement and stopping nitrous oxide; recovery depends on how early treatment starts.",
    ],
  },
  speed: {
    presentation: "A 24-year-old university student has six weeks of tingling that started in his toes and fingertips and has crept up to his knees. He is now unsteady, especially in the dark.",
    highYield: ["recreational-drugs", "b12-mma", "vibration-proprioception", "reflexes-legs"],
    explanation: "Loss of vibration and position sense with a positive Romberg, brisk knees, and absent ankle jerks indicate combined dorsal column, corticospinal, and peripheral nerve involvement. Asking about recreational drugs uncovers heavy nitrous oxide use, which inactivates B12; a high methylmalonic acid confirms functional deficiency even when serum B12 looks normal. This is subacute combined degeneration.",
  },
};

// ---------------------------------------------------------------------------
// S7 Carpal tunnel syndrome
// ---------------------------------------------------------------------------
const sCts: CaseDef = {
  id: "s-cts",
  version: 1,
  label: "Speed S7: tingling hand",
  modes: ["speed"],
  difficulty: 1,
  modules: ["c-polyneuropathy-radiculopathy"],
  provenance: "synthetic",
  review: "pending",
  sources: [],
  presentation: {
    age: 51,
    sex: "female",
    setting: "Primary care clinic",
    chiefComplaint: "Right hand tingling that wakes her at night",
    opening: "My right hand tingles so much at night that it wakes me up, and lately I keep dropping things.",
    vitals: "BP 130/80, HR 72, T 36.6 C, RR 14, SpO2 99% on room air",
    speaker: "patient",
  },
  history: [
    { id: "h-onset", intents: ["onset"], say: "It started about four months ago, mostly at night.", finding: "Four months of nocturnal symptoms" },
    { id: "h-course", intents: ["course"], say: "It's slowly getting worse, and now the hand feels clumsy in the daytime too.", finding: "Slowly progressive" },
    { id: "h-numb", intents: ["numbness"], patterns: ["finger", "little finger", "thumb"], say: "The tingling is in my thumb, index, and middle fingers and part of the ring finger. My little finger is fine.", finding: "Paresthesias in median nerve digits, sparing little finger", key: true },
    { id: "h-night", intents: ["triggers", "sleep"], patterns: ["shake", "night"], say: "It wakes me up most nights, and I have to shake my hand to get the feeling back. Driving and holding my phone bring it on too.", finding: "Nocturnal waking relieved by shaking; positional triggers", key: true },
    { id: "h-weak", intents: ["weakness", "coordination"], say: "Lately I drop things and struggle to open jars and do up buttons.", finding: "Grip and fine motor difficulty" },
    { id: "h-pain", intents: ["pain"], say: "Sometimes there's an ache in my wrist that goes up into my forearm. My neck is fine.", finding: "Wrist and forearm ache, no neck pain" },
    { id: "h-background", intents: ["pmh", "meds", "allergies", "immunization", "pregnancy"], say: "I have an underactive thyroid and take levothyroxine. No allergies. I'm past menopause.", finding: "Hypothyroidism on levothyroxine; postmenopausal" },
    { id: "h-social", intents: ["social", "alcohol", "smoking", "recreational-drugs", "concerns"], say: "I'm a dental hygienist, so I grip instruments all day. I don't smoke and rarely drink. I'm worried I'll have to stop working.", finding: "Dental hygienist with repetitive gripping" },
  ],
  defaultNegative: NEG,
  exam: [
    { maneuver: "inspection", finding: "Mild wasting of the right thenar eminence. No fasciculations.", abnormal: true, key: true },
    { maneuver: "strength-arms", finding: "Right abductor pollicis brevis 4/5. First dorsal interosseous, finger flexors of the ring and little fingers, wrist and elbow muscles 5/5. Left arm 5/5.", abnormal: true, key: true },
    { maneuver: "pinprick", finding: "Reduced pinprick over the palmar thumb, index, middle, and radial half of the ring finger on the right; sensation over the thenar eminence and little finger normal. Tapping over the right carpal tunnel (Tinel) and sustained wrist flexion (Phalen) reproduce tingling in the median digits.", abnormal: true, key: true },
  ],
  results: [
    { investigation: "ncs-emg", summary: "Focal slowing of the right median nerve across the wrist", report: "Right median sensory peak latency 4.6 ms (ref 3.5 or less) with amplitude 8 uV (ref 20 or more); median distal motor latency 6.2 ms (ref 4.4 or less), amplitude 5.1 mV; normal forearm conduction velocity. Ulnar and radial studies normal. EMG: mild chronic denervation in right abductor pollicis brevis only; cervical paraspinals and C6 to C8 muscles outside the median territory normal. Left median sensory latency mildly prolonged.", interpretation: "Focal median neuropathy at the wrist, moderate to severe on the right with axonal loss; no radiculopathy or polyneuropathy.", abnormal: true, key: true, schematic: { kind: "ncs", pattern: "demyelinating" } },
    { investigation: "tsh", summary: "TSH 2.1 mIU/L", values: [{ analyte: "TSH", value: "2.1", unit: "mIU/L", ref: "0.4 to 4.0" }], interpretation: "Hypothyroidism is adequately treated; it is a risk factor for carpal tunnel syndrome.", abnormal: false },
    { investigation: "poc-glucose", summary: "Glucose 96 mg/dL", values: [{ analyte: "Glucose", value: "96", unit: "mg/dL", ref: "70 to 140" }], interpretation: "No hyperglycemia. Diabetes is a common risk factor worth screening for.", abnormal: false },
  ],
  normalInvestigations: ["cbc", "bmp", "mri-spine", "crp-esr", "b12-mma", "ana-ena"],
  hidden: {
    endpoint: "diagnosis",
    diagnosis: {
      full: [c("cts", "Carpal tunnel syndrome", ["carpal tunnel", "carpal tunnel syndrome", "cts", "median neuropathy at the wrist", "median nerve entrapment at the wrist", "median nerve compression at the wrist", "median mononeuropathy at the wrist", "median + wrist"])],
      partial: [
        { concept: c("median", "Median neuropathy", ["median neuropathy", "median nerve", "median mononeuropathy"]), credit: 0.75, feedback: "Right nerve. Name the site: nocturnal symptoms, thenar wasting, and sparing of the palm point to compression at the wrist (carpal tunnel)." },
      ],
      wrong: [
        { concept: c("radic", "Cervical radiculopathy", ["radiculopathy", "c6", "c7", "pinched nerve neck"]), tag: "weak-reasoning", feedback: "A C6 or C7 radiculopathy usually causes neck pain, reflex change, and weakness outside the hand. Sensory loss limited to median digits with sparing of the palm, plus thenar weakness, points to the wrist." },
        { concept: c("ulnar", "Ulnar neuropathy", ["ulnar"]), tag: "knowledge-gap", feedback: "Ulnar neuropathy affects the little finger and the first dorsal interosseous. Here the little finger is spared and the thenar muscles are weak." },
        { concept: c("poly", "Polyneuropathy", ["polyneuropathy", "peripheral neuropathy", "diabetic neuropathy"]), tag: "weak-reasoning", feedback: "A polyneuropathy starts in the feet. This is a single nerve problem." },
        { concept: c("pronator", "Pronator syndrome", ["pronator"]), tag: "weak-reasoning", feedback: "Proximal median compression would also affect the palm (palmar cutaneous branch) and forearm flexors; nocturnal symptoms and wrist slowing on conduction studies point to the carpal tunnel." },
      ],
    },
    diagnosisLabel: "Right carpal tunnel syndrome (median neuropathy at the wrist)",
    localization: { regions: ["peripheral-nerve"], explanation: "Right median nerve within the carpal tunnel at the wrist. The palmar cutaneous branch leaves the nerve before the tunnel, so palm sensation is spared, while the recurrent motor branch to the thenar muscles is affected." },
    keyFindings: ["h-numb", "h-night", "pinprick", "strength-arms", "inspection", "ncs-emg"],
    mustConsider: [
      { concept: c("mc-radic", "C6 or C7 radiculopathy", ["radiculopathy"]), why: "The main mimic; look for neck pain, reflex change, and weakness beyond the median territory." },
      { concept: c("mc-poly", "Polyneuropathy", ["polyneuropathy"]), why: "Carpal tunnel can be superimposed on a generalized neuropathy, for example in diabetes." },
      { concept: c("mc-causes", "Predisposing conditions", ["hypothyroidism", "diabetes", "pregnancy", "amyloid"]), why: "Hypothyroidism, diabetes, pregnancy, and amyloidosis predispose to carpal tunnel syndrome." },
    ],
    necessaryInvestigations: [],
    reasonableInvestigations: ["ncs-emg", "tsh", "poc-glucose"],
    harmfulActions: [],
    urgentActions: [],
    leakTerms: ["carpal tunnel", "median neuropathy", "median nerve", "CTS"],
    interpretationChecks: [],
    teachingPoints: [
      "Carpal tunnel syndrome causes nocturnal paresthesias in the thumb, index, middle, and radial ring finger, relieved by shaking the hand.",
      "Palm sensation is spared because the palmar cutaneous branch leaves the median nerve before the carpal tunnel.",
      "Thenar wasting and weakness indicate axonal loss; nerve conduction studies confirm the diagnosis and grade severity before surgery.",
    ],
  },
  speed: {
    presentation: "A 51-year-old dental hygienist has four months of right hand tingling that wakes her at night and is relieved by shaking the hand. She has started dropping things.",
    highYield: ["numbness", "pinprick", "ncs-emg"],
    explanation: "Tingling confined to the thumb, index, middle, and radial ring finger with the little finger and palm spared, plus thenar weakness, maps to the median nerve at the wrist. Asking exactly where the tingling is, testing sensation, and nerve conduction studies separate this from C6 or C7 radiculopathy, ulnar neuropathy, and polyneuropathy. This is carpal tunnel syndrome.",
  },
};

// ---------------------------------------------------------------------------
// S8 Lambert-Eaton myasthenic syndrome
// ---------------------------------------------------------------------------
const sLems: CaseDef = {
  id: "s-lems",
  version: 1,
  label: "Speed S8: difficulty climbing stairs",
  modes: ["speed"],
  difficulty: 3,
  modules: ["c-nmj"],
  provenance: "synthetic",
  review: "pending",
  sources: ["titulaer2011-lems"],
  presentation: {
    age: 63,
    sex: "male",
    setting: "Neurology outpatient clinic",
    chiefComplaint: "Three months of difficulty climbing stairs",
    opening: "Over the last few months it's got harder and harder to get up stairs and out of low chairs.",
    vitals: "BP 132/80, HR 80, T 36.7 C, RR 16, SpO2 96% on room air",
    speaker: "patient",
  },
  history: [
    { id: "h-onset", intents: ["onset", "course"], say: "It's crept up over about three months and keeps getting worse.", finding: "Subacute progressive weakness over 3 months" },
    { id: "h-weak", intents: ["weakness"], say: "My thighs and hips feel weak. Getting out of the car is hard, and lifting things onto high shelves is harder than it was.", finding: "Proximal leg more than arm weakness", key: true },
    { id: "h-autonomic", intents: ["autonomic"], patterns: ["dry mouth", "erection", "impotence", "mouth dry"], say: "My mouth is dry all the time, and I've had trouble getting erections.", finding: "Dry mouth and erectile dysfunction", key: true },
    { id: "h-fatigue", intents: ["fatigability"], say: "Strangely, once I get going my legs feel a little stronger for a moment, but by the end of the day I'm worn out.", finding: "Brief improvement with effort; general fatigue" },
    { id: "h-weight", intents: ["weight", "recent-illness"], say: "I've lost about 15 pounds without trying, and my smoker's cough has got worse.", finding: "Weight loss and worsening cough", key: true },
    { id: "h-smoking", intents: ["smoking"], say: "I've smoked a pack a day since I was 16.", finding: "Heavy smoker, about 47 pack-years", key: true },
    { id: "h-background", intents: ["pmh", "meds", "allergies", "immunization"], say: "I have high blood pressure and take amlodipine. No allergies.", finding: "Hypertension on amlodipine" },
    { id: "h-social", intents: ["social", "alcohol", "recreational-drugs", "concerns"], say: "I'm a retired builder. I have a couple of beers a week and no drugs. The weight loss worries me.", finding: "Retired builder" },
  ],
  defaultNegative: NEG,
  exam: [
    { maneuver: "general-appearance", finding: "Thin, with nicotine-stained fingers and finger clubbing.", abnormal: true },
    { maneuver: "strength-legs", finding: "Hip flexion and extension 4-/5 and knee extension 4/5 bilaterally; distal strength 5/5. A few seconds of maximal effort transiently increases hip flexor strength.", abnormal: true, key: true },
    { maneuver: "strength-arms", finding: "Shoulder abduction 4+/5 bilaterally; distal strength 5/5.", abnormal: true },
    { maneuver: "reflexes-legs", finding: "Knee and ankle reflexes reduced (1+) at rest; they become brisker (2+) immediately after 10 seconds of maximal quadriceps contraction.", abnormal: true, key: true },
    { maneuver: "reflexes-arms", finding: "Biceps and triceps 1+ at rest, improving after brief maximal contraction.", abnormal: true },
    { maneuver: "fatigable-weakness", finding: "No fatigable weakness; strength improves over the first few seconds of repeated effort.", abnormal: true },
    { maneuver: "gait", finding: "Waddling gait; uses arms to push up from the chair.", abnormal: true },
  ],
  results: [
    { investigation: "vgcc-ab", summary: "P/Q-type VGCC antibody strongly positive", values: [{ analyte: "P/Q-type voltage-gated calcium channel antibody", value: "0.41", unit: "nmol/L", ref: "0.02 or less", flag: "H" }], interpretation: "Present in most patients with LEMS, both paraneoplastic and nonparaneoplastic; supports the diagnosis with the clinical and electrodiagnostic picture.", abnormal: true, key: true },
    { investigation: "rns", summary: "Low CMAPs with marked post-exercise facilitation", report: "Low baseline CMAP amplitudes (abductor digiti minimi 1.2 mV, ref 6 or more) with 18% decrement at 3 Hz. After 10 seconds of maximal voluntary contraction the CMAP amplitude increases by 240%.", schematic: { kind: "rns", pattern: "increment" }, interpretation: "Increment of more than 100% after brief exercise is the electrodiagnostic hallmark of a presynaptic neuromuscular junction disorder such as LEMS.", abnormal: true, key: true },
    { investigation: "ncs-emg", summary: "Diffusely low motor amplitudes with normal sensory studies", report: "Diffusely low CMAP amplitudes with normal distal latencies and conduction velocities. Sensory studies normal. EMG: unstable, small motor unit potentials in proximal muscles without fibrillations.", interpretation: "Low motor amplitudes with normal sensory responses should prompt repetitive stimulation and brief exercise testing.", abnormal: true },
    { investigation: "ct-chest", summary: "Right hilar mass with mediastinal nodes", report: "A 2.8 cm right hilar mass with bulky right paratracheal and subcarinal lymphadenopathy, suspicious for small cell lung carcinoma. No pleural effusion.", interpretation: "In a smoker with LEMS, small cell lung cancer is the likely driver; tissue diagnosis and staging follow. Screening continues for years if the first scan is negative.", abnormal: true, key: true },
    { investigation: "cxr", summary: "Right hilar fullness", report: "Right hilar fullness. Lungs otherwise clear.", interpretation: "Abnormal but insufficient: CT chest is the screening test in LEMS.", abnormal: true },
  ],
  normalInvestigations: ["achr-ab", "musk-ab", "ck", "tsh", "cbc", "bmp", "lft", "crp-esr", "mri-spine", "ecg", "fvc-nif"],
  hidden: {
    endpoint: "diagnosis",
    diagnosis: {
      full: [c("lems", "Lambert-Eaton myasthenic syndrome", ["lambert eaton", "lambert eaton myasthenic syndrome", "lems", "eaton lambert", "lambert eaton syndrome"])],
      partial: [
        { concept: c("nmj", "Neuromuscular junction disorder", ["neuromuscular junction", "presynaptic nmj", "presynaptic neuromuscular"]), credit: 0.5, feedback: "Right level. Proximal weakness, low reflexes that improve after brief exercise, and dry mouth make it the presynaptic disorder: Lambert-Eaton myasthenic syndrome." },
        { concept: c("paraneoplastic", "Paraneoplastic syndrome", ["paraneoplastic"]), credit: 0.25, feedback: "Likely paraneoplastic, but name the syndrome: Lambert-Eaton myasthenic syndrome." },
      ],
      overlySpecific: [
        { concept: c("sclc", "Small cell lung cancer", ["small cell lung", "small cell", "sclc", "lung cancer"]), credit: 0.5, feedback: "Small cell lung cancer is the suspected driver and must be looked for, but it is not yet proven and is not the neurological diagnosis. The syndrome is Lambert-Eaton myasthenic syndrome." },
      ],
      wrong: [
        { concept: c("mg", "Myasthenia gravis", ["myasthenia gravis", "mg"]), tag: "misconception", feedback: "Myasthenia gravis usually starts with fatigable ptosis and diplopia, reflexes are normal, and weakness worsens with exercise. Here reflexes are reduced and improve after brief effort, with autonomic symptoms: Lambert-Eaton." },
        { concept: c("myositis", "Myositis or myopathy", ["myositis", "polymyositis", "myopathy", "dermatomyositis"]), tag: "weak-reasoning", feedback: "A myopathy would not reduce reflexes that then improve with exercise, and would not cause dry mouth; CK is normal." },
        { concept: c("gbs", "Guillain-Barre syndrome", ["guillain barre", "gbs", "cidp"]), tag: "weak-reasoning", feedback: "There are no sensory findings, and the time course and post-exercise facilitation point to the neuromuscular junction." },
      ],
    },
    diagnosisLabel: "Lambert-Eaton myasthenic syndrome, likely paraneoplastic",
    localization: { regions: ["nmj"], explanation: "Presynaptic neuromuscular junction: antibodies against P/Q-type voltage-gated calcium channels reduce acetylcholine release. Brief exercise transiently raises nerve terminal calcium, which explains post-exercise facilitation of strength and reflexes. Autonomic synapses share the channel, causing dry mouth and erectile dysfunction." },
    keyFindings: ["reflexes-legs", "strength-legs", "h-autonomic", "h-smoking", "rns", "vgcc-ab", "ct-chest"],
    mustConsider: [
      { concept: c("mc-sclc", "Small cell lung cancer", ["small cell", "lung cancer", "sclc"]), why: "About half of LEMS is paraneoplastic, usually from small cell lung cancer; screen with CT chest and repeat if negative." },
      { concept: c("mc-mg", "Myasthenia gravis", ["myasthenia gravis"]), why: "The main differential; distinguished by reflexes, autonomic symptoms, and electrodiagnostics." },
      { concept: c("mc-myopathy", "Inflammatory myopathy", ["myopathy", "myositis"]), why: "Proximal weakness; CK and EMG help." },
    ],
    necessaryInvestigations: ["rns", "vgcc-ab", "ct-chest"],
    reasonableInvestigations: ["ncs-emg", "achr-ab", "ck", "cxr"],
    harmfulActions: [],
    urgentActions: [
      { id: "u-cancer", satisfiedBy: ["ct-chest", "ct-cap", "fdg-pet"], label: "Screen for small cell lung cancer", why: "Treating the underlying tumor is the most effective treatment for paraneoplastic LEMS and determines survival.", consequence: "Delayed cancer diagnosis." },
    ],
    leakTerms: ["Lambert-Eaton", "Lambert Eaton", "LEMS", "Eaton", "small cell", "paraneoplastic", "lung cancer"],
    interpretationChecks: [
      { id: "ic-rns", investigation: "rns", question: "What does the repetitive nerve stimulation show and where does it localize?", answer: { full: [c("ic-facil", "Post-exercise facilitation, presynaptic", ["post exercise facilitation", "post exercise increment", "facilitation", "increment"])] }, modelAnswer: "Low baseline CMAPs with marked post-exercise facilitation (increment over 100%), indicating a presynaptic neuromuscular junction disorder." },
    ],
    teachingPoints: [
      "LEMS triad: proximal leg weakness, reduced reflexes that improve after brief exercise, and autonomic symptoms such as dry mouth.",
      "Low CMAPs with more than 100% increment after brief exercise localize to the presynaptic junction; P/Q-type VGCC antibodies support the diagnosis.",
      "In smokers, small cell lung cancer drives about half of cases: screen with CT chest at diagnosis and repeat over the following years if negative.",
    ],
  },
  speed: {
    presentation: "A 63-year-old man who has smoked since his teens has three months of increasing difficulty climbing stairs and rising from low chairs. He has lost weight and his cough has worsened.",
    highYield: ["reflexes-legs", "autonomic", "rns", "vgcc-ab"],
    explanation: "Proximal weakness with reduced reflexes that brisken after brief maximal contraction and a dry mouth is the Lambert-Eaton triad. Reflex testing before and after exercise, or repetitive stimulation showing marked post-exercise increment, separates it from myasthenia gravis and myopathy; VGCC antibodies support it. In a heavy smoker with weight loss, screen for small cell lung cancer with CT chest.",
  },
};

// ---------------------------------------------------------------------------
// S9 Cauda equina syndrome
// ---------------------------------------------------------------------------
const sCauda: CaseDef = {
  id: "s-cauda",
  version: 1,
  label: "Speed S9: back pain",
  modes: ["speed"],
  difficulty: 1,
  modules: ["c-spinal-emergencies"],
  provenance: "synthetic",
  review: "pending",
  sources: [],
  presentation: {
    age: 45,
    sex: "male",
    setting: "Emergency department",
    chiefComplaint: "Severe low back pain with pain down both legs",
    opening: "My back's been bad for years, but two days ago it got much worse, and now the pain goes down both legs.",
    vitals: "BP 148/90, HR 96, T 36.8 C, RR 18, SpO2 98% on room air",
    speaker: "patient",
  },
  history: [
    { id: "h-onset", intents: ["onset", "trauma"], say: "Two days ago I lifted a heavy box at work and felt something go in my lower back. Within hours the pain was shooting down both legs.", finding: "Acute worsening after lifting 2 days ago" },
    { id: "h-course", intents: ["course"], say: "Since last night it's been getting worse, and both legs feel weaker.", finding: "Progressing over 24 hours" },
    { id: "h-pain", intents: ["back-pain", "pain"], say: "Severe low back pain running down the back of both legs to my feet, worse on the left.", finding: "Bilateral sciatica", key: true },
    { id: "h-saddle", intents: ["numbness"], patterns: ["saddle", "bottom", "genital", "groin", "wipe", "between legs"], say: "My bottom and between my legs feel numb, like I'm sitting on a saddle. I couldn't feel the toilet paper when I wiped.", finding: "Saddle anesthesia", key: true },
    { id: "h-bladder", intents: ["bladder-bowel"], say: "Since this morning I can't pass urine properly even though I feel full, and I don't get the usual urge. I haven't opened my bowels either.", finding: "Urinary retention with loss of sensation of bladder filling", key: true },
    { id: "h-weak", intents: ["weakness"], say: "My feet feel weak, and I'm catching my toes on the floor.", finding: "Distal leg weakness" },
    { id: "h-background", intents: ["pmh", "meds", "allergies", "immunization"], say: "Just back trouble over the years. I take ibuprofen for it. No allergies.", finding: "Chronic low back pain; NSAIDs" },
    { id: "h-social", intents: ["social", "alcohol", "smoking", "recreational-drugs", "concerns"], say: "I work in a warehouse. I smoke ten a day, drink at weekends, and I've never injected drugs. My bladder frightens me.", finding: "Warehouse worker, smoker, no injection drug use" },
  ],
  defaultNegative: NEG,
  exam: [
    { maneuver: "general-appearance", finding: "In obvious pain, lying still on his side.", abnormal: true },
    { maneuver: "saddle-sensation", finding: "Reduced pinprick and light touch over the perianal and perineal skin (S3 to S5). Reduced anal tone and weak voluntary squeeze.", abnormal: true, key: true },
    { maneuver: "strength-legs", finding: "Ankle plantarflexion 4/5 bilaterally; left ankle dorsiflexion 4/5 and left great toe extension 4-/5; hip and knee strength 5/5.", abnormal: true },
    { maneuver: "reflexes-legs", finding: "Knee reflexes 2+; ankle reflexes absent bilaterally.", abnormal: true, key: true },
    { maneuver: "pinprick", finding: "Reduced pinprick on the lateral feet and soles bilaterally (S1) and the dorsum of the left foot (L5).", abnormal: true },
    { maneuver: "spine-tenderness", finding: "Lumbar paraspinal tenderness and spasm; no focal bony tenderness or deformity.", abnormal: true },
    { maneuver: "gait", finding: "Antalgic gait; cannot walk on heels or toes.", abnormal: true },
  ],
  results: [
    { investigation: "post-void-residual", summary: "Post-void residual 650 mL", values: [{ analyte: "Post-void residual", value: "650", unit: "mL", ref: "less than 100", flag: "H" }], interpretation: "Painless urinary retention, a key objective sign of cauda equina compression.", abnormal: true, key: true },
    { investigation: "mri-spine", summary: "Large central L4-L5 disc extrusion compressing the cauda equina", report: "Large central L4-L5 disc extrusion occupying most of the spinal canal and compressing the cauda equina nerve roots. Conus ends normally at L1. No epidural collection or bone lesion.", interpretation: "Confirms compressive cauda equina syndrome requiring emergency decompression.", abnormal: true, key: true },
  ],
  normalInvestigations: ["cbc", "crp-esr", "bmp", "urinalysis", "poc-glucose", "blood-cultures", "ct-head", "cxr"],
  hidden: {
    endpoint: "diagnosis",
    diagnosis: {
      full: [c("ces", "Cauda equina syndrome", ["cauda equina", "cauda equina syndrome", "ces", "cauda equina compression"])],
      partial: [
        { concept: c("conus", "Conus medullaris syndrome", ["conus medullaris", "conus"]), credit: 0.5, feedback: "Close, but the conus ends at L1. Bilateral radicular pain, asymmetric lower motor neuron signs, and an L4-L5 level point to the cauda equina." },
        { concept: c("disc", "Lumbar disc herniation", ["disc herniation", "disc prolapse", "herniated disc", "disc extrusion", "slipped disc"]), credit: 0.5, feedback: "Right cause, but name the emergency syndrome: saddle anesthesia and urinary retention mean cauda equina compression." },
        { concept: c("cord", "Spinal cord compression", ["cord compression", "spinal compression", "myelopathy"]), credit: 0.25, feedback: "A spinal emergency, but the cord ends at L1; absent ankle jerks with no sensory level indicate compression of lumbosacral roots (cauda equina)." },
        { concept: c("sciatica", "Sciatica or radiculopathy", ["sciatica", "radiculopathy"]), credit: 0.25, feedback: "Bilateral sciatica with saddle numbness and retention is not simple radiculopathy: it is cauda equina syndrome." },
      ],
      wrong: [
        { concept: c("gbs", "Guillain-Barre syndrome", ["guillain barre", "gbs"]), tag: "weak-reasoning", feedback: "Severe back pain after lifting with saddle anesthesia and retention point to compression of the lumbosacral roots." },
        { concept: c("mechanical", "Mechanical back pain", ["mechanical back pain", "muscle strain", "lumbar strain"]), tag: "unsafe-priority", feedback: "Saddle numbness and urinary retention are red flags; this is a surgical emergency." },
      ],
    },
    diagnosisLabel: "Cauda equina syndrome from a central L4-L5 disc extrusion",
    localization: { regions: ["root"], explanation: "Lumbosacral nerve roots of the cauda equina below the conus (L4-L5 level): bilateral S1 and left L5 radicular deficits, S3 to S5 saddle loss, and sphincter involvement, with lower motor neuron signs." },
    keyFindings: ["h-saddle", "h-bladder", "saddle-sensation", "post-void-residual", "mri-spine"],
    mustConsider: [
      { concept: c("mc-abscess", "Spinal epidural abscess", ["abscess", "infection"]), why: "Fever, injection drug use, or immunosuppression would raise this; inflammatory markers are normal here." },
      { concept: c("mc-tumor", "Malignant compression", ["tumor", "metastasis", "malignancy"]), why: "Consider with cancer history, weight loss, or night pain." },
      { concept: c("mc-conus", "Conus lesion", ["conus"]), why: "Image high enough to include the conus." },
    ],
    necessaryInvestigations: ["mri-spine"],
    reasonableInvestigations: ["post-void-residual", "cbc", "crp-esr"],
    harmfulActions: [{ id: "discharge-followup", why: "Delay in decompression risks permanent bladder, bowel, and sexual dysfunction." }],
    urgentActions: [
      { id: "u-mri", satisfiedBy: ["mri-spine"], label: "Emergency MRI of the lumbosacral spine", why: "Suspected cauda equina syndrome needs MRI without delay.", consequence: "Delayed diagnosis and irreversible sphincter loss." },
      { id: "u-surgery", satisfiedBy: ["neurosurgery"], label: "Emergency spinal surgical referral", why: "Prompt decompression gives the best chance of preserving sphincter function.", consequence: "Permanent sphincter and sexual dysfunction." },
      { id: "u-catheter", satisfiedBy: ["catheter"], label: "Catheterize the retained bladder", why: "A 650 mL painless retention needs decompression.", consequence: "Bladder overdistension injury." },
    ],
    leakTerms: ["cauda equina", "CES"],
    interpretationChecks: [],
    teachingPoints: [
      "Saddle anesthesia, new bladder dysfunction, and bilateral sciatica are red flags for cauda equina syndrome; ask and examine for them in every severe back pain.",
      "Painless retention with a large post-void residual is an objective sign; do not wait for incontinence.",
      "Emergency MRI and prompt surgical decompression aim to preserve sphincter function.",
    ],
  },
  speed: {
    presentation: "A 45-year-old warehouse worker has had severe low back pain shooting down both legs since lifting a heavy box two days ago. Since this morning he has had trouble passing urine.",
    highYield: ["saddle-sensation", "post-void-residual", "mri-spine"],
    explanation: "Bilateral sciatica with saddle numbness, reduced anal tone, and painless urinary retention are the signs of cauda equina compression. Testing saddle sensation and measuring the post-void residual turn suspicion into objective evidence, and emergency MRI confirms the compressing disc for urgent decompression.",
  },
};

// ---------------------------------------------------------------------------
// S10 Giant cell arteritis
// ---------------------------------------------------------------------------
const sGca: CaseDef = {
  id: "s-gca",
  version: 1,
  label: "Speed S10: new headache",
  modes: ["speed"],
  difficulty: 1,
  modules: ["c-headache"],
  provenance: "synthetic",
  review: "pending",
  sources: [],
  presentation: {
    age: 74,
    sex: "female",
    setting: "Emergency department",
    chiefComplaint: "New headache for three weeks",
    opening: "I've never been a headache person, but for three weeks I've had a headache over my right temple that won't go away.",
    vitals: "BP 148/82, HR 88, T 37.6 C, RR 16, SpO2 97% on room air",
    speaker: "patient",
  },
  history: [
    { id: "h-onset", intents: ["onset", "headache", "previous-episodes"], say: "It started about three weeks ago, over my right temple. I've never had headaches like this before.", finding: "New-onset temporal headache in a 74-year-old", key: true },
    { id: "h-course", intents: ["course"], say: "It's there most of the day and getting worse.", finding: "Persistent, worsening" },
    { id: "h-jaw", intents: ["chewing"], say: "My jaw aches when I chew meat, and I have to stop and rest it before carrying on.", finding: "Jaw claudication", key: true },
    { id: "h-scalp", intents: ["pain"], patterns: ["scalp", "comb", "brush", "tender", "temple"], say: "My scalp on the right is so tender that brushing my hair or lying on that side of the pillow hurts.", finding: "Scalp tenderness", key: true },
    { id: "h-vision", intents: ["vision", "double-vision"], say: "Twice this week the vision in my right eye went dark, like a curtain, for a minute or two and then came back. No double vision.", finding: "Transient monocular visual loss", key: true },
    { id: "h-systemic", intents: ["fever", "weight", "movements"], patterns: ["stiff", "shoulder", "hip", "morning"], say: "I've felt run down, with sweats at night, and I've lost a few pounds. My shoulders and hips are stiff for the first hour every morning.", finding: "Constitutional symptoms and polymyalgic morning stiffness" },
    { id: "h-background", intents: ["pmh", "meds", "allergies", "immunization"], say: "I have high blood pressure and osteoporosis. I take ramipril and calcium. No allergies.", finding: "Hypertension, osteoporosis" },
    { id: "h-social", intents: ["social", "alcohol", "smoking", "recreational-drugs", "concerns"], say: "I'm a retired librarian and live with my husband. I don't smoke and rarely drink. I'm frightened about my eyesight.", finding: "Retired, nonsmoker" },
  ],
  defaultNegative: NEG,
  exam: [
    { maneuver: "general-appearance", finding: "Tired-looking. The right superficial temporal artery is thickened, nodular, and tender with a reduced pulse; the right scalp is tender to touch.", abnormal: true, key: true },
  ],
  results: [
    { investigation: "crp-esr", summary: "ESR 92 mm/h and CRP 64 mg/L", values: [{ analyte: "ESR", value: "92", unit: "mm/h", ref: "0 to 42 (age adjusted)", flag: "H" }, { analyte: "CRP", value: "64", unit: "mg/L", ref: "less than 5", flag: "H" }], interpretation: "Markedly raised inflammatory markers strongly support giant cell arteritis in this setting; normal values would make it much less likely, though not impossible.", abnormal: true, key: true },
    { investigation: "cbc", summary: "Normocytic anemia and thrombocytosis", values: [{ analyte: "Hemoglobin", value: "10.9", unit: "g/dL", ref: "12.0 to 15.5", flag: "L" }, { analyte: "MCV", value: "88", unit: "fL", ref: "80 to 100" }, { analyte: "Platelets", value: "512", unit: "x10^9/L", ref: "150 to 400", flag: "H" }], interpretation: "Anemia of inflammation and reactive thrombocytosis, both common in giant cell arteritis.", abnormal: true },
    { investigation: "temporal-artery-biopsy", summary: "Granulomatous arteritis with giant cells", report: "Transmural inflammation with granulomas and multinucleated giant cells in the media, with fragmentation of the internal elastic lamina.", turnaroundMin: 4320, interpretation: "Confirms giant cell arteritis. Biopsy remains informative for days to a couple of weeks after steroids start, so treatment should never wait for it; a negative biopsy does not exclude the disease because of skip lesions.", abnormal: true, key: true },
  ],
  normalInvestigations: ["ct-head", "mri-brain", "bmp", "poc-glucose", "ecg", "tsh", "lft", "urinalysis", "cxr", "cta-head-neck"],
  hidden: {
    endpoint: "diagnosis",
    diagnosis: {
      full: [c("gca", "Giant cell arteritis", ["giant cell arteritis", "gca", "temporal arteritis", "cranial arteritis", "horton arteritis"])],
      partial: [
        { concept: c("lvv", "Vasculitis", ["large vessel vasculitis", "vasculitis", "arteritis"]), credit: 0.5, feedback: "Right category. In someone over 50 with temporal headache, jaw claudication, and visual symptoms, name it: giant cell arteritis." },
        { concept: c("pmr", "Polymyalgia rheumatica", ["polymyalgia rheumatica", "polymyalgia", "pmr"]), credit: 0.5, feedback: "Her morning shoulder and hip stiffness suggests polymyalgia, but jaw claudication, scalp tenderness, and transient visual loss mean giant cell arteritis, which threatens sight." },
      ],
      wrong: [
        { concept: c("migraine", "Migraine or tension headache", ["migraine", "tension headache", "tension type"]), tag: "unsafe-priority", feedback: "A new headache after 50 with jaw claudication and visual loss is giant cell arteritis until proven otherwise." },
        { concept: c("tn", "Trigeminal neuralgia", ["trigeminal neuralgia"]), tag: "weak-reasoning", feedback: "Trigeminal neuralgia causes brief electric shocks, not constant temporal pain with jaw claudication." },
        { concept: c("carotid", "Carotid atherosclerotic disease", ["carotid stenosis", "carotid atherosclerosis", "carotid disease"]), tag: "weak-reasoning", feedback: "Transient monocular loss in this setting, with raised inflammatory markers and jaw claudication, is arteritic ischemia; treat it as giant cell arteritis." },
      ],
    },
    diagnosisLabel: "Giant cell arteritis (temporal arteritis)",
    localization: { regions: [], explanation: "Not a neuraxis lesion: granulomatous inflammation of extracranial carotid branches, including the superficial temporal artery (headache, scalp tenderness), maxillary artery (jaw claudication), and ophthalmic and posterior ciliary arteries (transient and permanent visual loss)." },
    keyFindings: ["h-jaw", "h-vision", "h-scalp", "general-appearance", "crp-esr", "temporal-artery-biopsy"],
    mustConsider: [
      { concept: c("mc-aion", "Arteritic anterior ischemic optic neuropathy", ["ischemic optic neuropathy", "aion"]), why: "The sight-threatening complication; transient loss is a warning." },
      { concept: c("mc-pmr", "Polymyalgia rheumatica", ["polymyalgia"]), why: "Coexists in many patients." },
      { concept: c("mc-mass", "Intracranial mass", ["mass", "tumor"]), why: "Any new headache after 50 warrants considering structural causes." },
    ],
    necessaryInvestigations: ["crp-esr", "temporal-artery-biopsy"],
    reasonableInvestigations: ["cbc"],
    harmfulActions: [{ id: "discharge-followup", why: "Discharging without starting steroids risks permanent, often bilateral, blindness." }],
    urgentActions: [
      { id: "u-steroids", satisfiedBy: ["high-dose-steroids"], label: "Start high-dose corticosteroids immediately, before biopsy", why: "Transient visual loss signals imminent permanent blindness; steroids prevent it and do not prevent a diagnostic biopsy within the next days.", consequence: "Permanent visual loss, which may become bilateral." },
    ],
    leakTerms: ["giant cell arteritis", "temporal arteritis", "arteritis", "GCA", "vasculitis", "polymyalgia"],
    interpretationChecks: [],
    teachingPoints: [
      "Any new headache after 50 should prompt questions about jaw claudication, scalp tenderness, visual symptoms, and polymyalgia, and an ESR and CRP.",
      "Start steroids at once when giant cell arteritis is suspected, especially with visual symptoms; biopsy or vascular imaging confirms it but must not delay treatment.",
      "Temporal artery biopsy can miss skip lesions; ultrasound of the temporal arteries is an alternative confirmatory test in experienced centers.",
    ],
  },
  speed: {
    presentation: "A 74-year-old woman has a new headache over her right temple for three weeks. Twice this week the vision in her right eye went dark for a minute or two.",
    highYield: ["chewing", "crp-esr"],
    explanation: "A new headache after 50 with jaw claudication, scalp tenderness, and transient monocular visual loss is giant cell arteritis until proven otherwise. Asking about chewing and checking ESR and CRP are the most discriminating requests. Steroids start immediately, without waiting for biopsy or imaging, to prevent permanent blindness.",
  },
};

// ---------------------------------------------------------------------------
// S11 Idiopathic intracranial hypertension
// ---------------------------------------------------------------------------
const sIih: CaseDef = {
  id: "s-iih",
  version: 1,
  label: "Speed S11: headaches and blurred vision",
  modes: ["speed"],
  difficulty: 2,
  modules: ["c-headache"],
  provenance: "synthetic",
  review: "pending",
  sources: [],
  presentation: {
    age: 27,
    sex: "female",
    setting: "Neurology urgent clinic",
    chiefComplaint: "Daily headaches and brief dimming of vision",
    opening: "I've had headaches nearly every day for two months, and my vision keeps going grey for a few seconds.",
    vitals: "BP 124/80, HR 78, T 36.7 C, RR 14, SpO2 99% on room air. BMI 38",
    speaker: "patient",
  },
  history: [
    { id: "h-onset", intents: ["onset", "headache", "triggers", "pain"], say: "I've had headaches almost every day for about two months. They're worse when I wake up and when I bend over or cough.", finding: "Daily headache for 2 months, worse lying, bending, coughing", key: true },
    { id: "h-course", intents: ["course"], say: "They've been getting gradually worse.", finding: "Progressive" },
    { id: "h-vision", intents: ["vision"], say: "Several times a day my vision greys out in both eyes for a few seconds, especially when I stand up or bend down.", finding: "Transient visual obscurations", key: true },
    { id: "h-diplopia", intents: ["double-vision"], say: "Sometimes I see double when I look at something far away, with the images side by side.", finding: "Horizontal diplopia at distance" },
    { id: "h-hearing", intents: ["hearing"], say: "I hear a whooshing in both ears in time with my heartbeat, worse at night.", finding: "Pulsatile tinnitus", key: true },
    { id: "h-nausea", intents: ["nausea"], say: "I sometimes feel sick with the headaches but I haven't vomited.", finding: "Nausea without vomiting" },
    { id: "h-background", intents: ["pmh", "meds", "allergies", "immunization", "weight", "pregnancy"], say: "I've put on about 25 pounds over the last year. I'm otherwise healthy. I take the combined contraceptive pill and acetaminophen for the headaches. No allergies. I'm not pregnant; my period was last week.", finding: "Recent weight gain; combined oral contraceptive; analgesic use" },
    { id: "h-social", intents: ["social", "alcohol", "smoking", "recreational-drugs", "concerns"], say: "I work in a call center. I don't smoke, I drink occasionally, and no drugs. I'm scared I have a brain tumor.", finding: "Call center worker; nonsmoker" },
  ],
  defaultNegative: NEG,
  exam: [
    { maneuver: "fundoscopy", finding: "Bilateral optic disc swelling with blurred margins, obscuration of vessels at the disc edge, peripapillary hemorrhages, and absent spontaneous venous pulsations.", abnormal: true, key: true },
    { maneuver: "visual-fields", finding: "Enlarged blind spots bilaterally; fields otherwise full to confrontation.", abnormal: true },
    { maneuver: "eye-movements", finding: "Mild bilateral abduction deficit with horizontal diplopia at distance. No nystagmus.", abnormal: true },
  ],
  results: [
    { investigation: "mri-brain", summary: "No mass or hydrocephalus; signs of raised pressure; no venous sinus thrombosis", report: "No mass, hydrocephalus, or hemorrhage. Partially empty sella, flattening of the posterior globes, and distended optic nerve sheaths. MR venography acquired in the same session shows no venous sinus thrombosis, with smooth narrowing of both distal transverse sinuses.", interpretation: "Excludes a mass, hydrocephalus, and venous sinus thrombosis, and shows indirect signs of raised intracranial pressure typical of idiopathic intracranial hypertension.", abnormal: true, key: true },
    { investigation: "mri-brain-gad", summary: "No enhancing lesion; no venous sinus thrombosis", report: "No enhancing lesion or meningeal enhancement. Flattened posterior globes and distended optic nerve sheaths. Contrast venography: venous sinuses patent, with bilateral distal transverse sinus narrowing.", interpretation: "Same conclusion as noncontrast MRI with venography: no secondary cause found.", abnormal: true },
    { investigation: "lp-basic", summary: "Opening pressure 38 cm H2O with normal CSF", values: [{ analyte: "Opening pressure (lateral decubitus)", value: "38", unit: "cm H2O", ref: "10 to 25", flag: "H" }, { analyte: "White cells", value: "1", unit: "/uL", ref: "0 to 5" }, { analyte: "Protein", value: "22", unit: "mg/dL", ref: "15 to 45" }, { analyte: "Glucose", value: "60", unit: "mg/dL", ref: "40 to 70" }], interpretation: "Raised opening pressure with normal CSF contents, after normal imaging including venography, completes the criteria for idiopathic intracranial hypertension.", abnormal: true, key: true },
  ],
  normalInvestigations: ["ct-head", "cbc", "bmp", "coag", "pregnancy-test", "mra-head-neck", "crp-esr", "tsh", "poc-glucose"],
  hidden: {
    endpoint: "diagnosis",
    diagnosis: {
      full: [c("iih", "Idiopathic intracranial hypertension", ["idiopathic intracranial hypertension", "iih", "pseudotumor cerebri", "pseudotumour cerebri", "benign intracranial hypertension", "pseudotumor"])],
      partial: [
        { concept: c("icp", "Raised intracranial pressure", ["intracranial hypertension", "raised intracranial pressure", "raised icp", "elevated intracranial pressure", "increased intracranial pressure", "papilledema"]), credit: 0.5, feedback: "Right physiology. With normal imaging including venography and normal CSF contents, the cause is idiopathic intracranial hypertension." },
      ],
      wrong: [
        { concept: c("cvst", "Cerebral venous sinus thrombosis", ["venous sinus thrombosis", "cvst", "cvt", "cerebral venous thrombosis", "sinus thrombosis"]), tag: "weak-reasoning", feedback: "Venous sinus thrombosis mimics this exactly and must be excluded first, but venography here is normal." },
        { concept: c("tumor", "Brain tumor", ["brain tumor", "tumor", "mass lesion", "glioma"]), tag: "weak-reasoning", feedback: "Imaging shows no mass." },
        { concept: c("migraine", "Migraine or medication overuse headache", ["migraine", "medication overuse", "tension headache"]), tag: "unsafe-priority", feedback: "Papilledema is never explained by a primary headache; untreated raised pressure threatens vision." },
      ],
    },
    diagnosisLabel: "Idiopathic intracranial hypertension (pseudotumor cerebri)",
    localization: { regions: [], explanation: "No focal lesion: globally raised intracranial pressure transmitted along the optic nerve sheaths (papilledema). The abducens palsy is a false localizing sign from stretch of the nerve." },
    keyFindings: ["fundoscopy", "h-vision", "h-hearing", "mri-brain", "lp-basic"],
    mustConsider: [
      { concept: c("mc-cvst", "Cerebral venous sinus thrombosis", ["venous sinus thrombosis", "cvst", "cvt"]), why: "Identical presentation and the combined pill is a risk factor; venography is mandatory before diagnosing IIH." },
      { concept: c("mc-mass", "Mass lesion or hydrocephalus", ["mass", "tumor", "hydrocephalus"]), why: "Image before LP in anyone with papilledema." },
      { concept: c("mc-secondary", "Secondary causes", ["tetracycline", "vitamin a", "anemia", "sleep apnea"]), why: "Drugs (tetracyclines, vitamin A derivatives), anemia, and sleep apnea can raise intracranial pressure." },
    ],
    necessaryInvestigations: ["mri-brain", "lp-basic"],
    reasonableInvestigations: ["mri-brain-gad", "cbc", "pregnancy-test"],
    harmfulActions: [],
    urgentActions: [
      { id: "u-imaging", satisfiedBy: ["mri-brain", "mri-brain-gad"], label: "Brain imaging with venography before lumbar puncture", why: "Papilledema requires exclusion of mass, hydrocephalus, and venous sinus thrombosis before LP and before diagnosing IIH.", consequence: "Missed venous sinus thrombosis or mass." },
    ],
    leakTerms: ["idiopathic intracranial hypertension", "intracranial hypertension", "pseudotumor", "IIH", "papilledema"],
    interpretationChecks: [
      { id: "ic-lp", investigation: "lp-basic", question: "What does the lumbar puncture show and what does it mean here?", answer: { full: [c("ic-op", "Raised opening pressure with normal contents", ["raised opening pressure + normal", "elevated opening pressure + normal", "high opening pressure + normal", "increased opening pressure + normal"])] }, modelAnswer: "Raised opening pressure with normal CSF contents, which after normal imaging and venography supports idiopathic intracranial hypertension." },
    ],
    teachingPoints: [
      "Papilledema with headache, transient visual obscurations, and pulsatile tinnitus in a young woman with recent weight gain suggests IIH.",
      "IIH is a diagnosis of exclusion: MRI with venography (to exclude venous sinus thrombosis and mass) comes first, then LP showing raised opening pressure with normal contents.",
      "The main harm is visual loss; serial visual fields and acuity guide treatment urgency.",
    ],
  },
  speed: {
    presentation: "A 27-year-old woman has had daily headaches for two months, worse on waking and on bending. Several times a day her vision greys out for a few seconds.",
    highYield: ["fundoscopy", "mri-brain", "lp-basic"],
    explanation: "Headache with transient visual obscurations and bilateral papilledema means raised intracranial pressure. MRI with venography excludes a mass and venous sinus thrombosis, and LP shows a raised opening pressure with normal CSF contents. In a young woman with recent weight gain that completes the diagnosis of idiopathic intracranial hypertension.",
  },
};

// ---------------------------------------------------------------------------
// S12 Subarachnoid hemorrhage
// ---------------------------------------------------------------------------
const sSah: CaseDef = {
  id: "s-sah",
  version: 1,
  label: "Speed S12: sudden headache",
  modes: ["speed"],
  difficulty: 1,
  modules: ["c-ich-sah"],
  provenance: "synthetic",
  review: "pending",
  sources: [],
  presentation: {
    age: 48,
    sex: "female",
    setting: "Emergency department",
    chiefComplaint: "Sudden severe headache two hours ago",
    opening: "Two hours ago I got the worst headache of my life, out of nowhere, while I was lifting shopping out of the car.",
    vitals: "BP 178/96, HR 64, T 37.2 C, RR 18, SpO2 98% on room air",
    speaker: "patient",
  },
  history: [
    { id: "h-onset", intents: ["onset", "headache", "pain"], patterns: ["worst", "thunderclap", "peak", "how quickly"], say: "It was like being hit on the back of the head with a bat. It was at full strength within a few seconds, about two hours ago.", finding: "Thunderclap headache peaking within seconds", key: true },
    { id: "h-course", intents: ["course"], say: "It hasn't eased at all. It's still the worst pain I've ever had.", finding: "Persistent severe headache" },
    { id: "h-nausea", intents: ["nausea"], say: "I've vomited twice.", finding: "Vomiting" },
    { id: "h-neck", intents: ["neck-stiffness", "back-pain"], say: "My neck feels stiff and sore at the back.", finding: "Neck stiffness", key: true },
    { id: "h-light", intents: ["photophobia"], say: "The light really hurts my eyes.", finding: "Photophobia" },
    { id: "h-loc", intents: ["consciousness"], say: "My husband says I went blank for a few seconds right at the start, but I didn't fall.", finding: "Brief loss of awareness at onset" },
    { id: "h-background", intents: ["pmh", "meds", "allergies", "immunization", "previous-episodes"], say: "I have high blood pressure and take amlodipine, though I sometimes forget it. I get the odd mild migraine, but this is completely different. No allergies.", finding: "Hypertension with poor adherence; mild migraines, this headache different" },
    { id: "h-social", intents: ["social", "alcohol", "smoking", "recreational-drugs", "concerns"], say: "I'm a bus driver. I smoke about 15 a day and drink at weekends. No drugs. Am I going to be OK?", finding: "Smoker" },
  ],
  defaultNegative: NEG,
  exam: [
    { maneuver: "general-appearance", finding: "In severe distress, lying still with eyes shut against the light; vomited once during the assessment.", abnormal: true },
    { maneuver: "neck-stiffness", finding: "Neck stiffness on passive flexion.", abnormal: true, key: true },
    { maneuver: "kernig-brudzinski", finding: "Kernig sign positive.", abnormal: true },
    { maneuver: "fundoscopy", finding: "No papilledema. A small preretinal (subhyaloid) hemorrhage near the right disc.", abnormal: true },
  ],
  results: [
    { investigation: "ct-head", summary: "Blood in the basal cisterns and Sylvian fissures", report: "Diffuse hyperdensity in the basal cisterns and both Sylvian fissures, more on the left, with mild dilatation of the temporal horns. No intraparenchymal hematoma.", turnaroundMin: 20, interpretation: "Diffuse subarachnoid blood in a basal pattern typical of aneurysmal rupture. CT within 6 hours of onset is highly sensitive; early hydrocephalus is developing.", abnormal: true, key: true },
    { investigation: "cta-head-neck", summary: "6 mm anterior communicating artery aneurysm", report: "A 6 mm saccular aneurysm of the anterior communicating artery. No other aneurysm or vascular malformation.", interpretation: "Identifies the probable source of hemorrhage for urgent securing.", abnormal: true, key: true },
    { investigation: "lp-basic", summary: "Heavily bloodstained CSF without clearing", values: [{ analyte: "Opening pressure", value: "27", unit: "cm H2O", ref: "10 to 25", flag: "H" }, { analyte: "Red cells, tube 1", value: "18000", unit: "/uL", ref: "0", flag: "H" }, { analyte: "Red cells, tube 4", value: "17500", unit: "/uL", ref: "0", flag: "H" }], interpretation: "Uniform blood across tubes supports hemorrhage rather than a traumatic tap. Xanthochromia is unreliable under 12 hours from onset. LP is unnecessary once CT shows blood.", abnormal: true },
    { investigation: "ecg", summary: "Sinus rhythm with deep T-wave inversion", report: "Sinus rhythm, rate 62. Deep symmetric T-wave inversion in V2 to V5; QTc 480 ms.", interpretation: "Neurogenic ECG changes are common after subarachnoid hemorrhage and should not divert attention to a cardiac cause.", abnormal: true },
  ],
  normalInvestigations: ["cbc", "bmp", "coag", "poc-glucose", "cxr", "tox-screen"],
  hidden: {
    endpoint: "diagnosis",
    diagnosis: {
      full: [c("sah", "Subarachnoid hemorrhage", ["subarachnoid hemorrhage", "sah", "subarachnoid bleed", "aneurysmal subarachnoid", "subarachnoid"])],
      partial: [
        { concept: c("ruptured", "Ruptured aneurysm", ["ruptured aneurysm", "aneurysm rupture", "ruptured berry aneurysm", "aneurysm"]), credit: 0.75, feedback: "Right cause. Name the event: subarachnoid hemorrhage, which drives the immediate tests (CT) and management." },
        { concept: c("bleed", "Intracranial hemorrhage", ["brain bleed", "intracranial hemorrhage", "intracranial bleed"]), credit: 0.5, feedback: "Be specific: a thunderclap headache with meningism and no focal deficit is subarachnoid hemorrhage." },
      ],
      overlySpecific: [
        { concept: c("acom", "Anterior communicating artery aneurysm", ["anterior communicating", "acom", "acomm"]), credit: 0.75, feedback: "The aneurysm site can only be identified by angiography. Name the hemorrhage first: subarachnoid hemorrhage." },
      ],
      wrong: [
        { concept: c("migraine", "Migraine", ["migraine"]), tag: "unsafe-priority", feedback: "A headache that peaks within seconds is a thunderclap headache, not migraine, and needs CT and, if negative, LP." },
        { concept: c("rcvs", "Reversible cerebral vasoconstriction syndrome", ["rcvs", "reversible cerebral vasoconstriction"]), tag: "weak-reasoning", feedback: "RCVS causes recurrent thunderclap headaches and may cause convexity hemorrhage, but a single sudden headache with meningism needs CT for subarachnoid hemorrhage first." },
        { concept: c("meningitis", "Meningitis", ["meningitis"]), tag: "weak-reasoning", feedback: "Meningitis builds over hours to days with fever; this headache peaked within seconds." },
        { concept: c("ich", "Intracerebral hemorrhage", ["intracerebral hemorrhage", "ich", "intraparenchymal hemorrhage"]), tag: "weak-reasoning", feedback: "Intracerebral hemorrhage usually causes a focal deficit; she has meningism without focal signs." },
      ],
    },
    diagnosisLabel: "Aneurysmal subarachnoid hemorrhage",
    localization: { regions: [], explanation: "Blood in the subarachnoid space (basal cisterns and Sylvian fissures) rather than in brain parenchyma; meningeal irritation explains the neck stiffness and photophobia." },
    keyFindings: ["h-onset", "neck-stiffness", "ct-head", "cta-head-neck"],
    mustConsider: [
      { concept: c("mc-rcvs", "RCVS", ["rcvs", "vasoconstriction"]), why: "Another cause of thunderclap headache, often recurrent." },
      { concept: c("mc-cvt", "Cerebral venous thrombosis", ["venous thrombosis", "cvt", "cvst"]), why: "Can present with sudden headache." },
      { concept: c("mc-dissection", "Cervical artery dissection", ["dissection"]), why: "Sudden head or neck pain." },
      { concept: c("mc-apoplexy", "Pituitary apoplexy", ["apoplexy"]), why: "Thunderclap headache with visual or eye movement signs." },
    ],
    necessaryInvestigations: ["ct-head", "cta-head-neck"],
    reasonableInvestigations: ["ecg", "coag", "cbc", "bmp"],
    harmfulActions: [
      { id: "antiplatelet", why: "Antiplatelet therapy increases bleeding in an unsecured ruptured aneurysm." },
      { id: "anticoagulation", why: "Anticoagulation risks catastrophic rebleeding." },
      { id: "thrombolysis", why: "Thrombolysis is contraindicated in intracranial hemorrhage." },
      { id: "discharge-followup", why: "Missed subarachnoid hemorrhage carries a high risk of fatal rebleeding." },
    ],
    urgentActions: [
      { id: "u-ct", satisfiedBy: ["ct-head"], label: "Emergency noncontrast CT head", why: "Thunderclap headache needs immediate CT; sensitivity is highest in the first 6 hours.", consequence: "Missed hemorrhage and rebleeding." },
      { id: "u-neurosurg", satisfiedBy: ["neurosurgery"], label: "Urgent neurosurgical or neurovascular referral", why: "Early aneurysm securing prevents rebleeding, which is most likely in the first day.", consequence: "Rebleeding with high mortality." },
      { id: "u-bp", satisfiedBy: ["bp-lowering"], label: "Control blood pressure until the aneurysm is secured", why: "Marked hypertension may increase rebleeding risk.", consequence: "Rebleeding." },
    ],
    leakTerms: ["subarachnoid", "SAH", "aneurysm", "hemorrhage", "bleed"],
    interpretationChecks: [],
    teachingPoints: [
      "A headache reaching maximal intensity within a minute is a thunderclap headache and needs CT head immediately.",
      "CT within 6 hours of onset is highly sensitive; if CT is negative and suspicion remains, LP (with xanthochromia after 12 hours) or CTA is needed.",
      "Avoid antithrombotics, control blood pressure, and secure the aneurysm early to prevent rebleeding.",
    ],
  },
  speed: {
    presentation: "A 48-year-old woman developed a sudden, explosive headache two hours ago while lifting shopping, the worst of her life. She has vomited twice and light hurts her eyes.",
    highYield: ["ct-head", "onset", "lp-basic"],
    explanation: "A headache at maximal intensity within seconds (thunderclap) with vomiting, photophobia, and neck stiffness is subarachnoid hemorrhage until proven otherwise. Confirming the onset tempo and requesting a noncontrast CT head are the highest-yield moves; CT within 6 hours is highly sensitive, and LP is the fallback if CT is negative. CTA then finds the aneurysm for urgent securing.",
  },
};

// ---------------------------------------------------------------------------
// S13 HSV encephalitis
// ---------------------------------------------------------------------------
const sHsv: CaseDef = {
  id: "s-hsv",
  version: 1,
  label: "Speed S13: fever and confusion",
  modes: ["speed"],
  difficulty: 1,
  modules: ["c-encephalitis-viral"],
  provenance: "synthetic",
  review: "pending",
  sources: ["venkatesan2013-iec", "tunkel2008-idsa-enceph"],
  presentation: {
    age: 58,
    sex: "male",
    setting: "Emergency department",
    chiefComplaint: "Fever and odd behavior",
    opening: "My husband has had a fever for three days, and since yesterday he's been saying strange things and getting muddled.",
    vitals: "BP 138/84, HR 108, T 38.9 C, RR 18, SpO2 97% on room air",
    speaker: "family",
    speakerNote: "His wife answers; he is too confused to give a reliable history.",
  },
  history: [
    { id: "h-onset", intents: ["onset"], say: "Three days ago he came down with a fever and a headache. Yesterday he started saying odd things.", finding: "Febrile prodrome then behavioral change over 3 days", key: true },
    { id: "h-course", intents: ["course"], say: "Today he's much more muddled and drowsy.", finding: "Progressive encephalopathy" },
    { id: "h-confusion", intents: ["confusion"], say: "He can't remember things we told him a few minutes ago, and he didn't know where we were this morning.", finding: "Memory impairment and disorientation", key: true },
    { id: "h-behavior", intents: ["behavior", "speech"], patterns: ["smell", "burning"], say: "He's been irritable and acting strangely, and he said he could smell burning rubber when there was nothing there. His words come out wrong; he called his phone a clock.", finding: "Personality change, olfactory hallucinations, paraphasic speech", key: true },
    { id: "h-seizure", intents: ["seizure"], say: "This morning he stared, smacked his lips, and didn't respond to me for about a minute.", finding: "Focal impaired awareness seizure", key: true },
    { id: "h-fever", intents: ["fever", "headache", "pain"], say: "He's been hot and shivery, and he's complained of a headache since it started.", finding: "Fever and headache" },
    { id: "h-background", intents: ["pmh", "meds", "allergies", "immunization"], say: "He's generally healthy. He just takes a statin for cholesterol. No allergies.", finding: "Hyperlipidemia on statin; immunocompetent" },
    { id: "h-social", intents: ["social", "alcohol", "smoking", "recreational-drugs", "concerns", "contacts"], say: "He's an engineer. He doesn't smoke, has a beer now and then, and no drugs. Nobody else at home is ill. I'm terrified.", finding: "Engineer; no sick contacts" },
  ],
  defaultNegative: NEG_FAMILY,
  exam: [
    { maneuver: "general-appearance", finding: "Flushed, febrile, and restless.", abnormal: true },
    { maneuver: "consciousness", finding: "Drowsy, opens eyes to voice. GCS 13 (E3 V4 M6).", abnormal: true, key: true },
    { maneuver: "orientation", finding: "Disoriented to place and time.", abnormal: true },
    { maneuver: "attention", finding: "Cannot sustain attention to say the months backward.", abnormal: true },
    { maneuver: "memory", finding: "Unable to register or recall 3 words.", abnormal: true },
    { maneuver: "language", finding: "Fluent speech with frequent word substitutions and impaired naming; comprehension partly impaired.", abnormal: true, key: true },
    { maneuver: "visual-fields", finding: "Possible right upper quadrant field defect to threat; limited by attention.", abnormal: true },
  ],
  results: [
    { investigation: "lp-basic", summary: "Lymphocytic pleocytosis with raised protein and normal glucose", values: [{ analyte: "Opening pressure", value: "24", unit: "cm H2O", ref: "10 to 25" }, { analyte: "White cells", value: "160", unit: "/uL", ref: "0 to 5", flag: "H" }, { analyte: "Lymphocytes", value: "88", unit: "%" }, { analyte: "Red cells", value: "220", unit: "/uL", ref: "0", flag: "H" }, { analyte: "Protein", value: "92", unit: "mg/dL", ref: "15 to 45", flag: "H" }, { analyte: "Glucose", value: "62", unit: "mg/dL", ref: "40 to 70 (serum 110)" }], interpretation: "A viral pattern (lymphocytic pleocytosis, raised protein, normal glucose); red cells reflect hemorrhagic necrosis. This supports encephalitis; PCR identifies the cause.", abnormal: true, key: true },
    { investigation: "csf-hsv-pcr", summary: "HSV-1 DNA detected", values: [{ analyte: "HSV-1 DNA (PCR)", value: "Detected", flag: "H" }, { analyte: "HSV-2 DNA (PCR)", value: "Not detected" }], interpretation: "Confirms HSV-1 encephalitis. PCR can be falsely negative in the first 72 hours; repeat it if suspicion remains, and keep acyclovir going meanwhile.", abnormal: true, key: true },
    { investigation: "mri-brain", summary: "Left medial temporal, insular, and inferior frontal signal change", report: "Asymmetric T2/FLAIR hyperintensity with restricted diffusion in the left medial temporal lobe, insula, and orbitofrontal cortex, with petechial hemorrhage. No mass effect.", interpretation: "The typical limbic distribution of HSV encephalitis.", abnormal: true, key: true },
    { investigation: "eeg-routine", summary: "Left temporal periodic discharges", report: "Left temporal lateralized periodic discharges at about 1 Hz on a diffusely slow background. No electrographic seizure during the recording.", schematic: { kind: "eeg", pattern: "lpds" }, interpretation: "Lateralized periodic discharges over a temporal lobe are typical of HSV encephalitis and indicate seizure risk.", abnormal: true },
    { investigation: "ct-head", summary: "Subtle left temporal hypodensity; no mass effect", report: "Subtle hypodensity in the left anterior temporal lobe. No mass effect, hemorrhage, or hydrocephalus.", interpretation: "CT is insensitive early; no contraindication to LP.", abnormal: true },
  ],
  normalInvestigations: ["cbc", "bmp", "blood-cultures", "poc-glucose", "tox-screen", "hiv", "cxr", "urinalysis", "csf-crypto-ag", "csf-autoimmune-panel", "coag", "ammonia"],
  hidden: {
    endpoint: "diagnosis",
    diagnosis: {
      full: [c("hsve", "HSV encephalitis", ["herpes simplex encephalitis", "hsv encephalitis", "herpes encephalitis", "herpes simplex virus encephalitis", "hsv 1 encephalitis", "hsv1 encephalitis", "hsve", "herpetic encephalitis"])],
      partial: [
        { concept: c("viral", "Viral encephalitis", ["viral encephalitis", "infectious encephalitis", "viral meningoencephalitis"]), credit: 0.75, feedback: "Right syndrome. Temporal lobe features with a febrile encephalopathy make herpes simplex the cause to name and treat at once." },
        { concept: c("enceph", "Encephalitis", ["encephalitis", "meningoencephalitis"]), credit: 0.5, feedback: "Right syndrome. Name the most important cause: HSV encephalitis, which needs immediate acyclovir." },
      ],
      wrong: [
        { concept: c("bacterial", "Bacterial meningitis", ["bacterial meningitis", "meningococcal"]), tag: "weak-reasoning", feedback: "Bacterial meningitis is reasonable to cover empirically, but prominent temporal lobe features with lymphocytic CSF and normal glucose point to viral encephalitis." },
        { concept: c("ae", "Autoimmune encephalitis", ["autoimmune encephalitis", "anti nmda", "nmda receptor", "limbic encephalitis autoimmune"]), tag: "weak-reasoning", feedback: "Autoimmune encephalitis is on the differential, but fever with an acute temporal encephalitis is HSV until PCR excludes it." },
        { concept: c("delirium", "Delirium from systemic infection", ["delirium", "sepsis", "urinary tract infection"]), tag: "unsafe-priority", feedback: "Aphasia, olfactory hallucinations, and a focal seizure are focal cortical signs, not simple delirium." },
        { concept: c("stroke", "Stroke", ["stroke"]), tag: "weak-reasoning", feedback: "Fever with a three-day evolving encephalopathy and seizures fits encephalitis." },
      ],
    },
    diagnosisLabel: "Herpes simplex virus encephalitis",
    localization: { regions: ["cortex-left"], explanation: "Left medial temporal and inferior frontal (limbic) cortex: memory loss, olfactory hallucinations, behavioral change, paraphasias (dominant temporal), focal seizures, and a contralateral upper quadrant field defect from Meyer loop." },
    keyFindings: ["h-behavior", "h-seizure", "language", "lp-basic", "csf-hsv-pcr", "mri-brain"],
    mustConsider: [
      { concept: c("mc-bacterial", "Bacterial meningitis", ["bacterial meningitis"]), why: "Cover empirically until CSF excludes it if the picture is unclear." },
      { concept: c("mc-ae", "Autoimmune encephalitis", ["autoimmune"]), why: "Can follow HSV encephalitis (anti-NMDA receptor) or mimic it." },
      { concept: c("mc-other", "Other viral or opportunistic causes", ["vzv", "enterovirus", "west nile", "hiv"]), why: "Consider with exposure history or immunosuppression." },
    ],
    necessaryInvestigations: ["lp-basic", "csf-hsv-pcr", "mri-brain"],
    reasonableInvestigations: ["eeg-routine", "ct-head", "hiv", "blood-cultures"],
    harmfulActions: [{ id: "discharge-followup", why: "Untreated HSV encephalitis has high mortality and severe disability." }],
    urgentActions: [
      { id: "u-acyclovir", satisfiedBy: ["acyclovir"], label: "Start empiric IV acyclovir immediately", why: "Delay beyond the first hours worsens outcome; do not wait for PCR or MRI.", consequence: "Higher mortality and permanent memory and language deficits." },
    ],
    leakTerms: ["herpes", "HSV", "encephalitis", "herpes simplex"],
    interpretationChecks: [
      { id: "ic-csf", investigation: "lp-basic", question: "What pattern does the CSF show?", answer: { full: [c("ic-lymph", "Lymphocytic pleocytosis", ["lymphocytic pleocytosis", "lymphocyte predominant", "lymphocytic"])] }, modelAnswer: "Lymphocytic pleocytosis with raised protein and normal glucose, a viral pattern consistent with HSV encephalitis." },
    ],
    teachingPoints: [
      "Fever plus altered behavior, aphasia, olfactory hallucinations, or focal seizures suggests temporal lobe encephalitis: start IV acyclovir immediately.",
      "CSF HSV PCR confirms the diagnosis; an early negative result does not exclude it, so repeat it if suspicion remains.",
      "MRI with medial temporal and insular involvement and temporal periodic discharges on EEG support the diagnosis.",
    ],
  },
  speed: {
    presentation: "A 58-year-old man has had fever and headache for three days, and since yesterday he has been confused, irritable, and saying odd things. This morning his wife saw him stare and smack his lips for a minute.",
    highYield: ["csf-hsv-pcr", "mri-brain", "lp-basic"],
    explanation: "Fever with behavioral change, word-finding errors, olfactory hallucinations, and a focal seizure localizes to the temporal lobe and means HSV encephalitis until proven otherwise. CSF shows a lymphocytic pleocytosis, HSV PCR confirms the virus, and MRI shows the typical medial temporal changes. Acyclovir starts immediately, before any result returns.",
  },
};

// ---------------------------------------------------------------------------
// S14 Central acute vestibular syndrome (posterior circulation stroke)
// ---------------------------------------------------------------------------
const sVertigo: CaseDef = {
  id: "s-vertigo",
  version: 1,
  label: "Speed S14: dizziness and vomiting",
  modes: ["speed"],
  difficulty: 3,
  modules: ["c-vertigo-vision"],
  provenance: "synthetic",
  review: "pending",
  sources: ["kattah2009-hints"],
  presentation: {
    age: 67,
    sex: "male",
    setting: "Emergency department",
    chiefComplaint: "Constant spinning and vomiting for five hours",
    opening: "About five hours ago the room started spinning, and it hasn't stopped. I can't stop being sick.",
    vitals: "BP 186/98, HR 84, T 36.7 C, RR 16, SpO2 97% on room air",
    speaker: "patient",
  },
  history: [
    { id: "h-onset", intents: ["onset"], say: "It came on suddenly about five hours ago while I was sitting watching TV.", finding: "Abrupt onset 5 hours ago at rest", key: true },
    { id: "h-course", intents: ["course", "triggers"], say: "It's been constant ever since. Moving my head makes me feel sicker, but the spinning never stops, even when I keep perfectly still.", finding: "Continuous vertigo, worse with head movement but present at rest", key: true },
    { id: "h-dizzy", intents: ["dizziness", "coordination"], say: "Everything spins, and I can't walk without falling to one side. I couldn't even stand up on my own.", finding: "Severe vertigo with inability to stand or walk", key: true },
    { id: "h-nausea", intents: ["nausea"], say: "I've been sick several times.", finding: "Repeated vomiting" },
    { id: "h-headache", intents: ["headache", "pain"], say: "There's a mild ache at the back of my head.", finding: "Mild occipital headache" },
    { id: "h-background", intents: ["pmh", "meds", "allergies", "immunization"], say: "I have high blood pressure, type 2 diabetes, and high cholesterol. I take metformin, lisinopril, and atorvastatin. No allergies.", finding: "Hypertension, diabetes, hyperlipidemia" },
    { id: "h-social", intents: ["social", "alcohol", "smoking", "recreational-drugs", "concerns"], say: "I'm a retired electrician. I smoked for 40 years and still have a few a day. A couple of beers a week, no drugs. I thought it was just an inner ear thing.", finding: "Current smoker" },
  ],
  defaultNegative: NEG,
  exam: [
    { maneuver: "general-appearance", finding: "Pale and sweaty, lying still with eyes closed, vomiting into a bowl.", abnormal: true },
    { maneuver: "hints", finding: "Head impulse test normal in both directions, with no corrective saccade. Nystagmus is left-beating on left gaze and right-beating on right gaze (direction-changing). Alternate cover test shows a small vertical refixation (skew deviation). This is a central pattern.", abnormal: true, key: true },
    { maneuver: "eye-movements", finding: "Full range. Horizontal gaze-evoked nystagmus that changes direction with gaze. Small vertical skew on cover testing.", abnormal: true, key: true },
    { maneuver: "gait", finding: "Cannot stand or walk unaided; falls to the left.", abnormal: true, key: true },
    { maneuver: "tandem", finding: "Unable to attempt.", abnormal: true },
    { maneuver: "romberg", finding: "Cannot stand with feet together, even with eyes open.", abnormal: true },
  ],
  results: [
    { investigation: "mri-brain", summary: "Acute infarct in the left inferior cerebellum", report: "Acute restricted diffusion in the left inferior cerebellar hemisphere and inferior vermis (medial posterior inferior cerebellar artery territory). No hemorrhage. Mild local swelling without fourth ventricle compression.", interpretation: "Confirms posterior circulation stroke. Early diffusion MRI can be falsely negative in the first 48 hours, which is why a central HINTS pattern should not be overridden by a normal scan.", abnormal: true, key: true },
    { investigation: "ct-head", summary: "No hemorrhage; posterior fossa poorly seen", report: "No hemorrhage or mass. Posterior fossa partly obscured by bone artifact; no definite infarct.", interpretation: "CT is insensitive for posterior fossa infarction; a normal CT does not exclude stroke.", abnormal: false },
    { investigation: "cta-head-neck", summary: "Severe left distal vertebral stenosis", report: "Severe stenosis of the left V4 vertebral segment with nonopacification of the left posterior inferior cerebellar artery origin. Basilar artery patent.", interpretation: "Atherosclerotic vertebral disease is the likely mechanism; the basilar artery is open.", abnormal: true },
    { investigation: "poc-glucose", summary: "Glucose 168 mg/dL", values: [{ analyte: "Glucose", value: "168", unit: "mg/dL", ref: "70 to 140", flag: "H" }], interpretation: "Mild hyperglycemia; not a cause of vertigo.", abnormal: true },
  ],
  normalInvestigations: ["cbc", "bmp", "coag", "ecg", "crp-esr", "tox-screen", "cardiac-monitoring"],
  hidden: {
    endpoint: "diagnosis",
    diagnosis: {
      full: [c("pcs", "Posterior circulation stroke", ["posterior circulation stroke", "posterior circulation infarct", "posterior circulation ischemic stroke", "posterior circulation ischemia", "cerebellar stroke", "cerebellar infarct", "cerebellar infarction", "cerebellar ischemic stroke", "brainstem stroke", "brainstem infarct", "pica stroke", "pica infarct", "pica territory", "vertebrobasilar stroke", "vertebrobasilar ischemia", "posterior fossa stroke", "lateral medullary"])],
      partial: [
        { concept: c("stroke", "Stroke", ["stroke", "ischemic stroke", "infarct"]), credit: 0.75, feedback: "Right category. Localize it: a central acute vestibular syndrome indicates posterior circulation (cerebellar or brainstem) stroke." },
        { concept: c("central", "Central vertigo", ["central vertigo", "central acute vestibular", "central vestibular", "central cause"]), credit: 0.5, feedback: "Right distinction. In a vascular patient the cause of a central acute vestibular syndrome is posterior circulation stroke until proven otherwise." },
      ],
      wrong: [
        { concept: c("neuritis", "Vestibular neuritis", ["vestibular neuritis", "labyrinthitis", "vestibular neuronitis", "peripheral vertigo", "inner ear"]), tag: "unsafe-priority", feedback: "Vestibular neuritis causes an abnormal head impulse test and unidirectional nystagmus. A normal head impulse with direction-changing nystagmus and skew is the central pattern of stroke." },
        { concept: c("bppv", "BPPV", ["bppv", "benign paroxysmal positional"]), tag: "knowledge-gap", feedback: "BPPV causes brief positional episodes lasting seconds, not hours of continuous vertigo." },
        { concept: c("meniere", "Meniere disease", ["meniere"]), tag: "weak-reasoning", feedback: "Meniere disease causes episodes lasting hours with hearing loss and tinnitus; he has no ear symptoms." },
        { concept: c("migraine", "Vestibular migraine", ["vestibular migraine", "migraine"]), tag: "weak-reasoning", feedback: "A first episode at 67 with vascular risk factors and a central HINTS pattern is stroke until proven otherwise." },
      ],
    },
    diagnosisLabel: "Posterior circulation stroke (central acute vestibular syndrome)",
    localization: { regions: ["cerebellum"], explanation: "Left inferior cerebellum and vermis in the medial PICA territory. Medial cerebellar infarcts can mimic a peripheral vestibulopathy because limb ataxia and brainstem signs may be absent; truncal ataxia and the HINTS pattern reveal them." },
    keyFindings: ["hints", "gait", "h-course", "h-onset", "mri-brain"],
    mustConsider: [
      { concept: c("mc-neuritis", "Vestibular neuritis", ["vestibular neuritis"]), why: "The common benign alternative; separated by HINTS." },
      { concept: c("mc-hemorrhage", "Cerebellar hemorrhage", ["hemorrhage"]), why: "Excluded by CT; also needs urgent neurosurgical input if present." },
      { concept: c("mc-edema", "Cerebellar edema with hydrocephalus", ["edema", "hydrocephalus", "swelling"]), why: "Large cerebellar infarcts swell over days and can compress the brainstem." },
    ],
    necessaryInvestigations: ["mri-brain"],
    reasonableInvestigations: ["ct-head", "cta-head-neck", "poc-glucose", "ecg"],
    harmfulActions: [{ id: "discharge-followup", why: "Discharging a cerebellar stroke as an inner ear problem risks recurrent stroke and missed cerebellar swelling." }],
    urgentActions: [
      { id: "u-imaging", satisfiedBy: ["mri-brain", "cta-head-neck"], label: "Urgent MRI with diffusion and vascular imaging", why: "Confirms posterior circulation stroke and shows the vessels.", consequence: "Missed stroke and recurrence." },
      { id: "u-stroke-unit", satisfiedBy: ["stroke-unit"], label: "Admit to a stroke unit", why: "Monitoring for swelling and secondary prevention.", consequence: "Unrecognized deterioration." },
    ],
    leakTerms: ["stroke", "infarct", "infarction", "cerebellar stroke", "posterior circulation"],
    interpretationChecks: [],
    teachingPoints: [
      "HINTS applies only to acute continuous vertigo with nystagmus: a normal head impulse, direction-changing nystagmus, or skew suggests a central cause.",
      "In the first 48 hours a central HINTS pattern is more sensitive for stroke than diffusion MRI.",
      "Isolated vertigo with inability to stand, in a patient with vascular risk factors, should not be labeled an inner ear problem without HINTS.",
    ],
  },
  speed: {
    presentation: "A 67-year-old man with diabetes and hypertension developed sudden constant spinning and vomiting five hours ago. He cannot stand without help but has no other complaints.",
    highYield: ["hints", "gait", "mri-brain"],
    explanation: "Acute continuous vertigo with nystagmus is an acute vestibular syndrome, and HINTS separates causes: a normal head impulse, direction-changing nystagmus, and skew are a central pattern. Inability to stand supports a cerebellar cause, and MRI confirms a medial PICA territory infarct. This is posterior circulation stroke, not vestibular neuritis.",
  },
};

// ---------------------------------------------------------------------------
// S15 ALS
// ---------------------------------------------------------------------------
const sAls: CaseDef = {
  id: "s-als",
  version: 1,
  label: "Speed S15: weak hand",
  modes: ["speed"],
  difficulty: 2,
  modules: ["c-myopathy-mnd"],
  provenance: "synthetic",
  review: "pending",
  sources: [],
  presentation: {
    age: 61,
    sex: "male",
    setting: "Neurology outpatient clinic",
    chiefComplaint: "Clumsy right hand and dragging left foot",
    opening: "My right hand has got weak and clumsy over the past nine months, and now my left foot is catching on the ground.",
    vitals: "BP 128/78, HR 74, T 36.6 C, RR 14, SpO2 98% on room air",
    speaker: "patient",
  },
  history: [
    { id: "h-onset", intents: ["onset"], say: "About nine months ago my right hand started getting clumsy, especially with buttons and keys.", finding: "Insidious onset 9 months ago, right hand", key: true },
    { id: "h-course", intents: ["course"], say: "It's been steadily getting worse, and a couple of months ago my left leg started dragging. It never gets better.", finding: "Progressive spread to another limb", key: true },
    { id: "h-weak", intents: ["weakness", "coordination"], say: "My right hand is weak, I can't turn keys, and my left foot catches on the ground.", finding: "Asymmetric hand and foot weakness" },
    { id: "h-twitch", intents: ["movements", "pain"], patterns: ["cramp", "ripple", "flicker"], say: "I see little ripples and flickers under the skin of my arms and thighs, and I get bad cramps.", finding: "Fasciculations and cramps", key: true },
    { id: "h-weight", intents: ["weight"], say: "I've lost about 10 pounds, and my right hand looks thinner.", finding: "Weight loss, hand wasting" },
    { id: "h-background", intents: ["pmh", "meds", "allergies", "immunization", "family"], say: "I'm otherwise healthy and don't take any medicines. No allergies. Nobody in my family has had anything like this.", finding: "No past history; no family history of similar illness" },
    { id: "h-social", intents: ["social", "alcohol", "smoking", "recreational-drugs", "concerns"], say: "I'm a carpenter, so it's been hard. I don't smoke, and I have the occasional glass of wine. It keeps spreading and that worries me.", finding: "Carpenter; nonsmoker" },
  ],
  defaultNegative: NEG,
  exam: [
    { maneuver: "inspection", finding: "Wasting of the right first dorsal interosseous and thenar muscles. Fasciculations in both arms, the right thigh, and the left calf.", abnormal: true, key: true },
    { maneuver: "strength-arms", finding: "Right finger abduction and thumb abduction 3/5, right wrist extension 4/5; left arm 5/5.", abnormal: true },
    { maneuver: "strength-legs", finding: "Left ankle dorsiflexion 4/5 and left hip flexion 4+/5; right leg 5/5.", abnormal: true },
    { maneuver: "tone", finding: "Mildly increased tone in the left leg.", abnormal: true },
    { maneuver: "reflexes-arms", finding: "Brisk (3+) bilaterally, including in the wasted right arm.", abnormal: true, key: true },
    { maneuver: "reflexes-legs", finding: "Brisk (3+) bilaterally with crossed adductor spread.", abnormal: true, key: true },
    { maneuver: "plantar", finding: "Extensor on the left, flexor on the right.", abnormal: true },
    { maneuver: "hoffmann", finding: "Present on the right.", abnormal: true },
    { maneuver: "clonus", finding: "Three beats of left ankle clonus.", abnormal: true },
    { maneuver: "jaw-jerk", finding: "Mildly brisk jaw jerk.", abnormal: true },
    { maneuver: "gait", finding: "Left foot slap with a mildly stiff left leg.", abnormal: true },
    { maneuver: "hoover", finding: "Hoover sign negative: hip extension is equally reduced on direct testing and during contralateral hip flexion.", abnormal: false },
  ],
  results: [
    { investigation: "ncs-emg", summary: "Widespread active and chronic denervation with normal sensory studies", report: "Sensory studies normal. Reduced CMAP amplitudes in the right median and ulnar nerves with normal conduction velocities and no conduction block. EMG: fibrillation potentials, positive sharp waves, and fasciculation potentials with large, long-duration motor units in cervical, thoracic paraspinal, and lumbosacral muscles.", interpretation: "Widespread lower motor neuron degeneration in three regions with normal sensory nerves and no conduction block supports ALS and argues against multifocal motor neuropathy or radiculopathy.", abnormal: true, key: true },
    { investigation: "mri-spine", summary: "No cord compression", report: "Mild cervical degenerative change without cord compression or cord signal change. Lumbar spine unremarkable.", interpretation: "Excludes compressive cervical myelopathy as an explanation for mixed upper and lower motor neuron signs.", abnormal: false },
    { investigation: "ck", summary: "CK mildly raised at 312 U/L", values: [{ analyte: "CK", value: "312", unit: "U/L", ref: "40 to 200", flag: "H" }], interpretation: "Mild CK elevation is common in ALS from denervation and does not suggest a myopathy.", abnormal: true },
  ],
  normalInvestigations: ["mri-brain", "cbc", "bmp", "tsh", "b12-mma", "hiv", "syphilis-serology", "lft", "crp-esr", "ana-ena", "fvc-nif", "achr-ab", "lp-basic"],
  hidden: {
    endpoint: "diagnosis",
    diagnosis: {
      full: [c("als", "Amyotrophic lateral sclerosis (motor neuron disease)", ["amyotrophic lateral sclerosis", "als", "motor neuron disease", "motor neurone disease", "mnd", "lou gehrig"])],
      partial: [
        { concept: c("umn-lmn", "Combined upper and lower motor neuron disorder", ["upper and lower motor neuron", "anterior horn cell", "anterior horn"]), credit: 0.5, feedback: "Right pattern. Progressive mixed upper and lower motor neuron signs in several regions without sensory loss is ALS." },
      ],
      wrong: [
        { concept: c("myelopathy", "Cervical spondylotic myelopathy", ["cervical myelopathy", "spondylotic myelopathy", "cervical spondylosis", "cord compression"]), tag: "weak-reasoning", feedback: "Cervical myelopathy can mix upper and lower motor neuron signs, but it does not cause fasciculations in the legs or a brisk jaw jerk, and usually has sensory and sphincter features. MRI shows no compression." },
        { concept: c("mmn", "Multifocal motor neuropathy", ["multifocal motor neuropathy", "mmn"]), tag: "weak-reasoning", feedback: "Multifocal motor neuropathy is purely lower motor neuron with reduced reflexes and conduction block; here reflexes are brisk." },
        { concept: c("pls", "Primary lateral sclerosis or progressive muscular atrophy", ["primary lateral sclerosis", "progressive muscular atrophy"]), tag: "weak-reasoning", feedback: "Those are restricted to upper or lower motor neurons respectively; this patient has both." },
        { concept: c("mg", "Myasthenia gravis", ["myasthenia"]), tag: "knowledge-gap", feedback: "Myasthenia does not cause wasting, fasciculations, or brisk reflexes." },
        { concept: c("ibm", "Inclusion body myositis", ["inclusion body", "myositis", "myopathy"]), tag: "weak-reasoning", feedback: "A myopathy does not cause fasciculations or upper motor neuron signs." },
      ],
    },
    diagnosisLabel: "Amyotrophic lateral sclerosis (motor neuron disease)",
    localization: { regions: ["anterior-horn", "cortex-left", "cortex-right"], explanation: "Both upper motor neurons (motor cortex and corticospinal tracts: brisk reflexes, Hoffmann, extensor plantar, brisk jaw jerk) and lower motor neurons (anterior horn cells: wasting, fasciculations) in multiple regions, with sensory pathways spared." },
    keyFindings: ["inspection", "reflexes-arms", "reflexes-legs", "h-course", "ncs-emg"],
    mustConsider: [
      { concept: c("mc-myelopathy", "Cervical myelopathy", ["myelopathy", "cord compression"]), why: "The key treatable mimic; MRI the cervical spine." },
      { concept: c("mc-mmn", "Multifocal motor neuropathy", ["multifocal motor"]), why: "Treatable with immunoglobulin; look for conduction block." },
      { concept: c("mc-other", "Other mimics", ["kennedy", "hyperparathyroidism", "thyroid", "b12"]), why: "Kennedy disease, endocrine and metabolic causes are worth excluding." },
    ],
    necessaryInvestigations: ["ncs-emg", "mri-spine"],
    reasonableInvestigations: ["ck", "tsh", "b12-mma", "fvc-nif"],
    harmfulActions: [],
    urgentActions: [],
    leakTerms: ["amyotrophic lateral sclerosis", "ALS", "motor neuron disease", "motor neurone disease", "MND", "Lou Gehrig"],
    interpretationChecks: [],
    teachingPoints: [
      "ALS is suggested by progressive weakness with both upper motor neuron signs (brisk reflexes in wasted muscles) and lower motor neuron signs (wasting, fasciculations), spreading between regions, with no sensory loss.",
      "EMG showing widespread denervation with normal sensory studies supports the diagnosis; MRI excludes compressive myelopathy.",
      "Check respiratory function early and plan multidisciplinary care.",
    ],
  },
  speed: {
    presentation: "A 61-year-old carpenter has nine months of a weakening, clumsy right hand, and over the last two months his left foot has started to catch. He has no pain.",
    highYield: ["inspection", "reflexes-arms", "ncs-emg"],
    explanation: "Wasting and fasciculations (lower motor neuron) together with brisk reflexes in the same wasted limb (upper motor neuron), spreading between regions without sensory loss, is the signature of ALS. Inspection and reflex testing reveal the combination at the bedside, and EMG shows widespread denervation with normal sensory nerves. MRI excludes cervical myelopathy, the main mimic.",
  },
};

// ---------------------------------------------------------------------------
// S16 Functional neurological disorder
// ---------------------------------------------------------------------------
const sFnd: CaseDef = {
  id: "s-fnd",
  version: 1,
  label: "Speed S16: leg weakness",
  modes: ["speed"],
  difficulty: 2,
  modules: ["c-fnd"],
  provenance: "synthetic",
  review: "pending",
  sources: ["espay2018-fnd", "daum2014-positive-signs"],
  presentation: {
    age: 34,
    sex: "female",
    setting: "Emergency department",
    chiefComplaint: "Right leg weakness for two days",
    opening: "Two days ago my right leg suddenly went weak and heavy, and I can barely walk on it.",
    vitals: "BP 122/76, HR 88, T 36.7 C, RR 16, SpO2 99% on room air",
    speaker: "patient",
  },
  history: [
    { id: "h-onset", intents: ["onset"], say: "Two days ago, just after a frightening near-miss in my car, my right leg suddenly went weak and heavy.", finding: "Sudden onset after a frightening event", key: true },
    { id: "h-course", intents: ["course", "fatigability"], say: "It's about the same. It seems worse when I'm tired or when I'm concentrating on it.", finding: "Static, variable with attention and fatigue" },
    { id: "h-weak", intents: ["weakness"], say: "My right leg feels heavy, like it isn't mine, and it gives way. I drag it when I walk.", finding: "Right leg weakness with heaviness and giving way", key: true },
    { id: "h-numb", intents: ["numbness"], say: "The whole right leg feels a bit numb, right up to the top of my leg.", finding: "Whole-leg numbness to the groin" },
    { id: "h-mood", intents: ["behavior", "sleep"], say: "I've been stressed and not sleeping well since the near-miss, but I don't think I'm depressed.", finding: "Stress and poor sleep" },
    { id: "h-background", intents: ["pmh", "meds", "allergies", "immunization", "previous-episodes"], say: "I get migraines, and I had a few months of bad back pain last year that settled. I take sumatriptan when I need it. No allergies. Nothing like this has happened before.", finding: "Migraine; previous back pain; first episode" },
    { id: "h-social", intents: ["social", "alcohol", "smoking", "recreational-drugs", "concerns"], say: "I'm a nurse on a busy ward, and things have been stressful. I don't smoke and drink a little. I'm really frightened this is a stroke or MS, and I need to know what's going on.", finding: "Nurse; worried about stroke or MS" },
  ],
  defaultNegative: NEG,
  exam: [
    { maneuver: "hoover", finding: "Hoover sign positive: right hip extension is weak on direct testing but returns to full strength when she flexes the left hip against resistance.", abnormal: true, key: true },
    { maneuver: "strength-legs", finding: "Right leg give-way (collapsing) weakness in all muscle groups: brief normal power followed by sudden collapse, varying between attempts. Left leg 5/5.", abnormal: true, key: true },
    { maneuver: "gait", finding: "Drags the right leg behind her with the hip externally rotated and the foot in contact with the floor; no circumduction.", abnormal: true, key: true },
    { maneuver: "pinprick", finding: "Reduced pinprick over the whole right leg, ending sharply at the groin; not in a nerve or root distribution.", abnormal: true },
  ],
  results: [
    { investigation: "mri-brain", summary: "Normal", report: "No infarct, demyelination, or other structural lesion.", interpretation: "Consistent with the diagnosis, but the diagnosis rests on positive signs, not on a normal scan.", abnormal: false },
    { investigation: "mri-spine", summary: "Normal", report: "No cord compression, cord lesion, or root compression.", interpretation: "No structural explanation; the positive clinical signs make the diagnosis.", abnormal: false },
  ],
  normalInvestigations: ["ct-head", "cbc", "bmp", "ck", "poc-glucose", "ncs-emg", "pregnancy-test", "crp-esr", "tsh", "b12-mma", "cta-head-neck", "lp-basic"],
  hidden: {
    endpoint: "diagnosis",
    diagnosis: {
      full: [c("fnd", "Functional neurological disorder", ["functional neurological disorder", "functional neurologic disorder", "fnd", "functional leg weakness", "functional weakness", "functional motor disorder", "functional neurological symptom disorder", "functional limb weakness", "functional monoparesis", "functional paresis"])],
      partial: [
        { concept: c("conversion", "Conversion disorder", ["conversion disorder", "conversion"]), credit: 0.75, feedback: "This is an older term. Functional neurological disorder is preferred, and it is diagnosed from positive signs such as Hoover sign rather than by presuming a psychological cause." },
        { concept: c("psychogenic", "Psychogenic weakness", ["psychogenic", "nonorganic", "non organic", "dissociative"]), credit: 0.5, feedback: "These terms are discouraged because they imply the cause is purely psychological and the symptoms are not real. Use functional neurological disorder, a genuine and common condition diagnosed on positive signs." },
      ],
      wrong: [
        { concept: c("malingering", "Malingering or faking", ["malingering", "faking", "fake", "feigned", "feigning", "putting it on", "making it up", "factitious"]), tag: "misconception", feedback: "Functional symptoms are genuinely experienced and involuntary. Malingering and factitious disorder involve deliberate deception, which positive signs like Hoover do not show. Labeling FND as faking harms patients and is not supported by the evidence." },
        { concept: c("hysteria", "Hysteria", ["hysteria", "hysterical"]), tag: "terminology", feedback: "An outdated and stigmatizing term. The current term is functional neurological disorder." },
        { concept: c("stroke", "Stroke", ["stroke", "tia"]), tag: "weak-reasoning", feedback: "A positive Hoover sign, give-way weakness, a dragging gait, and normal tone, reflexes, and plantars are positive signs of functional weakness rather than a lesion of the corticospinal tract." },
        { concept: c("ms", "Multiple sclerosis", ["multiple sclerosis", "ms"]), tag: "weak-reasoning", feedback: "There are no upper motor neuron signs, and imaging is normal; the positive signs indicate functional weakness." },
      ],
    },
    diagnosisLabel: "Functional neurological disorder (functional right leg weakness)",
    localization: { regions: [], explanation: "No structural lesion: a disorder of nervous system functioning (motor control and attention) rather than structure. The positive signs show that the motor pathways are intact." },
    keyFindings: ["hoover", "strength-legs", "gait"],
    mustConsider: [
      { concept: c("mc-stroke", "Stroke", ["stroke"]), why: "Acute unilateral weakness must be assessed for stroke; positive signs and normal reflexes help, and FND can coexist with structural disease." },
      { concept: c("mc-ms", "Multiple sclerosis", ["multiple sclerosis"]), why: "A young woman with a new deficit; normal tone, reflexes, and imaging help." },
      { concept: c("mc-spine", "Spinal cord or root lesion", ["cord", "radiculopathy"]), why: "Exclude with examination (and imaging when indicated)." },
    ],
    necessaryInvestigations: [],
    reasonableInvestigations: ["mri-brain", "mri-spine"],
    harmfulActions: [{ id: "thrombolysis", why: "Onset was two days ago and the positive signs indicate functional weakness; thrombolysis carries bleeding risk without benefit." }],
    urgentActions: [],
    leakTerms: ["functional", "FND", "conversion", "psychogenic", "hysteria", "hysterical", "malingering"],
    interpretationChecks: [],
    teachingPoints: [
      "Functional neurological disorder is diagnosed on positive clinical signs, such as Hoover sign and give-way weakness, not simply because tests are normal.",
      "Symptoms are genuine and involuntary; it is not the same as malingering or factitious disorder.",
      "A stressful trigger is common but neither necessary nor sufficient for the diagnosis.",
      "Explaining the diagnosis clearly and showing the patient the positive signs is the first step of treatment, followed by specialist physiotherapy.",
    ],
  },
  speed: {
    presentation: "A 34-year-old nurse noticed her right leg suddenly go weak and heavy two days ago, just after a frightening near-miss while driving. She drags the leg when she walks.",
    highYield: ["hoover", "strength-legs"],
    explanation: "A positive Hoover sign (hip extension returning during contralateral hip flexion) and give-way weakness are positive signs of functional weakness, and normal tone, reflexes, and plantar responses argue against a corticospinal lesion. Requesting the Hoover sign and leg strength testing makes the diagnosis on positive grounds. This is functional neurological disorder: genuine, involuntary, and treatable, not faking.",
  },
};

// ---------------------------------------------------------------------------
// S17 Parkinson disease
// ---------------------------------------------------------------------------
const sPd: CaseDef = {
  id: "s-pd",
  version: 1,
  label: "Speed S17: shaky hand",
  modes: ["speed"],
  difficulty: 1,
  modules: ["c-parkinsonism"],
  provenance: "synthetic",
  review: "pending",
  sources: [],
  presentation: {
    age: 68,
    sex: "male",
    setting: "Neurology outpatient clinic",
    chiefComplaint: "Right hand tremor and slowness",
    opening: "My right hand has been shaking for about a year and a half, and I've become slow at everything.",
    vitals: "BP 134/80 lying and 130/78 standing, HR 70, T 36.6 C, RR 14, SpO2 98% on room air",
    speaker: "patient",
  },
  history: [
    { id: "h-onset", intents: ["onset"], say: "About eighteen months ago I noticed my right hand shaking when it was resting in my lap.", finding: "Insidious onset 18 months ago" },
    { id: "h-course", intents: ["course"], say: "It's slowly got more noticeable, and I've become slower at everything.", finding: "Slowly progressive" },
    { id: "h-tremor", intents: ["movements"], say: "My right hand shakes when I'm sitting still, and it settles when I reach for something. I feel stiff and slow, especially on the right.", finding: "Asymmetric rest tremor, stiffness, slowness", key: true },
    { id: "h-writing", intents: ["coordination"], patterns: ["handwriting", "writing", "button"], say: "My handwriting has become small and cramped, and buttons take ages.", finding: "Micrographia and reduced dexterity", key: true },
    { id: "h-prodrome", intents: ["sleep", "bladder-bowel"], patterns: ["smell", "dream", "act out"], say: "My wife says I shout and thrash in my sleep, as if I'm acting out dreams. I've been constipated for years, and I can't smell much anymore.", finding: "REM sleep behavior disorder, constipation, hyposmia" },
    { id: "h-gait", intents: ["dizziness", "speech"], patterns: ["walk", "gait", "shuffle", "arm swing", "fall", "voice"], say: "No falls and my balance is fine, but my wife says I shuffle, don't swing my right arm, and speak more quietly than I used to.", finding: "Reduced arm swing, quiet voice, no falls" },
    { id: "h-background", intents: ["pmh", "meds", "allergies", "immunization"], say: "I have high blood pressure and take amlodipine. I've never taken any medicines for sickness or for mental health. No allergies.", finding: "Hypertension; no dopamine-blocking drugs" },
    { id: "h-social", intents: ["social", "alcohol", "smoking", "recreational-drugs", "concerns", "family"], say: "I'm a retired accountant. I've never smoked, and I have a glass of wine with dinner. Nobody in my family has had a tremor. I'm worried about what's coming.", finding: "Retired; no family history of tremor" },
  ],
  defaultNegative: NEG,
  exam: [
    { maneuver: "involuntary-movements", finding: "Right hand pill-rolling rest tremor at about 4 to 5 Hz, which stops on posture and reemerges after a few seconds of holding the arms out; it increases during mental arithmetic.", abnormal: true, key: true },
    { maneuver: "tone", finding: "Cogwheel rigidity at the right wrist and elbow, increased by moving the left hand; mild rigidity on the left.", abnormal: true, key: true },
    { maneuver: "rapid-alternating", finding: "Right finger tapping and hand opening are slow, with progressive reduction in amplitude (decrement) and hesitations; left mildly slow.", abnormal: true, key: true },
    { maneuver: "gait", finding: "Slightly stooped, with short steps and reduced right arm swing; turns in three steps. Recovers within two steps on the pull test.", abnormal: true },
    { maneuver: "general-appearance", finding: "Reduced facial expression and blink rate.", abnormal: true },
    { maneuver: "speech-articulation", finding: "Soft, slightly monotonous voice; articulation clear.", abnormal: true },
  ],
  results: [
    { investigation: "mri-brain", summary: "No structural lesion", report: "No structural lesion, hydrocephalus, or basal ganglia vascular change. Normal midbrain and pons morphology.", interpretation: "Excludes structural and vascular parkinsonism; normal brainstem morphology argues against PSP and MSA. MRI is not needed in typical cases.", abnormal: false },
    { investigation: "tsh", summary: "TSH 1.9 mIU/L", values: [{ analyte: "TSH", value: "1.9", unit: "mIU/L", ref: "0.4 to 4.0" }], interpretation: "Normal; hypothyroidism can mimic slowness but not rest tremor with rigidity.", abnormal: false },
  ],
  normalInvestigations: ["ct-head", "cbc", "bmp", "b12-mma", "lft", "eeg-routine"],
  hidden: {
    endpoint: "diagnosis",
    diagnosis: {
      full: [c("pd", "Parkinson disease", ["parkinson disease", "parkinsons disease", "idiopathic parkinson", "pd", "parkinson"])],
      wrong: [
        { concept: c("et", "Essential tremor", ["essential tremor"]), tag: "weak-reasoning", feedback: "Essential tremor is a bilateral action and postural tremor without bradykinesia or rigidity. Rest tremor with decrement and cogwheel rigidity is parkinsonian." },
        { concept: c("dip", "Drug-induced parkinsonism", ["drug induced", "neuroleptic", "medication induced"]), tag: "weak-reasoning", feedback: "He has never taken dopamine-blocking drugs, and the tremor is asymmetric with prodromal features." },
        { concept: c("psp", "Progressive supranuclear palsy", ["progressive supranuclear palsy", "psp"]), tag: "weak-reasoning", feedback: "PSP causes early falls and vertical gaze palsy, usually without a classic rest tremor." },
        { concept: c("msa", "Multiple system atrophy", ["multiple system atrophy", "msa"]), tag: "weak-reasoning", feedback: "MSA brings early autonomic failure or cerebellar signs; his standing blood pressure is normal." },
        { concept: c("dlb", "Dementia with Lewy bodies", ["lewy body", "lewy bodies", "dlb"]), tag: "weak-reasoning", feedback: "DLB requires dementia early in the course, with fluctuations and visual hallucinations; his cognition is intact." },
      ],
    },
    diagnosisLabel: "Parkinson disease (idiopathic, clinically established)",
    localization: { regions: ["midbrain"], explanation: "Loss of dopaminergic neurons in the substantia nigra pars compacta of the midbrain, reducing input to the striatum (basal ganglia); the side opposite the symptoms is affected first." },
    keyFindings: ["rapid-alternating", "involuntary-movements", "tone", "h-tremor"],
    mustConsider: [
      { concept: c("mc-dip", "Drug-induced parkinsonism", ["drug induced", "antipsychotic", "metoclopramide"]), why: "Always review for dopamine-blocking drugs." },
      { concept: c("mc-atypical", "Atypical parkinsonism", ["psp", "msa", "corticobasal", "lewy"]), why: "Red flags include early falls, gaze palsy, early autonomic failure, and poor response to levodopa." },
      { concept: c("mc-et", "Essential tremor", ["essential tremor"]), why: "The commonest tremor; distinguished by action tremor without bradykinesia." },
    ],
    necessaryInvestigations: [],
    reasonableInvestigations: ["mri-brain", "tsh"],
    harmfulActions: [],
    urgentActions: [],
    leakTerms: ["Parkinson", "parkinsonism", "Parkinson disease"],
    interpretationChecks: [],
    teachingPoints: [
      "Parkinson disease is a clinical diagnosis: bradykinesia with decrement, plus rest tremor or rigidity, with supportive features and no red flags.",
      "Asymmetric onset, rest tremor, and prodromal hyposmia, constipation, and REM sleep behavior disorder support it.",
      "Look for red flags of atypical parkinsonism and always review medications for dopamine blockers.",
    ],
  },
  speed: {
    presentation: "A 68-year-old man has had a tremor of his right hand at rest for eighteen months and feels he has become slow and stiff. His handwriting has become small.",
    highYield: ["rapid-alternating", "involuntary-movements", "tone"],
    explanation: "Parkinson disease is diagnosed clinically from bradykinesia with progressive decrement plus rest tremor or rigidity. Rapid alternating movements show the decrement that defines bradykinesia, and tremor observation and tone testing confirm an asymmetric rest tremor and cogwheel rigidity. With no red flags or dopamine-blocking drugs, the diagnosis is Parkinson disease.",
  },
};

// ---------------------------------------------------------------------------
// S18 AQP4-IgG positive NMOSD
// ---------------------------------------------------------------------------
const sNmosd: CaseDef = {
  id: "s-nmosd",
  version: 1,
  label: "Speed S18: vision loss and leg numbness",
  modes: ["speed"],
  difficulty: 2,
  modules: ["c-nmosd-mogad"],
  provenance: "synthetic",
  review: "pending",
  sources: ["wingerchuk2015-nmosd", "mayo-nmofs"],
  presentation: {
    age: 36,
    sex: "female",
    setting: "Emergency department",
    chiefComplaint: "Numb, weak legs and trouble passing urine",
    opening: "For five days my legs have been going numb and weak, and now I can barely walk or pass urine.",
    vitals: "BP 126/78, HR 82, T 36.8 C, RR 16, SpO2 98% on room air",
    speaker: "patient",
  },
  history: [
    { id: "h-onset", intents: ["onset"], say: "Five days ago my legs went numb and tingly, and it has crept up to my chest.", finding: "Ascending sensory symptoms over 5 days", key: true },
    { id: "h-course", intents: ["course"], say: "It's worse every day. Today I can barely walk.", finding: "Progressive over days" },
    { id: "h-cord", intents: ["numbness", "weakness"], patterns: ["band", "chest"], say: "I'm numb from my chest down, both legs are weak and stiff, and there's a tight band around my chest.", finding: "Paraparesis, sensory loss to the chest, band-like sensation", key: true },
    { id: "h-bladder", intents: ["bladder-bowel"], say: "I can't empty my bladder properly, and I'm constipated.", finding: "Urinary retention and constipation" },
    { id: "h-vision", intents: ["vision", "photophobia"], patterns: ["eye pain", "colors"], say: "A month ago both my eyes went blurry over a few days, with pain when I moved them. They only partly recovered; things are still dim and colors look washed out.", finding: "Bilateral painful visual loss a month ago, incomplete recovery", key: true },
    { id: "h-hiccups", intents: ["nausea", "previous-episodes"], patterns: ["hiccup", "hiccough"], say: "About six weeks ago I had hiccups that wouldn't stop for ten days, with nausea and vomiting. My doctor couldn't find a cause.", finding: "Intractable hiccups, nausea, and vomiting (area postrema syndrome)", key: true },
    { id: "h-background", intents: ["pmh", "meds", "allergies", "immunization", "pregnancy"], say: "I have an underactive thyroid and take levothyroxine. No allergies. I'm not pregnant.", finding: "Autoimmune hypothyroidism" },
    { id: "h-social", intents: ["social", "alcohol", "smoking", "recreational-drugs", "concerns"], say: "I'm a pharmacist. I don't smoke and rarely drink. I'm scared I'll go blind or end up paralyzed.", finding: "Pharmacist; nonsmoker" },
  ],
  defaultNegative: NEG,
  exam: [
    { maneuver: "visual-acuity", finding: "20/200 right eye, 20/80 left eye; reduced color vision in both eyes.", abnormal: true, key: true },
    { maneuver: "pupils", finding: "Sluggish pupils with a right relative afferent pupillary defect.", abnormal: true },
    { maneuver: "fundoscopy", finding: "Mild bilateral optic disc pallor.", abnormal: true },
    { maneuver: "visual-fields", finding: "Central scotomas in both eyes.", abnormal: true },
    { maneuver: "tone", finding: "Increased tone in both legs.", abnormal: true },
    { maneuver: "strength-legs", finding: "Both legs 3/5 proximally and distally.", abnormal: true, key: true },
    { maneuver: "reflexes-legs", finding: "Brisk (3+) at knees and ankles.", abnormal: true },
    { maneuver: "plantar", finding: "Extensor bilaterally.", abnormal: true },
    { maneuver: "clonus", finding: "Sustained ankle clonus bilaterally.", abnormal: true },
    { maneuver: "sensory-level", finding: "Sensory level to pinprick at T4.", abnormal: true, key: true },
    { maneuver: "pinprick", finding: "Reduced pinprick below T4.", abnormal: true },
    { maneuver: "vibration-proprioception", finding: "Vibration and joint position sense reduced in both legs.", abnormal: true },
    { maneuver: "saddle-sensation", finding: "Reduced saddle sensation in keeping with the thoracic sensory level; reduced anal tone.", abnormal: true },
    { maneuver: "gait", finding: "Can walk only with two-person support; spastic.", abnormal: true },
    { maneuver: "romberg", finding: "Cannot stand unaided; not testable.", abnormal: true },
    { maneuver: "tandem", finding: "Unable.", abnormal: true },
    { maneuver: "heel-shin", finding: "Limited by weakness.", abnormal: true },
  ],
  results: [
    { investigation: "aqp4-ab", summary: "AQP4-IgG positive", values: [{ analyte: "Aquaporin-4 IgG (cell-based assay)", value: "Positive, titer 1:1000", flag: "H" }], interpretation: "AQP4-IgG by cell-based assay is highly specific. With a core clinical characteristic (optic neuritis, myelitis, area postrema syndrome), it establishes AQP4-IgG positive NMOSD once alternatives are excluded.", abnormal: true, key: true },
    { investigation: "mri-spine", summary: "Longitudinally extensive cord lesion T1 to T9", report: "Longitudinally extensive T2 hyperintense lesion from T1 to T9 (more than three vertebral segments) involving the central cord, with patchy enhancement and cord swelling.", interpretation: "Longitudinally extensive transverse myelitis, the hallmark cord lesion of NMOSD; MS cord lesions are usually short and peripheral.", abnormal: true, key: true },
    { investigation: "mri-brain-gad", summary: "Long bilateral optic nerve lesions and a dorsal medulla lesion", report: "Bilateral optic nerve T2 hyperintensity extending posteriorly to the chiasm, with enhancement. Small T2 lesion in the dorsal medulla at the area postrema. No ovoid periventricular lesions.", interpretation: "Long posterior optic nerve lesions and an area postrema lesion are typical of NMOSD.", abnormal: true },
    { investigation: "mri-brain", summary: "Dorsal medulla lesion; no MS-typical lesions", report: "Small T2 lesion in the dorsal medulla at the area postrema. No ovoid periventricular or juxtacortical lesions. Contrast not given.", interpretation: "Area postrema involvement explains the earlier hiccups and vomiting.", abnormal: true },
    { investigation: "lp-basic", summary: "Pleocytosis with neutrophils and raised protein", values: [{ analyte: "White cells", value: "48", unit: "/uL", ref: "0 to 5", flag: "H" }, { analyte: "Neutrophils", value: "60", unit: "%" }, { analyte: "Protein", value: "78", unit: "mg/dL", ref: "15 to 45", flag: "H" }, { analyte: "Glucose", value: "58", unit: "mg/dL", ref: "40 to 70" }], interpretation: "Pleocytosis above 50 or neutrophil predominance is more typical of NMOSD than MS.", abnormal: true },
  ],
  normalInvestigations: ["mog-ab", "csf-ocb", "cbc", "bmp", "b12-mma", "hiv", "syphilis-serology", "ana-ena", "tsh", "ct-head", "pregnancy-test", "crp-esr"],
  hidden: {
    endpoint: "diagnosis",
    diagnosis: {
      full: [c("nmosd", "AQP4-IgG positive neuromyelitis optica spectrum disorder", ["neuromyelitis optica spectrum disorder", "nmosd", "neuromyelitis optica", "nmo", "aqp4 positive nmosd", "aquaporin 4", "aqp4 + nmosd", "devic"])],
      partial: [
        { concept: c("letm", "Longitudinally extensive transverse myelitis", ["longitudinally extensive transverse myelitis", "longitudinally extensive myelitis", "letm"]), credit: 0.5, feedback: "Right syndrome for the cord. With bilateral optic neuritis, area postrema syndrome, and AQP4-IgG, the disease is NMOSD." },
        { concept: c("tm-on", "Transverse myelitis or optic neuritis", ["transverse myelitis", "myelitis", "optic neuritis"]), credit: 0.25, feedback: "Each attack has a name, but together with intractable hiccups they point to one disease: AQP4-IgG positive NMOSD." },
      ],
      wrong: [
        { concept: c("ms", "Multiple sclerosis", ["multiple sclerosis", "ms"]), tag: "misconception", feedback: "Severe bilateral optic neuritis, a cord lesion over three segments, area postrema syndrome, absent oligoclonal bands, and AQP4-IgG point to NMOSD. Some MS treatments can worsen NMOSD, so the distinction matters." },
        { concept: c("mogad", "MOGAD", ["mogad", "mog antibody", "mog"]), tag: "weak-reasoning", feedback: "MOGAD can cause similar attacks, but MOG-IgG is negative and AQP4-IgG is positive." },
        { concept: c("adem", "ADEM", ["adem", "acute disseminated encephalomyelitis"]), tag: "weak-reasoning", feedback: "ADEM is a monophasic encephalopathic illness, usually in children; this is a series of separate attacks without encephalopathy." },
      ],
    },
    diagnosisLabel: "AQP4-IgG positive neuromyelitis optica spectrum disorder",
    localization: { regions: ["cord-thoracic", "medulla"], explanation: "Thoracic spinal cord from T1 to T9 (paraparesis, T4 sensory level, sphincter loss), both optic nerves (bilateral optic neuritis), and the area postrema of the dorsal medulla (intractable hiccups and vomiting)." },
    keyFindings: ["h-vision", "h-hiccups", "sensory-level", "aqp4-ab", "mri-spine"],
    mustConsider: [
      { concept: c("mc-ms", "Multiple sclerosis", ["multiple sclerosis"]), why: "The main differential; some MS disease-modifying drugs worsen NMOSD." },
      { concept: c("mc-mog", "MOGAD", ["mog"]), why: "Test MOG-IgG when AQP4-IgG is negative or the picture is atypical." },
      { concept: c("mc-compression", "Cord compression", ["compression"]), why: "Exclude with MRI in any acute myelopathy." },
      { concept: c("mc-other", "Infection, sarcoidosis, B12 deficiency", ["sarcoid", "b12", "infection"]), why: "Other causes of longitudinally extensive myelitis." },
    ],
    necessaryInvestigations: ["aqp4-ab", "mri-spine"],
    reasonableInvestigations: ["mri-brain-gad", "lp-basic", "mog-ab", "csf-ocb"],
    harmfulActions: [],
    urgentActions: [
      { id: "u-steroids", satisfiedBy: ["high-dose-steroids"], label: "Start high-dose IV corticosteroids promptly", why: "NMOSD attacks cause severe, often permanent disability; early treatment improves recovery.", consequence: "Greater permanent visual and motor loss." },
      { id: "u-plex", satisfiedBy: ["plasma-exchange"], label: "Escalate to plasma exchange early if response is incomplete", why: "Plasma exchange improves outcomes in severe or steroid-refractory attacks.", consequence: "Incomplete recovery." },
      { id: "u-catheter", satisfiedBy: ["catheter"], label: "Manage urinary retention", why: "Retention from myelitis needs drainage.", consequence: "Bladder injury." },
    ],
    leakTerms: ["neuromyelitis", "NMOSD", "NMO", "aquaporin", "AQP4", "Devic", "optic neuritis", "myelitis"],
    interpretationChecks: [
      { id: "ic-mri", investigation: "mri-spine", question: "What does the spinal MRI show and why does it matter?", answer: { full: [c("ic-letm", "Longitudinally extensive lesion", ["longitudinally extensive", "three vertebral segments", "3 vertebral segments", "more than three segments"])] }, modelAnswer: "A longitudinally extensive transverse myelitis spanning more than three vertebral segments, which favors NMOSD over MS." },
    ],
    teachingPoints: [
      "Core NMOSD attacks are optic neuritis, acute myelitis, and area postrema syndrome (intractable hiccups or vomiting).",
      "AQP4-IgG by cell-based assay is the key test; with one core attack and exclusion of alternatives it establishes the diagnosis.",
      "Longitudinally extensive myelitis over three or more segments and severe bilateral optic neuritis favor NMOSD over MS.",
      "Treat attacks early with high-dose steroids and plasma exchange, and avoid MS drugs that can worsen NMOSD.",
    ],
  },
  speed: {
    presentation: "A 36-year-old woman had painful loss of vision in both eyes a month ago that only partly recovered. Over the last five days she has developed numbness from the chest down, weak legs, and difficulty passing urine. Six weeks ago she had ten days of hiccups that would not stop.",
    highYield: ["aqp4-ab", "mri-spine"],
    explanation: "Bilateral optic neuritis, an acute myelitis, and intractable hiccups (area postrema syndrome) are the three core attacks of NMOSD. Spinal MRI shows a longitudinally extensive lesion over more than three segments, and a positive AQP4-IgG confirms the diagnosis and separates it from MS, which matters because some MS treatments worsen NMOSD.",
  },
};

export const SPEED_CASES: CaseDef[] = [
  sBell,
  sIno,
  sCn3,
  sHorner,
  sWernicke,
  sB12,
  sCts,
  sLems,
  sCauda,
  sGca,
  sIih,
  sSah,
  sHsv,
  sVertigo,
  sAls,
  sFnd,
  sPd,
  sNmosd,
];

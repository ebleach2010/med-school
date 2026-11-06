// Placement item bank. Also supplies module challenge items and review items.
// Every item is an AI draft pending human review. Citations are registry ids only
// (content/sources.ts); basic anatomy items cite nothing rather than inventing support.

import type {
  AssessmentItem,
  Concept,
  ContentMeta,
  FreeTextItem,
  LocalizationItem,
  McqItem,
  MultiSelectItem,
  OrderPriorityItem,
  SelectTestsItem,
} from "../../shared/types";

const DATE = "2026-10-25";

function meta(id: string, sources: string[]): ContentMeta {
  return { id, version: 1, provenance: "source-grounded", review: "pending", author: "ai-draft", sources, lastVerified: DATE };
}

type Draft<T extends AssessmentItem> = Omit<T, "version" | "meta" | "format"> & { sources: string[] };

function mcq(d: Draft<McqItem>): McqItem {
  const { sources, ...rest } = d;
  return { ...rest, format: "mcq", version: 1, meta: meta(d.id, sources) };
}
function multi(d: Draft<MultiSelectItem>): MultiSelectItem {
  const { sources, ...rest } = d;
  return { ...rest, format: "multi-select", version: 1, meta: meta(d.id, sources) };
}
function free(d: Draft<FreeTextItem>): FreeTextItem {
  const { sources, ...rest } = d;
  return { ...rest, format: "free-text", version: 1, meta: meta(d.id, sources) };
}
function loc(d: Draft<LocalizationItem>): LocalizationItem {
  const { sources, ...rest } = d;
  return { ...rest, format: "localization", version: 1, meta: meta(d.id, sources) };
}
function tests(d: Draft<SelectTestsItem>): SelectTestsItem {
  const { sources, ...rest } = d;
  return { ...rest, format: "select-tests", version: 1, meta: meta(d.id, sources) };
}
function order(d: Draft<OrderPriorityItem>): OrderPriorityItem {
  const { sources, ...rest } = d;
  return { ...rest, format: "order-priority", version: 1, meta: meta(d.id, sources) };
}

const c = (id: string, label: string, patterns: string[]): Concept => ({ id, label, patterns });

const ORDER_STEM = "Put these steps in order. Steps that happen at the same time can go in either order.";
const TESTS_STEM = "Choose the investigations you need now. Unnecessary choices lower the score.";

// ===========================================================================
// Terminology
// ===========================================================================

const TERMINOLOGY: AssessmentItem[] = [
  mcq({
    id: "p-term-1",
    skill: "terminology",
    modules: ["f-terminology", "f-localization"],
    difficulty: 1,
    presentation: "acute-hemiparesis",
    family: "term-paresis",
    usage: ["placement", "challenge", "review"],
    vignette:
      "A 70-year-old has had a stroke. He cannot move his right arm at all. He can lift his right leg off the bed but cannot hold it up against the examiner's push.",
    stem: "Which description uses the terms correctly?",
    options: [
      { id: "a", text: "Right arm [[plegia|plegia]] and right leg [[paresis|paresis]]", correct: true, feedback: "Correct. Plegia is complete loss of voluntary movement; paresis is partial weakness." },
      { id: "b", text: "Right arm paresis and right leg plegia", tag: "terminology", feedback: "Reversed. The arm, with no movement at all, is plegic; the leg, which moves against gravity, is paretic." },
      { id: "c", text: "Right arm [[ataxia|ataxia]] and right leg paresis", tag: "terminology", feedback: "Ataxia is incoordination, not weakness. A limb that cannot move at all is plegic." },
      { id: "d", text: "Right-sided [[paraparesis|paraparesis]]", tag: "terminology", feedback: "Paraparesis means weakness of both legs. One arm and one leg on the same side is a hemiparesis." },
    ],
    rationale:
      "Paresis means partial weakness (Medical Research Council grades 1 to 4); plegia means no voluntary movement (grade 0). Lifting the leg against gravity but not against resistance is grade 3, so the leg is paretic. Together this is a right [[hemiparesis|hemiparesis]] with a plegic arm. Precise terms matter because the pattern (one side, both legs, all four limbs) is the first clue to where the lesion is.",
    sources: [],
  }),
  free({
    id: "p-term-2",
    skill: "terminology",
    modules: ["f-terminology"],
    difficulty: 2,
    presentation: "speech-disturbance",
    usage: ["placement", "challenge", "review"],
    vignette:
      "A 55-year-old's speech sounds slurred and thick, as if she were drunk. She names objects correctly, repeats sentences, follows three-step commands, and writes a normal sentence.",
    stem: "What is the correct term for this speech problem?",
    placeholder: "One term",
    answer: {
      full: [
        c("dysarthria", "dysarthria", [
          "dysarthria",
          "dysarthric",
          "articulation disorder",
          "articulation problem",
          "difficulty articulating",
          "impaired articulation",
          "poor articulation",
        ]),
      ],
      partial: [
        { concept: c("motor-speech", "motor speech disorder", ["motor speech"]), credit: 0.6, feedback: "Close. Dysarthria is a motor speech disorder, but so is apraxia of speech. The precise term for slurred, poorly articulated speech with intact language is dysarthria." },
        { concept: c("slurred", "slurred speech", ["slurred speech", "slurring", "slurred"]), credit: 0.5, feedback: "That describes the sign in everyday words. The medical term is [[dysarthria|dysarthria]]." },
      ],
      wrong: [
        { concept: c("aphasia", "aphasia", ["aphasia", "aphasic", "dysphasia", "broca", "wernicke"]), tag: "terminology", feedback: "Aphasia is a disorder of language (naming, comprehension, repetition, reading, writing). Here language is intact and only articulation is affected: dysarthria." },
        { concept: c("dysphonia", "dysphonia", ["dysphonia", "hoarse"]), tag: "terminology", feedback: "Dysphonia is an abnormal voice (hoarse or breathy), usually from the larynx. Slurred articulation is dysarthria." },
        { concept: c("apraxia", "apraxia of speech", ["apraxia"]), tag: "misconception", feedback: "Apraxia of speech causes inconsistent errors in planning speech sounds, usually with a left frontal lesion and often with aphasia. Consistent slurring with normal language is dysarthria." },
      ],
    },
    modelAnswer: "Dysarthria: impaired articulation of speech with normal language.",
    rationale:
      "Separate language from speech. [[aphasia|Aphasia]] is a language disorder: errors in word choice, naming, comprehension, repetition, reading or writing. [[dysarthria|Dysarthria]] is a motor disorder of articulation: the words are right but poorly pronounced. Writing a normal sentence is a quick way to show that language is intact. The distinction changes localization: aphasia points to the dominant hemisphere cortex, while dysarthria can arise anywhere from the cortex to the muscles.",
    sources: [],
  }),
  mcq({
    id: "p-term-3",
    skill: "terminology",
    modules: ["f-terminology", "f-vascular-territories"],
    difficulty: 2,
    presentation: "visuospatial-inattention",
    usage: ["placement", "challenge", "review"],
    vignette:
      "After a right hemisphere stroke, a 74-year-old eats only from the right half of her plate and does not turn toward people speaking on her left. When each side of the visual field is tested alone she sees the stimulus, but when both sides are shown at once she reports only the right one.",
    stem: "Which term best describes her main deficit?",
    options: [
      { id: "a", text: "Left hemispatial [[neglect|neglect]]", correct: true, feedback: "Correct. She fails to attend to the left side of space despite intact fields." },
      { id: "b", text: "Left [[homonymous|homonymous]] [[hemianopia|hemianopia]]", tag: "terminology", feedback: "Hemianopia is loss of vision in the same half of the visual field of both eyes. She sees single stimuli on the left, so her fields are intact." },
      { id: "c", text: "Receptive [[aphasia|aphasia]]", tag: "terminology", feedback: "Aphasia is a language disorder. Inattention to one side of space is neglect." },
      { id: "d", text: "Left [[hemiparesis|hemiparesis]]", tag: "terminology", feedback: "Hemiparesis is weakness. It does not explain failure to notice the left side of space." },
    ],
    reasoning: {
      stem: "Which finding best separates neglect from a visual field defect here?",
      options: [
        { id: "r1", text: "She sees a single stimulus on the left but misses it when both sides are stimulated together ([[extinction|extinction]])", correct: true },
        { id: "r2", text: "She eats only from the right half of her plate", feedback: "A left hemianopia can do this too if the patient does not turn her head to compensate." },
        { id: "r3", text: "The stroke is in the right hemisphere", feedback: "Both neglect and a left hemianopia arise from right hemisphere lesions." },
      ],
    },
    rationale:
      "[[neglect|Neglect]] is a failure to attend to one side of space or the body, most often the left side after a right parietal or frontal lesion. [[hemianopia|Hemianopia]] is a failure to see. Testing each field alone and then both together separates them: a patient with neglect sees a single stimulus but extinguishes it when a competing stimulus appears on the other side. Neglect is a cortical sign and points away from a small deep (lacunar) stroke.",
    sources: [],
  }),
  multi({
    id: "p-term-vocab",
    skill: "terminology",
    modules: ["f-terminology"],
    difficulty: 1,
    presentation: "general-vocabulary",
    usage: ["placement", "review"],
    stem: "Select every statement that uses the term correctly.",
    options: [
      { id: "a", text: "[[fasciculation|Fasciculations]] are brief, visible twitches of small groups of muscle fibers.", correct: true },
      { id: "b", text: "[[ptosis|Ptosis]] is drooping of the upper eyelid.", correct: true },
      { id: "c", text: "[[mydriasis|Mydriasis]] means a dilated pupil.", correct: true },
      { id: "d", text: "[[dysphagia|Dysphagia]] means difficulty swallowing.", correct: true },
      { id: "e", text: "[[ataxia|Ataxia]] means weakness of a limb.", tag: "terminology", feedback: "Ataxia is incoordination; strength can be completely normal." },
      { id: "f", text: "[[diplopia|Diplopia]] means blurred vision in one eye.", tag: "terminology", feedback: "Diplopia is double vision. Double vision that resolves when either eye is covered (binocular diplopia) means the eyes are misaligned." },
      { id: "g", text: "[[plegia|Plegia]] means mild weakness.", tag: "terminology", feedback: "Plegia is complete paralysis. Mild or partial weakness is paresis." },
    ],
    rationale:
      "These everyday neurological terms describe what is seen or reported. Fasciculations, ptosis and mydriasis are signs; dysphagia and diplopia are symptoms that should prompt an examination for matching signs. Ataxia (incoordination) and paresis (weakness) are different and are often confused.",
    sources: [],
  }),
  free({
    id: "p-term-ataxia",
    skill: "terminology",
    modules: ["f-terminology"],
    difficulty: 2,
    presentation: "gait-imbalance",
    usage: ["placement", "review"],
    vignette:
      "A 40-year-old has full strength in all limbs. On finger-to-nose testing his finger overshoots and wobbles as it nears the target. He walks on a wide base, staggers, and cannot walk heel to toe. Joint position sense is normal.",
    stem: "What single term describes this pattern of incoordination?",
    placeholder: "One term",
    answer: {
      full: [c("ataxia", "ataxia", ["ataxia", "ataxic", "cerebellar ataxia"])],
      partial: [
        { concept: c("components", "a component of ataxia", ["dysmetria", "intention tremor", "past pointing", "dysdiadochokinesia"]), credit: 0.6, feedback: "That names one component (overshooting, or tremor near the target). The umbrella term for the whole pattern, in the limbs and in gait, is ataxia." },
        { concept: c("incoordination", "incoordination", ["incoordination", "uncoordinated", "poor coordination", "clumsiness", "clumsy"]), credit: 0.5, feedback: "Right idea. The medical term is [[ataxia|ataxia]]." },
      ],
      wrong: [
        { concept: c("weakness", "weakness", ["weakness", "paresis", "weak"]), tag: "terminology", feedback: "Strength is full. Ataxia is incoordination without weakness." },
        { concept: c("apraxia", "apraxia", ["apraxia"]), tag: "terminology", feedback: "Apraxia is an inability to perform learned movements despite intact strength, sensation and coordination. Overshoot and a wide-based staggering gait are ataxia." },
        { concept: c("vertigo", "vertigo", ["vertigo", "dizziness"]), tag: "terminology", feedback: "Vertigo is a symptom (an illusion of movement). The examination finding here is ataxia." },
      ],
    },
    modelAnswer: "Ataxia, here a cerebellar ataxia of limbs and gait.",
    rationale:
      "[[ataxia|Ataxia]] is incoordination of movement that is not explained by weakness. Cerebellar ataxia produces [[dysmetria|dysmetria]] (overshoot), intention tremor, and a wide-based gait. Normal joint position sense points away from a sensory ataxia, which worsens with the eyes closed. Calling ataxia 'weakness' sends localization in the wrong direction.",
    sources: [],
  }),
  mcq({
    id: "p-term-pyramidal",
    skill: "terminology",
    modules: ["f-terminology", "f-localization"],
    difficulty: 3,
    presentation: "pattern-of-weakness",
    usage: ["placement", "review"],
    vignette: "A neurology note says: 'Left-sided weakness in a pyramidal distribution.'",
    stem: "Which examination pattern does this phrase describe?",
    options: [
      { id: "a", text: "In the arm, extensors weaker than flexors; in the leg, flexors weaker than extensors (for example weak hip flexion and ankle dorsiflexion)", correct: true, feedback: "Correct. This is the typical [[pyramidal-weakness|pyramidal]] (upper motor neuron) distribution." },
      { id: "b", text: "Proximal muscles weaker than distal, equally in arms and legs", tag: "terminology", feedback: "Symmetric proximal weakness suggests a myopathy (or some neuromuscular junction disorders), not a pyramidal distribution." },
      { id: "c", text: "Weakness that worsens with repeated effort and recovers with rest", tag: "terminology", feedback: "That is fatigability, the hallmark of neuromuscular junction disorders." },
      { id: "d", text: "Weakness confined to the muscles supplied by one peripheral nerve", tag: "terminology", feedback: "That is a mononeuropathy pattern." },
    ],
    rationale:
      "Corticospinal (pyramidal) lesions weaken the arm extensors, finger extensors and shoulder abductors more than the flexors, and the leg flexors (hip flexion, knee flexion, ankle dorsiflexion) more than the extensors. The antigravity muscles are relatively preserved, which gives the flexed arm and extended leg posture and the circumducting gait after a hemispheric stroke. The phrase signals an [[umn|upper motor neuron]] lesion.",
    sources: [],
  }),
  free({
    id: "p-term-ptosis",
    skill: "terminology",
    modules: ["f-terminology", "f-ocular-motor"],
    difficulty: 1,
    presentation: "eyelid-droop",
    usage: ["placement", "review"],
    vignette: "A patient's right upper eyelid now covers half of the pupil. The left lid sits normally, just over the top of the iris.",
    stem: "What is the medical term for this drooping of the upper eyelid?",
    placeholder: "One term",
    answer: {
      full: [c("ptosis", "ptosis", ["ptosis", "blepharoptosis"])],
      partial: [
        { concept: c("droop", "drooping eyelid", ["droopy eyelid", "drooping eyelid", "eyelid droop", "lid droop", "drooping lid"]), credit: 0.5, feedback: "That is the description. The term is [[ptosis|ptosis]] (TOE-sis)." },
      ],
      wrong: [
        { concept: c("proptosis", "proptosis", ["proptosis", "exophthalmos"]), tag: "terminology", feedback: "Proptosis is forward bulging of the eye. A drooping lid is ptosis." },
        { concept: c("miosis", "miosis", ["miosis"]), tag: "terminology", feedback: "Miosis is a small pupil. It can accompany ptosis in Horner syndrome, but the lid droop itself is ptosis." },
        { concept: c("blepharospasm", "blepharospasm", ["blepharospasm"]), tag: "terminology", feedback: "Blepharospasm is involuntary forceful eyelid closure from muscle contraction, not a weak, drooping lid." },
      ],
    },
    modelAnswer: "Ptosis",
    rationale:
      "[[ptosis|Ptosis]] is drooping of the upper eyelid. Its causes span the neuraxis: a third nerve palsy (levator weakness), Horner syndrome (loss of sympathetic tone to the Muller muscle), myasthenia gravis (fatigable ptosis), and local lid problems. The accompanying pupil and eye movement findings separate them.",
    sources: [],
  }),
];

// ===========================================================================
// Localization
// ===========================================================================

const LOCALIZATION: AssessmentItem[] = [
  mcq({
    id: "p-loc-umn-1",
    skill: "localization",
    modules: ["f-localization"],
    difficulty: 1,
    presentation: "spastic-leg-weakness",
    usage: ["placement", "challenge", "review"],
    vignette:
      "A 58-year-old has slowly progressive stiffness and weakness of the left leg. Tone is increased with a catch that then gives way, knee and ankle reflexes are brisk, there is sustained ankle [[clonus|clonus]], and the left toe is upgoing. There is no wasting and no [[fasciculation|fasciculation]].",
    stem: "Which part of the motor pathway is affected?",
    options: [
      { id: "a", text: "[[umn|Upper motor neuron]] ([[corticospinal-tract|corticospinal tract]])", correct: true, feedback: "Correct." },
      { id: "b", text: "[[lmn|Lower motor neuron]] (anterior horn cell or peripheral nerve)", tag: "misconception", feedback: "Lower motor neuron lesions cause wasting, fasciculations, low tone and reduced or absent reflexes: the opposite of these findings." },
      { id: "c", text: "Neuromuscular junction", tag: "misconception", feedback: "Neuromuscular junction disorders cause fatigable weakness with normal tone and reflexes." },
      { id: "d", text: "Muscle", tag: "misconception", feedback: "Myopathy causes mostly proximal weakness with normal or reduced reflexes and no Babinski sign." },
    ],
    reasoning: {
      stem: "Which finding most specifically points to an upper motor neuron lesion?",
      options: [
        { id: "r1", text: "Upgoing toe ([[babinski-sign|Babinski sign]]) with [[spasticity|spasticity]] and clonus", correct: true },
        { id: "r2", text: "Weakness of the leg", feedback: "Weakness occurs with lesions at every level of the motor system and does not localize by itself." },
        { id: "r3", text: "Slowly progressive course", feedback: "Tempo suggests the type of disease, not the level of the lesion." },
        { id: "r4", text: "No sensory symptoms", feedback: "Pure motor syndromes occur with upper motor neuron, anterior horn, neuromuscular junction and muscle disease." },
      ],
    },
    rationale:
      "Upper motor neuron signs are [[spasticity|spasticity]] (velocity-dependent, clasp-knife tone), [[hyperreflexia|hyperreflexia]], clonus, and an extensor plantar response, with weakness in a pyramidal distribution and little wasting. Lower motor neuron signs are the mirror image: wasting, fasciculations, [[hypotonia|hypotonia]] and [[areflexia|hyporeflexia or areflexia]]. A single limb with upper motor neuron signs points to the cord or brain on the corticospinal pathway; the next step is to look for a sensory level or cortical signs to find the level.",
    sources: [],
  }),
  loc({
    id: "p-loc-bs-1",
    skill: "localization",
    modules: ["f-localization"],
    difficulty: 2,
    presentation: "crossed-signs",
    usage: ["placement", "challenge", "review"],
    vignette:
      "A 66-year-old has sudden double vision on looking to the left. The left eye cannot abduct. The whole left side of the face is weak, including the forehead. The right arm and leg are weak with a right [[babinski-sign|Babinski sign]].",
    stem: "Where is the lesion?",
    correct: ["pons"],
    partial: [
      { region: "midbrain", credit: 0.3, feedback: "Crossed signs do mean brainstem, but the midbrain houses the third and fourth nerve nuclei. Sixth and seventh nerve involvement places the lesion in the pons." },
      { region: "medulla", credit: 0.3, feedback: "Crossed signs do mean brainstem, but the medulla houses cranial nerves IX, X and XII. Sixth and seventh nerve involvement places the lesion in the pons." },
    ],
    rationale:
      "Cranial nerve signs on one side with limb weakness on the other side ('crossed' signs) localize to the brainstem, on the side of the cranial nerve deficit. Here a left [[abducens-nerve|sixth nerve]] palsy and a left lower motor neuron facial palsy (forehead included) place the lesion in the left caudal pons. The left [[corticospinal-tract|corticospinal tract]] is damaged before it crosses at the [[decussation|decussation]] in the lower medulla, so the right [[hemiparesis|limbs are weak]]. A hemispheric lesion cannot weaken the forehead on one side, because the upper face has bilateral cortical input.",
    sources: [],
  }),
  loc({
    id: "p-loc-cord-1",
    skill: "localization",
    modules: ["f-localization"],
    difficulty: 2,
    presentation: "hemicord-sensory-dissociation",
    usage: ["placement", "challenge", "review"],
    vignette:
      "After a stab wound to the back, a 30-year-old has a weak right leg with brisk right knee and ankle reflexes and a right Babinski sign. Vibration and joint position sense are lost in the right leg. Pain and temperature sensation are lost on the left side from just below the umbilicus downward. The arms are normal.",
    stem: "Where is the lesion?",
    correct: ["cord-thoracic"],
    partial: [
      { region: "cord-cervical", credit: 0.4, feedback: "Right structure (one half of the spinal cord), wrong level. Normal arms and a sensory level near the umbilicus (about T10) place it in the thoracic cord." },
      { region: "cord-lumbosacral", credit: 0.3, feedback: "Right structure, wrong level. A sensory level near the umbilicus (about T10) means the lesion is at or slightly above that segment, in the thoracic cord." },
    ],
    rationale:
      "This is a [[brown-sequard|Brown-Sequard]] (hemicord) syndrome. On the side of the lesion: upper motor neuron weakness ([[corticospinal-tract|corticospinal tract]], which has already crossed in the medulla) and loss of vibration and position sense ([[dorsal-columns|dorsal columns]], which cross in the medulla). On the opposite side: loss of pain and temperature, because [[spinothalamic-tract|spinothalamic]] fibers cross within one or two segments of entering the cord. The [[sensory-level|sensory level]] near the umbilicus (T10 [[dermatome|dermatome]]) places the lesion in the right thoracic cord, a segment or two above the level of pain loss.",
    sources: [],
  }),
  loc({
    id: "p-loc-nmj",
    skill: "localization",
    modules: ["c-nmj", "f-localization"],
    difficulty: 2,
    presentation: "fluctuating-weakness",
    usage: ["placement", "review"],
    vignette:
      "A 29-year-old has drooping eyelids and double vision that are mild in the morning and worse by evening. Arm raising weakens after repeated attempts and recovers with rest. Pupils, reflexes, and sensation are normal.",
    stem: "Where is the lesion?",
    correct: ["nmj"],
    partial: [
      { region: "muscle", credit: 0.3, feedback: "Myopathy causes proximal weakness, but not ptosis and diplopia that fluctuate through the day, worsen with use and recover with rest." },
    ],
    rationale:
      "[[fatigability|Fatigable]] weakness of the eyelids, eye muscles and proximal limbs, with normal pupils, reflexes and sensation, localizes to the postsynaptic [[nmj|neuromuscular junction]], as in [[myasthenia-gravis|myasthenia gravis]]. A third nerve palsy would not fluctuate and often involves the pupil; a neuropathy would reduce reflexes or sensation.",
    sources: ["gilhus2016-mg"],
  }),
  loc({
    id: "p-vasc-mca-1",
    skill: "localization",
    modules: ["f-vascular-territories"],
    difficulty: 2,
    presentation: "acute-aphasia-hemiparesis",
    usage: ["placement", "challenge", "review"],
    vignette:
      "A 71-year-old suddenly cannot speak fluently and has trouble following commands. His eyes are deviated to the left. His right face and arm are weak; the right leg is only slightly weak. He does not blink to visual threat from the right.",
    stem: "Where is the lesion?",
    correct: ["cortex-left"],
    partial: [
      { region: "subcortical-left", credit: 0.4, feedback: "Right side, but deep (capsular) strokes usually weaken face, arm and leg equally without aphasia, gaze deviation or a field cut. These cortical signs point to the left hemisphere cortex." },
    ],
    rationale:
      "[[aphasia|Aphasia]] (dominant hemisphere cortex), [[gaze-deviation|gaze deviation]] toward the lesion (the frontal eye field on the damaged side can no longer balance the intact one), a right [[homonymous|homonymous]] [[hemianopia|hemianopia]], and face and arm weakness greater than leg weakness together indicate a large left middle cerebral artery territory stroke involving the cortex. Several cortical signs in a hyperacute stroke also raise the chance of a [[large-vessel-occlusion|large vessel occlusion]].",
    sources: [],
  }),
  mcq({
    id: "p-vasc-aca-1",
    skill: "localization",
    modules: ["f-vascular-territories"],
    difficulty: 2,
    presentation: "leg-predominant-weakness",
    usage: ["placement", "challenge", "review"],
    vignette:
      "A 68-year-old develops weakness of the right leg, much more than the right arm, with a normal face. She has become apathetic and slow to respond, and she has new urinary incontinence.",
    stem: "Which artery is most likely occluded?",
    options: [
      { id: "a", text: "Left anterior cerebral artery", correct: true, feedback: "Correct." },
      { id: "b", text: "Left middle cerebral artery", tag: "misconception", feedback: "MCA strokes weaken the face and arm more than the leg, because those areas lie on the lateral convexity." },
      { id: "c", text: "Right anterior cerebral artery", tag: "misconception", feedback: "Motor cortex controls the opposite side of the body, so right leg weakness means a left hemisphere lesion." },
      { id: "d", text: "Left posterior cerebral artery", tag: "misconception", feedback: "PCA strokes cause a [[contralateral|contralateral]] [[homonymous|homonymous]] [[hemianopia|hemianopia]], not leg weakness." },
    ],
    rationale:
      "The leg area of the motor and sensory cortex lies on the medial surface of the hemisphere, supplied by the anterior cerebral artery. Medial frontal damage also causes apathy and slowed responses (abulia) and impaired control of micturition. A left ACA stroke therefore gives right leg weakness greater than arm weakness, with a spared face.",
    sources: [],
  }),
  free({
    id: "p-loc-lacunar",
    skill: "localization",
    modules: ["f-vascular-territories"],
    difficulty: 2,
    presentation: "pure-motor-hemiparesis",
    usage: ["placement", "review"],
    schematic: { kind: "territory", territory: "lacunar-left-ic" },
    stem: "The schematic shades a small deep infarct in the posterior limb of the left [[internal-capsule|internal capsule]]. Which clinical syndrome would you expect?",
    placeholder: "Describe the expected deficit",
    answer: {
      full: [
        c("pure-motor", "pure motor hemiparesis (right side)", [
          "pure motor",
          "right face + arm + leg",
          "right + face arm leg",
          "right hemiparesis + without cortical",
          "right hemiparesis + no cortical",
          "right hemiparesis + face arm leg",
          "right hemiplegia + face arm leg",
          "right hemiparesis + no aphasia",
          "right hemiparesis + without aphasia",
          "contralateral hemiparesis + face arm leg",
          "contralateral + face arm leg",
          "contralateral hemiparesis + without cortical",
          "contralateral hemiparesis + no cortical",
        ]),
      ],
      partial: [
        { concept: c("right-hemi", "right hemiparesis", ["right hemiparesis", "right hemiplegia", "right sided weakness", "right weakness", "contralateral hemiparesis", "contralateral weakness"]), credit: 0.6, feedback: "Yes, right-sided weakness. The key feature is that face, arm and leg are weak about equally with no cortical signs (no aphasia, neglect or field cut): a pure motor stroke." },
        { concept: c("lacune", "lacunar stroke", ["lacunar", "lacune"]), credit: 0.5, feedback: "That names the stroke type. The question asks for the syndrome: pure motor hemiparesis of the right face, arm and leg." },
      ],
      wrong: [
        { concept: c("left-hemi", "left hemiparesis", ["left hemiparesis", "left hemiplegia", "left sided weakness", "left weakness", "left face + arm", "ipsilateral weakness", "ipsilateral hemiparesis"]), tag: "misconception", feedback: "The internal capsule carries corticospinal fibers before they cross in the lower medulla, so a left capsular lesion weakens the right side." },
        { concept: c("pure-sensory", "pure sensory stroke", ["pure sensory"]), tag: "misconception", feedback: "A pure sensory lacunar stroke comes from the thalamus. The posterior limb of the internal capsule carries the motor fibers that produce pure motor hemiparesis." },
      ],
    },
    modelAnswer: "Pure motor hemiparesis: weakness of the right face, arm and leg with no cortical signs.",
    rationale:
      "Corticospinal and corticobulbar fibers for the face, arm and leg are packed tightly in the posterior limb of the [[internal-capsule|internal capsule]], so a small [[lacunar-stroke|lacunar]] infarct there weakens all three about equally on the [[contralateral|contralateral]] side. Because the cortex is spared there is no aphasia, neglect, [[hemianopia|field cut]] or gaze deviation. The absence of cortical signs is what distinguishes a lacunar syndrome from a cortical MCA stroke.",
    sources: [],
  }),
  loc({
    id: "p-loc-foot-drop",
    skill: "localization",
    modules: ["f-localization", "c-polyneuropathy-radiculopathy"],
    difficulty: 3,
    presentation: "foot-drop",
    usage: ["placement", "review"],
    vignette:
      "A 45-year-old woke with a right foot drop after sitting cross-legged for hours. Ankle dorsiflexion and foot eversion are weak; foot inversion and hip abduction are normal. Sensation is reduced over the top of the foot. Knee and ankle reflexes are normal.",
    stem: "Where is the lesion?",
    correct: ["peripheral-nerve"],
    partial: [
      { region: "root", credit: 0.4, feedback: "An L5 radiculopathy also causes foot drop, but it weakens foot inversion (tibialis posterior) and hip abduction (gluteus medius) too. Normal inversion and hip abduction point to the common fibular (peroneal) nerve." },
      { region: "plexus", credit: 0.2, feedback: "A lumbosacral plexus lesion would affect muscles supplied by several nerves, including inversion and hip muscles." },
    ],
    rationale:
      "The common fibular (peroneal) nerve supplies the ankle dorsiflexors and evertors and the skin of the top of the foot, and it is easily compressed at the fibular head (leg crossing, prolonged squatting). The L5 [[myotome|myotome]] includes those muscles plus tibialis posterior (inversion, tibial nerve) and gluteus medius (hip abduction, superior gluteal nerve). Testing muscles that share a root but not a nerve is how root and nerve lesions are separated at the bedside.",
    sources: [],
  }),
  free({
    id: "p-cn-ino-1",
    skill: "localization",
    modules: ["f-ocular-motor"],
    difficulty: 2,
    presentation: "horizontal-diplopia",
    usage: ["placement", "challenge", "review"],
    schematic: { kind: "eye-gaze", finding: "left-ino" },
    vignette:
      "A 28-year-old has double vision on looking to the right. In the schematic of attempted right gaze, the left eye does not adduct past the midline and the right eye abducts with [[nystagmus|nystagmus]]. Convergence is preserved.",
    stem: "What is this finding, and which structure is damaged? Include the side.",
    placeholder: "Finding and structure, with side",
    answer: {
      full: [c("left-mlf", "left medial longitudinal fasciculus", ["left mlf", "left medial longitudinal fasciculus"])],
      partial: [
        { concept: c("left-ino", "left internuclear ophthalmoplegia", ["left ino", "left internuclear ophthalmoplegia", "left internuclear"]), credit: 0.7, feedback: "Correct syndrome. Name the structure as well: the left medial longitudinal fasciculus (MLF), which links the right abducens nucleus to the left medial rectus subnucleus." },
        { concept: c("mlf-no-side", "MLF or INO without a side", ["mlf", "medial longitudinal fasciculus", "internuclear ophthalmoplegia", "internuclear"]), credit: 0.5, feedback: "Right structure or syndrome. Add the side: an INO is named for the eye that fails to adduct, here the left, so the left MLF is damaged." },
      ],
      wrong: [
        { concept: c("right-side", "right MLF or right INO", ["right mlf", "right medial longitudinal fasciculus", "right ino", "right internuclear"]), tag: "misconception", feedback: "Wrong side. An INO is named for the eye that fails to adduct (here the left), and the lesion is in the MLF on that same side." },
        { concept: c("cn6", "sixth nerve palsy", ["abducens palsy", "abducens nerve palsy", "sixth nerve palsy", "6th nerve palsy", "cranial nerve 6 palsy", "cranial nerve vi palsy", "cn6 palsy"]), tag: "misconception", feedback: "A sixth nerve palsy stops the eye abducting. Here the right eye abducts fully; it is the left eye that fails to adduct." },
        { concept: c("cn3", "third nerve palsy", ["third nerve palsy", "3rd nerve palsy", "oculomotor palsy", "oculomotor nerve palsy", "cranial nerve 3 palsy", "cranial nerve iii palsy", "cn3 palsy"]), tag: "misconception", feedback: "Preserved convergence shows that the left medial rectus and third nerve work. The failure is in the connection that coordinates horizontal gaze: the MLF." },
      ],
    },
    modelAnswer: "Left internuclear ophthalmoplegia from a lesion of the left medial longitudinal fasciculus (MLF).",
    rationale:
      "Horizontal gaze to the right starts in the right abducens nucleus, which drives the right lateral rectus and, through the [[mlf|medial longitudinal fasciculus]], the left medial rectus subnucleus. A left MLF lesion leaves the left eye unable to adduct on right gaze, with abducting nystagmus of the right eye: a left [[ino|internuclear ophthalmoplegia]]. Convergence uses a different pathway, so it is preserved. In a young adult the commonest cause is demyelination; in an older adult, a small brainstem stroke.",
    sources: [],
  }),
];

// ===========================================================================
// Mechanism
// ===========================================================================

const MECHANISM: AssessmentItem[] = [
  mcq({
    id: "p-cn-3-1",
    skill: "mechanism",
    modules: ["f-ocular-motor"],
    difficulty: 2,
    presentation: "third-nerve-palsy",
    usage: ["placement", "challenge", "review"],
    vignette: "A 49-year-old has a left [[ptosis|ptosis]], a left eye that rests down and out, and a dilated left pupil that reacts poorly to light.",
    stem: "Why does pupil involvement raise concern for a compressive lesion such as an aneurysm, rather than a microvascular (ischemic) palsy?",
    options: [
      { id: "a", text: "The parasympathetic pupil fibers run on the outer surface of the [[oculomotor-nerve|third nerve]], where external compression reaches them first; microvascular ischemia mainly damages the core of the nerve", correct: true, feedback: "Correct." },
      { id: "b", text: "Ischemia preferentially damages the outer fibers of the nerve", tag: "misconception", feedback: "It is the reverse: ischemia tends to affect the core of the nerve and spare the superficial pupil fibers." },
      { id: "c", text: "The dilated pupil reflects compression of sympathetic fibers on the carotid artery", tag: "misconception", feedback: "Loss of sympathetic supply causes a small pupil (Horner syndrome). A dilated pupil means loss of parasympathetic constriction." },
      { id: "d", text: "Pupil fibers travel with the abducens nerve, which is compressed at the same time", tag: "misconception", feedback: "Pupil constrictor fibers travel with the third nerve, not the sixth." },
    ],
    rationale:
      "Parasympathetic fibers for pupil constriction lie superficially (dorsomedially) on the [[oculomotor-nerve|oculomotor nerve]], so an expanding posterior communicating artery aneurysm compresses them early, giving [[mydriasis|mydriasis]]. Microvascular (diabetic or hypertensive) palsies affect the inner nerve and usually spare the pupil. Pupil sparing does not completely exclude compression, especially with a partial palsy, but a pupil-involving third nerve palsy needs urgent vascular imaging because a growing aneurysm can rupture.",
    sources: [],
  }),
  mcq({
    id: "p-mech-demyelination",
    skill: "mechanism",
    modules: ["c-gbs"],
    difficulty: 2,
    presentation: "ascending-weakness",
    usage: ["placement", "review"],
    vignette: "A 35-year-old has rapidly progressive weakness. Nerve conduction studies show markedly slowed conduction velocities and partial conduction block.",
    stem: "Why does loss of myelin slow conduction and sometimes block it altogether?",
    options: [
      { id: "a", text: "Without myelin, current leaks across the internode and the bare axon membrane there has few sodium channels, so [[saltatory-conduction|saltatory conduction]] fails and the impulse spreads slowly or stops", correct: true, feedback: "Correct." },
      { id: "b", text: "Demyelination destroys the axons, so fewer fibers conduct", tag: "misconception", feedback: "That describes [[axonal|axonal]] loss, which mainly lowers response amplitude rather than slowing conduction." },
      { id: "c", text: "Antibodies block acetylcholine release at the nerve terminal", tag: "misconception", feedback: "That is a presynaptic neuromuscular junction mechanism, not a disorder of nerve conduction." },
      { id: "d", text: "Myelin generates the action potential, so without it no potential forms", tag: "misconception", feedback: "Action potentials are generated by voltage-gated sodium channels clustered at the nodes of Ranvier. Myelin insulates the internode." },
    ],
    rationale:
      "Myelin raises membrane resistance and lowers capacitance between nodes, so the current from one node depolarizes the next and the impulse jumps node to node ([[saltatory-conduction|saltatory conduction]]). After [[demyelination|demyelination]], current leaks away and charges a larger membrane area, so the next node is reached slowly or not at all. Slowing produces prolonged latencies and slow velocities; failure produces [[conduction-block|conduction block]]; unequal slowing across fibers produces [[temporal-dispersion|temporal dispersion]].",
    sources: ["vandoorn2023-gbs"],
  }),
  free({
    id: "p-mech-nmj-ft",
    skill: "mechanism",
    modules: ["c-nmj"],
    difficulty: 3,
    presentation: "fatigable-grip",
    usage: ["placement", "review"],
    vignette: "In [[myasthenia-gravis|myasthenia gravis]], a patient's grip is normal at first but fades with repeated squeezing, then recovers after rest.",
    stem: "Explain the mechanism of this fatigable weakness. Include why it worsens with use.",
    placeholder: "Two linked ideas",
    answer: {
      full: [
        c("mechanism", "fewer receptors plus declining release with use", [
          "receptor + release",
          "achr + release",
          "against receptor + release",
          "against achr + release",
          "against receptor + safety",
          "against achr + safety",
          "against receptor + vesicle",
          "against receptor + depletion",
          "against receptor + threshold",
          "against achr + threshold",
          "against receptor + run down",
          "receptor + safety factor",
          "achr + safety factor",
          "receptor + safety margin",
          "achr + safety margin",
          "receptor + vesicle",
          "achr + vesicle",
          "receptor + quanta",
          "receptor + run down",
          "receptor + rundown",
          "receptor + depletion",
          "achr + depletion",
          "receptor + endplate threshold",
          "receptor + end plate threshold",
          "achr + endplate threshold",
        ]),
      ],
      partial: [
        { concept: c("antibody-only", "receptor antibodies only", ["receptor antibody", "achr antibody", "antibody receptor", "antibody + acetylcholine receptor", "against receptor", "against achr", "fewer receptor", "receptor blocked", "receptor loss", "receptor destroyed", "achr"]), credit: 0.5, feedback: "That is the cause of MG, but it does not explain why weakness worsens with use. Add: acetylcholine release per impulse normally falls with repeated firing, and with fewer receptors the safety margin is lost, so more fibers fail to reach threshold." },
        { concept: c("release-only", "declining release only", ["less acetylcholine", "release decline", "release fall", "vesicle depletion", "fewer vesicle"]), credit: 0.4, feedback: "Correct that release declines with repeated firing, but that happens in everyone. The missing piece is the reduced number of functional receptors in MG, which removes the safety margin." },
      ],
      wrong: [
        { concept: c("vgcc", "calcium channel antibodies", ["calcium channel", "vgcc"]), tag: "misconception", feedback: "Antibodies to presynaptic voltage-gated calcium channels cause Lambert-Eaton syndrome, in which strength improves briefly with exercise." },
        { concept: c("demyel", "demyelination", ["demyelination", "demyelinating"]), tag: "misconception", feedback: "MG is a disorder of the neuromuscular junction, not of nerve myelin." },
        { concept: c("lactic", "muscle energy failure", ["lactic acid", "glycogen", "muscle energy"]), tag: "misconception", feedback: "Fatigability in MG is a failure of transmission at the junction, not of muscle metabolism." },
      ],
    },
    modelAnswer:
      "Antibodies reduce the number of functional acetylcholine receptors, so the safety factor is low. With repeated firing, acetylcholine release per impulse normally declines, so endplate potentials in more fibers fall below threshold and strength fades, then recovers with rest.",
    rationale:
      "Normally each nerve impulse releases far more acetylcholine than is needed to reach threshold at the endplate (the safety factor). Release per impulse falls during repeated firing, but the margin absorbs it. In [[myasthenia-gravis|myasthenia gravis]], antibodies against the [[acetylcholine-receptor|acetylcholine receptor]] block receptors, cause their internalization and activate complement, so the margin is small. When release runs down, more and more fibers fail to fire: clinically [[fatigability|fatigability]], electrically a [[decrement|decrement]] on repetitive stimulation.",
    sources: ["gilhus2016-mg"],
  }),
  mcq({
    id: "p-mech-se-gaba",
    skill: "mechanism",
    modules: ["c-status-epilepticus"],
    difficulty: 3,
    presentation: "prolonged-convulsion",
    usage: ["placement", "review"],
    vignette:
      "Paramedics could not get access, and a 34-year-old received her first benzodiazepine 40 minutes after a convulsion began. She is still convulsing, and a repeat dose also fails.",
    stem: "Which mechanism best explains why benzodiazepines lose effect as status epilepticus continues?",
    options: [
      { id: "a", text: "Synaptic GABA-A receptors are internalized while NMDA (glutamate) receptors move to the synapse, so inhibition falls and excitation rises", correct: true, feedback: "Correct." },
      { id: "b", text: "The liver metabolizes benzodiazepines faster during a seizure", tag: "misconception", feedback: "Drug clearance is not the main problem; the target receptors themselves are lost from the synapse." },
      { id: "c", text: "Neurons run out of glucose, so no drug can act", tag: "misconception", feedback: "Energy failure contributes to injury in prolonged seizures but does not explain selective loss of benzodiazepine response." },
      { id: "d", text: "Benzodiazepines cannot cross the blood-brain barrier once a seizure starts", tag: "misconception", feedback: "They still reach the brain; there are simply fewer synaptic GABA-A receptors for them to act on." },
    ],
    rationale:
      "Benzodiazepines enhance synaptic GABA-A receptors. During prolonged seizures these receptors are internalized, while NMDA receptors are trafficked to the synapse, so the seizure becomes self-sustaining and drug resistant. Sustained glutamate signaling also drives calcium entry and neuronal injury ([[excitotoxicity|excitotoxicity]]). This is why [[status-epilepticus|status epilepticus]] is treated in time-based stages: an adequate first benzodiazepine dose early, then a second-line agent without delay.",
    sources: ["glauser2016-se"],
  }),
  mcq({
    id: "p-mech-mca",
    skill: "mechanism",
    modules: ["f-vascular-territories"],
    difficulty: 1,
    presentation: "acute-hemiparesis",
    usage: ["placement", "review"],
    stem: "In a left middle cerebral artery stroke, why are the right face and arm usually weaker than the right leg?",
    options: [
      { id: "a", text: "The leg area of the motor cortex lies on the medial surface of the hemisphere, supplied by the anterior cerebral artery; the face and arm areas lie on the lateral surface, supplied by the MCA", correct: true, feedback: "Correct." },
      { id: "b", text: "Leg fibers cross in the spinal cord, so they escape the stroke", tag: "misconception", feedback: "Corticospinal fibers for both arm and leg cross in the lower medulla." },
      { id: "c", text: "The leg receives motor control from both hemispheres", tag: "misconception", feedback: "Bilateral cortical control applies to the upper face (forehead), not the leg." },
      { id: "d", text: "Leg muscles are larger, so the same weakness is harder to detect", tag: "misconception", feedback: "The difference is anatomical: the leg cortex lies outside MCA territory." },
    ],
    rationale:
      "The motor homunculus drapes over the hemisphere: face and hand on the lateral convexity (MCA territory), leg and foot over the top onto the medial surface (ACA territory). Cortical MCA strokes therefore weaken the [[contralateral|contralateral]] face and arm more than the leg, whereas a deep capsular stroke, where the fibers converge, weakens all three equally.",
    sources: [],
  }),
  free({
    id: "p-mech-forehead",
    skill: "mechanism",
    modules: ["f-localization"],
    difficulty: 2,
    presentation: "facial-weakness",
    usage: ["placement", "review"],
    vignette: "After a left hemisphere stroke, a patient's right lower face droops, but he wrinkles both sides of his forehead equally and closes both eyes tightly.",
    stem: "Why is the forehead spared in an upper motor neuron facial weakness?",
    placeholder: "Explain the anatomy",
    answer: {
      full: [
        c("bilateral", "bilateral cortical input to the upper face", [
          "bilateral innervation",
          "bilaterally innervated",
          "bilateral input",
          "bilateral cortical",
          "bilateral corticobulbar",
          "bilateral supranuclear",
          "bilateral supply",
          "bilateral control",
          "bilateral upper motor neuron",
          "both hemispheres",
          "both cerebral hemispheres",
          "both cortices",
          "both motor cortices",
          "both sides cortex",
          "both sides brain",
          "input from both sides",
          "innervated both sides",
          "supplied both sides",
          "dual innervation",
        ]),
      ],
      partial: [
        { concept: c("corticobulbar", "corticobulbar", ["corticobulbar"]), credit: 0.4, feedback: "Right pathway. The key point is that the upper face part of the facial nucleus receives corticobulbar input from both hemispheres, so the intact hemisphere still drives the forehead." },
        { concept: c("umn", "upper motor neuron lesion", ["upper motor neuron", "central facial"]), credit: 0.3, feedback: "That names the lesion type. The reason for forehead sparing is that the upper face receives input from both hemispheres." },
      ],
      wrong: [
        { concept: c("bell", "facial nerve lesion", ["bell palsy", "bells palsy", "facial nerve lesion", "facial nerve damage", "peripheral facial"]), tag: "misconception", feedback: "A facial nerve (lower motor neuron) lesion weakens the whole half of the face, forehead included. Forehead sparing points to a lesion above the facial nucleus." },
        { concept: c("separate-nerve", "separate nerve", ["separate nerve", "different nerve", "trigeminal"]), tag: "misconception", feedback: "The forehead muscles are supplied by the facial nerve like the rest of the face. The difference is in the cortical input to the nucleus." },
      ],
    },
    modelAnswer: "The upper face part of the facial nucleus receives bilateral corticobulbar input, from both hemispheres, so the intact hemisphere still drives the forehead.",
    rationale:
      "Facial nucleus neurons for the upper face receive corticobulbar fibers from both hemispheres, while those for the lower face receive mainly crossed input. A unilateral [[umn|upper motor neuron]] lesion therefore weakens mainly the [[contralateral|contralateral]] lower face. A lesion of the nucleus or facial nerve weakens the whole [[ipsilateral|ipsilateral]] face, including the forehead and eye closure.",
    sources: [],
  }),
  free({
    id: "p-mech-shock",
    skill: "mechanism",
    modules: ["f-localization"],
    difficulty: 2,
    presentation: "acute-paraplegia",
    usage: ["placement", "review"],
    vignette:
      "Within an hour of a fall causing a thoracic spinal cord injury, a 25-year-old has flaccid legs, no knee or ankle reflexes, and no Babinski sign. Over the following weeks the legs become spastic with brisk reflexes.",
    stem: "What explains the early flaccid, areflexic stage?",
    placeholder: "Name and explain",
    answer: {
      full: [
        c("spinal-shock", "spinal shock", [
          "spinal shock",
          "cord shock",
          "loss descending input",
          "loss descending facilitation",
          "loss supraspinal input",
          "loss supraspinal facilitation",
          "sudden loss descending",
          "reflexes temporarily depressed",
          "temporary depression reflexes",
          "temporary depression reflex",
        ]),
      ],
      partial: [
        { concept: c("acute-umn", "acute upper motor neuron lesion", ["acute upper motor neuron", "upper motor neuron"]), credit: 0.4, feedback: "True: it is still an upper motor neuron lesion. Name the phenomenon: spinal shock, a temporary depression of spinal reflex circuits after abrupt loss of descending input." },
      ],
      wrong: [
        { concept: c("peripheral", "peripheral nerve cause", ["guillain barre", "peripheral neuropathy", "peripheral nerve damage", "nerve root damage"]), tag: "misconception", feedback: "The lesion is in the cord. Early flaccidity is temporary; spasticity that appears later confirms the upper motor neuron level." },
      ],
    },
    modelAnswer: "Spinal shock: abrupt loss of descending input temporarily depresses spinal reflex circuits, so the legs are flaccid and areflexic before spasticity develops.",
    rationale:
      "After an abrupt cord or hemispheric lesion, spinal reflex circuits below the lesion lose descending facilitation and become temporarily silent: [[spinal-shock|spinal shock]], with [[hypotonia|hypotonia]] and [[areflexia|areflexia]]. Over days to weeks, reflexes return and become exaggerated, with [[spasticity|spasticity]], clonus and Babinski signs. An acute cord lesion can therefore mimic a lower motor neuron process; a [[sensory-level|sensory level]] and sphincter involvement give it away.",
    sources: [],
  }),
  mcq({
    id: "p-nm-lems-1",
    skill: "mechanism",
    modules: ["c-nmj"],
    difficulty: 2,
    presentation: "proximal-weakness-dry-mouth",
    usage: ["placement", "challenge", "review"],
    vignette:
      "A 63-year-old smoker has months of difficulty rising from chairs and climbing stairs, a dry mouth, and erectile dysfunction. Knee reflexes are absent at rest but appear after 10 seconds of maximal quadriceps contraction. There is mild ptosis.",
    stem: "What mechanism explains the brief improvement in reflexes and strength after exercise?",
    options: [
      { id: "a", text: "Calcium builds up in the presynaptic terminal during repeated firing, partly overcoming antibody-mediated loss of [[voltage-gated-calcium-channel|voltage-gated calcium channels]] and increasing acetylcholine release", correct: true, feedback: "Correct." },
      { id: "b", text: "Exercise increases the number of postsynaptic acetylcholine receptors", tag: "misconception", feedback: "Receptor numbers do not change within seconds; the effect is presynaptic." },
      { id: "c", text: "Blood flow during exercise washes acetylcholine receptor antibodies away from the junction", tag: "misconception", feedback: "Antibodies are not washed out by exercise, and this patient's disorder is presynaptic." },
      { id: "d", text: "Warming of the muscle speeds nerve conduction", tag: "misconception", feedback: "Temperature affects neuromuscular transmission, but the facilitation here reflects presynaptic calcium accumulation." },
    ],
    reasoning: {
      stem: "Which finding most strongly points to a presynaptic disorder rather than myasthenia gravis?",
      options: [
        { id: "r1", text: "Reflexes absent at rest that return after brief maximal exercise ([[facilitation|facilitation]])", correct: true },
        { id: "r2", text: "Proximal leg weakness", feedback: "Proximal weakness occurs in both MG and LEMS." },
        { id: "r3", text: "Mild ptosis", feedback: "Ptosis is more typical of MG; it does not favor LEMS." },
        { id: "r4", text: "Smoking history", feedback: "Smoking raises suspicion of small cell lung cancer, which is associated with LEMS, but it is not a sign of presynaptic failure." },
      ],
    },
    rationale:
      "In [[lambert-eaton-syndrome|Lambert-Eaton myasthenic syndrome]], antibodies against presynaptic P/Q-type voltage-gated calcium channels reduce calcium entry and therefore acetylcholine release. Brief maximal contraction lets calcium accumulate in the terminal, temporarily increasing release: reflexes and strength improve ([[facilitation|facilitation]]). Autonomic symptoms (dry mouth, erectile dysfunction) reflect the same channel at autonomic synapses. About half of cases are paraneoplastic, mostly with small cell lung cancer.",
    sources: ["titulaer2011-lems"],
  }),
];

// ===========================================================================
// History and examination
// ===========================================================================

const HISTORY_EXAM: AssessmentItem[] = [
  mcq({
    id: "p-hx-fatig",
    skill: "history-exam",
    modules: ["c-nmj"],
    difficulty: 1,
    presentation: "fatigable-ptosis",
    usage: ["placement", "review"],
    vignette: "A 31-year-old reports eyelid drooping and double vision that worsen through the day.",
    stem: "Which bedside maneuver best demonstrates [[fatigability|fatigability]]?",
    options: [
      { id: "a", text: "Ask her to look up steadily for about a minute and watch whether the lids droop progressively", correct: true, feedback: "Correct. Sustained effort that produces progressive weakness is observed fatigability." },
      { id: "b", text: "Ask whether she feels tired all the time", tag: "misconception", feedback: "General tiredness is a common, nonspecific symptom. Fatigability is an observed decline in strength with sustained or repeated use." },
      { id: "c", text: "Test each muscle once at maximal effort", tag: "misconception", feedback: "A single test can be normal. Fatigability needs sustained or repeated effort." },
      { id: "d", text: "Check the deep tendon reflexes", tag: "misconception", feedback: "Reflexes are usually normal in myasthenia gravis and do not test fatigability." },
    ],
    rationale:
      "[[fatigability|Fatigability]] is a sign, not a feeling: strength declines during sustained or repeated effort and recovers with rest. Useful maneuvers include sustained upgaze (progressive [[ptosis|ptosis]] or [[diplopia|diplopia]]), repeated shoulder abduction, and counting aloud on one breath (bulbar and respiratory reserve). It points to a [[nmj|neuromuscular junction]] disorder such as myasthenia gravis.",
    sources: ["gilhus2016-mg"],
  }),
  mcq({
    id: "p-hx-hoover",
    skill: "history-exam",
    modules: ["c-fnd"],
    difficulty: 3,
    presentation: "unilateral-leg-weakness",
    usage: ["placement", "review"],
    vignette:
      "A 36-year-old reports a weak left leg. Lying on her back, she cannot press the left heel down into the examiner's hand when asked. When she lifts her right leg against resistance, the examiner feels strong involuntary downward pressure from the left heel.",
    stem: "What is the best interpretation?",
    options: [
      { id: "a", text: "A positive [[hoover-sign|Hoover sign]]: a positive sign supporting functional leg weakness, interpreted together with the rest of the examination", correct: true, feedback: "Correct." },
      { id: "b", text: "Evidence that she is feigning weakness", tag: "misconception", feedback: "Hoover sign shows a mismatch between voluntary and automatic movement. It says nothing about intent; functional disorder is not feigning." },
      { id: "c", text: "An upper motor neuron sign from a right hemisphere lesion", tag: "misconception", feedback: "With true upper motor neuron weakness, automatic hip extension of the weak leg is weak too." },
      { id: "d", text: "A normal finding with no diagnostic value", tag: "misconception", feedback: "Hoover sign has good reported specificity for functional weakness." },
    ],
    rationale:
      "Hip extension of the weak leg is weak on request but returns automatically when the other hip flexes against resistance: a positive [[hoover-sign|Hoover sign]]. [[functional-neurological-disorder|Functional neurological disorder]] is diagnosed by positive signs like this, not merely by excluding other diseases. The sign does not imply feigning, and functional and structural disorders can coexist, so the rest of the examination still matters.",
    sources: ["daum2014-positive-signs", "espay2018-fnd"],
  }),
  multi({
    id: "p-hx-symptom-sign",
    skill: "history-exam",
    modules: ["x-symptoms-signs"],
    difficulty: 2,
    presentation: "documentation",
    usage: ["placement", "review"],
    stem: "Which of these entries are examination signs (observed by the examiner) rather than reported symptoms?",
    options: [
      { id: "a", text: "Right extensor plantar response", correct: true },
      { id: "b", text: "Reduced pinprick sensation below T10 on testing", correct: true },
      { id: "c", text: "Progressive ptosis during 60 seconds of sustained upgaze", correct: true },
      { id: "d", text: "Left pronator drift", correct: true },
      { id: "e", text: "Reports numbness in the left hand", tag: "misconception", feedback: "That is a symptom: something the patient reports. Record it, then test for a matching sign." },
      { id: "f", text: "Feels the room spinning when she turns over in bed", tag: "misconception", feedback: "That is a reported symptom (vertigo). Signs would include nystagmus or a positional test result." },
      { id: "g", text: "Says his vision doubles in the evening", tag: "misconception", feedback: "Reported diplopia is a symptom. The matching sign is a measured ocular misalignment or fatigable ptosis." },
    ],
    rationale:
      "A [[symptom|symptom]] is what the patient experiences and reports; a [[clinical-sign|sign]] is what the examiner observes or elicits. Keeping them separate in notes shows which findings are objective, makes change over time measurable, and prevents a reported symptom from being recorded as if it had been confirmed.",
    sources: [],
  }),
  multi({
    id: "p-hx-cord-exam",
    skill: "history-exam",
    modules: ["c-spinal-emergencies", "f-localization"],
    difficulty: 2,
    presentation: "back-pain-urinary-retention",
    usage: ["placement", "review"],
    vignette: "A 67-year-old with known prostate cancer has 3 weeks of mid-back pain and, since yesterday, leg weakness and difficulty passing urine.",
    stem: "Which examination elements are essential now?",
    options: [
      { id: "a", text: "Search for a [[sensory-level|sensory level]] on the trunk", correct: true },
      { id: "b", text: "Test perianal (saddle) sensation and anal tone", correct: true },
      { id: "c", text: "Test leg strength, tone, reflexes, and plantar responses", correct: true },
      { id: "d", text: "Bedside bladder scan for retained urine", correct: true },
      { id: "e", text: "Fundoscopy for papilledema", tag: "misconception", feedback: "The picture localizes to the spinal cord or cauda equina; fundoscopy does not help answer the urgent question." },
      { id: "f", text: "Formal visual field testing", tag: "misconception", feedback: "Visual fields do not test the spinal cord and delay the urgent assessment." },
      { id: "g", text: "A full cognitive screening test", tag: "misconception", feedback: "Cognition is not the question here, and time matters." },
    ],
    rationale:
      "Back pain in a patient with cancer plus new weakness or sphincter symptoms suggests metastatic spinal cord compression or cauda equina compression. The examination aims to find the level (a sensory level, upper versus lower motor neuron signs in the legs) and to document sphincter involvement (saddle sensation, anal tone, urinary retention). These findings set the urgency and target of imaging.",
    sources: [],
  }),
  mcq({
    id: "p-hx-stroke-onset",
    skill: "history-exam",
    modules: ["c-acute-ischemic-stroke"],
    difficulty: 2,
    presentation: "wake-up-stroke",
    usage: ["placement", "review"],
    vignette:
      "A 72-year-old went to bed well at 22:00. His wife found him at 06:30 with right-sided weakness and garbled speech. He clearly remembers getting up at 03:00 to use the bathroom and walking normally.",
    stem: "Which time should be recorded as last known well for treatment decisions?",
    options: [
      { id: "a", text: "03:00, the last time he was known to be at his normal baseline", correct: true, feedback: "Correct. The last time the patient was reliably known to be normal defines the onset for treatment windows." },
      { id: "b", text: "06:30, when he was found", tag: "misconception", feedback: "Discovery time is not onset. Using it would wrongly make the stroke look recent." },
      { id: "c", text: "22:00, when he went to bed", tag: "misconception", feedback: "There is a later reliable time at baseline (03:00), and the latest such time is used." },
      { id: "d", text: "Onset is unknown, so reperfusion treatment is impossible", tag: "misconception", feedback: "Unknown or remote onset does not automatically exclude treatment: imaging-based selection can identify patients who may still benefit." },
    ],
    rationale:
      "The time of onset for stroke treatment decisions is the time the patient was last known well, not the time symptoms were discovered. Taking a careful history (getting up at night, a phone call, a witness) can move that time later and keep treatment options open. When onset is unknown, imaging selection (for example MRI diffusion and FLAIR mismatch, or perfusion imaging for thrombectomy) may still allow reperfusion treatment.",
    sources: ["powers2019-ais"],
  }),
  free({
    id: "p-hx-ptosis-pupil",
    skill: "history-exam",
    modules: ["f-ocular-motor"],
    difficulty: 2,
    presentation: "ptosis-anisocoria",
    usage: ["placement", "review"],
    vignette: "A 60-year-old has a new right [[ptosis|ptosis]].",
    stem: "Which single examination finding best distinguishes a third nerve palsy from Horner syndrome as the cause?",
    placeholder: "One finding",
    answer: {
      full: [
        c("pupil", "pupil size", ["pupil", "mydriasis", "miosis", "anisocoria", "constricted", "dilated"]),
        c("motility", "eye movements", ["eye movement", "extraocular movement", "ocular motility", "down and out", "eye position", "ophthalmoplegia", "adduction", "ocular movement", "eye motility"]),
      ],
      partial: [
        { concept: c("degree", "degree of ptosis", ["severity + ptosis", "degree + ptosis", "amount + ptosis", "complete ptosis", "mild ptosis", "partial ptosis"]), credit: 0.5, feedback: "Horner ptosis is usually mild and third nerve ptosis often marked, but the degree overlaps. Pupil size is the most useful single discriminator: small in Horner syndrome, large in a compressive third nerve palsy." },
        { concept: c("sweat", "sweating", ["anhidrosis", "sweating"]), credit: 0.4, feedback: "Anhidrosis supports Horner syndrome when present, but it depends on the lesion site and is hard to test. Pupil size is the better single discriminator." },
      ],
      wrong: [
        { concept: c("fatig", "fatigability", ["fatigability", "fatigue", "ice pack"]), tag: "misconception", feedback: "Fatigable ptosis suggests myasthenia gravis, which is a different question. Third nerve palsy and Horner syndrome are separated by the pupil." },
        { concept: c("acuity", "visual acuity", ["visual acuity", "acuity", "fundoscopy", "visual field"]), tag: "misconception", feedback: "Neither condition typically affects acuity, fields or the fundus. Look at the pupil." },
      ],
    },
    modelAnswer: "The pupil: a large (dilated) pupil with ptosis suggests a third nerve palsy, while a small pupil (miosis) suggests Horner syndrome.",
    rationale:
      "In [[horner-syndrome|Horner syndrome]] the ptosis is mild and the pupil on that side is small ([[miosis|miosis]]), with [[anisocoria|anisocoria]] greater in the dark. In a third nerve palsy the ptosis is often marked, the eye rests down and out, and a compressive lesion dilates the pupil ([[mydriasis|mydriasis]]). Eye movements also discriminate, and they help when an ischemic third nerve palsy spares the pupil.",
    sources: [],
  }),
];

// ===========================================================================
// Differential diagnosis
// ===========================================================================

const DIFFERENTIAL: AssessmentItem[] = [
  mcq({
    id: "p-immuno-nmdar-1",
    skill: "differential",
    modules: ["c-autoimmune-encephalitis"],
    difficulty: 2,
    presentation: "psychiatric-encephalopathy",
    usage: ["placement", "challenge", "review"],
    vignette:
      "A 24-year-old woman had a week of headache and low-grade fever, then two weeks of anxiety, insomnia, and paranoid thoughts. She is admitted after a generalized seizure. On the ward she speaks little, makes repetitive chewing and lip-smacking movements ([[orofacial-dyskinesia|orofacial dyskinesias]]), and her heart rate and blood pressure swing widely. She has received no antipsychotic medication.",
    stem: "Which diagnosis best explains the whole picture?",
    options: [
      { id: "a", text: "Anti-NMDA receptor encephalitis (an [[autoimmune-encephalitis|autoimmune encephalitis]])", correct: true, feedback: "Correct." },
      { id: "b", text: "New-onset primary psychotic disorder", tag: "misconception", feedback: "New psychiatric symptoms followed by seizures, dyskinesias and autonomic instability point to brain inflammation, not a primary psychiatric illness." },
      { id: "c", text: "Neuroleptic malignant syndrome", tag: "misconception", feedback: "She has received no dopamine-blocking drug. NMS follows antipsychotic exposure and causes rigidity, fever and a high CK." },
      { id: "d", text: "LGI1 antibody encephalitis", tag: "misconception", feedback: "LGI1 encephalitis usually affects older adults with memory loss, low sodium and brief faciobrachial dystonic seizures, not this sequence in a young woman." },
    ],
    reasoning: {
      stem: "Which feature most strongly argues against a primary psychiatric disorder?",
      options: [
        { id: "r1", text: "Dyskinesias, a seizure, and autonomic instability following the psychiatric symptoms", correct: true },
        { id: "r2", text: "Her age and sex", feedback: "Young women are commonly affected, but demographics do not separate neurological from psychiatric illness." },
        { id: "r3", text: "Anxiety and insomnia", feedback: "These are nonspecific and common in primary psychiatric illness." },
        { id: "r4", text: "Paranoid thoughts", feedback: "Psychosis occurs in both." },
      ],
    },
    rationale:
      "Anti-NMDA receptor encephalitis typically follows a viral-like [[prodrome|prodrome]] with psychiatric symptoms, then seizures, reduced speech and responsiveness, abnormal movements (often orofacial), [[dysautonomia|autonomic instability]] and sometimes central hypoventilation. Young women may have an ovarian [[teratoma|teratoma]]. HSV encephalitis is a key mimic (and can trigger NMDAR encephalitis), so give empiric acyclovir until HSV is excluded. Confirm with CSF NMDAR antibodies by [[cell-based-assay|cell-based assay]].",
    sources: ["graus2016-ae", "dalmau2018-nejm", "titulaer2013-nmdar"],
  }),
  free({
    id: "p-nm-gbs-1",
    skill: "differential",
    modules: ["c-gbs"],
    difficulty: 1,
    presentation: "acute-flaccid-weakness",
    usage: ["placement", "challenge", "review"],
    vignette:
      "Two weeks after a diarrheal illness, a 42-year-old develops tingling in the feet and then weakness that climbs from the legs to the arms over 4 days. Both legs are weak, reflexes are absent throughout, and there is no [[sensory-level|sensory level]] and no bladder involvement.",
    stem: "What is the most likely diagnosis?",
    placeholder: "Diagnosis",
    answer: {
      full: [
        c("gbs", "Guillain-Barre syndrome", [
          "guillain barre",
          "guillian barre",
          "gullain barre",
          "guillain",
          "aidp",
          "acute inflammatory demyelinating",
          "acute inflammatory polyradiculoneuropathy",
          "acute polyradiculoneuropathy",
          "acute inflammatory polyneuropathy",
        ]),
      ],
      overlySpecific: [
        { concept: c("aman", "axonal variant", ["acute motor axonal", "aman", "amsan", "acute motor sensory axonal"]), credit: 0.7, feedback: "Campylobacter infection is linked to axonal variants, but the type cannot be named without nerve conduction studies. The supported answer is Guillain-Barre syndrome." },
      ],
      partial: [
        { concept: c("neuropathy", "acute neuropathy", ["polyneuropathy", "peripheral neuropathy", "acute neuropathy", "polyradiculopathy", "neuropathy"]), credit: 0.5, feedback: "Right level (peripheral nerves and roots). Name the syndrome: acute, ascending, areflexic weakness after an infection is Guillain-Barre syndrome." },
      ],
      wrong: [
        { concept: c("myelitis", "spinal cord lesion", ["transverse myelitis", "myelitis", "spinal cord", "cord compression", "myelopathy"]), tag: "misconception", feedback: "A cord lesion usually gives a sensory level and bladder involvement, and later upper motor neuron signs. Acute cord lesions can be areflexic at first (spinal shock), so always look for a sensory level." },
        { concept: c("mg", "myasthenia gravis", ["myasthenia gravis", "myasthenia"]), tag: "misconception", feedback: "Myasthenia causes fatigable ocular, bulbar and limb weakness with normal reflexes and no sensory symptoms." },
        { concept: c("botulism", "botulism", ["botulism"]), tag: "misconception", feedback: "Botulism is descending, starts with cranial nerves and often the pupils, and has no sensory symptoms." },
        { concept: c("mfs", "Miller Fisher syndrome", ["miller fisher", "fisher syndrome"]), tag: "misconception", feedback: "Miller Fisher syndrome is the GBS variant with ophthalmoplegia, ataxia and areflexia. This patient has limb weakness without eye involvement: classic Guillain-Barre syndrome." },
      ],
    },
    modelAnswer: "Guillain-Barre syndrome (an acute inflammatory polyradiculoneuropathy).",
    rationale:
      "Progressive, fairly symmetric weakness over days with [[areflexia|areflexia]], mild distal sensory symptoms and a preceding infection (often Campylobacter or a respiratory virus) is [[guillain-barre-syndrome|Guillain-Barre syndrome]]. Weakness usually peaks within 4 weeks. Key mimics in [[acute-flaccid-weakness|acute flaccid weakness]] are cord lesions (sensory level, sphincters), myasthenia, botulism and electrolyte disorders. Watch breathing: [[vital-capacity|vital capacity]] should be measured regularly.",
    sources: ["vandoorn2023-gbs", "leonhard2019-gbs10"],
  }),
  multi({
    id: "p-dd-fever-enceph",
    skill: "differential",
    modules: ["c-autoimmune-encephalitis", "c-meningitis", "c-encephalitis-viral"],
    difficulty: 3,
    presentation: "fever-confusion",
    usage: ["placement", "review"],
    vignette:
      "A 67-year-old has 2 days of fever, headache, and confusion, with difficulty finding words. This morning he had a focal seizure with right arm jerking. Two hours later he is still drowsy.",
    stem: "Which diagnoses must be actively considered and tested for now?",
    options: [
      { id: "a", text: "Herpes simplex virus [[encephalitis|encephalitis]]", correct: true },
      { id: "b", text: "Bacterial meningitis or meningoencephalitis", correct: true },
      { id: "c", text: "Ongoing nonconvulsive seizures (nonconvulsive [[status-epilepticus|status epilepticus]])", correct: true },
      { id: "d", text: "Sepsis-related or metabolic [[encephalopathy|encephalopathy]] (glucose, sodium, and other basic tests)", correct: true },
      { id: "e", text: "Alzheimer disease", tag: "misconception", feedback: "A 2-day course with fever is far too fast for a neurodegenerative dementia." },
      { id: "f", text: "Functional neurological disorder", tag: "misconception", feedback: "Fever, a focal seizure and reduced consciousness need an urgent search for an organic cause." },
      { id: "g", text: "Migraine with aura", tag: "misconception", feedback: "Fever, confusion and persisting drowsiness do not fit migraine aura." },
    ],
    rationale:
      "Fever with altered mental status and focal features is [[encephalitis|encephalitis]] or meningoencephalitis until proven otherwise. The treatable causes come first: HSV (empiric acyclovir), bacterial meningitis (cultures and antibiotics), and nonconvulsive seizures (EEG if not waking). Systemic sepsis and metabolic derangements cause [[encephalopathy|encephalopathy]] without brain inflammation and must be checked in parallel. Autoimmune encephalitis enters the differential once infection is being excluded.",
    sources: ["venkatesan2013-iec", "tunkel2008-idsa-enceph"],
  }),
  free({
    id: "p-dd-myopathy",
    skill: "differential",
    modules: ["c-myopathy-mnd", "f-localization"],
    difficulty: 2,
    presentation: "proximal-weakness",
    usage: ["placement", "review"],
    vignette:
      "A 52-year-old has 2 months of difficulty climbing stairs, rising from chairs, and lifting her arms to brush her hair. Weakness is symmetric and proximal. Reflexes and sensation are normal, there is no ptosis or double vision, and strength does not fluctuate. Serum creatine kinase (CK) is markedly raised.",
    stem: "What category of disorder is most likely?",
    placeholder: "Category",
    answer: {
      full: [c("myopathy", "myopathy", ["myopathy", "myopathic", "muscle disease", "muscle disorder", "primary muscle", "myositis", "inflammatory myopathy"])],
      overlySpecific: [
        { concept: c("specific", "a specific myopathy", ["dermatomyositis", "polymyositis", "necrotizing", "antisynthetase", "statin"]), credit: 0.7, feedback: "Possible, and inflammatory myopathy is a leading cause of this picture, but the stem gives no rash, drug history, antibody, MRI or biopsy result. The findings support a myopathy; the specific type needs further tests." },
      ],
      wrong: [
        { concept: c("mg", "myasthenia gravis", ["myasthenia gravis", "myasthenia", "neuromuscular junction"]), tag: "misconception", feedback: "There is no fatigability, ptosis or diplopia, and CK is normal in myasthenia." },
        { concept: c("neuropathy", "neuropathy", ["neuropathy", "guillain barre", "cidp"]), tag: "misconception", feedback: "Neuropathies usually cause distal weakness with sensory loss and reduced reflexes." },
        { concept: c("als", "motor neuron disease", ["motor neuron disease", "amyotrophic", "als"]), tag: "misconception", feedback: "ALS causes asymmetric weakness with wasting, fasciculations and mixed upper and lower motor neuron signs, not symmetric proximal weakness with a markedly high CK." },
      ],
    },
    modelAnswer: "A myopathy (muscle disease): symmetric proximal weakness with a high CK and normal reflexes and sensation.",
    rationale:
      "Symmetric proximal weakness with normal sensation, preserved reflexes, no fatigability and a raised CK localizes to [[myopathy|muscle]]. Over 2 months in an adult, an inflammatory myopathy is a leading cause; statin exposure, hypothyroidism and other causes are also considered. EMG, myositis antibodies, muscle MRI and biopsy define the type. Naming a specific myopathy before those tests is more than the findings support.",
    sources: [],
  }),
  free({
    id: "p-dd-tempo",
    skill: "differential",
    modules: ["f-localization"],
    difficulty: 1,
    presentation: "time-course",
    usage: ["placement", "review"],
    vignette:
      "A 64-year-old was talking normally at dinner when, within seconds, his speech became jumbled and his right arm went limp. The deficit was maximal from the start.",
    stem: "Which category of cause does this [[time-course|time course]] suggest most strongly?",
    placeholder: "Category",
    answer: {
      full: [
        c("vascular", "vascular", [
          "vascular",
          "stroke",
          "cerebrovascular",
          "transient ischemic attack",
          "embolic",
          "embolism",
          "embolus",
          "infarct",
          "intracerebral hemorrhage",
          "brain bleed",
          "ischemia",
        ]),
      ],
      partial: [
        { concept: c("seizure", "seizure", ["seizure", "todd"]), credit: 0.3, feedback: "Seizures are also sudden, but they usually begin with positive symptoms (jerking, tingling) that spread. Sudden, maximal loss of function points to a vascular event; postictal (Todd) paresis is a mimic to exclude." },
      ],
      wrong: [
        { concept: c("tumor", "tumor", ["tumor", "neoplasm", "cancer", "mass", "metastasis"]), tag: "misconception", feedback: "Tumors usually cause deficits that progress over weeks to months (although bleeding into a tumor or a seizure can be sudden)." },
        { concept: c("degenerative", "degenerative", ["degenerative", "neurodegenerative", "dementia"]), tag: "misconception", feedback: "Degenerative disease progresses over months to years." },
        { concept: c("demyelinating", "demyelinating", ["multiple sclerosis", "demyelinating", "demyelination"]), tag: "misconception", feedback: "Demyelinating attacks typically evolve over hours to days." },
        { concept: c("infection", "infection", ["infection", "abscess", "encephalitis", "meningitis"]), tag: "misconception", feedback: "Infections usually evolve over hours to days, often with fever." },
        { concept: c("migraine", "migraine", ["migraine"]), tag: "misconception", feedback: "Migraine aura usually spreads gradually over 5 minutes or more and is often followed by headache." },
      ],
    },
    modelAnswer: "Vascular: a stroke (ischemic or hemorrhagic) or TIA.",
    rationale:
      "Tempo narrows the cause before any test. Seconds to minutes, maximal at onset: vascular (or seizure, syncope). Hours to days: inflammatory, infectious, or demyelinating. Weeks to months: neoplastic or some inflammatory disorders. Months to years: degenerative. A [[hyperacute|hyperacute]] focal deficit like this one is treated as a stroke until imaging says otherwise.",
    sources: [],
  }),
  free({
    id: "p-dd-botulism",
    skill: "differential",
    modules: ["c-nmj"],
    difficulty: 2,
    presentation: "descending-paralysis",
    usage: ["placement", "review"],
    vignette:
      "A 38-year-old develops blurred vision, double vision, drooping eyelids, slurred speech, and trouble swallowing, followed over 2 days by weakness spreading down to the arms and then the legs. The pupils are dilated and react poorly. He is alert and has no sensory loss. Several days earlier he ate home-canned vegetables.",
    stem: "What is the most likely diagnosis?",
    placeholder: "Diagnosis",
    answer: {
      full: [c("botulism", "botulism", ["botulism", "botulinum", "clostridium botulinum"])],
      partial: [
        { concept: c("nmj", "presynaptic NMJ disorder", ["neuromuscular junction", "nmj", "presynaptic"]), credit: 0.5, feedback: "Right level (presynaptic neuromuscular junction). Name the disorder: botulism, with descending paralysis, dilated pupils and a food source." },
      ],
      wrong: [
        { concept: c("mg", "myasthenia gravis", ["myasthenia gravis", "myasthenia", "myasthenic crisis"]), tag: "misconception", feedback: "Myasthenia does not affect the pupils. Dilated, poorly reactive pupils and a descending paralysis after home-canned food point to botulism." },
        { concept: c("gbs", "Guillain-Barre or Miller Fisher", ["guillain barre", "miller fisher", "aidp"]), tag: "misconception", feedback: "GBS usually ascends with sensory symptoms and areflexia. The Miller Fisher variant can cause ophthalmoplegia, but descending weakness, dilated pupils and a food source point to botulism." },
        { concept: c("stroke", "stroke", ["stroke", "brainstem infarct"]), tag: "misconception", feedback: "Symmetric cranial nerve palsies evolving over days and then descending limb weakness do not fit a stroke." },
        { concept: c("lems", "Lambert-Eaton", ["lambert eaton"]), tag: "misconception", feedback: "Lambert-Eaton syndrome evolves over months with proximal leg weakness, not over days with prominent cranial nerve palsies." },
      ],
    },
    modelAnswer: "Botulism (foodborne), a presynaptic neuromuscular junction disorder.",
    rationale:
      "Botulinum toxin blocks acetylcholine release at cholinergic terminals, causing symmetric cranial nerve palsies (ptosis, [[diplopia|diplopia]], [[dysarthria|dysarthria]], [[dysphagia|dysphagia]]) and then descending weakness, with autonomic features such as dilated, poorly reactive pupils, and no sensory loss. It is a public health emergency: contact public health authorities for antitoxin, and monitor breathing closely.",
    sources: [],
  }),
];

// ===========================================================================
// Investigation selection
// ===========================================================================

const INVESTIGATION: AssessmentItem[] = [
  tests({
    id: "p-inv-stroke-1",
    skill: "investigation-selection",
    modules: ["c-acute-ischemic-stroke"],
    difficulty: 2,
    presentation: "acute-aphasia-hemiparesis",
    usage: ["placement", "challenge", "review"],
    vignette: "A 68-year-old developed right-sided weakness and difficulty speaking 50 minutes ago. Blood pressure is 168/92. He takes no anticoagulant.",
    stem: TESTS_STEM,
    options: [
      { id: "glucose", label: "Point-of-care blood glucose", category: "necessary", why: "Hypoglycemia mimics stroke, and glucose is the only blood result required before thrombolysis in most patients." },
      { id: "ncct", label: "Non-contrast CT head", category: "necessary", why: "Excludes hemorrhage, which would contraindicate thrombolysis." },
      { id: "cta", label: "CT angiography of head and neck", category: "necessary", why: "Aphasia with hemiparesis suggests a large vessel occlusion; CTA identifies candidates for thrombectomy. It should not delay thrombolysis." },
      { id: "ctp", label: "CT perfusion", category: "reasonable", why: "Helpful in late or unclear time windows; not required for decisions this early." },
      { id: "coag", label: "Platelet count and coagulation tests", category: "reasonable", why: "Send them, but do not wait for results before thrombolysis unless a bleeding disorder or anticoagulant use is suspected." },
      { id: "ecg", label: "12-lead ECG and troponin", category: "reasonable", why: "Useful (atrial fibrillation, cardiac ischemia) but must not delay treatment." },
      { id: "cxr", label: "Chest X-ray", category: "unnecessary", why: "Not needed before reperfusion treatment unless there is a specific clinical concern." },
      { id: "eeg", label: "EEG", category: "unnecessary", why: "Does not guide reperfusion decisions; consider only if seizure is a serious alternative explanation." },
      { id: "duplex", label: "Carotid duplex ultrasound", category: "unnecessary", why: "Belongs to the later workup; CTA already images the neck vessels." },
      { id: "mri", label: "Wait for a full MRI protocol before any treatment decision", category: "harmful", why: "Delays treatment when CT and CTA answer the urgent questions." },
      { id: "lp", label: "Lumbar puncture", category: "harmful", why: "No role here, and a recent lumbar puncture is a relative contraindication to thrombolysis." },
    ],
    rationale:
      "In the first hour, every test must answer a treatment question. Glucose excludes a mimic, non-contrast CT excludes hemorrhage (enabling [[thrombolysis|thrombolysis]]), and CT angiography finds a [[large-vessel-occlusion|large vessel occlusion]] for [[thrombectomy|thrombectomy]]. Other tests are sent in parallel but must not delay treatment.",
    sources: ["powers2019-ais", "prabhakaran2026-ais", "goyal2016-hermes"],
  }),
  tests({
    id: "p-inv-mening",
    skill: "investigation-selection",
    modules: ["c-meningitis"],
    difficulty: 2,
    presentation: "fever-headache-neck-stiffness",
    usage: ["placement", "review"],
    vignette: "A 22-year-old student has 12 hours of fever, severe headache, and neck stiffness. She is alert (GCS 15), with no focal deficit, no papilledema, no seizure, and no immunocompromise.",
    stem: TESTS_STEM,
    options: [
      { id: "bc", label: "Blood cultures", category: "necessary", why: "Take them before antibiotics, without delaying antibiotics; often positive in bacterial meningitis." },
      { id: "lp", label: "Lumbar puncture: opening pressure, cell count and differential, protein, glucose, Gram stain, and culture", category: "necessary", why: "Defines the CSF pattern and the organism. She needs no CT first." },
      { id: "serglu", label: "Serum glucose at the time of the lumbar puncture", category: "necessary", why: "Needed to calculate the CSF to blood glucose ratio." },
      { id: "pcr", label: "CSF PCR for bacterial and viral pathogens", category: "reasonable", why: "Adds diagnostic yield, especially after antibiotics." },
      { id: "crp", label: "Blood count, CRP or procalcitonin", category: "reasonable", why: "Supportive, not diagnostic." },
      { id: "ct", label: "CT head before lumbar puncture", category: "unnecessary", why: "She has none of the features that predict a dangerous CT (immunocompromise, known CNS disease, new seizure, papilledema, reduced consciousness, focal deficit). Routine CT delays the LP." },
      { id: "eeg", label: "EEG", category: "unnecessary", why: "No seizures or unexplained reduced consciousness." },
      { id: "mrispine", label: "MRI spine", category: "unnecessary", why: "Neck stiffness here reflects meningeal irritation, not a spinal lesion." },
      { id: "hold", label: "Wait for CSF results before starting antibiotics", category: "harmful", why: "Antibiotics should start as soon as possible after blood cultures; delay worsens outcome." },
    ],
    rationale:
      "In suspected bacterial meningitis, take blood cultures, perform the [[lumbar-puncture|lumbar puncture]] promptly, and start antibiotics without delay. CT before LP is needed only when specific features suggest a mass effect; she has none. Paired serum glucose lets you interpret CSF glucose.",
    sources: ["tunkel2004-idsa-bm", "hasbun2001-ct-lp", "vandebeek2016-escmid"],
  }),
  tests({
    id: "p-inv-ae",
    skill: "investigation-selection",
    modules: ["c-autoimmune-encephalitis"],
    difficulty: 3,
    presentation: "subacute-memory-seizures",
    usage: ["placement", "review"],
    vignette:
      "A 61-year-old man has 6 weeks of worsening memory and confusion. His wife describes dozens of daily episodes, each a few seconds long, in which his right arm and the right side of his face briefly tense. Serum sodium is 127 mmol/L. He has no fever.",
    stem: TESTS_STEM,
    options: [
      { id: "mri", label: "MRI brain with and without contrast", category: "necessary", why: "Looks for mesial temporal T2/FLAIR change of limbic encephalitis and for alternative causes." },
      { id: "lp", label: "Lumbar puncture: cells, protein, glucose, oligoclonal bands, and HSV PCR", category: "necessary", why: "Excludes infection and looks for inflammation; CSF can be normal in autoimmune encephalitis." },
      { id: "panel", label: "Autoimmune encephalitis antibody panel on both serum and CSF", category: "necessary", why: "Paired testing increases sensitivity: LGI1 antibodies are detected more reliably in serum, NMDAR antibodies in CSF." },
      { id: "eeg", label: "EEG", category: "necessary", why: "Frequent brief episodes need characterization; EEG can show seizures or temporal abnormalities." },
      { id: "ctcap", label: "CT chest, abdomen and pelvis for an underlying tumor", category: "reasonable", why: "Tumor screening guided by the antibody and syndrome is reasonable once suspicion is high." },
      { id: "everything", label: "Every available antibody test, including research-only assays", category: "unnecessary", why: "Untargeted testing increases false positives; choose a panel matched to the syndrome." },
      { id: "ana", label: "Serum ANA as the main diagnostic test", category: "unnecessary", why: "Nonspecific and does not detect neural antibodies." },
      { id: "biopsy", label: "Brain biopsy now", category: "harmful", why: "Invasive and premature; reserved for unclear cases after noninvasive testing." },
    ],
    rationale:
      "Subacute memory loss, brief faciobrachial dystonic episodes and low sodium suggest LGI1 antibody limbic encephalitis, but the workup is the same structured one for any suspected [[autoimmune-encephalitis|autoimmune encephalitis]]: MRI, CSF (including infection testing), EEG, and phenotype-directed antibody testing on paired serum and [[csf|CSF]] by [[cell-based-assay|cell-based assay]]. Broad untargeted panels raise the chance of misleading [[false-positive|false positives]].",
    sources: ["graus2016-ae", "budhram2020-neural-ab", "irani2011-fbds", "dalmau2018-nejm"],
  }),
  tests({
    id: "p-nm-mg-1",
    skill: "investigation-selection",
    modules: ["c-nmj"],
    difficulty: 2,
    presentation: "fatigable-ptosis-diplopia",
    usage: ["placement", "challenge", "review"],
    vignette:
      "A 34-year-old woman has 2 months of fluctuating ptosis and double vision, and arm weakness that worsens with repeated use. Pupils, reflexes, and sensation are normal. Breathing and swallowing are normal.",
    stem: TESTS_STEM,
    options: [
      { id: "achr", label: "Serum acetylcholine receptor binding antibodies", category: "necessary", why: "Positive in most patients with generalized myasthenia gravis." },
      { id: "rns", label: "Repetitive nerve stimulation (single-fiber EMG if negative)", category: "necessary", why: "Shows a decrement; supports the diagnosis, especially when antibodies are negative." },
      { id: "ctchest", label: "CT or MRI of the chest", category: "necessary", why: "Looks for thymoma, present in a minority of patients, and informs thymectomy decisions." },
      { id: "musk", label: "MuSK antibodies if AChR antibodies are negative", category: "reasonable", why: "Second-line serology for antibody-negative patients." },
      { id: "tft", label: "Thyroid function tests", category: "reasonable", why: "Autoimmune thyroid disease commonly coexists." },
      { id: "fvc", label: "Bedside forced vital capacity", category: "reasonable", why: "A baseline respiratory measure, useful even without symptoms." },
      { id: "ice", label: "Ice pack test on the drooping lid", category: "reasonable", why: "Simple bedside support: cooling improves neuromuscular transmission." },
      { id: "lp", label: "Lumbar puncture", category: "unnecessary", why: "CSF is normal in myasthenia gravis." },
      { id: "biopsy", label: "Muscle biopsy", category: "unnecessary", why: "Not part of the diagnosis of myasthenia gravis." },
      { id: "mri", label: "MRI brain", category: "unnecessary", why: "Reserved for atypical features such as pupil involvement, other brainstem signs, or no fatigability." },
    ],
    rationale:
      "Diagnosis of [[myasthenia-gravis|myasthenia gravis]] rests on the clinical picture plus antibodies ([[acetylcholine-receptor|AChR]], then MuSK) and electrodiagnosis ([[repetitive-nerve-stimulation|repetitive nerve stimulation]] [[decrement|decrement]], single-fiber EMG). Chest imaging for thymoma is part of the initial workup because it changes management.",
    sources: ["narayanaswami2021-mg", "gilhus2016-mg"],
  }),
  mcq({
    id: "p-inv-cord",
    skill: "investigation-selection",
    modules: ["c-spinal-emergencies"],
    difficulty: 1,
    presentation: "back-pain-leg-weakness",
    usage: ["placement", "review"],
    vignette: "A 59-year-old with metastatic breast cancer has worsening thoracic back pain, new leg weakness, and numbness below the nipples.",
    stem: "What is the most appropriate imaging?",
    options: [
      { id: "a", text: "Urgent MRI of the whole spine", correct: true, feedback: "Correct. It shows the level of compression and any other deposits; metastases are often at several levels." },
      { id: "b", text: "Plain X-rays of the thoracic spine", tag: "misconception", feedback: "X-rays can show bone destruction but not the cord or epidural tumor; normal films do not exclude compression." },
      { id: "c", text: "CT head", tag: "misconception", feedback: "A sensory level on the trunk points to the spinal cord, not the brain." },
      { id: "d", text: "Lumbar puncture to look for malignant cells", tag: "unsafe-priority", feedback: "LP does not diagnose compression and can worsen a spinal block. Image first." },
      { id: "e", text: "Outpatient MRI of the thoracic spine within 2 weeks", tag: "unsafe-priority", feedback: "Delay risks permanent paralysis. This is an emergency." },
    ],
    rationale:
      "A [[sensory-level|sensory level]] at the nipples (about T4) with leg weakness in a patient with cancer suggests metastatic spinal cord compression. Urgent MRI of the whole spine shows the level and extent and guides surgery or radiotherapy. Outcome depends on function at the time of treatment, so imaging is same day.",
    sources: [],
  }),
  mcq({
    id: "p-inv-stroke-labs",
    skill: "investigation-selection",
    modules: ["c-acute-ischemic-stroke", "a-test-interpretation"],
    difficulty: 3,
    presentation: "test-utility",
    usage: ["placement", "review"],
    vignette:
      "A 66-year-old with a left MCA syndrome arrives 70 minutes after onset. Glucose is normal and non-contrast CT shows no hemorrhage. He takes no anticoagulant and has no history of bleeding or liver disease. The platelet count and INR are still pending.",
    stem: "What is the best next step?",
    options: [
      { id: "a", text: "Start IV thrombolysis now if there are no other contraindications, without waiting for the platelet count and INR, while CT angiography proceeds", correct: true, feedback: "Correct." },
      { id: "b", text: "Wait for the platelet count and INR before deciding", tag: "unsafe-priority", feedback: "When nothing suggests an abnormality, an unexpected result is rare, and waiting costs brain tissue. Guidelines allow treatment before these return." },
      { id: "c", text: "Obtain MRI to confirm the infarct before treating", tag: "unsafe-priority", feedback: "CT plus the clinical picture is sufficient; MRI confirmation delays treatment." },
      { id: "d", text: "Repeat the CT in 6 hours to see whether an infarct appears", tag: "unsafe-priority", feedback: "Early CT is often normal in ischemic stroke; waiting forfeits the treatment window." },
    ],
    rationale:
      "A test is worth waiting for only if its result could change the decision. In a patient with no anticoagulant use and no suspected bleeding disorder, abnormal platelet or coagulation results are uncommon, so thrombolysis can start before they return; treatment is stopped if a disqualifying result arrives. Glucose and CT are different: their results routinely change the decision.",
    sources: ["powers2019-ais"],
  }),
];

// ===========================================================================
// Interpretation
// ===========================================================================

const INTERPRETATION: AssessmentItem[] = [
  free({
    id: "p-interp-csf-1",
    skill: "interpretation",
    modules: ["c-meningitis"],
    difficulty: 2,
    presentation: "fever-headache-neck-stiffness",
    usage: ["placement", "challenge", "review"],
    schematic: {
      kind: "csf-table",
      rows: [
        { analyte: "Opening pressure", value: "34 cmH2O", ref: "10 to 25 cmH2O", flag: "H" },
        { analyte: "White cells", value: "2,100 /µL", ref: "0 to 5 /µL", flag: "H" },
        { analyte: "Neutrophils", value: "90%", ref: "few or none", flag: "H" },
        { analyte: "Protein", value: "230 mg/dL", ref: "15 to 45 mg/dL", flag: "H" },
        { analyte: "Glucose", value: "18 mg/dL", ref: "40 to 70 mg/dL", flag: "L" },
        { analyte: "CSF to serum glucose ratio", value: "0.15", ref: "about 0.6", flag: "L" },
      ],
    },
    vignette: "A 30-year-old has fever, headache, and neck stiffness. Her CSF results are shown.",
    stem: "What does this CSF pattern most likely indicate?",
    placeholder: "Pattern or diagnosis",
    answer: {
      full: [c("bacterial", "bacterial meningitis", ["bacterial", "pyogenic meningitis", "purulent meningitis", "septic meningitis"])],
      overlySpecific: [
        { concept: c("organism", "a specific organism", ["pneumococcal", "pneumococcus", "streptococcus pneumoniae", "meningococcal", "meningococcus", "neisseria", "listeria", "haemophilus"]), credit: 0.7, feedback: "These are common causes, but cell counts and chemistry cannot identify the organism; that needs Gram stain, culture or PCR. The pattern supports bacterial meningitis." },
      ],
      partial: [
        { concept: c("meningitis", "meningitis", ["meningitis", "cns infection", "meningeal infection"]), credit: 0.5, feedback: "Yes, meningitis. The neutrophil-predominant pleocytosis, very low glucose ratio and high protein point to a bacterial cause, which changes urgent treatment." },
      ],
      wrong: [
        { concept: c("viral", "viral meningitis", ["viral meningitis", "aseptic meningitis", "viral infection", "enterovirus", "viral"]), tag: "misconception", feedback: "Viral meningitis typically shows a lymphocytic pleocytosis, usually tens to a few hundred cells, with normal glucose." },
        { concept: c("tb", "tuberculous or fungal", ["tuberculous", "tuberculosis", "tb meningitis", "fungal", "cryptococcal"]), tag: "misconception", feedback: "Tuberculous and fungal meningitis usually show a lymphocytic pleocytosis with low glucose and a subacute course over weeks." },
        { concept: c("albcyto", "albuminocytologic dissociation", ["albuminocytologic", "guillain barre"]), tag: "misconception", feedback: "Albuminocytologic dissociation means high protein with a normal cell count. Here the cell count is very high." },
        { concept: c("sah", "subarachnoid hemorrhage", ["subarachnoid hemorrhage", "subarachnoid"]), tag: "misconception", feedback: "Subarachnoid hemorrhage gives red cells and xanthochromia, not a neutrophilic pleocytosis with very low glucose." },
      ],
    },
    modelAnswer: "Bacterial meningitis: neutrophilic pleocytosis, high protein, very low CSF glucose ratio and raised opening pressure.",
    rationale:
      "Classic bacterial [[csf|CSF]]: raised [[opening-pressure|opening pressure]], hundreds to thousands of white cells with neutrophil predominance ([[pleocytosis|pleocytosis]]), high protein, and low glucose (CSF to serum ratio usually below 0.4). Viral meningitis gives a lymphocytic pleocytosis with normal glucose. No single value is decisive, and prior antibiotics blur the pattern, so the [[gram-stain|Gram stain]], culture and PCR matter.",
    sources: ["tunkel2004-idsa-bm", "vandebeek2016-escmid"],
  }),
  free({
    id: "p-interp-csf-gbs",
    skill: "interpretation",
    modules: ["c-gbs"],
    difficulty: 1,
    presentation: "ascending-weakness",
    usage: ["placement", "review"],
    vignette:
      "Three weeks into an illness with ascending weakness and absent reflexes, a 50-year-old has a lumbar puncture: white cells 2 /µL (normal 0 to 5), protein 190 mg/dL (normal 15 to 45), glucose normal.",
    stem: "What is the name of this CSF pattern?",
    placeholder: "Name of the pattern",
    answer: {
      full: [
        c("albcyto", "albuminocytologic dissociation", [
          "albuminocytologic",
          "albumino cytologic",
          "cytoalbuminologic",
          "cytoalbuminic",
          "albuminocytological",
          "protein cell dissociation",
          "high protein + normal cell",
          "raised protein + normal cell",
          "elevated protein + normal cell",
          "increased protein + normal cell",
          "high protein + normal white",
          "raised protein + normal white",
          "elevated protein + normal white",
          "high protein + without pleocytosis",
          "elevated protein + without pleocytosis",
          "high protein + no pleocytosis",
          "elevated protein + no pleocytosis",
          "raised protein + no pleocytosis",
          "high protein + low cell",
          "high protein + normal wbc",
          "elevated protein + normal wbc",
        ]),
      ],
      partial: [
        { concept: c("gbs", "Guillain-Barre syndrome", ["guillain barre", "aidp", "guillain"]), credit: 0.6, feedback: "That is the likely cause. The pattern itself is called albuminocytologic dissociation: high protein with a normal cell count." },
        { concept: c("protein", "high protein", ["high protein", "elevated protein", "raised protein", "increased protein"]), credit: 0.6, feedback: "Correct, and the cell count is normal. That combination is called albuminocytologic dissociation." },
      ],
      wrong: [
        { concept: c("infection", "infection", ["bacterial", "viral meningitis", "meningitis"]), tag: "misconception", feedback: "Infection raises the cell count. Here cells are normal while protein is high." },
        { concept: c("ms", "multiple sclerosis", ["multiple sclerosis", "oligoclonal"]), tag: "misconception", feedback: "MS typically shows oligoclonal bands with normal or mildly raised protein and cells, not a protein of 190 mg/dL with normal cells." },
      ],
    },
    modelAnswer: "Albuminocytologic dissociation: high protein with a normal cell count.",
    rationale:
      "[[albuminocytologic-dissociation|Albuminocytologic dissociation]] (raised CSF protein with a normal white cell count) supports Guillain-Barre syndrome, reflecting inflammation of the nerve roots. It is often absent in the first week. A clear pleocytosis (for example more than 50 cells/µL) should prompt a search for alternatives such as infection, malignancy or HIV.",
    sources: ["vandoorn2023-gbs", "leonhard2019-gbs10"],
  }),
  mcq({
    id: "p-interp-ncs-1",
    skill: "interpretation",
    modules: ["c-gbs"],
    difficulty: 2,
    presentation: "acute-flaccid-weakness",
    family: "ncs-pattern",
    usage: ["placement", "challenge", "review"],
    schematic: { kind: "ncs", pattern: "demyelinating" },
    vignette: "A 45-year-old has 10 days of progressive weakness and absent reflexes. The schematic summarizes motor nerve conduction findings.",
    stem: "Which pattern does the schematic show?",
    options: [
      { id: "a", text: "Demyelinating: prolonged distal latencies and markedly slowed conduction velocities, with relatively preserved amplitudes", correct: true, feedback: "Correct." },
      { id: "b", text: "Axonal: reduced amplitudes with normal or near-normal conduction velocities", tag: "misconception", feedback: "Axonal loss mainly lowers the [[cmap|CMAP]] amplitude; velocities stay near normal. Marked slowing points to demyelination." },
      { id: "c", text: "Postsynaptic neuromuscular junction disorder", tag: "misconception", feedback: "Neuromuscular junction disorders are shown by repetitive stimulation; nerve conduction velocity is normal." },
      { id: "d", text: "Normal study", tag: "misconception", feedback: "The latencies and velocities are clearly abnormal." },
    ],
    rationale:
      "[[demyelination|Demyelinating]] neuropathy slows conduction: prolonged distal latencies, slow velocities, prolonged or absent F waves, [[conduction-block|conduction block]] and [[temporal-dispersion|temporal dispersion]]. [[axonal|Axonal]] neuropathy reduces amplitudes with near-normal speed. In Guillain-Barre syndrome this distinguishes AIDP from axonal variants, although studies can be normal or equivocal in the first week and are often repeated.",
    sources: ["vandoorn2023-gbs", "leonhard2019-gbs10"],
  }),
  free({
    id: "p-interp-ncs-block",
    skill: "interpretation",
    modules: ["c-gbs"],
    difficulty: 3,
    presentation: "asymmetric-hand-weakness",
    family: "ncs-pattern",
    usage: ["placement", "review"],
    schematic: { kind: "ncs", pattern: "conduction-block" },
    vignette:
      "A 40-year-old has months of slowly worsening weakness of one hand without much wasting or sensory loss. The schematic shows compound muscle action potentials recorded from the same muscle after stimulating one nerve at a distal and a proximal site.",
    stem: "What is the abnormality, and what does it indicate about the nerve?",
    placeholder: "Finding and meaning",
    answer: {
      full: [c("block", "conduction block", ["conduction block", "focal block", "block conduction", "motor block"])],
      partial: [
        { concept: c("demyel", "demyelination", ["demyelination", "demyelinating", "myelin"]), credit: 0.6, feedback: "Yes, it reflects focal demyelination. Name the finding: conduction block, a large drop in CMAP amplitude between distal and proximal stimulation without much change in duration." },
        { concept: c("dispersion", "temporal dispersion", ["temporal dispersion", "dispersion"]), credit: 0.5, feedback: "Dispersion also lowers the proximal amplitude, but it markedly prolongs the response. A drop in amplitude and area with little change in duration is conduction block." },
      ],
      wrong: [
        { concept: c("axonal", "axonal loss", ["axonal loss", "axonal neuropathy", "axonal degeneration", "axonal"]), tag: "misconception", feedback: "Axonal loss lowers the amplitude equally at every stimulation site. A drop only between sites means conduction block." },
        { concept: c("nmj", "neuromuscular junction", ["neuromuscular junction", "myopathy", "decrement"]), tag: "misconception", feedback: "This comparison is between two stimulation sites on the nerve, so the problem lies in the nerve segment between them." },
      ],
    },
    modelAnswer: "Conduction block: the CMAP amplitude falls sharply between the distal and proximal sites, indicating focal demyelination between them.",
    rationale:
      "If stimulating distally gives a normal [[cmap|CMAP]] but stimulating proximally gives a much smaller one of similar duration, impulses are failing in the segment between the two sites: [[conduction-block|conduction block]], a hallmark of acquired [[demyelination|demyelination]]. Axonal loss lowers the response at every site. The distal response being normal also means the axons beyond the block are intact, which is why weakness from block can recover quickly with treatment.",
    sources: ["vandenbergh2021-cidp"],
  }),
  free({
    id: "p-interp-rns",
    skill: "interpretation",
    modules: ["c-nmj"],
    difficulty: 1,
    presentation: "fatigable-ptosis",
    family: "rns-pattern",
    usage: ["placement", "review"],
    schematic: { kind: "rns", pattern: "decrement" },
    vignette: "A 35-year-old with fluctuating ptosis has repetitive nerve stimulation at 3 Hz. The schematic shows the compound muscle action potential across the train of stimuli.",
    stem: "What does this pattern indicate?",
    placeholder: "Site or disorder",
    answer: {
      full: [c("postsynaptic", "postsynaptic NMJ disorder (myasthenia gravis)", ["myasthenia gravis", "myasthenia", "postsynaptic", "post synaptic"])],
      partial: [
        { concept: c("nmj", "NMJ disorder or decrement", ["neuromuscular junction", "nmj", "decrement", "decremental"]), credit: 0.6, feedback: "Right: a decrement over the first four to five stimuli at low rates indicates a neuromuscular junction disorder. With fluctuating ptosis and a normal first response, the typical cause is postsynaptic: myasthenia gravis." },
      ],
      wrong: [
        { concept: c("presyn", "presynaptic disorder", ["lambert eaton", "presynaptic", "botulism"]), tag: "misconception", feedback: "Presynaptic disorders show a small first response that increases markedly after brief exercise. A decrement from a normal first response with fluctuating ptosis fits myasthenia gravis." },
        { concept: c("neuropathy", "neuropathy", ["neuropathy", "demyelination", "demyelinating", "axonal"]), tag: "misconception", feedback: "Repetitive stimulation tests the neuromuscular junction, not nerve conduction." },
        { concept: c("myopathy", "myopathy", ["myopathy", "muscle disease"]), tag: "misconception", feedback: "A progressive decrement with repeated stimulation reflects failing neuromuscular transmission, not muscle disease." },
      ],
    },
    modelAnswer: "A decrement, indicating a postsynaptic neuromuscular junction disorder such as myasthenia gravis.",
    rationale:
      "At 2 to 3 Hz, acetylcholine release normally declines over the first few stimuli without effect. When receptors are reduced, more fibers fail as release falls, so the [[cmap|CMAP]] shrinks over the first four to five responses: a [[decrement|decrement]] (often defined as more than 10 percent). It supports [[myasthenia-gravis|myasthenia gravis]], though sensitivity is lower in purely ocular disease.",
    sources: ["gilhus2016-mg"],
  }),
  free({
    id: "p-interp-rns-inc",
    skill: "interpretation",
    modules: ["c-nmj"],
    difficulty: 3,
    presentation: "proximal-weakness-dry-mouth",
    family: "rns-pattern",
    usage: ["placement", "review"],
    vignette:
      "A 66-year-old has months of proximal leg weakness, dry mouth, and absent reflexes. On nerve conduction testing the resting compound muscle action potential (CMAP) amplitude is low. After 10 seconds of maximal voluntary contraction, it rises to almost three times baseline.",
    stem: "What does this result indicate?",
    placeholder: "Site or disorder",
    answer: {
      full: [c("presynaptic", "presynaptic NMJ disorder (LEMS)", ["lambert eaton", "presynaptic", "pre synaptic"])],
      partial: [
        { concept: c("botulism", "botulism", ["botulism"]), credit: 0.6, feedback: "Botulism is also presynaptic and can show an increment, but the months-long course with dry mouth and areflexia fits Lambert-Eaton myasthenic syndrome." },
        { concept: c("nmj", "NMJ disorder or facilitation", ["neuromuscular junction", "nmj", "facilitation", "increment", "incremental"]), credit: 0.6, feedback: "Yes, post-exercise facilitation (an increment) indicates a neuromuscular junction disorder, specifically a presynaptic one such as Lambert-Eaton myasthenic syndrome." },
      ],
      wrong: [
        { concept: c("mg", "myasthenia gravis", ["myasthenia gravis", "postsynaptic", "post synaptic"]), tag: "misconception", feedback: "In myasthenia gravis the resting CMAP is usually normal and there is a decrement, with little increment after exercise." },
        { concept: c("myopathy", "myopathy", ["myopathy", "muscle disease"]), tag: "misconception", feedback: "A large rise in amplitude after brief exercise reflects improved acetylcholine release, not muscle disease." },
        { concept: c("neuropathy", "neuropathy", ["axonal", "neuropathy", "demyelinating"]), tag: "misconception", feedback: "Axonal loss lowers the CMAP, but it does not rise after brief exercise. The increment points to the presynaptic terminal." },
      ],
    },
    modelAnswer: "Post-exercise facilitation from a presynaptic neuromuscular junction disorder: Lambert-Eaton myasthenic syndrome.",
    rationale:
      "A low resting [[cmap|CMAP]] that rises markedly after brief maximal exercise (or with high-rate stimulation) is [[facilitation|facilitation]]: calcium accumulates in the nerve terminal and temporarily restores acetylcholine release. An increment of more than 100 percent strongly suggests [[lambert-eaton-syndrome|Lambert-Eaton myasthenic syndrome]]; the next steps are voltage-gated calcium channel antibodies and a search for small cell lung cancer.",
    sources: ["titulaer2011-lems"],
  }),
  mcq({
    id: "p-interp-eeg-1",
    skill: "interpretation",
    modules: ["c-status-epilepticus"],
    difficulty: 2,
    presentation: "persistent-unresponsiveness",
    usage: ["placement", "challenge", "review"],
    schematic: { kind: "eeg", pattern: "seizure-evolution" },
    vignette: "A 58-year-old had a convulsive seizure 50 minutes ago. The convulsions stopped after a benzodiazepine, but she remains unresponsive. The schematic shows her EEG.",
    stem: "What does the schematic show, and what does it mean?",
    options: [
      { id: "a", text: "Rhythmic discharges that evolve in frequency, amplitude, and location: an electrographic seizure, so seizure activity continues without visible convulsions", correct: true, feedback: "Correct. Treat this as ongoing (nonconvulsive) status epilepticus." },
      { id: "b", text: "Diffuse slowing expected after a seizure; no treatment needed", tag: "misconception", feedback: "Postictal slowing does not evolve. Evolution in frequency, amplitude and field is the hallmark of a seizure." },
      { id: "c", text: "Muscle and movement artifact", tag: "misconception", feedback: "Artifact does not show this organized evolution, and she is not moving." },
      { id: "d", text: "Generalized 3 Hz spike-and-wave typical of childhood absence epilepsy", tag: "terminology", feedback: "That is a specific, monomorphic generalized pattern. The schematic shows a focal rhythm that evolves." },
    ],
    rationale:
      "Failure to wake as expected after convulsive [[status-epilepticus|status epilepticus]] should prompt EEG, because seizures can continue without visible movement. An [[ictal|ictal]] pattern is defined by evolution: rhythmic activity that changes in frequency, amplitude or spatial field and then stops. [[postictal|Postictal]] slowing does not evolve. Ongoing electrographic seizures need escalation of treatment.",
    sources: [],
  }),
  mcq({
    id: "p-interp-edb",
    skill: "interpretation",
    modules: ["c-autoimmune-encephalitis"],
    difficulty: 3,
    presentation: "prolonged-encephalopathy-dyskinesia",
    usage: ["placement", "review"],
    schematic: { kind: "eeg", pattern: "edb" },
    vignette:
      "A 22-year-old woman has been in intensive care for 3 weeks with reduced responsiveness, orofacial dyskinesias, and fluctuating blood pressure. The schematic shows her prolonged EEG: continuous rhythmic delta activity with bursts of fast (beta) activity riding on each delta wave.",
    stem: "How should this EEG pattern influence your thinking?",
    options: [
      { id: "a", text: "It is [[extreme-delta-brush|extreme delta brush]], seen in a subset of patients with anti-NMDA receptor encephalitis; it supports that diagnosis but does not replace CSF antibody testing", correct: true, feedback: "Correct." },
      { id: "b", text: "It shows triphasic waves, pointing to hepatic or other metabolic encephalopathy", tag: "terminology", feedback: "Triphasic waves are blunt three-phase complexes, not delta waves with superimposed fast activity." },
      { id: "c", text: "It shows periodic sharp wave complexes, pointing to prion disease", tag: "terminology", feedback: "Periodic sharp wave complexes are brief periodic discharges on a slow background, not continuous delta with superimposed beta." },
      { id: "d", text: "It proves anti-NMDA receptor encephalitis, so antibody testing is unnecessary", tag: "misconception", feedback: "No EEG pattern is diagnostic on its own; the diagnosis rests on the syndrome plus CSF antibodies." },
    ],
    rationale:
      "Rhythmic delta with superimposed beta bursts, named [[extreme-delta-brush|extreme delta brush]] for its resemblance to the delta brush of premature infants, occurs in a minority of adults with anti-NMDA receptor encephalitis, often with prolonged illness. It raises the probability of that diagnosis in the right syndrome, but confirmation requires CSF NMDAR antibodies by [[cell-based-assay|cell-based assay]].",
    sources: [],
  }),
  mcq({
    id: "p-interp-ab-1",
    skill: "interpretation",
    modules: ["c-autoimmune-encephalitis", "a-test-interpretation"],
    difficulty: 3,
    presentation: "slowly-progressive-memory-loss",
    usage: ["placement", "challenge", "review"],
    vignette:
      "A 66-year-old has 2 years of slowly progressive forgetfulness with no seizures, psychiatric change, or movement disorder. MRI shows mild generalized atrophy; CSF cells and protein are normal. A broad serum autoimmune panel reports NMDA receptor antibody positive at a low [[titer|titer]] by [[cell-based-assay|cell-based assay]]. Paired CSF testing is negative for NMDA receptor antibody.",
    stem: "What is the best interpretation?",
    options: [
      { id: "a", text: "The result is probably not clinically meaningful: a low-titer, serum-only result with negative CSF in a syndrome that does not fit anti-NMDA receptor encephalitis", correct: true, feedback: "Correct." },
      { id: "b", text: "Anti-NMDA receptor encephalitis is confirmed; start immunotherapy", tag: "misconception", feedback: "Diagnosis requires a compatible syndrome and, for NMDAR, antibodies in CSF. Low-titer, serum-only results are a known source of false positives." },
      { id: "c", text: "The CSF result is the false negative, because serum is more sensitive for NMDA receptor antibodies", tag: "misconception", feedback: "For NMDAR antibodies, CSF testing is more sensitive and specific than serum." },
      { id: "d", text: "Proceed directly to pelvic surgery to look for an ovarian teratoma", tag: "unsafe-priority", feedback: "Invasive treatment based on a doubtful result in an incompatible syndrome risks harm without benefit." },
    ],
    reasoning: {
      stem: "Which feature most undermines the positive serum result?",
      options: [
        { id: "r1", text: "Negative CSF antibody together with a slow course that does not match the syndrome", correct: true },
        { id: "r2", text: "Her age", feedback: "NMDAR encephalitis is less common in older adults but occurs; age alone does not refute the result." },
        { id: "r3", text: "The test used a cell-based assay", feedback: "Cell-based assays are the standard method. The problems are low titer, serum-only positivity and syndrome mismatch." },
        { id: "r4", text: "The MRI shows atrophy", feedback: "MRI is normal or nonspecific in most NMDAR encephalitis, so atrophy neither confirms nor refutes it." },
      ],
    },
    rationale:
      "An antibody result means most when the [[pretest-probability|pretest probability]] is high. Here the syndrome (slow memory decline over years) does not match, CSF is negative, and the serum [[titer|titer]] is low: a likely [[false-positive|false positive]], made more likely by broad untargeted panels. For NMDAR, CSF testing is the more reliable specimen. Look for other causes of cognitive decline instead.",
    sources: ["graus2016-ae", "gresaarribas2014-nmdar-titres", "budhram2020-neural-ab", "dalmau2018-nejm"],
  }),
  multi({
    id: "p-interp-stroke-ct",
    skill: "interpretation",
    modules: ["c-acute-ischemic-stroke"],
    difficulty: 1,
    presentation: "normal-early-ct",
    usage: ["placement", "review"],
    vignette: "A 70-year-old has had left face and arm weakness and left-sided neglect for 60 minutes. Non-contrast CT of the head is normal.",
    stem: "Select every correct statement about this normal CT.",
    options: [
      { id: "a", text: "It makes intracerebral hemorrhage very unlikely", correct: true },
      { id: "b", text: "Early ischemic changes are often absent on CT in the first hours", correct: true },
      { id: "c", text: "He may still be a candidate for [[thrombolysis|thrombolysis]]", correct: true },
      { id: "d", text: "It excludes a stroke, so look for a mimic and withhold treatment", tag: "unsafe-priority", feedback: "Early CT is often normal in ischemic stroke. Withholding treatment on this basis loses the treatment window." },
      { id: "e", text: "An MRI must confirm the infarct before any treatment", tag: "misconception", feedback: "MRI is not required; CT excluding hemorrhage plus the clinical picture is enough to decide on thrombolysis." },
      { id: "f", text: "A normal CT rules out a large vessel occlusion", tag: "misconception", feedback: "Vessel occlusion needs CT angiography. A dense artery sign is sometimes visible, but its absence excludes nothing." },
    ],
    rationale:
      "In [[hyperacute|hyperacute]] ischemic stroke, non-contrast CT is often normal: its job is to exclude hemorrhage and large established infarction. A normal CT is therefore expected and keeps reperfusion options open. CT angiography is needed to look for a [[large-vessel-occlusion|large vessel occlusion]].",
    sources: ["powers2019-ais", "prabhakaran2026-ais"],
  }),
];

// ===========================================================================
// Emergency
// ===========================================================================

const EMERGENCY: AssessmentItem[] = [
  order({
    id: "p-emerg-stroke-1",
    skill: "emergency",
    modules: ["c-acute-ischemic-stroke"],
    difficulty: 1,
    presentation: "acute-aphasia-hemiparesis",
    usage: ["placement", "challenge", "review"],
    vignette: "A 74-year-old arrives in the emergency department 45 minutes after sudden right-sided weakness and aphasia.",
    stem: ORDER_STEM,
    steps: [
      { id: "abc", text: "Check airway, breathing, circulation and fingerstick glucose" },
      { id: "activate", text: "Activate the stroke team and establish the last known well time" },
      { id: "ct", text: "Non-contrast CT head" },
      { id: "lysis", text: "Start IV thrombolysis if there is no hemorrhage and no contraindication" },
      { id: "cta", text: "CT angiography to look for a large vessel occlusion" },
      { id: "evt", text: "Endovascular thrombectomy for a confirmed large vessel occlusion" },
      { id: "unit", text: "Admit to a stroke unit and screen swallowing before anything by mouth" },
    ],
    order: [["abc", "activate"], ["ct"], ["lysis", "cta"], ["evt"], ["unit"]],
    rationale:
      "Stabilize, check glucose (hypoglycemia mimics stroke), and activate the stroke pathway at once. Non-contrast CT excludes hemorrhage; [[thrombolysis|thrombolysis]] should start as soon as it is safe and CT angiography is done right alongside, without delaying the bolus. A [[large-vessel-occlusion|large vessel occlusion]] goes to [[thrombectomy|thrombectomy]]. Afterwards, stroke unit care with a swallow screen before oral intake reduces aspiration.",
    sources: ["powers2019-ais", "prabhakaran2026-ais", "goyal2016-hermes"],
  }),
  order({
    id: "p-emerg-se-1",
    skill: "emergency",
    modules: ["c-status-epilepticus"],
    difficulty: 2,
    presentation: "prolonged-convulsion",
    usage: ["placement", "challenge", "review"],
    vignette: "A 40-year-old has been having a generalized convulsion for 6 minutes when you arrive. Paramedics have placed an IV line.",
    stem: ORDER_STEM,
    steps: [
      { id: "airway", text: "Protect the airway, give oxygen, and attach monitoring" },
      { id: "glucose", text: "Check fingerstick glucose" },
      { id: "benzo", text: "Give an IV benzodiazepine" },
      { id: "repeat", text: "If seizures continue 5 minutes after the first dose, repeat the benzodiazepine once" },
      { id: "second", text: "If seizures continue, give a second-line IV antiseizure medication (levetiracetam, fosphenytoin, or valproate)" },
      { id: "refractory", text: "If seizures still continue, intubate and start a continuous anesthetic infusion with continuous EEG monitoring" },
    ],
    order: [["airway", "glucose", "benzo"], ["repeat"], ["second"], ["refractory"]],
    rationale:
      "Convulsive [[status-epilepticus|status epilepticus]] is treated in time-based stages. At 6 minutes, stabilization, a glucose check and the first benzodiazepine happen together. One repeat benzodiazepine dose is allowed. If seizures continue, give a second-line agent without delay (levetiracetam, fosphenytoin and valproate performed similarly in ESETT). Seizures persisting after that are [[refractory|refractory]] and need anesthetic infusion with EEG monitoring. Look for the cause throughout (hypoglycemia, infection, drugs, structural lesion).",
    sources: ["glauser2016-se", "kapur2019-esett"],
  }),
  order({
    id: "p-emerg-mening-1",
    skill: "emergency",
    modules: ["c-meningitis"],
    difficulty: 2,
    presentation: "fever-drowsiness",
    usage: ["placement", "challenge", "review"],
    vignette: "A 45-year-old is brought in with fever, neck stiffness, and confusion. GCS is 11 (eyes 3, verbal 3, motor 5).",
    stem: ORDER_STEM,
    steps: [
      { id: "abc", text: "Assess airway, breathing and circulation, and place IV access" },
      { id: "bc", text: "Draw blood cultures" },
      { id: "abx", text: "Give dexamethasone and empiric IV antibiotics" },
      { id: "ct", text: "CT head (indicated because consciousness is reduced)" },
      { id: "lp", text: "Lumbar puncture if CT shows no contraindication" },
      { id: "tailor", text: "Adjust antibiotics using Gram stain, culture, and sensitivities" },
    ],
    order: [["abc", "bc"], ["abx"], ["ct"], ["lp"], ["tailor"]],
    rationale:
      "When CT is needed before [[lumbar-puncture|lumbar puncture]] (here because of reduced consciousness), antibiotics must not wait for it. Take blood cultures, give dexamethasone with or just before the first antibiotic dose, then image, then perform the LP if safe. Antibiotics given shortly before the LP reduce culture yield but not the value of cell counts, chemistry and PCR.",
    sources: ["tunkel2004-idsa-bm", "vandebeek2016-escmid", "degans2002-dexa", "hasbun2001-ct-lp"],
  }),
  free({
    id: "p-emerg-cn3",
    skill: "emergency",
    modules: ["f-ocular-motor"],
    difficulty: 2,
    presentation: "painful-third-nerve-palsy",
    usage: ["placement", "review"],
    vignette:
      "A 52-year-old has had a severe headache since yesterday and now a drooping left eyelid. The left eye rests down and out, and the left pupil is dilated and sluggish.",
    stem: "What is the most urgent investigation, and what are you looking for?",
    placeholder: "Test and target",
    answer: {
      full: [
        c("vascular-imaging", "urgent CT or MR angiography for an aneurysm", [
          "angiography",
          "angiogram",
          "cta",
          "mra",
          "dsa",
          "digital subtraction",
          "vascular imaging",
          "vessel imaging",
        ]),
      ],
      partial: [
        { concept: c("aneurysm", "aneurysm without a test", ["aneurysm", "posterior communicating", "pcom"]), credit: 0.6, feedback: "Right concern. Name the test: urgent CT angiography (or MR angiography) to find a posterior communicating artery aneurysm." },
        { concept: c("ct", "non-contrast CT", ["ct head", "ct brain", "ct scan", "non contrast ct", "noncontrast ct", "ct"]), credit: 0.5, feedback: "Non-contrast CT looks for subarachnoid blood and is often done first, but it can miss an unruptured aneurysm. Vascular imaging (CTA or MRA) is needed urgently." },
        { concept: c("mri", "MRI alone", ["mri"]), credit: 0.4, feedback: "MRI with MR angiography is acceptable; MRI without angiography can miss the aneurysm." },
        { concept: c("lp", "lumbar puncture", ["lumbar puncture"]), credit: 0.3, feedback: "LP is used when CT is negative but subarachnoid hemorrhage is still suspected. First image the vessels." },
      ],
      wrong: [
        { concept: c("observe", "observation", ["observe", "watch and wait", "outpatient", "reassure"]), tag: "unsafe-priority", feedback: "A painful, pupil-involving third nerve palsy may be an expanding aneurysm about to rupture. It needs same-day vascular imaging." },
        { concept: c("diabetes", "diabetic workup", ["hba1c", "diabetes", "diabetic", "blood sugar"]), tag: "misconception", feedback: "Microvascular palsies usually spare the pupil. A dilated pupil means compression until proven otherwise." },
        { concept: c("mg", "myasthenia testing", ["myasthenia", "edrophonium", "acetylcholine receptor"]), tag: "misconception", feedback: "Myasthenia never involves the pupil." },
      ],
    },
    modelAnswer: "Urgent CT angiography (or MR angiography) to look for a posterior communicating artery aneurysm compressing the third nerve.",
    rationale:
      "Headache with a pupil-involving [[oculomotor-nerve|third nerve]] palsy suggests an expanding posterior communicating artery aneurysm, which can rupture and cause subarachnoid hemorrhage. The pupil fibers lie on the surface of the nerve and are compressed early ([[mydriasis|mydriasis]]). CT angiography (often with non-contrast CT) or MR angiography is done the same day; catheter angiography is used if noninvasive imaging is unrevealing and suspicion remains.",
    sources: [],
  }),
  mcq({
    id: "p-emerg-crisis",
    skill: "emergency",
    modules: ["c-nmj"],
    difficulty: 2,
    presentation: "bulbar-weakness-dyspnea",
    usage: ["placement", "review"],
    vignette:
      "A 45-year-old with myasthenia gravis has 3 days of worsening swallowing, a weak cough, and nasal speech. She has to pause for breath when counting aloud. Oxygen saturation is 97% on room air.",
    stem: "What is the most important next step in assessing her breathing?",
    options: [
      { id: "a", text: "Measure forced vital capacity and maximal inspiratory pressure now, and repeat them regularly in a monitored setting", correct: true, feedback: "Correct." },
      { id: "b", text: "Reassure her: normal oxygen saturation shows breathing is adequate", tag: "unsafe-priority", feedback: "Saturation falls late in neuromuscular respiratory failure, often just before collapse." },
      { id: "c", text: "Check an arterial blood gas and discharge her if it is normal", tag: "unsafe-priority", feedback: "Blood gases often stay normal until late in neuromuscular weakness." },
      { id: "d", text: "Increase her acetylcholinesterase inhibitor and send her home", tag: "unsafe-priority", feedback: "Worsening bulbar and respiratory weakness needs admission and monitoring, not outpatient adjustment." },
    ],
    rationale:
      "Bulbar weakness, a weak cough and breathlessness on counting signal impending [[myasthenic-crisis|myasthenic crisis]]. In [[ventilatory-failure|neuromuscular ventilatory failure]], oxygen saturation and blood gases stay normal until late, so serial [[vital-capacity|forced vital capacity]] and maximal inspiratory pressure, plus assessment of swallowing and secretions, guide the timing of ICU care and intubation. Treatment includes IVIG or plasma exchange and removing triggers.",
    sources: ["narayanaswami2021-mg", "gilhus2016-mg"],
  }),
  multi({
    id: "p-emerg-gbs-vc",
    skill: "emergency",
    modules: ["c-gbs"],
    difficulty: 3,
    presentation: "progressive-flaccid-weakness",
    usage: ["placement", "review"],
    vignette: "A 38-year-old with Guillain-Barre syndrome diagnosed yesterday is on a general ward. Weakness has progressed over the last 6 hours.",
    stem: "Which findings indicate a need for intensive care monitoring or consideration of intubation?",
    options: [
      { id: "a", text: "[[vital-capacity|Vital capacity]] below 20 mL/kg", correct: true },
      { id: "b", text: "New difficulty swallowing and a weak cough", correct: true },
      { id: "c", text: "Inability to lift the head from the pillow (weak neck flexion)", correct: true },
      { id: "d", text: "Wide swings in heart rate and blood pressure", correct: true },
      { id: "e", text: "Oxygen saturation of 98% on room air, which rules out respiratory weakness", tag: "unsafe-priority", feedback: "Saturation is preserved until late in neuromuscular respiratory failure." },
      { id: "f", text: "Severe back and leg pain", tag: "misconception", feedback: "Pain is common in GBS and needs treatment, but by itself it does not indicate a need for intensive care." },
      { id: "g", text: "Tingling spreading to the hands", tag: "misconception", feedback: "Sensory spread alone does not predict respiratory failure; watch breathing, bulbar function and the pace of weakness." },
    ],
    rationale:
      "In [[guillain-barre-syndrome|Guillain-Barre syndrome]], about a fifth to a quarter of patients need ventilation. Warning signs include falling [[vital-capacity|vital capacity]] (below about 20 mL/kg), weak inspiratory or expiratory pressures, [[bulbar|bulbar]] weakness, weak neck flexion, rapid progression, and [[dysautonomia|dysautonomia]] (arrhythmias, blood pressure swings). Measure vital capacity regularly; do not rely on oxygen saturation.",
    sources: ["vandoorn2023-gbs", "leonhard2019-gbs10"],
  }),
  free({
    id: "p-emerg-hsv",
    skill: "emergency",
    modules: ["c-autoimmune-encephalitis", "c-encephalitis-viral"],
    difficulty: 3,
    presentation: "fever-confusion",
    usage: ["placement", "review"],
    vignette:
      "A 58-year-old has 3 days of fever, confusion, and odd behavior, then a focal seizure. MRI shows right temporal lobe swelling. CSF has 85 white cells/µL (mostly lymphocytes), mildly raised protein, and normal glucose. HSV PCR is pending.",
    stem: "What treatment should start now?",
    placeholder: "Treatment",
    answer: {
      full: [c("acyclovir", "IV acyclovir", ["acyclovir", "aciclovir", "acyclovir intravenous"])],
      partial: [
        { concept: c("valacyclovir", "oral valacyclovir", ["valacyclovir", "valaciclovir"]), credit: 0.3, feedback: "Oral valacyclovir is not adequate initial therapy for suspected HSV encephalitis. Give IV acyclovir." },
        { concept: c("antiviral", "an antiviral", ["antiviral", "anti viral"]), credit: 0.6, feedback: "Right class. Name it: IV acyclovir, started now and continued until HSV encephalitis is excluded." },
      ],
      wrong: [
        { concept: c("immuno-first", "immunotherapy first", ["steroids only", "steroids alone", "steroid alone", "immunotherapy first", "ivig first", "plasma exchange first"]), tag: "unsafe-priority", feedback: "Immunotherapy without antiviral cover could worsen untreated HSV encephalitis. Acyclovir comes first." },
        { concept: c("antibiotics-only", "antibiotics only", ["antibiotics only", "antibiotic only"]), tag: "unsafe-priority", feedback: "Antibiotics do not treat HSV. This picture needs IV acyclovir now." },
      ],
    },
    modelAnswer: "Start empiric IV acyclovir immediately, before the HSV PCR result returns.",
    rationale:
      "Fever, behavioral change, seizures, temporal lobe involvement on MRI and a lymphocytic CSF suggest HSV [[encephalitis|encephalitis]]. Untreated, it carries high mortality, and delay worsens outcome, so IV acyclovir starts as soon as the diagnosis is suspected. An early HSV PCR can be [[false-negative|falsely negative]]; if suspicion remains, repeat it rather than stopping treatment.",
    sources: ["tunkel2008-idsa-enceph", "venkatesan2013-iec"],
  }),
  order({
    id: "p-emerg-cord",
    skill: "emergency",
    modules: ["c-spinal-emergencies"],
    difficulty: 2,
    presentation: "back-pain-leg-weakness",
    usage: ["placement", "review"],
    vignette: "A 70-year-old with prostate cancer has back pain, new weakness of both legs, and a sensory level at T10. Symptoms started yesterday.",
    stem: ORDER_STEM,
    steps: [
      { id: "exam", text: "Focused neurological examination including saddle sensation and a bladder assessment" },
      { id: "steroid", text: "Give a corticosteroid (dexamethasone) unless lymphoma is suspected" },
      { id: "mri", text: "Urgent MRI of the whole spine" },
      { id: "refer", text: "Same-day referral to spinal surgery and oncology for decompression or radiotherapy" },
    ],
    order: [["exam"], ["steroid", "mri"], ["refer"]],
    rationale:
      "Suspected metastatic spinal cord compression is an emergency: function at the time of treatment predicts function afterwards. After a quick focused examination, give a corticosteroid to reduce cord edema and obtain urgent whole-spine MRI in parallel (steroids are avoided if lymphoma is possible because they can obscure the biopsy). Definitive treatment is surgical decompression or radiotherapy.",
    sources: [],
  }),
];

// ===========================================================================
// Uncertainty
// ===========================================================================

const UNCERTAINTY: AssessmentItem[] = [
  mcq({
    id: "p-unc-1",
    skill: "uncertainty",
    modules: ["a-test-interpretation"],
    difficulty: 2,
    presentation: "pretest-probability",
    usage: ["placement", "challenge", "review"],
    vignette:
      "A clinic orders a serum antibody test on many patients with mild memory complaints. In this group, the chance of the target disease is about 2 in 100. The test has 90% [[sensitivity|sensitivity]] and 90% [[specificity|specificity]]. A patient tests positive.",
    stem: "About how likely is it that this patient has the disease?",
    options: [
      { id: "a", text: "About 90%", tag: "misconception", feedback: "That confuses sensitivity with the probability of disease after a positive result." },
      { id: "b", text: "About 16%", correct: true, feedback: "Correct. Most positives in a low-probability group are false positives." },
      { id: "c", text: "About 50%", tag: "misconception", feedback: "Work it through with 1,000 people: 18 true positives and 98 false positives." },
      { id: "d", text: "About 2%: the test adds nothing", tag: "misconception", feedback: "The result does raise the probability, from 2% to about 16%, but most positives are still false." },
    ],
    rationale:
      "Of 1,000 people, 20 have the disease and 18 test positive; of 980 without it, 10% (98) also test positive. The probability of disease after a positive result is 18 / 116, about 16%. The positive [[likelihood-ratio|likelihood ratio]] is 0.9 / 0.1 = 9, which is strong, but starting from a low [[pretest-probability|pretest probability]] it still leaves the diagnosis unlikely. This is why antibody panels should be ordered for compatible syndromes.",
    sources: ["budhram2020-neural-ab"],
  }),
  free({
    id: "p-unc-2",
    skill: "uncertainty",
    modules: ["a-test-interpretation", "c-gbs"],
    difficulty: 3,
    presentation: "early-gbs-csf",
    usage: ["placement", "challenge", "review"],
    vignette:
      "A 33-year-old has 3 days of ascending leg weakness, tingling hands and feet, and absent reflexes. CSF on day 3: white cells 1 /µL, protein 38 mg/dL (normal 15 to 45).",
    stem: "Does this normal CSF make Guillain-Barre syndrome unlikely? Explain.",
    placeholder: "Yes or no, and why",
    answer: {
      full: [
        c("early-normal", "CSF is often normal early; it does not exclude GBS", [
          "normal + first week",
          "normal early",
          "early normal",
          "normal early stage",
          "protein rise later",
          "protein increase later",
          "protein raised later",
          "protein elevate later",
          "rises later",
          "protein + after first week",
          "protein + later",
          "too early",
          "does not exclude",
          "doesnt exclude",
          "cannot exclude",
          "cant exclude",
          "does not rule out",
          "doesnt rule out",
          "cannot rule out",
          "cant rule out",
          "not rule out",
          "can be normal",
          "often normal",
          "frequently normal",
          "may be normal",
          "commonly normal",
          "usually normal early",
          "repeat later",
          "repeat lp",
          "still possible",
          "remains possible",
          "still likely",
          "remains likely",
          "doesnt make unlikely",
          "does not make unlikely",
        ]),
      ],
      partial: [
        { concept: c("ncs", "nerve conduction studies", ["nerve conduction", "emg"]), credit: 0.4, feedback: "Nerve conduction studies help, but they can also be normal early. The key point: CSF protein is often normal in the first week, so this result does not exclude GBS." },
      ],
      wrong: [
        { concept: c("yes", "yes, unlikely", ["yes"]), tag: "misconception", feedback: "Normal early CSF does not lower the probability much: protein is normal in many patients during the first week and rises later." },
      ],
    },
    modelAnswer:
      "No. CSF protein is often normal in the first week of Guillain-Barre syndrome and rises later, so a normal early result does not exclude it; diagnose clinically, monitor breathing, and repeat testing if needed.",
    rationale:
      "Raised CSF protein develops over the first weeks in [[guillain-barre-syndrome|GBS]]: it is normal in many patients in the first week and in a minority even later. A normal early result is a [[false-negative|false negative]] of timing, not evidence against the diagnosis. The diagnosis is clinical, supported by CSF and nerve conduction studies, and treatment and respiratory monitoring should not wait for a repeat test.",
    sources: ["leonhard2019-gbs10", "vandoorn2023-gbs"],
  }),
  mcq({
    id: "p-unc-eeg",
    skill: "uncertainty",
    modules: ["c-status-epilepticus", "a-test-interpretation"],
    difficulty: 1,
    presentation: "recurrent-episodes",
    usage: ["placement", "review"],
    vignette:
      "A 27-year-old has had two unprovoked episodes, each witnessed: a minute of staring, lip smacking and fumbling with her hands, with no memory afterward. A routine 30-minute EEG between episodes is normal.",
    stem: "What does the normal EEG mean?",
    options: [
      { id: "a", text: "It does not exclude epilepsy: a single routine [[interictal|interictal]] EEG often misses [[epileptiform|epileptiform]] discharges, and the diagnosis rests mainly on the history", correct: true, feedback: "Correct." },
      { id: "b", text: "It excludes epilepsy", tag: "misconception", feedback: "A single routine EEG is normal in many people with epilepsy." },
      { id: "c", text: "It shows the episodes are functional (nonepileptic)", tag: "misconception", feedback: "A normal interictal EEG is common in epilepsy. Functional seizures are diagnosed by recording a typical event on video-EEG, not by a normal routine EEG." },
      { id: "d", text: "It means antiseizure medication would not work", tag: "misconception", feedback: "Treatment response does not depend on whether the interictal EEG is abnormal." },
    ],
    rationale:
      "Interictal epileptiform discharges are intermittent, so a single routine EEG has limited [[sensitivity|sensitivity]]. Yield rises with repeat, sleep-deprived or prolonged recordings. The history from a witness is the main diagnostic evidence; a normal EEG is a possible [[false-negative|false negative]] and should not override a convincing description of focal seizures.",
    sources: [],
  }),
  mcq({
    id: "p-unc-seroneg",
    skill: "uncertainty",
    modules: ["c-autoimmune-encephalitis"],
    difficulty: 3,
    presentation: "seronegative-encephalitis",
    usage: ["placement", "review"],
    vignette:
      "A 45-year-old has 5 weeks of memory loss, new seizures, and confusion. MRI shows bilateral mesial temporal T2/FLAIR hyperintensity; CSF shows a mild lymphocytic pleocytosis. HSV PCR and other infection tests are negative, and no other cause is found. Serum and CSF autoimmune encephalitis antibody panels are negative.",
    stem: "What is the best interpretation?",
    options: [
      { id: "a", text: "Autoimmune limbic encephalitis remains likely: these findings can meet criteria without antibodies, and immunotherapy can be considered", correct: true, feedback: "Correct." },
      { id: "b", text: "The negative panels exclude autoimmune encephalitis", tag: "misconception", feedback: "Panels test only known antigens. [[seronegative|Antibody-negative]] autoimmune encephalitis is well recognized." },
      { id: "c", text: "Repeat the panels weekly and withhold treatment until one is positive", tag: "unsafe-priority", feedback: "Delaying immunotherapy in probable autoimmune encephalitis worsens outcome, and repeat panels may never turn positive." },
      { id: "d", text: "Diagnose a primary psychiatric disorder", tag: "misconception", feedback: "Seizures, bilateral mesial temporal MRI changes and CSF pleocytosis are objective evidence of brain inflammation." },
    ],
    rationale:
      "Consensus criteria allow a diagnosis of autoimmune limbic encephalitis without antibodies when there is subacute memory loss, seizures or psychiatric change, bilateral mesial temporal MRI abnormality, CSF pleocytosis or temporal EEG abnormality, and reasonable exclusion of alternatives. A negative panel lowers but does not remove the probability, because not all target antigens are known or tested.",
    sources: ["graus2016-ae", "budhram2020-neural-ab"],
  }),
  multi({
    id: "p-unc-abx",
    skill: "uncertainty",
    modules: ["c-meningitis", "a-test-interpretation"],
    difficulty: 2,
    presentation: "partially-treated-meningitis",
    usage: ["placement", "review"],
    vignette:
      "A 19-year-old took oral antibiotics for 2 days for presumed sinusitis, then developed fever, headache, and neck stiffness. CSF: 450 white cells/µL (55% neutrophils), protein 110 mg/dL, glucose 48 mg/dL with a CSF to blood ratio of 0.45. Gram stain shows no organisms.",
    stem: "Select every correct statement.",
    options: [
      { id: "a", text: "Prior antibiotics can make the Gram stain and culture negative", correct: true },
      { id: "b", text: "Bacterial meningitis is not excluded; continue empiric treatment", correct: true },
      { id: "c", text: "CSF PCR for bacterial pathogens can still identify the organism", correct: true },
      { id: "d", text: "The mixed cell count proves viral meningitis, so stop antibiotics", tag: "unsafe-priority", feedback: "Prior antibiotics can shift the profile toward a mixed or lymphocytic pattern. Stopping treatment risks untreated bacterial meningitis." },
      { id: "e", text: "A glucose ratio of 0.45 excludes bacterial meningitis", tag: "misconception", feedback: "A ratio below 0.4 supports bacterial meningitis, but a higher ratio does not exclude it, especially after antibiotics." },
      { id: "f", text: "Repeat the lumbar puncture in 2 weeks before deciding on treatment", tag: "unsafe-priority", feedback: "The decision is needed now; a delayed repeat test cannot guide initial treatment." },
    ],
    rationale:
      "Antibiotics before the [[lumbar-puncture|lumbar puncture]] reduce the yield of [[gram-stain|Gram stain]] and culture and can soften the CSF profile (fewer neutrophils, near-normal glucose). A cell count in the hundreds with high protein still fits bacterial meningitis. PCR is less affected by prior antibiotics. Continue empiric treatment while results are uncertain.",
    sources: ["tunkel2004-idsa-bm", "vandebeek2016-escmid"],
  }),
  mcq({
    id: "p-unc-hints",
    skill: "uncertainty",
    modules: ["a-test-interpretation", "c-vertigo-vision"],
    difficulty: 3,
    presentation: "acute-vertigo",
    usage: ["placement", "review"],
    vignette:
      "A 66-year-old with hypertension has 10 hours of continuous vertigo, vomiting, and unsteadiness. The [[head-impulse-test|head impulse test]] is normal, nystagmus changes direction with gaze, and there is a vertical [[skew-deviation|skew deviation]]. MRI with diffusion-weighted imaging (DWI) 8 hours after onset is normal.",
    stem: "What is the best interpretation?",
    options: [
      { id: "a", text: "This central bedside pattern is more sensitive for stroke than early DWI; posterior circulation stroke remains likely and imaging should be repeated later", correct: true, feedback: "Correct." },
      { id: "b", text: "The normal MRI excludes stroke; treat as vestibular neuritis", tag: "unsafe-priority", feedback: "Early DWI misses a meaningful minority of posterior circulation strokes in the first day or two." },
      { id: "c", text: "The bedside examination is valid only if the MRI is abnormal", tag: "misconception", feedback: "The bedside examination stands on its own and, in experienced hands, outperformed early MRI in the study that established it." },
      { id: "d", text: "A normal head impulse test is reassuring and points to a peripheral cause", tag: "misconception", feedback: "In acute continuous vertigo, a normal head impulse test is worrying: vestibular neuritis abolishes the reflex on the affected side, so a normal response suggests a central cause." },
    ],
    rationale:
      "In the acute vestibular syndrome, a normal head impulse, direction-changing nystagmus and skew deviation each point to a central lesion. Kattah and colleagues found this three-step examination more sensitive for stroke than DWI in the first 48 hours, when small brainstem infarcts can be invisible. A normal early MRI is a possible [[false-negative|false negative]] of timing; manage as stroke and reimage.",
    sources: ["kattah2009-hints"],
  }),
  free({
    id: "p-unc-late-window",
    skill: "uncertainty",
    modules: ["c-acute-ischemic-stroke"],
    difficulty: 3,
    presentation: "late-window-stroke",
    usage: ["placement", "review"],
    vignette:
      "A 69-year-old was last known well 14 hours ago and now has a left MCA syndrome. CT angiography shows a left M1 occlusion. CT perfusion shows a small core of irreversibly injured tissue and a much larger area of underperfused but potentially salvageable tissue.",
    stem: "Can thrombectomy still be considered, and what makes it possible?",
    placeholder: "Yes or no, and why",
    answer: {
      full: [
        c("mismatch", "imaging mismatch (small core, large penumbra)", [
          "mismatch",
          "penumbra",
          "salvageable",
          "small core",
          "imaging selection",
          "tissue window",
          "perfusion selection",
          "viable tissue",
          "tissue at risk",
        ]),
      ],
      partial: [
        { concept: c("window", "time window alone", ["24 hours", "within 24", "up to 24", "16 hours", "late window"]), credit: 0.5, feedback: "The late window exists, but time alone is not enough: selection depends on imaging showing a small core with salvageable tissue (a mismatch)." },
        { concept: c("yes", "yes without reason", ["yes"]), credit: 0.3, feedback: "Yes, but explain why: imaging shows a small core with a large salvageable penumbra (a mismatch), which is how late-window trials selected patients." },
      ],
      wrong: [
        { concept: c("too-late", "too late", ["too late", "outside window", "beyond window", "past window", "no thrombectomy", "not eligible", "ineligible"]), tag: "misconception", feedback: "Beyond 6 hours, patients with a small core and salvageable tissue on imaging still benefit from thrombectomy (DAWN up to 24 hours, DEFUSE 3 up to 16 hours)." },
      ],
    },
    modelAnswer: "Yes. Perfusion imaging shows a small infarct core with a large salvageable penumbra (a mismatch), so thrombectomy can still benefit him in the late window.",
    rationale:
      "Time is a surrogate for how much brain is still salvageable, and it varies with collateral circulation. Late-window trials (DAWN, 6 to 24 hours; DEFUSE 3, 6 to 16 hours) selected patients by imaging: a small core relative to the deficit or to the hypoperfused [[penumbra|penumbra]]. With a [[large-vessel-occlusion|large vessel occlusion]] and this mismatch, [[thrombectomy|thrombectomy]] improves outcome even at 14 hours.",
    sources: ["nogueira2018-dawn", "albers2018-defuse3", "powers2019-ais"],
  }),
];

export const PLACEMENT_ITEMS: AssessmentItem[] = [
  ...TERMINOLOGY,
  ...LOCALIZATION,
  ...MECHANISM,
  ...HISTORY_EXAM,
  ...DIFFERENTIAL,
  ...INVESTIGATION,
  ...INTERPRETATION,
  ...EMERGENCY,
  ...UNCERTAINTY,
];

/** One item per skill, in SKILLS order, all difficulty 2, each from a different module. */
export const SCREENING_IDS: string[] = [
  "p-term-2", // terminology, f-terminology
  "p-loc-bs-1", // localization, f-localization
  "p-mech-demyelination", // mechanism, c-gbs
  "p-hx-ptosis-pupil", // history-exam, f-ocular-motor
  "p-immuno-nmdar-1", // differential, c-autoimmune-encephalitis
  "p-inv-stroke-1", // investigation-selection, c-acute-ischemic-stroke
  "p-interp-csf-1", // interpretation, c-meningitis
  "p-emerg-se-1", // emergency, c-status-epilepticus
  "p-unc-1", // uncertainty, a-test-interpretation
];

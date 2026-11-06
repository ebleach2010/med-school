// Module x-coordination-gait: bedside coordination testing (limbs, trunk, Romberg, tandem) and
// recognizing gait patterns by observation. AI draft pending clinician review. All patients are
// synthetic. Pathway anatomy of the cerebellum and vestibular system belongs to
// f-sensory-visual-vestibular; this module is about examination technique and pattern recognition.

import type { AssessmentItem, Concept, FreeTextItem, LocalizationItem, McqItem, MultiSelectItem } from "../../shared/types";
import { meta, term, type ModuleContent } from "./types";

const MID = "x-coordination-gait";
const CURRIC = "safdieh2019-curriculum";
const DAUM = "daum2014-positive-signs";
const PIRKER = "pirker2017-gait";
const RELKIN = "relkin2005-inph";

type Draft<T extends AssessmentItem> = Omit<T, "version" | "meta" | "format" | "modules"> & { sources: string[]; modules?: string[] };

function mcq(d: Draft<McqItem>): McqItem {
  const { sources, modules, ...rest } = d;
  return { ...rest, format: "mcq", modules: modules ?? [MID], version: 1, meta: meta(d.id, sources) };
}
function multi(d: Draft<MultiSelectItem>): MultiSelectItem {
  const { sources, modules, ...rest } = d;
  return { ...rest, format: "multi-select", modules: modules ?? [MID], version: 1, meta: meta(d.id, sources) };
}
function free(d: Draft<FreeTextItem>): FreeTextItem {
  const { sources, modules, ...rest } = d;
  return { ...rest, format: "free-text", modules: modules ?? [MID], version: 1, meta: meta(d.id, sources) };
}
function loc(d: Draft<LocalizationItem>): LocalizationItem {
  const { sources, modules, ...rest } = d;
  return { ...rest, format: "localization", modules: modules ?? [MID], version: 1, meta: meta(d.id, sources) };
}

const c = (id: string, label: string, patterns: string[]): Concept => ({ id, label, patterns });

// ===========================================================================
// Items
// ===========================================================================

const ITEMS: AssessmentItem[] = [
  // ---------------- l-coord-exam ----------------
  loc({
    id: "m-coord-dysmetria",
    skill: "localization",
    difficulty: 1,
    presentation: "one-sided-limb-ataxia",
    usage: ["lesson", "review"],
    vignette:
      "A 52-year-old has become clumsy with his right hand. On finger-to-nose testing the right index finger overshoots the examiner's finger and wobbles more and more as it nears his nose. The right heel slides off the left shin on heel-to-shin testing. Strength, tone, joint position sense, and vibration sense are normal in all four limbs, and the left side is coordinated.",
    stem: "Where is the lesion most likely to be?",
    correct: ["cerebellum"],
    partial: [
      { region: "pons", credit: 0.3, feedback: "Pathways to and from the cerebellum do run through the pons, but a pontine lesion usually adds other signs such as weakness or cranial nerve palsies. Isolated one-sided limb ataxia points to the cerebellar hemisphere." },
    ],
    rationale:
      "Overshoot ([[dysmetria|dysmetria]]) and a tremor that grows near the target ([[intention-tremor|intention tremor]]), with normal strength and normal joint position sense, are cerebellar limb signs. Limb ataxia from a cerebellar hemisphere lesion appears on the same side as the lesion, so this points to the right cerebellar hemisphere. Normal strength matters: weakness alone can make movements look clumsy. Normal joint position sense matters too: without it, the incoordination could be sensory.",
    sources: [CURRIC, PIRKER],
  }),
  mcq({
    id: "m-coord-weakness",
    skill: "history-exam",
    difficulty: 1,
    presentation: "clumsy-weak-arm",
    usage: ["lesson", "review"],
    vignette:
      "Two days after a left hemisphere stroke, a 68-year-old can lift her right arm against gravity but not against resistance. On finger-to-nose testing the right arm is slow and drifts off course. The left arm is strong and accurate.",
    stem: "How should the right finger-to-nose finding be recorded?",
    options: [
      { id: "a", text: "Right arm weakness; coordination cannot be judged fairly in this arm because of the weakness", correct: true, feedback: "Right. Ataxia means incoordination out of proportion to weakness, so a clearly weak limb cannot be called ataxic on this test." },
      { id: "b", text: "Right arm [[ataxia|ataxia]] from cerebellar involvement", tag: "weak-reasoning", feedback: "Weakness makes target-directed movement slow and inaccurate. Without coordination that is worse than the weakness would explain, calling it ataxia is not supported." },
      { id: "c", text: "Right [[dysmetria|dysmetria]] and [[intention-tremor|intention tremor]]", tag: "terminology", feedback: "Those are components of cerebellar ataxia. Slowness and drift in a weak arm are not the same as overshoot or a tremor that grows near the target." },
      { id: "d", text: "Normal coordination, because she reached her nose", tag: "misconception", feedback: "Reaching the target eventually does not make the movement normal. Record the weakness and that coordination could not be assessed fairly." },
    ],
    rationale:
      "[[ataxia|Ataxia]] is incoordination that is not explained by weakness. Coordination tests depend on enough strength to perform them, so in a weak limb they are interpreted cautiously or not at all. Compare with the strong side, and record what limited the test. Ataxic hemiparesis, where incoordination is out of proportion to mild weakness, is a recognized lacunar syndrome, which is why the comparison with the degree of weakness matters.",
    sources: [CURRIC],
  }),
  multi({
    id: "m-coord-sensory",
    skill: "history-exam",
    difficulty: 2,
    presentation: "unsteady-in-dark",
    usage: ["lesson", "review", "challenge"],
    vignette:
      "A 63-year-old has become unsteady on her feet over a year. She is worse in the dark and nearly fell while washing her face in the shower. You want to know whether the unsteadiness is cerebellar or sensory.",
    stem: "Select every finding that points to sensory rather than cerebellar ataxia.",
    options: [
      { id: "a", text: "Steady standing with feet together and eyes open, but she loses balance as soon as she closes her eyes", correct: true },
      { id: "b", text: "Joint position sense lost at the toes and vibration sense lost to the knees", correct: true },
      { id: "c", text: "Heel-to-shin is accurate while she watches, but much worse with her eyes closed", correct: true },
      { id: "d", text: "With arms outstretched and eyes closed, her fingers make slow, wandering movements", correct: true },
      { id: "e", text: "She watches her feet and brings each heel down hard as she walks", correct: true },
      { id: "f", text: "Gaze-evoked [[nystagmus|nystagmus]] and slurred, irregular speech", tag: "misconception", feedback: "Nystagmus and ataxic dysarthria point to the cerebellum or its connections, not to loss of joint position sense." },
      { id: "g", text: "A wide-based, lurching gait that is just as unsteady with eyes open as with eyes closed", tag: "misconception", feedback: "Unsteadiness that does not depend on vision is the cerebellar pattern. Sensory ataxia is partly corrected by watching, so it worsens markedly when vision is removed." },
      { id: "h", text: "[[dysdiadochokinesia|Dysdiadochokinesia]] with the eyes open", tag: "misconception", feedback: "Irregular rapid alternating movements with the eyes open are a cerebellar limb sign." },
    ],
    rationale:
      "Balance uses three inputs: vision, [[proprioception|proprioception]], and the vestibular system. In [[sensory-ataxia|sensory ataxia]] proprioception is lost (dorsal columns, dorsal root ganglia, or large sensory nerve fibers), so the patient leans on vision: steady with the eyes open, unsteady with them closed ([[romberg-sign|Romberg sign]]), worse in the dark, and worse on limb tests done with the eyes closed. The outstretched fingers drift and wander when vision is removed ([[pseudoathetosis|pseudoathetosis]]), and the gait is stamping and watched. Cerebellar ataxia does not depend on vision in the same way and often comes with nystagmus, dysarthria, and dysdiadochokinesia.",
    sources: [CURRIC, PIRKER],
  }),
  mcq({
    id: "m-coord-romberg",
    skill: "interpretation",
    difficulty: 2,
    presentation: "cannot-stand-feet-together",
    usage: ["lesson", "review"],
    vignette:
      "A 47-year-old with a week of unsteadiness is asked to stand with his feet together. Even with his eyes open he sways widely and has to step out to stop himself falling. Joint position sense at the toes is normal.",
    stem: "What is the correct interpretation of the Romberg test?",
    options: [
      { id: "a", text: "Romberg cannot be interpreted: he is unstable with his eyes open, which points away from a purely proprioceptive cause", correct: true, feedback: "Right. The test compares eyes open with eyes closed, so it needs a stable start. Instability with the eyes open suggests a cerebellar or other cause." },
      { id: "b", text: "Positive Romberg, indicating a cerebellar lesion", tag: "misconception", feedback: "The Romberg test examines proprioception, not the cerebellum. Cerebellar patients are often unsteady with the eyes open, which makes the test uninterpretable rather than positive." },
      { id: "c", text: "Positive Romberg, indicating dorsal column disease", tag: "weak-reasoning", feedback: "A positive Romberg means steady with eyes open and unsteady only with eyes closed. He cannot stand even with eyes open, and joint position sense is normal." },
      { id: "d", text: "Negative Romberg, so his balance is normal", tag: "misconception", feedback: "He cannot stand with his feet together at all. That is a significant finding in itself, not a normal one." },
    ],
    rationale:
      "The [[romberg-sign|Romberg test]] asks whether vision is compensating for lost [[proprioception|proprioception]]. It is positive when a patient who stands steadily with feet together and eyes open loses balance once the eyes close. If the patient cannot stand with feet together even with the eyes open, there is nothing to compare, so record it as unable rather than positive. Marked instability with the eyes open is typical of midline cerebellar disease. Stand close to catch the patient whenever you test stance.",
    sources: [CURRIC, PIRKER],
  }),
  mcq({
    id: "m-coord-truncal",
    skill: "history-exam",
    difficulty: 2,
    presentation: "cannot-sit-unsupported",
    usage: ["lesson", "review", "challenge"],
    vignette:
      "A 61-year-old has had sudden vertigo and vomiting since this morning. Lying in bed, finger-to-nose and heel-to-shin are accurate on both sides. When asked to sit up on the edge of the bed without using his arms, he falls to one side and cannot sit unsupported.",
    stem: "What is the best interpretation of the examination so far?",
    options: [
      { id: "a", text: "Severe [[truncal-ataxia|truncal ataxia]], which suggests a midline cerebellar lesion; normal limb coordination does not exclude it", correct: true, feedback: "Right. Midline cerebellar lesions can spare the limbs, so trunk and gait must be tested before a cerebellar cause is set aside." },
      { id: "b", text: "Normal limb coordination excludes a cerebellar lesion", tag: "unsafe-priority", feedback: "Limb tests examine the cerebellar hemispheres. A midline lesion can leave them normal while the patient cannot sit or stand." },
      { id: "c", text: "Inability to sit is explained by nausea, so no further assessment of balance is needed", tag: "unsafe-priority", feedback: "Nausea makes patients reluctant to move, but being unable to sit without support is a sign that needs explaining, and it can be the main clue to a cerebellar stroke." },
      { id: "d", text: "He has a positive Romberg sign, so this is sensory ataxia", tag: "misconception", feedback: "Romberg was not tested, and he cannot even sit. Sensory ataxia is unmasked by closing the eyes, not seen as an inability to sit with the eyes open." },
    ],
    reasoning: {
      stem: "Which finding most changes your interpretation here?",
      options: [
        { id: "r1", text: "He cannot sit unsupported despite normal limb coordination", correct: true },
        { id: "r2", text: "He has vomited", feedback: "Vomiting accompanies both peripheral and central causes of vertigo and does not separate them." },
        { id: "r3", text: "Finger-to-nose is accurate on both sides", feedback: "Accurate limb testing is reassuring only about the cerebellar hemispheres. It is the trunk finding that matters here." },
      ],
    },
    rationale:
      "The cerebellar hemispheres coordinate the limbs on the same side; the midline cerebellum (vermis) controls the trunk and gait. A midline lesion can produce [[truncal-ataxia|truncal ataxia]] (unable to sit or stand without support) with accurate finger-to-nose and heel-to-shin. That is why coordination testing is not complete until sitting balance, standing, and walking have been observed, as far as is safe. Inability to sit or stand in acute vertigo is a reason to consider a central cause urgently.",
    sources: [CURRIC, PIRKER],
  }),

  // ---------------- l-coord-gait ----------------
  mcq({
    id: "m-coord-steppage",
    skill: "localization",
    difficulty: 1,
    presentation: "toes-catching",
    usage: ["lesson", "review"],
    vignette:
      "A 40-year-old has been tripping on stairs since a long hospital stay, during which he often sat with his legs crossed. Walking, he lifts his right knee unusually high and his right foot slaps down on the floor. The left leg moves normally and his arms swing normally.",
    stem: "What is this gait, and what does it point to?",
    options: [
      { id: "a", text: "[[steppage-gait|Steppage gait]] from right [[foot-drop|foot drop]], pointing to the lower motor neuron supply of the ankle dorsiflexors (for example the common fibular nerve or the L5 root)", correct: true, feedback: "Right. He lifts the knee high so the dropped foot clears the ground, and the foot slaps because the dorsiflexors cannot lower it gently." },
      { id: "b", text: "Hemiparetic gait with [[circumduction|circumduction]], pointing to the left hemisphere", tag: "misconception", feedback: "A hemiparetic leg is stiff and swings outward in an arc. It is not lifted high at the knee, and the arm on that side usually swings less." },
      { id: "c", text: "[[sensory-ataxia|Sensory ataxic]] gait, pointing to the dorsal columns", tag: "weak-reasoning", feedback: "Sensory ataxia gives a wide-based, stamping gait in both legs that worsens with the eyes closed. A one-sided high step with foot slap is foot drop." },
      { id: "d", text: "[[antalgic-gait|Antalgic gait]] from knee pain", tag: "misconception", feedback: "An antalgic gait shortens the time spent on a painful leg. It does not lift the knee high or slap the foot." },
    ],
    rationale:
      "Weak ankle dorsiflexion leaves the foot hanging during the swing phase, so the patient flexes the hip and knee more to clear the toes and the foot lands with a slap: a [[steppage-gait|steppage gait]]. One-sided [[foot-drop|foot drop]] usually comes from the common fibular (peroneal) nerve at the fibular head, which prolonged leg crossing or squatting can compress, or from the L5 root. Both-sided steppage suggests a length-dependent polyneuropathy. Testing ankle eversion and inversion and the ankle reflex helps separate nerve from root.",
    sources: [CURRIC, PIRKER],
  }),
  mcq({
    id: "m-coord-hemiparetic",
    skill: "localization",
    difficulty: 1,
    presentation: "stiff-leg-arc",
    usage: ["review"],
    vignette:
      "A 70-year-old walks with his left leg stiff and straight. Each step, the left foot swings out in an arc and the toe scuffs the floor. His left arm is held bent across his body and does not swing.",
    stem: "Which description and localization fit best?",
    options: [
      { id: "a", text: "Left [[hemiparesis|hemiparetic]] gait with [[circumduction|circumduction]]: a right-sided upper motor neuron lesion above the cord", correct: true, feedback: "Right. Spastic extension of the leg and flexion of the arm on one side, with circumduction, is the hemiparetic pattern, and corticospinal lesions above the decussation cause weakness on the opposite side." },
      { id: "b", text: "Left [[steppage-gait|steppage gait]]: left common fibular nerve lesion", tag: "misconception", feedback: "Steppage lifts the knee high to clear a floppy foot. This leg is stiff and swung outward, and the arm is involved too." },
      { id: "c", text: "Left hemiparetic gait: a left-sided brain lesion", tag: "slip", feedback: "The corticospinal tract crosses in the lower medulla, so a brain lesion causing left-sided weakness is on the right." },
      { id: "d", text: "[[scissoring|Scissoring]] gait: thoracic spinal cord lesion", tag: "misconception", feedback: "Scissoring affects both legs, with the knees crossing. Here one side is involved, arm included." },
    ],
    rationale:
      "After a corticospinal lesion the leg tends to extend (hip and knee straight, foot pointed down and turned in) and the arm to flex. The effectively longer leg cannot clear the floor by bending, so it is swung outward in an arc: [[circumduction|circumduction]]. Arm and leg involvement on the same side places the lesion above the cervical cord, on the opposite side of the brain.",
    sources: [CURRIC, PIRKER],
  }),
  loc({
    id: "m-coord-scissor",
    skill: "localization",
    difficulty: 2,
    presentation: "stiff-legs-normal-arms",
    usage: ["review"],
    vignette:
      "A 49-year-old has had slowly worsening stiffness of both legs for a year. She walks with short, stiff steps on her toes, and her knees brush together as each leg swings past the other. Both knee jerks are very brisk, both plantar responses are extensor, and there is a band of altered sensation around the lower chest. Arm strength, tone, and reflexes are normal.",
    stem: "Where is the lesion?",
    correct: ["cord-thoracic"],
    partial: [
      { region: "cord-cervical", credit: 0.4, feedback: "A cervical cord lesion can cause this gait, but the arms are normal and the sensory change is a band around the lower chest, which places the lesion in the thoracic cord." },
    ],
    rationale:
      "A [[scissoring|scissoring]] gait comes from spasticity in both legs: stiff extension, toe walking, and adductor overactivity that pulls the knees across each other. Bilateral upper motor neuron signs in the legs with normal arms and a sensory band on the trunk place the lesion in the thoracic cord, a [[paraparesis|spastic paraparesis]]. A lesion in both parasagittal frontal lobes can also affect both legs, but it would not give a truncal sensory level.",
    sources: [CURRIC, PIRKER],
  }),
  loc({
    id: "m-coord-waddling",
    skill: "localization",
    difficulty: 2,
    presentation: "hips-drop-alternately",
    usage: ["review"],
    vignette:
      "A 31-year-old has had increasing difficulty climbing stairs and getting up from the floor for two years. Walking, his trunk sways from side to side and his pelvis drops on the side of the leg that is swinging forward. He pushes on his thighs to stand up from a chair. Reflexes and sensation are normal.",
    stem: "Where is the lesion most likely to be?",
    correct: ["muscle"],
    partial: [
      { region: "nmj", credit: 0.5, feedback: "Neuromuscular junction disorders can cause proximal weakness, but they usually fluctuate and often involve the eyes or bulbar muscles. A steady two-year progression of hip girdle weakness with normal reflexes and sensation fits a myopathy best." },
      { region: "anterior-horn", credit: 0.2, feedback: "Anterior horn cell disease can weaken proximal muscles, but look for wasting, fasciculations, and changes in reflexes. With normal reflexes and a symmetric girdle pattern, muscle is more likely." },
    ],
    rationale:
      "Weak hip abductors cannot hold the pelvis level when one leg is in the air, so the pelvis drops toward the swinging leg and the trunk lurches over the standing leg to compensate: a [[waddling-gait|waddling gait]]. Symmetric [[proximal-weakness|proximal weakness]] with normal reflexes and sensation is the usual pattern of a myopathy. Using the hands to push up from the thighs is another sign of hip girdle weakness.",
    sources: [CURRIC, PIRKER],
  }),
  free({
    id: "m-coord-parkinsonian",
    skill: "history-exam",
    difficulty: 2,
    presentation: "small-steps-stooped",
    usage: ["lesson", "review"],
    vignette:
      "A 72-year-old walks stooped forward with a narrow base and short steps that barely clear the floor. His left arm hardly swings, and a tremor of the left hand appears as he walks. To turn around he takes many small steps, moving his head and trunk together as one piece.",
    stem: "Name this gait pattern.",
    placeholder: "Name the gait",
    answer: {
      full: [c("parkinsonian", "Parkinsonian gait", ["parkinsonian gait", "parkinsonian", "parkinsonism", "parkinson gait", "parkinson disease gait", "hypokinetic gait"])],
      partial: [
        { concept: c("pd", "Parkinson disease", ["parkinson disease", "parkinsons disease", "parkinsons", "parkinson"]), credit: 0.7, feedback: "Parkinson disease is the commonest cause, but the question asks for the gait: a [[parkinsonian-gait|parkinsonian gait]]. Other forms of parkinsonism produce the same pattern." },
        { concept: c("shuffling", "Shuffling gait", ["shuffling gait", "shuffling", "shuffle"]), credit: 0.6, feedback: "Shuffling describes the steps. With reduced arm swing on one side, a stooped posture, a rest tremor, and turning en bloc, the pattern is a [[parkinsonian-gait|parkinsonian gait]]." },
        { concept: c("festinating", "Festinating gait", ["festinating gait", "festination", "festinant"]), credit: 0.6, feedback: "Festination (steps that hurry and shorten) is one feature of the [[parkinsonian-gait|parkinsonian gait]], but it is not described here. Name the overall pattern." },
      ],
      wrong: [
        { concept: c("magnetic", "Magnetic or frontal gait", ["magnetic gait", "magnetic", "frontal gait", "normal pressure hydrocephalus", "nph", "gait apraxia"]), tag: "weak-reasoning", feedback: "The magnetic gait of normal pressure hydrocephalus is usually wide-based with relatively preserved arm swing. A narrow base, one-sided reduced arm swing, and a rest tremor point to parkinsonism." },
        { concept: c("cerebellar", "Cerebellar ataxic gait", ["cerebellar gait", "ataxic gait", "cerebellar ataxia", "ataxia"]), tag: "misconception", feedback: "Cerebellar gait is wide-based and irregular, with lurching steps. This gait is narrow-based, small, and slow." },
        { concept: c("steppage", "Steppage gait", ["steppage", "foot drop"]), tag: "misconception", feedback: "Steppage lifts the knee high to clear a dropped foot. Here the feet barely clear the floor." },
      ],
    },
    modelAnswer: "Parkinsonian gait: stooped, narrow-based, short steps, reduced left arm swing, and turning en bloc.",
    rationale:
      "Parkinsonism makes movements small and slow ([[bradykinesia|bradykinesia]]), and walking shows it clearly: short, low steps, a flexed posture, reduced arm swing (often asymmetric early on), and turning in many small steps with the head and trunk moving together (en bloc). Hurrying, shortening steps ([[festination|festination]]) and sudden freezing can follow. A rest tremor that appears while walking is a useful clue. Watching the arms and the turn is what separates this from other slow, short-stepped gaits.",
    sources: [CURRIC, PIRKER],
  }),
  mcq({
    id: "m-coord-nph",
    skill: "differential",
    difficulty: 3,
    presentation: "feet-stuck-to-floor",
    usage: ["lesson", "review", "challenge"],
    vignette:
      "A 77-year-old's family says he has been walking badly for a year and has become forgetful and slow. He now has urinary urgency with occasional incontinence. He walks slowly on a wide base with short steps and his feet turned outward; his feet seem stuck to the floor when he starts and when he turns. His arms swing normally and there is no tremor. Seated, he can mime walking and pedaling movements with his legs quite well.",
    stem: "Which interpretation fits best?",
    options: [
      { id: "a", text: "A [[magnetic-gait|magnetic (frontal) gait]], raising the question of [[normal-pressure-hydrocephalus|normal pressure hydrocephalus]]", correct: true, feedback: "Right. A wide-based, short-stepped gait with start and turn hesitation, preserved arm swing, cognitive slowing, and urinary symptoms is the pattern to recognize; brain imaging is the next step." },
      { id: "b", text: "[[parkinsonian-gait|Parkinsonian gait]] from Parkinson disease", tag: "weak-reasoning", feedback: "Short steps and turning difficulty overlap, but Parkinson disease typically gives a narrow base, reduced and asymmetric arm swing, and often a rest tremor. Here the base is wide and the upper body is spared." },
      { id: "c", text: "Cerebellar [[ataxia|ataxic]] gait", tag: "misconception", feedback: "Cerebellar gait is wide-based but irregular and lurching, with variable steps. Feet that seem stuck to the floor with hesitation at starts and turns is a different pattern." },
      { id: "d", text: "[[sensory-ataxia|Sensory ataxic]] gait from a polyneuropathy", tag: "misconception", feedback: "Sensory ataxia gives a stamping gait that worsens in the dark, with lost joint position sense. It does not explain cognitive change and urinary urgency." },
    ],
    reasoning: {
      stem: "Which feature best separates this from Parkinson disease?",
      options: [
        { id: "r1", text: "A wide base with normal arm swing and no tremor: the lower body is affected, the upper body much less", correct: true },
        { id: "r2", text: "Short steps", feedback: "Short steps occur in both." },
        { id: "r3", text: "Difficulty turning", feedback: "Turning difficulty and turning in several steps occur in both." },
      ],
    },
    rationale:
      "A [[magnetic-gait|magnetic gait]] is slow and wide-based, with short, low steps, feet often turned outward, and hesitation or freezing at starts and turns, as if the feet were stuck to the floor. Arm swing and upper body movements are relatively preserved, which is why it is sometimes called lower-body parkinsonism, and leg movements can look much better lying or seated than when walking. Together with cognitive slowing and urinary urgency or incontinence it is the pattern that suggests [[normal-pressure-hydrocephalus|normal pressure hydrocephalus]], which is then assessed with brain imaging and further tests. Small vessel disease of the white matter can produce a similar gait.",
    sources: [CURRIC, RELKIN, PIRKER],
  }),
  multi({
    id: "m-coord-functional",
    skill: "uncertainty",
    difficulty: 2,
    presentation: "dragging-leg-gait",
    usage: ["review", "challenge"],
    vignette:
      "A 29-year-old has had difficulty walking for three weeks. Reflexes, plantar responses, and sensation are normal. You are looking for positive features of a functional gait disorder.",
    stem: "Select every observation that supports a functional gait disorder.",
    options: [
      { id: "a", text: "The right leg is dragged behind, with the foot sliding along the floor, rather than swung outward in an arc", correct: true },
      { id: "b", text: "The knees buckle suddenly, but she recovers each time without falling", correct: true },
      { id: "c", text: "The gait improves markedly while she is distracted, for example walking while counting backward", correct: true },
      { id: "d", text: "The pattern of the gait changes from moment to moment in ways that do not fit a single lesion", correct: true },
      { id: "e", text: "Her brain and spine MRI is normal", tag: "weak-reasoning", feedback: "Normal imaging does not establish a functional diagnosis; many disorders have normal MRI. The diagnosis rests on positive clinical features." },
      { id: "f", text: "She has had a stressful year", tag: "misconception", feedback: "Stress is common in everyone and is neither necessary nor sufficient for the diagnosis." },
      { id: "g", text: "A wide-based, irregular gait that is the same every time it is observed", tag: "misconception", feedback: "A consistent wide-based, irregular gait is the cerebellar ataxic pattern, not a positive functional feature." },
    ],
    rationale:
      "Functional gait disorders are diagnosed by positive features that show the walking system can work, or that the pattern does not fit structural disease: a dragged leg rather than a circumducting one, knee buckling without falls, marked improvement with distraction, and variability. Normal investigations and psychological stressors are not positive evidence. A functional disorder can coexist with another neurological disease, so the rest of the examination still matters, and the positive signs can be shown to the patient to explain the diagnosis. See also [[functional-neurological-disorder|functional neurological disorder]] and [[hoover-sign|Hoover sign]].",
    sources: [DAUM, CURRIC],
  }),
];

// ===========================================================================
// Lessons
// ===========================================================================

const LESSONS: ModuleContent["lessons"] = [
  {
    id: "l-coord-exam",
    moduleId: MID,
    title: "Testing coordination: limbs, trunk, and Romberg",
    concept: "Limb tests, trunk and stance testing, and the Romberg test each examine a different part of balance, and the pattern of abnormal results separates cerebellar from sensory ataxia.",
    minutes: 8,
    meta: meta("l-coord-exam", [CURRIC, PIRKER]),
    steps: [
      {
        kind: "hook",
        title: "Two unsteady patients",
        body: "Two patients come in saying they feel unsteady on their feet. One walks like a sailor on a rolling deck, eyes open or closed. The other walks well in a bright corridor, but in the dim side room she grabs for the wall. Both have [[ataxia|ataxia]], but the first problem is in the cerebellum and the second is in the sensory nerves or spinal cord. A few minutes of examination tells them apart.",
      },
      {
        kind: "explain",
        title: "Limb coordination tests",
        body:
          "Check strength first: a weak limb looks clumsy, and [[ataxia|ataxia]] means incoordination out of proportion to weakness. Then watch each test for the specific fault.\n\nFinger-to-nose: the patient touches your finger, then their own nose, back and forth, with your finger held at the edge of their reach and moved between attempts. Look for overshoot or undershoot ([[dysmetria|dysmetria]]) and a tremor that grows near the target ([[intention-tremor|intention tremor]]).\n\nHeel-to-shin: lying down, the patient places one heel on the opposite knee, runs it down the shin to the ankle, lifts it, and repeats. The cerebellar heel wobbles and slides off.\n\nRapid alternating movements: patting one palm with the palm and then the back of the other hand, or tapping a foot. Slow, irregular rhythm and force is [[dysdiadochokinesia|dysdiadochokinesia]].\n\nRebound: with the arms held out in front and eyes closed, tap each wrist briskly downward. A normal arm returns at once; an ataxic arm overshoots and oscillates before settling ([[rebound-phenomenon|impaired check]]). Keep your own hand ready so the arm cannot swing into the patient's face.",
        layers: {
          simpler: "Each test asks the limb to hit a target or switch direction smoothly. The cerebellar limb misses the target, shakes near it, or loses the rhythm.",
          mechanism:
            "The cerebellum compares the movement that was intended with the movement that is happening and corrects the error while it is in progress, including braking at the right moment. Without it, movements stop too late (overshoot), corrections come late and overshoot again (intention tremor), and switching between opposing muscles loses its timing (dysdiadochokinesia, impaired check).",
          compare:
            "Repeat finger-to-nose or heel-to-shin with the eyes closed. A cerebellar limb is about as inaccurate either way. A limb that is accurate while watched but wanders with the eyes closed has lost [[proprioception|proprioception]]: that is [[sensory-ataxia|sensory ataxia]]. Parkinsonian slowness on rapid alternation is different again: the rhythm is regular but the movements shrink as they go on.",
          deeper:
            "Cerebellar hemisphere lesions cause limb ataxia on the same side as the lesion, because the cerebellar pathways cross twice. That is the opposite rule from the cerebral hemispheres, where a lesion affects the opposite side of the body.",
        },
      },
      { kind: "predict", title: "Localize the clumsy hand", itemId: "m-coord-dysmetria" },
      {
        kind: "explain",
        title: "Trunk, stance, Romberg, and tandem walking",
        body:
          "Limb tests examine the cerebellar hemispheres. The midline cerebellum controls the trunk, so a patient can have normal finger-to-nose and still be unable to sit or stand: [[truncal-ataxia|truncal ataxia]]. Ask the patient to sit on the edge of the bed without using their arms, then to stand with feet comfortably apart, then with feet together, and then to walk. Stay close enough to catch them.\n\nRomberg test: the patient stands with feet together, first with eyes open, then with eyes closed. It is positive when they are steady with eyes open but lose balance (step out or start to fall) once the eyes close. That is a [[romberg-sign|Romberg sign]], and it means vision was compensating for lost [[proprioception|proprioception]]: sensory ataxia, not cerebellar. A little sway is normal. If the patient cannot stand with feet together even with eyes open, the test cannot be interpreted; record that, because it is a sign in itself.\n\n[[tandem-gait|Tandem gait]]: walking heel to toe along a line. It brings out mild unsteadiness of any cause, so it is sensitive but not specific, and many healthy older adults find it hard.",
        layers: {
          simpler: "Watch the patient sit, stand, and walk, not just move their arms and legs in bed. The Romberg test asks one question: does closing the eyes make them fall?",
          mechanism:
            "Standing balance uses vision, proprioception from the feet and legs, and the vestibular system. Lose one and the other two can usually compensate. With proprioception gone, vision carries the load, so removing it causes the fall. A cerebellar patient has all three inputs but cannot use them to coordinate posture, so closing the eyes changes less.",
          compare:
            "Cerebellar ataxia: unsteady with eyes open, nystagmus and slurred speech may be present, limb tests abnormal with eyes open. Sensory ataxia: steady with eyes open and unsteady with eyes closed, joint position and vibration sense lost, often reduced ankle reflexes, and the outstretched fingers wander with the eyes closed ([[pseudoathetosis|pseudoathetosis]]). An acute vestibular problem can also make patients sway more with the eyes closed, usually toward one side; the vestibular examination is covered elsewhere.",
          deeper:
            "Sensory ataxia comes from loss of large-fiber sensory input anywhere along the pathway: peripheral nerves (large-fiber neuropathy), dorsal root ganglia, or the [[dorsal-columns|dorsal columns]] of the spinal cord, as in vitamin B12 deficiency. Romberg described it in patients with tabes dorsalis, a syphilitic disease of the dorsal columns.",
        },
      },
      { kind: "apply", title: "Sensory or cerebellar?", itemId: "m-coord-sensory" },
      { kind: "apply", title: "Read the Romberg", itemId: "m-coord-romberg" },
      {
        kind: "summary",
        title: "Key points",
        points: [
          "Ataxia means incoordination out of proportion to weakness; check strength before judging coordination.",
          "Finger-to-nose and heel-to-shin show dysmetria and intention tremor; rapid alternation shows dysdiadochokinesia; rebound shows impaired check.",
          "Limb ataxia from a cerebellar hemisphere lesion is on the same side. Midline lesions can spare the limbs and cause truncal ataxia, so always test sitting, standing, and walking.",
          "Romberg tests proprioception, not the cerebellum: positive means steady with eyes open, unsteady with eyes closed. If they cannot stand with eyes open, it cannot be interpreted.",
          "Tandem gait is sensitive to unsteadiness of any cause but not specific.",
        ],
        reviewItemIds: ["m-coord-dysmetria", "m-coord-weakness", "m-coord-sensory", "m-coord-romberg", "m-coord-truncal"],
      },
    ],
  },
  {
    id: "l-coord-gait",
    moduleId: MID,
    title: "Recognizing gait patterns",
    concept: "Most abnormal gaits have a recognizable pattern, and naming the pattern from observation narrows the lesion to a part of the nervous system before any other test.",
    minutes: 9,
    meta: meta("l-coord-gait", [CURRIC, PIRKER, RELKIN, DAUM]),
    steps: [
      {
        kind: "hook",
        title: "The corridor exam",
        body: "Before you say a word, watch the patient walk from the waiting room. One swings a stiff leg out in an arc. One lifts a knee high and slaps the foot down. One shuffles with a still arm and turns in a dozen tiny steps. Each of these patterns points to a different place on the neuraxis, and you can see it in ten seconds.",
      },
      {
        kind: "explain",
        title: "How to watch, and the weakness and spasticity gaits",
        body:
          "Watch the patient stand up from a chair without using their arms, walk at their usual pace, turn, and walk back. Note the base (width between the feet), step length and height, rhythm, posture, arm swing on each side, and how they turn. Then add tandem walking and walking on heels and on toes if it is safe.\n\nHemiparetic gait: the leg on the weak side is stiff and extended, with the foot pointing down, so it is swung outward in an arc ([[circumduction|circumduction]]); the arm on that side is flexed and does not swing. It points to an upper motor neuron lesion on the opposite side of the brain.\n\nSpastic paraparetic gait: both legs are stiff, steps are short, the patient may walk on their toes, and the thighs pull together so the knees cross ([[scissoring|scissoring]]). It points to both corticospinal tracts, most often in the spinal cord.\n\n[[steppage-gait|Steppage gait]]: the knee is lifted high so a dropped foot clears the floor, and the foot slaps down. It points to the lower motor neuron supply of the ankle dorsiflexors: a nerve, a root, or, when both sides are affected, a polyneuropathy.\n\n[[waddling-gait|Waddling gait]]: the pelvis drops on the side of the swinging leg and the trunk sways from side to side. It points to weak hip girdle muscles, usually a myopathy.",
        layers: {
          simpler: "Stiff leg swung out to the side: one-sided brain lesion. Both legs stiff and crossing: spinal cord. High step with a slapping foot: foot drop. Rolling side to side: weak hips.",
          mechanism:
            "Upper motor neuron lesions bring spasticity, which favors leg extension; a straight leg is functionally too long, so it has to be swung around (circumduction). Adductor spasticity in both legs makes them cross (scissoring). A dropped foot hangs during swing, so the hip and knee overflex to lift it (steppage). Weak hip abductors cannot keep the pelvis level on one leg (waddling).",
          compare:
            "Both hemiparetic and steppage gaits catch the toe. The hemiparetic leg is stiff and swung outward, with the arm involved; the steppage leg bends more than normal at the knee, and the arm is normal. Ask the patient to walk on their heels: a dropped foot cannot.",
          deeper:
            "A waddling gait often comes with difficulty rising from a chair and pushing on the thighs to stand. Both-sided steppage with distal sensory loss and absent ankle reflexes suggests a length-dependent polyneuropathy; a high-arched foot with long-standing steppage raises the question of an inherited neuropathy.",
        },
      },
      {
        kind: "animation",
        title: "Gait and the lesion explorer",
        animation: "motor-pathway",
        preset: "level",
        caption: "Schematic model of the corticospinal, dorsal column, and spinothalamic pathways. Compare a left internal capsule lesion with a complete thoracic cord lesion and think about how each patient would walk.",
        task: "Select the complete thoracic cord. Predict how both legs move when the patient walks, and whether the Romberg test would be positive once the dorsal columns are cut.",
      },
      { kind: "predict", title: "Name the gait and the lesion", itemId: "m-coord-steppage" },
      {
        kind: "explain",
        title: "Ataxic, parkinsonian, frontal, antalgic, and functional gaits",
        body:
          "Cerebellar ataxic gait: wide base, irregular step length and timing, lurching or veering, and inability to walk heel to toe; about as bad with eyes open as closed.\n\n[[sensory-ataxia|Sensory ataxic]] gait: wide base, the patient watches their feet and lifts them and brings the heels down hard (stamping); much worse in the dark or with eyes closed, with a positive Romberg.\n\n[[parkinsonian-gait|Parkinsonian gait]]: stooped, narrow base, short low steps (shuffling), reduced arm swing that is often asymmetric, turning in many small steps with head and trunk together (en bloc), sometimes hurrying steps ([[festination|festination]]) or freezing.\n\n[[magnetic-gait|Magnetic or frontal gait]]: wide base, short steps, feet turned outward and seemingly stuck to the floor at starts and turns, with arm swing relatively preserved. With cognitive slowing and urinary urgency it suggests [[normal-pressure-hydrocephalus|normal pressure hydrocephalus]].\n\n[[antalgic-gait|Antalgic gait]]: the patient shortens the time on a painful leg. It is a pain gait, not a neurological one, but it is common and should be recognized.\n\nFunctional gait: positive features such as dragging a leg behind, knee buckling without falls, marked improvement with distraction, and variability that fits no single lesion.",
        layers: {
          simpler: "Wide and lurching: cerebellum. Wide and stamping, worse in the dark: lost position sense. Small and shuffling with a still arm: parkinsonism. Wide and stuck to the floor with normal arms: think normal pressure hydrocephalus. Limping off a sore leg: pain. Inconsistent, improves with distraction: functional.",
          mechanism:
            "A wide base is the body's answer to instability, whether from cerebellar disease or lost proprioception. Parkinsonism reduces the size of automatic movements, so steps shorten and arm swing fades. The magnetic gait reflects disturbed higher-level control of walking, so leg movements can look much better lying or seated than when the patient tries to walk.",
          compare:
            "Parkinsonian and magnetic gaits both have short steps and difficult turns. The parkinsonian base is narrow, arm swing is reduced, and there may be a rest tremor. The magnetic base is wide, the feet turn out, and the upper body is relatively spared. Cerebellar and sensory ataxic gaits are both wide-based; closing the eyes separates them.",
          deeper:
            "Functional gait disorders are diagnosed by positive features, not by normal tests, and they can coexist with other neurological disease. Showing the patient that the leg works better during distraction can help explain the diagnosis. Small vessel disease of the white matter can produce a gait very like that of normal pressure hydrocephalus.",
        },
      },
      { kind: "apply", title: "Name the gait", itemId: "m-coord-parkinsonian" },
      { kind: "apply", title: "Which slow gait?", itemId: "m-coord-nph" },
      {
        kind: "summary",
        title: "Key points",
        points: [
          "Watch rising from a chair, walking, turning, tandem walking, and heel and toe walking; note base, steps, rhythm, posture, and arm swing.",
          "Hemiparetic: circumduction, opposite brain. Spastic paraparetic: scissoring, usually the cord. Steppage: foot drop. Waddling: hip girdle weakness.",
          "Cerebellar ataxic: wide and irregular, little change with eyes closed. Sensory ataxic: stamping, much worse with eyes closed, Romberg positive.",
          "Parkinsonian: narrow, shuffling, reduced arm swing, en bloc turns. Magnetic: wide, stuck to the floor, arms relatively spared; think normal pressure hydrocephalus.",
          "Antalgic gait is a pain gait. Functional gait is recognized by positive features such as dragging, buckling without falls, and improvement with distraction.",
        ],
        reviewItemIds: ["m-coord-steppage", "m-coord-hemiparetic", "m-coord-scissor", "m-coord-waddling", "m-coord-parkinsonian", "m-coord-nph", "m-coord-functional"],
      },
    ],
  },
];

// ===========================================================================
// Glossary additions (ids not in the main glossary or other modules)
// ===========================================================================

const TERMS: ModuleContent["terms"] = [
  term("proprioception", "Proprioception", ["joint position sense", "position sense"],
    "The sense of where your limbs are without looking.",
    "Awareness of joint position and movement, carried by large sensory fibers in peripheral nerves and by the dorsal columns of the spinal cord. Tested by small movements of a toe or finger joint with the eyes closed.",
    "proh-pree-oh-SEP-shun",
    "With her eyes closed she cannot tell whether her big toe is moved up or down: proprioception is lost at the toes.",
    MID, ["dorsal-columns", "sensory-ataxia", "romberg-sign"]),
  term("sensory-ataxia", "Sensory ataxia", ["proprioceptive ataxia"],
    "Unsteadiness and clumsiness because the brain is not getting information about where the limbs are.",
    "Incoordination from loss of proprioceptive input (large-fiber neuropathy, dorsal root ganglia, or dorsal columns). Worse with the eyes closed or in the dark, with a positive Romberg sign and a stamping, wide-based gait.",
    undefined,
    "He walks well in daylight but staggers in the dark, and falls when he closes his eyes standing with feet together: sensory ataxia.",
    MID, ["ataxia", "proprioception", "romberg-sign"]),
  term("romberg-sign", "Romberg sign", ["Romberg test", "positive Romberg"],
    "Falling or stepping out when you close your eyes while standing with feet together, though you were steady with them open.",
    "Loss of balance on eye closure while standing with feet together, in a patient who is steady with the eyes open. It indicates impaired proprioception (sensory ataxia). It cannot be interpreted if the patient is unstable with the eyes open.",
    "ROM-berg",
    "Steady with eyes open, she sways and steps out within seconds of closing them: positive Romberg sign.",
    MID, ["sensory-ataxia", "proprioception", "truncal-ataxia"]),
  term("truncal-ataxia", "Truncal ataxia", ["axial ataxia", "trunk ataxia"],
    "Being unable to keep the body steady when sitting or standing, even if the arms and legs are coordinated.",
    "Incoordination of the trunk causing instability when sitting or standing, typically from a lesion of the midline cerebellum (vermis). Limb coordination may be normal.",
    undefined,
    "Finger-to-nose is normal, but he topples sideways when sitting on the edge of the bed: truncal ataxia.",
    MID, ["ataxia", "tandem-gait"]),
  term("tandem-gait", "Tandem gait", ["heel-to-toe walking", "tandem walking"],
    "Walking heel to toe along a straight line.",
    "Walking with the heel of one foot placed directly in front of the toes of the other. It narrows the base and brings out mild unsteadiness of any cause; sensitive but not specific, and often difficult for healthy older adults.",
    undefined,
    "She walks normally but steps off the line after two heel-to-toe steps: impaired tandem gait.",
    MID, ["ataxia", "truncal-ataxia"]),
  term("rebound-phenomenon", "Rebound phenomenon", ["impaired check", "impaired checking"],
    "When an arm that is pushed or released overshoots and swings before it settles.",
    "Failure to check a limb quickly after it is displaced or released, so it overshoots and oscillates; a cerebellar sign. Tested by tapping the outstretched arms or releasing resisted elbow flexion while guarding the patient's face.",
    undefined,
    "When the examiner taps her outstretched left wrist downward, the arm swings up and down several times before settling: impaired check on the left.",
    MID, ["ataxia", "dysmetria"]),
  term("pseudoathetosis", "Pseudoathetosis", ["piano-playing fingers"],
    "Slow, wandering finger movements when the eyes are closed, because the brain does not know where the fingers are.",
    "Involuntary, slow, writhing drift of the outstretched fingers or hand with the eyes closed, from loss of proprioception. It disappears or lessens when the patient watches the hand.",
    "soo-doh-ath-uh-TOH-sis",
    "With his arms outstretched and eyes closed, his fingers drift and wiggle; they steady when he opens his eyes.",
    MID, ["proprioception", "sensory-ataxia"]),
  term("circumduction", "Circumduction", ["circumducting gait", "hemiparetic gait"],
    "Swinging a stiff leg out to the side in an arc when walking.",
    "A gait in which a spastic, extended leg is swung outward and around in a semicircle because it cannot be flexed to clear the floor; typical of hemiparesis from an upper motor neuron lesion.",
    "sir-kum-DUK-shun",
    "His right leg swings out in an arc with each step and his right arm does not swing: right hemiparetic gait with circumduction.",
    MID, ["hemiparesis", "spasticity", "scissoring"]),
  term("scissoring", "Scissoring gait", ["scissor gait", "spastic paraparetic gait"],
    "Walking with stiff legs whose knees cross in front of each other.",
    "A gait in which spasticity of both legs, especially the hip adductors, makes the thighs pull together so the knees cross with each step, usually with short stiff steps and toe walking; a sign of bilateral corticospinal involvement.",
    undefined,
    "Her stiff legs cross at the knees as she walks on her toes: scissoring from a spastic paraparesis.",
    MID, ["paraparesis", "spasticity", "circumduction"]),
  term("foot-drop", "Foot drop", ["drop foot"],
    "Being unable to lift the front of the foot, so the toes catch.",
    "Weakness of ankle dorsiflexion, commonly from a common fibular (peroneal) nerve lesion, an L5 radiculopathy, or a polyneuropathy, and less often from a central lesion.",
    undefined,
    "She cannot walk on her left heel and her left toes catch on the carpet: left foot drop.",
    MID, ["steppage-gait", "distal-weakness"]),
  term("steppage-gait", "Steppage gait", ["high-stepping gait"],
    "Lifting the knee high when walking so a dropped foot clears the floor, then slapping the foot down.",
    "A gait compensating for foot drop: exaggerated hip and knee flexion during swing so the toes clear the ground, followed by a slap as the foot lands. Unilateral suggests a nerve or root lesion; bilateral suggests polyneuropathy.",
    undefined,
    "His right knee rises high with each step and the foot slaps down: right steppage gait.",
    MID, ["foot-drop", "neuropathy"]),
  term("waddling-gait", "Waddling gait", ["myopathic gait", "Trendelenburg gait"],
    "Walking with a side-to-side rolling of the hips and trunk.",
    "A gait from weakness of the hip girdle muscles, especially the hip abductors: the pelvis drops toward the swinging leg and the trunk lurches over the standing leg. Typical of myopathy.",
    undefined,
    "Her hips roll from side to side as she walks and she pushes on her thighs to stand up: waddling gait.",
    MID, ["proximal-weakness", "myopathy"]),
  term("bradykinesia", "Bradykinesia", [],
    "Slowness of movement, with movements getting smaller as they are repeated.",
    "Slowness of movement with a progressive reduction in speed or amplitude on repetition; the core feature of parkinsonism. In walking it shows as short steps and reduced arm swing.",
    "brad-ee-kih-NEE-zhuh",
    "Her finger taps start well and then shrink and slow down after a few seconds: bradykinesia.",
    MID, ["parkinsonian-gait", "festination"]),
  term("parkinsonian-gait", "Parkinsonian gait", ["shuffling gait", "hypokinetic gait"],
    "A stooped, shuffling walk with little arm swing.",
    "A gait with flexed posture, narrow base, short low steps, reduced (often asymmetric) arm swing, and turning in several steps with head and trunk moving together (en bloc), sometimes with festination or freezing; a feature of parkinsonism.",
    undefined,
    "He shuffles with a stooped back, his right arm stays still, and he takes many steps to turn: parkinsonian gait.",
    MID, ["bradykinesia", "festination", "magnetic-gait"]),
  term("festination", "Festination", ["festinating gait"],
    "Steps that get faster and shorter, as if chasing the body's center of gravity.",
    "Involuntary hastening of gait with progressively shorter steps, as if the patient were falling forward and trying to catch up; seen in parkinsonism.",
    "fes-tih-NAY-shun",
    "Once he starts walking his steps quicken and shorten until he has to grab a chair to stop: festination.",
    MID, ["parkinsonian-gait", "bradykinesia"]),
  term("magnetic-gait", "Magnetic gait", ["frontal gait", "higher-level gait disorder", "lower-body parkinsonism"],
    "A slow, wide-based walk in which the feet seem stuck to the floor.",
    "A gait with a wide base, short low steps, feet often turned outward, and hesitation at starts and turns as if the feet were stuck to the floor, with relatively preserved arm swing. Seen in normal pressure hydrocephalus and in white matter small vessel disease.",
    undefined,
    "His feet seem glued to the floor when he tries to start walking, though his arms swing normally: magnetic gait.",
    MID, ["normal-pressure-hydrocephalus", "parkinsonian-gait"]),
  term("normal-pressure-hydrocephalus", "Normal pressure hydrocephalus", ["NPH", "idiopathic normal pressure hydrocephalus", "iNPH"],
    "A condition of enlarged fluid spaces in the brain that causes walking problems, slowed thinking, and bladder urgency.",
    "Ventricular enlargement with a gait disorder, often with cognitive impairment and urinary urgency or incontinence, without raised pressure on routine lumbar puncture. Diagnosed from the clinical picture, brain imaging, and further testing; some patients improve with CSF shunting.",
    undefined,
    "A 76-year-old with a magnetic gait, slowed thinking, urinary urgency, and large ventricles on MRI is assessed for normal pressure hydrocephalus.",
    MID, ["magnetic-gait", "csf"]),
  term("antalgic-gait", "Antalgic gait", ["limp from pain"],
    "A limp that avoids putting weight on a painful leg.",
    "A gait in which the stance phase on a painful limb is shortened to reduce weight-bearing; caused by pain (joint, bone, or soft tissue), not by a neurological deficit.",
    "an-TAL-jik",
    "She steps quickly off her painful right knee with each stride: antalgic gait.",
    MID, ["steppage-gait"]),
];

// ===========================================================================
// Sources added by this module (verified on the web; see verificationNote)
// ===========================================================================

const SOURCES: ModuleContent["sources"] = [
  {
    id: PIRKER,
    kind: "review",
    citation: "Pirker W, Katzenschlager R. Gait disorders in adults and the elderly: a clinical guide. Wien Klin Wochenschr. 2017;129(3-4):81-95. doi:10.1007/s00508-016-1096-4",
    title: "Gait disorders in adults and the elderly: a clinical guide",
    authors: "Pirker W, Katzenschlager R",
    journal: "Wien Klin Wochenschr",
    year: 2017,
    doi: "10.1007/s00508-016-1096-4",
    pmid: "27770207",
    url: "https://doi.org/10.1007/s00508-016-1096-4",
    lastVerified: "2026-11-06",
    verificationNote:
      "Title, authors, journal, year, volume, issue, pages, DOI, PMID (27770207) and PMCID (PMC5318488) confirmed on 2026-11-06 from web search results indexing the PubMed and PMC records and a library catalog record of the Springer article (Epub 2016 Oct 21). PubMed, PMC, and the CORE full-text copy could not be opened from this environment, so the gait descriptions here were not checked against the full text; they are mainstream teaching that a clinician reviewer should confirm against the article.",
    verified: true,
  },
  {
    id: RELKIN,
    kind: "guideline",
    citation: "Relkin N, Marmarou A, Klinge P, Bergsneider M, Black PM. Diagnosing idiopathic normal-pressure hydrocephalus. Neurosurgery. 2005;57(3 Suppl):S4-16. doi:10.1227/01.NEU.0000168185.29659.C5",
    title: "Diagnosing idiopathic normal-pressure hydrocephalus",
    authors: "Relkin N, Marmarou A, Klinge P, Bergsneider M, Black PM",
    journal: "Neurosurgery",
    year: 2005,
    doi: "10.1227/01.NEU.0000168185.29659.C5",
    pmid: "16160425",
    url: "https://doi.org/10.1227/01.NEU.0000168185.29659.C5",
    lastVerified: "2026-11-06",
    verificationNote:
      "Title, authors, journal, year, supplement, DOI, and PMID (16160425) confirmed on 2026-11-06 from web search results indexing the PubMed record and the Hydrocephalus Association copy of the INPH guidelines. Some listings give the pages as S2-4 to S2-16; confirm the page format against the journal. PubMed and the full text could not be opened from this environment. Cited only for the general pattern of the NPH gait (wide base, short steps, turning difficulty) with cognitive and urinary symptoms; it is a 2005 guideline, so check for later diagnostic guidance before citing for criteria.",
    verified: true,
  },
];

// ===========================================================================
// Module
// ===========================================================================

export const CONTENT: ModuleContent | null = {
  moduleId: MID,
  module: {
    summary:
      "Bedside coordination testing (finger-to-nose, heel-to-shin, rapid alternating movements, rebound), trunk and stance testing, the Romberg test and tandem gait, and recognizing the main gait patterns by observation: hemiparetic, spastic paraparetic, cerebellar and sensory ataxic, steppage, waddling, parkinsonian, magnetic, antalgic, and functional.",
    objectives: [
      ["history-exam", "Perform limb coordination tests and name the findings: dysmetria, intention tremor, dysdiadochokinesia, and impaired check."],
      ["localization", "Use limb versus truncal ataxia to separate cerebellar hemisphere from midline lesions, and recognize that normal limb tests do not exclude a cerebellar lesion."],
      ["interpretation", "Perform and interpret the Romberg test as a test of proprioception, and separate sensory from cerebellar ataxia."],
      ["history-exam", "Recognize hemiparetic, spastic paraparetic, cerebellar ataxic, sensory ataxic, steppage, waddling, parkinsonian, magnetic, antalgic, and functional gaits from a description, and state what each points to."],
    ],
    prerequisites: ["f-localization"],
    lessons: ["l-coord-exam", "l-coord-gait"],
    challengeItems: ["m-coord-truncal", "m-coord-sensory", "m-coord-nph", "m-coord-functional"],
    skills: ["history-exam", "localization", "interpretation", "differential", "uncertainty"],
    minutes: 17,
    sources: [CURRIC, PIRKER, RELKIN, DAUM],
  },
  lessons: LESSONS,
  items: ITEMS,
  terms: TERMS,
  sources: SOURCES,
};

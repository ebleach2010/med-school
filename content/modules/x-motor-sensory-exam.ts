// Module x-motor-sensory-exam: how to elicit and grade the motor and sensory signs at the bedside:
// inspection, tone, pronator drift, MRC strength grading, key muscles and their roots, tendon
// reflexes and their roots, reinforcement, the plantar response and Hoffmann sign, sensory testing
// by modality, mapping a sensory level, and the Romberg test. AI draft pending clinician review.
// All patients are synthetic. What upper and lower motor neuron signs mean belongs to
// f-localization; coordination, gait, and the Romberg test in detail belong to x-coordination-gait.

import type {
  AssessmentItem,
  Concept,
  FreeTextItem,
  LocalizationItem,
  McqItem,
  MultiSelectItem,
  OrderPriorityItem,
  SelectTestsItem,
} from "../../shared/types";
import { meta, term, type ModuleContent } from "./types";

const MID = "x-motor-sensory-exam";
const CURRIC = "safdieh2019-curriculum";
const ISNCSCI = "kirshblum2011-isncsci";
const IYER = "iyer2016-cervical-radiculopathy";
const DAUM = "daum2014-positive-signs";
const NINDS = "litvan1996-ninds-reflex-scale";

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
function tests(d: Draft<SelectTestsItem>): SelectTestsItem {
  const { sources, modules, ...rest } = d;
  return { ...rest, format: "select-tests", modules: modules ?? [MID], version: 1, meta: meta(d.id, sources) };
}
function order(d: Draft<OrderPriorityItem>): OrderPriorityItem {
  const { sources, modules, ...rest } = d;
  return { ...rest, format: "order-priority", modules: modules ?? [MID], version: 1, meta: meta(d.id, sources) };
}

const c = (id: string, label: string, patterns: string[]): Concept => ({ id, label, patterns });

// ===========================================================================
// Items
// ===========================================================================

const ITEMS: AssessmentItem[] = [
  // ---------------- l-msx-motor ----------------
  mcq({
    id: "m-msx-mrc-grade",
    skill: "history-exam",
    difficulty: 1,
    presentation: "arm-lifts-no-resistance",
    usage: ["lesson", "review"],
    vignette:
      "A 66-year-old is examined the day after a right hemisphere stroke. Sitting up, she can raise her left arm out to the side through the full range against gravity, but the moment you press down on it at the elbow, even lightly, the arm drops.",
    stem: "What is the MRC grade for left shoulder abduction?",
    options: [
      { id: "a", text: "Grade 3", correct: true, feedback: "Right. Full movement against gravity with no added resistance is grade 3." },
      { id: "b", text: "Grade 2", tag: "knowledge-gap", feedback: "Grade 2 is movement only with gravity eliminated, for example sliding the arm across a table. She lifts the arm against gravity." },
      { id: "c", text: "Grade 4", tag: "knowledge-gap", feedback: "Grade 4 needs some resistance to be overcome. Her arm drops with the lightest pressure." },
      { id: "d", text: "Grade 1", tag: "knowledge-gap", feedback: "Grade 1 is a flicker of contraction with no movement of the joint." },
    ],
    rationale:
      "The [[mrc-scale|MRC scale]] steps are defined by what the muscle can do: 0 no contraction, 1 a flicker of contraction without movement, 2 movement with gravity eliminated, 3 movement against gravity but not against resistance, 4 movement against gravity and some resistance, and 5 normal power. Gravity is the dividing line between 2 and 3, and resistance between 3 and 4, so the grade depends on positioning the limb correctly. Record the muscle, side, and grade: \"left shoulder abduction 3/5.\"",
    sources: [CURRIC, ISNCSCI],
  }),
  multi({
    id: "m-msx-tone",
    skill: "history-exam",
    difficulty: 2,
    presentation: "stiff-arm-two-causes",
    usage: ["lesson", "review", "challenge"],
    vignette:
      "Two patients each have a stiff right arm. One had a left hemisphere stroke three months ago. The other has a slowly progressive disorder with slowed movements. You examine tone in each.",
    stem: "Select every finding that indicates spasticity rather than rigidity.",
    options: [
      { id: "a", text: "A catch when the forearm is turned palm up quickly, but little resistance when it is turned slowly", correct: true },
      { id: "b", text: "Resistance that builds and then suddenly gives way as the elbow is extended quickly", correct: true },
      { id: "c", text: "Increased tone mainly in the arm flexors and pronators, with the extensors much less affected", correct: true },
      { id: "d", text: "Resistance that is the same throughout the range and the same whether the wrist is moved slowly or quickly", tag: "misconception", feedback: "Even resistance through the whole range, independent of speed, is lead-pipe [[rigidity|rigidity]]." },
      { id: "e", text: "A ratchety series of catches as the wrist is moved, in time with a tremor", tag: "misconception", feedback: "That is cogwheel rigidity: rigidity with a superimposed tremor, typical of parkinsonism." },
      { id: "f", text: "Stiffness at the wrist that increases when the patient opens and closes the other hand", tag: "misconception", feedback: "Rigidity is enhanced by moving the opposite limb (an activation maneuver). This is a way to bring out mild rigidity, not spasticity." },
      { id: "g", text: "Resistance that seems to match whatever force you use, as if the patient cannot relax, which changes from moment to moment", tag: "terminology", feedback: "That is [[paratonia|paratonia]], seen with frontal lobe disease and dementia. It varies with the examiner's force rather than with speed or direction." },
    ],
    rationale:
      "[[spasticity|Spasticity]] is velocity-dependent: quick stretch meets a catch, slow stretch much less, and the resistance may build and then give way (clasp-knife). It is uneven across muscle groups, favoring arm flexors and pronators and leg extensors, so the quick supination catch at the forearm and a fast lift of the knee off the bed are good tests. [[rigidity|Rigidity]] is velocity-independent and present in both directions through the whole range (lead pipe), with a ratchety quality when a tremor is superimposed (cogwheeling), and it is best felt with slow movements at the wrist, elbow, and neck, made more obvious by moving the opposite limb.",
    sources: [CURRIC],
  }),
  mcq({
    id: "m-msx-drift",
    skill: "interpretation",
    difficulty: 1,
    presentation: "subtle-arm-drift",
    usage: ["lesson", "review"],
    vignette:
      "A 59-year-old says his right hand felt clumsy for an hour yesterday. Strength in each arm muscle tested one at a time seems full. You ask him to hold both arms straight out in front, palms up, with his eyes closed. After several seconds his right forearm slowly turns palm down and the right arm sinks a little. The left arm stays still.",
    stem: "What does this finding most suggest?",
    options: [
      { id: "a", text: "Mild right-sided upper motor neuron weakness (a right [[pronator-drift|pronator drift]])", correct: true, feedback: "Right. Pronation with downward drift is a sensitive sign of mild corticospinal weakness, even when individual muscles grade 5." },
      { id: "b", text: "Loss of right arm proprioception", tag: "weak-reasoning", feedback: "Lost position sense makes the hand wander or the fingers make slow writhing movements with the eyes closed ([[pseudoathetosis|pseudoathetosis]]), often without consistent pronation." },
      { id: "c", text: "A functional weakness sign", tag: "misconception", feedback: "The functional pattern is [[drift-without-pronation|drift without pronation]]: the arm sinks with the palm still facing up. Pronation is the corticospinal pattern." },
      { id: "d", text: "A normal finding, because strength is full on individual testing", tag: "unsafe-priority", feedback: "Drift can be the only sign of mild upper motor neuron weakness. Manual testing misses mild weakness, especially in a strong examiner's hands." },
    ],
    rationale:
      "In a [[pronator-drift|pronator drift]] test, the patient holds both arms out with palms up and eyes closed. Mild corticospinal weakness affects the supinators and the arm extensors more than their opponents ([[pyramidal-weakness|pyramidal weakness]]), so the forearm turns palm down and the arm sinks. Closing the eyes removes visual correction. It is often more sensitive than grading individual muscles, which can miss mild weakness. Drift without pronation suggests a functional cause, and wandering or upward drift points to sensory or cerebellar problems.",
    sources: [CURRIC, DAUM],
  }),
  mcq({
    id: "m-msx-l5",
    skill: "localization",
    difficulty: 2,
    presentation: "weak-toe-extension",
    usage: ["lesson", "review"],
    vignette:
      "A 44-year-old has had low back pain radiating down the right leg for two weeks. On examination, right ankle dorsiflexion is 4/5 and right great toe extension is 3/5. Hip flexion, knee extension, and ankle plantarflexion are 5/5. The knee and ankle reflexes are normal and equal on both sides.",
    stem: "Which root does this pattern fit best?",
    options: [
      { id: "a", text: "L5", correct: true, feedback: "Right. Great toe extension is the most specific L5 muscle in the core set, and ankle dorsiflexion is L4 to L5. L5 has no routinely tested reflex, so normal reflexes fit." },
      { id: "b", text: "S1", tag: "knowledge-gap", feedback: "S1 weakens ankle plantarflexion and usually reduces the ankle reflex. Both are normal here." },
      { id: "c", text: "L3", tag: "knowledge-gap", feedback: "L3 supplies hip flexion and knee extension, and contributes to the knee reflex. All are normal." },
      { id: "d", text: "None: normal reflexes exclude a radiculopathy", tag: "misconception", feedback: "Each common reflex covers only some roots. L5 is not represented by the knee or ankle reflex, so an L5 radiculopathy often has normal reflexes." },
    ],
    reasoning: {
      stem: "Why are normal reflexes unhelpful here?",
      options: [
        { id: "r1", text: "No commonly tested reflex depends mainly on L5", correct: true },
        { id: "r2", text: "Reflexes are always normal in the first few weeks of a radiculopathy", feedback: "A compressed root can reduce its reflex early. The point is which root the reflex tests." },
        { id: "r3", text: "Reflexes only test upper motor neurons", feedback: "The tendon reflex arc is sensory fiber, root, cord segment, and lower motor neuron, so root lesions can reduce it." },
      ],
    },
    rationale:
      "Testing a core set of muscles, each with a dominant root, turns a strength examination into a [[myotome|myotome]] map: hip flexion L2 to L3, knee extension L3 to L4, ankle dorsiflexion L4 to L5, great toe extension L5, and ankle plantarflexion S1. Combine that with reflexes: the knee reflex tests L3 to L4 and the ankle reflex S1, so a pure L5 lesion may leave both normal. To separate an L5 root lesion from a common fibular nerve lesion, test ankle inversion and hip abduction, which share the L5 root but not that nerve.",
    sources: [CURRIC, ISNCSCI],
  }),

  // ---------------- l-msx-reflex-sensory ----------------
  mcq({
    id: "m-msx-reflex-grade",
    skill: "interpretation",
    difficulty: 2,
    presentation: "brisk-symmetric-reflexes",
    usage: ["lesson", "review"],
    vignette:
      "A 24-year-old student is examined before a minor operation. She is anxious. Her biceps, triceps, knee, and ankle reflexes are all brisk and equal on the two sides, without spread to other muscles. There is no clonus, plantar responses are flexor, tone and strength are normal, and she has no symptoms.",
    stem: "What is the best interpretation of her reflexes?",
    options: [
      { id: "a", text: "Brisk but symmetric reflexes with no other upper motor neuron signs can be normal; record them and look for asymmetry or associated signs", correct: true, feedback: "Right. Reflex briskness varies widely between healthy people. Asymmetry, spread, sustained clonus, and an extensor plantar carry far more weight." },
      { id: "b", text: "Bilateral [[hyperreflexia|hyperreflexia]] that needs urgent spinal imaging", tag: "unsafe-priority", feedback: "Without asymmetry, clonus, spread, extensor plantars, weakness, or symptoms, symmetric brisk reflexes alone do not justify urgent imaging." },
      { id: "c", text: "Grade 4 reflexes, which are always abnormal", tag: "terminology", feedback: "On the NINDS scale grade 4 means enhanced reflexes, including clonus. Hers are brisk without clonus or spread." },
      { id: "d", text: "The reflexes cannot be interpreted until reinforcement is used", tag: "misconception", feedback: "Reinforcement brings out reflexes that are hard to obtain. These are easy to obtain already." },
    ],
    rationale:
      "Reflexes are graded on a 0 to 4 scale. On the NINDS scale, 0 is absent, 1 is reduced (including a trace or a reflex present only with reinforcement), 2 is in the lower half of normal, 3 is in the upper half of normal, and 4 is enhanced, including clonus. Normal people range from 1 to 3, and agreement between examiners on the exact grade is only moderate. What matters most is comparing the two sides at the same moment and looking for the company the reflex keeps: spread to other muscles, sustained [[clonus|clonus]], an extensor plantar, or a [[hoffmann-sign|Hoffmann sign]].",
    sources: [NINDS, CURRIC],
  }),
  mcq({
    id: "m-msx-reinforce",
    skill: "history-exam",
    difficulty: 1,
    presentation: "absent-ankle-jerks-first-try",
    usage: ["lesson", "review"],
    vignette:
      "A 38-year-old with numb toes is examined. He is tense and sitting with his legs pressed together. You cannot obtain either ankle reflex on the first attempt.",
    stem: "What should you do before recording the ankle reflexes as absent?",
    options: [
      { id: "a", text: "Reposition him relaxed with the foot slightly dorsiflexed, and retest while he hooks his fingers together and pulls them apart as you strike", correct: true, feedback: "Right. Relaxation, a slight stretch of the muscle, and reinforcement (the [[jendrassik-maneuver|Jendrassik maneuver]]) bring out a reflex that is present but hard to obtain." },
      { id: "b", text: "Record [[areflexia|absent ankle reflexes]] and request nerve conduction studies", tag: "unsafe-priority", feedback: "A reflex should be called absent only after good positioning and reinforcement. Premature recording sends the workup in the wrong direction." },
      { id: "c", text: "Strike the tendon much harder until it responds", tag: "weak-reasoning", feedback: "Force is not the issue. A crisp tap on a slightly stretched tendon in a relaxed patient, with reinforcement, is what works." },
      { id: "d", text: "Test the plantar response instead, since it replaces the ankle reflex", tag: "misconception", feedback: "The plantar response tests a different reflex and answers a different question (corticospinal tract), not the S1 reflex arc." },
    ],
    rationale:
      "A tendon reflex is a stretch reflex: tapping the tendon stretches the muscle spindles, and the signal runs through the sensory fiber, the root, the cord segment, and back out through the lower motor neuron. Tension in the muscle or its opponents, or a slack muscle, can suppress it. Reinforcement, such as pulling the hooked fingers apart for leg reflexes or clenching the teeth or the opposite fist for arm reflexes, timed with the strike, increases excitability and brings out a reflex that is present. On the NINDS scale, a reflex obtained only with reinforcement is graded 1.",
    sources: [NINDS, CURRIC],
  }),
  mcq({
    id: "m-msx-plantar",
    skill: "interpretation",
    difficulty: 2,
    presentation: "ticklish-plantar",
    usage: ["lesson", "review", "challenge"],
    vignette:
      "A 51-year-old has had a month of tingling in both legs. When you firmly stroke the outer edge of the right sole with a key, she pulls the whole leg away, the hip and knee flex, and the toes seem to lift. She says she is very ticklish.",
    stem: "What is the best next step?",
    options: [
      { id: "a", text: "Record the response as equivocal and repeat with a lighter stimulus, watching the first movement of the great toe, or stroke the outer side of the foot below the ankle instead", correct: true, feedback: "Right. Withdrawal obscures the response. A gentler stroke, a relaxed foot, and an alternative site help show what the great toe does first." },
      { id: "b", text: "Record a right [[babinski-sign|Babinski sign]]", tag: "weak-reasoning", feedback: "Toe lift as part of a withdrawal of the whole leg is not a reliable extensor plantar response. The sign is extension of the great toe as its first movement." },
      { id: "c", text: "Record a flexor plantar response, since withdrawal means the reflex is normal", tag: "misconception", feedback: "Withdrawal tells you she felt it, not which way the great toe moves. The question remains open." },
      { id: "d", text: "Stroke harder with a sharp object so the response is clearer", tag: "unsafe-priority", feedback: "A painful or sharp stimulus increases withdrawal and can injure the skin. A firm but not painful stroke with a blunt object is enough." },
    ],
    rationale:
      "The plantar response is tested by stroking the outer edge of the sole from the heel toward the little toe and then curving across the ball of the foot, with a blunt object, firmly but not painfully. The normal response is flexion of the great toe. Extension of the great toe as the first movement, often with fanning of the other toes, is the extensor plantar response ([[babinski-sign|Babinski sign]]). Voluntary withdrawal in ticklish patients is the commonest confounder. Stroking the outer side of the foot below the ankle (the Chaddock maneuver) elicits the same response and is often less ticklish. A response that cannot be classified should be recorded as equivocal, not forced into normal or abnormal.",
    sources: [CURRIC],
  }),
  free({
    id: "m-msx-s1",
    skill: "localization",
    difficulty: 2,
    presentation: "calf-weakness-absent-ankle-jerk",
    usage: ["lesson", "review", "challenge"],
    vignette:
      "A 47-year-old has had pain from the left buttock down the back of the leg to the outer foot since lifting a heavy box. He can walk on his heels, but he cannot rise onto the toes of his left foot repeatedly while standing on that leg alone. The left ankle reflex is absent even with reinforcement; the right ankle reflex and both knee reflexes are normal. Pinprick is reduced along the outer edge of the left foot.",
    stem: "Which nerve root is most likely affected?",
    placeholder: "Name the root",
    answer: {
      full: [c("s1", "S1 root", ["s1", "s1 root", "s1 nerve root", "first sacral root", "first sacral", "s1 radiculopathy"])],
      partial: [
        { concept: c("l5s1", "L5 or S1 without committing", ["l5 s1", "l5/s1", "l5-s1"]), credit: 0.5, feedback: "The L5-S1 disc level often compresses the S1 root, but the question asks for the root. Weak plantarflexion, an absent ankle reflex, and outer foot numbness are S1." },
        { concept: c("sciatic", "Sciatic nerve", ["sciatic nerve", "sciatica"]), credit: 0.3, feedback: "Sciatica describes the pain, and the S1 fibers do run in the sciatic nerve, but a sciatic nerve lesion would also weaken dorsiflexion. He can walk on his heels, so the pattern is a single root: S1." },
      ],
      wrong: [
        { concept: c("l5", "L5 root", ["l5", "l5 root", "fifth lumbar"]), tag: "knowledge-gap", feedback: "L5 weakens ankle dorsiflexion and great toe extension and usually spares the ankle reflex. Heel walking is normal here." },
        { concept: c("l4", "L4 root", ["l4", "l4 root", "fourth lumbar"]), tag: "knowledge-gap", feedback: "L4 weakens knee extension and reduces the knee reflex. Both are normal here." },
      ],
    },
    modelAnswer: "S1 root: weak left ankle plantarflexion, absent left ankle reflex, and reduced sensation on the outer foot.",
    rationale:
      "Three findings point to one root. Ankle plantarflexion is an S1 [[myotome|myotome]] muscle, and the calf is so strong that manual testing misses mild weakness, which is why repeated single-leg toe raises are used. The ankle reflex depends mainly on S1. The outer edge of the foot is the S1 [[dermatome|dermatome]]. Normal heel walking and knee reflexes argue against L4 and L5. Reflex roots to remember: biceps C5 to C6, brachioradialis C6, triceps C7, knee L3 to L4, ankle S1.",
    sources: [CURRIC, ISNCSCI],
  }),
  loc({
    id: "m-msx-cord-loc",
    skill: "localization",
    difficulty: 3,
    presentation: "arm-wasting-brisk-legs",
    usage: ["review", "challenge"],
    vignette:
      "A 68-year-old has had neck stiffness and a year of clumsy hands and stiff legs. Both biceps muscles are wasted, shoulder abduction and elbow flexion are 4/5 on both sides, and both biceps and brachioradialis reflexes are reduced. Triceps reflexes are brisk. Both knee reflexes are brisk with spread to the opposite adductors, there are several beats of ankle clonus on each side, the plantar responses are extensor, and Hoffmann signs are present on both sides. He has had urinary urgency for three months.",
    stem: "Where is the lesion most likely to be?",
    correct: ["cord-cervical"],
    partial: [
      { region: "root", credit: 0.3, feedback: "C5 to C6 root compression would explain the arm wasting, weakness, and reduced biceps and brachioradialis reflexes, but not the brisk reflexes, clonus, extensor plantars, and urinary urgency below that level." },
      { region: "anterior-horn", credit: 0.2, feedback: "Motor neuron disease mixes lower and upper motor neuron signs, but it does not cause bladder symptoms, and the clean change from reduced to brisk reflexes at one segmental level points to a structural cord lesion." },
    ],
    rationale:
      "A focal cervical cord lesion gives lower motor neuron signs at the level of the lesion (here C5 to C6: wasting and weakness of deltoid and biceps, reduced biceps and brachioradialis reflexes) and upper motor neuron signs below it (brisk triceps, knee, and ankle reflexes with clonus, extensor plantars, Hoffmann signs, and bladder urgency). Reading the reflex roots from the top down finds the level where reflexes change from reduced to brisk. This pattern is typical of cervical spondylotic myelopathy. A sensory level should be looked for, though in the neck it can be hard to define.",
    sources: [CURRIC, IYER],
  }),
  tests({
    id: "m-msx-dc-tests",
    skill: "history-exam",
    difficulty: 2,
    presentation: "numb-feet-unsteady-dark",
    usage: ["lesson", "review"],
    vignette:
      "A 62-year-old has numb feet and has been unsteady in the dark for six months. You suspect loss of large-fiber sensation (the dorsal column pathway) and want to examine it at the bedside.",
    stem: "Sort these bedside tests.",
    options: [
      { id: "a", label: "Vibration with a 128 Hz tuning fork, starting at the great toe and moving up to the ankle, knee, and hip if absent", category: "necessary", why: "Vibration travels in the dorsal columns; starting distally finds the length-dependent pattern and its upper limit." },
      { id: "b", label: "Joint position sense at the great toe, with small up and down movements while the eyes are closed", category: "necessary", why: "Proprioception is the dorsal column modality most directly linked to unsteadiness." },
      { id: "c", label: "Romberg test", category: "necessary", why: "Steady with eyes open but unsteady with eyes closed shows that vision is compensating for lost proprioception." },
      { id: "d", label: "Pinprick and cold, from the toes upward", category: "reasonable", why: "Testing spinothalamic modalities shows whether the loss is selective or affects all modalities, which helps separate a neuropathy pattern from a cord pattern." },
      { id: "e", label: "Ankle reflexes", category: "reasonable", why: "Reduced or absent ankle reflexes point to a peripheral nerve or root cause rather than an isolated dorsal column lesion." },
      { id: "f", label: "Testing smell with scented sticks", category: "unnecessary", why: "Smell does not use the spinal sensory pathways and does not answer this question." },
      { id: "g", label: "Pinprick with a hypodermic needle, reused between patients", category: "harmful", why: "A sharp reusable needle can break the skin and spread infection; use a new disposable pin for each patient." },
    ],
    rationale:
      "Bedside sensory testing is organized by pathway. Vibration and joint position sense test large fibers and the [[dorsal-columns|dorsal columns]]; pinprick and temperature test small fibers and the [[spinothalamic-tract|spinothalamic tract]]. Testing both shows whether the loss is selective (as in large-fiber neuropathy or dorsal column disease) or involves all modalities. Explain each test with the eyes open on a normal area first, then test with the eyes closed, and compare sides. The [[romberg-sign|Romberg test]] adds a functional check of [[proprioception|proprioception]].",
    sources: [CURRIC],
  }),
  order({
    id: "m-msx-level-order",
    skill: "history-exam",
    difficulty: 2,
    presentation: "leg-numbness-suspected-cord",
    usage: ["lesson", "review"],
    vignette:
      "A 55-year-old has had numbness creeping up both legs for a week and now feels it at his waist. Both legs are mildly weak with brisk reflexes. You want to find out whether there is a sensory level on the trunk.",
    stem: "Put the steps for mapping a sensory level to pinprick in order. Steps in the same group can be done in either order.",
    steps: [
      { id: "demo", text: "Touch the pin to the face or upper chest and confirm he can tell sharp from blunt with his eyes closed" },
      { id: "ascend", text: "Starting at the feet, move the pin up the legs and the front of the trunk a short step at a time, on each side" },
      { id: "mark", text: "Mark where the pin first feels normally sharp on each side and match it to dermatome landmarks, such as the umbilicus or nipples" },
      { id: "sacral", text: "Test pinprick around the anus" },
      { id: "dc", text: "Test vibration and joint position sense separately in the legs" },
    ],
    order: [["demo"], ["ascend"], ["mark"], ["sacral", "dc"]],
    rationale:
      "A reference area of normal sensation, shown first, tells the patient what sharp should feel like. Then move from the abnormal area toward the normal one, because patients notice the return of normal sensation more reliably than its loss. Mark the border on each side and relate it to [[dermatome|dermatome]] landmarks (T4 at the nipples, T10 at the umbilicus). A [[sensory-level|sensory level]] points to a spinal cord lesion at or above that segment, and the lesion can lie several segments higher than the level found. Perianal sensation and the dorsal column modalities complete the picture: preserved sacral sensation means an incomplete lesion, and a split between modalities suggests which part of the cord is involved.",
    sources: [ISNCSCI, CURRIC],
  }),
];

// ===========================================================================
// Lessons
// ===========================================================================

const LESSONS: ModuleContent["lessons"] = [
  {
    id: "l-msx-motor",
    moduleId: MID,
    title: "The motor examination: inspection, tone, drift, and strength",
    concept: "A motor examination in a fixed order (look, feel tone, check drift, then grade a core set of muscles with known roots) turns weakness into a pattern you can localize.",
    minutes: 9,
    meta: meta("l-msx-motor", [CURRIC, ISNCSCI, DAUM]),
    steps: [
      {
        kind: "hook",
        title: "\"Strength 5/5 throughout\"",
        body: "A patient says his right hand has been clumsy since yesterday. The note says \"power 5/5 in all limbs.\" Yet when he holds his arms out with his eyes closed, the right palm slowly turns down and the arm sinks. The weakness was there; the examination that was done was not the one that finds it. This lesson is about the order and technique that make motor signs show themselves.",
      },
      {
        kind: "explain",
        title: "Look first, then feel the tone",
        body:
          "Inspection: with the limbs exposed and relaxed, compare the two sides. Look for wasting, especially of the hand muscles (between the thumb and index finger, the thenar eminence), the shoulder, the thigh, and the front of the shin. Watch relaxed muscles for a while in good light for [[fasciculation|fasciculations]], brief flickers under the skin. Note posture, abnormal movements, and tremor.\n\nTone is the resistance you feel when you move a relaxed limb. Ask the patient to let the limb go floppy, and move it at different speeds.\n\n[[spasticity|Spasticity]] depends on speed. Turn the forearm palm up quickly (supination) and flex and extend the elbow quickly: a catch that appears with fast movement, sometimes building and then giving way (clasp-knife), is spasticity. In the leg, lift the relaxed knee off the bed briskly: in spasticity the heel lifts with it. Then test for ankle [[clonus|clonus]] by a quick, sustained upward push of the foot.\n\n[[rigidity|Rigidity]] does not depend on speed. Move the wrist and elbow slowly through their full range: steady resistance in both directions is lead-pipe rigidity, and a ratchety feel with tremor is cogwheeling. Asking the patient to open and close the other hand makes mild rigidity easier to feel.\n\n[[hypotonia|Low tone]] feels floppy, and [[paratonia|paratonia]] feels like the patient cannot relax, resisting in proportion to your own force.",
        layers: {
          simpler: "Spasticity catches when you move fast. Rigidity feels the same whether you move fast or slow, and in both directions.",
          mechanism:
            "After an upper motor neuron lesion, the stretch reflex loses its descending inhibition, so a fast stretch, which fires the spindles hard, triggers a strong reflex contraction: the catch. Rigidity comes from the basal ganglia and raises background muscle activity in both opposing muscle groups, so it is present at any speed and in any direction.",
          compare:
            "Spasticity: speed-dependent, uneven (arm flexors and pronators, leg extensors), clasp-knife, with brisk reflexes and clonus. Rigidity: speed-independent, even in both directions, lead pipe or cogwheel, with normal reflexes and bradykinesia. Paratonia: varies with the examiner's force, seen in frontal lobe disease and dementia.",
          deeper:
            "Very early after an acute upper motor neuron lesion, tone can be low and reflexes reduced (spinal or cerebral shock), so a floppy limb in the first days does not exclude a central cause. Fasciculations in a muscle that is neither weak nor wasted are common in healthy people; with weakness and wasting they point to the lower motor neuron.",
        },
      },
      { kind: "apply", title: "Spasticity or rigidity?", itemId: "m-msx-tone" },
      {
        kind: "explain",
        title: "Pronator drift and MRC grading",
        body:
          "[[pronator-drift|Pronator drift]]: before testing single muscles, ask the patient to hold both arms straight out in front, palms up, and close the eyes. Watch for several seconds. Mild upper motor neuron weakness shows as the forearm turning palm down and the arm sinking. Drift with the palm still up suggests a functional cause ([[drift-without-pronation|drift without pronation]]), and fingers that wander with the eyes closed suggest lost position sense.\n\nThe [[mrc-scale|MRC scale]] grades each muscle:\n0: no contraction\n1: a flicker of contraction, no movement\n2: movement with gravity eliminated\n3: movement against gravity, but not against resistance\n4: movement against gravity and some resistance\n5: normal power\n\nPosition the limb so gravity is either working against the movement (to separate 3 from higher grades) or eliminated (for grades 1 and 2). Stabilize the joint above, test one movement at a time, and compare with the other side at once. Record muscle, side, and grade.\n\nPitfalls: grade 4 covers a wide range, from just beating gravity to nearly normal, which is why 4- and 4+ are often used and why describing the function helps. Strong muscles such as the quadriceps and calf can beat an examiner's arm despite real weakness, so use function: rising from a chair or squat, walking on heels and toes, repeated single-leg toe raises. Pain, poor understanding, and fatigue can cause [[give-way-weakness|give-way weakness]], which should be recorded as such, not given a grade it does not deserve.",
        layers: {
          simpler: "Can the muscle move the limb against gravity? If yes, at least 3. Can it also push against you? Then 4 or 5.",
          mechanism:
            "The grades are defined by two fixed loads: gravity and the examiner's resistance. Anything between \"beats gravity\" and \"normal\" lands in grade 4, so the scale is coarse exactly where most clinical weakness lies.",
          compare:
            "Pronator drift versus manual testing: drift is a single, sensitive screen for mild corticospinal weakness; manual testing gives the distribution, which is what localizes. Do both.",
          deeper:
            "The international spinal cord injury standards use the same 0 to 5 grading on a fixed set of key muscles, one per root, so findings can be compared over time and between examiners.",
        },
      },
      { kind: "predict", title: "Grade the arm", itemId: "m-msx-mrc-grade" },
      { kind: "apply", title: "Read the drift", itemId: "m-msx-drift" },
      {
        kind: "animation",
        title: "Where the weakness comes from",
        animation: "motor-pathway",
        preset: "umn-vs-lmn",
        caption: "Schematic of the upper and lower motor neurons. Compare what each lesion does to tone, reflexes, bulk, and the plantar response, the signs this lesson teaches you to elicit.",
        task: "Select an upper motor neuron lesion, then a lower motor neuron lesion. For each, predict what you would feel with a quick supination of the forearm and what the pronator drift test would show.",
      },
      {
        kind: "explain",
        title: "A core set of muscles and their roots",
        body:
          "Each muscle is supplied by more than one root, but each has a main one. Testing a core set makes the strength examination a [[myotome|myotome]] map.\n\nArm:\nShoulder abduction: C5\nElbow flexion: C5 to C6\nElbow extension: C7\nFinger flexion: C8\nFinger abduction: T1\n\nLeg:\nHip flexion: L2 to L3\nKnee extension: L3 to L4\nAnkle dorsiflexion: L4 to L5\nGreat toe extension: L5\nAnkle plantarflexion: S1\n\nRead the result as a pattern. Weakness in one root's muscles with matching reflex and sensory loss suggests a [[radiculopathy|radiculopathy]]. Arm extensors and leg flexors weaker than their opponents is the [[pyramidal-weakness|pyramidal pattern]]. Symmetric weakness of the shoulders and hips suggests muscle disease ([[proximal-weakness|proximal weakness]]), and weakness of the feet and hands first suggests a length-dependent neuropathy ([[distal-weakness|distal weakness]]).",
        layers: {
          simpler: "Learn one movement per root, top to bottom. Then ask which roots the weak movements share.",
          mechanism:
            "During development each limb muscle receives axons from neighboring segments through the plexus, so a single root lesion weakens several muscles partly rather than one muscle completely. That is why root weakness is often mild.",
          compare:
            "Root or nerve? Pick muscles that share a root but not a nerve. In foot drop, weak ankle inversion and hip abduction point to the L5 root; if they are strong, the common fibular nerve is more likely.",
          deeper:
            "Published myotome charts differ by a segment here and there; the spinal cord injury standards assign one key muscle to each root (for example elbow flexors C5, wrist extensors C6, elbow extensors C7). Use one chart consistently and remember the overlap.",
        },
      },
      { kind: "apply", title: "Name the root", itemId: "m-msx-l5" },
      {
        kind: "summary",
        title: "Key points",
        points: [
          "Look before you touch: wasting and fasciculations in relaxed, exposed muscles, compared side to side.",
          "Spasticity is a speed-dependent catch (fast supination, quick knee lift, clonus); rigidity is speed-independent resistance in both directions, best felt with slow movement.",
          "Pronator drift (palm turns down and arm sinks with eyes closed) is a sensitive screen for mild upper motor neuron weakness.",
          "MRC 0 to 5: gravity separates 2 from 3, resistance separates 3 from 4. Grade 4 is wide, strong muscles fool the examiner, so add functional tests.",
          "Core roots: shoulder abduction C5, elbow flexion C5 to C6, elbow extension C7, finger flexion C8, finger abduction T1; hip flexion L2 to L3, knee extension L3 to L4, dorsiflexion L4 to L5, great toe extension L5, plantarflexion S1.",
        ],
        reviewItemIds: ["m-msx-tone", "m-msx-mrc-grade", "m-msx-drift", "m-msx-l5"],
      },
    ],
  },
  {
    id: "l-msx-reflex-sensory",
    moduleId: MID,
    title: "Reflexes and sensory testing",
    concept: "Reflexes and sensation are each tested by pathway and by root or segment, so the level where they change locates the lesion.",
    minutes: 10,
    meta: meta("l-msx-reflex-sensory", [CURRIC, NINDS, ISNCSCI, IYER]),
    steps: [
      {
        kind: "hook",
        title: "The level where things change",
        body: "A man has wasted biceps, weak elbow flexion, and reduced biceps reflexes, but his triceps and knee reflexes are brisk and his toes go up. Each finding alone is a fact. Read in order from the top down, they say exactly where the lesion is: the segment where reduced turns into brisk. Reflexes and sensory testing work this way, and they only work if they are elicited properly.",
      },
      {
        kind: "explain",
        title: "Tendon reflexes: technique, grading, and roots",
        body:
          "Technique: the patient is relaxed, the limb is positioned so the muscle is slightly stretched, and you strike the tendon crisply, letting the hammer swing from the wrist. Test the same reflex on both sides one after the other, so you compare like with like.\n\nGrade each reflex. On the NINDS scale: 0 absent; 1 reduced, including a trace or a reflex present only with reinforcement; 2 lower half of normal; 3 upper half of normal; 4 enhanced, including clonus. Many clinicians use the same steps written as 0 to 4+.\n\n[[jendrassik-maneuver|Reinforcement]]: if a reflex seems absent, ask the patient to hook the fingers together and pull hard (for leg reflexes) or clench the teeth or the opposite fist (for arm reflexes) just as you strike. Call a reflex absent only after reinforcement.\n\nRoots:\nBiceps: C5 to C6\nBrachioradialis: C6\nTriceps: C7\nKnee: L3 to L4\nAnkle: S1\n\nInterpretation: reflexes vary a lot between healthy people, and examiners agree only moderately on exact grades. Weight asymmetry, spread to other muscles, sustained [[clonus|clonus]], and the company the reflex keeps (strength, tone, plantar response) more than the number itself.",
        layers: {
          simpler: "Tap, compare left with right, and if nothing happens, make the patient pull their hands apart and tap again.",
          mechanism:
            "The tap stretches the muscle spindles; the signal enters the cord through the dorsal root and excites the lower motor neurons of the same segment, which contract the muscle. Any break in that loop (sensory fiber, root, segment, motor nerve) reduces the reflex. Loss of descending inhibition from an upper motor neuron lesion makes it brisker. Reinforcement increases the excitability of the cord so a weak reflex can show.",
          compare:
            "Reduced reflex with weakness and sensory loss in one root's territory: radiculopathy. Reduced ankle reflexes first, then knees: length-dependent neuropathy. Brisk reflexes below a level, reduced at the level: cord lesion at that level. Brisk on one side with weakness: upper motor neuron lesion on the opposite side of the brain.",
          deeper:
            "Tapping the brachioradialis tendon may produce no forearm flexion but brisk finger flexion instead (the inverted supinator sign): the C5 to C6 reflex arc is interrupted while the segments below are disinhibited, a clue to a cord lesion at C5 to C6.",
        },
      },
      { kind: "predict", title: "Absent on the first try", itemId: "m-msx-reinforce" },
      { kind: "apply", title: "Brisk but symmetric", itemId: "m-msx-reflex-grade" },
      {
        kind: "explain",
        title: "The plantar response and Hoffmann sign",
        body:
          "Plantar response: with the leg relaxed and extended, stroke the outer edge of the sole with a blunt object (a key or the end of a hammer handle), from the heel toward the little toe and then curving across the ball of the foot. Firm, not painful. Watch the first movement of the great toe. Flexion (curling down) is normal after infancy. Extension of the great toe, often with fanning of the other toes, is the extensor plantar response, the [[babinski-sign|Babinski sign]]. No movement at all is recorded as no response.\n\nWithdrawal of the whole leg in a ticklish patient is the common confounder. Use a lighter stroke, reassure the patient, or stroke the outer side of the foot below the ankle (the Chaddock maneuver). If you still cannot tell, record it as equivocal.\n\n[[hoffmann-sign|Hoffmann sign]]: hold the patient's relaxed middle finger and flick the nail downward. Flexion of the thumb and index finger is a positive sign. It reflects a hyperactive finger flexor reflex and supports an upper motor neuron lesion affecting the arm, such as cervical myelopathy, particularly when it is asymmetric or comes with other upper motor neuron signs, but it can be present in healthy people with brisk reflexes.",
        layers: {
          simpler: "Stroke the outer sole: big toe down is normal, big toe up is a sign of corticospinal damage.",
          mechanism:
            "In infants the plantar stimulus triggers a flexion withdrawal pattern in which the great toe extends. As the corticospinal tract matures, the toe response switches to flexion. A corticospinal lesion releases the primitive pattern again.",
          compare:
            "A true extensor plantar response is the first movement of the great toe, reproducible, and often comes with fanning and hamstring contraction. Voluntary withdrawal is variable, involves the whole leg, and lessens with gentler stimulation.",
          deeper:
            "An extensor plantar response can also be found during deep sleep, after a seizure, and in deep coma or hypoglycemia, so interpret it in context.",
        },
      },
      { kind: "apply", title: "The ticklish sole", itemId: "m-msx-plantar" },
      {
        kind: "explain",
        title: "Sensation by modality, sensory levels, and Romberg",
        body:
          "Test by pathway. Small fibers and the [[spinothalamic-tract|spinothalamic tract]]: pinprick with a new disposable pin, and temperature with the cold metal of a tuning fork. Large fibers and the [[dorsal-columns|dorsal columns]]: vibration with a 128 Hz tuning fork placed on bone, starting at the great toe joint and moving up (ankle, knee, hip) if absent, and joint position sense, holding the sides of the great toe or finger and moving it in small steps up or down with the patient's eyes closed. Light touch travels in both and localizes less well.\n\nRules: demonstrate each test on a normal area with the eyes open, then test with the eyes closed. Compare side to side. Move from the abnormal area toward the normal one, because the return of normal sensation is easier to judge than its loss.\n\nPatterns: one root's [[dermatome|dermatome]] (root), a glove and stocking distribution (length-dependent neuropathy), one side of the body (brain or brainstem), or a horizontal border on the trunk below which sensation is reduced (a [[sensory-level|sensory level]], spinal cord). To map a level, start at the feet, work upward on the front of the trunk on each side, mark the border, and relate it to landmarks: T4 at the nipples, T10 at the umbilicus. Then test perianal sensation and the dorsal column modalities.\n\nThe [[romberg-sign|Romberg test]] belongs here as a test of [[proprioception|proprioception]]: steady with feet together and eyes open, unsteady once the eyes close. Its technique and limits are covered with coordination.",
        layers: {
          simpler: "Pin and cold test one pathway; tuning fork and toe position test the other. Find the line where sensation comes back.",
          mechanism:
            "Spinothalamic fibers cross the cord within a segment or two of entering and ascend on the opposite side; dorsal column fibers ascend on the same side and cross in the medulla. Testing both modalities on both sides shows whether a cord lesion involves one half, the back, the front, or all of the cord.",
          compare:
            "Vibration and position lost with pinprick preserved: dorsal columns or large-fiber neuropathy. Pinprick and temperature lost with vibration preserved: spinothalamic tract or small-fiber neuropathy. All modalities lost below a level: a complete or near-complete cord lesion.",
          deeper:
            "A sensory level marks a lesion at or above that segment, and the lesion can be several segments higher than the level found, so imaging should include the cord above it. Preserved perianal sensation (sacral sparing) means the cord lesion is incomplete.",
        },
      },
      { kind: "apply", title: "Test the dorsal columns", itemId: "m-msx-dc-tests" },
      { kind: "apply", title: "Map the level", itemId: "m-msx-level-order" },
      { kind: "apply", title: "Root from reflex and weakness", itemId: "m-msx-s1" },
      {
        kind: "summary",
        title: "Key points",
        points: [
          "Reflexes: relaxed patient, slightly stretched muscle, crisp tap, compare sides at once. Grade 0 to 4; call a reflex absent only after reinforcement.",
          "Reflex roots: biceps C5 to C6, brachioradialis C6, triceps C7, knee L3 to L4, ankle S1. L5 has no routinely tested reflex.",
          "Symmetric brisk reflexes alone can be normal; asymmetry, spread, sustained clonus, extensor plantars, and Hoffmann signs carry the weight.",
          "Plantar response: watch the first movement of the great toe; withdrawal makes it equivocal, so retest gently or use the outer foot.",
          "Pinprick and temperature test the spinothalamic tract; vibration and joint position test the dorsal columns. Map a sensory level from abnormal to normal, then check perianal sensation.",
        ],
        reviewItemIds: ["m-msx-reinforce", "m-msx-reflex-grade", "m-msx-plantar", "m-msx-dc-tests", "m-msx-level-order", "m-msx-s1", "m-msx-cord-loc"],
      },
    ],
  },
];

// ===========================================================================
// Glossary additions (ids not in the main glossary or other modules)
// ===========================================================================

const TERMS: ModuleContent["terms"] = [
  term("mrc-scale", "MRC scale", ["MRC grade", "Medical Research Council scale", "manual muscle testing grade"],
    "A 0 to 5 score for how strong a muscle is.",
    "The Medical Research Council grading of muscle power: 0 no contraction, 1 flicker of contraction, 2 movement with gravity eliminated, 3 movement against gravity, 4 movement against gravity and some resistance, 5 normal. Grade 4 spans a wide range and is often subdivided (4-, 4, 4+).",
    undefined,
    "She lifts her arm against gravity but cannot resist any pressure: shoulder abduction 3/5 on the MRC scale.",
    MID, ["paresis", "plegia", "pyramidal-weakness"]),
  term("pronator-drift", "Pronator drift", ["arm drift"],
    "When an arm held out with the palm up slowly turns palm down and sinks with the eyes closed.",
    "Pronation and downward drift of the outstretched, supinated arm with the eyes closed, a sensitive sign of mild upper motor neuron weakness. Drift without pronation suggests functional weakness; wandering of the fingers suggests lost proprioception.",
    undefined,
    "With her eyes closed, her left palm turns down and the left arm sinks: left pronator drift.",
    MID, ["umn", "pyramidal-weakness", "drift-without-pronation"]),
  term("hoffmann-sign", "Hoffmann sign", ["Hoffmann reflex", "Hoffman sign"],
    "When flicking the tip of the middle finger makes the thumb and index finger bend.",
    "Flexion of the thumb and index finger when the nail of the relaxed middle finger is flicked downward. Reflects a hyperactive finger flexor reflex; supports an upper motor neuron lesion (for example cervical myelopathy), especially if asymmetric, but can occur in healthy people with brisk reflexes.",
    "HOFF-mun",
    "Flicking his right middle fingernail makes his thumb twitch inward: a right Hoffmann sign.",
    MID, ["umn", "hyperreflexia", "babinski-sign"]),
  term("jendrassik-maneuver", "Jendrassik maneuver", ["reinforcement", "reflex reinforcement"],
    "Pulling your hooked fingers apart while the doctor taps a reflex, to make the reflex easier to see.",
    "Reinforcement of tendon reflexes by an isometric contraction elsewhere, classically hooking the fingers together and pulling at the moment the leg tendon is struck; clenching the teeth or the opposite fist reinforces arm reflexes. A reflex should be recorded as absent only after reinforcement.",
    "yen-DRAH-shik",
    "His ankle reflexes appear only when he pulls his hooked fingers apart: present with reinforcement.",
    MID, ["areflexia", "tendon-reflex"]),
  term("tendon-reflex", "Tendon reflex", ["deep tendon reflex", "muscle stretch reflex", "DTR", "reflexes"],
    "The quick jerk of a muscle when its tendon is tapped with a reflex hammer.",
    "A monosynaptic stretch reflex: tapping the tendon stretches muscle spindles, and the signal passes through the sensory fiber, dorsal root, cord segment, and lower motor neuron back to the muscle. Reduced by lesions of the arc, increased by upper motor neuron lesions. Common reflexes and roots: biceps C5 to C6, brachioradialis C6, triceps C7, knee L3 to L4, ankle S1.",
    undefined,
    "The left ankle tendon reflex is absent even with reinforcement, pointing to the S1 arc.",
    MID, ["hyperreflexia", "areflexia", "jendrassik-maneuver", "myotome"]),
  term("paratonia", "Paratonia", ["gegenhalten"],
    "Stiffness when the doctor moves a limb because the person cannot let it go loose, changing with how hard the limb is pushed.",
    "Involuntary resistance to passive movement that varies with the force and speed applied by the examiner, as if the patient cannot relax; associated with frontal lobe dysfunction and dementia. Distinct from spasticity and rigidity.",
    "par-uh-TOH-nee-uh",
    "The harder the examiner pushes on his elbow, the harder it resists, and it changes from moment to moment: paratonia.",
    MID, ["spasticity", "rigidity"]),
];

// ===========================================================================
// Sources added by this module (verified on the web; see verificationNote)
// ===========================================================================

const SOURCES: ModuleContent["sources"] = [
  {
    id: NINDS,
    kind: "primary-research",
    citation: "Litvan I, Mangone CA, Werden W, et al. Reliability of the NINDS Myotatic Reflex Scale. Neurology. 1996;47(4):969-972. doi:10.1212/wnl.47.4.969",
    title: "Reliability of the NINDS Myotatic Reflex Scale",
    authors: "Litvan I, Mangone CA, Werden W, et al.",
    journal: "Neurology",
    year: 1996,
    doi: "10.1212/wnl.47.4.969",
    pmid: "8857728",
    url: "https://doi.org/10.1212/wnl.47.4.969",
    lastVerified: "2026-11-06",
    verificationNote:
      "Title, first authors, journal, year, volume, issue, pages, DOI, and PMID (8857728) confirmed on 2026-11-06 from web search results indexing the MEDLINE record (BVS/LILACS mirror of PMID 8857728) and a journal index entry. PubMed and the full text could not be opened from this environment. Cited for the 0 to 4 NINDS reflex grades and for agreement between examiners being moderate to substantial; the wording of each grade here is the standard published scale and should be checked against the article by a reviewer.",
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
      "How to elicit and grade the motor and sensory signs: inspection for wasting and fasciculations, telling spasticity from rigidity, pronator drift, MRC strength grading and its pitfalls, a core set of muscles with their roots, tendon reflex grading and roots, reinforcement, the plantar response and Hoffmann sign, sensory testing by modality, mapping a sensory level, and the Romberg test.",
    objectives: [
      ["history-exam", "Test tone and distinguish velocity-dependent spasticity from rigidity and paratonia."],
      ["history-exam", "Grade strength on the MRC scale, recognize its pitfalls, and use pronator drift and functional tests to detect mild weakness."],
      ["interpretation", "Elicit and grade tendon reflexes with reinforcement, and interpret the plantar response and Hoffmann sign."],
      ["localization", "Name the root from a pattern of weak muscles, reduced reflexes, and dermatomal sensory loss, and find the segment where reflexes change in a cord lesion."],
      ["history-exam", "Test sensation by pathway and map a sensory level from abnormal to normal."],
    ],
    prerequisites: ["f-localization"],
    lessons: ["l-msx-motor", "l-msx-reflex-sensory"],
    challengeItems: ["m-msx-tone", "m-msx-plantar", "m-msx-s1", "m-msx-cord-loc"],
    skills: ["history-exam", "interpretation", "localization"],
    minutes: 19,
    sources: [CURRIC, ISNCSCI, IYER, DAUM, NINDS],
  },
  lessons: LESSONS,
  items: ITEMS,
  terms: TERMS,
  sources: SOURCES,
};

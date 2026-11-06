// Module f-terminology: how neurological words are built, and the deficit vocabulary that is
// most often mixed up. AI draft pending clinician review. All patients are synthetic.

import type { AssessmentItem, Concept, FreeTextItem, LocalizationItem, McqItem, MultiSelectItem } from "../../shared/types";
import { meta, term, type ModuleContent } from "./types";

const MID = "f-terminology";
const CURRIC = "safdieh2019-curriculum";
const IASP = "loeser2008-iasp-terminology";

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
  // ---------------- l-term-word-building ----------------
  mcq({
    id: "m-term-myelo",
    skill: "terminology",
    difficulty: 1,
    presentation: "word-roots",
    usage: ["lesson", "review"],
    vignette: "An MRI report on a synthetic patient reads: 'Compressive [[myelopathy|myelopathy]] at C5 to C6.'",
    stem: "Taking the word apart, what is diseased?",
    options: [
      { id: "a", text: "The spinal cord", correct: true, feedback: "Correct. Myelo- (spinal cord) plus -opathy (disease of): a disorder of the spinal cord." },
      { id: "b", text: "Muscle", tag: "terminology", feedback: "Muscle disease is myopathy (myo-). One extra syllable, a different end of the neuraxis." },
      { id: "c", text: "The myelin of the peripheral nerves", tag: "misconception", feedback: "Myelin shares the same Greek root, but myelopathy means spinal cord disease. Loss of myelin is demyelination." },
      { id: "d", text: "The cervical nerve roots", tag: "terminology", feedback: "Root disease is radiculopathy (radiculo-). Root and cord can be affected together: myeloradiculopathy." },
    ],
    rationale:
      "Myelo- comes from the Greek for marrow: the spinal cord was seen as the marrow inside the spine. In neurology, myelopathy means spinal cord disease (in hematology the same root refers to bone marrow). Mixing it up with [[myopathy|myopathy]] moves the lesion from the cord to the muscle, which changes the expected signs and the tests.",
    sources: [],
  }),
  loc({
    id: "m-term-root-loc",
    skill: "localization",
    difficulty: 2,
    presentation: "radiating-arm-pain",
    usage: ["lesson", "review", "challenge"],
    vignette:
      "A 47-year-old has neck pain shooting down the back of the right arm into the middle finger, weak elbow extension, and a reduced right triceps reflex. The electrodiagnostic report concludes: 'Findings consistent with a right C7 [[radiculopathy|radiculopathy]].'",
    stem: "Where is the lesion?",
    correct: ["root"],
    partial: [
      { region: "cord-cervical", credit: 0.3, feedback: "Myelo- is the cord; radiculo- is the root. A cord lesion would bring upper motor neuron signs below the level, not an isolated reduced reflex." },
      { region: "plexus", credit: 0.3, feedback: "A brachial plexopathy can weaken several root territories, but radiculo- names the nerve root, and neck pain radiating down the arm fits a root." },
      { region: "peripheral-nerve", credit: 0.2, feedback: "A radial nerve lesion can weaken elbow extension, but the report names a root (radiculo-), and neck pain radiating along one dermatome is a root pattern." },
    ],
    rationale:
      "Radiculo- means nerve root and -opathy means disease of, so a C7 radiculopathy is a lesion of the C7 root as it leaves the spinal canal. Root lesions cause pain and sensory change in a [[dermatome|dermatome]], weakness in a [[myotome|myotome]], and loss of the reflex carried by that root: here the triceps (C7). Reading the site root of the word places the lesion before you open the images.",
    sources: [],
  }),
  free({
    id: "m-term-paraparesis",
    skill: "terminology",
    difficulty: 2,
    presentation: "cord-compression-legs",
    usage: ["lesson", "review"],
    vignette:
      "A 62-year-old has spinal cord compression at T6. She can lift each leg off the bed against gravity but not against the examiner's resistance. Both arms are strong.",
    stem: "Name this weakness pattern in one word.",
    placeholder: "One term",
    answer: {
      full: [c("paraparesis", "paraparesis", ["paraparesis", "paraparetic", "spastic paraparesis", "flaccid paraparesis"])],
      partial: [
        { concept: c("both-legs", "weakness of both legs", ["weakness of both legs", "both legs weak", "bilateral leg weakness", "weak legs"]), credit: 0.5, feedback: "Right description. The single term is [[paraparesis|paraparesis]]: para- (both legs) plus -paresis (partial weakness)." },
      ],
      wrong: [
        { concept: c("paraplegia", "paraplegia", ["paraplegia", "paraplegic"]), tag: "terminology", feedback: "Plegia means no voluntary movement. She lifts her legs against gravity, so the weakness is partial: paraparesis." },
        { concept: c("hemi", "hemiparesis", ["hemiparesis", "hemiplegia"]), tag: "terminology", feedback: "Hemi- means one side of the body (arm and leg). Both legs with normal arms is para-." },
        { concept: c("quadri", "quadriparesis", ["quadriparesis", "tetraparesis", "quadriplegia", "tetraplegia"]), tag: "terminology", feedback: "Quadri- (or tetra-) means all four limbs. Her arms are strong." },
        { concept: c("mono", "monoparesis", ["monoparesis", "monoplegia"]), tag: "terminology", feedback: "Mono- means one limb. Both legs are weak." },
      ],
    },
    modelAnswer: "Paraparesis: partial weakness of both legs.",
    rationale:
      "Neurological weakness words are built from a distribution prefix and a severity suffix. Para- means both legs; -paresis means partial weakness (MRC grades 1 to 4), while -plegia means none at all (grade 0). A thoracic cord lesion sits below the arm segments, so it weakens the legs and spares the arms.",
    sources: [],
  }),
  mcq({
    id: "m-term-proximal",
    skill: "terminology",
    difficulty: 1,
    presentation: "proximal-weakness",
    usage: ["lesson", "review"],
    vignette:
      "A 50-year-old has trouble climbing stairs, rising from a low chair, and lifting a box onto a high shelf. Grip strength and foot movements are normal. Reflexes and sensation are normal.",
    stem: "Which phrase describes the weakness most precisely?",
    options: [
      { id: "a", text: "Symmetric [[proximal-weakness|proximal weakness]] of arms and legs", correct: true, feedback: "Correct. Shoulder and hip girdle muscles are weak; the hands and feet are spared." },
      { id: "b", text: "[[distal-weakness|Distal weakness]]", tag: "terminology", feedback: "Distal means away from the trunk: hands and feet. Her grip and foot movements are normal." },
      { id: "c", text: "Weakness in a [[pyramidal-weakness|pyramidal]] distribution", tag: "terminology", feedback: "Pyramidal weakness favors arm extensors and leg flexors and comes with brisk reflexes. Her reflexes are normal and the pattern is girdle, not pyramidal." },
      { id: "d", text: "[[quadriparesis|Quadriplegia]]", tag: "terminology", feedback: "Plegia means no movement at all. She moves every limb; the weakness is partial and limited to proximal muscles." },
    ],
    rationale:
      "Proximal means close to the trunk (shoulder and hip girdles); distal means far from it (hands and feet). Symmetric proximal weakness with normal reflexes and sensation is the typical pattern of a [[myopathy|myopathy]]. Distal, symmetric weakness with sensory loss suggests a length-dependent polyneuropathy. Naming the pattern precisely is the first step to placing the lesion.",
    sources: [],
  }),
  mcq({
    id: "m-term-allodynia",
    skill: "terminology",
    difficulty: 2,
    presentation: "painful-light-touch",
    usage: ["lesson", "review"],
    vignette:
      "A 57-year-old with long-standing diabetes says the bedsheet resting on her feet is painful. When a wisp of cotton is drawn lightly across the top of her foot, she pulls away and describes burning pain.",
    stem: "Which term fits this finding best?",
    options: [
      { id: "a", text: "[[allodynia|Allodynia]]", correct: true, feedback: "Correct. Pain from a stimulus (light touch) that does not normally cause pain." },
      { id: "b", text: "[[hyperalgesia|Hyperalgesia]]", tag: "terminology", feedback: "Hyperalgesia is more pain than expected from a stimulus that is normally painful, such as a pinprick. Cotton wool is not normally painful." },
      { id: "c", text: "[[paresthesia|Paresthesia]]", tag: "terminology", feedback: "Paresthesia is an abnormal sensation that is not unpleasant, such as tingling. Burning pain from touch is more specific than that." },
      { id: "d", text: "[[hypoesthesia|Hypoesthesia]]", tag: "terminology", feedback: "Hypoesthesia is reduced sensation. She feels the cotton, and it hurts." },
    ],
    rationale:
      "The IASP pain terms separate the stimulus from the response. [[allodynia|Allodynia]] is pain caused by a stimulus that does not normally provoke pain (light touch, a bedsheet). [[hyperalgesia|Hyperalgesia]] is increased pain from a stimulus that normally provokes pain (pinprick). Both are kinds of [[dysesthesia|dysesthesia]], an unpleasant abnormal sensation. They are common in painful neuropathies and should be recorded alongside any area of reduced sensation.",
    sources: [IASP],
  }),
  multi({
    id: "m-term-prefixes",
    skill: "terminology",
    difficulty: 1,
    presentation: "word-parts",
    usage: ["lesson", "review"],
    stem: "Select every correct pairing of a word part and its meaning.",
    options: [
      { id: "a", text: "radiculo-: nerve root", correct: true },
      { id: "b", text: "myo-: muscle", correct: true },
      { id: "c", text: "hemi-: one side of the body", correct: true },
      { id: "d", text: "dys-: abnormal or impaired", correct: true },
      { id: "e", text: "-opathy: disease of", correct: true },
      { id: "f", text: "para-: one arm and one leg on the same side", tag: "terminology", feedback: "Para- means both legs. One arm and one leg on the same side is hemi-." },
      { id: "g", text: "myelo-: muscle", tag: "terminology", feedback: "Myelo- means spinal cord. Muscle is myo-." },
      { id: "h", text: "-plegia: partial weakness", tag: "terminology", feedback: "-plegia means complete loss of voluntary movement. Partial weakness is -paresis." },
      { id: "i", text: "a-: on one side only", tag: "terminology", feedback: "A- (an- before a vowel) means without or absent, as in aphasia or areflexia." },
    ],
    rationale:
      "Most neurological terms are three pieces: a distribution (mono-, hemi-, para-, quadri-), a site (encephalo-, myelo-, radiculo-, plexo-, neuro-, myo-), and an ending for severity or kind of disorder (-paresis, -plegia, -opathy, -itis). The prefixes a- (absent) and dys- (abnormal) describe function. Decoding the pieces lets you read an unfamiliar term without memorizing it.",
    sources: [],
  }),

  // ---------------- l-term-deficits ----------------
  mcq({
    id: "m-term-dysphonia",
    skill: "history-exam",
    difficulty: 1,
    presentation: "hoarse-voice",
    usage: ["lesson", "review"],
    vignette:
      "A week after neck surgery, a 48-year-old's voice is hoarse and breathy and she cannot make it loud. Her words are well chosen, every consonant is crisp, and she names, repeats, understands, and writes normally.",
    stem: "Which term describes her speech problem?",
    options: [
      { id: "a", text: "[[dysphonia|Dysphonia]]", correct: true, feedback: "Correct. The voice itself is abnormal; language and articulation are intact." },
      { id: "b", text: "[[dysarthria|Dysarthria]]", tag: "terminology", feedback: "Dysarthria is slurred or imprecise articulation. Her consonants are crisp; only the voice is affected." },
      { id: "c", text: "[[aphasia|Aphasia]]", tag: "terminology", feedback: "Aphasia is a language disorder. She names, repeats, understands, and writes normally." },
      { id: "d", text: "Apraxia of speech", tag: "terminology", feedback: "Apraxia of speech is a problem planning the movements for speech sounds, with inconsistent sound errors. Her sounds are formed normally." },
    ],
    rationale:
      "Speech has three layers that fail separately. Language (choosing and understanding words) fails in [[aphasia|aphasia]]. Articulation (shaping sounds with lips, tongue, and palate) fails in [[dysarthria|dysarthria]]. Voice (sound made by the larynx) fails in [[dysphonia|dysphonia]]. A hoarse, breathy, weak voice after neck surgery raises the question of injury to a laryngeal nerve, a branch of the vagus nerve.",
    sources: [],
  }),
  free({
    id: "m-term-apraxia",
    skill: "terminology",
    difficulty: 2,
    presentation: "cannot-mime-gestures",
    usage: ["lesson", "review", "challenge"],
    vignette:
      "A 66-year-old has had a left hemisphere stroke. He points correctly to objects named by the examiner, so he understands. Asked to show how he would brush his teeth, he rubs his finger across his teeth as if it were the brush. Asked to wave goodbye, he makes a vague, fumbling movement. Strength, sensation, and finger-to-nose testing are normal in his left arm, the arm being tested.",
    stem: "What is the term for this deficit?",
    placeholder: "One term",
    answer: {
      full: [c("apraxia", "apraxia", ["apraxia", "apraxic", "ideomotor", "limb apraxia", "dyspraxia"])],
      partial: [
        { concept: c("planning", "impaired motor planning", ["motor planning", "cannot perform learned movements", "cannot perform skilled movements"]), credit: 0.5, feedback: "Right idea. The term for failure to perform learned skilled movements despite intact strength, sensation, coordination, and comprehension is [[apraxia|apraxia]]." },
      ],
      wrong: [
        { concept: c("ataxia", "ataxia", ["ataxia", "ataxic", "dysmetria"]), tag: "terminology", feedback: "Ataxia is incoordination. His finger-to-nose testing is normal; the problem is knowing how to perform a learned act, which is apraxia." },
        { concept: c("agnosia", "agnosia", ["agnosia"]), tag: "terminology", feedback: "Agnosia is a failure to recognize. He has no trouble recognizing anything; he cannot carry out the movement." },
        { concept: c("aphasia", "aphasia", ["aphasia", "receptive aphasia"]), tag: "misconception", feedback: "He points correctly to named objects, so comprehension is intact. Failure to mime a learned act that he understands is apraxia." },
        { concept: c("weak", "weakness", ["weakness", "paresis", "hemiparesis"]), tag: "terminology", feedback: "Strength in the tested arm is normal. Apraxia is defined by failure despite normal strength." },
      ],
    },
    modelAnswer: "Apraxia (ideomotor apraxia): he cannot carry out learned skilled acts on command even though the basic motor and sensory systems work and he understands the request.",
    rationale:
      "[[apraxia|Apraxia]] is the inability to perform learned, skilled movements on command or by imitation when strength, sensation, coordination, and comprehension are adequate. Using a body part as the tool (the finger as a toothbrush) is a characteristic error. Limb apraxia usually follows dominant (most often left) hemisphere lesions and can affect both hands, which is why it is tested in the arm that is not weak.",
    sources: [],
  }),
  mcq({
    id: "m-term-agnosia",
    skill: "terminology",
    difficulty: 2,
    presentation: "object-by-touch",
    usage: ["lesson", "review"],
    vignette:
      "With his eyes closed, a 59-year-old cannot identify a key placed in his left hand. He feels it, knows which finger is touched, and has normal joint position and vibration sense in that hand. When he opens his eyes he names the key at once.",
    stem: "Which term describes his deficit?",
    options: [
      { id: "a", text: "Left [[astereognosis|astereognosis]] (a tactile [[agnosia|agnosia]])", correct: true, feedback: "Correct. Primary sensation is intact, but he cannot recognize the object by touch." },
      { id: "b", text: "Left-hand [[hypoesthesia|hypoesthesia]]", tag: "terminology", feedback: "Hypoesthesia is reduced sensation. His touch, joint position, and vibration sense are normal." },
      { id: "c", text: "[[aphasia|Aphasia]] with naming difficulty", tag: "terminology", feedback: "He names the key immediately by sight, so naming (a language function) is intact." },
      { id: "d", text: "[[apraxia|Apraxia]] of the left hand", tag: "terminology", feedback: "Apraxia is a failure to perform learned movements. The failure here is recognition, not action." },
    ],
    reasoning: {
      stem: "Which finding makes this an agnosia rather than plain sensory loss?",
      options: [
        { id: "r1", text: "Touch, joint position, and vibration sense are normal in the same hand", correct: true },
        { id: "r2", text: "He names the key when he sees it", feedback: "That rules out a naming problem (aphasia), but it does not separate agnosia from sensory loss." },
        { id: "r3", text: "The deficit is in the left hand", feedback: "Side alone does not separate agnosia from sensory loss." },
      ],
    },
    rationale:
      "An [[agnosia|agnosia]] is a failure to recognize something through one sense when that sense, attention, and naming all work. [[astereognosis|Astereognosis]] is the tactile form: the object is felt but not identified. It can only be called agnosia when primary sensation in the hand is intact; if touch or joint position is lost, failure to identify the object is just sensory loss. Astereognosis points to the contralateral parietal cortex.",
    sources: [],
  }),
  mcq({
    id: "m-term-ddk",
    skill: "terminology",
    difficulty: 1,
    presentation: "rapid-alternating",
    usage: ["lesson", "review"],
    vignette:
      "Asked to tap the palm and then the back of his right hand on his left palm as fast as he can, a 45-year-old produces slow, clumsy movements that are irregular in rhythm and force. Strength and tone in the right arm are normal.",
    stem: "Which term describes this finding?",
    options: [
      { id: "a", text: "[[dysdiadochokinesia|Dysdiadochokinesia]]", correct: true, feedback: "Correct. Impaired rapid alternating movements, a component of cerebellar ataxia." },
      { id: "b", text: "[[dysmetria|Dysmetria]]", tag: "terminology", feedback: "Dysmetria is overshooting or undershooting a target, seen on finger-to-nose testing. This task tests rapid alternation." },
      { id: "c", text: "[[intention-tremor|Intention tremor]]", tag: "terminology", feedback: "Intention tremor is a tremor that grows as the limb approaches a target. This finding is irregular alternation, not tremor." },
      { id: "d", text: "Bradykinesia", tag: "misconception", feedback: "Parkinsonian bradykinesia is slowness with a progressive fall in amplitude, usually with rigidity. Irregular rhythm and force with normal tone points to the cerebellum." },
    ],
    rationale:
      "[[ataxia|Ataxia]] is the umbrella term; the components name what fails. [[dysmetria|Dysmetria]] is inaccurate range on target-directed movement, [[intention-tremor|intention tremor]] worsens near the target, and [[dysdiadochokinesia|dysdiadochokinesia]] is impaired rapid alternating movement. Limb signs like these point to the cerebellar hemisphere on the same side as the affected limb.",
    sources: [],
  }),
  multi({
    id: "m-term-note",
    skill: "terminology",
    difficulty: 3,
    presentation: "stroke-documentation",
    usage: ["review", "challenge"],
    vignette:
      "A synthetic patient, 71, is examined three days after a left middle cerebral artery stroke. She has no movement of the right arm. She lifts the right leg against gravity but not against resistance. Her speech is slow and effortful with word-finding pauses and naming errors, but each sound is clearly formed and her voice is normal. She follows commands. Asked to show how she would use a comb, she cannot do it with her left hand, although that arm is strong, has normal sensation, and performs finger-to-nose accurately. Finger-to-nose cannot be done with the right arm.",
    stem: "A student drafts a problem list. Select every entry that uses the term correctly.",
    options: [
      { id: "a", text: "Right arm [[plegia|plegia]] with right leg [[paresis|paresis]]", correct: true },
      { id: "b", text: "Nonfluent (expressive) [[aphasia|aphasia]]", correct: true },
      { id: "c", text: "[[apraxia|Apraxia]], tested in the left hand", correct: true },
      { id: "d", text: "[[dysarthria|Dysarthria]]", tag: "terminology", feedback: "Each sound is clearly formed. Effortful speech with word-finding pauses and naming errors is a language disorder (aphasia), not an articulation disorder." },
      { id: "e", text: "Right arm [[ataxia|ataxia]]", tag: "terminology", feedback: "Ataxia is incoordination not explained by weakness. A limb with no movement cannot be tested for coordination, so ataxia cannot be documented." },
      { id: "f", text: "Right hemispatial [[neglect|neglect]]", tag: "weak-reasoning", feedback: "Nothing in the examination shows inattention to one side. Neglect must be demonstrated (for example by extinction or cancellation tasks), and it is more common after right hemisphere lesions." },
      { id: "g", text: "[[dysphonia|Dysphonia]]", tag: "terminology", feedback: "Her voice is normal. Dysphonia is a disorder of the voice produced by the larynx." },
    ],
    rationale:
      "Each term has a test. Plegia versus paresis depends on whether any movement remains. Aphasia requires a language error (naming, word finding, comprehension, repetition, writing); dysarthria requires a fault in forming sounds; dysphonia a fault in the voice. Apraxia requires failure of a learned act despite adequate strength, sensation, coordination, and comprehension, so it is tested in the strong arm. Ataxia cannot be judged in a plegic limb, and neglect is a finding to demonstrate, not to assume from the side of the stroke.",
    sources: [],
  }),
];

// ===========================================================================
// Lessons
// ===========================================================================

const LESSONS: ModuleContent["lessons"] = [
  {
    id: "l-term-word-building",
    moduleId: MID,
    title: "Building neurological words",
    concept: "Most neurological terms combine a distribution, a site, and a severity or kind of dysfunction, so they can be decoded from their parts.",
    minutes: 7,
    meta: meta("l-term-word-building", [CURRIC, IASP]),
    steps: [
      {
        kind: "hook",
        title: "Three lines on a handover list",
        body: "'Bed 4: left hemiplegia.' 'Bed 7: paraparesis, query myelopathy.' 'Bed 9: distal sensory neuropathy with allodynia.' Before you meet any of these patients, the words already tell you which limbs are affected, how badly, and roughly where the lesion sits. This lesson teaches you to read them.",
      },
      {
        kind: "explain",
        title: "How much, and where on the body",
        body:
          "Severity comes from the ending. [[paresis|-paresis]] means partial weakness: the muscle contracts, but not with full strength. [[plegia|-plegia]] means no voluntary movement at all.\n\nDistribution comes from the prefix. [[monoparesis|Mono-]]: one limb. [[hemiparesis|Hemi-]]: one side of the body (arm and leg, often the face). [[paraparesis|Para-]]: both legs. [[quadriparesis|Quadri-]] or tetra-: all four limbs.\n\nPut them together: a right hemiparesis is partial weakness of the right arm and leg; a paraplegia is complete loss of movement in both legs.",
        layers: {
          simpler: "The front of the word says which limbs; the end says how weak. Hemi plus paresis: one side, partly weak. Para plus plegia: both legs, not moving at all.",
          mechanism:
            "On the MRC scale, grade 0 is no contraction (plegia) and grades 1 to 4 are partial weakness (paresis), with 5 normal. A limb that lifts against gravity but not against resistance is grade 3: paretic, not plegic.",
          compare:
            "Distribution words describe, they do not localize on their own. Paraparesis can come from a thoracic cord lesion, a cauda equina lesion, a parasagittal brain lesion, or a severe polyneuropathy. The accompanying signs (reflexes, sensory level, tone) decide.",
          deeper:
            "Usage is looser than the definitions. Hemiplegia is often written for a dense hemiparesis, and plegic and paretic limbs can coexist, as in a right hemiparesis with a plegic arm. Write what you find limb by limb when precision matters.",
        },
      },
      { kind: "predict", title: "Decode a report", itemId: "m-term-myelo" },
      {
        kind: "explain",
        title: "Where on the neuraxis",
        body:
          "Site roots name the structure; the ending names what is wrong with it. -opathy means disease of; -itis means inflammation of.\n\nEncephalo-: brain ([[encephalopathy|encephalopathy]], [[encephalitis|encephalitis]]). Myelo-: spinal cord ([[myelopathy|myelopathy]], myelitis). Radiculo-: nerve root ([[radiculopathy|radiculopathy]]). Plexo-: plexus ([[plexopathy|plexopathy]]). Neuro-: peripheral nerve ([[neuropathy|neuropathy]]). Myo-: muscle ([[myopathy|myopathy]], myositis).\n\nRoots combine: a myeloradiculopathy affects cord and roots together. Count words describe nerves: a mononeuropathy is one nerve, a polyneuropathy many nerves at once.",
        layers: {
          simpler: "Read the middle of the word as an address: brain, cord, root, plexus, nerve, or muscle. The ending says it is diseased (-opathy) or inflamed (-itis).",
          mechanism:
            "Each site has a signature. Cord lesions give upper motor neuron signs below the level and often a [[sensory-level|sensory level]]. Root lesions follow a [[dermatome|dermatome]] and [[myotome|myotome]] and lose one reflex. Polyneuropathy is usually distal and symmetric. Myopathy is usually proximal with normal sensation.",
          compare:
            "Myelopathy and myopathy differ by two letters and by the whole length of the motor system. Myelin shares the myelo- root, but loss of myelin is called [[demyelination|demyelination]], not myelopathy.",
          deeper:
            "Myelo- comes from the Greek for marrow, which is why hematologists use it for bone marrow. In a neurology note it means the spinal cord.",
        },
      },
      { kind: "apply", title: "Read the site", itemId: "m-term-root-loc" },
      {
        kind: "explain",
        title: "Describing weakness and sensation precisely",
        body:
          "Weakness patterns: [[proximal-weakness|proximal]] (shoulder and hip girdles: trouble rising from a chair or reaching overhead), [[distal-weakness|distal]] (hands and feet: weak grip, foot drop), and [[pyramidal-weakness|pyramidal]] (arm extensors and leg flexors, from a corticospinal lesion).\n\nSensory words use the same prefixes. An- means absent: anesthesia. Hypo- means reduced: [[hypoesthesia|hypoesthesia]]. Par- names an abnormal sensation that is not unpleasant, such as tingling: [[paresthesia|paresthesia]]. Dys- names an unpleasant abnormal sensation: [[dysesthesia|dysesthesia]]. Two special cases matter at the bedside: [[allodynia|allodynia]], pain from a stimulus that is not normally painful, and [[hyperalgesia|hyperalgesia]], more pain than expected from a stimulus that is.",
        layers: {
          simpler: "Say where the weakness is (near the trunk or far from it) and what sensation is like (gone, reduced, tingling, or painful). Vague words like 'numb' can mean any of these.",
          mechanism:
            "Long nerve fibers fail first in many polyneuropathies, so weakness and sensory loss start in the feet. Muscle disease affects the large girdle muscles most, so proximal weakness dominates. Corticospinal lesions spare antigravity muscles relatively, giving the pyramidal pattern.",
          compare:
            "Paresthesia versus dysesthesia turns on whether the sensation is unpleasant. Allodynia versus hyperalgesia turns on the stimulus: allodynia if it would not normally hurt (cotton wool), hyperalgesia if it would (a pinprick).",
          deeper:
            "Record the modality as well as the word: pain and temperature travel in small fibers and the [[spinothalamic-tract|spinothalamic tract]]; vibration and joint position in large fibers and the [[dorsal-columns|dorsal columns]]. Then record the distribution: glove and stocking, dermatomal, one side of the body, or below a sensory level.",
        },
      },
      { kind: "apply", title: "Name the sensation", itemId: "m-term-allodynia" },
      {
        kind: "summary",
        title: "Key points",
        points: [
          "-paresis is partial weakness; -plegia is no voluntary movement.",
          "Mono-: one limb. Hemi-: one side. Para-: both legs. Quadri- or tetra-: all four limbs.",
          "Site roots: encephalo- brain, myelo- cord, radiculo- root, plexo- plexus, neuro- nerve, myo- muscle.",
          "Proximal weakness suggests muscle; distal symmetric weakness with sensory loss suggests polyneuropathy; pyramidal weakness suggests a corticospinal lesion.",
          "Allodynia is pain from a normally painless stimulus; hyperalgesia is extra pain from a normally painful one.",
        ],
        reviewItemIds: ["m-term-myelo", "m-term-root-loc", "m-term-allodynia", "m-term-paraparesis", "m-term-proximal", "m-term-prefixes", "p-term-1"],
      },
    ],
  },
  {
    id: "l-term-deficits",
    moduleId: MID,
    title: "Naming the deficit: speech, action, recognition, coordination",
    concept: "Deficit terms that sound alike describe different failures, and each one is confirmed by a specific bedside finding.",
    minutes: 8,
    meta: meta("l-term-deficits", [CURRIC]),
    steps: [
      {
        kind: "hook",
        title: "'I can't talk properly'",
        body: "Three patients use the same words. One slurs every syllable but writes a perfect sentence. One speaks clearly but cannot find the word 'pen'. One chooses every word well, but her voice is a hoarse whisper. Same complaint, three different terms, three different places for the lesion.",
      },
      {
        kind: "explain",
        title: "Language, articulation, voice",
        body:
          "[[aphasia|Aphasia]] is a disorder of language: word finding, naming, comprehension, repetition, reading, or writing. It points to the language network, usually in the left hemisphere.\n\n[[dysarthria|Dysarthria]] is a disorder of articulation: the words are right but poorly formed (slurred, imprecise). It can come from lesions anywhere in the motor system for speech.\n\n[[dysphonia|Dysphonia]] is a disorder of voice: hoarse, breathy, strained, or weak sound from the larynx or its nerves.\n\nAt the bedside: listen to conversation, test naming, repetition, and comprehension, ask for a written sentence, and listen separately to how sounds are formed and to the voice itself.",
        layers: {
          simpler: "Language is choosing the words. Articulation is shaping them with lips and tongue. Voice is the sound from the voice box. Aphasia, dysarthria, and dysphonia break one each.",
          mechanism:
            "Writing uses language without using the mouth. A patient who writes a correct sentence but speaks unclearly has dysarthria, not aphasia. A patient whose written sentence has the same word errors as their speech has aphasia.",
          compare:
            "Apraxia of speech is a fourth category: a problem planning speech movements, with inconsistent sound errors and effortful groping, usually from a left frontal lesion and often alongside aphasia. Dysarthria errors are consistent; apraxia of speech errors vary from attempt to attempt.",
          deeper:
            "Dysphasia is an older synonym for aphasia; many clinicians avoid it because it is easily misheard as [[dysphagia|dysphagia]] (difficulty swallowing). Dysarthria and dysphagia often occur together in [[bulbar|bulbar]] weakness because the same muscles serve both.",
        },
      },
      { kind: "predict", title: "Which layer failed?", itemId: "m-term-dysphonia" },
      {
        kind: "explain",
        title: "Action, recognition, attention",
        body:
          "These three deficits all occur with normal strength and sensation, so they are easy to mislabel.\n\n[[apraxia|Apraxia]]: failure to perform a learned, skilled movement (miming tool use, waving goodbye) on command or by imitation, despite adequate strength, sensation, coordination, and comprehension.\n\n[[agnosia|Agnosia]]: failure to recognize something through one sense when that sense works. [[astereognosis|Astereognosis]] is failure to identify an object by touch with intact touch and joint position sense.\n\n[[neglect|Neglect]]: failure to attend to one side of space or the body, most often the left side after a right hemisphere lesion. [[extinction|Extinction]] to double stimulation is a key test.",
        layers: {
          simpler: "Apraxia: knows what to do, cannot do it. Agnosia: feels or sees it, cannot recognize it. Neglect: does not notice one side at all.",
          mechanism:
            "Each is defined by exclusion first. Before calling something apraxia, show that strength, sensation, coordination, and comprehension are adequate. Before calling something agnosia, show that the sense itself works and that the patient can name the object another way.",
          compare:
            "Agnosia is not aphasia: a patient with tactile agnosia names the key as soon as he sees it. Neglect is not [[hemianopia|hemianopia]]: a patient with neglect sees a single stimulus on the affected side but misses it when both sides are stimulated together.",
          deeper:
            "Limb apraxia usually follows dominant hemisphere lesions and can affect both hands, so test the hand that is not weak. Astereognosis points to the contralateral parietal cortex. Unawareness of a deficit (anosognosia) often accompanies left neglect.",
        },
      },
      { kind: "apply", title: "Name the failure", itemId: "m-term-apraxia" },
      {
        kind: "explain",
        title: "Coordination words",
        body:
          "[[ataxia|Ataxia]] is the umbrella term: incoordination not explained by weakness. Its components name what fails.\n\n[[dysmetria|Dysmetria]]: the limb overshoots or undershoots the target (finger-to-nose, heel-to-shin). [[intention-tremor|Intention tremor]]: a tremor that grows as the limb nears the target. [[dysdiadochokinesia|Dysdiadochokinesia]]: rapid alternating movements are slow and irregular in rhythm and force. Gait ataxia: a wide-based, staggering walk with difficulty walking heel to toe.",
        layers: {
          simpler: "Ataxia means clumsy without being weak. Dysmetria misses the target, intention tremor shakes near it, and dysdiadochokinesia cannot switch back and forth smoothly.",
          mechanism:
            "The cerebellum compares intended movement with actual movement and corrects errors as they happen. Without it, movements start and stop at the wrong moment, giving overshoot, oscillation near the target, and irregular alternation.",
          compare:
            "Sensory ataxia comes from loss of joint position sense and worsens markedly with the eyes closed. Cerebellar ataxia changes little with eye closure. Weakness can make movements look clumsy, so coordination cannot be judged in a plegic limb.",
          deeper:
            "Cerebellar hemisphere lesions cause limb ataxia on the same side; midline (vermis) lesions cause gait and trunk ataxia with relatively normal limb testing.",
        },
      },
      { kind: "apply", title: "Name the component", itemId: "m-term-ddk" },
      {
        kind: "summary",
        title: "Key points",
        points: [
          "Aphasia is language, dysarthria is articulation, dysphonia is voice. A written sentence separates aphasia from the other two.",
          "Apraxia: cannot perform a learned act despite adequate strength, sensation, coordination, and comprehension.",
          "Agnosia: cannot recognize through a sense that works. Neglect: does not attend to one side.",
          "Ataxia is the umbrella; dysmetria, intention tremor, and dysdiadochokinesia are its components.",
          "Every deficit term needs its defining finding in the note.",
        ],
        reviewItemIds: ["m-term-dysphonia", "m-term-apraxia", "m-term-ddk", "m-term-agnosia", "p-term-2", "p-term-3"],
      },
    ],
  },
];

// ===========================================================================
// Glossary additions (ids not in the main glossary)
// ===========================================================================

const TERMS: ModuleContent["terms"] = [
  term("monoparesis", "Monoparesis", ["monoplegia"],
    "Weakness of a single arm or leg.",
    "Weakness confined to one limb, from a lesion of the contralateral motor cortex, or of the roots, plexus, or nerves supplying that limb. Monoplegia is complete loss of movement in one limb.",
    "mon-oh-puh-REE-sis",
    "Weakness of the left foot alone after a peroneal nerve injury: left leg monoparesis.",
    MID, ["paresis", "hemiparesis", "paraparesis"]),
  term("myelopathy", "Myelopathy", ["myelitis"],
    "A disease of the spinal cord.",
    "Any disorder of the spinal cord (compressive, inflammatory, vascular, nutritional, or other). Typically causes upper motor neuron signs below the lesion, a sensory level, and bladder involvement. Myelitis is inflammation of the cord.",
    "my-uh-LOP-uh-thee",
    "Neck pain, clumsy hands, and brisk leg reflexes suggest cervical myelopathy.",
    MID, ["radiculopathy", "sensory-level", "myopathy"]),
  term("radiculopathy", "Radiculopathy", [],
    "A problem with a nerve root where it leaves the spine.",
    "Dysfunction of a spinal nerve root, causing pain and sensory change in its dermatome, weakness in its myotome, and loss of the reflex it carries.",
    "ruh-dik-yoo-LOP-uh-thee",
    "Pain down the back of the leg with a lost ankle reflex suggests an S1 radiculopathy.",
    MID, ["dermatome", "myotome", "myelopathy", "plexopathy"]),
  term("plexopathy", "Plexopathy", [],
    "Damage to a network of nerves (plexus) between the spine and a limb.",
    "A lesion of the brachial or lumbosacral plexus, causing weakness and sensory loss that cross several root and nerve territories in one limb.",
    "plek-SOP-uh-thee",
    "Weakness and numbness across several nerve territories of one arm after a shoulder injury suggest a brachial plexopathy.",
    MID, ["radiculopathy", "neuropathy"]),
  term("neuropathy", "Neuropathy", ["peripheral neuropathy", "polyneuropathy", "mononeuropathy"],
    "Damage to the nerves outside the brain and spinal cord.",
    "Disease of peripheral nerves. A mononeuropathy affects one nerve; a polyneuropathy affects many nerves together, usually distal and symmetric, starting in the feet; mononeuritis multiplex affects several separate nerves.",
    "nyoo-ROP-uh-thee",
    "Numb feet, absent ankle reflexes, and weak toe extension suggest a length-dependent polyneuropathy.",
    MID, ["distal-weakness", "radiculopathy", "myopathy"]),
  term("proximal-weakness", "Proximal weakness", ["girdle weakness"],
    "Weakness of the muscles close to the trunk, around the shoulders and hips.",
    "Weakness of shoulder and hip girdle muscles, causing difficulty rising from a chair, climbing stairs, or reaching overhead. When symmetric with normal sensation and reflexes, it suggests myopathy (neuromuscular junction disorders can also do this).",
    undefined,
    "She needs her arms to push up from a chair but has a strong grip: proximal weakness.",
    MID, ["distal-weakness", "myopathy"]),
  term("distal-weakness", "Distal weakness", [],
    "Weakness of the muscles far from the trunk, in the hands and feet.",
    "Weakness of hand and foot muscles (grip, finger spreading, ankle dorsiflexion). When symmetric with distal sensory loss, it suggests a length-dependent polyneuropathy.",
    undefined,
    "Tripping over the toes and weak finger spreading: distal weakness.",
    MID, ["proximal-weakness", "neuropathy"]),
  term("hypoesthesia", "Hypoesthesia", ["hypesthesia", "hypoaesthesia"],
    "Reduced feeling in part of the body.",
    "Decreased sensitivity to stimulation. Anesthesia is complete loss; hypoalgesia is reduced sensitivity to painful stimuli specifically.",
    "hy-poh-es-THEE-zhuh",
    "Pinprick feels dull below the knees: hypoesthesia in a stocking distribution.",
    MID, ["paresthesia", "dysesthesia"]),
  term("paresthesia", "Paresthesia", ["paraesthesia", "pins and needles"],
    "Tingling or pins and needles that is odd but not painful.",
    "An abnormal sensation, spontaneous or evoked, that is not unpleasant. Contrast with dysesthesia, which is unpleasant.",
    "par-es-THEE-zhuh",
    "Tingling in the thumb and index finger at night: paresthesia.",
    MID, ["dysesthesia", "hypoesthesia"]),
  term("dysesthesia", "Dysesthesia", ["dysaesthesia"],
    "An unpleasant abnormal feeling, such as burning.",
    "An unpleasant abnormal sensation, spontaneous or evoked. Allodynia and hyperalgesia are special cases.",
    "dis-es-THEE-zhuh",
    "A constant burning feeling in both soles: dysesthesia.",
    MID, ["paresthesia", "allodynia", "hyperalgesia"]),
  term("allodynia", "Allodynia", [],
    "Pain from a touch that should not hurt.",
    "Pain caused by a stimulus that does not normally provoke pain, such as light touch or a bedsheet.",
    "al-oh-DIN-ee-uh",
    "Brushing the skin with cotton wool causes burning pain: allodynia.",
    MID, ["hyperalgesia", "dysesthesia"]),
  term("hyperalgesia", "Hyperalgesia", [],
    "Something that normally hurts a little hurts much more.",
    "Increased pain from a stimulus that normally provokes pain, such as a pinprick.",
    "hy-per-al-JEE-zhuh",
    "A pinprick on the affected foot is far more painful than on the other: hyperalgesia.",
    MID, ["allodynia", "dysesthesia"]),
  term("dysphonia", "Dysphonia", ["hoarseness"],
    "A hoarse, breathy, or weak voice.",
    "A disorder of voice production by the larynx (hoarse, breathy, strained, or weak), from laryngeal disease or from its nerve supply (branches of the vagus nerve). Language and articulation are normal.",
    "dis-FOH-nee-uh",
    "After neck surgery her voice is breathy and quiet but every word and sound is correct: dysphonia.",
    MID, ["dysarthria", "aphasia"]),
  term("apraxia", "Apraxia", ["limb apraxia", "ideomotor apraxia"],
    "Being unable to carry out a familiar skilled movement on request, though the body can move normally.",
    "Inability to perform learned, skilled movements on command or by imitation despite adequate strength, sensation, coordination, and comprehension. Limb apraxia usually follows dominant hemisphere lesions.",
    "uh-PRAK-see-uh",
    "He understands the request but cannot show how to use a comb, and uses his finger as the comb: apraxia.",
    MID, ["agnosia", "aphasia", "ataxia"]),
  term("agnosia", "Agnosia", [],
    "Being unable to recognize something even though the senses work.",
    "Failure to recognize stimuli through one sensory channel despite intact primary sensation, attention, and naming. Forms include visual agnosia, prosopagnosia (faces), and astereognosis (touch).",
    "ag-NOH-zhuh",
    "She describes the shape and color of a cup she sees but cannot say what it is until she touches it: visual agnosia.",
    MID, ["astereognosis", "apraxia", "neglect"]),
  term("astereognosis", "Astereognosis", ["tactile agnosia"],
    "Being unable to identify an object by feel alone, though touch works.",
    "Inability to identify an object by touch with the eyes closed, despite intact primary touch and joint position sense in that hand. Suggests a contralateral parietal cortex lesion.",
    "ay-ster-ee-og-NOH-sis",
    "He feels a coin in his right hand but cannot say what it is until he looks: right astereognosis.",
    MID, ["agnosia"]),
  term("dysdiadochokinesia", "Dysdiadochokinesia", ["dysdiadochokinesis"],
    "Clumsy, uneven back-and-forth hand movements.",
    "Impaired rapid alternating movements, which are slow and irregular in rhythm and amplitude; a component of cerebellar ataxia on the same side as the lesion.",
    "dis-dy-ad-oh-koh-kih-NEE-zhuh",
    "Patting alternately with the palm and back of the left hand is slow and irregular: left dysdiadochokinesia.",
    MID, ["ataxia", "dysmetria", "intention-tremor"]),
  term("intention-tremor", "Intention tremor", ["action tremor near target"],
    "A shake that gets worse as the hand gets close to what it is reaching for.",
    "A tremor that increases in amplitude as a limb approaches a target during a directed movement; a component of cerebellar ataxia.",
    undefined,
    "On finger-to-nose testing the finger wobbles more and more as it nears the nose: intention tremor.",
    MID, ["ataxia", "dysmetria"]),
];

// ===========================================================================
// Sources added by this module (verified on the web; see verificationNote)
// ===========================================================================

const SOURCES: ModuleContent["sources"] = [
  {
    id: IASP,
    kind: "consensus-criteria",
    citation: "Loeser JD, Treede RD. The Kyoto protocol of IASP Basic Pain Terminology. Pain. 2008;137(3):473-477. doi:10.1016/j.pain.2008.04.025",
    title: "The Kyoto protocol of IASP Basic Pain Terminology",
    authors: "Loeser JD, Treede RD",
    journal: "Pain",
    year: 2008,
    doi: "10.1016/j.pain.2008.04.025",
    pmid: "18583048",
    url: "https://doi.org/10.1016/j.pain.2008.04.025",
    lastVerified: "2026-11-06",
    verificationNote:
      "Title, authors, journal, year, volume, pages, DOI and PMID confirmed on 2026-11-06 from web search results indexing the PubMed record (18583048) and a journal reference list citing the same DOI. PubMed, doi.org, Crossref and the IASP site could not be opened from this environment. Definitions used here (allodynia, hyperalgesia, paresthesia, dysesthesia) were cross-checked against copies of the IASP pain terms list found by search; IASP updates its terminology online, so confirm current wording against the IASP terminology page.",
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
      "How neurological words are built (severity, distribution, site, and prefixes such as dys- and a-), and how to tell the commonly confused deficit terms apart from a short description: aphasia, dysarthria, dysphonia, apraxia, agnosia, neglect, ataxia, dysmetria, and dysdiadochokinesia.",
    objectives: [
      ["terminology", "Decode and build neurological terms from their parts: paresis versus plegia; mono-, hemi-, para-, and quadri-; and the site roots myelo-, radiculo-, neuro-, and myo-."],
      ["localization", "Use the site root of a term (myelopathy, radiculopathy, neuropathy, myopathy) to place a lesion on the neuraxis."],
      ["terminology", "Describe weakness (proximal, distal, pyramidal) and altered sensation (hypoesthesia, paresthesia, dysesthesia, allodynia) with precise words."],
      ["history-exam", "Separate aphasia, dysarthria, and dysphonia from a short description of speech, using naming, writing, articulation, and voice."],
      ["terminology", "Distinguish apraxia, agnosia, and neglect, and name the components of ataxia (dysmetria, intention tremor, dysdiadochokinesia)."],
    ],
    prerequisites: [],
    lessons: ["l-term-word-building", "l-term-deficits"],
    challengeItems: ["p-term-1", "p-term-2", "m-term-root-loc", "m-term-apraxia", "m-term-note"],
    skills: ["terminology", "localization", "history-exam"],
    minutes: 15,
    sources: [CURRIC, IASP],
  },
  lessons: LESSONS,
  items: ITEMS,
  terms: TERMS,
  sources: SOURCES,
};

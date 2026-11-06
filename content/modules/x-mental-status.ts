// Module x-mental-status: a focused bedside mental status exam in order, delirium versus
// dementia at the bedside, and the language exam with aphasia classification and nondominant
// hemisphere signs. AI draft pending clinician review. All patients are synthetic.

import type { AssessmentItem, Concept, FreeTextItem, LocalizationItem, McqItem, MultiSelectItem, OrderPriorityItem } from "../../shared/types";
import { meta, term, type ModuleContent } from "./types";

const MID = "x-mental-status";
const CURRIC = "safdieh2019-curriculum";
const CAM = "inouye1990-cam";
const MOCA = "nasreddine2005-moca";

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
function order(d: Draft<OrderPriorityItem>): OrderPriorityItem {
  const { sources, modules, ...rest } = d;
  return { ...rest, format: "order-priority", modules: modules ?? [MID], version: 1, meta: meta(d.id, sources) };
}

const c = (id: string, label: string, patterns: string[]): Concept => ({ id, label, patterns });

// ===========================================================================
// Items
// ===========================================================================

const ITEMS: AssessmentItem[] = [
  // ---------------- l-mse-sequence ----------------
  mcq({
    id: "m-mse-inattentive",
    skill: "history-exam",
    difficulty: 1,
    presentation: "drowsy-ward-patient",
    usage: ["lesson", "review"],
    vignette:
      "A synthetic patient, 74, is seen on the medical ward for 'memory problems'. He keeps closing his eyes mid-sentence and needs his name repeated to stay engaged. He cannot say the months of the year backward past October. He repeats three words correctly after several attempts, and five minutes later recalls none of them.",
    stem: "What is the best interpretation of the failed delayed recall?",
    options: [
      { id: "a", text: "It cannot be interpreted as a memory deficit, because alertness and attention are impaired", correct: true, feedback: "Correct. A patient who cannot hold attention cannot be fairly tested on memory, language, or executive tasks." },
      { id: "b", text: "It shows a medial temporal (hippocampal) memory deficit", tag: "weak-reasoning", feedback: "Delayed recall depends on attention to register the words in the first place. With drowsiness and failed months backward, the memory result is not interpretable." },
      { id: "c", text: "It establishes that he has dementia", tag: "unsafe-priority", feedback: "Dementia cannot be diagnosed in a drowsy, inattentive patient. Reduced alertness and inattention point first to an acute problem such as delirium, which needs a cause found." },
      { id: "d", text: "It shows aphasia, because he could not repeat the words at first", tag: "misconception", feedback: "He eventually repeated them, and nothing suggests a language disorder. Needing several attempts to register words reflects poor attention." },
    ],
    reasoning: {
      stem: "Which finding most directly shows that attention is impaired?",
      options: [
        { id: "r1", text: "He cannot say the months of the year backward", correct: true },
        { id: "r2", text: "He recalls none of the three words at five minutes", feedback: "That is the finding being questioned. Failed recall has many causes, including poor attention." },
        { id: "r3", text: "He is 74 years old", feedback: "Age alone tells you nothing about attention." },
      ],
    },
    rationale:
      "The mental status exam is hierarchical. Level of alertness and attention come first because every later task (orientation, memory, language, visuospatial and executive function) needs the patient to attend. Months of the year backward, serial subtraction, and digit span test sustained attention. When they fail, record the inattention, interpret the rest with caution, and look for an acute cause such as [[delirium|delirium]] before labeling a memory disorder.",
    sources: [CURRIC, CAM],
  }),
  order({
    id: "m-mse-order",
    skill: "history-exam",
    difficulty: 1,
    presentation: "outpatient-cognitive-screen",
    usage: ["lesson", "review"],
    vignette: "A synthetic patient, 68, attends clinic because her family has noticed she repeats questions. You have ten minutes for a focused mental status exam.",
    stem: "Put the parts of the exam in a sensible order.",
    steps: [
      { id: "alert", text: "Note level of alertness" },
      { id: "attend", text: "Test attention (months of the year backward or digit span)" },
      { id: "orient", text: "Ask orientation to place and time" },
      { id: "register", text: "Give three words to repeat now and remember (registration)" },
      { id: "lang", text: "Test language (fluency, comprehension, repetition, naming, reading, writing)" },
      { id: "visuo", text: "Test visuospatial and executive function (clock drawing, cube copy, letter fluency)" },
      { id: "recall", text: "Ask for the three words again (delayed recall)" },
    ],
    order: [["alert"], ["attend"], ["orient", "register"], ["lang", "visuo"], ["recall"]],
    rationale:
      "Alertness and attention come first because they gate everything else: an inattentive patient fails later tasks for that reason alone. Registration must come before delayed recall, with other tasks filling the gap, so that the recall test measures retention over minutes rather than immediate repetition. Language and visuospatial or executive tasks make useful distractors in that gap.",
    sources: [CURRIC],
  }),
  mcq({
    id: "m-mse-recall",
    skill: "interpretation",
    difficulty: 2,
    presentation: "progressive-forgetfulness",
    usage: ["lesson", "review"],
    vignette:
      "A synthetic patient, 76, is alert and says the months of the year backward without error. He repeats five words immediately. After ten minutes of other testing he recalls one. Category cues do not help, and when shown a list he cannot pick out the words he was given.",
    stem: "Which pattern does this memory performance fit best?",
    options: [
      { id: "a", text: "A deficit of encoding and storage, as with medial temporal (hippocampal) dysfunction", correct: true, feedback: "Correct. Attention and registration are intact, recall fails, and neither cues nor recognition help: the information was not stored." },
      { id: "b", text: "A retrieval deficit, as with frontal-subcortical dysfunction", tag: "weak-reasoning", feedback: "A retrieval deficit improves with cues or a recognition list, because the information is stored but hard to pull up. Here neither helps." },
      { id: "c", text: "Inattention invalidating the memory test", tag: "misconception", feedback: "Attention is intact (months backward without error) and he registered all five words, so the recall failure is a genuine memory finding." },
      { id: "d", text: "A normal age-related pattern", tag: "knowledge-gap", feedback: "Normal aging may slow retrieval, but recall and recognition both failing despite good attention is not expected and needs evaluation." },
    ],
    rationale:
      "Memory testing has three stages. Registration (immediate repetition) depends mainly on attention. Delayed recall after a distraction tests whether new information was retained. Cueing and recognition separate the failure: if cues or a multiple-choice list rescue the words, they were stored but poorly retrieved, a pattern seen with frontal-subcortical dysfunction. If nothing helps, encoding or storage failed, which points to the medial temporal lobes, as in typical Alzheimer disease.",
    sources: [CURRIC],
  }),
  multi({
    id: "m-mse-screen",
    skill: "uncertainty",
    difficulty: 2,
    presentation: "screening-tool-limits",
    usage: ["review"],
    stem: "Select every statement about bedside cognitive screening tools such as the MoCA and MMSE that is accurate.",
    options: [
      { id: "a", text: "A score can be lowered by limited education, unfamiliar language, or hearing or vision loss.", correct: true },
      { id: "b", text: "A normal score does not exclude a cognitive disorder.", correct: true },
      { id: "c", text: "A low score in an inattentive, drowsy patient may reflect delirium rather than dementia.", correct: true },
      { id: "d", text: "The MoCA was designed to detect milder impairment, and it includes executive and visuospatial tasks.", correct: true },
      { id: "e", text: "A score below the cutoff establishes a diagnosis of dementia.", tag: "misconception", feedback: "These are screens. A diagnosis of dementia requires a history of decline in daily function and a full assessment, not a single score." },
      { id: "f", text: "The total score localizes the lesion.", tag: "misconception", feedback: "A total score blends many domains. The pattern of which tasks fail is more informative than the number." },
      { id: "g", text: "A screening score can replace the history from someone who knows the patient well.", tag: "weak-reasoning", feedback: "The history of change from baseline, ideally from an informant, is central to diagnosing a cognitive disorder. A score cannot show change from a baseline it never measured." },
    ],
    rationale:
      "The MMSE and MoCA are brief structured screens. The MoCA was developed to detect [[mild-cognitive-impairment|mild cognitive impairment]] in people who score in the normal range on the MMSE, and it adds executive and visuospatial items. Both are affected by education, language, culture, and sensory or motor problems, and both are lowered by inattention. Use them to document and follow performance, read the pattern of errors, and pair them with the history; do not let a total score make the diagnosis.",
    sources: [CURRIC, MOCA],
  }),

  // ---------------- l-mse-delirium ----------------
  mcq({
    id: "m-mse-postop",
    skill: "differential",
    difficulty: 1,
    presentation: "postoperative-confusion",
    usage: ["lesson", "review"],
    vignette:
      "Two days after hip surgery, a synthetic patient, 81, is described by night staff as 'pulling at lines and talking to people who are not there'. This morning she is drowsy but rousable, loses track of the conversation, and cannot count backward from 20. Her daughter says she managed her own finances and medicines until the surgery. By afternoon she is chatty and almost back to normal.",
    stem: "What is the most likely explanation for her mental state?",
    options: [
      { id: "a", text: "[[delirium|Delirium]]", correct: true, feedback: "Correct. Acute onset, fluctuating course, and inattention, with altered consciousness: the core features." },
      { id: "b", text: "Previously unrecognized [[dementia|dementia]]", tag: "weak-reasoning", feedback: "She was independent until two days ago. Dementia is a gradual decline over months to years with attention usually preserved early; this came on over hours to days and fluctuates." },
      { id: "c", text: "A new primary psychiatric disorder", tag: "unsafe-priority", feedback: "A new psychiatric diagnosis in an older adult after surgery, with inattention and drowsiness, should not be made before delirium and its medical causes are excluded." },
      { id: "d", text: "[[aphasia|Aphasia]] from a perioperative stroke", tag: "misconception", feedback: "Losing the thread of a conversation reflects inattention. Nothing here describes a language error such as paraphasias, poor naming, or impaired repetition." },
    ],
    rationale:
      "Delirium is an acute disturbance of attention and awareness that fluctuates over the day and has an underlying medical cause (drugs, infection, metabolic disturbance, pain, urinary retention, and many others). The Confusion Assessment Method captures the bedside essentials: acute onset with fluctuating course and inattention, plus either disorganized thinking or an altered level of consciousness. A lucid afternoon does not exclude it; fluctuation is part of the definition.",
    sources: [CURRIC, CAM],
  }),
  multi({
    id: "m-mse-cam",
    skill: "history-exam",
    difficulty: 2,
    presentation: "quiet-confused-inpatient",
    usage: ["lesson", "review"],
    vignette:
      "A synthetic patient, 79, admitted with pneumonia, is 'no trouble at all' according to the nurses: she lies quietly and sleeps a lot. Her son says she was sharp last week. Today she answers slowly, drifts off mid-question, cannot name the days of the week backward, and gives rambling, illogical answers about why she is in hospital. Her strength and speech articulation are normal.",
    stem: "Select every finding that supports a bedside diagnosis of delirium in this patient.",
    options: [
      { id: "a", text: "Change from a sharp baseline last week (acute onset)", correct: true },
      { id: "b", text: "Cannot name the days of the week backward (inattention)", correct: true },
      { id: "c", text: "Rambling, illogical answers (disorganized thinking)", correct: true },
      { id: "d", text: "Drowsy, drifting off mid-question (altered level of consciousness)", correct: true },
      { id: "e", text: "She is quiet and not agitated, which argues against delirium", tag: "misconception", feedback: "Hypoactive delirium (quiet, drowsy, withdrawn) is common and often missed precisely because the patient causes no trouble." },
      { id: "f", text: "Normal strength, which argues against any brain disorder", tag: "weak-reasoning", feedback: "Delirium is usually a diffuse disturbance of brain function without focal weakness. Normal strength does not argue against it." },
    ],
    rationale:
      "The Confusion Assessment Method asks four questions: acute onset and fluctuating course, inattention, disorganized thinking, and altered level of consciousness. The first two plus either of the last two support delirium. Here all four are present. Hypoactive delirium is the form most often overlooked, because a quiet patient raises no alarm; ask someone who knows the patient's baseline.",
    sources: [CAM, CURRIC],
  }),
  mcq({
    id: "m-mse-dementia-pattern",
    skill: "differential",
    difficulty: 2,
    presentation: "gradual-decline-clinic",
    usage: ["review", "challenge"],
    vignette:
      "A synthetic patient, 72, is brought to clinic by her husband. Over two years she has started missing bills, repeating stories, and getting lost driving to familiar places. Today she is fully alert, says the months backward without error, and stays engaged for the whole visit. She is oriented to place but not to date. She recalls none of three words at five minutes, and cues do not help. Her clock drawing has the numbers poorly spaced.",
    stem: "Which conclusion fits this bedside picture best?",
    options: [
      { id: "a", text: "A chronic, progressive cognitive disorder (a dementia syndrome) with prominent memory impairment, not delirium", correct: true, feedback: "Correct. Gradual decline over years, preserved alertness and attention, and impaired storage of new memories with visuospatial errors." },
      { id: "b", text: "Delirium, because she is disoriented to date", tag: "weak-reasoning", feedback: "Disorientation occurs in both. The dividing line is attention and time course: she is alert and attentive, and the decline is gradual over years." },
      { id: "c", text: "Normal aging, because she is alert and attentive", tag: "knowledge-gap", feedback: "Intact attention does not mean normal cognition. Loss of independence in bills and driving, with failed recall that cues do not rescue, is not normal aging." },
      { id: "d", text: "No conclusion is possible, because inattention invalidates the exam", tag: "misconception", feedback: "Her attention is intact (months backward without error, engaged throughout), so the memory and visuospatial results can be interpreted." },
    ],
    reasoning: {
      stem: "Which finding most clearly separates this from delirium at the bedside?",
      options: [
        { id: "r1", text: "Intact attention with a gradual decline over two years", correct: true },
        { id: "r2", text: "Disorientation to date", feedback: "Disorientation is common to delirium and dementia, so it does not separate them." },
        { id: "r3", text: "Poor clock drawing", feedback: "Clock drawing can fail in delirium too, through inattention." },
      ],
    },
    rationale:
      "Attention and time course divide delirium from dementia at the bedside. Delirium starts over hours to days, fluctuates, and impairs attention and often alertness. Dementia progresses over months to years, with alertness and attention usually preserved until later stages, and interferes with independence in daily activities. The two often coexist: dementia is a major risk factor for delirium, so a patient with known dementia who becomes acutely worse needs a search for a medical cause.",
    sources: [CURRIC, CAM],
  }),

  // ---------------- l-mse-language ----------------
  loc({
    id: "m-mse-broca-loc",
    skill: "localization",
    difficulty: 2,
    presentation: "nonfluent-aphasia-arm-weakness",
    usage: ["lesson", "review", "challenge"],
    vignette:
      "A right-handed synthetic patient, 63, wakes with speech difficulty. He speaks in short, effortful phrases, mostly nouns: 'Wife... car... hospital.' He follows one-step and two-step commands and answers yes or no questions accurately. He cannot repeat 'The boy is going to the store.' He names only two of six objects. His lower right face and right arm are weak; the leg is strong.",
    stem: "Where is the lesion?",
    correct: ["cortex-left"],
    partial: [
      { region: "subcortical-left", credit: 0.4, feedback: "Deep left hemisphere lesions can disturb language, but a nonfluent aphasia with face and arm weakness sparing the leg fits the left frontal cortex and its underlying white matter in the superior MCA territory." },
    ],
    rationale:
      "Effortful, nonfluent speech with relatively preserved comprehension and impaired repetition and naming is [[broca-aphasia|Broca aphasia]]. It localizes to the inferior frontal region of the dominant hemisphere, which is the left in nearly all right-handers. The neighboring motor cortex for the face and arm explains the right face and arm weakness; the leg area lies medially in the anterior cerebral artery territory and is spared. Patients are usually aware of their errors and frustrated by them.",
    sources: [CURRIC],
  }),
  free({
    id: "m-mse-aphasia-ft",
    skill: "localization",
    difficulty: 2,
    presentation: "fluent-nonsense-speech",
    usage: ["lesson", "review", "challenge"],
    vignette:
      "A synthetic patient, 70, is brought in because his speech 'stopped making sense' this morning. He talks easily in long, well-articulated sentences with normal rhythm, but they are full of wrong and invented words: 'I went to the plotter to get the flimmet.' He does not follow 'point to the ceiling' or other pointing commands, and he cannot repeat a short phrase. He seems unaware of any problem. Strength is normal.",
    stem: "Classify the aphasia from the fluency, comprehension, and repetition findings.",
    placeholder: "Aphasia type",
    answer: {
      full: [c("wernicke", "Wernicke aphasia", ["wernicke", "wernickes", "wernicke aphasia"])],
      partial: [
        { concept: c("receptive", "receptive or sensory aphasia", ["receptive aphasia", "receptive", "sensory aphasia"]), credit: 0.6, feedback: "Right direction, but receptive does not say whether repetition is spared. Fluent speech with poor comprehension and poor repetition is [[wernicke-aphasia|Wernicke aphasia]]." },
        { concept: c("fluent", "fluent aphasia", ["fluent aphasia"]), credit: 0.4, feedback: "Fluent is correct, but several aphasias are fluent. Poor comprehension plus poor repetition makes it [[wernicke-aphasia|Wernicke aphasia]]." },
      ],
      wrong: [
        { concept: c("broca", "Broca aphasia", ["broca", "brocas", "expressive aphasia", "nonfluent", "motor aphasia"]), tag: "misconception", feedback: "Broca aphasia is nonfluent and effortful with relatively preserved comprehension. His speech is fluent and comprehension is poor." },
        { concept: c("conduction", "conduction aphasia", ["conduction"]), tag: "weak-reasoning", feedback: "Conduction aphasia is fluent with poor repetition, but comprehension is good. He cannot follow simple commands." },
        { concept: c("tcs", "transcortical sensory aphasia", ["transcortical sensory", "transcortical"]), tag: "weak-reasoning", feedback: "Transcortical aphasias spare repetition. He cannot repeat a short phrase." },
        { concept: c("global", "global aphasia", ["global"]), tag: "weak-reasoning", feedback: "Global aphasia is nonfluent as well as impairing comprehension and repetition. His speech flows easily." },
        { concept: c("delirium", "delirium or confusion", ["delirium", "confusion", "confused", "psychosis", "psychotic"]), tag: "unsafe-priority", feedback: "Fluent nonsense speech is easily mistaken for confusion or psychosis. Paraphasias, failed comprehension, and failed repetition are a language disorder and, with sudden onset, a possible stroke." },
        { concept: c("dysarthria", "dysarthria", ["dysarthria"]), tag: "terminology", feedback: "His sentences are well articulated. The errors are in word choice and comprehension, which is aphasia." },
      ],
    },
    modelAnswer: "Wernicke aphasia: fluent speech with paraphasias, impaired comprehension, and impaired repetition, localizing to the dominant posterior superior temporal region.",
    rationale:
      "Three bedside findings classify most aphasias: fluency, comprehension, and repetition. Fluent speech with [[paraphasia|paraphasias]], poor comprehension, and poor repetition is [[wernicke-aphasia|Wernicke aphasia]], from a lesion of the dominant posterior superior temporal region (inferior division of the middle cerebral artery). Patients are often unaware of their errors and may have no weakness, so sudden 'confusion' with fluent nonsense speech should prompt a language exam and consideration of stroke.",
    sources: [CURRIC],
  }),
  mcq({
    id: "m-mse-conduction",
    skill: "localization",
    difficulty: 2,
    presentation: "cannot-repeat-phrase",
    usage: ["review"],
    vignette:
      "A synthetic patient, 58, speaks fluently and follows complex commands without difficulty. When asked to repeat 'No ifs, ands, or buts' he says 'No fits, ants, or... no ifs, bands...' and makes repeated attempts to correct himself. Naming produces similar sound errors. Reading comprehension is good.",
    stem: "Which aphasia is this?",
    options: [
      { id: "a", text: "[[conduction-aphasia|Conduction aphasia]]", correct: true, feedback: "Correct. Fluent, good comprehension, disproportionately poor repetition with sound-based (phonemic) errors and self-correction." },
      { id: "b", text: "[[wernicke-aphasia|Wernicke aphasia]]", tag: "weak-reasoning", feedback: "Wernicke aphasia impairs comprehension. He follows complex commands." },
      { id: "c", text: "Transcortical sensory aphasia", tag: "weak-reasoning", feedback: "Transcortical aphasias spare repetition. Repetition is his most impaired task." },
      { id: "d", text: "[[dysarthria|Dysarthria]]", tag: "terminology", feedback: "Dysarthria distorts sounds consistently and does not single out repetition. Substituted sounds that he recognizes and tries to correct are phonemic paraphasias, a language error." },
    ],
    rationale:
      "[[conduction-aphasia|Conduction aphasia]] is fluent with good comprehension but poor repetition, often with phonemic [[paraphasia|paraphasias]] (wrong sounds) and repeated attempts to self-correct. The classic explanation is a lesion disconnecting posterior and anterior language areas, in the dominant supramarginal gyrus or the underlying arcuate fasciculus. Testing repetition separately is what reveals it.",
    sources: [CURRIC],
  }),
  mcq({
    id: "m-mse-transcortical",
    skill: "localization",
    difficulty: 3,
    presentation: "sparse-speech-good-repetition",
    usage: ["review"],
    vignette:
      "A synthetic patient, 66, has a left frontal lesion above and in front of the language area. She rarely starts speaking and gives one or two word answers after a long delay. She follows commands well. Asked to repeat 'The children played in the park after school', she repeats it perfectly.",
    stem: "Which aphasia is this?",
    options: [
      { id: "a", text: "Transcortical motor aphasia", correct: true, feedback: "Correct. Nonfluent with good comprehension and strikingly preserved repetition." },
      { id: "b", text: "[[broca-aphasia|Broca aphasia]]", tag: "weak-reasoning", feedback: "Broca aphasia shares nonfluent speech and good comprehension, but repetition is impaired. She repeats a long sentence perfectly." },
      { id: "c", text: "[[global-aphasia|Global aphasia]]", tag: "weak-reasoning", feedback: "Global aphasia impairs comprehension and repetition. She follows commands and repeats normally." },
      { id: "d", text: "[[conduction-aphasia|Conduction aphasia]]", tag: "weak-reasoning", feedback: "Conduction aphasia is fluent with poor repetition, the opposite of what she shows." },
    ],
    rationale:
      "Preserved repetition defines the [[transcortical-aphasia|transcortical aphasias]]: the core perisylvian loop for repetition is intact, and the lesion lies around it. Transcortical motor aphasia (nonfluent, good comprehension) follows dominant frontal lesions anterior or superior to Broca area, including the supplementary motor area or the anterior watershed. Transcortical sensory aphasia (fluent, poor comprehension) follows posterior watershed lesions. Mixed transcortical aphasia combines both with repetition spared.",
    sources: [CURRIC],
  }),
  mcq({
    id: "m-mse-neglect",
    skill: "localization",
    difficulty: 3,
    presentation: "left-side-ignored",
    usage: ["lesson", "review", "challenge"],
    vignette:
      "A synthetic patient, 77, eats only the food on the right half of her plate. Her speech is fluent and she names, repeats, and follows commands normally. Her eyes rest toward the right. She detects a touch on either hand alone, but reports only the right when both hands are touched together. Asked to draw a clock, she crowds all twelve numbers onto the right side. She says she has 'nothing wrong at all' despite a weak left arm.",
    stem: "Which conclusion is best supported?",
    options: [
      { id: "a", text: "Left [[neglect|neglect]] with [[anosognosia|anosognosia]], from a right (nondominant) hemisphere lesion", correct: true, feedback: "Correct. Extinction, left-sided omission on drawing, gaze toward the right, and unawareness of weakness point to the right hemisphere." },
      { id: "b", text: "Left [[hemianopia|hemianopia]] alone, from an occipital lesion", tag: "weak-reasoning", feedback: "Hemianopia does not explain extinction to touch, unawareness of a weak arm, or eye deviation. Tactile extinction shows inattention, not just a visual field loss." },
      { id: "c", text: "Aphasia from a left hemisphere lesion", tag: "misconception", feedback: "She names, repeats, and follows commands. Language is intact; the deficit is spatial attention on the left." },
      { id: "d", text: "Delirium, because she lacks insight", tag: "weak-reasoning", feedback: "Unawareness confined to a left-sided deficit, with lateralized extinction and drawing errors, is a focal nondominant hemisphere sign, not a global disturbance of attention." },
    ],
    rationale:
      "[[neglect|Neglect]] is a failure to attend to the side of space or body opposite a lesion. It is more frequent, severe, and lasting after right (nondominant) hemisphere lesions, especially parietal. Bedside signs include [[extinction|extinction]] to double simultaneous stimulation, omissions on cancellation, line bisection, or clock drawing, and [[anosognosia|anosognosia]]. Gaze often deviates toward the side of the lesion. Neglect is a safety risk and can be missed if only a structured screen is used.",
    sources: [CURRIC],
  }),
];

// ===========================================================================
// Lessons
// ===========================================================================

const LESSONS: ModuleContent["lessons"] = [
  {
    id: "l-mse-sequence",
    moduleId: MID,
    title: "A bedside mental status exam, in order",
    concept: "The mental status exam is hierarchical: alertness and attention gate every later domain, so they are tested first and recorded before anything else is interpreted.",
    minutes: 8,
    meta: meta("l-mse-sequence", [CURRIC, MOCA]),
    steps: [
      {
        kind: "hook",
        title: "'Poor memory, recalled 0 of 3'",
        body: "A note says a patient has poor memory: recalled none of three words. It does not say he was drowsy, kept losing track of the conversation, and could not say the months backward. Read alone, the note suggests dementia. Read with the missing findings, it suggests an acute problem that needs a cause found today.",
      },
      {
        kind: "explain",
        title: "Start with alertness and attention",
        body:
          "Describe the level of alertness in words: alert, drowsy but rousable to voice, or rousable only to touch or pain. A patient who is not alert cannot be tested meaningfully on anything else, and impaired consciousness belongs to the coma exam.\n\nThen test attention. Months of the year backward, serial subtraction (100 minus 7, or 20 backward for patients with less schooling), and digit span (repeating strings of digits) all ask the patient to hold and manipulate information for a short time.\n\nIf attention fails, record it, interpret the rest with caution, and think of [[delirium|delirium]] or another acute [[encephalopathy|encephalopathy]]. Inattention makes a patient fail orientation, memory, language, and drawing tasks for that reason alone.",
        layers: {
          simpler: "If the patient cannot pay attention, every other test will look bad. Check attention first, and if it is poor, say so before reporting anything else.",
          mechanism:
            "Attention depends on widespread networks: the brainstem and thalamic arousal systems and frontal and parietal cortex. Diffuse insults (drugs, infection, metabolic disturbance) disturb these networks early, which is why attention is the most sensitive bedside marker of an acute encephalopathy.",
          compare:
            "Orientation is a weak test of attention. Patients can be oriented and still inattentive, and disorientation to date occurs in both delirium and dementia. A task such as months backward separates them better.",
          deeper:
            "Serial subtraction and spelling backward depend on schooling and numeracy. Choose a task suited to the patient, and use the same one on repeat exams so changes over time mean something.",
        },
      },
      { kind: "predict", title: "Interpret the recall", itemId: "m-mse-inattentive" },
      {
        kind: "explain",
        title: "Orientation, memory, language, visuospatial and executive function",
        body:
          "Orientation: place and time (day, date, month, year).\n\nMemory: give three to five unrelated words and ask for immediate repetition (registration, which mainly tests attention). Fill the next several minutes with other tasks, then ask for the words again (delayed recall). If recall fails, offer category cues, then a list to choose from.\n\nLanguage: fluency, comprehension, repetition, naming, reading, and writing (lesson three).\n\nVisuospatial and [[executive-function|executive function]]: copy a cube or overlapping shapes, draw a clock showing a set time, generate as many words starting with one letter as possible in a minute, and alternate between numbers and letters in sequence.",
        layers: {
          simpler: "After attention: does the patient know where and when, can they learn and keep new words, can they use language, and can they draw and plan? Leave delayed recall until last so other tests fill the wait.",
          mechanism:
            "Delayed recall depends on the medial temporal lobes and their connections. If cues or a list rescue the words, they were stored but poorly retrieved (often frontal-subcortical). If nothing helps, storage failed (often medial temporal). Clock drawing and cube copying draw on parietal visuospatial function and on frontal planning.",
          compare:
            "Bedside screens package these domains. The MMSE is weighted toward orientation, memory, and language. The MoCA was designed to detect [[mild-cognitive-impairment|milder impairment]] and adds executive and visuospatial tasks. Both are screens: a score depends on education, language, culture, and sensory function, and a normal score does not exclude a disorder.",
          deeper:
            "The pattern of failure matters more than the total. Poor recall that cues do not help with poor clock drawing suggests a different process from poor letter fluency and poor sequencing with good recall. Record what was tested, what the patient did, and any factor that limits interpretation (hearing loss, limited schooling, language barrier, weakness of the dominant hand).",
        },
      },
      { kind: "apply", title: "Put the exam in order", itemId: "m-mse-order" },
      { kind: "apply", title: "Read the memory pattern", itemId: "m-mse-recall" },
      {
        kind: "summary",
        title: "Key points",
        points: [
          "Test alertness, then attention, before anything else; inattention invalidates the rest.",
          "Months backward, serial subtraction, and digit span test attention; orientation does not do it well.",
          "Registration first, other tasks in between, delayed recall last; cues and a recognition list separate storage from retrieval failure.",
          "Visuospatial and executive tests: cube copy, clock drawing, letter fluency, alternating sequences.",
          "The MoCA and MMSE are screens with limits; read the pattern, not just the score.",
        ],
        reviewItemIds: ["m-mse-inattentive", "m-mse-order", "m-mse-recall", "m-mse-screen"],
      },
    ],
  },
  {
    id: "l-mse-delirium",
    moduleId: MID,
    title: "Delirium or dementia at the bedside",
    concept: "Attention and time course separate delirium from dementia: delirium is acute, fluctuating, and inattentive, while dementia is gradual with attention preserved until later.",
    minutes: 7,
    meta: meta("l-mse-delirium", [CURRIC, CAM]),
    steps: [
      {
        kind: "hook",
        title: "Two confused patients",
        body: "Both are 80 and both are disoriented to the date. One has been forgetting appointments for two years and is alert and engaged in clinic. The other managed her own medicines until last week and today drifts off mid-sentence. The first needs a careful outpatient workup. The second needs a search for a medical cause before the day is out.",
      },
      {
        kind: "explain",
        title: "Attention is the dividing line",
        body:
          "[[delirium|Delirium]] is an acute disturbance of attention and awareness. It develops over hours to days, fluctuates through the day, and has an underlying medical cause.\n\n[[dementia|Dementia]] is a chronic, usually progressive decline in cognition severe enough to interfere with independence in daily activities. Alertness and attention are usually preserved until later stages.\n\nThe Confusion Assessment Method (CAM) turns this into four bedside questions: (1) acute onset and fluctuating course, (2) inattention, (3) disorganized thinking, (4) altered level of consciousness. Features 1 and 2 plus either 3 or 4 support delirium.",
        layers: {
          simpler: "New, up-and-down, and cannot pay attention: think delirium. Slow, steady, and can pay attention: think dementia. Ask someone who knows the patient what they were like before.",
          mechanism:
            "Delirium reflects a diffuse disturbance of the networks for arousal and attention, triggered by a systemic or brain insult: drugs (especially sedatives and anticholinergics), infection, metabolic or electrolyte disturbance, hypoxia, pain, urinary retention, withdrawal, or a primary brain process. The cause, not the confusion, is the treatment target.",
          compare:
            "Hyperactive delirium (agitated, pulling at lines) is obvious. Hypoactive delirium (quiet, drowsy, withdrawn) is common and easily missed or mistaken for depression or tiredness. Mixed forms swing between the two.",
          deeper:
            "The two overlap. Dementia is a major risk factor for delirium, and delirium can unmask an unrecognized dementia. Fluctuating attention and alertness are also a feature of dementia with Lewy bodies, so history and course matter. Do not diagnose dementia during an episode of delirium; reassess cognition once it has cleared.",
        },
      },
      { kind: "predict", title: "What is going on?", itemId: "m-mse-postop" },
      {
        kind: "explain",
        title: "Getting the history that decides it",
        body:
          "The exam shows how the patient is now; it cannot show change. For that you need someone who knows the patient: a relative, carer, or the nurse who looked after them yesterday.\n\nAsk: what were they like a month ago, a week ago, yesterday? Did it start suddenly or creep up? Is it worse at certain times of day? Were they managing finances, medicines, and shopping on their own?\n\nThen document attention explicitly (the task you used and how they did), the level of alertness, and whether thinking was organized, so that the next examiner can tell whether things are improving.",
        layers: {
          simpler: "The patient cannot tell you how they have changed. Someone who knows them can.",
          mechanism:
            "Fluctuation means a single exam can catch a good moment. Nursing observations across a shift often show the fluctuation that a brief daytime exam misses.",
          compare:
            "A gradual history over months to years with loss of independence suggests dementia. A history measured in hours or days, or a sudden worsening on top of a known dementia, suggests delirium.",
          deeper:
            "The CAM was developed so that clinicians without psychiatric training could identify delirium quickly and reliably, and it was validated against expert psychiatric assessment. It structures the bedside judgment but depends on a good attention test and a good collateral history.",
        },
      },
      { kind: "apply", title: "Apply the four features", itemId: "m-mse-cam" },
      {
        kind: "summary",
        title: "Key points",
        points: [
          "Delirium: acute onset, fluctuating course, inattention, with disorganized thinking or altered consciousness.",
          "Dementia: gradual decline over months to years affecting daily independence, with attention preserved until later.",
          "Hypoactive delirium is quiet and often missed.",
          "Dementia is a major risk factor for delirium; acute worsening in dementia needs a search for a cause.",
          "Collateral history establishes the baseline that the exam cannot.",
        ],
        reviewItemIds: ["m-mse-postop", "m-mse-cam", "m-mse-dementia-pattern"],
      },
    ],
  },
  {
    id: "l-mse-language",
    moduleId: MID,
    title: "The language exam, aphasia types, and nondominant signs",
    concept: "Fluency, comprehension, and repetition classify most aphasias and localize them within the dominant hemisphere, while neglect and anosognosia mark the nondominant hemisphere.",
    minutes: 10,
    meta: meta("l-mse-language", [CURRIC]),
    steps: [
      {
        kind: "hook",
        title: "'He's confused, he's talking nonsense'",
        body: "A man is brought in because his speech stopped making sense. He talks easily, but the words are wrong. He is not drowsy, and he does not fluctuate. He cannot follow a simple pointing command or repeat a phrase. This is not confusion: it is an aphasia, and it started this morning.",
      },
      {
        kind: "explain",
        title: "Six parts of the language exam",
        body:
          "Fluency: listen to spontaneous speech. Is it effortful, with short phrases and missing small grammatical words (nonfluent), or easy, with normal phrase length and rhythm (fluent)? Note [[paraphasia|paraphasias]]: wrong words (semantic) or wrong sounds (phonemic).\n\nComprehension: yes or no questions, then pointing commands of increasing complexity ('point to the door, then the ceiling'). Whole-body commands such as 'close your eyes' can be followed even when comprehension is poor, so use pointing tasks too.\n\nRepetition: a short phrase, then a longer sentence.\n\nNaming: common objects and their parts (a watch, its strap, its buckle).\n\nReading: aloud and for meaning. Writing: a sentence of the patient's choosing.\n\nSeparate language from speech mechanics: [[dysarthria|dysarthria]] distorts sounds but leaves word choice, comprehension, and writing normal.",
        layers: {
          simpler: "Listen, then test understanding, repeating, naming, reading, and writing. Each part can fail on its own, and the pattern tells you the type of aphasia.",
          mechanism:
            "Language depends on a network around the sylvian fissure in the dominant hemisphere, which is the left in nearly all right-handers and most left-handers. Anterior parts (inferior frontal) support fluent, grammatical output; posterior parts (superior temporal) support comprehension; connections between them, running through the supramarginal gyrus and arcuate fasciculus, support repetition.",
          compare:
            "Naming is impaired in almost every aphasia, so it confirms aphasia but does not classify it. Fluency, comprehension, and repetition do the classifying.",
          deeper:
            "Weakness of the dominant hand can limit writing, and apraxia can limit commands, so interpret those tasks with the motor exam in mind. Reading and writing errors that mirror the spoken errors confirm a language disorder rather than a motor one.",
        },
      },
      { kind: "predict", title: "Localize the aphasia", itemId: "m-mse-broca-loc" },
      {
        kind: "explain",
        title: "Classifying aphasias by fluency, comprehension, and repetition",
        body:
          "[[broca-aphasia|Broca]]: nonfluent, comprehension relatively preserved, repetition impaired. Dominant inferior frontal region; often with face and arm weakness.\n\n[[wernicke-aphasia|Wernicke]]: fluent with paraphasias, comprehension impaired, repetition impaired. Dominant posterior superior temporal region; often unaware, may have no weakness.\n\n[[conduction-aphasia|Conduction]]: fluent, comprehension good, repetition impaired with phonemic errors. Dominant supramarginal gyrus or arcuate fasciculus.\n\n[[global-aphasia|Global]]: nonfluent, comprehension and repetition impaired. Large dominant hemisphere lesion, usually with hemiparesis.\n\n[[transcortical-aphasia|Transcortical]]: repetition preserved. Motor (nonfluent, good comprehension), sensory (fluent, poor comprehension), or mixed (nonfluent, poor comprehension).\n\nAnomic aphasia: fluent, good comprehension and repetition, with word-finding and naming difficulty; the least localizing.",
        layers: {
          simpler: "Ask three questions. Is speech fluent? Does the patient understand? Can the patient repeat? The three answers point to the type.",
          mechanism:
            "Lesions that hit the perisylvian loop (Broca, Wernicke, conduction, global) impair repetition. Lesions that spare the loop but cut it off from surrounding areas (transcortical) leave repetition intact, sometimes strikingly so.",
          compare:
            "Broca and Wernicke patients differ in awareness as well as fluency: Broca patients usually know their speech is wrong and are frustrated; Wernicke patients often seem unaware, which is why their speech is mistaken for confusion or psychosis.",
          deeper:
            "Vascular territory links the types to the rest of the exam. The superior division of the dominant middle cerebral artery supplies the inferior frontal region (Broca, with face and arm weakness); the inferior division supplies the posterior temporal region (Wernicke, sometimes with a contralateral upper visual field defect). Transcortical aphasias are classically associated with watershed regions. Real patients often show mixed or evolving patterns, so describe the findings as well as the label.",
        },
      },
      {
        kind: "animation",
        title: "Language areas and vascular territory",
        animation: "vascular-territories",
        caption: "Schematic axial map of arterial territories. The language areas lie in the dominant middle cerebral artery territory; switching dominance shows how aphasia gives way to neglect.",
        task: "Select the left MCA and note the language signs, then switch dominance and compare.",
      },
      { kind: "apply", title: "Classify the aphasia", itemId: "m-mse-aphasia-ft" },
      {
        kind: "explain",
        title: "Neglect and other nondominant signs",
        body:
          "Right (nondominant) hemisphere lesions rarely cause aphasia, so they are easy to miss on a quick exam. Look for:\n\n[[neglect|Neglect]]: failure to attend to the left side of space or body. Tests: [[extinction|extinction]] to double simultaneous touch or visual stimuli, line bisection, cancellation tasks, and clock drawing with the left side omitted or numbers crowded to the right.\n\n[[anosognosia|Anosognosia]]: unawareness of a deficit such as a weak left arm.\n\nVisuospatial and constructional difficulty: poor copying of figures, getting lost, difficulty dressing.\n\nAltered prosody: flat or poorly modulated emotional tone in speech.\n\nGaze deviation toward the side of the lesion often accompanies acute neglect.",
        layers: {
          simpler: "Left hemisphere lesions usually show up in language. Right hemisphere lesions show up in attention to the left side, awareness of illness, and drawing and spatial tasks. You have to look for them.",
          mechanism:
            "The right hemisphere is thought to attend to both sides of space while the left attends mainly to the right. Damage to the right leaves no backup for the left side, which is why neglect is more frequent and severe after right hemisphere lesions.",
          compare:
            "Neglect is not [[hemianopia|hemianopia]]. A patient with hemianopia sees nothing in the affected field but knows it and turns to compensate. A patient with neglect may see a single stimulus on the left but misses it when both sides are stimulated, and is often unaware of the problem.",
          deeper:
            "Dominant parietal lesions have their own signs: the combination of difficulty writing, calculating, naming fingers, and telling left from right (Gerstmann syndrome) points to the dominant angular gyrus. Limb apraxia also usually follows dominant hemisphere lesions.",
        },
      },
      { kind: "apply", title: "Read the nondominant signs", itemId: "m-mse-neglect" },
      {
        kind: "summary",
        title: "Key points",
        points: [
          "Language exam: fluency, comprehension, repetition, naming, reading, writing.",
          "Fluency, comprehension, and repetition classify the aphasia; naming confirms aphasia but does not classify it.",
          "Broca: nonfluent, comprehends, cannot repeat. Wernicke: fluent, does not comprehend, cannot repeat. Conduction: fluent, comprehends, cannot repeat. Global: all impaired. Transcortical: repetition spared.",
          "Aphasia localizes to the dominant (usually left) hemisphere, mostly in middle cerebral artery territory.",
          "Nondominant signs: neglect, extinction, anosognosia, visuospatial difficulty, gaze deviation toward the lesion.",
        ],
        reviewItemIds: ["m-mse-broca-loc", "m-mse-aphasia-ft", "m-mse-neglect", "m-mse-conduction", "m-mse-transcortical"],
      },
    ],
  },
];

// ===========================================================================
// Glossary additions (ids not in the main glossary)
// ===========================================================================

const TERMS: ModuleContent["terms"] = [
  term("delirium", "Delirium", ["acute confusional state"],
    "A sudden state of confusion and poor attention that comes and goes, caused by an illness, drug, or other medical problem.",
    "An acute disturbance of attention and awareness that develops over hours to days, fluctuates, and has an underlying medical cause. Bedside features (Confusion Assessment Method): acute onset and fluctuating course and inattention, plus disorganized thinking or altered level of consciousness. Hyperactive, hypoactive, and mixed forms occur.",
    "dih-LEER-ee-um",
    "Two days after surgery she is drowsy, cannot say the months backward, and is lucid by the afternoon: delirium.",
    MID, ["dementia", "encephalopathy"]),
  term("dementia", "Dementia", ["major neurocognitive disorder"],
    "A gradual loss of memory and thinking that interferes with everyday life.",
    "A chronic, usually progressive decline in one or more cognitive domains, severe enough to interfere with independence in daily activities, not explained by delirium. Alertness and attention are usually preserved until later stages.",
    "dih-MEN-shuh",
    "Over two years she has started missing bills and getting lost on familiar roads, while staying alert and attentive: a dementia syndrome.",
    MID, ["delirium", "mild-cognitive-impairment"]),
  term("mild-cognitive-impairment", "Mild cognitive impairment", ["MCI"],
    "Thinking or memory problems that can be measured but do not stop a person managing everyday life.",
    "Cognitive decline greater than expected for age and education, shown on testing, with independence in daily activities largely preserved. It may remain stable, improve, or progress to dementia. The MoCA was developed to detect it.",
    undefined,
    "He notices word-finding trouble and scores below expected on testing but still runs his household: mild cognitive impairment.",
    MID, ["dementia"]),
  term("executive-function", "Executive function", ["executive functions"],
    "The thinking skills used to plan, organize, switch between tasks, and control impulses.",
    "Higher-order control of cognition and behavior (planning, sequencing, set shifting, inhibition, abstraction), relying on frontal-subcortical networks. Bedside tests include letter fluency, alternating sequences, clock drawing, and go/no-go tasks.",
    undefined,
    "She remembers the words but cannot alternate numbers and letters in sequence and generates few words beginning with F: executive dysfunction.",
    MID, ["dementia"]),
  term("paraphasia", "Paraphasia", ["paraphasic error", "phonemic paraphasia", "semantic paraphasia"],
    "Saying a wrong word or a wrongly formed word without meaning to.",
    "A language error in which a word is replaced by a related word (semantic paraphasia, 'fork' for 'spoon'), by a word with wrong sounds (phonemic paraphasia, 'spoot' for 'spoon'), or by a nonword (neologism). A sign of aphasia.",
    "par-uh-FAY-zhuh",
    "He calls a pen a 'pencil' and a watch a 'wotch': semantic and phonemic paraphasias.",
    MID, ["aphasia", "wernicke-aphasia", "conduction-aphasia"]),
  term("broca-aphasia", "Broca aphasia", ["expressive aphasia", "motor aphasia"],
    "Speech that is slow, halting, and effortful, with understanding better preserved.",
    "Nonfluent aphasia with short, effortful, grammatically simplified output, relatively preserved comprehension, and impaired repetition and naming. Localizes to the dominant inferior frontal region (superior division of the middle cerebral artery), often with contralateral face and arm weakness.",
    "BROH-kuh",
    "'Wife... car... hospital,' with good comprehension and right arm weakness: Broca aphasia.",
    MID, ["aphasia", "wernicke-aphasia", "global-aphasia"]),
  term("wernicke-aphasia", "Wernicke aphasia", ["receptive aphasia", "sensory aphasia"],
    "Speech that flows easily but makes little sense, with poor understanding of what others say.",
    "Fluent aphasia with paraphasias and neologisms, impaired comprehension, and impaired repetition, often with unawareness of the errors. Localizes to the dominant posterior superior temporal region (inferior division of the middle cerebral artery). Often mistaken for confusion or psychosis.",
    "VER-nih-kee",
    "He talks easily about 'the plotter and the flimmet', cannot follow a pointing command, and cannot repeat: Wernicke aphasia.",
    MID, ["aphasia", "broca-aphasia", "paraphasia"]),
  term("conduction-aphasia", "Conduction aphasia", [],
    "Fluent speech and good understanding, but great difficulty repeating what is said.",
    "Fluent aphasia with good comprehension and disproportionately impaired repetition, typically with phonemic paraphasias and repeated attempts at self-correction. Classically from a lesion of the dominant supramarginal gyrus or arcuate fasciculus.",
    undefined,
    "He understands everything but repeats 'no ifs, ands, or buts' as 'no fits, ants...' and keeps trying again: conduction aphasia.",
    MID, ["aphasia", "paraphasia"]),
  term("global-aphasia", "Global aphasia", [],
    "Severe loss of all parts of language: speaking, understanding, and repeating.",
    "Nonfluent aphasia with impaired comprehension, repetition, naming, reading, and writing, usually from a large dominant hemisphere lesion in the middle cerebral artery territory, typically with contralateral hemiparesis.",
    undefined,
    "After a large left MCA stroke she produces only a few sounds, follows no commands, and has a dense right hemiparesis: global aphasia.",
    MID, ["aphasia", "broca-aphasia", "wernicke-aphasia"]),
  term("transcortical-aphasia", "Transcortical aphasia", ["transcortical motor aphasia", "transcortical sensory aphasia", "mixed transcortical aphasia"],
    "A type of aphasia in which the person can still repeat words well.",
    "Aphasias with preserved repetition, from lesions that spare the perisylvian language loop: transcortical motor (nonfluent, good comprehension; dominant frontal lesions anterior or superior to Broca area), transcortical sensory (fluent, poor comprehension; posterior lesions), and mixed (nonfluent, poor comprehension). Classically associated with watershed regions.",
    undefined,
    "She barely starts speaking but repeats a long sentence perfectly: transcortical motor aphasia.",
    MID, ["aphasia", "broca-aphasia"]),
  term("anosognosia", "Anosognosia", [],
    "Being unaware of one's own illness or disability.",
    "Lack of awareness of a neurological deficit, such as denying that a paralyzed limb is weak. Most often follows right (nondominant) hemisphere lesions and commonly accompanies left neglect.",
    "an-oh-sog-NOH-zhuh",
    "With a plegic left arm, he insists there is nothing wrong: anosognosia.",
    MID, ["neglect", "extinction"]),
];

// ===========================================================================
// Sources added by this module (verified on the web; see verificationNote)
// ===========================================================================

const SOURCES: ModuleContent["sources"] = [
  {
    id: CAM,
    kind: "primary-research",
    citation: "Inouye SK, van Dyck CH, Alessi CA, Balkin S, Siegal AP, Horwitz RI. Clarifying confusion: the confusion assessment method. A new method for detection of delirium. Ann Intern Med. 1990;113(12):941-948. doi:10.7326/0003-4819-113-12-941",
    title: "Clarifying confusion: the confusion assessment method. A new method for detection of delirium",
    authors: "Inouye SK, van Dyck CH, Alessi CA, Balkin S, Siegal AP, Horwitz RI",
    journal: "Annals of Internal Medicine",
    year: 1990,
    doi: "10.7326/0003-4819-113-12-941",
    pmid: "2240918",
    url: "https://doi.org/10.7326/0003-4819-113-12-941",
    lastVerified: "2026-11-06",
    verificationNote:
      "Title, authors, journal, year, volume, issue, pages, DOI and PMID confirmed on 2026-11-06 from web search results indexing the PubMed record (2240918) and library catalog records. PubMed and doi.org could not be opened from this environment. The four-feature algorithm (acute onset and fluctuating course plus inattention, with disorganized thinking or altered level of consciousness) was cross-checked against search summaries of the abstract and a reproduced CAM table; later revisions and training manuals for the CAM exist.",
    verified: true,
  },
  {
    id: MOCA,
    kind: "primary-research",
    citation: "Nasreddine ZS, Phillips NA, Bedirian V, Charbonneau S, Whitehead V, Collin I, Cummings JL, Chertkow H. The Montreal Cognitive Assessment, MoCA: a brief screening tool for mild cognitive impairment. J Am Geriatr Soc. 2005;53(4):695-699. doi:10.1111/j.1532-5415.2005.53221.x",
    title: "The Montreal Cognitive Assessment, MoCA: a brief screening tool for mild cognitive impairment",
    authors: "Nasreddine ZS, Phillips NA, Bedirian V, Charbonneau S, Whitehead V, Collin I, Cummings JL, Chertkow H",
    journal: "Journal of the American Geriatrics Society",
    year: 2005,
    doi: "10.1111/j.1532-5415.2005.53221.x",
    pmid: "15817019",
    url: "https://doi.org/10.1111/j.1532-5415.2005.53221.x",
    lastVerified: "2026-11-06",
    verificationNote:
      "Title, full author list, journal, year, volume, issue, pages, DOI and PMID confirmed on 2026-11-06 from web search results indexing the PubMed record (15817019) and a bibliographic database entry. PubMed and doi.org could not be opened from this environment. Used here only for the tool's purpose (detecting mild cognitive impairment in people scoring in the normal range on the MMSE) and its content domains; no cutoff scores are quoted. Normative and cutoff data have been revised in later studies.",
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
      "A focused bedside mental status exam in order (alertness and attention first, then orientation, memory, language, and visuospatial and executive function), delirium versus dementia at the bedside, and the language exam with aphasia classification and nondominant hemisphere signs such as neglect.",
    objectives: [
      ["history-exam", "Perform a focused mental status exam in order, testing alertness and attention first and recognizing when inattention invalidates later findings."],
      ["differential", "Distinguish delirium from dementia at the bedside using attention, onset, and fluctuation, and recognize hypoactive delirium."],
      ["history-exam", "Examine language (fluency, comprehension, repetition, naming, reading, writing) and separate aphasia from dysarthria."],
      ["localization", "Classify Broca, Wernicke, conduction, global, and transcortical aphasias by fluency, comprehension, and repetition, and localize them to the dominant hemisphere."],
      ["uncertainty", "Recognize neglect and other nondominant signs, and state the limits of screening tools such as the MoCA and MMSE."],
    ],
    prerequisites: ["f-localization"],
    lessons: ["l-mse-sequence", "l-mse-delirium", "l-mse-language"],
    challengeItems: ["m-mse-broca-loc", "m-mse-aphasia-ft", "m-mse-dementia-pattern", "m-mse-neglect"],
    skills: ["history-exam", "differential", "localization", "interpretation", "uncertainty"],
    minutes: 25,
    sources: [CURRIC, CAM, MOCA],
  },
  lessons: LESSONS,
  items: ITEMS,
  terms: TERMS,
  sources: SOURCES,
};

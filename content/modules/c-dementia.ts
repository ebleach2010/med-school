// Module c-dementia: cognitive and behavioral neurology for the clerkship. From a cognitive
// complaint to a syndrome (subjective decline, mild cognitive impairment, dementia), the
// reversible contributors and a sensible first workup, the main neurodegenerative and vascular
// syndromes by their earliest features, and the principles of biomarkers, anti-amyloid
// antibodies, safety, and caregiver support. Builds on x-mental-status; rapidly progressive
// dementia and prion disease are taught in c-rpd. No doses. AI draft pending clinician review.
// All patients are synthetic.

import type { AssessmentItem, Concept, FreeTextItem, McqItem, MultiSelectItem, SelectTestsItem } from "../../shared/types";
import { meta, term, type ModuleContent } from "./types";

const MID = "c-dementia";
const CURRIC = "safdieh2019-curriculum";
const MOCA = "nasreddine2005-moca";
const CAM = "inouye1990-cam";
const INPH = "relkin2005-inph";
const AAN = "knopman2001-aan-dementia";
const NIAAA = "mckhann2011-niaaa-ad";
const DLB = "mckeith2017-dlb";
const FTD = "rascovsky2011-bvftd";
const PPA = "gornotempini2011-ppa";
const AUR = "cummings2023-lecanemab-aur";
const AA2024 = "jack2024-ad-criteria";

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
function sel(d: Draft<SelectTestsItem>): SelectTestsItem {
  const { sources, modules, ...rest } = d;
  return { ...rest, format: "select-tests", modules: modules ?? [MID], version: 1, meta: meta(d.id, sources) };
}

const c = (id: string, label: string, patterns: string[]): Concept => ({ id, label, patterns });

// ===========================================================================
// Items
// ===========================================================================

const ITEMS: AssessmentItem[] = [
  // ---------------- l-dem-syndrome ----------------
  mcq({
    id: "m-dem-mci",
    skill: "differential",
    difficulty: 1,
    presentation: "word-finding-still-independent",
    usage: ["lesson", "review"],
    vignette:
      "A synthetic patient, 69, a retired bookkeeper, says that for a year he has been misplacing things and losing words mid-sentence. His wife agrees it is a change. He still pays the household bills, manages his own medicines, cooks, and drives to familiar places, though he now keeps more lists and takes longer over the bills. He is alert and attentive in clinic. On a structured cognitive screen he scores below the expected range, losing points on delayed recall and letter fluency.",
    stem: "Which label fits best?",
    options: [
      { id: "a", text: "[[mild-cognitive-impairment|Mild cognitive impairment]]", correct: true, feedback: "Correct. Decline confirmed by an informant and measurable on testing, with independence in daily activities preserved." },
      { id: "b", text: "[[dementia|Dementia]]", tag: "weak-reasoning", feedback: "Dementia requires decline that interferes with independence at work or in usual activities. He still manages bills, medicines, cooking, and driving, even if with more effort." },
      { id: "c", text: "Normal aging", tag: "knowledge-gap", feedback: "His wife confirms a change from his baseline and testing is below the expected range. That is more than normal aging and deserves follow-up." },
      { id: "d", text: "[[subjective-cognitive-decline|Subjective cognitive decline]]", tag: "terminology", feedback: "Subjective cognitive decline means the person notices a change but testing is normal for age and education. His testing is abnormal." },
    ],
    reasoning: {
      stem: "Which feature separates mild cognitive impairment from dementia here?",
      options: [
        { id: "r1", text: "He remains independent in bills, medicines, cooking, and driving", correct: true },
        { id: "r2", text: "His screening score is below the expected range", feedback: "An abnormal score is found in both. The dividing line is daily function, not the score." },
        { id: "r3", text: "His wife has noticed a change", feedback: "An informant's report of decline is expected in both, and supports either label." },
      ],
    },
    rationale:
      "Cognitive complaints sit on a spectrum. In [[subjective-cognitive-decline|subjective cognitive decline]] the person reports a change but testing is normal. In [[mild-cognitive-impairment|mild cognitive impairment]] the decline is reported by the patient, an informant, or a clinician and is measurable on testing, but independence in daily activities is preserved (tasks may take longer or need aids such as lists). In [[dementia|dementia]] the decline interferes with independence at work or in usual activities and is not explained by delirium or a major psychiatric disorder. Function, judged from an informant, decides the line; a test score cannot.",
    sources: [NIAAA, MOCA, CURRIC],
  }),
  multi({
    id: "m-dem-reversible",
    skill: "history-exam",
    difficulty: 2,
    presentation: "forgetful-on-many-medicines",
    usage: ["lesson", "review"],
    vignette:
      "A synthetic patient, 78, has become more forgetful over a year. Her medicines include oxybutynin for bladder urgency, diphenhydramine most nights for sleep, and lorazepam when anxious. Her daughter says she snores loudly, stops breathing in her sleep, and dozes through the afternoon. She has lost interest in her garden and says she feels 'flat'. She has stopped wearing her hearing aids. No thyroid or vitamin B12 tests have been done.",
    stem: "Select every factor that should be checked or addressed as a possible contributor to her cognitive decline.",
    options: [
      { id: "a", text: "Anticholinergic medicines (oxybutynin, diphenhydramine)", correct: true },
      { id: "b", text: "Benzodiazepine use (lorazepam)", correct: true },
      { id: "c", text: "Depression", correct: true },
      { id: "d", text: "Obstructive sleep apnea and daytime sleepiness", correct: true },
      { id: "e", text: "Hypothyroidism (thyroid function test)", correct: true },
      { id: "f", text: "Vitamin B12 deficiency", correct: true },
      { id: "g", text: "Uncorrected hearing loss", correct: true },
      { id: "h", text: "None of these, because at 78 slow decline is expected with age", tag: "knowledge-gap", feedback: "Decline noticed by family and severe enough to prompt a visit is not explained by age alone, and several treatable contributors are present." },
      { id: "i", text: "None of these, because a dementia diagnosis would make them irrelevant", tag: "weak-reasoning", feedback: "Even when a neurodegenerative disease is present, these factors add to the impairment. Treating them can improve function." },
    ],
    rationale:
      "Before attributing decline to a neurodegenerative disease, look for contributors that add to it and can be treated. Drugs with anticholinergic or sedating effects (bladder antimuscarinics, sedating antihistamines, benzodiazepines, and others) impair attention and memory, especially in older people. Depression can cause or worsen cognitive complaints. Sleep apnea and poor sleep impair attention and memory. Hypothyroidism and vitamin B12 deficiency are screened for with blood tests. Uncorrected hearing or vision loss lowers test performance and isolates the person. Fully reversible dementia is uncommon, but addressing these factors often improves function, and they can coexist with Alzheimer disease or another degenerative process.",
    sources: [AAN, CURRIC],
  }),
  sel({
    id: "m-dem-workup",
    skill: "investigation-selection",
    difficulty: 2,
    presentation: "first-memory-clinic-visit",
    usage: ["lesson", "review", "challenge"],
    vignette:
      "A synthetic patient, 72, attends a first memory clinic visit with her husband. Over 18 months she has gradually begun repeating questions and missing appointments, and he has taken over the bills. She is alert and attentive, and her general neurological examination, including gait, is normal. She takes no regular medicines. There are no hallucinations, behavior changes, or rapid deterioration.",
    stem: "Which parts of the first assessment are appropriate?",
    options: [
      { id: "a", label: "History from her husband: first symptom, onset, course, and change in daily function", category: "necessary", why: "Establishes decline from baseline and loss of independence, which the examination alone cannot show, and the first symptom points to the syndrome." },
      { id: "b", label: "Structured cognitive testing (for example the MoCA), with the pattern of errors recorded", category: "necessary", why: "Documents which domains are impaired and gives a baseline to compare with at follow-up." },
      { id: "c", label: "Serum vitamin B12", category: "necessary", why: "Deficiency is a treatable contributor to cognitive impairment and is recommended as routine screening." },
      { id: "d", label: "Thyroid function (TSH)", category: "necessary", why: "Hypothyroidism is a treatable contributor and is recommended as routine screening." },
      { id: "e", label: "Structural brain imaging, MRI preferred (CT if MRI is not possible)", category: "necessary", why: "Looks for vascular disease, hydrocephalus, tumor, or subdural hematoma, and shows patterns of atrophy." },
      { id: "f", label: "Screening for depression, sleep problems, and hearing or vision loss", category: "necessary", why: "Common, treatable contributors that lower cognitive performance." },
      { id: "g", label: "Basic blood tests (blood count, electrolytes, calcium, glucose, renal and liver function)", category: "reasonable", why: "Look for systemic illness that can worsen cognition; low yield in a well patient but simple." },
      { id: "h", label: "Routine EEG", category: "unnecessary", why: "Not part of a routine workup for gradual decline; reserved for suspected seizures, fluctuations, or rapid decline." },
      { id: "i", label: "APOE genotyping to make the diagnosis", category: "unnecessary", why: "APOE e4 is a risk factor, not a diagnostic test; it is discussed later only if anti-amyloid treatment is considered, because it affects ARIA risk." },
      { id: "j", label: "Start an anti-amyloid antibody today on the basis of the history and screening score", category: "harmful", why: "Treatment requires biomarker confirmation of amyloid, staging, and a baseline MRI; treating without them exposes her to risk without an established indication." },
    ],
    rationale:
      "A first assessment for gradual cognitive decline rests on an informant history (first symptom, time course, daily function), a cognitive and neurological examination, a medication review, and screening for treatable contributors: depression, sleep disorders, sensory loss, vitamin B12 deficiency, and hypothyroidism. Structural imaging finds vascular lesions, hydrocephalus, and masses and shows the pattern of atrophy. Amyloid and tau biomarkers come later, when the diagnosis is uncertain or treatment is being considered. Decline over weeks to months, or with myoclonus, seizures, or early gait failure, calls for the faster workup taught in rapidly progressive dementia (c-rpd).",
    sources: [AAN, NIAAA, MOCA, AUR],
  }),

  // ---------------- l-dem-syndromes ----------------
  mcq({
    id: "m-dem-dlb-features",
    skill: "differential",
    difficulty: 1,
    presentation: "fluctuations-and-visitors",
    usage: ["lesson", "review"],
    vignette:
      "A synthetic patient, 73, is brought by his wife. Over a year his thinking has become 'patchy': some days he is nearly himself, on others he stares into space and cannot follow the conversation. He describes small children playing in the garden who are not there. For years before this he shouted and punched in his sleep as if acting out dreams. He walks a little more slowly, and his right arm is mildly stiff. He draws a clock poorly but recalls four of five words with cues.",
    stem: "Which syndrome do these early features match best?",
    options: [
      { id: "a", text: "[[dementia-with-lewy-bodies|Dementia with Lewy bodies]]", correct: true, feedback: "Correct. Fluctuating cognition, well-formed visual hallucinations, REM sleep behavior disorder, and parkinsonism are its four core clinical features." },
      { id: "b", text: "Typical amnestic [[alzheimer-disease|Alzheimer disease]]", tag: "weak-reasoning", feedback: "Typical Alzheimer disease starts with failed storage of new memories that cues do not rescue. His recall is helped by cues, and the leading features are fluctuation, hallucinations, and dream enactment." },
      { id: "c", text: "Behavioral variant [[frontotemporal-dementia|frontotemporal dementia]]", tag: "weak-reasoning", feedback: "Behavioral variant frontotemporal dementia starts with disinhibition, apathy, loss of empathy, and compulsions. None of these is described." },
      { id: "d", text: "[[delirium|Delirium]]", tag: "misconception", feedback: "Fluctuating attention is shared with delirium, but his course is over a year, with hallucinations, dream enactment, and parkinsonism. A slow course with these features is a dementia syndrome, though delirium can be superimposed." },
    ],
    rationale:
      "The 2017 consensus criteria for [[dementia-with-lewy-bodies|dementia with Lewy bodies]] list four core clinical features: fluctuating cognition with marked variation in attention and alertness, recurrent well-formed visual hallucinations, [[rem-sleep-behavior-disorder|REM sleep behavior disorder]] (which may precede the cognitive decline by years), and parkinsonism. Early deficits are typically in attention, executive, and visuoperceptual function, with memory relatively spared at first, which is why cues help his recall and his clock drawing is poor.",
    sources: [DLB, CURRIC],
  }),
  mcq({
    id: "m-dem-vascular",
    skill: "differential",
    difficulty: 2,
    presentation: "stepwise-slowing-vascular-risk",
    usage: ["lesson", "review", "challenge"],
    vignette:
      "A synthetic patient, 76, has long-standing hypertension and diabetes and smoked for 40 years. His daughter says he has gone 'downhill in steps' over three years: after a sudden episode of left hand clumsiness that partly recovered, he became slower and less organized, and after a second episode he stopped managing his own medicines. He is slow to answer and struggles with planning and letter fluency; his recall is poor but improves with cues. He walks with short steps and has new urinary urgency. MRI shows several small deep infarcts and extensive white matter changes, with ventricles in proportion to the overall atrophy.",
    stem: "Which diagnosis fits best?",
    options: [
      { id: "a", text: "[[vascular-cognitive-impairment|Vascular cognitive impairment]] (vascular dementia)", correct: true, feedback: "Correct. Stepwise decline linked to clinical events, executive slowing with retrieval-type memory problems, vascular risk factors, and matching infarcts and white matter disease." },
      { id: "b", text: "Typical amnestic [[alzheimer-disease|Alzheimer disease]]", tag: "weak-reasoning", feedback: "Typical Alzheimer disease is gradual, with storage-type memory loss that cues do not help. Here the course is stepwise and the recall improves with cues." },
      { id: "c", text: "[[normal-pressure-hydrocephalus|Normal pressure hydrocephalus]]", tag: "weak-reasoning", feedback: "Gait and urinary symptoms overlap, but normal pressure hydrocephalus needs ventricles enlarged out of proportion to atrophy. The stepwise course and infarcts point to vascular disease." },
      { id: "d", text: "[[dementia-with-lewy-bodies|Dementia with Lewy bodies]]", tag: "knowledge-gap", feedback: "Short-stepped gait can suggest parkinsonism, but there are no fluctuations, visual hallucinations, or dream enactment, and the imaging explains the picture." },
    ],
    rationale:
      "[[vascular-cognitive-impairment|Vascular cognitive impairment]] follows cerebrovascular disease. It may decline in steps after clinical strokes or progress gradually from [[small-vessel-disease|small vessel disease]], which damages frontal-subcortical connections and causes slowed processing, executive dysfunction, apathy, retrieval-type memory problems helped by cues, short-stepped gait, and urinary urgency. Imaging that shows infarcts or extensive white matter disease, in a person with vascular risk factors, supports it. Mixed vascular and Alzheimer pathology is common in older people, so the two often coexist. Normal pressure hydrocephalus shares gait and urinary symptoms but requires disproportionate ventricular enlargement.",
    sources: [CURRIC, NIAAA, INPH],
  }),
  free({
    id: "m-dem-bvftd-ft",
    skill: "differential",
    difficulty: 2,
    presentation: "personality-change-midlife",
    usage: ["lesson", "review", "challenge"],
    vignette:
      "A synthetic patient, 58, a previously reserved office manager, has changed over two years. He makes crude remarks to strangers, has run up debts on impulse purchases, and seems indifferent when his wife is ill. He has stopped pursuing his hobbies and sits for hours unless prompted. He now eats large amounts of sweets and insists on walking the same route at the same time every day. He finds his way around without difficulty and recalls recent events reasonably well, but he fails tasks of planning and switching between rules. He has no history of psychiatric illness.",
    stem: "Name the most likely syndrome.",
    placeholder: "Syndrome",
    answer: {
      full: [
        c("bvftd", "behavioral variant frontotemporal dementia", [
          "behavioral variant frontotemporal dementia",
          "behavioural variant frontotemporal dementia",
          "behavioral variant frontotemporal",
          "behavioural variant frontotemporal",
          "behavioral variant ftd",
          "behavioural variant ftd",
          "bvftd",
          "bv ftd",
        ]),
      ],
      partial: [
        { concept: c("ftd", "frontotemporal dementia", ["frontotemporal dementia", "frontotemporal lobar degeneration", "ftd", "ftld", "pick disease", "frontal dementia"]), credit: 0.7, feedback: "Right family. Specify the behavioral variant: early disinhibition, apathy, loss of empathy, compulsions, and dietary change, with memory and spatial skills relatively spared." },
      ],
      wrong: [
        { concept: c("ad", "Alzheimer disease", ["alzheimer", "alzheimers"]), tag: "weak-reasoning", feedback: "Typical Alzheimer disease starts with episodic memory loss. His memory and navigation are relatively preserved while behavior and executive function fail." },
        { concept: c("dlb", "dementia with Lewy bodies", ["lewy", "dlb"]), tag: "weak-reasoning", feedback: "Lewy body disease starts with fluctuations, visual hallucinations, dream enactment, and parkinsonism, none of which he has." },
        { concept: c("ppa", "primary progressive aphasia", ["primary progressive aphasia", "ppa", "aphasia"]), tag: "weak-reasoning", feedback: "Primary progressive aphasia starts with language failure. His leading problems are behavior and personality." },
        { concept: c("psych", "primary psychiatric disorder", ["depression", "bipolar", "mania", "personality disorder", "psychiatric", "midlife crisis"]), tag: "unsafe-priority", feedback: "A new change in personality and behavior in midlife, without prior psychiatric illness and with executive deficits, should raise a neurodegenerative cause before a psychiatric label." },
        { concept: c("vascular", "vascular dementia", ["vascular"]), tag: "knowledge-gap", feedback: "Nothing suggests stepwise decline, strokes, or vascular risk. The pattern of early social and behavioral change points to the frontal and anterior temporal lobes." },
      ],
    },
    modelAnswer: "Behavioral variant frontotemporal dementia: early disinhibition, apathy, loss of empathy, compulsive routines, and a change in diet, with executive deficits and relatively spared memory and navigation.",
    rationale:
      "The 2011 international criteria for behavioral variant [[frontotemporal-dementia|frontotemporal dementia]] list six features: early disinhibition, early apathy or inertia, early loss of sympathy or empathy, early perseverative, stereotyped, or compulsive behavior, hyperorality and dietary change, and a neuropsychological profile of executive deficits with relative sparing of memory and visuospatial function. Three are needed for possible bvFTD; functional decline and frontal or anterior temporal atrophy or hypometabolism on imaging make it probable. Onset is often before 65, and the change is frequently mistaken for a psychiatric illness. Insight is usually poor, so the history comes from the family.",
    sources: [FTD, CURRIC],
  }),
  mcq({
    id: "m-dem-ad-amnestic",
    skill: "differential",
    difficulty: 1,
    presentation: "repeats-questions-misplaces",
    usage: ["review"],
    vignette:
      "A synthetic patient, 75, has over two years begun repeating the same questions within an hour, forgetting recent conversations, and leaving the stove on. She remembers her childhood and old friends well. She is alert, attentive, and socially engaged, with no hallucinations, sleep behaviors, or change in personality. She recalls none of five words after a delay; cues do not help, and she cannot pick them out from a list. Her neurological examination is otherwise normal.",
    stem: "Which syndrome do these early features match best?",
    options: [
      { id: "a", text: "Amnestic presentation of [[alzheimer-disease|Alzheimer disease]]", correct: true, feedback: "Correct. Gradual loss of new episodic memories with failure of storage (no help from cues or recognition) and preserved remote memory and social behavior." },
      { id: "b", text: "[[dementia-with-lewy-bodies|Dementia with Lewy bodies]]", tag: "weak-reasoning", feedback: "She has none of the core features: fluctuations, visual hallucinations, REM sleep behavior disorder, or parkinsonism." },
      { id: "c", text: "Behavioral variant [[frontotemporal-dementia|frontotemporal dementia]]", tag: "weak-reasoning", feedback: "Her behavior and personality are unchanged; the leading problem is new learning." },
      { id: "d", text: "[[primary-progressive-aphasia|Primary progressive aphasia]]", tag: "knowledge-gap", feedback: "Language is not described as the leading problem. Forgetting conversations reflects failure to store them, not failure of language." },
    ],
    rationale:
      "The most common presentation of [[alzheimer-disease|Alzheimer disease]] is amnestic: gradual impairment of learning and recalling recently learned information, from early involvement of the medial temporal lobes. [[episodic-memory|Episodic memory]] fails at storage, so cues and recognition lists do not help, while remote memories are relatively preserved. Deficits in other domains (word finding, visuospatial function, executive function) follow. The 2011 NIA-AA criteria also recognize non-amnestic presentations led by language, visuospatial, or executive problems.",
    sources: [NIAAA, CURRIC],
  }),
  mcq({
    id: "m-dem-ppa",
    skill: "differential",
    difficulty: 2,
    presentation: "progressive-word-finding",
    usage: ["review"],
    vignette:
      "A synthetic patient, 64, a sales representative, has had two years of steadily worsening difficulty finding words. His speech is slow, with frequent pauses to search for words, and he struggles to repeat longer sentences, though he understands single words and conversation. He has stopped making phone calls at work. He manages his finances, finds his way around, remembers the week's events, and his personality is unchanged. There was no sudden onset, and his neurological examination is otherwise normal.",
    stem: "Which syndrome is most likely?",
    options: [
      { id: "a", text: "[[primary-progressive-aphasia|Primary progressive aphasia]]", correct: true, feedback: "Correct. A gradually progressive language disorder that is the most prominent deficit and the main cause of impaired daily activities." },
      { id: "b", text: "Aphasia from a left middle cerebral artery stroke", tag: "weak-reasoning", feedback: "Stroke aphasia starts suddenly. His has progressed steadily over two years." },
      { id: "c", text: "Amnestic [[alzheimer-disease|Alzheimer disease]]", tag: "weak-reasoning", feedback: "His memory for daily events is intact. The leading deficit is language, although a language-led presentation can still have Alzheimer pathology underneath." },
      { id: "d", text: "Behavioral variant [[frontotemporal-dementia|frontotemporal dementia]]", tag: "knowledge-gap", feedback: "His personality and behavior are unchanged; the problem is confined to language." },
    ],
    rationale:
      "[[primary-progressive-aphasia|Primary progressive aphasia]] is diagnosed when language difficulty is the most prominent clinical feature, is the main cause of impaired daily living, and is the leading deficit at onset. The 2011 classification recognizes three variants: nonfluent or agrammatic (effortful, halting, agrammatic speech, often with speech sound errors), semantic (loss of word meaning, with impaired naming and single-word comprehension), and logopenic (word-finding pauses and impaired repetition of sentences, as here, often with Alzheimer pathology). Recognition is the clerkship goal; subtype assignment is a specialist task.",
    sources: [PPA, CURRIC],
  }),

  // ---------------- l-dem-biomarkers-care ----------------
  mcq({
    id: "m-dem-biomarker-asymptomatic",
    skill: "uncertainty",
    difficulty: 2,
    presentation: "worried-well-blood-test",
    usage: ["lesson", "review"],
    vignette:
      "A synthetic patient, 66, has no memory complaints, works full time, and her husband notices no change. Her mother had Alzheimer disease, and she asks for a blood test for Alzheimer 'markers' so she will know whether she is going to get it.",
    stem: "Which response is most accurate?",
    options: [
      { id: "a", text: "Amyloid and tau tests are meant for people with cognitive symptoms; in someone without symptoms a positive result would not show that she has or will soon develop dementia, so testing is not recommended outside research", correct: true, feedback: "Correct. Amyloid pathology is common in older people without symptoms, and many never develop dementia in their lifetime." },
      { id: "b", text: "A positive blood test would confirm that she has Alzheimer dementia now", tag: "misconception", feedback: "Dementia is a clinical diagnosis of decline that affects independence. She has no decline; a biomarker shows pathology, not the clinical syndrome." },
      { id: "c", text: "A negative blood test would mean she can never develop dementia", tag: "misconception", feedback: "A negative result does not exclude later Alzheimer pathology or other causes of dementia such as vascular or Lewy body disease." },
      { id: "d", text: "She should start an anti-amyloid antibody if the blood test is positive", tag: "unsafe-priority", feedback: "Anti-amyloid antibodies are for early symptomatic disease (mild cognitive impairment or mild dementia) with confirmed amyloid, not for people without symptoms." },
    ],
    rationale:
      "Amyloid and tau biomarkers (CSF, PET, and increasingly blood tests such as plasma phosphorylated tau) detect Alzheimer disease pathology. Pathology begins years before symptoms and is common in cognitively unimpaired older adults, many of whom will not develop dementia in their lifetime, so a positive result in someone without symptoms does not give a reliable personal forecast. The 2024 Alzheimer's Association revised criteria define the disease biologically for research and staging but do not recommend testing cognitively unimpaired people in clinical practice. In the clinic, biomarkers help explain the cause of an established cognitive syndrome and decide eligibility for treatment.",
    sources: [AA2024, AUR],
  }),
  multi({
    id: "m-dem-antiamyloid",
    skill: "investigation-selection",
    difficulty: 2,
    presentation: "mci-asks-about-antibody",
    usage: ["lesson", "review"],
    vignette:
      "A synthetic patient, 71, has amnestic mild cognitive impairment and remains independent. She has read about anti-amyloid antibody infusions for Alzheimer disease and asks whether she could have one.",
    stem: "Select every requirement or precaution that applies before and during anti-amyloid antibody treatment.",
    options: [
      { id: "a", text: "Confirm amyloid pathology with amyloid PET or CSF testing", correct: true },
      { id: "b", text: "Confirm the stage is early: mild cognitive impairment or mild dementia due to Alzheimer disease", correct: true },
      { id: "c", text: "Review a recent baseline MRI for microhemorrhages, superficial siderosis, prior hemorrhage, or other findings that raise risk", correct: true },
      { id: "d", text: "Schedule MRI monitoring during the early months of treatment for amyloid-related imaging abnormalities (ARIA)", correct: true },
      { id: "e", text: "Offer APOE genotyping with counseling, because APOE e4 carriers (especially two copies) have a higher risk of ARIA", correct: true },
      { id: "f", text: "Review anticoagulant use, because bleeding risk with ARIA is a concern", correct: true },
      { id: "g", text: "Explain that treatment aims to slow decline modestly, not to restore lost memory", correct: true },
      { id: "h", text: "A low screening score is enough evidence of Alzheimer disease to begin", tag: "misconception", feedback: "A score shows impairment, not its cause. Treatment requires biomarker confirmation of amyloid." },
      { id: "i", text: "MRI is only needed if she develops symptoms, because ARIA always causes symptoms", tag: "unsafe-priority", feedback: "ARIA is often asymptomatic and found only on scheduled MRI; symptoms such as headache, confusion, or seizures can occur, and it can rarely be severe." },
      { id: "j", text: "Treatment works best when started at the moderate or severe stage of dementia", tag: "knowledge-gap", feedback: "The trials and recommendations cover early symptomatic disease only; people with moderate or severe dementia were not studied." },
    ],
    rationale:
      "Anti-amyloid monoclonal antibodies such as lecanemab remove amyloid plaques and modestly slow decline in early symptomatic Alzheimer disease. Appropriate use recommendations require a clinical diagnosis of mild cognitive impairment or mild dementia due to Alzheimer disease, biomarker confirmation of amyloid by PET or CSF, and a baseline MRI. The main risk is [[aria|amyloid-related imaging abnormalities]]: ARIA-E (edema or effusion) and ARIA-H (microhemorrhages or superficial siderosis). Most ARIA is asymptomatic and found on scheduled MRI, so monitoring is built into treatment. APOE e4 carriers, especially homozygotes, have higher risk, so genotyping with counseling is recommended, and the recommendations advise against treatment in people taking anticoagulants. Doses and schedules are a specialist matter and are not taught here.",
    sources: [AUR, AA2024],
  }),
  mcq({
    id: "m-dem-antipsychotic",
    skill: "emergency",
    difficulty: 3,
    presentation: "inpatient-agitation-lewy",
    usage: ["lesson", "review", "challenge"],
    vignette:
      "A synthetic patient, 80, is admitted with a urinary tract infection. His wife tells the night team that for two years his thinking has varied from day to day, he has seen 'people in the house' who are not there, he has acted out dreams for many years, and he has become slower and stiffer. Tonight he is agitated, says strangers are in the room, and is trying to get out of bed. The covering doctor proposes intramuscular haloperidol.",
    stem: "What is the best response?",
    options: [
      { id: "a", text: "Avoid haloperidol; treat the infection, look for other triggers such as pain, retention, and sedating drugs, and use non-drug calming measures with family present", correct: true, feedback: "Correct. His history suggests dementia with Lewy bodies, in which antipsychotics can cause severe, sometimes life-threatening sensitivity reactions." },
      { id: "b", text: "Give haloperidol, because his hallucinations are psychotic symptoms that respond to antipsychotics", tag: "unsafe-priority", feedback: "In Lewy body disease, antipsychotics, especially older ones such as haloperidol, can cause severe worsening of parkinsonism, sedation, confusion, falls, and a syndrome resembling neuroleptic malignant syndrome." },
      { id: "c", text: "Give diphenhydramine to help him sleep", tag: "unsafe-priority", feedback: "Sedating anticholinergic drugs worsen confusion and delirium, particularly in Lewy body disease." },
      { id: "d", text: "Increase dopaminergic medication to treat his stiffness and calm him", tag: "misconception", feedback: "Dopaminergic drugs can worsen hallucinations and confusion. They do not treat agitation." },
    ],
    reasoning: {
      stem: "Which part of the history should most change the plan?",
      options: [
        { id: "r1", text: "Fluctuations, visual hallucinations, dream enactment, and parkinsonism over two years", correct: true },
        { id: "r2", text: "The urinary tract infection", feedback: "The infection explains tonight's delirium and needs treatment, but it is the background Lewy body picture that makes antipsychotics dangerous." },
        { id: "r3", text: "His age", feedback: "Age raises caution with sedatives in general, but the specific danger here comes from the Lewy body features." },
      ],
    },
    rationale:
      "Delirium on top of dementia is common, and the first step is always the cause: infection, pain, urinary retention, constipation, drugs, and dehydration. Severe sensitivity to antipsychotics is a supportive feature of [[dementia-with-lewy-bodies|dementia with Lewy bodies]] in the 2017 consensus criteria, and these drugs should be avoided where possible; reactions include abrupt worsening of parkinsonism and cognition, sedation, and a neuroleptic malignant-like syndrome. Non-drug measures (a calm, lit room, family presence, reorientation, glasses and hearing aids) come first. If a drug becomes unavoidable for safety, the choice belongs with senior or specialist input. Recognizing the Lewy body history from the family is what prevents harm.",
    sources: [DLB, CAM, CURRIC],
  }),
  multi({
    id: "m-dem-safety",
    skill: "history-exam",
    difficulty: 1,
    presentation: "caregiver-follow-up-visit",
    usage: ["review"],
    vignette:
      "A synthetic patient, 79, has mild dementia due to Alzheimer disease and lives with his wife, who is his only carer. At follow-up she looks exhausted. He still drives to the shops, keeps a hunting rifle in the garage, and has twice left the stove on. Last month he paid a large sum to a caller who said he had won a prize.",
    stem: "Select every issue that belongs in this visit.",
    options: [
      { id: "a", text: "Driving safety, with assessment or advice to stop as appropriate", correct: true },
      { id: "b", text: "Safe storage or removal of the firearm", correct: true },
      { id: "c", text: "Kitchen and home safety (stove, wandering, falls)", correct: true },
      { id: "d", text: "Protection from financial exploitation and help with managing money", correct: true },
      { id: "e", text: "Advance care planning and choosing a health care proxy while he can take part", correct: true },
      { id: "f", text: "His wife's own health, strain, and access to education, support groups, and respite", correct: true },
      { id: "g", text: "Who supervises his medicines", correct: true },
      { id: "h", text: "Leave safety issues until the dementia is moderate, to avoid upsetting him", tag: "unsafe-priority", feedback: "Driving, firearms, cooking, and finances are risks now. Planning is easier and more respectful while he can still take part in decisions." },
      { id: "i", text: "Caregiver wellbeing is outside the clinician's role", tag: "knowledge-gap", feedback: "Carer strain affects the patient's safety and care. Supporting the carer is part of dementia care." },
    ],
    rationale:
      "Dementia care extends beyond diagnosis and drugs. At each visit, ask about driving, firearms, cooking and home hazards, wandering, medication supervision, and financial vulnerability, which can appear early because judgment fails before memory is obviously lost. Advance care planning (health care proxy, goals of care, legal and financial arrangements) should start while the person can still take part. Carers carry most of the load: their strain, health, and need for information, support groups, and respite are part of the clinical picture.",
    sources: [CURRIC, AAN],
  }),
];

// ===========================================================================
// Lessons
// ===========================================================================

const LESSONS: ModuleContent["lessons"] = [
  {
    id: "l-dem-syndrome",
    moduleId: MID,
    title: "From cognitive complaint to syndrome",
    concept: "Daily function, judged with an informant, separates subjective decline and mild cognitive impairment from dementia, and every assessment looks for treatable contributors before naming a cause.",
    minutes: 9,
    meta: meta("l-dem-syndrome", [NIAAA, AAN, MOCA, CURRIC]),
    steps: [
      {
        kind: "hook",
        title: "'Is this just my age?'",
        body: "Three people come to clinic with the same words: 'my memory is going'. The first scores normally and runs a business. The second scores below expected but still manages her own bills and medicines. The third has stopped paying bills and got lost driving home. Same complaint, three different situations, and in each one there may be a drug, a mood problem, or a sleep disorder making it worse.",
      },
      {
        kind: "explain",
        title: "Subjective decline, mild cognitive impairment, and dementia",
        body:
          "[[subjective-cognitive-decline|Subjective cognitive decline]]: the person notices a change, but testing is normal for age and education and daily function is intact.\n\n[[mild-cognitive-impairment|Mild cognitive impairment]]: decline reported by the patient, an informant, or a clinician, measurable on testing in one or more domains, with independence in daily activities preserved. Tasks may take longer or need aids such as lists and reminders.\n\n[[dementia|Dementia]]: decline from a previous level, affecting cognition or behavior (memory, reasoning and judgment, visuospatial function, language, personality), that interferes with independence at work or in usual activities and is not explained by [[delirium|delirium]] or a major psychiatric disorder.\n\nThe line between mild cognitive impairment and dementia is daily function, not a test score.",
        layers: {
          simpler: "Is there a real change from before? Can it be measured? Is the person still managing their own life? Those three questions sort most memory complaints.",
          mechanism:
            "Neurodegenerative diseases begin years before symptoms, then cause subtle measurable deficits while the person compensates, then overwhelm compensation so that daily function fails. Mild cognitive impairment and dementia are clinical stages along that path, and the same disease can be present at either.",
          compare:
            "Delirium is acute and inattentive; dementia is gradual with attention preserved until later. The bedside separation is taught in the mental status module. Do not diagnose dementia during delirium; reassess once it clears.",
          deeper:
            "Mild cognitive impairment can stay stable, improve (when a contributor such as medication or depression is addressed), or progress to dementia. Ask about instrumental activities of daily living (finances, medicines, shopping, cooking, driving, using the phone), which fail earlier than basic self-care such as dressing and washing.",
        },
      },
      { kind: "predict", title: "Name the stage", itemId: "m-dem-mci" },
      {
        kind: "explain",
        title: "Contributors you can treat",
        body:
          "Before attributing decline to a degenerative disease, look for what adds to it:\n\nMedicines: drugs with anticholinergic effects (bladder antimuscarinics, sedating antihistamines, some antidepressants), benzodiazepines and other sedatives, opioids. Review every prescription and over-the-counter sleep aid.\n\nMood: depression can cause or amplify cognitive complaints.\n\nSleep: obstructive sleep apnea and poor sleep impair attention and memory.\n\nBlood tests: hypothyroidism and vitamin B12 deficiency.\n\nSenses: uncorrected hearing or vision loss lowers test scores and isolates the person.\n\nAlcohol, and structural causes found on imaging (subdural hematoma, tumor, [[normal-pressure-hydrocephalus|normal pressure hydrocephalus]] with its triad of gait, urinary, and cognitive change).",
        layers: {
          simpler: "Medicines, mood, sleep, thyroid, B12, hearing, and vision: check them all, because each can make thinking worse and each can be treated.",
          mechanism:
            "Acetylcholine supports attention and memory, and cholinergic systems are already damaged in Alzheimer disease and Lewy body disease. Anticholinergic drugs therefore hit a vulnerable brain hardest, and sedatives blunt the attention on which every other cognitive domain depends.",
          compare:
            "A contributor rarely explains everything. More often it adds to an underlying degenerative process. Removing it can still improve function and safety, and makes the residual picture easier to read.",
          deeper:
            "The American Academy of Neurology practice parameter recommends structural imaging and screening for depression, B12 deficiency, and hypothyroidism in the routine evaluation of dementia. Testing for syphilis, HIV, or other conditions is guided by risk factors rather than done in everyone.",
        },
      },
      { kind: "apply", title: "Find the contributors", itemId: "m-dem-reversible" },
      {
        kind: "explain",
        title: "A sensible first workup",
        body:
          "History from an informant: the first symptom, when it began, whether it crept up or came in steps, and what the person can no longer do. Ask about hallucinations, sleep behaviors, personality change, falls, and continence.\n\nExamination: the mental status exam (attention first), plus a neurological exam looking for parkinsonism, gait change, focal signs, and eye movement abnormalities.\n\nCognitive testing: a structured screen such as the MoCA, reading the pattern as well as the score; formal neuropsychological testing when the picture is unclear.\n\nTests: vitamin B12, thyroid function, and basic bloods; structural brain imaging, MRI preferred.\n\nBiomarkers of Alzheimer pathology come later, when the cause is uncertain or treatment is being considered (lesson three).\n\nRed flag: decline over weeks to months, or with myoclonus, seizures, or early gait and coordination failure, needs urgent investigation as rapidly progressive dementia (covered in c-rpd).",
        layers: {
          simpler: "Talk to someone who knows the patient, examine them, test their thinking, check B12 and thyroid, and get a brain scan. If it is moving fast, act fast.",
          mechanism:
            "The informant supplies the change over time that no single exam can measure. The first symptom matters because degenerative diseases begin in a particular network: the medial temporal lobes in typical Alzheimer disease, frontal and anterior temporal lobes in frontotemporal dementia, and language networks in primary progressive aphasia.",
          compare:
            "Imaging in gradual decline looks for vascular lesions, hydrocephalus, and masses, and shows atrophy patterns such as medial temporal or frontal predominance. It rarely makes the diagnosis alone.",
          deeper:
            "Screening tools are influenced by education, language, culture, and sensory function, and a normal score does not exclude a disorder. Repeat testing at follow-up, with the same tool, shows the trajectory, which is often more informative than any single score.",
        },
      },
      { kind: "apply", title: "Plan the first visit", itemId: "m-dem-workup" },
      {
        kind: "summary",
        title: "Key points",
        points: [
          "Subjective decline: normal testing. Mild cognitive impairment: measurable decline with independence preserved. Dementia: decline that interferes with independence.",
          "Daily function, from an informant, decides the line between mild cognitive impairment and dementia.",
          "Check medicines (anticholinergics, sedatives), depression, sleep apnea, thyroid, B12, hearing, and vision.",
          "First workup: informant history, examination, cognitive testing, B12 and thyroid tests, structural imaging (MRI preferred).",
          "Decline over weeks to months is rapidly progressive dementia and needs urgent investigation (c-rpd).",
        ],
        reviewItemIds: ["m-dem-mci", "m-dem-reversible", "m-dem-workup"],
      },
    ],
  },
  {
    id: "l-dem-syndromes",
    moduleId: MID,
    title: "The main syndromes by their earliest features",
    concept: "The first and most prominent symptom points to the syndrome: episodic memory in Alzheimer disease, stepwise or executive slowing in vascular disease, fluctuations and hallucinations in Lewy body disease, behavior in frontotemporal dementia, and language in primary progressive aphasia.",
    minutes: 11,
    meta: meta("l-dem-syndromes", [NIAAA, DLB, FTD, PPA, CURRIC]),
    steps: [
      {
        kind: "hook",
        title: "Five first symptoms",
        body: "One woman keeps asking what day her granddaughter is visiting. One man got slower after each of two small strokes. Another sees children in the garden and has punched his wife in his sleep for years. A previously polite manager now makes crude remarks and eats only sweets. A salesman can no longer find his words. Each first symptom points to a different disease, and to different risks in treatment.",
      },
      {
        kind: "explain",
        title: "Alzheimer disease and vascular cognitive impairment",
        body:
          "[[alzheimer-disease|Alzheimer disease]], amnestic presentation (the most common): insidious, gradually worsening loss of [[episodic-memory|episodic memory]], so the person repeats questions and forgets recent conversations while remote memories are preserved. Recall fails and is not rescued by cues or a recognition list, because new information is not stored. Word finding, visuospatial, and executive problems follow. Less common non-amnestic presentations begin with language (often logopenic aphasia), visuospatial difficulty, or executive dysfunction.\n\n[[vascular-cognitive-impairment|Vascular cognitive impairment]]: decline in steps after strokes, or gradual decline from [[small-vessel-disease|small vessel disease]]. Expect slowed thinking, executive dysfunction, apathy, retrieval-type memory problems that cues help, short-stepped gait, and urinary urgency, in a person with vascular risk factors and with infarcts or extensive white matter disease on imaging.",
        layers: {
          simpler: "Alzheimer disease usually starts with forgetting new things. Vascular disease often starts with slowness and poor planning, sometimes getting worse in steps after strokes.",
          mechanism:
            "In typical Alzheimer disease, neurofibrillary tau pathology appears early in the medial temporal lobe, the hub for forming new episodic memories, then spreads to association cortex. Small vessel disease damages the white matter connecting frontal cortex with deep structures, so speed, planning, and retrieval suffer more than storage.",
          compare:
            "Storage failure (no help from cues) suggests medial temporal disease; retrieval failure (cues help) suggests frontal-subcortical disease. The mental status module teaches the bedside test.",
          deeper:
            "In older people mixed pathology is the rule rather than the exception: Alzheimer change, vascular disease, and Lewy bodies often coexist, and each lowers the threshold at which the others cause symptoms. Treating vascular risk factors is worthwhile whatever the main diagnosis.",
        },
      },
      { kind: "predict", title: "Match the early features", itemId: "m-dem-dlb-features" },
      {
        kind: "explain",
        title: "Dementia with Lewy bodies",
        body:
          "[[dementia-with-lewy-bodies|Dementia with Lewy bodies]] has four core clinical features:\n\n1. Fluctuating cognition, with marked variation in attention and alertness (good days and bad days, staring spells).\n2. Recurrent, well-formed visual hallucinations, often of people or animals.\n3. [[rem-sleep-behavior-disorder|REM sleep behavior disorder]]: acting out dreams, which may begin years before cognitive decline.\n4. Parkinsonism: slowness, rigidity, or rest tremor.\n\nEarly deficits are in attention, executive, and visuospatial function; memory may be relatively spared at first. Supportive features include severe sensitivity to antipsychotic drugs, falls, fainting, autonomic problems, and loss of smell.\n\nWhen dementia begins before or around the time of parkinsonism, the label is dementia with Lewy bodies; when dementia develops in well-established Parkinson disease, it is called Parkinson disease dementia.",
        layers: {
          simpler: "Up-and-down thinking, seeing things that are not there, acting out dreams, and stiffness: think Lewy bodies, and be very careful with antipsychotic drugs.",
          mechanism:
            "Alpha-synuclein aggregates (Lewy bodies) affect brainstem, limbic, and cortical neurons. Loss of dopaminergic neurons causes parkinsonism; loss of cholinergic neurons contributes to fluctuations, hallucinations, and inattention; brainstem involvement disrupts the muscle atonia of REM sleep.",
          compare:
            "Fluctuations resemble delirium, but the course is months to years and the other core features accompany them. Hallucinations resemble psychosis, but they are visual, well formed, and come with cognitive and motor signs.",
          deeper:
            "Indicative biomarkers in the 2017 criteria include reduced dopamine transporter uptake in the basal ganglia on SPECT or PET, reduced uptake on cardiac MIBG scintigraphy, and polysomnography confirming REM sleep without atonia. Probable dementia with Lewy bodies needs two core features, or one core feature with an indicative biomarker.",
        },
      },
      { kind: "apply", title: "Stepwise decline", itemId: "m-dem-vascular" },
      {
        kind: "explain",
        title: "Frontotemporal dementia and primary progressive aphasia",
        body:
          "Behavioral variant [[frontotemporal-dementia|frontotemporal dementia]] (bvFTD) often begins before 65 with a change in personality and conduct. The 2011 criteria list six features:\n\nEarly disinhibition (socially inappropriate behavior, impulsive acts). Early apathy or inertia. Early loss of sympathy or empathy. Perseverative, stereotyped, or compulsive behavior (rigid routines, repetitive acts). Hyperorality and dietary change (sweet cravings, overeating). A neuropsychological profile of executive deficits with relatively spared memory and visuospatial function.\n\nThree features make possible bvFTD; functional decline plus frontal or anterior temporal atrophy or hypometabolism make it probable. Insight is usually poor.\n\n[[primary-progressive-aphasia|Primary progressive aphasia]]: a gradually progressive language disorder that is the leading deficit and the main cause of impaired daily living. Variants: nonfluent or agrammatic (effortful, ungrammatical speech), semantic (loss of word meaning), and logopenic (word-finding pauses and poor sentence repetition, often due to Alzheimer pathology).",
        layers: {
          simpler: "A big change in behavior or personality in midlife suggests frontotemporal dementia. A slow, steady loss of language with memory intact suggests primary progressive aphasia.",
          mechanism:
            "The frontal and anterior temporal lobes support social judgment, empathy, motivation, and inhibition, so degeneration there changes behavior before memory. Language variants follow degeneration of left hemisphere language networks: frontal and insular for agrammatic, anterior temporal for semantic, and posterior temporal and parietal for logopenic.",
          compare:
            "Stroke aphasia starts suddenly; progressive aphasia evolves over months to years. Psychiatric illness can resemble bvFTD, but a first change in personality in midlife, with executive deficits and no prior psychiatric history, should prompt a neurological assessment.",
          deeper:
            "Frontotemporal dementia overlaps with motor neuron disease and with atypical parkinsonian syndromes, and a family history is more often present than in late-onset Alzheimer disease. Ask about weakness, swallowing, and relatives with dementia, psychiatric illness, or motor neuron disease.",
        },
      },
      { kind: "apply", title: "Name the syndrome", itemId: "m-dem-bvftd-ft" },
      {
        kind: "summary",
        title: "Key points",
        points: [
          "Alzheimer disease (amnestic): gradual loss of new episodic memory that cues do not rescue; non-amnestic presentations exist.",
          "Vascular cognitive impairment: stepwise or gradual executive slowing, vascular risk factors, infarcts or white matter disease on imaging; mixed pathology is common.",
          "Dementia with Lewy bodies: fluctuation, visual hallucinations, REM sleep behavior disorder, parkinsonism; severe antipsychotic sensitivity.",
          "Behavioral variant frontotemporal dementia: early disinhibition, apathy, loss of empathy, compulsions, dietary change, with executive deficits.",
          "Primary progressive aphasia: language is the leading, progressive deficit (agrammatic, semantic, logopenic).",
        ],
        reviewItemIds: ["m-dem-dlb-features", "m-dem-vascular", "m-dem-bvftd-ft", "m-dem-ad-amnestic", "m-dem-ppa"],
      },
    ],
  },
  {
    id: "l-dem-biomarkers-care",
    moduleId: MID,
    title: "Biomarkers, treatment principles, and safety",
    concept: "Amyloid and tau biomarkers show Alzheimer pathology and matter most in symptomatic patients; anti-amyloid antibodies need biomarker confirmation, early-stage disease, and MRI monitoring for ARIA; and safety, antipsychotic avoidance in Lewy body disease, and caregiver support are core care.",
    minutes: 10,
    meta: meta("l-dem-biomarkers-care", [AA2024, AUR, DLB, CURRIC]),
    steps: [
      {
        kind: "hook",
        title: "A test result without a patient",
        body: "A healthy 66-year-old wants a blood test to find out whether she will get Alzheimer disease like her mother. A 71-year-old with mild memory problems wants the new infusions. A man with Lewy body disease is agitated on a medical ward at night. Each needs the clinician to know what a biomarker shows, what treatment requires, and which common drug could do serious harm.",
      },
      {
        kind: "explain",
        title: "What amyloid and tau biomarkers show",
        body:
          "Alzheimer disease is defined pathologically by amyloid plaques and tau neurofibrillary tangles. Biomarkers detect them in life:\n\nCSF: low amyloid beta 42 (or a low amyloid 42 to 40 ratio) and raised phosphorylated tau.\n\n[[amyloid-pet|Amyloid PET]]: shows plaque in the cortex. Tau PET shows tangles and their spread.\n\nBlood tests: plasma phosphorylated tau and amyloid ratios are increasingly available and accurate in specialist settings.\n\nPrinciples: biomarkers show pathology, not the clinical syndrome. Amyloid pathology begins years before symptoms and is common in older people without symptoms, many of whom never develop dementia, and it can coexist with another cause of the symptoms. So biomarkers are used in people with cognitive symptoms, to support Alzheimer disease as the cause and to decide eligibility for treatment, not to forecast the future of people without symptoms.",
        layers: {
          simpler: "These tests show whether Alzheimer-type changes are in the brain. They are most useful when someone already has symptoms and the question is why.",
          mechanism:
            "As amyloid aggregates into plaques, less soluble amyloid beta 42 reaches the CSF, so CSF levels fall while PET signal rises. Tau released from injured neurons and phosphorylated tau species rise in CSF and blood as tangle pathology develops.",
          compare:
            "Structural MRI shows atrophy and vascular disease but not the molecular cause. FDG-PET shows patterns of reduced metabolism, and dopamine transporter imaging supports Lewy body disease; neither measures amyloid.",
          deeper:
            "The 2024 Alzheimer's Association revised criteria define Alzheimer disease biologically by core biomarkers and stage it separately by clinical severity, but they are not a clinical practice guideline and do not recommend testing cognitively unimpaired people outside research. The 2011 NIA-AA clinical criteria remain the basis for diagnosing dementia due to Alzheimer disease at the bedside.",
        },
      },
      { kind: "predict", title: "The worried well", itemId: "m-dem-biomarker-asymptomatic" },
      {
        kind: "explain",
        title: "Anti-amyloid antibodies: what they require",
        body:
          "[[anti-amyloid-antibody|Anti-amyloid monoclonal antibodies]] such as lecanemab clear amyloid plaques and modestly slow decline in early symptomatic Alzheimer disease. They do not restore lost function. Appropriate use recommendations require:\n\nThe right stage: mild cognitive impairment or mild dementia due to Alzheimer disease.\n\nBiomarker confirmation of amyloid by PET or CSF.\n\nA baseline MRI, reviewed for microhemorrhages, superficial siderosis, prior hemorrhage, or extensive vascular disease that raise risk.\n\nScheduled MRI monitoring for [[aria|amyloid-related imaging abnormalities (ARIA)]] during the early months of treatment: ARIA-E (edema or effusion) and ARIA-H (microhemorrhage or siderosis). ARIA is often asymptomatic but can cause headache, confusion, visual change, or seizures, and is rarely severe.\n\nAPOE genotyping with counseling, because APOE e4 carriers, especially homozygotes, have higher ARIA risk; and caution with anticoagulants, which the recommendations advise against.\n\nSymptomatic treatment remains part of care: [[cholinesterase-inhibitor|cholinesterase inhibitors]] are used in Alzheimer disease and in dementia with Lewy bodies.",
        layers: {
          simpler: "These infusions are only for early Alzheimer disease that has been proven with a scan or spinal fluid test, and they need regular MRI scans to watch for brain swelling or bleeding.",
          mechanism:
            "The antibodies bind aggregated amyloid and promote its clearance. As amyloid is removed from vessel walls as well as plaques, vessels can become leaky, which is thought to underlie ARIA; vessel wall amyloid (cerebral amyloid angiopathy) and APOE e4 increase this risk.",
          compare:
            "Cholinesterase inhibitors boost acetylcholine signaling and give modest symptomatic benefit without changing the underlying pathology. Anti-amyloid antibodies target the pathology but with modest clinical effect and real risks, so the decision is shared and individualized.",
          deeper:
            "Doses, infusion schedules, and exact MRI timing are specialist matters and change with new evidence and drug labels; they are deliberately not taught here. Symptoms of ARIA during treatment need urgent MRI and specialist review.",
        },
      },
      { kind: "apply", title: "Before an infusion", itemId: "m-dem-antiamyloid" },
      {
        kind: "explain",
        title: "Behavior, safety, and the caregiver",
        body:
          "Behavioral symptoms (agitation, hallucinations, sleep disruption) first need a search for a cause: delirium from infection, pain, constipation, urinary retention, dehydration, or a new drug, and environmental triggers. Non-drug approaches come first: routine, a calm and well-lit room, reassurance, glasses and hearing aids, and family presence.\n\nAntipsychotics: in [[dementia-with-lewy-bodies|dementia with Lewy bodies]], severe sensitivity reactions can occur (abrupt worsening of parkinsonism and confusion, sedation, falls, a neuroleptic malignant-like syndrome), so avoid them where possible and involve senior or specialist help if a drug seems unavoidable.\n\nSafety: driving, firearms, cooking and home hazards, wandering, medication supervision, and financial exploitation.\n\nPlanning: advance care planning, a health care proxy, and legal and financial arrangements while the person can still take part.\n\nCaregivers: education, support groups, respite, and attention to their own health and strain.",
        layers: {
          simpler: "When someone with dementia becomes agitated, look for a cause first and try calming measures. Avoid antipsychotics in Lewy body disease. Ask about driving, guns, cooking, money, and how the carer is coping.",
          mechanism:
            "Patients with Lewy body disease have depleted dopaminergic systems, so blocking the remaining dopamine receptors can tip them into severe parkinsonism and confusion. Their cholinergic deficit also makes them vulnerable to anticholinergic drugs.",
          compare:
            "Hallucinations in Lewy body disease are a disease feature, often tolerated or improved with cholinesterase inhibitors and reassurance, not a sign of a separate psychotic illness.",
          deeper:
            "Judgment and financial capacity can fail before memory loss is obvious, which is why scams are an early warning sign. Capacity is decision-specific, so a person with dementia may still be able to make some decisions and not others.",
        },
      },
      { kind: "apply", title: "Agitation on the ward", itemId: "m-dem-antipsychotic" },
      {
        kind: "summary",
        title: "Key points",
        points: [
          "CSF amyloid and tau, amyloid PET, and blood phosphorylated tau show Alzheimer pathology, not the clinical syndrome.",
          "Biomarkers are for symptomatic patients; testing people without symptoms is not recommended outside research.",
          "Anti-amyloid antibodies need early-stage disease, amyloid confirmed by PET or CSF, a baseline MRI, and MRI monitoring for ARIA; APOE e4 and anticoagulation raise concern.",
          "Avoid antipsychotics where possible in dementia with Lewy bodies; look for the cause of agitation first.",
          "Address driving, firearms, home and financial safety, advance care planning, and caregiver support.",
        ],
        reviewItemIds: ["m-dem-biomarker-asymptomatic", "m-dem-antiamyloid", "m-dem-antipsychotic", "m-dem-safety"],
      },
    ],
  },
];

// ===========================================================================
// Glossary additions (ids not in the main glossary or another module)
// ===========================================================================

const TERMS: ModuleContent["terms"] = [
  term("subjective-cognitive-decline", "Subjective cognitive decline", ["SCD"],
    "Feeling that your memory or thinking has got worse when tests are still normal.",
    "Self-reported decline in cognition relative to a previous level, with performance on testing in the normal range for age and education and intact daily function. Its causes include normal aging, mood and sleep problems, and in some people early neurodegenerative disease.",
    undefined,
    "She feels her memory is slipping, but her testing is normal and she runs her business as before: subjective cognitive decline.",
    MID, ["mild-cognitive-impairment", "dementia"]),
  term("episodic-memory", "Episodic memory", [],
    "Memory for personal events and experiences, such as what you did yesterday.",
    "Memory for specific events located in time and place, dependent on the medial temporal lobes and their connections for encoding and storage. Its early failure, with recall not helped by cues, is the typical presentation of Alzheimer disease.",
    undefined,
    "She cannot remember yesterday's visit from her son though she recalls her wedding clearly: an episodic memory deficit.",
    MID, ["alzheimer-disease", "dementia"]),
  term("alzheimer-disease", "Alzheimer disease", ["Alzheimer's disease", "AD"],
    "The most common cause of dementia, usually starting with trouble remembering new things.",
    "A neurodegenerative disease defined by amyloid plaques and tau neurofibrillary tangles. The typical presentation is gradual amnestic decline from medial temporal involvement; non-amnestic presentations begin with language (often logopenic aphasia), visuospatial, or executive deficits. Biomarkers include CSF amyloid and tau, amyloid and tau PET, and plasma phosphorylated tau.",
    "ALTS-hy-mer",
    "Two years of repeating questions, with recall not helped by cues and normal social behavior: amnestic Alzheimer disease.",
    MID, ["dementia", "episodic-memory", "amyloid-pet"]),
  term("vascular-cognitive-impairment", "Vascular cognitive impairment", ["vascular dementia", "VCI"],
    "Problems with thinking caused by strokes or by damage to the small blood vessels of the brain.",
    "Cognitive impairment attributable to cerebrovascular disease, ranging from mild impairment to dementia. Decline may be stepwise after strokes or gradual from small vessel disease, typically with slowed processing, executive dysfunction, and retrieval-type memory problems, supported by infarcts or white matter disease on imaging. Often coexists with Alzheimer pathology.",
    undefined,
    "He got slower and less organized after each small stroke, and MRI shows multiple lacunes: vascular cognitive impairment.",
    MID, ["small-vessel-disease", "lacunar-stroke", "dementia"]),
  term("dementia-with-lewy-bodies", "Dementia with Lewy bodies", ["DLB", "Lewy body dementia"],
    "A type of dementia with good and bad days, seeing things that are not there, acting out dreams, and Parkinson-like stiffness.",
    "A synucleinopathy whose core clinical features are fluctuating cognition, recurrent well-formed visual hallucinations, REM sleep behavior disorder, and parkinsonism. Early deficits are in attention, executive, and visuospatial function. Severe antipsychotic sensitivity is a supportive feature. Indicative biomarkers include reduced dopamine transporter uptake, reduced cardiac MIBG uptake, and polysomnographic REM sleep without atonia.",
    undefined,
    "Patchy days, children in the garden who are not there, years of dream enactment, and a stiff arm: dementia with Lewy bodies.",
    MID, ["parkinsonism", "rem-sleep-behavior-disorder", "dementia"]),
  term("rem-sleep-behavior-disorder", "REM sleep behavior disorder", ["RBD", "dream enactment behavior"],
    "Acting out dreams, such as shouting, punching, or kicking, during sleep.",
    "Loss of the normal muscle atonia of REM sleep, so that people act out dream content, often vigorously. Confirmed by polysomnography showing REM sleep without atonia. Idiopathic RBD often precedes Parkinson disease, dementia with Lewy bodies, or multiple system atrophy by years.",
    undefined,
    "For years he has punched and shouted in his sleep while dreaming of being chased: REM sleep behavior disorder.",
    MID, ["dementia-with-lewy-bodies", "parkinsonism"]),
  term("frontotemporal-dementia", "Frontotemporal dementia", ["FTD", "behavioral variant frontotemporal dementia", "bvFTD", "frontotemporal lobar degeneration"],
    "A dementia that changes personality, behavior, or language, often starting in middle age.",
    "A group of disorders from degeneration of the frontal and anterior temporal lobes. The behavioral variant presents with early disinhibition, apathy, loss of empathy, compulsive behavior, and dietary change, with executive deficits and relatively spared memory and visuospatial function; language variants present as primary progressive aphasia. Overlaps with motor neuron disease and atypical parkinsonism.",
    undefined,
    "A reserved 58-year-old begins making crude remarks, overspending, and eating only sweets: behavioral variant frontotemporal dementia.",
    MID, ["primary-progressive-aphasia", "executive-function", "dementia"]),
  term("primary-progressive-aphasia", "Primary progressive aphasia", ["PPA", "logopenic aphasia", "semantic dementia", "progressive nonfluent aphasia"],
    "A slowly worsening loss of language, with memory and behavior intact at first.",
    "A neurodegenerative syndrome in which language difficulty is the most prominent deficit at onset and the main cause of impaired daily living. Variants: nonfluent or agrammatic, semantic, and logopenic (often due to Alzheimer pathology).",
    undefined,
    "Two years of worsening word-finding pauses and poor sentence repetition with memory intact: primary progressive aphasia.",
    MID, ["aphasia", "frontotemporal-dementia", "alzheimer-disease"]),
  term("amyloid-pet", "Amyloid PET", ["amyloid positron emission tomography", "amyloid scan"],
    "A scan that shows whether amyloid, the protein in Alzheimer plaques, has built up in the brain.",
    "Positron emission tomography with a tracer that binds fibrillar amyloid plaques. A positive scan shows amyloid pathology, which supports Alzheimer disease as the cause of a cognitive syndrome but is also common in cognitively unimpaired older adults. Used, with CSF testing as an alternative, to confirm amyloid before anti-amyloid treatment.",
    undefined,
    "Her amyloid PET is positive, confirming amyloid pathology before anti-amyloid treatment is discussed.",
    MID, ["alzheimer-disease", "anti-amyloid-antibody"]),
  term("anti-amyloid-antibody", "Anti-amyloid antibody", ["anti-amyloid monoclonal antibody", "anti-amyloid therapy"],
    "An infused drug that removes amyloid from the brain to slow early Alzheimer disease.",
    "A monoclonal antibody (for example lecanemab) that binds aggregated amyloid beta and promotes its clearance, modestly slowing decline in early symptomatic Alzheimer disease. Use requires mild cognitive impairment or mild dementia, biomarker confirmation of amyloid, and baseline and scheduled MRI for amyloid-related imaging abnormalities.",
    undefined,
    "Before an anti-amyloid antibody is started, amyloid is confirmed on PET and a baseline MRI is reviewed.",
    MID, ["aria", "amyloid-pet", "alzheimer-disease"]),
  term("aria", "Amyloid-related imaging abnormalities", ["ARIA", "ARIA-E", "ARIA-H"],
    "Swelling or small bleeds in the brain seen on MRI in people treated with anti-amyloid drugs.",
    "MRI changes associated with anti-amyloid antibody treatment: ARIA-E (vasogenic edema or sulcal effusion) and ARIA-H (microhemorrhages or superficial siderosis). Often asymptomatic and detected on scheduled MRI; may cause headache, confusion, visual change, or seizures and is rarely severe. Risk is higher in APOE e4 carriers.",
    "AR-ee-uh",
    "A routine MRI during treatment shows new edema in the occipital lobe though she feels well: ARIA-E.",
    MID, ["anti-amyloid-antibody", "cerebral-microbleeds", "cerebral-amyloid-angiopathy"]),
  term("cholinesterase-inhibitor", "Cholinesterase inhibitor", ["acetylcholinesterase inhibitor"],
    "A medicine that boosts a memory-related brain chemical to ease symptoms of some dementias.",
    "A drug that inhibits acetylcholinesterase in the brain, increasing acetylcholine signaling. Used for symptomatic treatment in Alzheimer disease and dementia with Lewy bodies, with modest benefit and no effect on the underlying pathology. Cholinergic side effects include nausea, bradycardia, and vivid dreams.",
    undefined,
    "A cholinesterase inhibitor reduces his hallucinations and fluctuations in Lewy body disease.",
    MID, ["acetylcholinesterase", "alzheimer-disease", "dementia-with-lewy-bodies"]),
];

// ===========================================================================
// Sources added by this module (verified on the web; see verificationNote)
// ===========================================================================

const SOURCES: ModuleContent["sources"] = [
  {
    id: AAN,
    kind: "guideline",
    citation: "Knopman DS, DeKosky ST, Cummings JL, Chui H, Corey-Bloom J, Relkin N, Small GW, Miller B, Stevens JC. Practice parameter: diagnosis of dementia (an evidence-based review). Report of the Quality Standards Subcommittee of the American Academy of Neurology. Neurology. 2001;56(9):1143-1153. doi:10.1212/wnl.56.9.1143",
    title: "Practice parameter: diagnosis of dementia (an evidence-based review). Report of the Quality Standards Subcommittee of the American Academy of Neurology",
    authors: "Knopman DS, DeKosky ST, Cummings JL, Chui H, Corey-Bloom J, Relkin N, Small GW, Miller B, Stevens JC",
    journal: "Neurology",
    year: 2001,
    doi: "10.1212/wnl.56.9.1143",
    pmid: "11342678",
    url: "https://doi.org/10.1212/wnl.56.9.1143",
    lastVerified: "2026-11-06",
    verificationNote:
      "Title, full author list, journal, year, volume, issue, pages, DOI and PMID confirmed on 2026-11-06 from web search results indexing the PubMed record (11342678), the publisher page, and a reference list reproducing the author list. PubMed and doi.org could not be opened from this environment. Used for the routine evaluation (structural imaging, screening for depression, B12 deficiency, and hypothyroidism). Currency caveat: this is an older practice parameter; biomarker-era guidance has followed.",
    verified: true,
  },
  {
    id: NIAAA,
    kind: "consensus-criteria",
    citation: "McKhann GM, Knopman DS, Chertkow H, et al. The diagnosis of dementia due to Alzheimer's disease: recommendations from the National Institute on Aging-Alzheimer's Association workgroups on diagnostic guidelines for Alzheimer's disease. Alzheimers Dement. 2011;7(3):263-269. doi:10.1016/j.jalz.2011.03.005",
    title: "The diagnosis of dementia due to Alzheimer's disease: recommendations from the National Institute on Aging-Alzheimer's Association workgroups on diagnostic guidelines for Alzheimer's disease",
    authors: "McKhann GM, Knopman DS, Chertkow H, et al.",
    journal: "Alzheimer's & Dementia",
    year: 2011,
    doi: "10.1016/j.jalz.2011.03.005",
    pmid: "21514250",
    url: "https://doi.org/10.1016/j.jalz.2011.03.005",
    lastVerified: "2026-11-06",
    verificationNote:
      "Title, first authors, journal, year, volume, issue, pages, DOI, PMID (21514250) and PMCID (PMC3312024) confirmed on 2026-11-06 from web search results indexing the PubMed record, a bibliographic database, and institutional reprints. PubMed and doi.org could not be opened from this environment. Used for the all-cause dementia criteria and the amnestic and non-amnestic presentations of Alzheimer dementia. Currency caveat: the Alzheimer's Association published revised biological criteria in 2024 (jack2024-ad-criteria).",
    verified: true,
  },
  {
    id: DLB,
    kind: "consensus-criteria",
    citation: "McKeith IG, Boeve BF, Dickson DW, et al. Diagnosis and management of dementia with Lewy bodies: fourth consensus report of the DLB Consortium. Neurology. 2017;89(1):88-100. doi:10.1212/WNL.0000000000004058",
    title: "Diagnosis and management of dementia with Lewy bodies: fourth consensus report of the DLB Consortium",
    authors: "McKeith IG, Boeve BF, Dickson DW, et al.",
    journal: "Neurology",
    year: 2017,
    doi: "10.1212/WNL.0000000000004058",
    pmid: "28592453",
    url: "https://doi.org/10.1212/WNL.0000000000004058",
    lastVerified: "2026-11-06",
    verificationNote:
      "Title, first authors, journal, year, volume, issue, pages, DOI, PMID (28592453) and PMCID (PMC5496518) confirmed on 2026-11-06 from web search results indexing the PubMed record and university repository records (UCL, Newcastle). PubMed and doi.org could not be opened from this environment. Used for the core clinical features, supportive features including severe antipsychotic sensitivity, indicative biomarkers, and the definition of probable DLB.",
    verified: true,
  },
  {
    id: FTD,
    kind: "consensus-criteria",
    citation: "Rascovsky K, Hodges JR, Knopman D, et al. Sensitivity of revised diagnostic criteria for the behavioural variant of frontotemporal dementia. Brain. 2011;134(Pt 9):2456-2477. doi:10.1093/brain/awr179",
    title: "Sensitivity of revised diagnostic criteria for the behavioural variant of frontotemporal dementia",
    authors: "Rascovsky K, Hodges JR, Knopman D, et al.",
    journal: "Brain",
    year: 2011,
    doi: "10.1093/brain/awr179",
    pmid: "21810890",
    url: "https://doi.org/10.1093/brain/awr179",
    lastVerified: "2026-11-06",
    verificationNote:
      "Title, first authors, journal, year, volume, issue, pages, DOI, PMID (21810890) and PMCID (PMC3170532) confirmed on 2026-11-06 from web search results indexing the PubMed record, PubMed Central, and institutional repositories. PubMed and doi.org could not be opened from this environment. Used for the six features of possible bvFTD and the requirements for probable bvFTD.",
    verified: true,
  },
  {
    id: PPA,
    kind: "consensus-criteria",
    citation: "Gorno-Tempini ML, Hillis AE, et al. Classification of primary progressive aphasia and its variants. Neurology. 2011;76(11):1006-1014. doi:10.1212/WNL.0b013e31821103e6",
    title: "Classification of primary progressive aphasia and its variants",
    authors: "Gorno-Tempini ML, Hillis AE, et al.",
    journal: "Neurology",
    year: 2011,
    doi: "10.1212/WNL.0b013e31821103e6",
    pmid: "21325651",
    url: "https://doi.org/10.1212/WNL.0b013e31821103e6",
    lastVerified: "2026-11-06",
    verificationNote:
      "Title, first two authors, journal, year, volume, issue, pages, DOI, PMID (21325651) and PMCID (PMC3059138) confirmed on 2026-11-06 from web search results indexing the PubMed record, PubMed Central, and the Association for Frontotemporal Degeneration reprint. PubMed and doi.org could not be opened from this environment. Used for the root PPA criteria and the three variants at a recognition level.",
    verified: true,
  },
  {
    id: AUR,
    kind: "guideline",
    citation: "Cummings J, Apostolova L, Rabinovici GD, et al. Lecanemab: appropriate use recommendations. J Prev Alzheimers Dis. 2023;10(3):362-377. doi:10.14283/jpad.2023.30",
    title: "Lecanemab: appropriate use recommendations",
    authors: "Cummings J, Apostolova L, Rabinovici GD, et al.",
    journal: "The Journal of Prevention of Alzheimer's Disease",
    year: 2023,
    doi: "10.14283/jpad.2023.30",
    pmid: "37357276",
    url: "https://doi.org/10.14283/jpad.2023.30",
    lastVerified: "2026-11-06",
    verificationNote:
      "Title, first authors, journal, year, volume, issue, pages, DOI and PMID confirmed on 2026-11-06 from web search results indexing the PubMed record (37357276), the journal site, and an institutional repository. PubMed and doi.org could not be opened from this environment. Used only for principles (early symptomatic stage, amyloid confirmation, baseline and monitoring MRI for ARIA, APOE genotyping, avoiding anticoagulated patients); no doses or MRI schedules are quoted. Currency caveat: recommendations for other anti-amyloid antibodies and later updates exist.",
    verified: true,
  },
  {
    id: AA2024,
    kind: "consensus-criteria",
    citation: "Jack CR Jr, Andrews JS, Beach TG, et al. Revised criteria for diagnosis and staging of Alzheimer's disease: Alzheimer's Association Workgroup. Alzheimers Dement. 2024;20(8):5143-5169. doi:10.1002/alz.13859",
    title: "Revised criteria for diagnosis and staging of Alzheimer's disease: Alzheimer's Association Workgroup",
    authors: "Jack CR Jr, Andrews JS, Beach TG, et al.",
    journal: "Alzheimer's & Dementia",
    year: 2024,
    doi: "10.1002/alz.13859",
    pmid: "38934362",
    url: "https://doi.org/10.1002/alz.13859",
    lastVerified: "2026-11-06",
    verificationNote:
      "Title, first authors, journal, year, volume, issue, pages, DOI and PMID confirmed on 2026-11-06 from web search results indexing the MEDLINE record (38934362), university repositories, and the Alzheimer's Association announcement. PubMed and doi.org could not be opened from this environment. Used for biomarker principles (core amyloid and tau biomarkers including blood tests, biological definition with separate clinical staging, not a practice guideline, testing of cognitively unimpaired people not recommended outside research).",
    verified: true,
  },
];

// ===========================================================================
// Module
// ===========================================================================

export const CONTENT: ModuleContent | null = {
  moduleId: MID,
  module: {
    title: "Cognitive and behavioral neurology",
    summary:
      "From a cognitive complaint to a syndrome: subjective decline, mild cognitive impairment, and dementia, the treatable contributors and a sensible first workup, the main syndromes by their earliest features (Alzheimer disease, vascular cognitive impairment, dementia with Lewy bodies, behavioral variant frontotemporal dementia, and primary progressive aphasia), and the principles of amyloid and tau biomarkers, anti-amyloid antibodies, antipsychotic avoidance in Lewy body disease, safety, and caregiver support.",
    objectives: [
      ["differential", "Distinguish subjective cognitive decline, mild cognitive impairment, and dementia, using daily function from an informant as the dividing line."],
      ["investigation-selection", "Plan a first assessment for cognitive decline: informant history, cognitive testing, medication review, screening for depression, sleep, sensory loss, B12 deficiency, and hypothyroidism, and structural imaging."],
      ["differential", "Recognize Alzheimer disease, vascular cognitive impairment, dementia with Lewy bodies, behavioral variant frontotemporal dementia, and primary progressive aphasia by their earliest features."],
      ["interpretation", "Explain what amyloid and tau biomarkers show and what anti-amyloid antibodies require: early-stage disease, biomarker confirmation, and MRI monitoring for ARIA."],
      ["emergency", "Avoid antipsychotics where possible in dementia with Lewy bodies, and address safety and caregiver support."],
    ],
    prerequisites: ["x-mental-status"],
    lessons: ["l-dem-syndrome", "l-dem-syndromes", "l-dem-biomarkers-care"],
    challengeItems: ["m-dem-workup", "m-dem-vascular", "m-dem-bvftd-ft", "m-dem-antipsychotic"],
    skills: ["differential", "investigation-selection", "history-exam", "interpretation", "uncertainty", "emergency"],
    minutes: 30,
    sources: [CURRIC, AAN, NIAAA, DLB, FTD, PPA, AUR, AA2024, MOCA],
  },
  lessons: LESSONS,
  items: ITEMS,
  terms: TERMS,
  sources: SOURCES,
};

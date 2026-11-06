// Module c-fnd: functional neurological disorder. Lesson 1 makes the diagnosis on positive
// signs (weakness, tremor, face, attacks), places investigations on clinical grounds, and
// separates FND from feigning. Lesson 2 explains the diagnosis and outlines treatment.
// Basic functional signs, functional seizure features, and functional gait are introduced in
// x-symptoms-signs, c-epilepsy-mimics, and x-coordination-gait; this module goes further.

import type { ModuleContent } from "./types";
import { meta, term } from "./types";

const M = "c-fnd";
const FND = "espay2018-fnd";
const POS = "daum2014-positive-signs";
const CURR = "safdieh2019-curriculum";
const HALLETT = "hallett2022-fnd";
const PHYSIO = "nielsen2015-physio";
const ABD = "sonoo2004-abductor";
const FACE = "baizabal2017-facial-spasm";
const TREMOR = "bhatia2018-tremor";

export const CONTENT: ModuleContent = {
  moduleId: M,
  module: {
    summary:
      "Functional neurological disorder is a common, real disorder of nervous system functioning. It is diagnosed by positive clinical signs (Hoover and hip abductor signs, entrainment, functional facial spasm, functional seizure features), not by exclusion, and it is explained to the patient clearly and treated with specialist rehabilitation.",
    objectives: [
      ["history-exam", "Elicit and interpret positive signs of functional weakness and tremor: Hoover sign, the hip abductor sign, drift without pronation, give-way weakness, and the entrainment test."],
      ["differential", "Separate functional neurological disorder from malingering and factitious disorder, and recognize when functional and structural disease coexist."],
      ["investigation-selection", "Choose investigations on clinical grounds, without using normal results as the basis of the diagnosis."],
      ["history-exam", "Explain the diagnosis in plain, blame-free language, using the patient's own positive sign, and outline the main treatments."],
      ["uncertainty", "State why current DSM-5-TR criteria do not require an identified psychological stressor."],
    ],
    lessons: ["l-fnd-diagnosis", "l-fnd-explain"],
    challengeItems: ["m-fnd-tests", "m-fnd-entrain", "m-fnd-malinger", "m-fnd-stressor", "p-hx-hoover"],
    skills: ["history-exam", "differential", "investigation-selection", "uncertainty"],
    minutes: 16,
    sources: [FND, POS, HALLETT, PHYSIO, ABD, FACE, TREMOR, CURR],
  },
  lessons: [
    {
      id: "l-fnd-diagnosis",
      moduleId: M,
      title: "Making the diagnosis on positive signs",
      concept:
        "Functional neurological disorder is ruled in by positive signs showing that the nervous system can work normally, not ruled in by excluding everything else.",
      minutes: 9,
      meta: meta("l-fnd-diagnosis", [FND, POS, ABD, HALLETT, FACE, TREMOR]),
      steps: [
        {
          kind: "hook",
          title: "\"They found nothing wrong\"",
          body:
            "A synthetic patient, 37, has had a weak right leg for six weeks. She has had two MRI scans, blood tests, and nerve conduction studies, all normal. Her discharge letter says \"no organic cause found.\" She still cannot walk to the shops, and she now wonders whether anyone believes her. Nobody has examined her for the signs that would have given her a diagnosis on the first day.",
        },
        {
          kind: "explain",
          title: "Positive signs of functional weakness",
          body:
            "[[functional-neurological-disorder|Functional neurological disorder]] (FND) is a disorder of how the nervous system functions, not of its structure. The diagnosis is made by finding positive signs: features that show a limb can work normally during automatic movement, or a pattern that does not fit structural disease. Normal tests are not the evidence.\n\n[[hoover-sign|Hoover sign]]: hip extension of the weak leg is weak on request but returns when the patient flexes the other hip against resistance, because the brain extends one hip automatically while the other lifts.\n\n[[hip-abductor-sign|Hip abductor sign]]: the patient abducts each leg against the examiner's hands. In functional weakness, when the patient tries to abduct the \"weak\" leg, the healthy leg slides inward instead of bracing; when the healthy leg is abducted, the \"weak\" leg braces firmly outward. In structural weakness the pattern is the reverse: the healthy leg braces, and the weak leg cannot.\n\n[[drift-without-pronation|Drift without pronation]]: with arms outstretched, palms up, eyes closed, the arm drifts down while the palm stays facing up. Upper motor neuron weakness usually makes the forearm turn palm down (pronate) as it drifts.\n\n[[give-way-weakness|Give-way weakness]]: strength collapses suddenly after a moment of normal power. It is common in FND but also occurs with pain, fatigue, or poor understanding of the task, so it is supportive rather than decisive.\n\nIn walking, a functional leg is often dragged behind with the foot sliding along the floor, rather than swung outward as in a spastic leg.",
          layers: {
            simpler: "A functional limb is not broken; it is not being used properly when the patient tries. Tests like Hoover sign show the limb working well when the brain uses it automatically.",
            mechanism:
              "Voluntary movement depends on attention and on a sense of being in control of the movement. In FND, focusing attention on a limb disrupts its control, while automatic movements, such as bracing one leg as the other moves, run on normal pathways. Positive signs exploit that difference between attended and automatic movement.",
            compare:
              "Hoover sign tests hip extension; the hip abductor sign tests hip abduction. Both compare voluntary strength with automatic strength in the same leg. In structural weakness, both voluntary and automatic movement are weak, and effort-independent signs (reflexes, plantar response) may be abnormal.",
            deeper:
              "Signs differ in how much weight they carry. Hoover and the hip abductor sign are specific in published series; give-way weakness is the least specific. Positive signs are evidence for FND, not proof against other disease: a person can have a positive Hoover sign and multiple sclerosis. Strong hip muscles can make Hoover sign hard to read, which is one reason to know a second test.",
          },
        },
        { kind: "predict", title: "Read the hip abductor sign", itemId: "m-fnd-abductor" },
        {
          kind: "explain",
          title: "Tremor, face, and attacks",
          body:
            "[[functional-tremor|Functional tremor]] often starts suddenly, varies in frequency and direction, and lessens when the patient is distracted. The [[entrainment-test|entrainment test]]: ask the patient to copy a rhythm with the unaffected hand, tapping at a different speed from the tremor. A functional tremor tends to shift to the new rhythm (entrain), pause, or the patient cannot copy the rhythm while the tremor continues. Structural tremors such as [[essential-tremor|essential tremor]] keep their own frequency.\n\n[[functional-facial-spasm|Functional facial spasm]] is usually a sustained (tonic) pull of the lower face, often the lip drawn down and to one side, sometimes with jaw deviation. It differs from [[hemifacial-spasm|hemifacial spasm]], which brings brief twitches that usually start around the eye and spread down the same side, often with the eyebrow rising as the eye closes.\n\n[[functional-seizure|Functional seizures]] have their own positive features (long, fluctuating events, eyes closed, side-to-side movements) and are best confirmed by [[video-eeg|video-EEG]] of a typical event, as covered in the epilepsy mimics module.",
          layers: {
            simpler: "A functional tremor follows the beat you ask the other hand to tap; an essential tremor ignores it.",
            mechanism:
              "The brain struggles to run two different rhythms at once in the two hands. A tremor generated by a structural oscillator keeps its own frequency, while a functional tremor depends on the same voluntary motor systems that are busy with the cued rhythm, so it is pulled into that rhythm or stops.",
            compare:
              "Essential tremor: gradual onset, consistent frequency, action tremor of both hands, not entrained. Parkinsonian rest tremor: at rest, damped by movement, re-emerges after a pause. Functional tremor: abrupt onset, variable, distractible, entrains.",
            deeper:
              "Combinations matter more than any one sign. Several positive features across examinations, rather than a single odd finding, give the diagnosis its strength. Record which signs you elicited, exactly as you did them, so the next clinician and the patient can see the basis of the diagnosis.",
          },
        },
        { kind: "apply", title: "Interpret the tapping test", itemId: "m-fnd-entrain" },
        {
          kind: "explain",
          title: "Tests, coexisting disease, and what FND is not",
          body:
            "Investigations are chosen on clinical grounds, as for any patient. Test when the history or effort-independent signs (an extensor plantar, a reflex asymmetry, a sensory level with sphincter change, papilledema) point to another disorder, not to \"rule everything out.\" A normal scan does not make the diagnosis, and an incidental abnormality does not undo it.\n\nFND commonly coexists with other neurological disease, such as epilepsy, multiple sclerosis, migraine, or stroke. Positive functional signs in one limb do not explain an extensor plantar in the same limb.\n\nFND is not feigning. In FND the symptoms are experienced as involuntary. [[malingering|Malingering]] is the deliberate production or exaggeration of symptoms for an external reward, such as compensation; it is a behavior, not a medical diagnosis. [[factitious-disorder|Factitious disorder]] is deliberate deception to be seen as ill, without an obvious external reward. A positive Hoover sign shows a mismatch between voluntary and automatic movement; it says nothing about intent.",
          layers: {
            simpler: "Use tests to look for other problems when the examination suggests them, not to prove FND. Inconsistency on examination is part of FND, not evidence of lying.",
            mechanism:
              "Positive signs reveal how the nervous system is functioning; they cannot reveal what a person intends. Intent can only be shown by evidence outside the examination room, which is why a clinician who calls a patient a malingerer from a Hoover sign has overstepped the evidence.",
            compare:
              "FND: symptoms involuntary, no deliberate deception. Factitious disorder: deliberate deception, motivated by being seen as ill. Malingering: deliberate deception for external gain. The first is common in neurology clinics; the other two are much less common.",
            deeper:
              "The diagnosis is most secure when it rests on positive signs, and least secure when the label is applied because tests are normal. Keep the diagnosis open to revision when new effort-independent signs appear.",
          },
        },
        { kind: "apply", title: "Not the same as faking", itemId: "m-fnd-malinger" },
        {
          kind: "summary",
          title: "Key points",
          points: [
            "FND is ruled in by positive signs: Hoover sign, the hip abductor sign, drift without pronation, a dragged leg, entrainment of tremor, and functional seizure features.",
            "Give-way weakness is supportive but the least specific of the weakness signs.",
            "Functional facial spasm is a sustained pull of the lower lip and jaw; hemifacial spasm is twitching that starts around the eye.",
            "Choose tests on clinical grounds; normal results do not make the diagnosis, and FND can coexist with other neurological disease.",
            "FND is not feigning. Malingering and factitious disorder involve deliberate deception; positive signs say nothing about intent.",
          ],
          reviewItemIds: ["m-fnd-abductor", "m-fnd-signs", "m-fnd-hoover", "m-fnd-entrain", "m-fnd-face", "m-fnd-malinger", "m-fnd-tests"],
        },
      ],
    },
    {
      id: "l-fnd-explain",
      moduleId: M,
      title: "Explaining and treating FND",
      concept:
        "A clear, believable explanation built on the patient's own positive sign is the first step of treatment, followed by specialist rehabilitation.",
      minutes: 7,
      meta: meta("l-fnd-explain", [FND, HALLETT, PHYSIO]),
      steps: [
        {
          kind: "hook",
          title: "Two ways to say it",
          body:
            "Clinician A says: \"Good news, your scans are normal and there is nothing wrong with your nervous system. It may be stress.\" Clinician B says: \"You have functional neurological disorder. It is common, it is real, and it can get better. Let me show you what I found on your examination.\" Both mean well. Only one gives the patient a diagnosis.",
        },
        {
          kind: "explain",
          title: "How to explain the diagnosis",
          body:
            "Start with what the patient has, not with what they do not have. Name it: functional neurological disorder (or functional leg weakness, functional tremor, functional seizures). Then cover a few points in plain words:\n\n- It is common, and you see it often.\n- It is real and not imagined; the symptoms are not under voluntary control.\n- It is a problem with how the nervous system is working, not damage to it, so it has the potential to improve.\n- Show the patient their own positive sign. For example, demonstrate Hoover sign: \"When you try to push down, the leg is weak; when you lift the other leg, it pushes down strongly. That tells me the connections are intact, and the problem is getting the movement started on purpose.\"\n- Explain what the tests were for, and what it is not (for example, not multiple sclerosis or stroke).\n\nAvoid words that imply blame or doubt: \"nothing wrong,\" \"all in your head,\" \"hysterical,\" \"putting it on.\" Do not lead with stress as the cause. Under DSM-5 and the current DSM-5-TR, the criteria for functional neurological symptom disorder no longer require an identified psychological stressor; stressors can be relevant for some patients and are explored over time, not demanded at diagnosis.",
          layers: {
            simpler: "Tell the patient what they have, that it is common and real and can improve, and show them the sign that proves the leg can work.",
            mechanism:
              "Patients who do not accept a diagnosis rarely engage with treatment. Seeing their own limb work during a positive sign makes the explanation concrete and shows that the clinician found something, rather than nothing.",
            compare:
              "Older criteria required a psychological stressor, which made diagnosis depend on finding one and implied that patients without one did not qualify. Current criteria rest on clinical findings that are incompatible with recognized neurological disease, and stressors are recorded as a specifier, if present.",
            deeper:
              "Written information and a follow-up plan reinforce a spoken explanation. If the patient asks whether it is psychological, an honest answer is that the brain and mind are not separate, that many factors (including illness, injury, pain, and sometimes stress) can trigger the disorder, and that treatment works on how the nervous system is functioning now.",
          },
        },
        { kind: "predict", title: "Choose your first sentence", itemId: "m-fnd-opening" },
        {
          kind: "explain",
          title: "Treatment principles",
          body:
            "Treatment is tailored and often multidisciplinary.\n\nSpecialist physiotherapy, for motor symptoms, uses education, retraining of movement, and self-management. Movement is retrained with attention directed away from the affected limb and toward automatic patterns (walking to a rhythm, focusing on the goal rather than on the leg), building on what the positive signs showed works.\n\nPsychological therapy, where relevant, addresses factors that maintain symptoms, such as fear of symptoms, avoidance, and coexisting anxiety, depression, or trauma. It is a main treatment for functional seizures.\n\nOccupational therapy helps with daily activities, fatigue, and return to work or study.\n\nComorbid pain, fatigue, sleep problems, and mood disorders are treated in their own right. Medications that were started for a mistaken diagnosis (for example antiseizure drugs for functional seizures alone) are reviewed.",
          layers: {
            simpler: "Physiotherapy retrains movement, psychological therapy helps when thoughts, fears, or mood keep symptoms going, and occupational therapy helps with daily life.",
            mechanism:
              "Excessive attention to a limb and fearful prediction of symptoms are thought to maintain FND. Rehabilitation shifts attention away from the limb, rebuilds automatic movement, and reduces avoidance, so normal control can return.",
            compare:
              "Conventional strengthening exercises for a weak limb assume weak muscles. In FND the muscles and pathways are intact, so treatment targets how movement is generated and how attention is focused, not muscle bulk.",
            deeper:
              "Consensus physiotherapy recommendations emphasize a positive, nonjudgmental setting, goals the patient chooses, and caution with aids and splints that may reinforce abnormal movement patterns, balanced against safety. Outcomes vary; earlier diagnosis and engagement with treatment are thought to help.",
          },
        },
        { kind: "apply", title: "Pick the physiotherapy approach", itemId: "m-fnd-physio" },
        {
          kind: "summary",
          title: "Key points",
          points: [
            "Open with the diagnosis: name it, say it is common, real, and potentially reversible.",
            "Show the patient their own positive sign to make the explanation concrete.",
            "Avoid blaming or doubting language, and do not lead with stress.",
            "DSM-5 and DSM-5-TR criteria do not require an identified psychological stressor.",
            "Treatment: specialist physiotherapy, psychological therapy where relevant, occupational therapy, and management of comorbid symptoms.",
          ],
          reviewItemIds: ["m-fnd-opening", "m-fnd-words", "m-fnd-stressor", "m-fnd-physio"],
        },
      ],
    },
  ],
  items: [
    {
      id: "m-fnd-abductor",
      version: 1,
      format: "mcq",
      skill: "history-exam",
      modules: [M],
      difficulty: 2,
      presentation: "leg-weakness-abduction-test",
      usage: ["lesson", "review"],
      vignette:
        "A 41-year-old has had a weak right leg for three weeks. Lying on her back, she is asked to abduct each leg against the examiner's hands, placed on the outside of both legs. When she tries to abduct the right leg it barely moves, and her left leg slides inward instead of bracing. When she abducts the left leg, the right leg pushes firmly outward against the examiner's hand.",
      stem: "What is the best interpretation?",
      options: [
        { id: "a", text: "A positive hip abductor sign, supporting functional right leg weakness", correct: true, feedback: "Right. The \"weak\" leg braces strongly when abduction is automatic, and the healthy leg fails to brace when the weak leg is tried." },
        { id: "b", text: "Right hip abductor weakness from an L5 radiculopathy", tag: "misconception", feedback: "Structural weakness affects automatic bracing too; a radiculopathy would not let the right leg push out strongly while the left is abducted." },
        { id: "c", text: "A normal response: the opposite leg always slides inward", tag: "knowledge-gap", feedback: "Normally the opposite leg braces to stabilize the pelvis. In structural weakness the healthy leg still braces when the weak leg is tried." },
        { id: "d", text: "Proof that she is exaggerating her weakness", tag: "misconception", feedback: "The sign shows a mismatch between voluntary and automatic movement. It says nothing about intent." },
      ],
      reasoning: {
        stem: "Which observation carries the most weight?",
        options: [
          { id: "r1", text: "The right leg pushes firmly outward while she abducts the left leg", correct: true, feedback: "Strong automatic abduction of the \"weak\" leg is the positive finding." },
          { id: "r2", text: "The right leg barely moves when she is asked to abduct it", feedback: "Weak voluntary abduction occurs in both functional and structural weakness." },
          { id: "r3", text: "The weakness has lasted three weeks", feedback: "Duration does not separate functional from structural weakness." },
        ],
      },
      rationale:
        "The [[hip-abductor-sign|hip abductor sign]] compares voluntary and automatic abduction. Abducting one leg against resistance makes the other hip abductors contract automatically to stabilize the pelvis. In functional weakness, the \"weak\" leg braces strongly when the healthy leg is abducted, while the healthy leg slides inward when the weak leg is tried. In structural weakness the reverse occurs. Like [[hoover-sign|Hoover sign]], it is a positive sign for [[functional-neurological-disorder|FND]], not a judgment about intent.",
      meta: meta("m-fnd-abductor", [ABD, POS, FND]),
    },
    {
      id: "m-fnd-signs",
      version: 1,
      format: "multi-select",
      skill: "history-exam",
      modules: [M],
      difficulty: 2,
      presentation: "left-hemiparesis-month",
      usage: ["lesson", "review"],
      vignette: "A 38-year-old has had weakness of the left arm and leg for a month.",
      stem: "Select the findings that are positive signs of functional weakness.",
      options: [
        { id: "a", text: "Weak left hip extension on request that becomes strong when she flexes the right hip against resistance", correct: true },
        { id: "b", text: "With arms outstretched and palms up, the left arm drifts down while the palm stays facing up", correct: true },
        { id: "c", text: "Left leg strength collapses suddenly after a moment of full power, each time it is tested", correct: true },
        { id: "d", text: "The left leg is dragged behind, with the foot sliding along the floor", correct: true },
        { id: "e", text: "Left extensor plantar response", tag: "misconception", feedback: "An extensor plantar is an effort-independent upper motor neuron sign. It points to structural disease, which can coexist with FND." },
        { id: "f", text: "Normal MRI of the brain and cervical spine", tag: "weak-reasoning", feedback: "Normal imaging is not a positive sign; many disorders have a normal MRI." },
        { id: "g", text: "A stressful divorce last year", tag: "misconception", feedback: "Stressors are common in everyone and are not required for the diagnosis." },
      ],
      rationale:
        "Positive signs of functional weakness show that the limb can work during automatic movement or that the pattern fits no structural lesion: [[hoover-sign|Hoover sign]], [[drift-without-pronation|drift without pronation]], [[give-way-weakness|give-way weakness]] (supportive but the least specific), and a dragged leg. An extensor plantar argues for a structural lesion and must be explained on its own terms. Normal tests and stressors are not positive evidence.",
      meta: meta("m-fnd-signs", [POS, FND]),
    },
    {
      id: "m-fnd-hoover",
      version: 1,
      format: "free-text",
      skill: "history-exam",
      modules: [M],
      difficulty: 2,
      presentation: "heavy-right-leg",
      usage: ["lesson", "review"],
      vignette:
        "A 45-year-old has a heavy, weak right leg. Lying on his back with the examiner's hand under his right heel, he cannot press the heel down when asked. He is then asked to lift his straight left leg against resistance, and the examiner feels the right heel press firmly down into the hand.",
      stem: "Name this sign and say what it supports.",
      placeholder: "Name the sign and what it supports",
      answer: {
        full: [
          {
            id: "hoover-functional",
            label: "Hoover sign, supporting functional weakness",
            patterns: ["hoover + functional", "hoover + fnd", "hoover + non organic", "hoover + nonorganic", "hoover + conversion"],
          },
        ],
        partial: [
          { concept: { id: "hoover", label: "Hoover sign", patterns: ["hoover"] }, credit: 0.7, feedback: "Yes, Hoover sign. Add what it supports: functional leg weakness." },
          { concept: { id: "functional", label: "Functional weakness", patterns: ["functional weakness", "functional neurological disorder", "functional leg weakness"] }, credit: 0.4, feedback: "Right interpretation. The sign is Hoover sign: hip extension returns during contralateral hip flexion." },
        ],
        wrong: [
          { concept: { id: "abductor", label: "Hip abductor sign", patterns: ["abductor sign", "hip abductor"] }, tag: "terminology", feedback: "The hip abductor sign tests abduction. This test compares voluntary and automatic hip extension: Hoover sign." },
          { concept: { id: "babinski", label: "Babinski sign", patterns: ["babinski", "plantar response", "extensor plantar"] }, tag: "terminology", feedback: "Babinski sign is the plantar response. This is Hoover sign." },
          { concept: { id: "feigning", label: "Feigning", patterns: ["feigning", "faking", "malingering", "putting it on", "exaggerating"] }, tag: "misconception", feedback: "Hoover sign shows a mismatch between voluntary and automatic movement. It says nothing about intent." },
        ],
      },
      modelAnswer: "Hoover sign: hip extension returns during contralateral hip flexion, a positive sign supporting functional leg weakness.",
      rationale:
        "When one hip flexes against resistance, the other hip extends automatically to anchor the pelvis. Weak voluntary hip extension that becomes strong in this automatic setting is a positive [[hoover-sign|Hoover sign]], supporting [[functional-neurological-disorder|functional]] weakness. In structural weakness, automatic extension of the weak leg is weak too.",
      meta: meta("m-fnd-hoover", [POS, FND]),
    },
    {
      id: "m-fnd-entrain",
      version: 1,
      format: "mcq",
      skill: "history-exam",
      modules: [M],
      difficulty: 2,
      presentation: "sudden-onset-hand-tremor",
      usage: ["lesson", "review", "challenge"],
      vignette:
        "A 33-year-old has a right hand tremor that began suddenly two months ago. Asked to copy the examiner, tapping a slow steady rhythm with her left hand, she does so, and the right hand tremor slows to the same rhythm. When she stops tapping, the tremor returns at its former speed.",
      stem: "What does this finding indicate?",
      options: [
        { id: "a", text: "Entrainment, a positive sign of functional tremor", correct: true, feedback: "Right. The tremor took on the rhythm of the other hand, which structural tremors do not do." },
        { id: "b", text: "Essential tremor, which typically changes speed to match activity in the other hand", tag: "misconception", feedback: "Essential tremor keeps its own frequency regardless of a rhythm tapped by the other hand." },
        { id: "c", text: "A parkinsonian rest tremor re-emerging after movement", tag: "knowledge-gap", feedback: "Re-emergent rest tremor returns after a pause in posture; it is not pulled into a rhythm tapped by the other hand." },
        { id: "d", text: "Evidence that she is producing the tremor deliberately", tag: "misconception", feedback: "Entrainment shows the tremor uses voluntary motor systems, not that the patient intends it." },
      ],
      rationale:
        "In the [[entrainment-test|entrainment test]] the patient taps a different rhythm with the unaffected hand. A [[functional-tremor|functional tremor]] tends to take on the cued rhythm, pause, or the patient cannot copy the rhythm. Structural tremors, such as [[essential-tremor|essential tremor]], keep their own frequency. Abrupt onset, variability, and distractibility add support.",
      meta: meta("m-fnd-entrain", [FND, HALLETT, TREMOR]),
    },
    {
      id: "m-fnd-face",
      version: 1,
      format: "mcq",
      skill: "differential",
      modules: [M],
      difficulty: 2,
      presentation: "facial-spasm-episodes",
      usage: ["review"],
      vignette: "A 29-year-old has episodes in which the left side of her face contracts. Between episodes the face looks normal.",
      stem: "Which feature most favors functional facial spasm over hemifacial spasm?",
      options: [
        { id: "a", text: "A sustained pull of the left lower lip downward and outward, with the jaw pushed to the left", correct: true, feedback: "Right. Tonic lower face contraction with the mouth angle pulled down is typical of functional facial spasm." },
        { id: "b", text: "Brief twitches that begin around the left eye and spread to the cheek and mouth", tag: "knowledge-gap", feedback: "Twitching that starts around the eye and spreads down the same side is typical of hemifacial spasm." },
        { id: "c", text: "The left eyebrow rises as the left eye closes during a spasm", tag: "knowledge-gap", feedback: "Brow elevation during eye closure (the \"other Babinski sign\") favors hemifacial spasm." },
        { id: "d", text: "Contractions that continue during sleep", tag: "knowledge-gap", feedback: "Persistence in sleep is a feature of hemifacial spasm, not of functional spasm." },
      ],
      rationale:
        "[[functional-facial-spasm|Functional facial spasm]] is usually tonic, often confined to the lower face, with the mouth angle pulled down and sometimes jaw deviation. [[hemifacial-spasm|Hemifacial spasm]], often from vascular compression of the facial nerve, causes brief clonic twitches that usually begin around the eye and spread down one side, with the eyebrow rising as the eye closes. Recognizing the functional pattern avoids unnecessary procedures and allows the right treatment.",
      meta: meta("m-fnd-face", [FACE, FND]),
    },
    {
      id: "m-fnd-malinger",
      version: 1,
      format: "mcq",
      skill: "differential",
      modules: [M],
      difficulty: 2,
      presentation: "weakness-insurance-letter",
      usage: ["lesson", "review", "challenge"],
      vignette:
        "A 52-year-old has had right arm weakness since a minor workplace fall two months ago. Examination shows drift without pronation and give-way weakness, with normal reflexes. His employer's insurer asks the team to state whether he is \"genuinely ill or malingering.\"",
      stem: "Which statement is most accurate?",
      options: [
        { id: "a", text: "The findings support functional weakness, in which symptoms are experienced as involuntary; the examination cannot establish deliberate deception", correct: true, feedback: "Right. Positive signs show how the nervous system is working, not what a person intends." },
        { id: "b", text: "Inconsistency on examination with a pending claim shows malingering", tag: "misconception", feedback: "Inconsistency between voluntary and automatic movement is the basis of FND diagnosis. A claim does not convert it into proof of deception." },
        { id: "c", text: "This is factitious disorder, because he stands to gain compensation", tag: "terminology", feedback: "Deception for external gain is malingering. Factitious disorder is deception to be seen as ill, without an obvious external reward. Neither is shown here." },
        { id: "d", text: "Functional disorder and malingering are the same thing described in kinder language", tag: "misconception", feedback: "They differ in intent: FND symptoms are involuntary, while malingering is deliberate." },
      ],
      rationale:
        "[[functional-neurological-disorder|Functional neurological disorder]] is diagnosed on positive signs and its symptoms are involuntary. [[malingering|Malingering]] is deliberate production of symptoms for external gain, and [[factitious-disorder|factitious disorder]] is deliberate deception to assume the sick role. Positive functional signs reveal a mismatch between voluntary and automatic movement but cannot reveal intent; that would require evidence outside the clinical examination.",
      meta: meta("m-fnd-malinger", [FND, HALLETT]),
    },
    {
      id: "m-fnd-tests",
      version: 1,
      format: "select-tests",
      skill: "investigation-selection",
      modules: [M],
      difficulty: 3,
      presentation: "functional-signs-plus-upgoing-toe",
      usage: ["lesson", "review", "challenge"],
      vignette:
        "A 44-year-old with a known diagnosis of functional leg weakness, made two years ago on a positive Hoover sign, reports that her left leg has become weaker over three weeks. Hoover sign is again positive on the left. The left knee jerk is now brisker than the right, and the left plantar response is extensor. Both were normal at diagnosis.",
      stem: "Classify these investigations.",
      options: [
        { id: "mri", label: "MRI of the brain and spinal cord", category: "necessary", why: "A new extensor plantar and reflex asymmetry are effort-independent upper motor neuron signs that FND does not explain." },
        { id: "bloods", label: "Basic blood tests, including blood count, glucose, and B12", category: "reasonable", why: "Cheap, and relevant to a new upper motor neuron picture, but they do not replace imaging." },
        { id: "eeg", label: "EEG", category: "unnecessary", why: "There are no attacks or episodes of altered awareness to investigate." },
        { id: "ncs", label: "Nerve conduction studies of the legs", category: "unnecessary", why: "The new signs are upper, not lower, motor neuron signs." },
        { id: "saline", label: "A saline \"test\" injection, telling her it will relieve the weakness", category: "harmful", why: "Deceiving the patient damages trust and the therapeutic relationship, and the response would not exclude structural disease." },
      ],
      rationale:
        "Investigations are chosen on clinical grounds. A positive [[hoover-sign|Hoover sign]] still supports a functional component, but [[functional-neurological-disorder|FND]] commonly coexists with other neurological disease, and a new extensor plantar ([[babinski-sign|Babinski sign]]) with reflex asymmetry is effort-independent evidence of an [[umn|upper motor neuron]] lesion. That needs imaging, regardless of the earlier diagnosis.",
      meta: meta("m-fnd-tests", [FND, POS, CURR]),
    },
    {
      id: "m-fnd-opening",
      version: 1,
      format: "mcq",
      skill: "history-exam",
      modules: [M],
      difficulty: 2,
      presentation: "explaining-functional-weakness",
      usage: ["lesson", "review"],
      vignette:
        "You have examined a 30-year-old with three weeks of left leg weakness and found positive Hoover and hip abductor signs, with normal reflexes and plantar responses. You are about to explain the diagnosis.",
      stem: "Which is the best opening sentence?",
      options: [
        { id: "a", text: "\"You have a condition called functional neurological disorder. It is common, it is real, and it has the potential to get better, and I can show you the sign on your examination that tells me so.\"", correct: true, feedback: "Right. It names what she has, normalizes it, offers hope, and leads into showing her own positive sign." },
        { id: "b", text: "\"The good news is that we found nothing wrong with your nervous system.\"", tag: "misconception", feedback: "\"Nothing wrong\" denies a disabling symptom and leaves her without a diagnosis." },
        { id: "c", text: "\"Has anything stressful happened to you recently?\"", tag: "weak-reasoning", feedback: "Leading with stress implies blame and suggests the diagnosis depends on finding a stressor, which it does not." },
        { id: "d", text: "\"Your weakness is psychological, so I am referring you to psychiatry.\"", tag: "misconception", feedback: "This explains nothing about the mechanism, implies the symptoms are imagined, and skips the treatments most relevant to functional weakness." },
      ],
      rationale:
        "A good explanation starts with what the patient has: the name of the condition, that it is common, real, and potentially reversible. Demonstrating the patient's own positive sign, such as [[hoover-sign|Hoover sign]], shows that the leg can work and that the clinician found something. Avoid \"nothing wrong,\" blaming language, and opening with stress.",
      meta: meta("m-fnd-opening", [FND, HALLETT]),
    },
    {
      id: "m-fnd-words",
      version: 1,
      format: "multi-select",
      skill: "history-exam",
      modules: [M],
      difficulty: 1,
      presentation: "fnd-explanation-phrases",
      usage: ["review"],
      stem: "Select the statements that belong in a good explanation of functional neurological disorder.",
      options: [
        { id: "a", text: "\"This is a problem with how your nervous system is working, not damage to it.\"", correct: true },
        { id: "b", text: "\"Watch your leg: when you lift the other one, it pushes down strongly. The connections are working.\"", correct: true },
        { id: "c", text: "\"We see this often in the neurology clinic.\"", correct: true },
        { id: "d", text: "\"The scans were to look for other conditions such as multiple sclerosis, and they do not show it.\"", correct: true },
        { id: "e", text: "\"It is all in your head.\"", tag: "misconception", feedback: "This implies the symptoms are imagined and blames the patient." },
        { id: "f", text: "\"You are putting it on, but I understand why.\"", tag: "misconception", feedback: "FND symptoms are involuntary; this accuses the patient of deception." },
        { id: "g", text: "\"Your tests are normal, so it must be stress.\"", tag: "weak-reasoning", feedback: "Normal tests do not make the diagnosis, and a stressor is not required." },
      ],
      rationale:
        "A helpful explanation says what the problem is (a disorder of functioning), that it is common, demonstrates the patient's own positive sign, and explains what the tests were for. Phrases that imply imagination, deception, or that the diagnosis rests on normal tests and stress undermine trust and engagement in treatment.",
      meta: meta("m-fnd-words", [FND, HALLETT]),
    },
    {
      id: "m-fnd-stressor",
      version: 1,
      format: "mcq",
      skill: "uncertainty",
      modules: [M],
      difficulty: 2,
      presentation: "functional-weakness-no-stressor",
      usage: ["lesson", "review", "challenge"],
      vignette:
        "A 26-year-old has functional right arm weakness with positive drift without pronation and give-way weakness, and normal reflexes. A colleague is reluctant to make the diagnosis because, after careful questioning, the patient describes no recent stress or trauma.",
      stem: "What is the best response?",
      options: [
        { id: "a", text: "Current DSM-5-TR criteria do not require an identified psychological stressor; the diagnosis rests on clinical findings incompatible with recognized neurological disease", correct: true, feedback: "Right. Stressors may be noted when present, but they are not required." },
        { id: "b", text: "The diagnosis cannot be made until a stressor is identified, so keep investigating", tag: "misconception", feedback: "That was a feature of older criteria. Requiring a stressor delays diagnosis and treatment." },
        { id: "c", text: "Without a stressor, the symptoms are more likely feigned", tag: "misconception", feedback: "The absence of a stressor says nothing about intent, and many patients with FND report none." },
        { id: "d", text: "Repeat MRI until the weakness resolves, since stress is absent", tag: "weak-reasoning", feedback: "Tests are chosen on clinical grounds. The absence of a stressor is not a reason to repeat imaging." },
      ],
      rationale:
        "Since DSM-5, the criteria for functional neurological symptom disorder (conversion disorder) have rested on clinical findings showing incompatibility with recognized neurological disease, without requiring a psychological stressor; the DSM-5-TR text revision keeps this, with stressors recorded only as a specifier. This supports diagnosis by positive signs and avoids withholding a diagnosis from patients who report no stressor.",
      meta: meta("m-fnd-stressor", [FND, HALLETT]),
    },
    {
      id: "m-fnd-physio",
      version: 1,
      format: "mcq",
      skill: "history-exam",
      modules: [M],
      difficulty: 2,
      presentation: "functional-gait-rehab",
      usage: ["lesson", "review"],
      vignette:
        "A 35-year-old has functional left leg weakness with a dragging gait. She understands and accepts the diagnosis and is referred to a physiotherapist with experience in FND.",
      stem: "Which approach best fits consensus recommendations for physiotherapy in functional motor disorders?",
      options: [
        { id: "a", text: "Education about the diagnosis, then retraining walking with attention directed away from the leg (for example walking to a rhythm), with goals she sets and self-management", correct: true, feedback: "Right. It builds on automatic movement, which the positive signs showed is intact." },
        { id: "b", text: "Intensive strengthening of the left leg muscles, with her watching the leg closely to correct each step", tag: "misconception", feedback: "The muscles are not the problem, and focusing attention on the limb tends to worsen functional movement." },
        { id: "c", text: "A wheelchair for all mobility until the weakness resolves spontaneously", tag: "unsafe-priority", feedback: "Avoiding movement promotes deconditioning and can entrench the disorder. Aids are used cautiously, balanced with safety." },
        { id: "d", text: "No physiotherapy, since FND is a psychiatric disorder", tag: "misconception", feedback: "Specialist physiotherapy has a key role in managing functional motor symptoms." },
      ],
      rationale:
        "Consensus recommendations frame physiotherapy for functional motor disorders within a biopsychosocial model: education, movement retraining that shifts attention away from the affected limb toward automatic movement, and self-management, delivered in a positive, nonjudgmental way. Psychological and occupational therapy are added where relevant.",
      meta: meta("m-fnd-physio", [PHYSIO, HALLETT, FND]),
    },
  ],
  terms: [
    term("hip-abductor-sign", "Hip abductor sign", ["abductor sign", "Sonoo abductor sign"], "A test showing a leg that seems weak can push outward strongly when used automatically.", "With the patient abducting each leg against resistance, the unabducted leg normally braces to stabilize the pelvis. In functional weakness, the \"weak\" leg braces strongly when the healthy leg is abducted, and the healthy leg slides inward when the weak leg is tried; the reverse occurs in structural weakness.", undefined, "When he abducts his right leg, the \"weak\" left leg pushes firmly outward: a positive hip abductor sign.", M, ["hoover-sign", "functional-neurological-disorder"]),
    term("give-way-weakness", "Give-way weakness", ["collapsing weakness"], "Strength that suddenly collapses after a moment of normal power.", "Sudden loss of resistance during strength testing, often after brief normal power. Supportive of functional weakness but nonspecific, since pain, fatigue, or poor understanding can cause it.", undefined, "Each time her grip is tested it holds for a second, then suddenly gives way.", M, ["functional-neurological-disorder"]),
    term("drift-without-pronation", "Drift without pronation", [], "An outstretched arm that sinks down while the palm keeps facing up.", "Downward drift of the outstretched supinated arm without forearm pronation. Upper motor neuron weakness typically produces pronation as the arm drifts (pronator drift), so drift without pronation supports functional weakness.", undefined, "Her left arm slowly sinks with the palm still facing the ceiling.", M, ["functional-neurological-disorder", "umn"]),
    term("entrainment-test", "Entrainment test", ["entrainment"], "Asking the other hand to tap a rhythm and watching whether the tremor changes to match it.", "The patient copies an externally cued rhythm with an unaffected limb. Entrainment of the tremor to the cued frequency, pausing of the tremor, or inability to copy the rhythm supports functional tremor; structural tremors keep their own frequency.", undefined, "As she taps slowly with her left hand, her right hand tremor slows to the same beat.", M, ["functional-tremor", "essential-tremor"]),
    term("functional-tremor", "Functional tremor", ["psychogenic tremor"], "A shaking that comes from how the brain controls movement, not from damage.", "A tremor within functional neurological disorder, typically with abrupt onset, variable frequency and direction, distractibility, and entrainment, diagnosed by these positive features.", undefined, "His hand tremor started suddenly, changes speed, and stops while he does mental arithmetic.", M, ["entrainment-test", "functional-neurological-disorder"]),
    term("functional-facial-spasm", "Functional facial spasm", ["psychogenic facial spasm"], "A held, pulling contraction of the face that comes from a functional disorder.", "A functional movement disorder of the face, usually tonic contraction of the lower face with the angle of the mouth pulled down and outward, sometimes with jaw deviation or platysma contraction, and without the brow elevation typical of hemifacial spasm.", undefined, "Her lower lip is held pulled down to the right for minutes, with her jaw pushed to the side.", M, ["hemifacial-spasm", "functional-neurological-disorder"]),
    term("hemifacial-spasm", "Hemifacial spasm", [], "Involuntary twitching of one side of the face, usually starting near the eye.", "Brief, clonic, and sometimes tonic contractions of muscles supplied by one facial nerve, usually beginning in the orbicularis oculi and spreading to the lower face, often persisting in sleep, commonly from vascular compression of the facial nerve. The eyebrow may rise as the eye closes.", undefined, "His left eye has twitched for a year, and now the left corner of his mouth twitches with it.", M, ["functional-facial-spasm"]),
    term("malingering", "Malingering", [], "Deliberately faking or exaggerating symptoms to get something, such as money or time off.", "The intentional production or exaggeration of symptoms motivated by external incentives. It is a behavior, not a medical diagnosis, and cannot be established from positive functional signs.", "MA-lin-ger-ing", "Surveillance evidence, not the examination, would be needed to show malingering.", M, ["factitious-disorder", "functional-neurological-disorder"]),
    term("factitious-disorder", "Factitious disorder", [], "A condition where someone deliberately fakes or causes illness to be seen as sick.", "Deliberate falsification or induction of symptoms or signs, associated with deception, in the absence of obvious external rewards. Distinct from functional neurological disorder, in which symptoms are involuntary.", "fak-TISH-us", "She secretly injected herself with insulin to cause repeated hypoglycemia, without any external gain.", M, ["malingering", "functional-neurological-disorder"]),
  ],
  sources: [
    {
      id: HALLETT,
      kind: "review",
      citation: "Hallett M, Aybek S, Dworetzky BA, McWhirter L, Staab JP, Stone J. Functional neurological disorder: new subtypes and shared mechanisms. Lancet Neurol. 2022;21(6):537-550. doi:10.1016/S1474-4422(21)00422-1",
      title: "Functional neurological disorder: new subtypes and shared mechanisms",
      authors: "Hallett M, Aybek S, Dworetzky BA, McWhirter L, Staab JP, Stone J",
      journal: "Lancet Neurol",
      year: 2022,
      doi: "10.1016/S1474-4422(21)00422-1",
      pmid: "35430029",
      url: "https://doi.org/10.1016/S1474-4422(21)00422-1",
      lastVerified: "2026-11-06",
      verificationNote: "Title, authors, journal, volume, issue, pages (537-550), DOI, and PMID confirmed on 2026-11-06 from web search results indexing a PubMed record, a PMC author manuscript (PMC9107510), the Mayo Clinic and University of Edinburgh repositories, and the University of Bern repository. A correction notice (PMC9341128) concerns the spelling of an author name. The tailored multidisciplinary treatment conclusion was checked against the abstract in the results. PubMed itself cannot be opened from this environment.",
      verified: true,
    },
    {
      id: PHYSIO,
      kind: "consensus-criteria",
      citation: "Nielsen G, Stone J, Matthews A, et al. Physiotherapy for functional motor disorders: a consensus recommendation. J Neurol Neurosurg Psychiatry. 2015;86(10):1113-1119. doi:10.1136/jnnp-2014-309255",
      title: "Physiotherapy for functional motor disorders: a consensus recommendation",
      authors: "Nielsen G, Stone J, Matthews A, et al.",
      journal: "J Neurol Neurosurg Psychiatry",
      year: 2015,
      doi: "10.1136/jnnp-2014-309255",
      pmid: "25433033",
      url: "https://doi.org/10.1136/jnnp-2014-309255",
      lastVerified: "2026-11-06",
      verificationNote: "Title, first authors, journal, volume, issue, pages (1113-1119), DOI, and PMID confirmed on 2026-11-06 from web search results indexing a PubMed record, a PMC record (PMC4602268), UCL Discovery, and the St George's open access repository. First published online November 2014. The recommendations (biopsychosocial framework, education, movement retraining, self-management) were checked against the abstract in the results. PubMed itself cannot be opened from this environment.",
      verified: true,
    },
    {
      id: ABD,
      kind: "primary-research",
      citation: "Sonoo M. Abductor sign: a reliable new sign to detect unilateral non-organic paresis of the lower limb. J Neurol Neurosurg Psychiatry. 2004;75(1):121-125.",
      title: "Abductor sign: a reliable new sign to detect unilateral non-organic paresis of the lower limb",
      authors: "Sonoo M",
      journal: "J Neurol Neurosurg Psychiatry",
      year: 2004,
      pmid: "14707320",
      url: "https://jnnp.bmj.com/content/75/1/121",
      lastVerified: "2026-11-06",
      verificationNote: "Title, author, journal, volume, issue, pages (121-125), PMID, and PMC record (PMC1757483) confirmed on 2026-11-06 from web search results indexing the publisher (jnnp.bmj.com), PMC, and library catalogues. The search results did not display a DOI explicitly, so none is recorded; the publisher URL is used. The test method and the organic versus non-organic patterns of the unabducted leg were checked against the abstract in the results. Small single-center study. PubMed itself cannot be opened from this environment.",
      verified: true,
    },
    {
      id: FACE,
      kind: "primary-research",
      citation: "Baizabal-Carvallo JF, Jankovic J. Distinguishing features of psychogenic (functional) versus organic hemifacial spasm. J Neurol. 2017;264(2):359-363. doi:10.1007/s00415-016-8356-0",
      title: "Distinguishing features of psychogenic (functional) versus organic hemifacial spasm",
      authors: "Baizabal-Carvallo JF, Jankovic J",
      journal: "J Neurol",
      year: 2017,
      doi: "10.1007/s00415-016-8356-0",
      url: "https://doi.org/10.1007/s00415-016-8356-0",
      lastVerified: "2026-11-06",
      verificationNote: "Title, authors, journal, volume, issue, pages (359-363), and DOI confirmed on 2026-11-06 from web search results indexing the publisher (Springer), SpringerMedizin, and the State Library of New South Wales catalogue. The PMID was not shown in the results and is not recorded. The distinguishing features (tonic contractions, isolated lower face involvement, downward deviation of the mouth angle, absence of the other Babinski sign) were checked against the abstract in the results. Small series. PubMed itself cannot be opened from this environment.",
      verified: true,
    },
  ],
};

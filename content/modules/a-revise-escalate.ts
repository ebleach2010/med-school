// Module a-revise-escalate: revising a diagnosis and deciding to escalate. Treating a diagnosis
// as a working hypothesis and recognizing the findings that should reopen it (a course that
// deviates from the expected natural history, failure to respond to treatment, a new sign); then
// choosing between escalation, observation, repeat testing, and consultation using treatment
// thresholds, recognizing deterioration, escalating with SBAR, safety-netting, and documenting
// what is still unknown.

import type { ModuleContent } from "./types";
import { meta, term } from "./types";

const M = "a-revise-escalate";
const PAUKER = "pauker1980-threshold";
const SBAR = "haig2006-sbar";
const NET = "almond2009-safety-netting";
const CROSK = "croskerry2003-cognitive-errors";
const GBS = "vandoorn2023-gbs";
const GBS10 = "leonhard2019-gbs10";
const CIDP = "vandenbergh2021-cidp";
const ENC = "solomon2012-uk-enceph";
const IDSA_ENC = "tunkel2008-idsa-enceph";
const BM = "vandebeek2016-escmid";
const BELL = "baugh2013-bells";
const AE = "graus2016-ae";
const GCS = "teasdale2014-gcs";
const MG = "narayanaswami2021-mg";
const GILHUS = "gilhus2016-mg";
const SEIZ = "krumholz2015-first-seizure";
const SE = "glauser2016-se";
const CURR = "safdieh2019-curriculum";

export const CONTENT: ModuleContent = {
  moduleId: M,
  module: {
    title: "Revising a diagnosis and deciding to escalate",
    summary: "Treating a diagnosis as a working hypothesis that predicts the course, the response to treatment, and which signs should appear; recognizing the findings that should reopen it (presumed viral meningitis that worsens, presumed Bell palsy with a new sixth nerve palsy, presumed Guillain-Barre syndrome that keeps progressing, a first seizure with fever and confusion); and choosing between escalation, observation, repeat testing, and consultation using treatment thresholds, recognition of deterioration, SBAR handover, safety-netting, and honest documentation of what is still unknown.",
    objectives: [
      ["uncertainty", "Hold a diagnosis as a working hypothesis and name the developments that should prompt revision: a course that deviates from the expected natural history, failure to respond to treatment that should work, and a new sign."],
      ["differential", "Generate the revised differential in common scenarios taught elsewhere in the course, such as worsening presumed viral meningitis, Bell palsy with another cranial nerve palsy, and Guillain-Barre syndrome that progresses beyond the expected time course."],
      ["uncertainty", "Choose between empirical treatment, observation, repeat testing, and consultation by weighing the harm of delay against the harm of treatment (the threshold approach)."],
      ["emergency", "Recognize neurological deterioration (falling GCS, new pupillary asymmetry, rising respiratory effort or falling vital capacity in neuromuscular weakness) and escalate promptly using a structured SBAR handover."],
      ["uncertainty", "Give specific safety-net advice at discharge and document a working diagnosis honestly, including what is still unknown and what would change the plan."],
    ],
    prerequisites: ["a-test-interpretation"],
    lessons: ["l-updating-diagnosis", "l-escalate-or-observe"],
    challengeItems: ["m-revesc-trigger", "m-revesc-cidp", "m-revesc-empiric", "m-revesc-pupil"],
    skills: ["uncertainty", "emergency", "differential", "history-exam"],
    minutes: 18,
    sources: [PAUKER, SBAR, NET, CROSK, GBS, GBS10, CIDP, ENC, IDSA_ENC, BM, BELL, AE, GCS, MG, GILHUS, SEIZ, SE, CURR],
  },
  lessons: [
    {
      id: "l-updating-diagnosis",
      moduleId: M,
      title: "Updating as evidence arrives",
      concept: "A working diagnosis predicts how the illness should evolve, how it should respond to treatment, and which signs should and should not appear; when the patient departs from those predictions, the diagnosis is reopened rather than defended.",
      minutes: 9,
      meta: meta("l-updating-diagnosis", [CROSK, ENC, BM, BELL, GBS, CIDP, SEIZ]),
      steps: [
        {
          kind: "hook",
          title: "Viral meningitis, day two",
          body: "A 27-year-old woman was admitted yesterday with headache, fever, and neck stiffness. She was fully alert, and her CSF showed a modest lymphocytic pleocytosis with normal glucose. The team wrote \"viral meningitis, supportive care, likely home in a day or two.\" This morning she is drowsy, cannot remember the date, and the nurse saw her right arm jerk for a minute. The plan in the notes still says \"likely home.\" What has changed, and what should the team now be thinking?",
        },
        {
          kind: "explain",
          title: "A diagnosis is a hypothesis with predictions",
          body:
            "A [[working-diagnosis|working diagnosis]] is not only a label; it is a set of predictions. If this is viral meningitis, the patient should stay alert and improve over days. If this is [[bell-palsy|Bell palsy]], the weakness should stay confined to one facial nerve. If this is [[guillain-barre-syndrome|Guillain-Barre syndrome]], weakness should reach its worst point within about four weeks and then plateau or improve. Writing the predictions down makes it obvious when the patient stops fitting them.\n\nThree kinds of development should make you reopen the diagnosis:\n\n1. A course that deviates from the expected [[natural-history|natural history]]: worsening when the patient should be improving, or progression beyond the time window the diagnosis allows.\n2. Failure to respond to treatment that should work: no improvement despite adequate treatment for the presumed cause.\n3. A new sign that the diagnosis does not explain: a new cranial nerve palsy, a seizure, a fall in consciousness, a sensory level.\n\nNew information counts too: a result, a detail from a relative, a medication history. Each is evidence that moves the probability of each possibility up or down, exactly as a test result does.\n\nRevising is not the same as discarding. Re-rank the differential, keep the dangerous and treatable possibilities covered while you find out, and say clearly in the notes that the diagnosis has changed and why. The commonest failure is not ignorance but [[anchoring|anchoring]]: continuing the original plan because it was already written.",
          layers: {
            simpler: "Every diagnosis comes with expectations: how the patient should get better and what should not happen. When the patient does something the diagnosis did not predict, stop and think again instead of carrying on.",
            mechanism: "A finding the leading diagnosis rarely produces (a seizure in uncomplicated viral meningitis, a sixth nerve palsy in Bell palsy) has a low likelihood under that diagnosis and a higher one under the alternatives, so it shifts probability toward them. Time is evidence as well: a disease with a known tempo becomes less likely the longer the patient departs from it.",
            compare: "Expected fluctuation versus true deviation: a patient with viral meningitis may have a worse headache on day two, which fits; a new seizure or drowsiness does not. Slow response versus no response: some treatments take days (corticosteroids in Bell palsy), others should show an effect within a predictable period. Knowing the expected tempo for each diagnosis is what lets you tell the difference.",
            deeper: "A useful habit is to write, with the working diagnosis, what you expect over the next day or so and what would make you think again. That turns the plan into a testable prediction, gives the night team concrete triggers, and counters diagnosis momentum, because a later clinician inherits the uncertainty rather than a settled label.",
          },
        },
        { kind: "predict", title: "Which finding reopens it?", itemId: "m-revesc-trigger" },
        {
          kind: "explain",
          title: "Four worked revisions",
          body:
            "Each of these starts with a reasonable diagnosis that later stopped fitting.\n\n**Presumed viral meningitis that worsens.** Viral ([[aseptic-meningitis|aseptic]]) meningitis predicts an alert patient who improves. Drowsiness, confusion, a seizure, or focal signs mean the brain itself may be involved or that the first diagnosis was wrong. Consider [[herpes-simplex-encephalitis|HSV encephalitis]] (start [[acyclovir|acyclovir]] without waiting for results, obtain MRI, and repeat the [[lumbar-puncture|lumbar puncture]] with HSV PCR if the first was early or negative), bacterial meningitis (give empirical antibiotics while it is excluded), and, once infection is addressed, [[autoimmune-encephalitis|autoimmune encephalitis]].\n\n**Presumed Bell palsy with a new sixth nerve palsy.** Bell palsy is an isolated lower motor neuron [[facial-nerve|facial nerve]] palsy. Weakness of other cranial nerves means it is not Bell palsy. A facial palsy with an [[abducens-nerve|abducens]] palsy on the same side points to the pons, where facial nerve fibers loop around the abducens nucleus (stroke, demyelination, or tumor), or to a process involving several cranial nerves (skull base or meningeal disease, a Guillain-Barre variant, infection, or sarcoidosis). It needs MRI and a fresh assessment.\n\n**Presumed Guillain-Barre syndrome that keeps progressing.** GBS reaches its worst point within four weeks. Weakness that is still progressing after that, or repeated deterioration after initial improvement with treatment, should raise acute-onset [[cidp|CIDP]]; the EAN/PNS GBS guideline advises considering it when progression continues beyond eight weeks from onset. The distinction matters because CIDP usually needs long-term immunotherapy rather than a single course.\n\n**A first seizure with new fever and confusion.** A first [[unprovoked-seizure|unprovoked seizure]] predicts recovery to baseline after the [[postictal|postictal]] period. Fever, persisting or worsening confusion, headache, or a new focal deficit suggest an [[acute-symptomatic-seizure|acute symptomatic seizure]] from CNS infection such as encephalitis, or ongoing [[nonconvulsive-status-epilepticus|nonconvulsive seizures]]. The plan changes from outpatient EEG to lumbar puncture, empirical acyclovir and antibiotics, imaging, and EEG now.",
          layers: {
            simpler: "Viral meningitis should not make someone drowsy or cause seizures. Bell palsy should affect only the face. GBS should stop getting worse within a month. A first seizure should be followed by full recovery. When these expectations fail, think of the more serious alternatives and act on them.",
            mechanism: "Each revision follows from anatomy or tempo. Seizures and reduced consciousness need cortical or diffuse brain involvement, which meningitis alone does not usually produce. The facial and abducens nerves meet in the pons, so a combined palsy localizes there or to a process affecting several nerves. GBS is a monophasic immune attack with a defined nadir; ongoing demyelination beyond it implies a chronic process.",
            compare: "GBS with a treatment-related fluctuation versus acute-onset CIDP: a single worsening soon after treatment, within the first weeks, is common in GBS and often responds to retreatment; continued progression beyond eight weeks or repeated deterioration suggests CIDP. Postictal confusion versus encephalitis: postictal confusion steadily improves; confusion that persists, worsens, or comes with fever needs explaining.",
            deeper: "Revision often happens in stages. In the meningitis case you may not yet know whether this is HSV, bacterial, or autoimmune disease; the right move is to cover the dangerous treatable possibilities now and order the tests that separate them, rather than to wait for a single unifying answer. The module on multiple simultaneous diagnoses considers the case where the first diagnosis was right and a second problem has been added.",
          },
        },
        { kind: "apply", title: "Week ten and still worse", itemId: "m-revesc-cidp" },
        {
          kind: "summary",
          title: "Key points",
          points: [
            "A working diagnosis predicts the course, the response to treatment, and which signs should appear. Write the predictions down.",
            "Reopen the diagnosis when the course deviates from the expected natural history, when treatment that should work fails, or when a new sign appears.",
            "Worsening viral meningitis: consider HSV encephalitis (acyclovir now), bacterial meningitis, and later autoimmune encephalitis. Bell palsy plus another cranial nerve palsy is not Bell palsy: image.",
            "GBS still progressing beyond four weeks, or repeatedly deteriorating, raises acute-onset CIDP. A first seizure with fever and persisting confusion needs evaluation for CNS infection now.",
          ],
          reviewItemIds: ["m-revesc-trigger", "m-revesc-cidp", "m-revesc-meningitis", "m-revesc-seizure-fever"],
        },
      ],
    },
    {
      id: "l-escalate-or-observe",
      moduleId: M,
      title: "Escalate, observe, retest, or consult",
      concept: "Whether to act before certainty depends on the harm of delay and the harm of treatment; observation is an active plan with explicit triggers, and when the triggers are met, escalation is prompt, structured, and documented.",
      minutes: 9,
      meta: meta("l-escalate-or-observe", [PAUKER, SBAR, NET, BM, ENC, GBS, GBS10, GCS, MG]),
      steps: [
        {
          kind: "hook",
          title: "Two calls at once",
          body: "You are the junior doctor on a night shift. The emergency department asks about a 38-year-old with fever, headache, neck stiffness, and a seizure in the ambulance; the CT scanner has a 90-minute queue and the lumbar puncture is waiting for it. At the same moment a ward nurse calls about a man with Guillain-Barre syndrome: his vital capacity was lower at the evening check than in the morning, and he now coughs when he drinks. Neither diagnosis is confirmed tonight. What do you do for each, and in what order?",
        },
        {
          kind: "explain",
          title: "Thresholds for action",
          body:
            "At any moment you have four broad options: treat or escalate now, observe, repeat or add a test, or ask for help. Choosing between them is not only about how likely the diagnosis is. It also depends on what happens if you wait and what happens if you treat someone who turns out not to have the disease.\n\nThe [[treatment-threshold|threshold approach]] makes this explicit. Below a [[testing-threshold|testing threshold]], the disease is unlikely enough that neither testing nor treating is worthwhile. Above a treatment threshold, you should treat without waiting for more tests. Between the two, test, and let the result decide.\n\nWhere the treatment threshold sits depends on the balance of benefit and harm:\n\n- When delay is dangerous and treatment is safe enough, the threshold is low, so you treat before certainty. [[empirical-treatment|Empirical]] antibiotics in suspected bacterial meningitis and acyclovir in suspected HSV encephalitis are the classic examples. If the lumbar puncture will be delayed (for example by a CT scan), blood cultures are taken and treatment starts first.\n- When treatment carries serious risk, the threshold is high, and you want more certainty first.\n\nObservation is a legitimate choice, but it is an active plan, not waiting: say what is being watched, how often, by whom, and which findings will trigger escalation.\n\nRepeat testing is right when the first test was likely to be falsely negative because of timing (CSF protein early in GBS, diffusion MRI in the first hours of a small brainstem stroke, an early HSV PCR) or when the trend matters more than a single value (serial [[vital-capacity|vital capacity]]).\n\nConsult when the decision is high stakes, outside your competence, or needs a skill or resource you do not have.",
          layers: {
            simpler: "If waiting could cause serious harm and the treatment is fairly safe, treat now and keep testing. If the treatment is risky, get more information first. If you choose to watch and wait, say exactly what you are watching for.",
            mechanism: "The treatment threshold is the probability at which the expected benefit of treating patients who have the disease equals the expected harm of treating those who do not. The larger the benefit relative to the harm, the lower the threshold. A test is worth doing only if its result could move the probability across a threshold; otherwise it cannot change the decision.",
            compare: "Empirical treatment versus diagnostic certainty: in bacterial meningitis you treat at a modest probability because untreated disease is often catastrophic and a few doses of antibiotics in someone without it do little harm. For long-term immunosuppression in suspected CIDP or autoimmune encephalitis, the harms of treating the wrong person are larger, so more evidence is gathered first, although severe presentations may still justify treatment before every result is back.",
            deeper: "Thresholds are judgments, not fixed numbers, and they move with the patient: frailty, allergy, pregnancy, and the patient's own values all change the balance of harms. The threshold idea also explains why stopping treatment is a decision: once tests make the disease unlikely enough, continuing an empirical drug no longer passes the threshold.",
          },
        },
        { kind: "predict", title: "The CT queue", itemId: "m-revesc-empiric" },
        {
          kind: "explain",
          title: "Recognizing deterioration and escalating",
          body:
            "Signs of neurological deterioration that should prompt [[escalation-of-care|escalation]]:\n\n- A falling [[glasgow-coma-scale|Glasgow Coma Scale]] score. Report the components (eye, verbal, motor), not only the total, and look at the trend.\n- New pupillary asymmetry ([[anisocoria|anisocoria]]) in a drowsy patient, especially a pupil that is larger and slow to react. It can signal third nerve compression from [[uncal-herniation|uncal herniation]] and is an emergency.\n- In neuromuscular weakness (GBS, [[myasthenic-crisis|myasthenic crisis]]): rising respiratory rate, use of neck and accessory muscles, inability to finish a sentence, a weak cough, difficulty swallowing secretions, and a falling vital capacity on serial measurement. Oxygen saturation and blood gases often stay normal until late, so normal saturation is not reassurance. Early, planned intubation in intensive care is safer than an emergency intubation on the ward.\n\nWhen these appear, go to the bedside, start the immediate measures, and call the senior and intensive care early. Calling early and being told the patient is stable is a good outcome, not a wasted call.\n\nUse a structured handover such as [[sbar|SBAR]]:\n\n- **Situation:** who you are, which patient, and what the problem is now.\n- **Background:** the working diagnosis and the relevant history.\n- **Assessment:** the key findings and their trend, and what you think is happening.\n- **Recommendation:** what you need, and by when (\"I would like you to see him within the next 15 minutes and I think he needs intensive care review\").\n\nWhen a patient goes home with an unconfirmed diagnosis, give [[safety-netting|safety-net]] advice: what course to expect, which specific symptoms mean return now, where to go, and when follow-up happens. Document it.\n\nDocument honestly: the working diagnosis as provisional, the alternatives still open, results still pending and who will follow them up, and what would change the plan.",
          layers: {
            simpler: "Watch for a falling GCS, one pupil getting bigger, and, in weak patients, faster or harder breathing, a weak cough, and trouble swallowing. Call for help early, using SBAR: what is happening, the background, what you found, and what you want. Before sending someone home, tell them exactly what to come back for.",
            mechanism: "In neuromuscular weakness the diaphragm and chest wall fail gradually; the patient compensates by breathing faster and recruiting accessory muscles, so carbon dioxide and oxygen are maintained until compensation runs out, then fail quickly. Vital capacity measures the muscle reserve directly, which is why its trend gives earlier warning than blood gases. In raised intracranial pressure, a pupil dilates when the third nerve is stretched or compressed against the tentorium.",
            compare: "Observation versus escalation in GBS: a patient walking with a stable vital capacity and no bulbar weakness can be watched with regular measurements; a falling vital capacity with a weak cough and difficulty swallowing needs intensive care review now. Vague versus specific safety-netting: \"come back if you are worried\" gives the patient nothing to act on; \"come back today if you develop double vision or weakness in the arm\" does.",
            deeper: "SBAR works partly because it ends with a request: many escalation calls fail not for lack of information but because the caller never says what they need. It also gives junior staff a sanctioned way to state an assessment and a recommendation to a senior. Safety-netting does not transfer responsibility to the patient; it is one part of managing diagnostic uncertainty alongside follow-up and review of pending results.",
          },
        },
        { kind: "apply", title: "The ward call", itemId: "m-revesc-gbs-escalate" },
        {
          kind: "summary",
          title: "Key points",
          points: [
            "Treat before certainty when delay is dangerous and treatment is safe enough (antibiotics in suspected bacterial meningitis, acyclovir in suspected HSV encephalitis); keep testing to decide whether to stop.",
            "Observation is an active plan with named triggers; repeat a test when timing may have made it falsely negative or when the trend matters; consult when the stakes or the skill required exceed yours.",
            "Escalate for a falling GCS, new pupillary asymmetry, or rising respiratory effort and falling vital capacity in neuromuscular weakness. Normal oxygen saturation does not exclude impending respiratory failure.",
            "Use SBAR and end with a clear request. Give specific safety-net advice at discharge, and document what is still unknown and what would change the plan.",
          ],
          reviewItemIds: ["m-revesc-empiric", "m-revesc-gbs-escalate", "m-revesc-sbar", "m-revesc-safetynet", "m-revesc-pupil", "m-revesc-observe"],
        },
      ],
    },
  ],
  items: [
    // ---------------- l-updating-diagnosis ----------------
    {
      id: "m-revesc-trigger",
      version: 1,
      format: "mcq",
      skill: "differential",
      modules: [M],
      difficulty: 2,
      presentation: "bell-palsy-plus-cn6",
      usage: ["lesson", "review", "challenge"],
      vignette: "A 41-year-old man developed weakness of the whole right side of his face over one day, including the forehead. He was diagnosed with Bell palsy and started on oral corticosteroids. He returns 5 days later. The facial weakness is unchanged. He now has double vision that is worse when he looks to the right, and his right eye does not move fully outward. He also mentions a mild ache behind the right ear, and his taste has been altered on the right side of the tongue.",
      stem: "Which finding most clearly means the diagnosis of Bell palsy should be revised?",
      schematic: { kind: "eye-gaze", finding: "right-cn6" },
      options: [
        { id: "a", text: "Failure of the right eye to abduct, a new right sixth nerve palsy", correct: true, feedback: "Right. Bell palsy is an isolated facial nerve palsy; another cranial nerve palsy means a different process, often in the pons or involving several nerves." },
        { id: "b", text: "Unchanged facial weakness after 5 days of corticosteroids", tag: "misconception", feedback: "Recovery in Bell palsy takes weeks to months; no improvement at 5 days is expected and does not argue against it." },
        { id: "c", text: "Forehead involvement", tag: "misconception", feedback: "Forehead weakness is expected in a lower motor neuron facial palsy such as Bell palsy; forehead sparing would suggest an upper motor neuron lesion." },
        { id: "d", text: "Ache behind the ear", tag: "misconception", feedback: "Pain behind the ear is common in Bell palsy and does not argue against it." },
        { id: "e", text: "Altered taste on the same side of the tongue", tag: "misconception", feedback: "Taste fibers travel with the facial nerve; altered taste fits a facial nerve lesion." },
      ],
      reasoning: {
        stem: "What is the best next step?",
        options: [
          { id: "r1", text: "MRI of the brain, with attention to the pons and skull base, and reassessment for other cranial nerve or long tract signs", correct: true },
          { id: "r2", text: "Increase the corticosteroid dose and review in 3 months", feedback: "Treating the original diagnosis harder ignores a sign it cannot explain; the combined palsy needs imaging." },
          { id: "r3", text: "Reassure him that double vision is a recognized part of Bell palsy", feedback: "Double vision from a sixth nerve palsy is not part of Bell palsy." },
        ],
      },
      rationale: "[[bell-palsy|Bell palsy]] is a diagnosis of an isolated lower motor neuron [[facial-nerve|facial nerve]] palsy, and the guideline advises reassessment when new or worsening neurological findings appear. A new [[abducens-nerve|abducens]] palsy on the same side is a sign Bell palsy cannot explain. The facial nerve fibers loop around the abducens nucleus in the pons, so a combined ipsilateral facial and sixth nerve palsy localizes to the pons (stroke, demyelination, tumor) or to a process affecting several cranial nerves (skull base or meningeal disease, a Guillain-Barre variant, infection). Unchanged weakness at 5 days, forehead involvement, ear pain, and altered taste all fit Bell palsy.",
      meta: meta("m-revesc-trigger", [BELL, CURR]),
    },
    {
      id: "m-revesc-meningitis",
      version: 1,
      format: "mcq",
      skill: "emergency",
      modules: [M],
      difficulty: 2,
      presentation: "viral-meningitis-worsening",
      usage: ["review"],
      vignette: "A 27-year-old woman was admitted yesterday with headache, fever, and neck stiffness. She was fully alert with no focal signs. CSF showed a lymphocytic pleocytosis with normal glucose; Gram stain was negative, and HSV PCR was not requested. The working diagnosis was viral meningitis, and she was given fluids and analgesia only. This morning she is drowsy (GCS 13: E3 V4 M6), disoriented in time, and had a one-minute episode of rhythmic jerking of her right arm.",
      stem: "What is the best next step?",
      options: [
        { id: "a", text: "Start IV acyclovir and empirical IV antibiotics now, and arrange urgent MRI, EEG, and repeat lumbar puncture with HSV PCR", correct: true, feedback: "Right. Reduced consciousness and a focal seizure do not fit uncomplicated viral meningitis; HSV encephalitis and bacterial meningitis must be covered while they are tested for." },
        { id: "b", text: "Continue supportive care; viral meningitis often has a worse second day", tag: "unsafe-priority", feedback: "A worse headache may fit viral meningitis, but drowsiness, disorientation, and a seizure do not; continuing the plan is anchoring." },
        { id: "c", text: "Send serum and CSF neuronal antibodies and start high-dose corticosteroids", tag: "weak-reasoning", feedback: "Autoimmune encephalitis is on the list, but infection, especially HSV, is tested for and covered with acyclovir first." },
        { id: "d", text: "Request HSV PCR on the stored CSF and start acyclovir only if it is positive", tag: "unsafe-priority", feedback: "Testing is right, but waiting for the result delays a treatment whose benefit depends on starting early; acyclovir should start now." },
        { id: "e", text: "Load an antiseizure medication and reassess tomorrow", tag: "incomplete", feedback: "Seizure control may be needed, but it treats a symptom and leaves the likely cause uncovered." },
      ],
      rationale: "Viral ([[aseptic-meningitis|aseptic]]) meningitis predicts an alert patient who improves. A fall in consciousness, disorientation, and a focal seizure are new findings that point to brain parenchymal involvement, most importantly [[herpes-simplex-encephalitis|HSV encephalitis]], or to a missed bacterial meningitis. Guidelines advise starting [[acyclovir|acyclovir]] as soon as encephalitis is suspected, without waiting for results, and obtaining MRI and CSF HSV [[pcr|PCR]]. [[autoimmune-encephalitis|Autoimmune encephalitis]] is considered once infection has been addressed, because its criteria require alternatives to be reasonably excluded.",
      meta: meta("m-revesc-meningitis", [ENC, IDSA_ENC, BM, AE]),
    },
    {
      id: "m-revesc-seizure-fever",
      version: 1,
      format: "multi-select",
      skill: "history-exam",
      modules: [M],
      difficulty: 2,
      presentation: "first-seizure-fever",
      usage: ["review"],
      vignette: "A 45-year-old man had a witnessed generalized tonic-clonic seizure at home, his first. In the emergency department the working diagnosis is \"first unprovoked seizure\" and the plan is discharge with an outpatient EEG and clinic review. Four hours after the seizure the nurse records the following.",
      stem: "Which findings should prompt the team to revise the working diagnosis and investigate now?",
      options: [
        { id: "a", text: "Temperature of 38.6 °C", correct: true },
        { id: "b", text: "He is still disoriented and more drowsy than an hour ago", correct: true },
        { id: "c", text: "New headache with neck stiffness", correct: true },
        { id: "d", text: "New difficulty finding words", correct: true },
        { id: "e", text: "A bitten lateral tongue", tag: "misconception", feedback: "A lateral tongue bite supports a generalized seizure; it does not suggest a different cause." },
        { id: "f", text: "Urinary incontinence during the event", tag: "misconception", feedback: "Incontinence is common in seizures and in syncope and does not point to an underlying infection." },
        { id: "g", text: "He had slept poorly the night before", tag: "weak-reasoning", feedback: "Sleep deprivation is a recognized seizure trigger and is not a reason to suspect CNS infection." },
      ],
      rationale: "A first [[unprovoked-seizure|unprovoked seizure]] predicts steady recovery to baseline after the [[postictal|postictal]] period. Fever, confusion that persists or worsens, [[meningism|meningism]], and a new focal deficit such as word-finding difficulty are not explained by it and suggest an [[acute-symptomatic-seizure|acute symptomatic seizure]] from CNS infection such as [[encephalitis|encephalitis]], or ongoing [[nonconvulsive-status-epilepticus|nonconvulsive seizures]]. The plan changes from outpatient EEG to imaging, [[lumbar-puncture|lumbar puncture]], empirical acyclovir and antibiotics, and EEG now. Tongue biting, incontinence, and sleep deprivation fit an ordinary seizure.",
      meta: meta("m-revesc-seizure-fever", [SEIZ, ENC, SE]),
    },
    {
      id: "m-revesc-cidp",
      version: 1,
      format: "free-text",
      skill: "differential",
      modules: [M],
      difficulty: 3,
      presentation: "gbs-progressing-beyond-4-weeks",
      usage: ["lesson", "review", "challenge"],
      vignette: "A 52-year-old man was diagnosed with Guillain-Barre syndrome 10 weeks ago after symmetric weakness of his legs and then arms, absent reflexes, raised CSF protein with a normal cell count, and demyelinating features on nerve conduction studies. He improved after IV immunoglobulin, worsened again at week 4, improved after a second course, and has worsened again over the past 3 weeks. He can now walk only with a frame. Breathing, swallowing, and blood pressure have stayed normal throughout.",
      stem: "What revised diagnosis should now be considered?",
      placeholder: "Revised diagnosis",
      answer: {
        full: [
          { id: "cidp", label: "Acute-onset CIDP", patterns: ["cidp", "chronic inflammatory demyelinating polyneuropathy", "chronic inflammatory demyelinating polyradiculoneuropathy", "chronic inflammatory demyelinating", "acute onset cidp", "chronic demyelinating polyneuropathy", "cipd"] },
        ],
        partial: [
          { concept: { id: "trf", label: "Treatment-related fluctuation", patterns: ["treatment related fluctuation", "trf", "fluctuation"] }, credit: 0.4, feedback: "A single worsening soon after treatment is a treatment-related fluctuation of GBS, but continued deterioration this far from onset, after repeated relapses, points to acute-onset CIDP." },
          { concept: { id: "chronic", label: "A chronic neuropathy (unspecified)", patterns: ["chronic neuropathy", "chronic polyneuropathy", "chronic inflammatory"] }, credit: 0.6, feedback: "Close. Name it: chronic inflammatory demyelinating polyradiculoneuropathy (CIDP) with acute onset." },
        ],
        wrong: [
          { concept: { id: "gbsrel", label: "Relapsing GBS", patterns: ["recurrent gbs", "relapsing gbs", "gbs relapse", "recurrent guillain", "relapse of guillain"] }, tag: "misconception", feedback: "GBS is usually monophasic with a nadir within four weeks; repeated deterioration over this period suggests a chronic process, acute-onset CIDP." },
          { concept: { id: "mg", label: "Myasthenia gravis", patterns: ["myasthenia"] }, tag: "knowledge-gap", feedback: "Areflexia, raised CSF protein, and demyelinating nerve conduction studies point to a demyelinating neuropathy, not a neuromuscular junction disorder." },
          { concept: { id: "fnd", label: "Functional weakness", patterns: ["functional", "psychogenic"] }, tag: "misconception", feedback: "Objective signs (areflexia, abnormal nerve conduction) are present; the course points to CIDP." },
        ],
      },
      modelAnswer: "Acute-onset CIDP (chronic inflammatory demyelinating polyradiculoneuropathy), because weakness is still progressing well beyond four weeks with repeated deterioration after treatment.",
      rationale: "[[guillain-barre-syndrome|Guillain-Barre syndrome]] reaches its nadir within four weeks and is usually monophasic. A single worsening soon after treatment (a treatment-related fluctuation) can occur in GBS, but continued progression beyond eight weeks from onset or repeated deterioration should raise [[acute-onset-cidp|acute-onset CIDP]]. The revision matters because [[cidp|CIDP]] usually needs maintenance immunotherapy rather than a single course, and the guidelines describe it as a recognized presentation of CIDP that can initially be indistinguishable from GBS.",
      meta: meta("m-revesc-cidp", [GBS, CIDP, GBS10]),
    },

    // ---------------- l-escalate-or-observe ----------------
    {
      id: "m-revesc-empiric",
      version: 1,
      format: "mcq",
      skill: "emergency",
      modules: [M],
      difficulty: 2,
      presentation: "suspected-bacterial-meningitis-ct-delay",
      usage: ["lesson", "review", "challenge"],
      vignette: "A 38-year-old woman has had fever and severe headache since this morning. She has neck stiffness and had a generalized seizure in the ambulance. She is now drowsy but obeys commands, with no focal signs. Because of the new seizure, a CT scan is requested before lumbar puncture, and the scanner has a 90-minute queue. Blood pressure and oxygen saturation are normal.",
      stem: "What is the best next step?",
      options: [
        { id: "a", text: "Take blood cultures, then give dexamethasone and empirical IV antibiotics now (adding acyclovir if encephalitis is possible), and do the lumbar puncture after the CT", correct: true, feedback: "Right. When delay is dangerous and treatment is safe enough, treatment comes before diagnostic certainty." },
        { id: "b", text: "Wait for the CT, then do the lumbar puncture, and start antibiotics once the CSF results confirm bacterial meningitis", tag: "unsafe-priority", feedback: "Delay in antibiotic treatment worsens outcome in bacterial meningitis; treatment should not wait for imaging or CSF results." },
        { id: "c", text: "Do the lumbar puncture now without CT so that antibiotics can be guided by the CSF", tag: "unsafe-priority", feedback: "A new seizure is an indication for imaging before lumbar puncture; the answer to the delay is to treat first, not to skip the safety step." },
        { id: "d", text: "Give oral antibiotics and observe until the CT is done", tag: "weak-reasoning", feedback: "Suspected bacterial meningitis needs IV treatment at doses that reach the CSF." },
        { id: "e", text: "Start antibiotics only if the CT shows no other explanation", tag: "unsafe-priority", feedback: "A normal CT does not confirm meningitis and an abnormal one does not exclude it; treatment should not depend on it." },
      ],
      reasoning: {
        stem: "Why is it right to treat before the diagnosis is confirmed?",
        options: [
          { id: "r1", text: "Delay in treating bacterial meningitis causes serious harm, while a short course of antibiotics in someone who turns out not to have it causes little, so the probability at which treatment is worthwhile is low", correct: true },
          { id: "r2", text: "The diagnosis is already certain from the clinical picture", feedback: "It is not certain; the point is that treatment is justified at well below certainty when delay is dangerous and treatment is safe enough." },
          { id: "r3", text: "Antibiotics make the lumbar puncture unnecessary", feedback: "The lumbar puncture is still done, because it confirms the diagnosis, identifies the organism, and decides whether to continue or stop treatment, even though prior antibiotics reduce culture yield." },
        ],
      },
      rationale: "This is the [[treatment-threshold|threshold approach]] in practice. Untreated bacterial meningitis is often fatal or disabling, delay worsens outcome, and a few doses of antibiotics in a patient without it do little harm, so the treatment threshold is low. Guidelines advise that when lumbar puncture is delayed by imaging, blood cultures are taken and [[empirical-treatment|empirical]] antibiotics with dexamethasone are started first. The lumbar puncture still follows to confirm the diagnosis and guide whether to continue. Acyclovir is added when encephalitis is a possibility, on the same reasoning.",
      meta: meta("m-revesc-empiric", [BM, PAUKER, ENC]),
    },
    {
      id: "m-revesc-gbs-escalate",
      version: 1,
      format: "order-priority",
      skill: "emergency",
      modules: [M],
      difficulty: 2,
      presentation: "gbs-respiratory-decline",
      usage: ["lesson", "review"],
      vignette: "A 34-year-old man is on day 5 of Guillain-Barre syndrome on a general ward and has received IV immunoglobulin. The nurse calls: his vital capacity has fallen at each check today, he now coughs when he drinks, his voice sounds wet, and he stops mid-sentence to breathe. His respiratory rate has risen, and he is using his neck muscles to breathe. Oxygen saturation is 97% on air.",
      stem: "Put these actions in order.",
      steps: [
        { id: "assess", text: "Go to the bedside now: assess airway, breathing pattern, cough, and swallowing, and repeat the vital capacity" },
        { id: "nbm", text: "Sit him up and make him nil by mouth" },
        { id: "call", text: "Call the senior doctor and request urgent critical care review, using an SBAR handover with a clear request" },
        { id: "icu", text: "Arrange transfer to intensive care for close monitoring and planned intubation if he continues to deteriorate" },
        { id: "doc", text: "Document the findings, the trend, who was called and when, and the agreed plan" },
      ],
      order: [["assess", "nbm"], ["call"], ["icu"], ["doc"]],
      rationale: "A falling [[vital-capacity|vital capacity]], rising respiratory effort with accessory muscle use, difficulty finishing sentences, and new [[bulbar|bulbar]] weakness (coughing on drinking, wet voice) signal impending [[ventilatory-failure|ventilatory failure]] and aspiration risk in [[guillain-barre-syndrome|Guillain-Barre syndrome]]. Oxygen saturation stays normal until late, so 97% is not reassurance. A brief bedside assessment with immediate protective measures comes first, then prompt escalation to the senior and critical care; guidelines list evolving respiratory insufficiency and severe swallowing dysfunction among the reasons for intensive care admission, where planned intubation is safer than an emergency on the ward. Documentation follows the actions.",
      meta: meta("m-revesc-gbs-escalate", [GBS, GBS10, SBAR]),
    },
    {
      id: "m-revesc-sbar",
      version: 1,
      format: "mcq",
      skill: "emergency",
      modules: [M],
      difficulty: 2,
      presentation: "myasthenia-bulbar-sbar",
      usage: ["review"],
      vignette: "You are called at 2 a.m. to see a 63-year-old woman admitted yesterday with a flare of myasthenia gravis after a chest infection. Since the evening she has developed more difficulty swallowing, nasal speech, and a weaker cough, and her vital capacity has fallen on the last two measurements. You decide to phone the medical registrar.",
      stem: "Which opening best follows the SBAR structure?",
      options: [
        { id: "a", text: "\"This is the night doctor on ward 7 about Mrs B in bed 12. I am worried she is heading into myasthenic crisis. She has myasthenia gravis and was admitted yesterday with a flare after a chest infection. Since this evening her swallowing and cough have worsened, her speech is nasal, and her vital capacity has fallen on the last two checks, although her saturation is normal. I think her respiratory muscles are failing. I would like you to see her in the next 15 minutes, and I think she needs critical care review now.\"", correct: true, feedback: "Right. Situation, background, assessment with the trend, and a clear recommendation with a time frame." },
        { id: "b", text: "\"Could you come and see bed 12 when you have a moment? She is not quite right.\"", tag: "incomplete", feedback: "This gives no situation, findings, or urgency, so the registrar cannot prioritize the call." },
        { id: "c", text: "\"Mrs B was diagnosed with myasthenia 6 years ago, started pyridostigmine, had a thymectomy, and was admitted yesterday after a cough started on Monday. Her observations at 8 p.m. were...\"", tag: "weak-reasoning", feedback: "A chronological story buries the problem and never reaches an assessment or a request." },
        { id: "d", text: "\"Her saturation is 97% and she is talking, so I just wanted to let you know she is a bit weaker.\"", tag: "unsafe-priority", feedback: "Normal saturation is falsely reassuring in neuromuscular weakness; the falling vital capacity and bulbar signs are the important findings, and there is no request." },
      ],
      rationale: "[[sbar|SBAR]] (Situation, Background, Assessment, Recommendation) gives the listener the problem first, the context needed to understand it, the caller's findings and interpretation, and a specific request. Many escalation calls fail because the request is never made. Here the bulbar weakness and falling [[vital-capacity|vital capacity]] suggest impending [[myasthenic-crisis|myasthenic crisis]], which may need intensive care and ventilatory support; normal oxygen saturation does not exclude it.",
      meta: meta("m-revesc-sbar", [SBAR, MG, GILHUS]),
    },
    {
      id: "m-revesc-safetynet",
      version: 1,
      format: "multi-select",
      skill: "uncertainty",
      modules: [M],
      difficulty: 1,
      presentation: "bell-palsy-discharge",
      usage: ["review"],
      vignette: "A 35-year-old woman with a 2-day history of isolated left lower motor neuron facial weakness, with no other abnormal findings, is diagnosed with Bell palsy. She is started on oral corticosteroids, given eye care advice, and is going home.",
      stem: "Which pieces of safety-net advice are appropriate?",
      options: [
        { id: "a", text: "Return the same day if you develop double vision, weakness or numbness of a limb, or difficulty speaking or swallowing", correct: true },
        { id: "b", text: "Seek urgent review if the eye becomes painful or red, or your vision changes", correct: true },
        { id: "c", text: "Expect improvement to take weeks; if movement has not recovered fully by 3 months, ask for reassessment or referral", correct: true },
        { id: "d", text: "Come back if a rash or blisters appear in or around the ear", correct: true },
        { id: "e", text: "Come back if you are worried", tag: "incomplete", feedback: "Vague advice gives the patient nothing specific to act on; name the symptoms and the time frame." },
        { id: "f", text: "No follow-up is needed because Bell palsy always recovers completely", tag: "misconception", feedback: "Most patients recover, but not all; incomplete recovery and ocular complications need review." },
        { id: "g", text: "Return if the face is not back to normal within 48 hours", tag: "misconception", feedback: "Recovery in Bell palsy takes weeks; this would bring back almost every patient unnecessarily." },
      ],
      rationale: "[[safety-netting|Safety-netting]] tells the patient what course to expect, which specific symptoms mean the diagnosis may be wrong or a complication is developing, and where and when to return. The Bell palsy guideline advises reassessment or referral for new or worsening neurological findings at any point, ocular symptoms at any point, or incomplete recovery 3 months after onset. A rash in or around the ear suggests [[ramsay-hunt-syndrome|Ramsay Hunt syndrome]]. Advice such as \"come back if worried\" is too vague to act on.",
      meta: meta("m-revesc-safetynet", [BELL, NET]),
    },
    {
      id: "m-revesc-pupil",
      version: 1,
      format: "mcq",
      skill: "emergency",
      modules: [M],
      difficulty: 3,
      presentation: "falling-gcs-new-anisocoria",
      usage: ["review", "challenge"],
      vignette: "A 74-year-old man was admitted after a fall with a small right-sided subdural hematoma. He was alert with GCS 15 and equal reactive pupils, and the plan was ward observation with neurological checks. At 2 a.m. the nurse reports that he is harder to rouse: eyes open only to voice, he is confused, and he localizes to pain (GCS 12: E3 V4 M5). His right pupil is now larger than the left and reacts sluggishly. Blood pressure is 172/90 mmHg.",
      stem: "What is the best next step?",
      options: [
        { id: "a", text: "Treat as an emergency: call the senior and neurosurgical team now, arrange immediate repeat CT, and protect the airway while waiting", correct: true, feedback: "Right. A falling GCS with a new unilateral dilated, sluggish pupil suggests expansion of the hematoma with herniation; this needs immediate escalation." },
        { id: "b", text: "Repeat the neurological observations in one hour to confirm the trend", tag: "unsafe-priority", feedback: "The trend is already confirmed and the pupil change is an emergency sign; waiting an hour risks irreversible injury." },
        { id: "c", text: "Give a sedative for confusion and review in the morning", tag: "unsafe-priority", feedback: "Sedation would mask further deterioration and does not address the likely cause." },
        { id: "d", text: "Lower the blood pressure and reassess once it is normal", tag: "weak-reasoning", feedback: "Raised blood pressure may be a response to rising intracranial pressure; the priority is imaging and neurosurgical review." },
        { id: "e", text: "Inform the day team at handover so they can request an MRI", tag: "unsafe-priority", feedback: "This delays an emergency by hours; the patient needs escalation now." },
      ],
      rationale: "The working plan of observation came with implicit triggers, and they have been met. A fall in the [[glasgow-coma-scale|Glasgow Coma Scale]] (reported by components, with a falling motor score) together with new [[anisocoria|anisocoria]], a larger and sluggish pupil on the side of the lesion, suggests expansion of the hematoma with [[uncal-herniation|uncal herniation]] compressing the third nerve. This is an emergency: escalate to the senior and neurosurgery immediately, image now, and protect the airway. Observation is only a safe plan if deterioration leads to prompt action.",
      meta: meta("m-revesc-pupil", [GCS, CURR]),
    },
    {
      id: "m-revesc-observe",
      version: 1,
      format: "mcq",
      skill: "uncertainty",
      modules: [M],
      difficulty: 2,
      presentation: "early-gbs-normal-csf",
      usage: ["review"],
      vignette: "A 29-year-old woman has had tingling in her feet and hands for 4 days and, for the past 2 days, mild symmetric weakness of her legs. She walks unaided but slowly. Ankle reflexes are absent and knee reflexes are reduced. She has no bulbar or breathing symptoms, and her vital capacity has been stable on three measurements over 24 hours. CSF on day 3 showed a normal protein and normal cell count.",
      stem: "What is the best plan?",
      options: [
        { id: "a", text: "Keep Guillain-Barre syndrome as the working diagnosis, admit with regular vital capacity, swallowing, and autonomic monitoring and defined triggers for escalation, and arrange nerve conduction studies, repeating them later if they are inconclusive", correct: true, feedback: "Right. A normal early CSF protein does not exclude GBS; active observation with clear triggers and repeat testing at a better time is the right balance." },
        { id: "b", text: "Discard Guillain-Barre syndrome because the CSF protein is normal, and discharge", tag: "misconception", feedback: "CSF protein is often normal in the first week of GBS; an early normal result is a timing false negative." },
        { id: "c", text: "Admit to intensive care and intubate electively now", tag: "weak-reasoning", feedback: "Her breathing is stable with no bulbar weakness; intubation now would expose her to harm without benefit. She needs monitoring with clear triggers." },
        { id: "d", text: "Discharge with outpatient nerve conduction studies in 6 weeks", tag: "unsafe-priority", feedback: "GBS can progress over days to respiratory failure; she needs inpatient monitoring while the diagnosis evolves." },
      ],
      rationale: "Not every uncertain situation calls for escalation. Here the [[pretest-probability|pretest probability]] of [[guillain-barre-syndrome|GBS]] is high, and a normal CSF protein in the first week is a common [[false-negative|false negative]], so the right response is to keep the working diagnosis and repeat or add tests at a better time. Because GBS can progress to respiratory and autonomic failure, observation means active inpatient monitoring of [[vital-capacity|vital capacity]], swallowing, and autonomic function, with explicit triggers for escalation and treatment.",
      meta: meta("m-revesc-observe", [GBS, GBS10]),
    },
  ],
  terms: [
    term("natural-history", "Natural history", ["natural course", "expected course"], "How an illness usually unfolds over time without (or with standard) treatment.", "The characteristic time course of a disease: its onset, tempo, peak, and recovery or progression. Departure from the expected natural history is a signal to revise the working diagnosis.", undefined, "GBS reaches its worst point within four weeks; his weakness still progressing at week ten departed from the natural history.", M, ["working-diagnosis", "time-course"]),
    term("treatment-threshold", "Treatment threshold", ["threshold approach", "test-treatment threshold", "action threshold"], "How likely a disease must be before treating is worthwhile.", "The probability of disease above which treatment without further testing is preferred. It falls as the benefit of treating true disease grows relative to the harm of treating patients without it (Pauker and Kassirer's threshold approach).", undefined, "Because delay is so harmful in bacterial meningitis, the treatment threshold is low and antibiotics start before the lumbar puncture.", M, ["testing-threshold", "empirical-treatment", "pretest-probability"]),
    term("testing-threshold", "Testing threshold", ["test threshold"], "How likely a disease must be before testing for it is worthwhile.", "The probability of disease below which neither testing nor treating is preferred. Between the testing and treatment thresholds, the test result should decide management.", undefined, "With a stable, typical picture, autoimmune encephalitis fell below the testing threshold.", M, ["treatment-threshold", "pretest-probability"]),
    term("empirical-treatment", "Empirical treatment", ["empiric treatment", "empiric therapy", "empirical therapy", "presumptive treatment"], "Treatment started on clinical suspicion before the diagnosis is confirmed.", "Treatment given for the likely or most dangerous cause before confirmatory results are available, justified when delay is harmful and treatment is safe enough. It is reviewed, and stopped if appropriate, once results return.", undefined, "She received empirical acyclovir and antibiotics while the CSF PCR was pending.", M, ["treatment-threshold", "acyclovir"]),
    term("escalation-of-care", "Escalation of care", ["escalation", "escalate", "escalating care"], "Getting more senior help or a higher level of care for a patient who is getting worse.", "Prompt communication of clinical concern to a senior clinician or specialist team, and transfer to a higher level of monitoring or support (such as intensive care) when deterioration or its risk exceeds what the current setting can manage.", undefined, "A falling vital capacity and new bulbar weakness led to escalation of care to intensive care.", M, ["sbar", "vital-capacity", "glasgow-coma-scale"]),
    term("sbar", "SBAR", ["Situation, Background, Assessment, Recommendation", "SBAR handover"], "A four-part structure for telling a colleague about a patient: situation, background, assessment, recommendation.", "A structured communication tool for handover and escalation: Situation (the problem now), Background (relevant history), Assessment (findings, trend, and interpretation), and Recommendation (what you need and by when).", "ESS-bar", "Her SBAR call ended with a clear request for critical care review within 15 minutes.", M, ["escalation-of-care"]),
    term("safety-netting", "Safety-netting", ["safety net", "safety-net advice", "safety netting"], "Telling a patient what to watch for and when to come back if things do not go as expected.", "Management of diagnostic uncertainty at discharge or the end of a consultation: explaining the expected course, the specific symptoms that should prompt urgent return, where to go, and when follow-up will happen, and documenting the advice.", undefined, "Safety-netting for Bell palsy included returning at once for double vision or limb weakness.", M, ["working-diagnosis"]),
    term("acute-onset-cidp", "Acute-onset CIDP", ["A-CIDP", "acute onset chronic inflammatory demyelinating polyradiculoneuropathy"], "CIDP that starts quickly enough to look like Guillain-Barre syndrome at first.", "Chronic inflammatory demyelinating polyradiculoneuropathy with a rapid onset resembling Guillain-Barre syndrome, recognized by continued progression beyond the expected GBS time course or repeated deterioration after treatment. It usually needs maintenance immunotherapy.", undefined, "After three deteriorations over ten weeks, his GBS diagnosis was revised to acute-onset CIDP.", M, ["cidp", "guillain-barre-syndrome"]),
  ],
  sources: [
    {
      id: PAUKER,
      kind: "review",
      citation: "Pauker SG, Kassirer JP. The threshold approach to clinical decision making. N Engl J Med. 1980;302(20):1109-1117. doi:10.1056/NEJM198005153022003",
      title: "The threshold approach to clinical decision making",
      authors: "Pauker SG, Kassirer JP",
      journal: "N Engl J Med",
      year: 1980,
      doi: "10.1056/NEJM198005153022003",
      pmid: "7366635",
      url: "https://doi.org/10.1056/NEJM198005153022003",
      lastVerified: "2026-11-06",
      verificationNote: "Title, authors, journal, year, volume, issue, pages (1109-1117), DOI, and PMID confirmed on 2026-11-06 from web search results indexing the PubMed record (PMID 7366635), Scilit, and the Harvard CHDS repository. The abstract's description of two threshold probabilities (a testing threshold and a test-treatment threshold) derived from decision analysis was checked against search summaries. The full text was not opened. PubMed could not be opened from this environment.",
      verified: true,
    },
    {
      id: SBAR,
      kind: "review",
      citation: "Haig KM, Sutton S, Whittington J. SBAR: a shared mental model for improving communication between clinicians. Jt Comm J Qual Patient Saf. 2006;32(3):167-175. doi:10.1016/S1553-7250(06)32022-3",
      title: "SBAR: a shared mental model for improving communication between clinicians",
      authors: "Haig KM, Sutton S, Whittington J",
      journal: "Jt Comm J Qual Patient Saf",
      year: 2006,
      doi: "10.1016/S1553-7250(06)32022-3",
      url: "https://doi.org/10.1016/S1553-7250(06)32022-3",
      lastVerified: "2026-11-06",
      verificationNote: "Title, authors, journal, year, volume, issue, and pages (167-175) confirmed on 2026-11-06 from web search results indexing AHRQ PSNet and article indexes; the DOI was confirmed from an index listing it for this title. Content used here (SBAR as Situation, Background, Assessment, Recommendation, a case study of implementing it to improve clinician communication and handoffs) was checked against search summaries. The PMID was not shown in search results and is omitted. PubMed and the publisher page could not be opened from this environment.",
      verified: true,
    },
    {
      id: NET,
      kind: "review",
      citation: "Almond S, Mant D, Thompson M. Diagnostic safety-netting. Br J Gen Pract. 2009;59(568):872-874. doi:10.3399/bjgp09X472971",
      title: "Diagnostic safety-netting",
      authors: "Almond S, Mant D, Thompson M",
      journal: "Br J Gen Pract",
      year: 2009,
      doi: "10.3399/bjgp09X472971",
      pmid: "19861036",
      url: "https://doi.org/10.3399/bjgp09X472971",
      lastVerified: "2026-11-06",
      verificationNote: "Title, authors, journal, year, volume, issue, pages (872-874), DOI, PMID, and PMCID (PMC2765844) confirmed on 2026-11-06 from web search results indexing the PMC record, Scilit, and the NIHR ARC Oxford publications page. The article's argument (no test or rule is perfectly sensitive, so safety-netting manages residual diagnostic uncertainty, without removing responsibility for the diagnostic decision) was checked against search summaries. PubMed could not be opened from this environment.",
      verified: true,
    },
  ],
};

// Module a-multiple-dx: multiple simultaneous diagnoses. When one diagnosis should explain the
// whole picture (parsimony, Occam's razor) and when two or more processes coexist (Hickam's
// dictum), with worked synthetic cases drawn from conditions taught elsewhere in the course;
// then a method: list every finding, test each against the leading diagnosis and its time
// course, treat unexplained findings as a signal, decide when to stop, and document two active
// problems clearly. Cognitive biases and findings that do not fit are taught in
// a-atypical-overlap and are not repeated here.

import type { ModuleContent } from "./types";
import { meta, term } from "./types";

const M = "a-multiple-dx";
const HILL = "hilliard2004-occam-saint";
const ABER = "aberegg2024-hickam";
const FICK = "fick2002-dsd";
const CROSK = "croskerry2003-cognitive-errors";
const GRABER = "graber2005-dx-error";
const ENG = "england2009-dsp";
const RAD = "iyer2016-cervical-radiculopathy";
const PD = "bloem2021-pd";
const DEF = "fisher2014-epilepsy-definition";
const NA = "spasovski2014-hyponatraemia";
const FND = "espay2018-fnd";
const CAM = "inouye1990-cam";
const MSDX = "thompson2018-mcdonald";
const CAD = "debette2009-dissection";

export const CONTENT: ModuleContent = {
  moduleId: M,
  module: {
    title: "Multiple simultaneous diagnoses",
    summary: "When one diagnosis should explain everything and when two processes are running at once: parsimony (Occam's razor) in young, previously healthy patients with an acute illness, multiplicity (Hickam's dictum) in older patients and those with chronic disease, and a method for testing every finding against the leading diagnosis, deciding when the explanation is good enough to act on, and documenting two active problems clearly.",
    objectives: [
      ["differential", "Decide whether a single diagnosis explains all the findings and their time course, or whether a second process is needed."],
      ["differential", "Recognize common neurological pairings: polyneuropathy with radiculopathy or myelopathy, Parkinson disease with subdural hematoma, epilepsy with a metabolic cause of confusion, functional symptoms with MS, and delirium on dementia."],
      ["history-exam", "Apply a stepwise method: list every finding, check each against the leading diagnosis, and treat unexplained findings as a signal."],
      ["uncertainty", "Judge when an explanation is sufficient to act safely, with a plan to revisit, and document two active problems so neither is lost."],
    ],
    prerequisites: ["a-test-interpretation"],
    lessons: ["l-parsimony-multiplicity", "l-explain-every-finding"],
    challengeItems: ["m-mdx-one-or-two", "m-mdx-epilepsy-confusion", "m-mdx-pd-sdh", "m-mdx-stop"],
    skills: ["differential", "history-exam", "uncertainty"],
    minutes: 18,
    sources: [HILL, ABER, FICK, CROSK, GRABER, ENG, RAD, PD, DEF, NA, FND, CAM, MSDX, CAD],
  },
  lessons: [
    {
      id: "l-parsimony-multiplicity",
      moduleId: M,
      title: "One diagnosis or two?",
      concept: "In a young, previously healthy patient with an acute illness, look first for one diagnosis that explains everything; in an older patient or one with chronic disease, expect that a new problem may sit on top of an old one, and let the findings and their timing decide.",
      minutes: 9,
      meta: meta("l-parsimony-multiplicity", [HILL, ABER, ENG, PD, NA, DEF, FND, FICK, CAD]),
      steps: [
        {
          kind: "hook",
          title: "Two patients, two rules",
          body: "A 34-year-old woman, previously well, has had 2 days of right-sided neck pain, a droopy right eyelid with a small right pupil, and this morning brief weakness of her left hand. It is tempting to list three problems: neck strain, an incidental pupil, and a transient attack. A 76-year-old man with Parkinson disease, taking an anticoagulant, has fallen several times this month and is now sleepier and weaker on the left. It is tempting to call it all Parkinson disease getting worse. For which patient should you look for one diagnosis, and for which should you look for a second?",
        },
        {
          kind: "explain",
          title: "Parsimony and multiplicity",
          body:
            "[[occams-razor|Occam's razor]] (diagnostic parsimony) says: prefer the single diagnosis that explains all the findings. [[hickams-dictum|Hickam's dictum]] is the counterweight: patients can have as many diseases as they please. Neither is a law. Each is a prior expectation about how likely one explanation is compared with two, and the patient in front of you shifts that expectation.\n\nParsimony is the better first bet when:\n\n- The patient is young and previously healthy, and the illness is acute. Two unrelated new diseases starting in the same week in a healthy person is unlikely; one disease with several manifestations is much more likely.\n- The findings share a time course: they began together and progress together.\n- A known unifying diagnosis exists. In the hook, [[carotid-dissection|carotid artery dissection]] explains neck pain, a [[horner-syndrome|Horner syndrome]], and hemispheric ischemia at once.\n\nMultiplicity is the better first bet when:\n\n- The patient is older or has chronic disease. Each additional disease raises the chance that a new symptom comes from something else, and each treatment adds possible side effects.\n- The findings have different time courses: an old, slow deficit and a new, fast one.\n- The known diagnosis does not predict a finding, or predicts it with the wrong tempo or the wrong side.\n\nAn analysis of published cases with more than one diagnosis found that most second diagnoses were not pure coincidence. They were usually causally linked to the first (a complication or a consequence, such as a fall in Parkinson disease leading to a subdural hematoma), an incidental finding, or a known pre-existing disease. A truly unrelated second disease arriving at the same time is the least common pattern. So when you reach for a second diagnosis, first ask how it might be connected to the first.",
          layers: {
            simpler: "If a young healthy person suddenly gets several symptoms at once, look for one cause. If an older person with long-term illnesses gets something new, a second problem is common. Check whether the timing of each symptom matches.",
            mechanism: "In probability terms, two independent diseases occurring together is roughly the product of two small probabilities, which is very small in a healthy young person. In an older patient with chronic disease, one of those probabilities is already close to 1 (the known disease is present), so the joint probability is close to the probability of the new disease alone, and a second diagnosis is no longer surprising.",
            compare: "Unifying diagnosis versus coexisting diagnoses: carotid dissection with Horner syndrome and arm weakness is one disease with three findings. Diabetic polyneuropathy with a new L5 radiculopathy is two diseases with different mechanisms, sides, and tempos. A complication (subdural hematoma after falls in Parkinson disease) is a second diagnosis caused by the first: it needs its own treatment but is predicted by the first.",
            deeper: "Saint's triad (hiatus hernia, gallstones, and diverticular disease occurring together) is the classic teaching counterexample to strict parsimony. Its lesson is not that parsimony is wrong but that common diseases often coexist, especially with age. The practical habit is to weigh both rules by the patient's age, comorbidity, and the time course of each finding rather than by preference.",
          },
        },
        { kind: "predict", title: "One process or two?", itemId: "m-mdx-one-or-two" },
        {
          kind: "explain",
          title: "Pairs to expect in neurology",
          body:
            "Conditions taught elsewhere in the course pair up in predictable ways. In each, the second process changes management.\n\n- Polyneuropathy plus a root or cord lesion: a diabetic [[length-dependent|length-dependent]] polyneuropathy is symmetric, distal, and slow. A new painful, one-sided [[foot-drop|foot drop]] with weak foot inversion and back pain radiating down the leg is an L5 [[radiculopathy|radiculopathy]] on top of it. Brisk knee reflexes and extensor plantar responses in a patient with absent ankle reflexes suggest a cervical [[myelopathy|myelopathy]] as well.\n- Parkinson disease plus [[subdural-hematoma|subdural hematoma]]: falls are common as Parkinson disease advances, and anticoagulants make bleeding after a fall more likely. New headache, drowsiness, or one-sided weakness over days to weeks is not the usual tempo or pattern of Parkinson disease.\n- Epilepsy plus a new cause of confusion: in a patient with known [[epilepsy|epilepsy]], new confusion is often blamed on seizures. [[hyponatremia|Hyponatremia]] (including from carbamazepine, oxcarbazepine, or a diuretic), infection, drug toxicity, and stroke are common alternatives. Each can also provoke seizures, so the two problems interact.\n- Functional symptoms plus MS: a [[functional-neurological-disorder|functional disorder]] can coexist with [[multiple-sclerosis|MS]]. Positive functional signs, such as the [[hoover-sign|Hoover sign]], establish the functional component and spare the patient unnecessary relapse treatment; they do not mean the MS was a misdiagnosis.\n- [[delirium-superimposed-on-dementia|Delirium on dementia]]: people with [[dementia|dementia]] are especially prone to [[delirium|delirium]], and it is easily mistaken for a step down in their dementia. An acute, fluctuating change with inattention is delirium until proven otherwise.",
          layers: {
            simpler: "Common pairs: nerve damage from diabetes plus a pinched nerve root; Parkinson disease plus a bleed on the brain after falls; epilepsy plus low sodium or infection; functional symptoms plus MS; and a new confusion (delirium) on top of dementia.",
            mechanism: "The first disease often creates the conditions for the second: Parkinson disease causes falls, and falls cause subdural hematoma; antiseizure drugs can lower sodium, and low sodium causes confusion and seizures; dementia reduces the brain's reserve, so an infection or a drug tips it into delirium.",
            compare: "Tempo separates the pairs: polyneuropathy evolves over years and radiculopathy over days; Parkinson disease progresses over years and a chronic subdural over days to weeks; dementia declines over months and delirium over hours to days. A change that is too fast for the known disease is the commonest clue to a second one.",
            deeper: "The pairs also interact in treatment. Relapse steroids do nothing for a functional component; increasing an antiseizure drug that causes hyponatremia can worsen the confusion; sedatives given for delirium can worsen it further in dementia; and an anticoagulant decision in Parkinson disease with falls must be revisited after a bleed. Naming both problems is what makes these trade-offs visible.",
          },
        },
        { kind: "apply", title: "Known epilepsy, new confusion", itemId: "m-mdx-epilepsy-confusion" },
        {
          kind: "summary",
          title: "Key points",
          points: [
            "Occam's razor (one diagnosis) is the better first bet in a young, previously healthy patient with an acute illness whose findings share a time course.",
            "Hickam's dictum (more than one diagnosis) is the better first bet in older patients and those with chronic disease, especially when findings have different tempos.",
            "Most second diagnoses are linked to the first (a complication or consequence), incidental, or already known; ask how the second might connect to the first.",
            "Expect pairs: polyneuropathy plus radiculopathy or myelopathy, Parkinson disease plus subdural hematoma, epilepsy plus hyponatremia or infection, functional symptoms plus MS, delirium on dementia.",
          ],
          reviewItemIds: ["m-mdx-one-or-two", "m-mdx-epilepsy-confusion", "m-mdx-dissection-one", "m-mdx-pd-sdh", "m-mdx-delirium-dementia", "m-mdx-ms-functional"],
        },
      ],
    },
    {
      id: "l-explain-every-finding",
      moduleId: M,
      title: "Explain every finding, then decide when to stop",
      concept: "Write down every finding, test each one and its timing against the leading diagnosis, treat what is left unexplained as a signal, stop when the explanation is good enough to act on safely, and record each active problem with its own plan.",
      minutes: 9,
      meta: meta("l-explain-every-finding", [ENG, RAD, CROSK, GRABER, FICK, CAM, PD, ABER]),
      steps: [
        {
          kind: "hook",
          title: "Worse neuropathy, or something else?",
          body: "A 67-year-old man with type 2 diabetes is referred as \"worsening diabetic neuropathy.\" His feet have been numb for 6 years. For 8 months his hands have been clumsy and numb, he drops coins, and his walking has become unsteady. Ankle reflexes are absent, as they were 2 years ago. His knee reflexes are now brisk. Is this one disease getting worse, or two?",
        },
        {
          kind: "explain",
          title: "The explain-every-finding method",
          body:
            "A leading diagnosis is tested, not just asserted. A simple method:\n\n1. List every finding: symptoms, signs, results, and the time course of each. Include the findings you are tempted to ignore.\n2. State the leading diagnosis and what it predicts: distribution, side, tempo, and associated features.\n3. Check each finding against it: explained, neutral, or unexplained. Check the timing as well as the type. A finding of the right kind but the wrong tempo (a weeks-long decline in a disease that changes over years) is unexplained.\n4. Treat what is left over as a signal. Ask whether a single alternative explains everything better, or whether a second process explains the leftover. Rank the possibilities by danger and treatability, and test the ones that would change management.\n5. Decide when to stop (next section).\n\nIn the hook, a length-dependent diabetic polyneuropathy explains the numb feet and the absent ankle reflexes. It does not explain hand symptoms that started while the leg symptoms stayed in the feet (in a length-dependent neuropathy the hands are usually reached only after the legs are involved well up the shin), or brisk knee reflexes, which are upper motor neuron signs. Those leftovers point to a second process in the cervical cord, such as a degenerative cervical [[myelopathy|myelopathy]]. A [[lhermitte-sign|Lhermitte sign]] or extensor plantar responses would add to the case. The two processes can mask each other: the neuropathy removes the ankle jerks that the myelopathy would otherwise make brisk.",
          layers: {
            simpler: "Write every finding down. For each one, ask: does my diagnosis explain this, and does the timing fit? Whatever is left over is a clue. Look into it before you settle.",
            mechanism: "Each disease predicts a pattern. A length-dependent axonal neuropathy affects the longest nerve fibers first, so it starts in the toes, climbs symmetrically, and removes reflexes from the ankles upward. A cord lesion above the lumbar segments releases the reflexes below it from upper motor neuron control, so knee reflexes become brisk. A peripheral process cannot make reflexes brisker, so brisk reflexes are unexplained by any neuropathy.",
            compare: "A discordant finding (taught in the module on atypical and overlapping presentations) can mean the leading diagnosis is wrong and a different single diagnosis is right. In this module the leading diagnosis is often correct but incomplete: it explains most findings, and a second process explains the rest. Step 4 asks both questions: is there a better single answer, and if not, what second process explains the leftover?",
            deeper: "The method is deliberately mechanical so it survives fatigue and handover. Listing findings on paper exposes those that nobody has explained. It also prevents the reverse error: inventing a second diagnosis for a finding the first one already explains, such as calling distal numbness in a diabetic patient a separate disease.",
          },
        },
        { kind: "predict", title: "What is left unexplained?", itemId: "m-mdx-unexplained" },
        {
          kind: "explain",
          title: "Known labels, stopping, and the problem list",
          body:
            "A known diagnosis can blind the team to a new one. When a patient carries a label (epilepsy, dementia, Parkinson disease, a functional disorder), a new symptom tends to be filed under it. This is [[diagnostic-overshadowing|diagnostic overshadowing]], and it is a form of [[premature-closure|premature closure]]. Protect against it by asking of every new symptom: would I accept this explanation if I did not know the old diagnosis? Does the old diagnosis usually behave this way, at this speed, on this side?\n\nWhen to stop. You will rarely explain every finding with certainty, and searching forever has its own harms: delay, cost, and incidental findings. Stop when:\n\n- The explanation accounts for the findings that matter, including their time course.\n- The dangerous and treatable alternatives have been addressed or deliberately judged unlikely.\n- What remains unexplained is minor and would not change what you do now.\n\nThen stop with a plan to revisit: write down what is still unexplained and what would reopen the question (no improvement by a stated time, a new sign, a result). In delirium on dementia, for example, finding and treating an infection is enough to act on, but if the patient is not back to baseline as the infection settles, the explanation was incomplete and the search resumes.\n\nDocument two active problems as two problems. A combined label (\"Parkinson disease, deteriorating\") hides the second diagnosis and lets it fall off at handover. A clear [[problem-list|problem list]] gives each active problem its own line: what it is, which findings it explains, and its own plan. It also states how the problems interact (for example, an anticoagulant decision after a subdural hematoma, or which medicines to continue for the chronic disease while the new problem is treated).",
          layers: {
            simpler: "Do not blame every new symptom on an old diagnosis. Stop searching when you can act safely and nothing important is unexplained, but write down what would make you look again. Give each problem its own line and plan.",
            mechanism: "Overshadowing works because the old diagnosis makes the new symptom feel already explained, so the usual checks on tempo and pattern are skipped. Writing each problem separately forces a separate plan, so the second problem gets its own tests, treatment, and follow-up instead of inheriting the first problem's.",
            compare: "Stopping with a plan to revisit versus premature closure: both end the search for now, but the first records what is unexplained and sets a trigger to reopen it, while the second treats the question as closed. Stopping with a plan versus over-investigation: the first accepts small unexplained findings that would not change management; the second chases them.",
            deeper: "In older patients with several chronic diseases, the problem list is also the place to catch treatment interactions: a drug for one problem that worsens another, or a change for the new problem that destabilizes the old one. This module teaches the reasoning; applying it reliably to real patients takes supervised practice.",
          },
        },
        { kind: "apply", title: "Put the method in order", itemId: "m-mdx-method" },
        {
          kind: "summary",
          title: "Key points",
          points: [
            "List every finding with its time course; check each against the leading diagnosis for type, side, and tempo.",
            "Treat leftovers as a signal: is there a better single diagnosis, or a second process? Test the dangerous and treatable options first.",
            "Watch for diagnostic overshadowing: would you accept this explanation if you did not know the old diagnosis?",
            "Stop when the explanation is enough to act safely, with a written plan for what would reopen the question.",
            "Give each active problem its own line, the findings it explains, its own plan, and how the problems interact.",
          ],
          reviewItemIds: ["m-mdx-unexplained", "m-mdx-method", "m-mdx-document", "m-mdx-stop"],
        },
      ],
    },
  ],
  items: [
    // ---------------- l-parsimony-multiplicity ----------------
    {
      id: "m-mdx-one-or-two",
      version: 1,
      format: "mcq",
      skill: "differential",
      modules: [M],
      difficulty: 2,
      presentation: "dsp-plus-l5",
      usage: ["lesson", "review", "challenge"],
      vignette: "A 72-year-old man has had type 2 diabetes for 15 years and numbness and burning in both feet for 5 years. Three weeks ago, after lifting a heavy box, he developed low back pain shooting down the outside of his right leg to the top of the foot, and he now catches his right toes when walking. On examination there is symmetric loss of pinprick and vibration sensation to the mid-shins and both ankle reflexes are absent. Right ankle dorsiflexion, big toe extension, foot inversion, and hip abduction are weak. The left leg has normal strength.",
      stem: "What is the best explanation for his findings?",
      options: [
        { id: "a", text: "A length-dependent diabetic polyneuropathy plus a new right L5 radiculopathy", correct: true, feedback: "Right. The old, symmetric, distal sensory findings fit the polyneuropathy; the new, painful, one-sided weakness in an L5 pattern needs a second explanation." },
        { id: "b", text: "Progression of his diabetic polyneuropathy", tag: "misconception", feedback: "A length-dependent polyneuropathy is symmetric and slow; it does not cause sudden, painful, one-sided weakness with radiating back pain." },
        { id: "c", text: "Right common fibular neuropathy at the knee", tag: "knowledge-gap", feedback: "Fibular neuropathy causes foot drop with weak eversion but spares foot inversion and hip abduction, and does not cause radiating back pain." },
        { id: "d", text: "A single new disease such as a lumbosacral plexopathy explaining both the foot numbness and the weakness", tag: "weak-reasoning", feedback: "The foot numbness began 5 years earlier and is symmetric; forcing it into the new process ignores its different time course." },
      ],
      reasoning: {
        stem: "Which features are not explained by the polyneuropathy?",
        options: [
          { id: "r1", text: "Sudden onset after lifting, radiating back pain, and one-sided weakness of inversion and hip abduction as well as dorsiflexion", correct: true },
          { id: "r2", text: "Absent ankle reflexes on both sides", feedback: "Absent ankle reflexes are expected in a length-dependent polyneuropathy." },
          { id: "r3", text: "Symmetric loss of vibration to the mid-shins", feedback: "This is the typical pattern of a length-dependent polyneuropathy." },
        ],
      },
      rationale: "A diabetic [[length-dependent|length-dependent]] polyneuropathy explains the symmetric distal sensory loss and absent ankle reflexes, and its slow tempo matches. It does not explain the sudden, painful, one-sided [[foot-drop|foot drop]]. Weakness of dorsiflexion, big toe extension, inversion, and hip abduction (muscles sharing the L5 root but supplied by different nerves) with radiating back pain points to an L5 [[radiculopathy|radiculopathy]]. In an older patient with a chronic disease and two different time courses, two diagnoses are more likely than one, in line with [[hickams-dictum|Hickam's dictum]].",
      meta: meta("m-mdx-one-or-two", [ENG, ABER]),
    },
    {
      id: "m-mdx-epilepsy-confusion",
      version: 1,
      format: "mcq",
      skill: "differential",
      modules: [M],
      difficulty: 2,
      presentation: "epilepsy-hyponatremia",
      usage: ["lesson", "review", "challenge"],
      vignette: "A 68-year-old woman has had focal epilepsy for 20 years, well controlled on carbamazepine; her last seizure was 4 years ago. Three weeks ago her general practitioner started a thiazide diuretic for blood pressure. Over 3 days she has become increasingly muddled and nauseated. Nobody has seen a seizure, she has not bitten her tongue, and she has no fever. She is drowsy but rousable, with no focal weakness. Serum sodium is 119 mmol/L (it was normal 6 months ago). The admitting note says \"breakthrough seizures, increase carbamazepine.\"",
      stem: "What is the best initial approach?",
      options: [
        { id: "a", text: "Treat hyponatremia as the likely cause: manage it according to symptom severity with a limited rate of correction, review the diuretic and carbamazepine as causes, and get an EEG if alertness does not recover as the sodium improves", correct: true, feedback: "Right. Symptomatic hyponatremia from a new diuretic on top of carbamazepine explains the picture; nonconvulsive seizures stay on the list if she does not improve." },
        { id: "b", text: "Increase the carbamazepine dose as planned", tag: "unsafe-priority", feedback: "This attributes the confusion to the known epilepsy without evidence and can lower the sodium further." },
        { id: "c", text: "Correct the sodium to normal as quickly as possible", tag: "unsafe-priority", feedback: "Overly rapid correction of chronic hyponatremia risks osmotic demyelination; guidelines limit the rise in the first 24 hours." },
        { id: "d", text: "Load an intravenous antiseizure drug for presumed nonconvulsive status epilepticus without further testing", tag: "weak-reasoning", feedback: "Nonconvulsive status is possible but unproven; a clear metabolic cause is present and EEG would be needed to diagnose status." },
      ],
      reasoning: {
        stem: "Which finding most strongly points away from seizures as the whole explanation?",
        options: [
          { id: "r1", text: "A new, marked fall in sodium after starting a diuretic in a patient taking carbamazepine", correct: true },
          { id: "r2", text: "No tongue bite", feedback: "Absence of a tongue bite is common in seizures and does not exclude them." },
          { id: "r3", text: "Twenty years of epilepsy", feedback: "This raises the prior for seizures, which is exactly why the new metabolic cause is easily overlooked." },
        ],
      },
      rationale: "A known diagnosis of [[epilepsy|epilepsy]] invites [[diagnostic-overshadowing|diagnostic overshadowing]]: new confusion is labelled \"seizures.\" Here a thiazide added to carbamazepine (both can lower sodium) has produced marked [[hyponatremia|hyponatremia]], which explains nausea, confusion, and drowsiness. Symptomatic hyponatremia is treated according to severity, with the rate of correction limited to avoid [[osmotic-demyelination-syndrome|osmotic demyelination]], and its causes are removed. Seizures provoked by an acute metabolic disturbance are acute symptomatic rather than a sign that the epilepsy has changed, but [[nonconvulsive-status-epilepticus|nonconvulsive status epilepticus]] is still considered and tested for with EEG if she does not recover as expected.",
      meta: meta("m-mdx-epilepsy-confusion", [NA, DEF]),
    },
    {
      id: "m-mdx-dissection-one",
      version: 1,
      format: "mcq",
      skill: "differential",
      modules: [M],
      difficulty: 2,
      presentation: "young-neck-pain-horner",
      usage: ["review"],
      vignette: "A 34-year-old woman, previously well and taking no medicines, has had 2 days of right-sided neck pain that began after a long session of overhead painting, and a right-sided headache. Her partner noticed her right eyelid drooping. This morning she had 15 minutes of weakness and clumsiness of her left hand, now resolved. On examination the right pupil is smaller than the left, with mild right ptosis; the rest of the examination is normal.",
      stem: "Which approach to the diagnosis is best?",
      options: [
        { id: "a", text: "Look for one diagnosis that explains all three findings: right carotid artery dissection, investigated urgently with neck vessel imaging", correct: true, feedback: "Right. Neck pain, a Horner syndrome, and ischemia in the territory of the same carotid artery are all explained by dissection." },
        { id: "b", text: "Treat three separate problems: musculoskeletal neck strain, an incidental unequal pupil, and a TIA of uncertain cause", tag: "weak-reasoning", feedback: "Three unrelated new problems in the same 2 days in a healthy young woman is far less likely than one disease that explains them all." },
        { id: "c", text: "Migraine with aura explains the headache and the hand symptoms; the pupil is incidental", tag: "misconception", feedback: "Migraine does not cause a Horner syndrome, and dismissing the pupil leaves the key finding unexplained." },
        { id: "d", text: "Reassure, since the hand weakness has resolved", tag: "unsafe-priority", feedback: "A transient deficit with neck pain and Horner syndrome warns of stroke from dissection and needs same-day evaluation." },
      ],
      rationale: "In a young, previously healthy patient with an acute illness, [[occams-razor|Occam's razor]] is the better first bet. [[carotid-dissection|Carotid artery dissection]] explains neck and head pain (the arterial wall tear), a [[horner-syndrome|Horner syndrome]] (stretch of the sympathetic fibers running on the carotid), and transient hemispheric ischemia (emboli from the dissected segment) on the side that matches. Splitting these into three unrelated problems would miss a treatable cause of stroke.",
      meta: meta("m-mdx-dissection-one", [CAD, HILL]),
    },
    {
      id: "m-mdx-pd-sdh",
      version: 1,
      format: "free-text",
      skill: "differential",
      modules: [M],
      difficulty: 3,
      presentation: "pd-falls-new-decline",
      usage: ["review", "challenge"],
      vignette: "A 78-year-old man has had Parkinson disease for 9 years and takes levodopa. He also takes apixaban for atrial fibrillation. He has fallen 4 times in the past 6 weeks, once hitting his head. Over the past 2 weeks his wife reports new headaches, much more daytime sleepiness, and that he has started dragging his left leg more than usual. A levodopa dose increase last week made no difference. He is drowsy but rousable, and the left arm and leg are weaker than the right, with a left extensor plantar response that was not present at his clinic visit 3 months ago.",
      stem: "Name the second diagnosis you should look for.",
      placeholder: "Second diagnosis",
      answer: {
        full: [
          { id: "sdh", label: "Subdural hematoma", patterns: ["subdural hematoma", "subdural haematoma", "subdural", "sdh", "chronic subdural", "subdural bleed", "subdural hemorrhage"] },
        ],
        partial: [
          { concept: { id: "bleed", label: "Intracranial bleeding (unspecified)", patterns: ["intracranial hemorrhage", "intracranial bleed", "brain bleed", "head bleed", "bleed on the brain", "bleeding on the brain", "bleeding in the brain", "brain hemorrhage", "traumatic brain injury"] }, credit: 0.6, feedback: "Right direction. Be specific: falls on an anticoagulant with headache and drowsiness over 2 weeks is the classic picture of a chronic subdural hematoma." },
          { concept: { id: "stroke", label: "Stroke", patterns: ["stroke", "infarct", "ischemic stroke"] }, credit: 0.3, feedback: "Stroke is possible, but the falls, anticoagulant, headache, and gradual onset over 2 weeks point first to a subdural hematoma." },
        ],
        wrong: [
          { concept: { id: "pdprog", label: "Parkinson disease progression", patterns: ["parkinson progression", "progression of parkinson", "advancing parkinson", "worsening parkinson", "parkinson worse", "wearing off", "levodopa"] }, tag: "misconception", feedback: "Parkinson disease progresses over years and does not cause headache, drowsiness, or an extensor plantar response over 2 weeks." },
          { concept: { id: "dlb", label: "Dementia with Lewy bodies", patterns: ["lewy body", "dementia"] }, tag: "weak-reasoning", feedback: "Cognitive change can occur in Parkinson disease, but it does not explain new one-sided upper motor neuron signs and headache." },
        ],
      },
      modelAnswer: "A chronic subdural hematoma after falls on an anticoagulant; he needs urgent CT of the head.",
      rationale: "Falls are common as [[parkinsonism|Parkinson disease]] advances, and [[anticoagulation|anticoagulation]] makes bleeding after even minor head injury more likely. A [[subdural-hematoma|chronic subdural hematoma]] typically causes headache, drowsiness, and a slowly evolving one-sided deficit over days to weeks. Parkinson disease does not predict any of these at this tempo, nor an extensor plantar response, and the failure of a levodopa increase is a further signal. The second diagnosis is a consequence of the first, the commonest kind of coexisting diagnosis.",
      meta: meta("m-mdx-pd-sdh", [PD, ABER]),
    },
    {
      id: "m-mdx-delirium-dementia",
      version: 1,
      format: "mcq",
      skill: "differential",
      modules: [M],
      difficulty: 2,
      presentation: "dementia-acute-change",
      usage: ["review"],
      vignette: "An 84-year-old woman with moderate Alzheimer disease lives in a care home. At baseline she is pleasant, recognizes her daughter, and can follow a conversation for a few minutes. Over 2 days she has become drowsy in the morning and agitated at night, cannot keep her attention on a question, and drifts off mid-sentence; staff say she is \"better some hours than others.\" The home asks for her antipsychotic dose to be increased because \"her dementia has got worse.\"",
      stem: "What is the best interpretation?",
      options: [
        { id: "a", text: "Delirium superimposed on dementia: look for a cause such as infection, medicines, urinary retention, constipation, or a metabolic disturbance", correct: true, feedback: "Right. An acute, fluctuating change with inattention and altered alertness is delirium, even in a patient with dementia." },
        { id: "b", text: "Progression of Alzheimer disease", tag: "misconception", feedback: "Alzheimer disease declines over months to years; a change over 2 days with fluctuation and inattention is delirium." },
        { id: "c", text: "Behavioral symptoms of dementia needing a higher antipsychotic dose", tag: "unsafe-priority", feedback: "Treating the behavior without finding the cause leaves the delirium untreated, and antipsychotics carry risks in older people with dementia." },
        { id: "d", text: "Dementia with Lewy bodies, newly unmasked", tag: "weak-reasoning", feedback: "Fluctuation occurs in Lewy body dementia, but an abrupt change over 2 days from a stable baseline is delirium until proven otherwise." },
      ],
      rationale: "People with [[dementia|dementia]] are at high risk of [[delirium|delirium]], and [[delirium-superimposed-on-dementia|delirium superimposed on dementia]] is often missed because the change is attributed to the dementia. Acute onset with a fluctuating course, inattention, and either disorganized thinking or an altered level of consciousness are the features of the Confusion Assessment Method. Comparing with the patient's known baseline, usually from family or carers, is what reveals the second process.",
      meta: meta("m-mdx-delirium-dementia", [FICK, CAM]),
    },
    {
      id: "m-mdx-ms-functional",
      version: 1,
      format: "mcq",
      skill: "history-exam",
      modules: [M],
      difficulty: 2,
      presentation: "ms-plus-functional",
      usage: ["review"],
      vignette: "A 36-year-old woman has had relapsing-remitting MS for 8 years, stable on treatment, with a mild residual right leg spasticity and a right extensor plantar response at baseline. After a stressful week she reports 5 days of heaviness of the left leg. She has no fever and no urinary symptoms. The left leg shows give-way weakness and a positive Hoover sign; left leg tone, reflexes, and plantar response are normal and unchanged from her last documented examination. The right leg is unchanged from baseline.",
      stem: "What is the most appropriate interpretation?",
      options: [
        { id: "a", text: "A functional left leg weakness coexisting with her MS: explain the positive signs and refer for functional-oriented physiotherapy, while reassessing if a new objective sign appears", correct: true, feedback: "Right. Positive functional signs with no new objective deficit establish a functional component; the MS diagnosis remains valid." },
        { id: "b", text: "An MS relapse needing high-dose corticosteroids", tag: "misconception", feedback: "Nothing objective has changed, and the positive signs point to a functional mechanism, which steroids do not treat." },
        { id: "c", text: "Evidence that the original MS diagnosis was wrong", tag: "misconception", feedback: "A functional disorder can coexist with MS; her baseline upper motor neuron signs remain explained by MS." },
        { id: "d", text: "Switch to a more potent disease-modifying therapy", tag: "weak-reasoning", feedback: "Escalation is for evidence of new disease activity, which this examination does not show." },
      ],
      rationale: "A [[functional-neurological-disorder|functional disorder]] is diagnosed on positive signs such as the [[hoover-sign|Hoover sign]] and [[give-way-weakness|give-way weakness]], and it can coexist with [[multiple-sclerosis|MS]]. Recognizing both avoids treating a functional symptom as an [[ms-relapse|MS relapse]] and avoids the opposite error of doubting the MS. Comparing with a documented baseline examination is what separates an old deficit, a new objective sign that needs MS reassessment, and a functional overlay.",
      meta: meta("m-mdx-ms-functional", [FND, MSDX]),
    },

    // ---------------- l-explain-every-finding ----------------
    {
      id: "m-mdx-unexplained",
      version: 1,
      format: "multi-select",
      skill: "history-exam",
      modules: [M],
      difficulty: 2,
      presentation: "dsp-plus-myelopathy",
      usage: ["lesson", "review"],
      vignette: "A 67-year-old man with type 2 diabetes is referred as \"worsening diabetic neuropathy.\" His feet have been numb for 6 years. For 8 months his hands have been clumsy and numb and his walking unsteady, while the numbness in his legs has stayed below the ankles. On examination: reduced pinprick and vibration sensation in the toes, absent ankle reflexes, brisk knee and biceps reflexes, extensor plantar responses, numbness of all the fingers of both hands, and an electric sensation down his back when he bends his neck forward.",
      stem: "Which findings are not explained by a length-dependent diabetic polyneuropathy?",
      options: [
        { id: "a", text: "Brisk knee and biceps reflexes", correct: true },
        { id: "b", text: "Extensor plantar responses", correct: true },
        { id: "c", text: "Hand numbness and clumsiness while the leg numbness has stayed below the ankles", correct: true },
        { id: "d", text: "An electric sensation down the back on neck flexion", correct: true },
        { id: "e", text: "Reduced pinprick and vibration sensation in the toes", tag: "misconception", feedback: "Distal loss in the toes is the typical starting point of a length-dependent polyneuropathy." },
        { id: "f", text: "Absent ankle reflexes", tag: "misconception", feedback: "Ankle reflexes are lost early in a length-dependent polyneuropathy; here the neuropathy explains them, even though the cord lesion would otherwise make them brisk." },
      ],
      rationale: "A [[length-dependent|length-dependent]] polyneuropathy starts in the toes, ascends symmetrically, removes the ankle reflexes, and usually reaches the hands only after the legs are affected well above the ankles. It cannot make reflexes brisk or cause extensor plantar responses, which are upper motor neuron signs, or a [[lhermitte-sign|Lhermitte sign]], which arises in the cervical cord. These leftovers point to a second process, a cervical [[myelopathy|myelopathy]], which needs spinal imaging. The absent ankle reflexes are still explained by the neuropathy, which can mask the myelopathy in the legs.",
      meta: meta("m-mdx-unexplained", [ENG, RAD]),
    },
    {
      id: "m-mdx-method",
      version: 1,
      format: "order-priority",
      skill: "history-exam",
      modules: [M],
      difficulty: 2,
      presentation: "explain-every-finding-method",
      usage: ["lesson", "review"],
      vignette: "You are reviewing the 67-year-old man referred with \"worsening diabetic neuropathy\" who has numb feet, absent ankle reflexes, hand clumsiness, brisk knee reflexes, and extensor plantar responses.",
      stem: "Put the steps of the explain-every-finding method in order.",
      steps: [
        { id: "list", text: "List every finding, including the time course of each" },
        { id: "lead", text: "State the leading diagnosis and what it predicts (distribution, side, tempo)" },
        { id: "check", text: "Check each finding against the leading diagnosis: explained, neutral, or unexplained" },
        { id: "left", text: "For the unexplained findings, ask whether a better single diagnosis or a second process explains them, and test the dangerous and treatable options (here, cervical spine MRI)" },
        { id: "stop", text: "Decide whether the explanation is enough to act safely, and record what would reopen the question" },
        { id: "doc", text: "Document each active problem on its own line with the findings it explains and its own plan" },
      ],
      order: [["list"], ["lead"], ["check"], ["left"], ["stop"], ["doc"]],
      rationale: "The method starts with the raw data (every finding and its tempo), then the hypothesis and its predictions, then a finding-by-finding check, then deliberate attention to what is left over. Only after the leftovers are addressed do you decide that the explanation is sufficient and set a trigger to revisit. Separate problem-list entries ([[problem-list|problem list]]) keep the diabetic polyneuropathy and the suspected cervical [[myelopathy|myelopathy]] from merging into one label at handover.",
      meta: meta("m-mdx-method", [ENG, CROSK]),
    },
    {
      id: "m-mdx-document",
      version: 1,
      format: "mcq",
      skill: "uncertainty",
      modules: [M],
      difficulty: 2,
      presentation: "two-problem-documentation",
      usage: ["review"],
      vignette: "The 78-year-old man with Parkinson disease on apixaban has a CT showing a right chronic subdural hematoma with mass effect. Neurosurgery will see him today. You are writing the assessment for the handover.",
      stem: "Which assessment documents his active problems best?",
      options: [
        { id: "a", text: "1. Right chronic subdural hematoma after recurrent falls on apixaban, explaining headache, drowsiness, and left-sided weakness: apixaban held, neurosurgical review today, neuro observations. 2. Parkinson disease: continue levodopa on its usual schedule; falls assessment before discharge. Interaction: decision on restarting anticoagulation for atrial fibrillation to be made with neurosurgery and cardiology. Reassess if drowsiness worsens.", correct: true, feedback: "Right. Each problem has its own line, the findings it explains, its own plan, and how the two interact." },
        { id: "b", text: "Parkinson disease, deteriorating. Subdural on CT. For review.", tag: "incomplete", feedback: "This leads with the old label, gives the new problem no explanation or plan, and leaves the anticoagulant and levodopa decisions unstated." },
        { id: "c", text: "Subdural hematoma. Stop all regular medicines until reviewed.", tag: "unsafe-priority", feedback: "Stopping levodopa abruptly can cause severe rigidity and the parkinsonism-hyperpyrexia syndrome; the chronic problem still needs its own plan." },
        { id: "d", text: "Falls: likely Parkinson disease related. Continue current management.", tag: "weak-reasoning", feedback: "This omits the second diagnosis entirely, which is exactly how it gets lost at handover." },
      ],
      rationale: "A clear [[problem-list|problem list]] gives each active problem its own line with the findings it explains and its own plan, and states how the problems interact. Here the new problem ([[subdural-hematoma|subdural hematoma]]) needs its anticoagulant held and surgical review, while the chronic problem (Parkinson disease) still needs [[levodopa|levodopa]] continued, because abrupt withdrawal risks [[parkinsonism-hyperpyrexia-syndrome|parkinsonism-hyperpyrexia syndrome]]. A merged label such as \"Parkinson disease, deteriorating\" invites [[diagnostic-overshadowing|diagnostic overshadowing]] at the next handover.",
      meta: meta("m-mdx-document", [PD, CROSK]),
    },
    {
      id: "m-mdx-stop",
      version: 1,
      format: "mcq",
      skill: "uncertainty",
      modules: [M],
      difficulty: 3,
      presentation: "delirium-not-resolving",
      usage: ["review", "challenge"],
      vignette: "The 84-year-old woman with Alzheimer disease and delirium was found to have a urinary tract infection and started on antibiotics 4 days ago. Her fever has settled and her urine culture organism is sensitive to the antibiotic. She remains drowsy and inattentive and is still not back to her baseline. Since admission she has been given an anticholinergic bladder medicine and a sedative at night, and she has not opened her bowels for 5 days. A nurse notes a bruise on her forehead from a fall on the ward 3 days ago.",
      stem: "What is the best next step?",
      options: [
        { id: "a", text: "Treat the explanation as incomplete: review and stop deliriogenic medicines, treat constipation, check for urinary retention and metabolic causes, and image the head because of the fall", correct: true, feedback: "Right. The infection was enough to act on, but failure to recover as it settled is the trigger to look for additional causes." },
        { id: "b", text: "Accept that this is her new baseline from dementia progression", tag: "misconception", feedback: "Persistent inattention and drowsiness are delirium features; accepting a new baseline stops the search while treatable causes remain." },
        { id: "c", text: "Extend the antibiotic course and wait another week", tag: "weak-reasoning", feedback: "The infection is responding; repeating the same treatment ignores the other contributors in plain view." },
        { id: "d", text: "Increase the night sedation to improve her sleep", tag: "unsafe-priority", feedback: "Sedatives can worsen delirium and may be one of its causes here." },
      ],
      reasoning: {
        stem: "Which principle does this case illustrate?",
        options: [
          { id: "r1", text: "Stop when the explanation is enough to act, but revisit when the patient does not recover as that explanation predicts", correct: true },
          { id: "r2", text: "Search until every finding has a confirmed cause before starting any treatment", feedback: "Treatment of the infection rightly started without waiting; the point is to revisit, not to delay action." },
          { id: "r3", text: "One diagnosis should always explain everything", feedback: "Delirium in older people often has several contributing causes at once." },
        ],
      },
      rationale: "Delirium in older people with [[dementia|dementia]] is often multifactorial. Finding a urinary infection was sufficient to act on, and the plan should have stated what would reopen the question: no return to baseline as the infection settled. That trigger has been met. Anticholinergic and sedative medicines, constipation, [[urinary-retention|urinary retention]], metabolic disturbance, and a [[subdural-hematoma|subdural hematoma]] after a fall are each additional, treatable contributors. Stopping with a plan to revisit differs from [[premature-closure|premature closure]] because the search resumes when the prediction fails.",
      meta: meta("m-mdx-stop", [FICK, CAM, GRABER]),
    },
  ],
  terms: [
    term("occams-razor", "Occam's razor", ["Ockham's razor", "diagnostic parsimony", "parsimony", "law of parsimony"], "Prefer the one diagnosis that explains everything.", "The principle of diagnostic parsimony: when one diagnosis can account for all the findings, it is preferred over several. Strongest in young, previously healthy patients with an acute illness whose findings share a time course.", "OK-umz", "In a healthy 34-year-old with neck pain, Horner syndrome, and arm weakness, Occam's razor points to carotid dissection.", M, ["hickams-dictum", "working-diagnosis"]),
    term("hickams-dictum", "Hickam's dictum", ["Hickam dictum", "diagnostic multiplicity"], "A patient can have more than one disease at the same time.", "The counterweight to Occam's razor: patients can have several diseases at once. More often applicable in older patients and those with chronic disease, especially when findings have different time courses; most second diagnoses are linked to the first, incidental, or already known.", "HIK-umz DIK-tum", "His diabetic neuropathy explained the numb feet but not the new foot drop; Hickam's dictum reminded the team to look for an L5 radiculopathy.", M, ["occams-razor", "diagnostic-overshadowing"]),
    term("subdural-hematoma", "Subdural hematoma", ["subdural haematoma", "SDH", "chronic subdural hematoma", "subdural"], "Blood collecting between the brain's outer covering and the brain, often after a fall.", "A collection of blood between the dura and the arachnoid, usually from torn bridging veins. A chronic subdural hematoma develops over days to weeks, often after minor head injury in older or anticoagulated patients, and causes headache, drowsiness, confusion, or a slowly evolving one-sided deficit.", "sub-DUR-al hee-muh-TOH-muh", "After several falls on apixaban, his new drowsiness and left weakness were due to a chronic subdural hematoma, not Parkinson disease.", M, ["anticoagulation", "parkinsonism"]),
    term("delirium-superimposed-on-dementia", "Delirium superimposed on dementia", ["delirium on dementia", "DSD"], "A sudden confusion on top of a long-standing dementia.", "Delirium (acute onset, fluctuating course, inattention, and disorganized thinking or altered consciousness) occurring in a person with pre-existing dementia. It is common and frequently missed because the change is attributed to the dementia.", undefined, "Her sudden drowsiness and inattention were delirium superimposed on dementia, caused by a urinary infection.", M, ["delirium", "dementia"]),
    term("problem-list", "Problem list", ["active problem list", "problem-based assessment"], "A numbered list of a patient's current problems, each with its own plan.", "A structured assessment in which each active problem has its own entry stating what it is, which findings it explains, the plan, and how it interacts with other problems. It keeps a second diagnosis from being absorbed into an existing label.", undefined, "The problem list gave the subdural hematoma and the Parkinson disease separate lines and separate plans.", M, ["working-diagnosis", "diagnostic-overshadowing"]),
  ],
  sources: [
    {
      id: HILL,
      kind: "review",
      citation: "Hilliard AA, Weinberger SE, Tierney LM Jr, Midthun DE, Saint S. Clinical problem-solving. Occam's razor versus Saint's triad. N Engl J Med. 2004;350(6):599-603. doi:10.1056/NEJMcps031794",
      title: "Occam's razor versus Saint's triad",
      authors: "Hilliard AA, Weinberger SE, Tierney LM Jr, Midthun DE, Saint S",
      journal: "N Engl J Med",
      year: 2004,
      doi: "10.1056/NEJMcps031794",
      pmid: "14762188",
      url: "https://doi.org/10.1056/NEJMcps031794",
      lastVerified: "2026-11-06",
      verificationNote: "Title, authors, journal, year, volume, issue, pages (599-603), DOI, and PMID confirmed on 2026-11-06 from web search results indexing a library catalog record of the article and secondary references. It is a case-based Clinical Problem-Solving article contrasting diagnostic parsimony (Occam's razor) with Saint's triad as a counterexample. Kind set to review for want of a case-discussion category. The full text was not opened; it is cited only for the concept. PubMed and the publisher page could not be opened from this environment.",
      verified: true,
    },
    {
      id: ABER,
      kind: "primary-research",
      citation: "Aberegg SK, Poole BR, Locke BW. Hickam's dictum: an analysis of multiple diagnoses. J Gen Intern Med. Published online October 28, 2024. doi:10.1007/s11606-024-09120-y",
      title: "Hickam's Dictum: An Analysis of Multiple Diagnoses",
      authors: "Aberegg SK, Poole BR, Locke BW",
      journal: "J Gen Intern Med",
      year: 2024,
      doi: "10.1007/s11606-024-09120-y",
      pmid: "39467949",
      url: "https://doi.org/10.1007/s11606-024-09120-y",
      lastVerified: "2026-11-06",
      verificationNote: "Title, authors, journal, online publication date (2024-10-28), DOI, and PMID confirmed on 2026-11-06 from web search results indexing the PubMed record (listed as online ahead of print) and BibBase. Volume and pages for the print issue were not found and are omitted. The abstract findings used here (review of published case reports and NEJM cases plus a survey; most multiple diagnoses were causally linked, incidentalomas, or known pre-existing disease; a coincident unrelated second diagnosis judged least likely; a framework based on time, probability, and causation) were checked against search summaries. No numbers are quoted in the module. PubMed and the publisher page could not be opened from this environment.",
      verified: true,
    },
    {
      id: FICK,
      kind: "review",
      citation: "Fick DM, Agostini JV, Inouye SK. Delirium superimposed on dementia: a systematic review. J Am Geriatr Soc. 2002;50(10):1723-1732. doi:10.1046/j.1532-5415.2002.50468.x",
      title: "Delirium superimposed on dementia: a systematic review",
      authors: "Fick DM, Agostini JV, Inouye SK",
      journal: "J Am Geriatr Soc",
      year: 2002,
      doi: "10.1046/j.1532-5415.2002.50468.x",
      pmid: "12366629",
      url: "https://doi.org/10.1046/j.1532-5415.2002.50468.x",
      lastVerified: "2026-11-06",
      verificationNote: "Title, authors, journal, year, volume, issue, pages (1723-1732), DOI, and PMID confirmed on 2026-11-06 from web search results indexing the PubMed record, Scilit, and Peeref. Cited for the mainstream points that delirium is common in people with dementia, is frequently unrecognized, and should be distinguished from progression of the dementia. No prevalence figures are quoted in the module. PubMed and the publisher page could not be opened from this environment.",
      verified: true,
    },
  ],
};

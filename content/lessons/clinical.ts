import type { ContentMeta, Lesson } from "../../shared/types";

function meta(id: string, sources: string[]): ContentMeta {
  return { id, version: 1, provenance: "source-grounded", review: "pending", author: "ai-draft", sources, lastVerified: "2026-10-25" };
}

export const CLINICAL_LESSONS: Lesson[] = [
  {
    id: "l-hyperacute-stroke",
    moduleId: "c-acute-ischemic-stroke",
    title: "The first hour of ischemic stroke",
    concept: "Reperfusion saves brain only while the penumbra survives, so every step is organized around excluding hemorrhage and finding a treatable occlusion quickly.",
    minutes: 8,
    meta: meta("l-hyperacute-stroke", ["prabhakaran2026-ais", "hacke2008-ecass3", "goyal2016-hermes", "nogueira2018-dawn", "albers2018-defuse3"]),
    steps: [
      {
        kind: "hook",
        title: "Time is brain, but which steps matter?",
        body: "A 66-year-old has sudden left arm weakness and slurred speech. It is 60 minutes since she was last known well. What must happen before treatment, and what must not delay it?",
      },
      {
        kind: "explain",
        title: "Core, penumbra, and the clock",
        body:
          "An arterial occlusion creates a core of irreversibly injured tissue surrounded by an [[penumbra|ischemic penumbra]] that is dysfunctional but salvageable. Without reperfusion, the core expands into the penumbra over minutes to hours.\n\nThe first steps are: establish last known well, check glucose (hypoglycemia mimics stroke), and get non-contrast CT to exclude hemorrhage. Eligible patients receive IV [[thrombolysis|thrombolysis]] within 4.5 hours of last known well. CT angiography identifies a [[large-vessel-occlusion|large vessel occlusion]] for [[thrombectomy|thrombectomy]], which is beneficial in selected patients up to 24 hours using imaging selection.\n\nA normal early CT is expected: it excludes hemorrhage, not ischemia.",
        layers: {
          simpler: "The blocked artery has a dead center and a stunned rim. The rim can recover if blood flow returns soon. So check sugar, scan for bleeding, then open the artery as fast as possible.",
          mechanism:
            "Collateral vessels keep the penumbra marginally perfused. Neurons there stop firing to save energy (hence the deficit) but remain alive. As collaterals fail, energy failure triggers cell death. Better collaterals mean slower core growth, which is why imaging-based selection can extend treatment windows for some patients.",
          compare:
            "Thrombolysis is a drug that dissolves clot and can be given in any capable emergency department. Thrombectomy mechanically removes clot from a large proximal artery and requires an endovascular team. Many patients with a large vessel occlusion receive both.",
          deeper:
            "Trials established benefit of thrombolysis from 3 to 4.5 hours (ECASS III) and of thrombectomy for anterior large vessel occlusion within 6 hours (HERMES pooled analysis) and, with imaging selection, from 6 to 24 hours (DAWN, DEFUSE 3). Eligibility details, blood pressure targets, and drug choice follow current guidelines (2026 AHA/ASA), which a local stroke protocol implements.",
        },
      },
      { kind: "predict", title: "Order the first steps", itemId: "li-stroke-predict" },
      {
        kind: "explain",
        title: "Common traps",
        body:
          "Do not wait for a visible infarct on CT. Do not delay thrombolysis for CT angiography when the scans cannot be done back to back. Do not start antiplatelet or anticoagulant therapy before the reperfusion decision. Check blood pressure: very high pressure must be lowered before thrombolysis. Stroke mimics (hypoglycemia, seizure with postictal weakness, migraine aura, functional disorder) exist, but the risk of thrombolysis in a mimic is low compared with the cost of withholding it from a true stroke.",
      },
      { kind: "apply", title: "Read the CT", itemId: "li-stroke-apply" },
      {
        kind: "summary",
        title: "Key points",
        points: [
          "Glucose and non-contrast CT come first; CT excludes hemorrhage, not ischemia.",
          "IV thrombolysis for eligible patients within 4.5 hours of last known well.",
          "CT angiography finds large vessel occlusions for thrombectomy, up to 24 hours with selection.",
          "Antithrombotics wait until after the reperfusion decision.",
        ],
        reviewItemIds: ["li-stroke-predict", "li-stroke-apply", "li-stroke-recall"],
      },
    ],
  },
  {
    id: "l-nmj",
    moduleId: "c-nmj",
    title: "Neuromuscular junction: three ways transmission fails",
    concept: "Myasthenia gravis, Lambert-Eaton syndrome, and botulism block the same synapse at different steps, which explains their different signs and test results.",
    minutes: 8,
    meta: meta("l-nmj", ["gilhus2016-mg", "narayanaswami2021-mg", "titulaer2011-lems"]),
    steps: [
      {
        kind: "hook",
        title: "Weak by evening",
        body: "A 34-year-old's eyelids droop by late afternoon and she sees double when driving home. In the morning she is fine. Why would weakness depend on use and time of day?",
      },
      {
        kind: "explain",
        title: "The safety factor",
        body:
          "At the [[nmj|neuromuscular junction]], a nerve impulse opens calcium channels, calcium triggers acetylcholine release, and acetylcholine binds [[acetylcholine-receptor|acetylcholine receptors]] to depolarize the muscle. Normally far more acetylcholine is released than needed: a safety factor.\n\nMyasthenia gravis: antibodies attack postsynaptic receptors. With repeated firing, release naturally falls and the reduced safety margin is exposed, so strength fades with use ([[fatigability|fatigability]]). Ptosis, diplopia, and [[bulbar|bulbar]] weakness are common. Reflexes and sensation are normal.\n\nLambert-Eaton syndrome: antibodies to presynaptic calcium channels reduce release. Brief exercise boosts release ([[facilitation|facilitation]]). Proximal weakness, reduced reflexes, and dry mouth.\n\nBotulism: toxin blocks release itself. Acute descending paralysis, often with dilated pupils.",
        layers: {
          simpler: "The nerve sends a message in packets. In myasthenia, the muscle's receivers are damaged. In Lambert-Eaton, the nerve sends fewer packets. In botulism, the packets cannot be sent at all.",
          mechanism:
            "During repetitive stimulation at low rates, vesicle stores deplete over the first few impulses. With a normal safety factor this changes nothing. With fewer receptors, some fibers fall below threshold, so the compound muscle response shrinks ([[decrement|decrement]]). In LEMS, calcium accumulates during high-rate firing or exercise, temporarily increasing release, so the response grows.",
          compare:
            "MG: fatigable, ocular and bulbar, reflexes normal, autonomic normal, decrement on slow repetitive stimulation. LEMS: proximal legs, reflexes reduced but improve after exercise, dry mouth, small baseline response that increases markedly after exercise. Botulism: acute, descending, bulbar, pupils often involved.",
          deeper:
            "AChR antibodies are found in most generalized MG; MuSK and LRP4 antibodies account for some seronegative cases. About 10 to 15 percent of MG patients have a thymoma, so chest imaging is standard. LEMS is associated with small cell lung cancer in roughly half of cases, so cancer screening is part of the diagnosis.",
        },
      },
      {
        kind: "animation",
        title: "Synapse comparator",
        animation: "nmj",
        preset: "compare",
        caption: "Schematic synapse with a simplified repetitive stimulation trace. Switch between normal, myasthenia gravis, Lambert-Eaton, and botulism.",
        task: "In MG mode, run repeated stimuli and watch the response fall below threshold. Then try LEMS with exercise.",
      },
      { kind: "predict", title: "Which mechanism?", itemId: "li-nmj-predict" },
      { kind: "apply", title: "When it becomes an emergency", itemId: "li-nmj-apply" },
      {
        kind: "summary",
        title: "Key points",
        points: [
          "MG is postsynaptic: fatigable, ocular and bulbar, normal reflexes.",
          "LEMS is presynaptic: proximal weakness, low reflexes that improve with exercise, dry mouth.",
          "Botulism blocks release: acute descending paralysis.",
          "In crisis, measure vital capacity; oxygen saturation falls late.",
        ],
        reviewItemIds: ["li-nmj-predict", "li-nmj-apply", "li-nmj-recall"],
      },
    ],
  },
  {
    id: "l-gbs-conduction",
    moduleId: "c-gbs",
    title: "Demyelination, conduction, and Guillain-Barre syndrome",
    concept: "Losing myelin slows and blocks conduction, producing the weakness, areflexia, and nerve conduction findings of acute inflammatory neuropathy.",
    minutes: 8,
    meta: meta("l-gbs-conduction", ["vandoorn2023-gbs", "leonhard2019-gbs10"]),
    steps: [
      {
        kind: "hook",
        title: "Weak from the feet up",
        body: "Two weeks after a diarrheal illness, a 42-year-old notices tingling feet, then legs that give way on stairs. By day 5 the reflexes are gone. What is happening inside the nerves?",
      },
      {
        kind: "explain",
        title: "Why myelin matters",
        body:
          "Myelin insulates axons so impulses jump between nodes ([[saltatory-conduction|saltatory conduction]]). In acute inflammatory [[demyelination|demyelination]], immune attack strips myelin. Conduction slows, fibers arrive out of step ([[temporal-dispersion|temporal dispersion]]), and some segments stop conducting ([[conduction-block|conduction block]]). Reflexes need synchronized volleys, so they disappear early.\n\nGuillain-Barre syndrome: progressive, usually symmetric weakness over days to 4 weeks, reduced or absent reflexes, often distal sensory symptoms and pain, sometimes facial or bulbar weakness and [[dysautonomia|dysautonomia]]. Many cases follow an infection.\n\nCSF classically shows high protein with normal cells ([[albuminocytologic-dissociation|albuminocytologic dissociation]]), but protein can be normal in the first week.",
        layers: {
          simpler: "Myelin is the insulation on a wire. Strip it and the signal slows, scatters, or stops. Reflexes need a crisp signal, so they fade first.",
          mechanism:
            "In axonal forms, antibodies against gangliosides on the axon membrane (molecular mimicry after Campylobacter infection, for example) injure the axon itself. Then amplitude falls while conduction velocity stays relatively normal, and recovery depends on regrowth, which is slower.",
          compare:
            "Demyelinating pattern: slowed velocity, prolonged latencies, dispersion, conduction block. Axonal pattern: reduced amplitudes with near-normal velocity. Spinal cord disease is the key mimic: look for a sensory level, early sphincter involvement, and upper motor neuron signs.",
          deeper:
            "Treat with IVIG or plasma exchange in patients who cannot walk unaided, ideally within 2 weeks of onset; corticosteroids alone do not help. Monitor vital capacity, swallowing, heart rhythm, and blood pressure. Prognostic tools based on age, diarrhea, and disability help anticipate outcome.",
        },
      },
      {
        kind: "animation",
        title: "Conduction explorer",
        animation: "conduction",
        preset: "compare",
        caption: "Schematic axon with simplified compound muscle action potentials. Compare normal, demyelinating, conduction block, and axonal injury.",
        task: "Switch to demyelination and compare the distal and proximal responses. Then switch to axonal loss.",
      },
      { kind: "predict", title: "Read the pattern", itemId: "li-gbs-predict" },
      { kind: "apply", title: "When tests are early", itemId: "li-gbs-apply" },
      {
        kind: "summary",
        title: "Key points",
        points: [
          "Demyelination slows, disperses, and blocks conduction; axonal injury lowers amplitude.",
          "GBS: progression over days to 4 weeks with areflexia.",
          "Early CSF and nerve studies can be normal.",
          "Monitor vital capacity; treat with IVIG or plasma exchange, not steroids alone.",
        ],
        reviewItemIds: ["li-gbs-predict", "li-gbs-apply", "li-gbs-recall"],
      },
    ],
  },
  {
    id: "l-meningitis",
    moduleId: "c-meningitis",
    title: "Bacterial meningitis: treat first, then prove it",
    concept: "Because outcome worsens with every hour of delay, antibiotics and dexamethasone come before imaging and lumbar puncture when either would cause delay.",
    minutes: 8,
    meta: meta("l-meningitis", ["vandebeek2016-escmid", "nice2024-ng240", "tunkel2004-idsa-bm", "hasbun2001-ct-lp", "degans2002-dexa"]),
    steps: [
      {
        kind: "hook",
        title: "The drowsy student",
        body: "A 19-year-old has fever, headache, and vomiting and is now confused. The CT scanner is busy for 40 minutes. What do you do while you wait?",
      },
      {
        kind: "explain",
        title: "Recognition and order of operations",
        body:
          "The classic triad of fever, neck stiffness, and altered mental status is present in fewer than half of adults with bacterial meningitis, but almost all have at least two of headache, fever, neck stiffness, and altered mental status. Absent [[meningism|meningism]] does not exclude it. A petechial rash suggests meningococcal disease.\n\nOrder: blood cultures, then empiric antibiotics with dexamethasone, without delay. Image before [[lumbar-puncture|lumbar puncture]] only when there are features of possible mass effect: focal deficits, papilledema, reduced consciousness, new seizures, or immunocompromise. If imaging is needed, antibiotics come first.\n\nThe [[csf|CSF]] in bacterial meningitis usually shows raised [[opening-pressure|opening pressure]], neutrophilic [[pleocytosis|pleocytosis]], high protein, and a low CSF to serum glucose ratio. [[gram-stain|Gram stain]] and culture identify the organism.",
        layers: {
          simpler: "This infection can kill within hours. Take blood for culture, give antibiotics and steroid right away, and do the scan and spinal tap afterward if needed.",
          mechanism:
            "Bacteria multiply in the subarachnoid space, where immune defenses are limited. Bacterial lysis (including from antibiotics) releases inflammatory components; the resulting inflammation causes cerebral edema, vasculitis, and raised pressure. Dexamethasone dampens this response and reduces adverse outcomes, most clearly in pneumococcal meningitis.",
          compare:
            "Viral meningitis: lymphocytes, modestly raised protein, normal glucose, usually a milder illness. Tuberculous or fungal: lymphocytes, high protein, low glucose, subacute course. Early viral CSF can be neutrophilic, and prior antibiotics can blunt bacterial findings, so interpret with the clinical picture.",
          deeper:
            "Empiric regimens depend on age, immune status, and local resistance: typically a third-generation cephalosporin, plus vancomycin where resistant pneumococci are a concern, plus ampicillin or amoxicillin when Listeria is a risk (older adults, pregnancy, immunosuppression). Antibiotics given a few hours before LP reduce culture yield but rarely normalize the cell count; PCR and blood cultures help recover a diagnosis.",
        },
      },
      { kind: "predict", title: "Order the steps", itemId: "li-mening-predict" },
      { kind: "apply", title: "Interpret the CSF", itemId: "li-mening-apply" },
      {
        kind: "summary",
        title: "Key points",
        points: [
          "The triad is often incomplete; two of four features is the rule.",
          "Blood cultures, then antibiotics with dexamethasone, without delay.",
          "Image before LP only with features of mass effect, and never delay antibiotics for it.",
          "Bacterial CSF: neutrophils, high protein, low glucose ratio.",
        ],
        reviewItemIds: ["li-mening-predict", "li-mening-apply", "li-mening-recall"],
      },
    ],
  },
  {
    id: "l-autoimmune-encephalitis",
    moduleId: "c-autoimmune-encephalitis",
    title: "Autoimmune encephalitis: test the phenotype, not the menu",
    concept: "Antibody testing is most informative when chosen for the clinical syndrome, sent on the right specimen, and interpreted with assay limits in mind.",
    minutes: 9,
    meta: meta("l-autoimmune-encephalitis", ["graus2016-ae", "dalmau2018-nejm", "budhram2020-neural-ab", "gresaarribas2014-nmdar-titres", "titulaer2013-nmdar"]),
    steps: [
      {
        kind: "hook",
        title: "Psychosis, then seizures",
        body: "A 24-year-old develops anxiety and paranoia over a week, then a seizure, then abnormal mouth movements and swings in heart rate. Psychiatric illness alone does not explain this. What should you test, on which fluid, and can treatment wait for results?",
      },
      {
        kind: "explain",
        title: "Recognize the syndrome first",
        body:
          "[[autoimmune-encephalitis|Autoimmune encephalitis]] is suspected with subacute onset (under 3 months) of memory deficits, altered mental status, or psychiatric symptoms, plus supportive features: new focal signs, unexplained seizures, CSF [[pleocytosis|pleocytosis]], or suggestive MRI. Other causes, especially HSV [[encephalitis|encephalitis]], must be reasonably excluded, and acyclovir is given while HSV is possible.\n\nSome phenotypes point to specific antibodies: psychiatric symptoms, seizures, [[orofacial-dyskinesia|orofacial dyskinesias]], decreased consciousness, and [[dysautonomia|dysautonomia]] in a young woman suggest NMDA receptor antibodies (sometimes with an ovarian [[teratoma|teratoma]]). Faciobrachial dystonic seizures and low sodium suggest LGI1.\n\nTest CSF and serum together by [[cell-based-assay|cell-based assay]] and tissue-based methods. For NMDAR, CSF is more sensitive.",
        layers: {
          simpler: "The immune system can attack receptors that brain cells use to signal. Recognize the pattern, rule out infection, send spinal fluid and blood for antibodies, and start treatment if the picture fits rather than waiting weeks for results.",
          mechanism:
            "Antibodies to neuronal surface receptors (such as NMDAR) cause receptor internalization and reversible dysfunction, which is why these disorders can respond well to immunotherapy. Antibodies to intracellular antigens (such as Hu) are markers of a T cell attack that destroys neurons and responds less well.",
          compare:
            "Surface antibody syndromes: often treatment-responsive, variable cancer association. Intracellular onconeural antibodies: strongly cancer associated, often poorer response. [[seronegative|Seronegative]] autoimmune encephalitis exists and can still meet criteria for probable disease.",
          deeper:
            "Interpretation pitfalls: serum-only testing can miss NMDAR encephalitis and produce false positives; low-titer GAD65 is frequently nonspecific; line blot results for onconeural antibodies have false positives and should be confirmed. A positive [[titer|titer]] in the wrong phenotype rarely means disease. Early immunotherapy and tumor removal are associated with better outcomes in NMDAR encephalitis.",
        },
      },
      { kind: "predict", title: "Choose the specimen", itemId: "li-ae-predict" },
      { kind: "apply", title: "Choose the tests", itemId: "li-ae-apply" },
      {
        kind: "summary",
        title: "Key points",
        points: [
          "Recognize the syndrome and exclude HSV, starting acyclovir while it is possible.",
          "Send phenotype-directed antibody panels on CSF and serum.",
          "Criteria allow treatment before antibody results; seronegative disease exists.",
          "Interpret titers, specimen, and assay in context; low-titer serum positives are often nonspecific.",
        ],
        reviewItemIds: ["li-ae-predict", "li-ae-apply", "li-ae-recall"],
      },
    ],
  },
  {
    id: "l-status-epilepticus",
    moduleId: "c-status-epilepticus",
    title: "Status epilepticus: why speed and stages matter",
    concept: "Seizures become self-sustaining and drug resistant as they continue, so treatment escalates on a clock.",
    minutes: 8,
    meta: meta("l-status-epilepticus", ["glauser2016-se", "kapur2019-esett"]),
    steps: [
      {
        kind: "hook",
        title: "Still seizing at 7 minutes",
        body: "Most seizures stop within 2 minutes. This one has not. Why does waiting make it harder to stop, and what is the sequence of treatment?",
      },
      {
        kind: "explain",
        title: "From seizure to status",
        body:
          "A seizure begins when a population of neurons fires excessively and synchronously. A [[focal-seizure|focal seizure]] starts in one network and can spread to both hemispheres. Normally inhibition terminates it.\n\nIn prolonged seizures, inhibitory GABA-A receptors are pulled from the synapse while excitatory NMDA receptors increase. Inhibition fails, seizures sustain themselves, benzodiazepines lose effect, and [[excitotoxicity|excitotoxic]] injury becomes possible.\n\nTreatment is staged: stabilize and check glucose; give a benzodiazepine at 5 minutes of convulsive activity; if seizures continue, give a second-line IV antiseizure medication; if they still continue ([[refractory|refractory]] status), intubate and start an anesthetic infusion with continuous EEG. Search for the cause in parallel.",
        layers: {
          simpler: "Brain cells get stuck in a loop. The longer the loop runs, the more the brakes wear out, so you give the strongest brake early and escalate fast.",
          mechanism:
            "Receptor trafficking during ongoing seizures internalizes synaptic GABA-A receptors (the benzodiazepine target) and moves NMDA receptors to the surface. This shift explains time-dependent benzodiazepine resistance and why NMDA antagonists are studied in refractory status.",
          compare:
            "Convulsive status is obvious. Nonconvulsive status may look like confusion or coma with subtle twitching and needs EEG to diagnose. Functional (psychogenic) seizures can mimic status; clues include eyes closed with resistance to opening and fluctuating, asynchronous movements, but treat as epileptic until clear.",
          deeper:
            "In the ESETT trial, levetiracetam, fosphenytoin, and valproate stopped benzodiazepine-refractory status in about half of patients each, with no clear winner. Underdosed first-line benzodiazepines are a common, avoidable cause of escalation.",
        },
      },
      {
        kind: "animation",
        title: "Seizure spread and schematic EEG",
        animation: "seizure-eeg",
        preset: "status",
        caption: "Schematic seizure propagation with simplified EEG channels. Not a patient recording.",
        task: "Start a focal seizure and watch it evolve and generalize. Then compare the generalized spike-and-wave and periodic discharge patterns.",
      },
      { kind: "predict", title: "Why early?", itemId: "li-se-predict" },
      { kind: "apply", title: "Sequence the treatment", itemId: "li-se-apply" },
      {
        kind: "summary",
        title: "Key points",
        points: [
          "Treat convulsive seizures lasting 5 minutes as status epilepticus.",
          "Adequate benzodiazepine first, then a second-line agent, then anesthesia with EEG.",
          "Benzodiazepines lose effect as receptor populations shift.",
          "Look for the cause in parallel: glucose, sodium, drug levels, infection, structural lesions.",
        ],
        reviewItemIds: ["li-se-predict", "li-se-apply", "li-se-recall"],
      },
    ],
  },
  {
    id: "l-pretest-probability",
    moduleId: "a-test-interpretation",
    title: "Pretest probability and the meaning of a result",
    concept: "The same test result means different things depending on how likely the disease was before testing, when the test was done, and what preceded it.",
    minutes: 8,
    meta: meta("l-pretest-probability", ["budhram2020-neural-ab", "leonhard2019-gbs10", "kattah2009-hints"]),
    steps: [
      {
        kind: "hook",
        title: "Positive, but is it true?",
        body: "A broad antibody panel in a fatigued 70-year-old comes back with one weakly positive onconeural antibody. A normal MRI in a patient with acute vertigo seems reassuring. Should either result change your thinking?",
      },
      {
        kind: "explain",
        title: "Results update probabilities",
        body:
          "A result moves your estimate; it does not replace it. [[sensitivity|Sensitivity]] is how often the test is positive in disease; [[specificity|specificity]] is how often it is negative without disease. The [[likelihood-ratio|likelihood ratio]] summarizes how far a result moves you.\n\nWhen [[pretest-probability|pretest probability]] is low, most positives are [[false-positive|false positives]]. When it is high, a negative result often leaves disease likely ([[false-negative|false negatives]]).\n\nTiming matters: CSF protein may be normal in the first week of Guillain-Barre syndrome, and diffusion MRI can miss small brainstem strokes in the first 48 hours. Prior treatment matters: antibiotics reduce culture yield; steroids or plasma exchange can lower antibody titers.",
        layers: {
          simpler: "A test is a clue, not a verdict. A weak clue in an unlikely story probably misleads; a negative clue in a very likely story probably misses.",
          mechanism:
            "Post-test odds equal pretest odds multiplied by the likelihood ratio. A positive likelihood ratio of 9 (from 90 percent sensitivity and specificity) turns a 1 percent pretest probability into about 8 percent, but turns 50 percent into 90 percent.",
          compare:
            "Screening a low-risk group with a broad panel invites false positives. Phenotype-directed testing in a patient with a compatible syndrome raises pretest probability, so positives mean more. The same logic explains why bedside HINTS examination can outperform early MRI for stroke in acute vestibular syndrome.",
          deeper:
            "Ask before ordering: what result would change management? If no plausible result would, the test adds cost and the risk of incidental findings. When a result conflicts with a strong clinical picture, repeat the test at a better time, use a different method, or proceed on clinical grounds.",
        },
      },
      { kind: "predict", title: "Do the math", itemId: "li-pretest-predict" },
      { kind: "apply", title: "Interpret in context", itemId: "li-pretest-apply" },
      {
        kind: "summary",
        title: "Key points",
        points: [
          "Low pretest probability: positives are often false.",
          "High pretest probability: negatives often miss disease.",
          "Early timing and prior treatment produce false negatives.",
          "Order tests whose results would change management.",
        ],
        reviewItemIds: ["li-pretest-predict", "li-pretest-apply", "li-pretest-recall"],
      },
    ],
  },
];

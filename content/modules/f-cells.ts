// Module f-cells: neurons, glia, synapses, and myelin, taught through their clinical consequences.

import type { ModuleContent } from "./types";
import { meta, term } from "./types";

const M = "f-cells";

const L1_SOURCES = ["safdieh2019-curriculum", "vandoorn2023-gbs", "vandenbergh2021-cidp", "thompson2018-mcdonald", "graus2021-pns"];
const L2_SOURCES = ["safdieh2019-curriculum", "gilhus2016-mg", "titulaer2011-lems", "glauser2016-se", "bloem2021-pd", "wingerchuk2015-nmosd"];

export const CONTENT: ModuleContent = {
  moduleId: M,
  module: {
    summary: "How neurons fire, why myelin speeds conduction, how synapses and their transmitters work, and how the cell type that is damaged explains the pattern of disease.",
    objectives: [
      ["mechanism", "Explain how sodium channels generate the action potential and why sodium channel blocking drugs reduce firing."],
      ["mechanism", "Explain why myelin speeds conduction and what demyelination does to function and to nerve conduction studies."],
      ["localization", "Separate central from peripheral demyelinating disease by the myelinating cell, and neuronopathy, axonopathy, and myelinopathy by their clinical patterns."],
      ["mechanism", "Describe the steps of chemical transmission and link glutamate, GABA, acetylcholine, and dopamine to one clinical consequence each."],
    ],
    lessons: ["l-cells-conduction", "l-cells-synapse"],
    challengeItems: ["m-cells-pattern-apply", "m-cells-recovery", "m-cells-ganglion", "m-cells-metoclopramide"],
    skills: ["mechanism", "localization", "interpretation", "differential"],
    minutes: 18,
    sources: [...new Set([...L1_SOURCES, ...L2_SOURCES])],
  },

  lessons: [
    // ------------------------------------------------------------------ Lesson 1
    {
      id: "l-cells-conduction",
      moduleId: M,
      title: "Action potentials, myelin, and which part of the neuron is sick",
      concept: "Impulses depend on sodium channels and myelin, and whether disease hits the cell body, the axon, or the myelin predicts the clinical and nerve conduction pattern.",
      minutes: 9,
      meta: meta("l-cells-conduction", L1_SOURCES),
      steps: [
        {
          kind: "hook",
          title: "A numb lip, a hot shower, and numb feet",
          body: "A dental injection numbs a lip within minutes. A synthetic 30-year-old with multiple sclerosis finds her vision blurs in a hot shower and clears as she cools down. A synthetic 66-year-old with diabetes has numbness that has crept up from his toes over years. All three are failures to get an electrical impulse along an axon, but at different points and for different reasons.",
        },
        {
          kind: "explain",
          title: "The action potential",
          body:
            "A neuron at rest is negative inside. The sodium-potassium pump keeps potassium high inside and sodium high outside, and the resting membrane leaks mainly potassium, which sets the [[resting-membrane-potential|resting membrane potential]].\n\nWhen a stimulus pushes the membrane to threshold, [[voltage-gated-sodium-channel|voltage-gated sodium channels]] open, sodium rushes in, and the inside briefly turns positive: the [[action-potential|action potential]]. The sodium channels then inactivate and potassium flows out, restoring the negative state. While its sodium channels are inactivated, a patch of membrane cannot fire again (the refractory period), so the impulse travels one way along the axon.\n\nClinical hooks: local anesthetics and several antiseizure drugs (for example carbamazepine and phenytoin) block sodium channels and so reduce firing. Large shifts in blood potassium change the resting potential, which is one reason severe hyperkalemia or hypokalemia can cause weakness.",
          layers: {
            simpler:
              "Picture the axon as a line of dominoes, each one a patch of membrane. A sodium surge knocks one over, and it tips the next. A domino that has just fallen cannot fall again straight away, so the wave only moves forward. Sodium channel blockers glue some dominoes down.",
            mechanism:
              "Threshold is all or none: below it nothing propagates, above it the full action potential fires. Intensity is coded by how often a neuron fires, not by the size of each spike. Drugs that stabilize the inactivated state of sodium channels suppress rapid repetitive firing, as in a seizure, more than ordinary firing.",
            compare:
              "Graded potentials at dendrites and synapses can be small or large and fade with distance; they add together where the axon begins. Action potentials are fixed in size and regenerate along the axon. At a synapse the electrical signal is turned into a chemical one and back again (lesson 2).",
            deeper:
              "Inherited disorders of sodium and potassium channels (channelopathies) cause some epilepsies, periodic paralyses, and myotonias. A raised extracellular potassium partly depolarizes the membrane, and sustained depolarization keeps sodium channels inactivated, so excitability can fall rather than rise.",
          },
        },
        {
          kind: "explain",
          title: "Myelin and the two cells that make it",
          body:
            "[[myelin|Myelin]] wraps axons in insulating layers, leaving short gaps, the [[node-of-ranvier|nodes of Ranvier]], where sodium channels cluster. The impulse jumps from node to node ([[saltatory-conduction|saltatory conduction]]), which is much faster and more energy efficient than conduction along a bare axon.\n\nTwo different cells make myelin. In the brain, spinal cord, and optic nerve, each [[oligodendrocyte|oligodendrocyte]] myelinates segments of many axons. In peripheral nerves and roots, each [[schwann-cell|Schwann cell]] myelinates one segment of one axon. Immune attack usually targets one compartment or the other: multiple sclerosis is a central demyelinating disease, while Guillain-Barre syndrome and CIDP are peripheral ones.\n\n[[demyelination|Demyelination]] lets current leak out between nodes. Conduction slows, fibers arrive out of step ([[temporal-dispersion|temporal dispersion]]), and some fail completely ([[conduction-block|conduction block]]). Block causes negative symptoms (weakness, numbness, visual loss). Irritable demyelinated segments can also fire on their own and cause positive symptoms such as tingling.",
          layers: {
            simpler:
              "Myelin is insulation that lets the signal leap between bare spots. Strip the insulation and the signal leaks away: it slows, scatters, or dies before it reaches the next bare spot.",
            mechanism:
              "The membrane under myelin has few sodium channels. Once myelin is lost, current from one node spreads over a long, leaky stretch and may not bring the next node to threshold. Over time, demyelinated axons can insert new sodium channels along the bare segment and conduct again, slowly, which is one reason symptoms can improve before repair is complete.",
            compare:
              "Central myelin (oligodendrocytes): multiple sclerosis, with optic neuritis, myelitis, or brainstem syndromes, upper motor neuron signs, and lesions on MRI. Peripheral myelin (Schwann cells): Guillain-Barre syndrome and CIDP, with weakness, early loss of reflexes, and slowed nerve conduction. [[nerve-conduction-studies|Nerve conduction studies]] test peripheral nerves, so they are normal in multiple sclerosis.",
            deeper:
              "Schwann cells remyelinate and guide axon regrowth well, so peripheral nerves recover better than central tracts. Central remyelination is more limited, and in multiple sclerosis accumulating axonal loss, not demyelination alone, underlies lasting disability. Heat further narrows the safety margin of a demyelinated segment, so old symptoms can return briefly with fever, exercise, or a hot bath ([[uhthoff-phenomenon|Uhthoff phenomenon]]) without new damage.",
          },
        },
        {
          kind: "animation",
          title: "Conduction explorer",
          animation: "conduction",
          caption: "Schematic axon with simplified compound muscle action potentials. Compare normal conduction with demyelination, conduction block, and axonal loss.",
          task: "Before switching to demyelination, predict what happens to the proximal response. Then switch to axonal loss and ask which measure falls: speed or size.",
        },
        {
          kind: "explain",
          title: "Which part of the neuron is sick?",
          body:
            "A neuron has a cell body, an axon, and, for many axons, a myelin sheath. Disease aimed at each part produces a recognizable pattern.\n\n[[neuronopathy|Neuronopathy]] (cell body): the whole neuron is lost. Anterior horn cell loss gives pure motor weakness with wasting and [[fasciculation|fasciculations]], as in motor neuron disease. Dorsal root ganglion loss gives patchy sensory loss that can begin in the hands or face, with sensory [[ataxia|ataxia]] and widespread [[areflexia|areflexia]]. Neither follows nerve length.\n\nAxonopathy: [[axonal|axonal]] injury usually begins at the far ends of the longest axons, so it is [[length-dependent|length-dependent]]: toes first, then a stocking and later glove distribution, with ankle jerks lost first. Nerve studies show low amplitudes with near-normal speed. Recovery needs axon regrowth and is slow.\n\nMyelinopathy: demyelination can strike anywhere along the nerve, including the roots, so weakness can be proximal as well as distal, reflexes disappear early and widely, and conduction slows or blocks. Remyelination can be relatively quick.",
          layers: {
            simpler:
              "Kill the factory (the cell body) and everything it makes is gone. Starve the long supply line (the axon) and the farthest outposts, the feet, fail first. Strip the insulation (myelin) and the signal fails wherever the damage sits, close to the spine as well as far away.",
            mechanism:
              "Axons depend on the cell body for proteins delivered by axonal transport. Metabolic, toxic, and nutritional insults impair this supply, and the tips of the longest axons are most vulnerable. When an axon is cut, the part beyond the injury degenerates ([[wallerian-degeneration|Wallerian degeneration]]) and must be replaced by regrowth from the stump.",
            compare:
              "[[guillain-barre-syndrome|Guillain-Barre syndrome]] has demyelinating and axonal forms: demyelinating forms show slowing and block, axonal forms show low amplitudes and often recover more slowly. CIDP is the chronic demyelinating counterpart, progressing over at least 8 weeks.",
            deeper:
              "Sensory neuronopathy (ganglionopathy) has a short list of causes, including paraneoplastic disease, Sjogren syndrome, and some drugs and toxins, so naming the pattern changes the workup. Diabetes typically causes a length-dependent axonal neuropathy. Motor neuron disease is a disorder of neurons, not of nerves, and combines upper and lower motor neuron loss.",
          },
        },
        { kind: "predict", title: "Predict the failure", itemId: "m-cells-demyel-predict" },
        { kind: "apply", title: "Name the pattern", itemId: "m-cells-pattern-apply" },
        {
          kind: "summary",
          title: "Key points",
          points: [
            "Action potentials depend on voltage-gated sodium channels; blocking them (local anesthetics, several antiseizure drugs) reduces firing.",
            "Myelin enables saltatory conduction; demyelination slows, disperses, and blocks impulses.",
            "Oligodendrocytes myelinate the brain, cord, and optic nerve; Schwann cells myelinate peripheral nerves and roots.",
            "Neuronopathy is not length-dependent; axonopathy is length-dependent with low amplitudes and slow recovery; myelinopathy brings early widespread areflexia with slowing and block.",
          ],
          reviewItemIds: ["m-cells-demyel-predict", "m-cells-pattern-apply", "m-cells-ncs-recall", "m-cells-myelin-cell", "m-cells-sodium-recall", "m-cells-recovery", "m-cells-ganglion"],
        },
      ],
    },

    // ------------------------------------------------------------------ Lesson 2
    {
      id: "l-cells-synapse",
      moduleId: M,
      title: "Synapses, transmitters, and the support cells",
      concept: "Each step of chemical transmission (release, receptor binding, and clearance) is a target for disease or drugs, and astrocytes and microglia shape how the nervous system handles activity and injury.",
      minutes: 9,
      meta: meta("l-cells-synapse", L2_SOURCES),
      steps: [
        {
          kind: "hook",
          title: "Four drugs, one kind of junction",
          body: "One day on a neurology ward: midazolam stops a seizure, pyridostigmine helps a synthetic patient with myasthenia lift her eyelids, levodopa eases the slowness of Parkinson disease, and another patient becomes slow and stiff on an antinausea drug. Each acts at a synapse. Knowing the steps of transmission tells you what each drug does and what can go wrong.",
        },
        {
          kind: "explain",
          title: "The chemical synapse",
          body:
            "At a [[synapse|chemical synapse]], the action potential reaches the nerve terminal and opens voltage-gated calcium channels. Calcium entry makes vesicles release a [[neurotransmitter|neurotransmitter]] into the cleft. The transmitter binds receptors on the next cell: some receptors are ion channels that act within milliseconds, others act more slowly through second messengers. The signal must then be switched off, by [[reuptake|reuptake]] into the terminal or nearby glia, by enzymatic breakdown, or by diffusion.\n\nEvery step is a clinical target. In [[lambert-eaton-syndrome|Lambert-Eaton syndrome]], antibodies block presynaptic calcium channels. [[botulism|Botulinum toxin]] stops vesicle release. In [[myasthenia-gravis|myasthenia gravis]], antibodies attack postsynaptic [[acetylcholine-receptor|acetylcholine receptors]]. [[acetylcholinesterase|Acetylcholinesterase]] inhibitors and reuptake-blocking antidepressants work by slowing clearance.",
          layers: {
            simpler:
              "A synapse is a relay. The nerve releases a chemical key, the next cell has a lock for it, and then the key is removed so the next message can get through. Disease or drugs can break the sending, the lock, or the clean-up.",
            mechanism:
              "Release is calcium dependent and comes in packets, one per vesicle. Whether the next cell is excited or inhibited depends on the receptor, not on the transmitter alone. Excitatory receptors let in positive ions and push the membrane toward threshold; inhibitory receptors such as the GABA-A chloride channel hold it away from threshold.",
            compare:
              "Presynaptic failure (Lambert-Eaton syndrome, botulism) reduces how much transmitter is released. Postsynaptic failure (myasthenia gravis) reduces the response to normal release. Slowing clearance amplifies or prolongs a normal signal.",
            deeper:
              "Slowing clearance helps only while receptors remain to be activated, and excess acetylcholinesterase inhibition causes cholinergic side effects such as cramps, diarrhea, and increased secretions. Neuromuscular junction disorders are covered in depth in their own module.",
          },
        },
        {
          kind: "animation",
          title: "Synapse comparator",
          animation: "nmj",
          preset: "compare",
          caption: "Schematic neuromuscular junction with a simplified repetitive stimulation trace. Switch between normal, myasthenia gravis, Lambert-Eaton, and botulism to see which step fails.",
          task: "For each mode, name the step that has failed: release, receptor, or neither.",
        },
        {
          kind: "explain",
          title: "Four transmitters to know",
          body:
            "[[glutamate|Glutamate]] is the main excitatory transmitter in the brain. In ischemia or prolonged seizures, excess glutamate overactivates its receptors, calcium floods in, and neurons die: [[excitotoxicity|excitotoxicity]].\n\nGABA is the main inhibitory transmitter in the brain. Benzodiazepines bind the [[gaba-a-receptor|GABA-A receptor]] and strengthen its inhibition, which is why they stop seizures. The same action explains sedation, added respiratory depression with alcohol or opioids, and seizures after abrupt withdrawal from long-term use.\n\nAcetylcholine is released at the [[nmj|neuromuscular junction]] onto nicotinic receptors and is broken down by acetylcholinesterase. Myasthenia gravis reduces the number of working receptors; pyridostigmine slows breakdown to compensate.\n\n[[dopamine|Dopamine]] neurons in the [[substantia-nigra|substantia nigra]] project to the striatum. Their loss causes the slowness and stiffness of Parkinson disease ([[parkinsonism|parkinsonism]]), and levodopa replaces the missing dopamine. Drugs that block dopamine receptors, such as many antipsychotics and metoclopramide, can produce drug-induced parkinsonism.",
          layers: {
            simpler:
              "Glutamate is the accelerator and GABA is the brake. Acetylcholine tells muscle to contract. Dopamine helps the motor system start movements and keep them flowing.",
            mechanism:
              "NMDA-type glutamate receptors admit calcium. Modest calcium entry supports learning; massive entry activates enzymes that damage the cell. GABA-A receptors are chloride channels, and benzodiazepines make them open more readily when GABA is present, so they amplify the brain's own inhibition rather than replacing it.",
            compare:
              "Status epilepticus combines too little inhibition with too much excitation, and benzodiazepines lose effect as seizures continue because GABA-A receptors are removed from the synapse. Parkinson disease is a loss of dopamine neurons; drug-induced parkinsonism is a blockade of dopamine receptors with the neurons intact, so it tends to be symmetric and often improves after the drug is stopped.",
            deeper:
              "One transmitter can act on several receptor types with different effects, which is why drugs aimed at receptor subtypes have narrower actions and side effects. Parkinson disease also involves non-dopamine systems, which helps explain features such as constipation, sleep disturbance, and cognitive change that levodopa does not fix.",
          },
        },
        {
          kind: "explain",
          title: "Astrocytes and microglia",
          body:
            "Glia do much more than hold neurons together. [[astrocyte|Astrocytes]] take up the glutamate and potassium released during activity, give neurons metabolic support, and wrap blood vessels with end-feet that contribute to the blood-brain barrier. In neuromyelitis optica spectrum disorder, antibodies target [[aquaporin-4|aquaporin-4]], a water channel on astrocyte end-feet. Astrocytes are injured first and myelin damage follows, which is part of why it is a different disease from multiple sclerosis, with its own antibody test.\n\n[[microglia|Microglia]] are the resident immune cells of the central nervous system. They clear debris, respond to injury and infection, and contribute to inflammation in many neurological diseases.\n\nAfter injury, astrocytes multiply and form a scar ([[gliosis|gliosis]]) that seals the damage but limits regrowth of central axons.",
          layers: {
            simpler:
              "Astrocytes are the housekeepers: they mop up spilled transmitter and potassium and feed the neurons. Microglia are the resident security and clean-up crew.",
            mechanism:
              "Astrocyte glutamate transporters keep extracellular glutamate low. When energy fails, as in ischemia, uptake falters, glutamate accumulates, and excitotoxic injury spreads.",
            compare:
              "Myelinating glia: oligodendrocytes (central) and Schwann cells (peripheral). Supporting and immune glia in the central nervous system: astrocytes and microglia. Gliomas, the common primary brain tumors, arise from glial lineage cells.",
            deeper:
              "Gliosis marks old injury on imaging and in pathology. Severe optic neuritis or a long spinal cord lesion with positive aquaporin-4 antibodies points toward neuromyelitis optica spectrum disorder rather than multiple sclerosis.",
          },
        },
        { kind: "predict", title: "Predict the drug effect", itemId: "m-cells-ache-predict" },
        { kind: "apply", title: "Slow and stiff on a new drug", itemId: "m-cells-metoclopramide" },
        {
          kind: "summary",
          title: "Key points",
          points: [
            "Transmission runs: calcium entry, vesicle release, receptor binding, then clearance by reuptake, breakdown, or diffusion.",
            "Glutamate excites and in excess kills neurons; GABA inhibits, and benzodiazepines strengthen GABA-A inhibition.",
            "Acetylcholine drives muscle at the neuromuscular junction; myasthenia attacks its receptor; pyridostigmine slows its breakdown.",
            "Loss of nigral dopamine neurons causes parkinsonism; dopamine-blocking drugs can mimic it.",
            "Astrocytes clear glutamate and potassium and are the target in NMOSD; microglia are the resident immune cells.",
          ],
          reviewItemIds: ["m-cells-ache-predict", "m-cells-metoclopramide", "m-cells-synapse-order", "m-cells-transmitter-hooks", "m-cells-astro"],
        },
      ],
    },
  ],

  items: [
    // ------------------------------------------------------------------ Lesson 1 items
    {
      id: "m-cells-demyel-predict",
      version: 1,
      format: "mcq",
      skill: "mechanism",
      modules: [M],
      difficulty: 1,
      presentation: "demyelinated-segment",
      usage: ["lesson", "review"],
      stem: "Myelin is stripped from one internode of a large motor axon; the axon itself is intact. What happens to an impulse arriving at that segment?",
      options: [
        { id: "a", text: "Current leaks out through the bare membrane, so the next node is reached late or never reaches threshold", correct: true, feedback: "Without insulation, current dissipates along the bare stretch: conduction slows or blocks." },
        { id: "b", text: "It speeds up, because there is less insulation to charge", tag: "misconception", feedback: "Myelin speeds conduction by limiting current loss and capacitance; removing it slows conduction." },
        { id: "c", text: "Nothing changes, because the axon is intact", tag: "misconception", feedback: "An intact axon is necessary but not sufficient: fast conduction depends on myelin and nodal sodium channels." },
        { id: "d", text: "It reverses and travels back toward the cell body", tag: "misconception", feedback: "The refractory period behind the impulse prevents it from turning back." },
      ],
      rationale:
        "In [[saltatory-conduction|saltatory conduction]], current from one node must depolarize the next to threshold. The membrane under myelin has few sodium channels, so when myelin is lost the current leaks across a long stretch. Conduction slows, or fails entirely ([[conduction-block|conduction block]]).",
      meta: meta("m-cells-demyel-predict", ["safdieh2019-curriculum", "vandoorn2023-gbs"]),
    },
    {
      id: "m-cells-pattern-apply",
      version: 1,
      format: "mcq",
      skill: "differential",
      modules: [M],
      difficulty: 2,
      presentation: "stocking-glove-neuropathy",
      usage: ["lesson", "review", "challenge"],
      vignette:
        "A synthetic 66-year-old with long-standing diabetes has 3 years of burning numbness that began in the toes and now reaches the knees. His fingertips started tingling a few months ago. Ankle jerks are absent; knee and arm reflexes are present. Strength is normal apart from weak toe extension.",
      stem: "Which cellular pattern best explains this picture?",
      options: [
        { id: "a", text: "Length-dependent axonopathy: the longest axons fail first, from their far ends", correct: true, feedback: "Toes first, then hands once the legs are involved to about the knees, with ankle jerks lost first: a length-dependent pattern." },
        { id: "b", text: "Demyelinating neuropathy (myelinopathy)", tag: "misconception", feedback: "Acquired demyelination can hit roots and proximal nerve, so reflexes are lost early and widely and weakness is not confined to the longest nerves." },
        { id: "c", text: "Motor neuronopathy (anterior horn cell disease)", tag: "misconception", feedback: "Anterior horn cell disease is purely motor, with wasting and fasciculations, and does not cause numbness." },
        { id: "d", text: "Sensory neuronopathy (dorsal root ganglion disease)", tag: "misconception", feedback: "Ganglionopathy is patchy and not length-dependent: it can start in the hands or face and causes early widespread areflexia." },
      ],
      reasoning: {
        stem: "Which feature most specifically shows length dependence?",
        options: [
          { id: "r1", text: "Fingertip symptoms began only after the leg symptoms reached the knees", correct: true },
          { id: "r2", text: "The burning quality of the symptoms", feedback: "Burning reflects small fiber involvement; it does not show which part of the neuron is affected." },
          { id: "r3", text: "Mostly normal strength", feedback: "Many neuropathies spare strength early, whatever the pattern." },
        ],
      },
      rationale:
        "Axons depend on the cell body for supplies carried along their length, so metabolic injury hits the tips of the longest axons first. The longest axons reach the toes; hand axons are about as long as the leg axons that end near the knee, which is why the hands join in at that point. Nerve studies in [[axonal|axonal]] neuropathy show low amplitudes with near-normal velocities. A demyelinating process would bring early, widespread areflexia and slowed conduction.",
      meta: meta("m-cells-pattern-apply", ["safdieh2019-curriculum", "vandoorn2023-gbs"]),
    },
    {
      id: "m-cells-ncs-recall",
      version: 1,
      format: "multi-select",
      skill: "interpretation",
      modules: [M],
      difficulty: 1,
      presentation: "ncs-demyelinating",
      usage: ["lesson", "review"],
      schematic: { kind: "ncs", pattern: "demyelinating" },
      stem: "Select every nerve conduction finding that points to demyelination rather than axonal loss.",
      options: [
        { id: "a", text: "Slowed conduction velocity", correct: true },
        { id: "b", text: "Prolonged distal latency", correct: true },
        { id: "c", text: "[[conduction-block|Conduction block]] between distal and proximal stimulation", correct: true },
        { id: "d", text: "[[temporal-dispersion|Temporal dispersion]] of the proximal response", correct: true },
        { id: "e", text: "Low amplitude with near-normal velocity", tag: "misconception", feedback: "Fewer surviving axons that still conduct at normal speed: the axonal pattern." },
        { id: "f", text: "Decrement on slow repetitive stimulation", tag: "misconception", feedback: "Decrement reflects a postsynaptic neuromuscular junction disorder such as myasthenia gravis, not nerve demyelination." },
      ],
      rationale:
        "Loss of myelin slows conduction (velocity and latency), spreads arrival times across fibers (dispersion), and stops some fibers altogether (block). Axonal loss removes fibers but leaves the survivors conducting normally, so the [[cmap|CMAP]] is small but on time.",
      meta: meta("m-cells-ncs-recall", ["vandoorn2023-gbs", "vandenbergh2021-cidp"]),
    },
    {
      id: "m-cells-myelin-cell",
      version: 1,
      format: "mcq",
      skill: "mechanism",
      modules: [M],
      difficulty: 1,
      presentation: "relapsing-optic-neuritis",
      usage: ["lesson", "review"],
      vignette: "A synthetic 27-year-old has painful blurred vision in one eye. A year ago her legs were numb for three weeks and then recovered. MRI shows several white matter lesions in the brain and spinal cord.",
      stem: "Which cell makes the myelin that is injured in this disorder?",
      options: [
        { id: "a", text: "Oligodendrocyte", correct: true },
        { id: "b", text: "Schwann cell", tag: "misconception", feedback: "The optic nerve is a central tract myelinated by oligodendrocytes, despite its name. Schwann cells myelinate peripheral nerves." },
        { id: "c", text: "Astrocyte", tag: "knowledge-gap", feedback: "Astrocytes support neurons and are the target in NMOSD, but they do not make myelin." },
        { id: "d", text: "Microglia", tag: "knowledge-gap", feedback: "Microglia are resident immune cells; they take part in inflammation but do not make myelin." },
      ],
      rationale:
        "Relapsing episodes in different parts of the central nervous system with white matter lesions suggest multiple sclerosis, a central demyelinating disease. Central myelin, including that of the optic nerve, is made by [[oligodendrocyte|oligodendrocytes]]. This is why nerve conduction studies are normal in multiple sclerosis and why peripheral demyelinating diseases look so different.",
      meta: meta("m-cells-myelin-cell", ["thompson2018-mcdonald", "safdieh2019-curriculum"]),
    },
    {
      id: "m-cells-sodium-recall",
      version: 1,
      format: "mcq",
      skill: "mechanism",
      modules: [M],
      difficulty: 1,
      presentation: "sodium-channel-drugs",
      usage: ["lesson", "review"],
      stem: "Lidocaine numbs a finger before suturing, and carbamazepine reduces focal seizures. Which shared mechanism explains both?",
      options: [
        { id: "a", text: "Blocking voltage-gated sodium channels, making action potentials harder to generate and repeat", correct: true },
        { id: "b", text: "Strengthening GABA-A receptor inhibition", tag: "misconception", feedback: "That is the benzodiazepine mechanism." },
        { id: "c", text: "Blocking acetylcholine receptors at the neuromuscular junction", tag: "misconception", feedback: "That is how neuromuscular blocking agents cause paralysis; it does not numb skin or stop seizures." },
        { id: "d", text: "Stripping myelin from axons", tag: "misconception", feedback: "Neither drug damages myelin; their effects wear off as the drug is cleared." },
      ],
      rationale:
        "The upstroke of the [[action-potential|action potential]] depends on [[voltage-gated-sodium-channel|voltage-gated sodium channels]]. A local anesthetic blocks conduction in the nerve where it is injected. Sodium channel blocking antiseizure drugs preferentially damp the rapid repetitive firing of a seizure.",
      meta: meta("m-cells-sodium-recall", ["safdieh2019-curriculum"]),
    },
    {
      id: "m-cells-recovery",
      version: 1,
      format: "free-text",
      skill: "mechanism",
      modules: [M],
      difficulty: 2,
      presentation: "neuropathy-recovery",
      usage: ["review", "challenge"],
      vignette:
        "Two synthetic adults develop acute neuropathies of similar severity. Patient A's nerve studies show slowed conduction and conduction block with normal distal amplitudes. Patient B's show very low amplitudes with near-normal velocities. Patient A walks again within weeks; patient B needs many months.",
      stem: "Why does patient A recover faster?",
      placeholder: "What has to be repaired in each patient?",
      answer: {
        full: [
          {
            id: "remyelin",
            label: "Remyelination of intact axons is faster than axonal regrowth",
            // "remyelination" is one edit from "demyelination", so it is only accepted alongside regrowth or Schwann cells.
            patterns: ["remyelination + regrow", "remyelination + regrowth", "remyelination + regenerate", "remyelinate + schwann", "remyelination + schwann", "myelin + repair", "myelin + regrow", "myelin + restored", "myelin + rebuilt", "myelin + recover", "axon + regrow + slow", "axon + regrowth + slow", "axon + regenerate + slow", "axonal + regrow + slow", "axonal + regrowth + slow", "axonal + regeneration + slow", "axon + intact + myelin", "axon + preserved + myelin"],
          },
        ],
        partial: [
          { concept: { id: "remyelin", label: "Remyelination, without contrasting axon regrowth", patterns: ["remyelination", "remyelinate", "remyelinated"] }, credit: 0.6, feedback: "Right mechanism for patient A. Complete it: B has lost axons, which must regrow slowly from the cell body over months." },
          { concept: { id: "labels", label: "Names demyelinating versus axonal without the reason", patterns: ["demyelinating", "demyelination", "axonal", "axon loss"] }, credit: 0.5, feedback: "Right patterns: A is demyelinating, B is axonal. Now say why that matters: myelin can be repaired in weeks around intact axons, while lost axons must regrow slowly." },
        ],
        wrong: [
          { concept: { id: "neurons", label: "New neurons", patterns: ["new neuron", "neuron + regenerate", "neuron + regrow"] }, tag: "misconception", feedback: "Neither patient grows new neurons; the cell bodies survive. A repairs myelin, and B regrows axons from the surviving cell bodies." },
        ],
      },
      modelAnswer:
        "Patient A has demyelination with intact axons, and Schwann cells can remyelinate the damaged segments within weeks. Patient B has lost axons, which must regrow slowly from the cell body over months.",
      rationale:
        "Conduction block and slowing with preserved distal amplitudes mean the axons are present but poorly insulated. [[schwann-cell|Schwann cells]] remyelinate relatively quickly. Low amplitudes mean axons have been lost; beyond the injury they undergo [[wallerian-degeneration|Wallerian degeneration]] and must regrow along the nerve, which takes months and may be incomplete. This is why axonal forms of Guillain-Barre syndrome often recover more slowly.",
      meta: meta("m-cells-recovery", ["vandoorn2023-gbs"]),
    },
    {
      id: "m-cells-ganglion",
      version: 1,
      format: "free-text",
      skill: "localization",
      modules: [M],
      difficulty: 3,
      presentation: "non-length-dependent-sensory",
      usage: ["review", "challenge"],
      vignette:
        "A synthetic 61-year-old has 2 months of numbness and clumsiness that began in the left hand and the face, then spread to the right foot. With her eyes closed she misses her nose with her finger, and her outstretched fingers drift and writhe. Reflexes are absent everywhere. Strength is normal. Sensory nerve responses are absent in the arms and legs; motor nerve studies are normal.",
      stem: "Which part of which neuron is primarily affected?",
      placeholder: "Part of the neuron and where it sits",
      answer: {
        full: [
          {
            id: "drg",
            label: "Sensory neuron cell bodies in the dorsal root ganglia (sensory neuronopathy)",
            patterns: ["dorsal root ganglion", "ganglionopathy", "sensory neuronopathy", "neuronopathy + sensory", "drg", "sensory neuron + cell body", "cell body + dorsal root"],
          },
        ],
        partial: [
          { concept: { id: "cellbody", label: "Cell body, without naming the sensory neuron or ganglion", patterns: ["neuronopathy", "cell body"] }, credit: 0.6, feedback: "Right level of the neuron. Be specific: purely sensory loss with absent sensory responses places it in the dorsal root ganglion." },
        ],
        wrong: [
          { concept: { id: "length", label: "Length-dependent axonopathy", patterns: ["length dependent", "axonopathy", "distal axon", "stocking glove"] }, tag: "misconception", feedback: "A length-dependent axonopathy starts symmetrically in the feet. Onset in a hand and the face, with widespread areflexia, is not length-dependent." },
          { concept: { id: "myelin", label: "Demyelination", patterns: ["demyelinating", "demyelination", "myelinopathy"] }, tag: "misconception", feedback: "Demyelination would slow or block motor conduction too. Here motor studies are normal and sensory responses are absent, not slowed." },
          { concept: { id: "dc", label: "Dorsal columns only", patterns: ["dorsal column", "posterior column"] }, tag: "weak-reasoning", feedback: "The joint position loss fits, but a lesion confined to the cord would not abolish peripheral sensory nerve responses. The whole sensory neuron is lost, from the ganglion." },
        ],
      },
      modelAnswer: "The sensory neuron cell bodies in the dorsal root ganglia: a sensory neuronopathy (ganglionopathy).",
      rationale:
        "When the cell body dies, both its peripheral and central branches are lost at once, so the deficit follows the distribution of affected ganglia rather than nerve length. Hence patchy onset that can involve the hands or face, loss of proprioception with sensory [[ataxia|ataxia]] and writhing fingers, widespread [[areflexia|areflexia]], absent sensory responses, and normal motor studies. A [[neuronopathy|sensory neuronopathy]] is a recognized paraneoplastic phenotype, and other causes include Sjogren syndrome and some drugs and toxins, so the pattern directs the workup.",
      meta: meta("m-cells-ganglion", ["graus2021-pns", "safdieh2019-curriculum"]),
    },

    // ------------------------------------------------------------------ Lesson 2 items
    {
      id: "m-cells-ache-predict",
      version: 1,
      format: "mcq",
      skill: "mechanism",
      modules: [M],
      difficulty: 1,
      presentation: "pyridostigmine-mg",
      usage: ["lesson", "review"],
      stem: "In myasthenia gravis, antibodies reduce the number of working acetylcholine receptors. Pyridostigmine inhibits acetylcholinesterase. What do you predict?",
      options: [
        { id: "a", text: "Acetylcholine stays in the cleft longer, activates the remaining receptors more, and strength improves", correct: true },
        { id: "b", text: "The antibodies are removed and the disease is cured", tag: "misconception", feedback: "Pyridostigmine is symptomatic: it does not touch the immune process." },
        { id: "c", text: "The nerve terminal releases more acetylcholine", tag: "misconception", feedback: "Pyridostigmine acts on breakdown in the cleft, not on presynaptic release." },
        { id: "d", text: "Weakness worsens because acetylcholine is broken down faster", tag: "knowledge-gap", feedback: "Inhibiting the enzyme slows breakdown, the opposite effect." },
      ],
      rationale:
        "[[acetylcholinesterase|Acetylcholinesterase]] ends the signal at the [[nmj|neuromuscular junction]]. Inhibiting it lets each released packet of acetylcholine act longer on the reduced pool of [[acetylcholine-receptor|receptors]], restoring part of the safety margin. It treats symptoms; immunotherapy treats the disease.",
      meta: meta("m-cells-ache-predict", ["gilhus2016-mg"]),
    },
    {
      id: "m-cells-metoclopramide",
      version: 1,
      format: "mcq",
      skill: "mechanism",
      modules: [M],
      difficulty: 2,
      presentation: "drug-induced-parkinsonism",
      usage: ["lesson", "review", "challenge"],
      vignette:
        "A synthetic 72-year-old started metoclopramide for nausea six weeks ago. She now moves slowly, speaks softly, has reduced arm swing on both sides, and has a mild rest tremor of both hands.",
      stem: "What is the most likely mechanism?",
      options: [
        { id: "a", text: "Blockade of dopamine receptors in the striatum, mimicking the dopamine loss of Parkinson disease", correct: true, feedback: "Metoclopramide blocks dopamine receptors; with the signal blocked, the motor picture resembles dopamine deficiency." },
        { id: "b", text: "Death of dopamine neurons in the substantia nigra caused by the drug", tag: "misconception", feedback: "The neurons are intact; the receptors are blocked. That is why stopping the drug often brings improvement, though it can be slow." },
        { id: "c", text: "Excess acetylcholine at the neuromuscular junction", tag: "misconception", feedback: "Junction disorders cause fatigable weakness, not slowness, rest tremor, and reduced arm swing." },
        { id: "d", text: "Strengthened GABA-A inhibition", tag: "misconception", feedback: "That describes benzodiazepines, which sedate but do not cause parkinsonism." },
      ],
      reasoning: {
        stem: "Which feature most supports a drug cause over new Parkinson disease?",
        options: [
          { id: "r1", text: "Symmetric onset within weeks of starting a dopamine-blocking drug", correct: true },
          { id: "r2", text: "Rest tremor", feedback: "Rest tremor can occur in both, so it does not separate them." },
          { id: "r3", text: "Age over 70", feedback: "Age raises the likelihood of both and does not separate them." },
        ],
      },
      rationale:
        "In Parkinson disease, nigral [[dopamine|dopamine]] neurons degenerate, and the signs usually begin on one side. Dopamine receptor blockers (many antipsychotics, metoclopramide) produce [[parkinsonism|parkinsonism]] with the neurons intact, typically symmetric and timed to the drug. The first step is to stop the offending drug if possible.",
      meta: meta("m-cells-metoclopramide", ["bloem2021-pd", "safdieh2019-curriculum"]),
    },
    {
      id: "m-cells-synapse-order",
      version: 1,
      format: "order-priority",
      skill: "mechanism",
      modules: [M],
      difficulty: 1,
      presentation: "synaptic-sequence",
      usage: ["lesson", "review"],
      stem: "Put the steps of chemical synaptic transmission in order.",
      steps: [
        { id: "a", text: "Action potential reaches the nerve terminal" },
        { id: "b", text: "Voltage-gated calcium channels open and calcium enters" },
        { id: "c", text: "Vesicles fuse and release transmitter into the cleft" },
        { id: "d", text: "Transmitter binds postsynaptic receptors" },
        { id: "e", text: "Signal ends by reuptake, enzymatic breakdown, or diffusion" },
      ],
      order: [["a"], ["b"], ["c"], ["d"], ["e"]],
      rationale:
        "Each step has a clinical counterpart. Calcium entry fails in [[lambert-eaton-syndrome|Lambert-Eaton syndrome]]. Release fails in [[botulism|botulism]]. Receptor binding fails in [[myasthenia-gravis|myasthenia gravis]]. Clearance is the target of acetylcholinesterase inhibitors and reuptake-blocking antidepressants.",
      meta: meta("m-cells-synapse-order", ["gilhus2016-mg", "titulaer2011-lems"]),
    },
    {
      id: "m-cells-transmitter-hooks",
      version: 1,
      format: "multi-select",
      skill: "mechanism",
      modules: [M],
      difficulty: 1,
      presentation: "transmitter-hooks",
      usage: ["lesson", "review"],
      stem: "Select every correct pairing of transmitter and clinical consequence.",
      options: [
        { id: "a", text: "Glutamate: excess during ischemia or prolonged seizures injures neurons ([[excitotoxicity|excitotoxicity]])", correct: true },
        { id: "b", text: "GABA: benzodiazepines strengthen GABA-A receptor inhibition and stop seizures", correct: true },
        { id: "c", text: "Acetylcholine: antibodies against its muscle receptor cause myasthenia gravis", correct: true },
        { id: "d", text: "Dopamine: loss of nigrostriatal neurons causes parkinsonism", correct: true },
        { id: "e", text: "GABA: the main excitatory transmitter in the cortex", tag: "terminology", feedback: "GABA is the main inhibitory transmitter in the brain; glutamate is the main excitatory one." },
        { id: "f", text: "Dopamine: the transmitter that activates skeletal muscle", tag: "misconception", feedback: "Acetylcholine acts at the neuromuscular junction; dopamine acts within the brain's motor circuits." },
        { id: "g", text: "Glutamate: benzodiazepines work by blocking its receptors", tag: "misconception", feedback: "Benzodiazepines act on GABA-A receptors, not glutamate receptors." },
      ],
      rationale:
        "Glutamate excites, and in excess kills, neurons. GABA inhibits, and [[gaba-a-receptor|GABA-A]] modulators such as benzodiazepines are first-line treatment for status epilepticus. Acetylcholine activates muscle at the [[nmj|neuromuscular junction]]. Dopamine from the [[substantia-nigra|substantia nigra]] supports movement, and its loss causes parkinsonism.",
      meta: meta("m-cells-transmitter-hooks", ["glauser2016-se", "gilhus2016-mg", "bloem2021-pd"]),
    },
    {
      id: "m-cells-astro",
      version: 1,
      format: "mcq",
      skill: "mechanism",
      modules: [M],
      difficulty: 2,
      presentation: "aquaporin-astrocyte",
      usage: ["lesson", "review"],
      vignette: "A synthetic 38-year-old has severe optic neuritis and, months later, a spinal cord lesion spanning many segments. Serum aquaporin-4 antibodies are positive.",
      stem: "Which cell is the primary target of the immune attack?",
      options: [
        { id: "a", text: "Astrocyte", correct: true, feedback: "Aquaporin-4 is a water channel concentrated on astrocyte end-feet." },
        { id: "b", text: "Oligodendrocyte", tag: "misconception", feedback: "Myelin is damaged in this disease, but largely as a consequence of astrocyte injury. A primary oligodendrocyte and myelin process is the multiple sclerosis model." },
        { id: "c", text: "Schwann cell", tag: "misconception", feedback: "The optic nerve and spinal cord are central structures; Schwann cells are peripheral." },
        { id: "d", text: "Motor neuron", tag: "knowledge-gap", feedback: "Motor neurons are not the antibody target; the disability comes from inflammatory lesions of the optic nerve and cord." },
      ],
      rationale:
        "In [[aquaporin-4|aquaporin-4]] antibody positive neuromyelitis optica spectrum disorder, antibodies bind [[astrocyte|astrocyte]] end-feet and trigger complement-mediated injury, with demyelination following. Severe optic neuritis and long cord lesions are typical, and the antibody test separates it from multiple sclerosis.",
      meta: meta("m-cells-astro", ["wingerchuk2015-nmosd"]),
    },
  ],

  terms: [
    term("resting-membrane-potential", "Resting membrane potential", ["resting potential"],
      "The small electrical charge across a nerve cell's membrane when it is not firing: negative inside.",
      "The voltage across the membrane of an unstimulated cell, set mainly by potassium leak through open channels and maintained by the sodium-potassium pump. Changes in extracellular potassium shift it and alter excitability.",
      undefined,
      "Severe hyperkalemia shifts the resting membrane potential and can cause weakness.",
      M, ["action-potential", "voltage-gated-sodium-channel"]),
    term("action-potential", "Action potential", ["nerve impulse", "spike"],
      "The brief electrical signal that travels along a nerve fiber.",
      "An all-or-none, self-regenerating depolarization of excitable membrane caused by opening of voltage-gated sodium channels, followed by repolarization as sodium channels inactivate and potassium channels open. The refractory period makes propagation one-way.",
      undefined,
      "Local anesthetics stop action potentials from passing through the injected nerve.",
      M, ["resting-membrane-potential", "voltage-gated-sodium-channel", "saltatory-conduction"]),
    term("voltage-gated-sodium-channel", "Voltage-gated sodium channel", ["sodium channel"],
      "A gate in the nerve membrane that opens to let sodium in and start a nerve signal.",
      "A membrane channel that opens at threshold to produce the upstroke of the action potential, then inactivates. Clustered at nodes of Ranvier. Target of local anesthetics and several antiseizure drugs such as carbamazepine and phenytoin.",
      undefined,
      "Carbamazepine blocks voltage-gated sodium channels and reduces repetitive firing.",
      M, ["action-potential", "node-of-ranvier"]),
    term("myelin", "Myelin", ["myelin sheath"],
      "The fatty insulating coat wrapped around many nerve fibers.",
      "Concentric layers of glial membrane around an axon, made by oligodendrocytes centrally and Schwann cells peripherally. It reduces current loss between nodes and allows saltatory conduction.",
      "MY-uh-lin",
      "Loss of myelin in multiple sclerosis slows conduction in central tracts.",
      M, ["demyelination", "saltatory-conduction", "oligodendrocyte", "schwann-cell"]),
    term("node-of-ranvier", "Node of Ranvier", ["nodes of Ranvier", "node"],
      "A small bare gap between stretches of myelin where the nerve signal is renewed.",
      "A short unmyelinated segment between internodes where voltage-gated sodium channels are concentrated. The action potential regenerates at each node, jumping between them in saltatory conduction.",
      "RAHN-vee-ay",
      "In demyelination, current leaks before reaching the next node of Ranvier.",
      M, ["saltatory-conduction", "myelin"]),
    term("oligodendrocyte", "Oligodendrocyte", [],
      "The cell that makes myelin in the brain, spinal cord, and optic nerve.",
      "A central nervous system glial cell whose processes myelinate internodes on many axons. It is the myelinating cell injured in multiple sclerosis; central remyelination is limited.",
      "OL-ih-go-DEN-dro-site",
      "Optic neuritis injures oligodendrocyte myelin, so it is a central demyelinating event.",
      M, ["myelin", "schwann-cell", "demyelination"]),
    term("schwann-cell", "Schwann cell", [],
      "The cell that makes myelin in peripheral nerves and nerve roots.",
      "A peripheral nervous system glial cell that myelinates a single internode of a single axon (or ensheathes several small unmyelinated axons). It remyelinates and supports axon regrowth after injury. Its myelin is the target in Guillain-Barre syndrome and CIDP.",
      "SHWAHN",
      "Schwann cell remyelination helps explain recovery after demyelinating Guillain-Barre syndrome.",
      M, ["myelin", "oligodendrocyte", "demyelination"]),
    term("uhthoff-phenomenon", "Uhthoff phenomenon", ["Uhthoff's phenomenon"],
      "Old symptoms of multiple sclerosis briefly getting worse with heat, then settling.",
      "Transient worsening of existing demyelinating symptoms with a rise in body temperature (exercise, fever, hot baths), from reduced conduction safety in demyelinated axons. It does not indicate new inflammation.",
      "OOT-hoff",
      "Her vision blurs after a hot shower and clears within the hour: Uhthoff phenomenon.",
      M, ["demyelination", "conduction-block"]),
    term("neuronopathy", "Neuronopathy", ["ganglionopathy", "sensory neuronopathy"],
      "Disease that destroys whole nerve cells, starting at the cell body.",
      "A disorder of the neuronal cell body, causing loss of the entire neuron. Motor neuronopathy affects anterior horn cells; sensory neuronopathy (ganglionopathy) affects dorsal root ganglion cells and produces non-length-dependent sensory loss with sensory ataxia and areflexia.",
      "nur-on-OP-uh-thee",
      "Sensory loss beginning in the face and one hand, with absent sensory responses, suggests a sensory neuronopathy.",
      M, ["axonal", "demyelination", "length-dependent"]),
    term("length-dependent", "Length-dependent", ["stocking-glove", "stocking and glove"],
      "Affecting the longest nerves first, so symptoms start in the toes and later reach the fingers.",
      "A distribution in which the longest axons fail first from their distal ends, giving symmetric distal sensory loss in the feet, loss of ankle jerks, and later hand involvement. Typical of axonal polyneuropathy such as diabetic neuropathy.",
      undefined,
      "Numb feet for years, fingertips only recently: a length-dependent neuropathy.",
      M, ["axonal", "neuronopathy"]),
    term("wallerian-degeneration", "Wallerian degeneration", [],
      "The breakdown of the part of a nerve fiber cut off from its cell body.",
      "Degeneration of the axon and its myelin distal to a site of axonal injury. Recovery requires regrowth from the proximal stump, which is slow.",
      "wah-LEER-ee-un",
      "After the axon is severed, the distal segment undergoes Wallerian degeneration.",
      M, ["axonal"]),
    term("synapse", "Synapse", ["chemical synapse"],
      "The junction where one nerve cell passes a signal to another cell.",
      "A specialized junction where an action potential triggers calcium-dependent release of neurotransmitter, which binds receptors on the postsynaptic cell; the signal is ended by reuptake, enzymatic breakdown, or diffusion.",
      "SIN-aps",
      "The neuromuscular junction is a synapse between a motor nerve and a muscle fiber.",
      M, ["neurotransmitter", "reuptake", "nmj"]),
    term("neurotransmitter", "Neurotransmitter", ["transmitter"],
      "A chemical messenger released by a nerve cell to signal the next cell.",
      "A substance released from presynaptic vesicles that acts on postsynaptic receptors. Examples: glutamate (excitatory), GABA (inhibitory), acetylcholine, and dopamine.",
      undefined,
      "Acetylcholine is the neurotransmitter at the neuromuscular junction.",
      M, ["synapse", "glutamate", "dopamine"]),
    term("reuptake", "Reuptake", [],
      "The nerve ending pulling released chemical messenger back in to end the signal.",
      "Transport of neurotransmitter from the synaptic cleft back into the presynaptic terminal or surrounding glia, terminating its action. Reuptake inhibitors prolong transmitter action.",
      undefined,
      "Many antidepressants work by blocking serotonin reuptake.",
      M, ["synapse", "neurotransmitter"]),
    term("acetylcholinesterase", "Acetylcholinesterase", ["AChE", "cholinesterase"],
      "The enzyme that breaks down acetylcholine to end its signal.",
      "The enzyme in the synaptic cleft that hydrolyzes acetylcholine. Inhibitors such as pyridostigmine prolong acetylcholine action and improve strength in myasthenia gravis; excess inhibition causes cholinergic side effects.",
      "uh-SEE-til-KOH-lin-ESS-ter-ase",
      "Pyridostigmine, an acetylcholinesterase inhibitor, improves fatigable ptosis.",
      M, ["acetylcholine-receptor", "nmj", "myasthenia-gravis"]),
    term("glutamate", "Glutamate", [],
      "The brain's main 'go' chemical messenger.",
      "The principal excitatory neurotransmitter of the central nervous system, acting on ionotropic (including NMDA) and metabotropic receptors. Excess release or failed clearance causes excitotoxicity.",
      "GLOO-tuh-mate",
      "Glutamate accumulation in ischemic brain contributes to neuronal death.",
      M, ["excitotoxicity", "neurotransmitter", "astrocyte"]),
    term("gaba-a-receptor", "GABA-A receptor", ["GABA", "GABA receptor", "gamma-aminobutyric acid"],
      "The main 'brake' receptor in the brain, which calms nerve cell firing.",
      "A ligand-gated chloride channel activated by GABA, the main inhibitory neurotransmitter in the brain. Benzodiazepines bind it and enhance GABA's effect; during prolonged seizures synaptic GABA-A receptors are internalized.",
      "GAB-uh",
      "Midazolam enhances GABA-A receptor inhibition to stop a seizure.",
      M, ["status-epilepticus", "neurotransmitter"]),
    term("dopamine", "Dopamine", [],
      "A chemical messenger that helps the brain start and smooth out movement.",
      "A monoamine neurotransmitter. Nigrostriatal dopamine neurons project from the substantia nigra to the striatum; their degeneration causes Parkinson disease, and dopamine receptor blockade causes drug-induced parkinsonism.",
      "DOH-puh-meen",
      "Levodopa is converted to dopamine in the brain.",
      M, ["substantia-nigra", "parkinsonism"]),
    term("substantia-nigra", "Substantia nigra", [],
      "A dark-colored cluster of nerve cells in the midbrain that makes dopamine for movement.",
      "A midbrain nucleus whose pars compacta contains pigmented dopaminergic neurons projecting to the striatum. Loss of these neurons underlies the motor features of Parkinson disease.",
      "sub-STAN-shee-uh NY-gruh",
      "Pathology in Parkinson disease shows loss of pigmented neurons in the substantia nigra.",
      M, ["dopamine", "parkinsonism"]),
    term("parkinsonism", "Parkinsonism", [],
      "A pattern of slow, stiff movement, often with tremor, like that seen in Parkinson disease.",
      "A syndrome of bradykinesia with rigidity and/or rest tremor. Causes include Parkinson disease, other neurodegenerative disorders, and dopamine receptor blocking drugs.",
      "PAR-kin-sun-izm",
      "Symmetric parkinsonism weeks after starting metoclopramide suggests a drug cause.",
      M, ["dopamine", "substantia-nigra"]),
    term("astrocyte", "Astrocyte", [],
      "A star-shaped support cell in the brain and spinal cord that looks after nerve cells.",
      "A central nervous system glial cell that clears glutamate and potassium, supports neuronal metabolism, and contacts blood vessels with end-feet that contribute to the blood-brain barrier. Target of aquaporin-4 antibodies in NMOSD; forms the glial scar after injury.",
      "AS-tro-site",
      "Aquaporin-4 antibodies injure astrocytes in neuromyelitis optica spectrum disorder.",
      M, ["aquaporin-4", "gliosis", "microglia"]),
    term("aquaporin-4", "Aquaporin-4", ["AQP4"],
      "A water channel on brain support cells; antibodies against it cause neuromyelitis optica.",
      "A water channel concentrated on astrocyte end-feet. AQP4-IgG is the diagnostic antibody of neuromyelitis optica spectrum disorder, an astrocytopathy with secondary demyelination.",
      "ak-wuh-POR-in",
      "Positive serum aquaporin-4 antibodies with a long cord lesion support NMOSD.",
      M, ["astrocyte"]),
    term("microglia", "Microglia", ["microglial cells"],
      "The resident immune and clean-up cells of the brain and spinal cord.",
      "Central nervous system glial cells of myeloid lineage that survey tissue, clear debris, and mediate innate immune responses; their activation contributes to inflammation in many neurological diseases.",
      "my-KROG-lee-uh",
      "Activated microglia gather around areas of brain injury.",
      M, ["astrocyte"]),
    term("gliosis", "Gliosis", ["glial scar"],
      "Scarring in the brain or spinal cord made by support cells after injury.",
      "Reactive proliferation and hypertrophy of astrocytes (with microglia) after central nervous system injury, forming a scar that seals damage but limits axon regrowth. Seen on imaging and pathology as a marker of old injury.",
      "gly-OH-sis",
      "The old infarct is surrounded by gliosis.",
      M, ["astrocyte", "microglia"]),
  ],

  sources: [
    {
      id: "bloem2021-pd",
      kind: "review",
      citation: "Bloem BR, Okun MS, Klein C. Parkinson's disease. Lancet. 2021;397(10291):2284-2303. doi:10.1016/S0140-6736(21)00218-X",
      title: "Parkinson's disease",
      authors: "Bloem BR, Okun MS, Klein C",
      journal: "Lancet",
      year: 2021,
      doi: "10.1016/S0140-6736(21)00218-X",
      url: "https://doi.org/10.1016/S0140-6736(21)00218-X",
      lastVerified: "2026-11-06",
      verificationNote:
        "Title, authors, journal, year, volume, issue, pages, and DOI confirmed on 2026-11-06 from web search results indexing library catalogue and citation records (KB national library catalogue, Peeref, and a published reference list). PubMed cannot be opened from this environment and the PMID was not confirmed, so it is omitted. Cited for nigral dopamine neuron loss, levodopa replacement, and drug-induced parkinsonism as a differential; check that wording against the full text.",
      verified: true,
    },
  ],
};

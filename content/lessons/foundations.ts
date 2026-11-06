import type { ContentMeta, Lesson } from "../../shared/types";

function meta(id: string, sources: string[]): ContentMeta {
  return { id, version: 1, provenance: "source-grounded", review: "pending", author: "ai-draft", sources, lastVerified: "2026-10-25" };
}

export const FOUNDATION_LESSONS: Lesson[] = [
  {
    id: "l-umn-lmn",
    moduleId: "f-localization",
    title: "Upper versus lower motor neuron weakness",
    concept: "Weakness looks different depending on which of the two motor neurons in series is damaged.",
    minutes: 6,
    meta: meta("l-umn-lmn", ["safdieh2019-curriculum"]),
    steps: [
      {
        kind: "hook",
        title: "Two weak hands",
        body: "Two patients cannot grip with the right hand. In one, the hand muscles are thin and twitching. In the other, the arm is stiff and the reflexes jump. Both are weak, but the lesions are in different places. What separates them?",
      },
      {
        kind: "explain",
        title: "Two neurons in series",
        body:
          "Movement uses two neurons. The [[umn|upper motor neuron]] runs from motor cortex down the [[corticospinal-tract|corticospinal tract]] to the brainstem or spinal cord. The [[lmn|lower motor neuron]] runs from the anterior horn cell through root, plexus, and nerve to the muscle.\n\nUpper motor neuron lesion: [[pyramidal-weakness|pyramidal pattern]] weakness, [[spasticity|spasticity]], [[hyperreflexia|hyperreflexia]], an extensor plantar ([[babinski-sign|Babinski sign]]), and little wasting.\n\nLower motor neuron lesion: weakness in a root or nerve distribution, wasting, [[fasciculation|fasciculations]], [[hypotonia|hypotonia]], and reduced reflexes or [[areflexia|areflexia]].",
        layers: {
          simpler:
            "Think of the upper motor neuron as a supervisor and the lower motor neuron as the worker wired to the muscle. Lose the supervisor: the worker still acts, but without restraint, so the limb is stiff with jumpy reflexes. Lose the worker: the muscle loses its only connection, so it goes floppy, thin, and twitchy.",
          mechanism:
            "The stretch reflex is a lower motor neuron circuit within one spinal segment. Descending pathways normally damp it. Remove them and reflex gain rises: spasticity, hyperreflexia, and clonus. Muscle fibers also depend on their lower motor neuron for trophic support; denervated fibers waste and motor units fire spontaneously, seen as fasciculations.",
          compare:
            "Neuromuscular junction and muscle disorders also cause weakness without upper motor neuron signs, but sensation is normal and reflexes are preserved until weakness is severe. Junction disorders fluctuate and fatigue. Muscle disease is usually proximal and symmetric.",
          deeper:
            "An acute upper motor neuron lesion (stroke, cord injury) can be flaccid and areflexic for days (cerebral or spinal shock) before spasticity develops. Pyramidal weakness favors arm extensors and leg flexors. Amyotrophic lateral sclerosis combines upper and lower motor neuron signs in the same region.",
        },
      },
      {
        kind: "animation",
        title: "Move the lesion",
        animation: "motor-pathway",
        preset: "umn-vs-lmn",
        caption: "Schematic model. Toggle the lesion between the internal capsule and the anterior horn and watch tone, reflexes, and bulk change.",
        task: "Predict what happens to reflexes before you switch the lesion.",
      },
      { kind: "predict", title: "Predict the level", itemId: "li-umn-predict" },
      { kind: "apply", title: "Apply it", itemId: "li-umn-apply" },
      {
        kind: "summary",
        title: "Key points",
        points: [
          "Weakness alone does not localize; the accompanying signs do.",
          "Upper motor neuron: spasticity, hyperreflexia, clonus, extensor plantar.",
          "Lower motor neuron: wasting, fasciculations, low tone, reduced reflexes.",
          "Acute upper motor neuron lesions may be flaccid at first.",
        ],
        reviewItemIds: ["li-umn-predict", "li-umn-apply", "li-umn-recall"],
      },
    ],
  },
  {
    id: "l-lesion-level",
    moduleId: "f-localization",
    title: "Where is the lesion? Crossing pathways",
    concept: "Long tracts cross at different levels, so the side and pattern of deficits locate the lesion.",
    minutes: 7,
    meta: meta("l-lesion-level", ["safdieh2019-curriculum"]),
    steps: [
      {
        kind: "hook",
        title: "Right arm and leg are weak",
        body: "Is the lesion in the left hemisphere, the brainstem, or the cervical cord? The face, the sensory pattern, and any crossed findings decide.",
      },
      {
        kind: "explain",
        title: "Three tracts, three crossing points",
        body:
          "The [[corticospinal-tract|corticospinal tract]] crosses at the pyramidal [[decussation|decussation]] in the lower medulla. The [[dorsal-columns|dorsal columns]] (vibration and joint position) ascend on the same side and cross in the medulla. The [[spinothalamic-tract|spinothalamic tract]] (pain and temperature) crosses within one or two segments of entering the cord.\n\nSo a hemisphere lesion weakens the [[contralateral|contralateral]] face, arm, and leg. A brainstem lesion gives crossed signs: an [[ipsilateral|ipsilateral]] cranial nerve palsy with contralateral body weakness. A cord lesion spares the face and often produces a [[sensory-level|sensory level]]. A hemicord lesion splits sensation: the [[brown-sequard|Brown-Sequard]] pattern.",
        layers: {
          simpler: "Each tract is a wire that switches sides at a different point. Find where the findings stop fitting together on one side, and you have found the level.",
          mechanism:
            "In a right hemicord lesion, the corticospinal tract and dorsal columns are still uncrossed, so weakness and vibration loss are on the right. Spinothalamic fibers from the left body crossed below the lesion and travel on the right side, so pain and temperature are lost on the left, starting a segment or two below the lesion.",
          compare:
            "Cortical versus subcortical: a cortical MCA lesion weakens the face and arm more than the leg and brings cortical signs such as aphasia or neglect. In the [[internal-capsule|internal capsule]] the fibers are packed tightly, so face, arm, and leg weaken equally without cortical signs.",
          deeper:
            "Cranial nerve nuclei set the brainstem level: III and IV in the midbrain, V to VIII in the pons, IX to XII in the medulla. A left pontine lesion can produce a left lower motor neuron facial palsy or abducens palsy with right hemiparesis.",
        },
      },
      {
        kind: "animation",
        title: "Lesion explorer",
        animation: "motor-pathway",
        preset: "level",
        caption: "Schematic model of the corticospinal, dorsal column, and spinothalamic pathways. Choose a lesion site and compare the resulting findings.",
        task: "Select the right cervical hemicord. Before revealing, predict which side loses pain and which loses vibration.",
      },
      { kind: "predict", title: "Localize it", itemId: "li-level-predict" },
      { kind: "apply", title: "Crossed signs", itemId: "li-level-apply" },
      {
        kind: "summary",
        title: "Key points",
        points: [
          "Corticospinal and dorsal columns cross in the medulla; spinothalamic crosses in the cord.",
          "Crossed cranial nerve and body signs localize to the brainstem.",
          "A sensory level and a spared face point to the cord.",
          "Equal face, arm, and leg weakness without cortical signs suggests the internal capsule.",
        ],
        reviewItemIds: ["li-level-predict", "li-level-apply", "li-level-recall"],
      },
    ],
  },
  {
    id: "l-time-course",
    moduleId: "f-localization",
    title: "Time course: what kind of process?",
    concept: "The onset and tempo of symptoms narrow the category of disease once you know where the lesion is.",
    minutes: 5,
    meta: meta("l-time-course", ["safdieh2019-curriculum"]),
    steps: [
      {
        kind: "hook",
        title: "Where, then what",
        body: "Localization tells you where. The [[time-course|time course]] tells you what. A deficit that is maximal within seconds is a different disease from one that builds over weeks, even in the same place.",
      },
      {
        kind: "explain",
        title: "Reading the tempo",
        body:
          "Seconds to minutes, maximal at onset: vascular (ischemia, hemorrhage). Seconds to minutes with spreading positive symptoms: seizure (a march over seconds) or migraine aura (spreading over 5 to 60 minutes).\n\nHours to days: infection, inflammation, demyelination, toxic or metabolic causes. Guillain-Barre syndrome progresses over days to 4 weeks.\n\nWeeks to months: tumor, compression, some nutritional causes. Months to years: degeneration and genetic disease.\n\nEpisodic or relapsing: TIA, seizures, migraine, multiple sclerosis. Fluctuating within a day: neuromuscular junction disorders and delirium.",
        layers: {
          simpler: "Fast like a light switch: a blood vessel or an electrical storm. Over days: inflammation or infection. Over months: something growing or wearing out.",
          mechanism:
            "Arterial occlusion stops energy supply instantly, so deficits appear at once. Seizures spread electrically across cortex in seconds. Inflammation needs immune cells to be recruited and activated, which takes days. Tumors grow; degeneration accumulates.",
          compare:
            "Positive symptoms (tingling, jerking, flashing lights) suggest an active process such as seizure or aura. Negative symptoms (numbness, weakness, visual loss) beginning abruptly suggest loss of function, such as ischemia.",
          deeper:
            "Tempo narrows; it does not decide. Tumors can present suddenly through hemorrhage or seizure. Lacunar ischemia can stutter over hours. Prion disease progresses over weeks to months despite being degenerative. Always pair tempo with localization and context.",
        },
      },
      { kind: "predict", title: "Name the tempo", itemId: "li-time-predict" },
      { kind: "apply", title: "Apply it", itemId: "li-time-apply" },
      {
        kind: "summary",
        title: "Key points",
        points: [
          "Abrupt and negative: think vascular.",
          "Spreading and positive: think seizure (seconds) or aura (minutes).",
          "Days: inflammatory, infectious, demyelinating, toxic or metabolic.",
          "Months to years: degenerative or neoplastic, with important exceptions.",
        ],
        reviewItemIds: ["li-time-predict", "li-time-apply", "li-time-recall"],
      },
    ],
  },
  {
    id: "l-diplopia",
    moduleId: "f-ocular-motor",
    title: "Diplopia: which nerve, and is it an emergency?",
    concept: "The direction in which double vision is worst identifies the weak muscle; the pupil helps identify a compressive cause.",
    minutes: 7,
    meta: meta("l-diplopia", ["safdieh2019-curriculum"]),
    steps: [
      {
        kind: "hook",
        title: "Seeing double",
        body: "Double vision that disappears when either eye is covered comes from misaligned eyes. The images separate most when looking in the direction of the weak muscle. Some causes are benign; one pattern can signal a bleeding risk within hours.",
      },
      {
        kind: "explain",
        title: "Six muscles, three nerves",
        body:
          "[[abducens-nerve|CN VI]] supplies the lateral rectus: horizontal [[diplopia|diplopia]], worst looking toward the weak side.\n\n[[trochlear-nerve|CN IV]] supplies the superior oblique: vertical or tilted diplopia, worst looking down and in (reading, stairs). Patients tilt the head away from the weak side.\n\n[[oculomotor-nerve|CN III]] supplies the remaining muscles, the eyelid elevator, and the pupil constrictor: the eye rests down and out, with [[ptosis|ptosis]] and sometimes [[mydriasis|mydriasis]].\n\nAn [[ino|internuclear ophthalmoplegia]] from a lesion of the [[mlf|MLF]] causes failure of adduction on lateral gaze with [[nystagmus|nystagmus]] of the abducting eye. Convergence is often preserved.",
        layers: {
          simpler: "Each eye muscle pulls in one main direction. If one is weak, the eyes split apart most when you look the way that muscle should pull.",
          mechanism:
            "Pupillomotor fibers run on the outer surface of CN III. An expanding aneurysm compresses the outside first, so the pupil dilates early. Diabetic and hypertensive microvascular palsies damage the core of the nerve and usually spare the pupil.",
          compare:
            "Monocular diplopia (persists when the other eye is covered) is usually an eye problem, not a nerve problem. Myasthenia gravis can mimic any nerve palsy, fluctuates, fatigues, and never involves the pupil.",
          deeper:
            "The pupil rule has exceptions: partial or evolving CN III palsies may spare the pupil early, so many clinicians image any new third nerve palsy. Bilateral INO in a young adult suggests demyelination; in an older adult, brainstem ischemia.",
        },
      },
      {
        kind: "animation",
        title: "Eye movement simulator",
        animation: "eye-movements",
        preset: "diplopia",
        caption: "Schematic eyes. Choose a lesion, then move the gaze target to see which movements fail.",
        task: "Select left INO and look right. Then select right CN VI and look right. Compare which eye fails.",
      },
      { kind: "predict", title: "Which nerve?", itemId: "li-diplopia-predict" },
      { kind: "apply", title: "Is it urgent?", itemId: "li-diplopia-apply" },
      {
        kind: "summary",
        title: "Key points",
        points: [
          "Diplopia is worst in the direction of the weak muscle.",
          "CN III: down and out, ptosis, possibly a dilated pupil.",
          "Painful pupil-involving CN III palsy needs urgent vascular imaging.",
          "INO: adduction failure on the side of the MLF lesion.",
        ],
        reviewItemIds: ["li-diplopia-predict", "li-diplopia-apply", "li-diplopia-recall"],
      },
    ],
  },
  {
    id: "l-vascular-territories",
    moduleId: "f-vascular-territories",
    title: "Vascular territories and stroke syndromes",
    concept: "Each cerebral artery supplies a predictable part of the brain, so the examination predicts which vessel is blocked.",
    minutes: 7,
    meta: meta("l-vascular-territories", ["prabhakaran2026-ais"]),
    steps: [
      {
        kind: "hook",
        title: "Stroke syndromes are maps",
        body: "If you know which artery feeds which part of the motor and sensory map, the examination tells you which vessel is blocked, and whether a large vessel might be treatable by [[thrombectomy|thrombectomy]].",
      },
      {
        kind: "explain",
        title: "Who supplies what",
        body:
          "MCA: the lateral hemisphere. Contralateral face and arm more than leg weakness and sensory loss, [[aphasia|aphasia]] (dominant hemisphere) or [[neglect|neglect]] (nondominant), [[gaze-deviation|gaze deviation]] toward the lesion, and a [[homonymous|homonymous]] [[hemianopia|hemianopia]].\n\nACA: the medial frontal and parietal lobes. Contralateral leg more than arm weakness, apathy, and urinary incontinence.\n\nPCA: occipital lobe, medial temporal lobe, thalamus. Contralateral homonymous hemianopia, sometimes memory or sensory loss.\n\n[[lacunar-stroke|Lacunar]]: small penetrating arteries to the internal capsule, thalamus, or pons. Pure motor, pure sensory, ataxic hemiparesis, or dysarthria with a clumsy hand. No cortical signs.",
        layers: {
          simpler: "The leg area of the brain sits along the midline, fed by the ACA. The face and hand areas sit on the side, fed by the MCA. So the body part that is weakest points to the artery.",
          mechanism:
            "The motor homunculus drapes the leg over the medial surface and places the face and hand laterally. The MCA supplies the lateral convexity, so face and arm suffer most; the ACA supplies the medial strip, so the leg suffers most.",
          compare:
            "Posterior circulation strokes (vertebral and basilar) cause crossed signs, vertigo with central features, ataxia, diplopia, dysarthria, bilateral signs, or reduced consciousness. Basilar occlusion can be catastrophic and is easy to miss.",
          deeper:
            "Watershed infarcts lie between territories after hypoperfusion. Variant anatomy (for example a fetal origin of the PCA from the internal carotid) can make a carotid embolus cause occipital infarction.",
        },
      },
      {
        kind: "animation",
        title: "Territory map",
        animation: "vascular-territories",
        preset: "mca",
        caption: "Schematic axial map of arterial territories. Select a territory to see the syndrome; toggle hemisphere dominance.",
        task: "Select the left MCA, then switch dominance and see how aphasia becomes neglect.",
      },
      { kind: "predict", title: "Which territory?", itemId: "li-vasc-predict" },
      { kind: "apply", title: "Apply it", itemId: "li-vasc-apply" },
      {
        kind: "summary",
        title: "Key points",
        points: [
          "MCA: face and arm more than leg, plus aphasia or neglect, gaze deviation, field cut.",
          "ACA: leg more than arm, apathy, incontinence.",
          "PCA: homonymous hemianopia.",
          "Lacunar: no cortical signs.",
        ],
        reviewItemIds: ["li-vasc-predict", "li-vasc-apply", "li-vasc-recall"],
      },
    ],
  },
];

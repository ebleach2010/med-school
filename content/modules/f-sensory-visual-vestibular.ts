// Module f-sensory-visual-vestibular: sensory patterns, the visual pathway and field defects,
// peripheral versus central vertigo, and cerebellar signs. Builds on f-localization, which
// already teaches the crossing points of the long tracts and the Brown-Sequard pattern.

import type { ModuleContent } from "./types";
import { meta, term } from "./types";

const M = "f-sensory-visual-vestibular";
const CUR = "safdieh2019-curriculum";
const HINTS = "kattah2009-hints";
const VF = "kedar2011-visual-fields";

export const CONTENT: ModuleContent | null = {
  moduleId: M,
  module: {
    summary: "Sensory loss patterns, visual field defects and the afferent pupil, peripheral versus central vertigo, and midline versus hemispheric cerebellar signs.",
    objectives: [
      ["localization", "Localize sensory loss from its shape: root, single nerve, length-dependent neuropathy, cord, lateral medulla, thalamus, or cortex."],
      ["localization", "Localize visual field defects along the visual pathway and interpret a relative afferent pupillary defect."],
      ["history-exam", "Use HINTS and other bedside features to separate peripheral from central acute vertigo."],
      ["localization", "Distinguish midline (truncal and gait) from hemispheric (ipsilateral limb) cerebellar signs."],
      ["mechanism", "Explain why lateral medullary sensory loss is crossed and why cerebellar signs are ipsilateral."],
    ],
    prerequisites: ["f-localization"],
    lessons: ["l-sensory-patterns", "l-visual-fields", "l-vertigo-cerebellum"],
    challengeItems: ["m-svv-wallenberg", "m-svv-ring", "m-svv-occipital", "m-svv-hints", "m-svv-midline"],
    skills: ["localization", "history-exam", "mechanism"],
    minutes: 25,
    sources: [CUR, HINTS, VF],
  },

  // ---------------------------------------------------------------- Lessons
  lessons: [
    {
      id: "l-sensory-patterns",
      moduleId: M,
      title: "Sensory patterns: the shape of the numb area",
      concept: "The map of sensory loss on the body (band, patch, stocking, level, cape, crossed, or half-body) points to a specific level of the nervous system.",
      minutes: 9,
      meta: meta("l-sensory-patterns", [CUR]),
      steps: [
        {
          kind: "hook",
          title: "Numb, but where?",
          body: "Five patients each say \"I am numb.\" One has a band of numbness wrapping around the chest. One has numb feet and fingertips. One cannot feel hot water on the shoulders but feels a tuning fork normally. One has a numb left face and a numb right leg. One has lost feeling over the whole left side. Same word, five different places. The shape of the numb area is the localizing clue.",
        },
        {
          kind: "explain",
          title: "Peripheral patterns: root, nerve, length",
          body:
            "A [[radiculopathy|root lesion]] follows a [[dermatome|dermatome]]: a strip of skin, often with pain shooting along it and loss of the reflex that root serves. Neighboring dermatomes overlap, so one root lesion often causes more pain than measurable numbness.\n\nA [[mononeuropathy|single nerve lesion]] follows that nerve's territory, which has its own borders. The ulnar nerve supplies the little finger and the adjacent half of the ring finger and stops at the wrist. A C8 root lesion does not split the ring finger and extends up the inner forearm.\n\nA [[stocking-glove|stocking-glove]] pattern means a length-dependent polyneuropathy. The longest axons fail first, so numbness starts in the toes and climbs the legs; the fingertips become involved later, roughly when leg symptoms reach the knees. Ankle reflexes are lost early.",
          layers: {
            simpler:
              "A root is a cable feeding one strip of skin. A nerve is a cable feeding one patch. In a length-dependent neuropathy every cable is a little damaged, and the longest cables, the ones to the feet, show it first.",
            mechanism:
              "The nerve cell body must supply its whole axon with proteins and energy. Longer axons have more length to injure and are the hardest to maintain, so a diffuse insult to peripheral nerves shows up first at the ends of the longest fibers: the toes. Arm axons are shorter, so the hands follow only once the process has advanced up the legs.",
            compare:
              "Root versus nerve: test muscles that share a root but not a nerve. Finger spreading (ulnar nerve) and thumb abduction (median nerve) both depend on C8 and T1. Weakness of both points to the root or lower plexus; weak finger spreading with strong thumb abduction points to the ulnar nerve. Neck or back pain radiating into the limb with movement favors a root.",
            deeper:
              "Not every neuropathy is length dependent. Numbness that starts in the hands, or is patchy and asymmetric, suggests a different process, such as damage to the dorsal root ganglia (sensory neuronopathy) or several separate nerve lesions (multiple mononeuropathies). These carry a different list of causes, so the pattern changes the workup.",
          },
        },
        {
          kind: "explain",
          title: "Central patterns: cord, medulla, thalamus, cortex",
          body:
            "A [[sensory-level|sensory level]] (from the localization module) means the cord: loss below a horizontal line on the trunk, usually with upper motor neuron signs and bladder changes below it.\n\n[[dissociated-sensory-loss|Dissociated loss]] in a cape points to the center of the cervical cord. Pain and temperature fibers cross in front of the central canal, so a central lesion such as [[syringomyelia|syringomyelia]] or [[central-cord-syndrome|central cord syndrome]] cuts the crossing fibers from both sides at those segments. Pain and temperature are lost over the shoulders and arms, while the [[dorsal-columns|dorsal columns]] (vibration and position) are spared. Sensation below can be normal: a suspended loss.\n\nCrossed loss (face on one side, body on the other) points to the lateral medulla: the [[lateral-medullary-syndrome|lateral medullary syndrome]]. There the uncrossed pain fibers for the face run beside the [[spinothalamic-tract|spinothalamic tract]], whose body fibers crossed in the cord.\n\nHemisensory loss of the face, arm, and leg on one side points above the brainstem, where face and body pathways have joined: the thalamus or the cortex. A thalamic lesion tends to affect all modalities and splits at the midline. A parietal lesion causes [[cortical-sensory-loss|cortical sensory loss]]: basic sensation may be present, but discrimination fails.",
          layers: {
            simpler:
              "Below the upper brainstem, face and body sensation travel in separate lanes, so one lesion can hit them on opposite sides. Higher up they travel together, so a lesion takes out one whole side.",
            mechanism:
              "Face pain and temperature fibers enter with the trigeminal nerve and descend on the same side as the spinal trigeminal tract into the upper cervical cord before crossing. In the lateral medulla they are still uncrossed, right beside the already crossed spinothalamic fibers for the body. Neighbors explain the rest of the syndrome: vestibular nuclei ([[vertigo|vertigo]], [[nystagmus|nystagmus]]), nucleus ambiguus (hoarseness, [[dysphagia|dysphagia]]), descending sympathetic fibers ([[horner-syndrome|Horner syndrome]]), and the inferior cerebellar peduncle (ipsilateral [[ataxia|ataxia]]).",
            compare:
              "Dissociation runs in two directions. Pain and temperature lost with vibration preserved: a central cord lesion (cape-shaped) or a small-fiber neuropathy (distal, in the feet). Vibration and position lost with pain and temperature preserved: the dorsal columns (for example B12 deficiency) or a large-fiber neuropathy.",
            deeper:
              "As a syrinx expands, it damages the anterior horn cells (wasting and reduced reflexes in the arms) and then the corticospinal tracts (upper motor neuron signs in the legs). In the spinothalamic tract, sacral fibers lie outermost, so a lesion growing from the center of the cord can spare sacral sensation (sacral sparing), a clue that the lesion is inside the cord rather than compressing it from outside.",
          },
        },
        {
          kind: "animation",
          title: "Level versus half-body",
          animation: "motor-pathway",
          preset: "level",
          caption: "Schematic model of the corticospinal, dorsal column, and spinothalamic pathways. Compare a complete thoracic cord lesion (all modalities lost below a truncal level) with a cortical lesion (one side of the body, face included) and a hemicord (modalities split between sides).",
          task: "Select the complete thoracic cord, then the left motor cortex. Before revealing each, predict whether the face is involved and whether the loss is on one side or both.",
        },
        { kind: "predict", title: "Read the map", itemId: "m-svv-cape" },
        { kind: "apply", title: "Crossed sensory loss", itemId: "m-svv-wallenberg" },
        {
          kind: "summary",
          title: "Key points",
          points: [
            "Root: a dermatome band, often with radiating pain and a lost reflex.",
            "Single nerve: that nerve's territory. The ulnar nerve splits the ring finger; a C8 root does not.",
            "Stocking-glove: length-dependent polyneuropathy, feet before hands.",
            "Cape-shaped pain and temperature loss with vibration preserved: center of the cervical cord.",
            "Face on one side, body on the other: lateral medulla.",
            "One whole side including the face: thalamus or cortex.",
          ],
          reviewItemIds: ["m-svv-cape", "m-svv-wallenberg", "m-svv-patterns", "m-svv-ring"],
        },
      ],
    },
    {
      id: "l-visual-fields",
      moduleId: M,
      title: "The visual pathway and field defects",
      concept: "Because only nasal retinal fibers cross at the chiasm, a field defect's shape (one eye, both temporal halves, or the same half in both eyes) places the lesion in front of, at, or behind the chiasm.",
      minutes: 8,
      meta: meta("l-visual-fields", [CUR, VF]),
      steps: [
        {
          kind: "hook",
          title: "Bumping into door frames",
          body: "A patient keeps clipping door frames, but reads the eye chart perfectly with each eye. Acuity tests the center of vision; the visual fields test the edges. The shape of a field defect tells you where along the visual pathway the lesion sits, and the pupils can tell you whether an optic nerve is involved.",
        },
        {
          kind: "explain",
          title: "One pathway, three zones",
          body:
            "Light from the right half of the world lands on the left half of each retina. Fibers leave each eye in the optic nerve. At the [[optic-chiasm|optic chiasm]], fibers from the nasal half of each retina (which see the temporal fields) cross; temporal retinal fibers stay on the same side. Behind the chiasm, each optic tract therefore carries the opposite half of the world from both eyes, relayed through the lateral geniculate nucleus and the optic radiations to the occipital cortex.\n\nIn front of the chiasm (eye or optic nerve): loss in one eye only.\n\nAt the chiasm: [[bitemporal-hemianopia|bitemporal hemianopia]], loss of both outer halves, classically from a pituitary tumor pressing up from below.\n\nBehind the chiasm (tract, radiations, cortex): a [[homonymous|homonymous]] [[hemianopia|hemianopia]] on the side opposite the lesion. Within the radiations, the lower fibers loop forward through the temporal lobe ([[meyer-loop|Meyer loop]]) and carry the upper field, so a temporal lobe lesion causes a contralateral superior [[quadrantanopia|quadrantanopia]]. The parietal radiations carry the lower field.",
          layers: {
            simpler:
              "Before the crossing point, damage affects one eye. At the crossing point, it cuts the fibers that see out to the sides. After the crossing point, it cuts the same half of the world from both eyes.",
            mechanism:
              "Only the nasal fibers cross, and they run through the middle of the chiasm, so pressure on the middle takes out the temporal field of each eye. A pituitary adenoma presses from below, where fibers from the lower nasal retina cross. The lower retina sees the upper field, so the upper temporal fields are often lost first.",
            compare:
              "Test each eye separately. Many patients with a homonymous hemianopia report it as loss in one eye (the eye on the side of the missing field, because its temporal field is larger). Covering one eye at a time shows the defect is present in both.",
            deeper:
              "The further back a homonymous defect arises, the more alike (congruous) the two eyes' defects tend to be, because fibers from matching points of the two retinas lie closer together. An occipital lesion often spares central vision ([[macular-sparing|macular sparing]]), commonly explained by the large cortical area devoted to the macula at the occipital pole and that pole's extra blood supply from the middle cerebral artery.",
          },
        },
        {
          kind: "explain",
          title: "The swinging flashlight test",
          body:
            "Light in either eye normally makes both pupils constrict equally, because each optic nerve feeds both sides of the pupil reflex. In a [[rapd|relative afferent pupillary defect]], one optic nerve carries a weaker signal. Swing a light back and forth between the eyes: when it moves onto the affected eye, both pupils dilate, because the brainstem now receives less light signal than it did from the healthy eye.\n\nThe pupils are equal in size at rest, because the outflow to both pupils is intact. An RAPD means asymmetric optic nerve disease (or extensive retinal disease) on that side. Cataract and refractive error do not cause it.",
          layers: {
            simpler:
              "Think of each eye as a cable feeding one light meter in the brainstem. If one cable is damaged, the meter reads the room as darker whenever it listens to that eye, and it opens both pupils.",
            mechanism:
              "Each optic nerve sends pupil fibers to both sides of the midbrain, which drive both Edinger-Westphal nuclei. The output is shared: light in one eye constricts both pupils (direct and consensual responses). An afferent defect lowers input but leaves output intact, so the pupils stay equal and move together.",
            compare:
              "Afferent versus efferent: a third nerve palsy or [[horner-syndrome|Horner syndrome]] damages the outflow to one pupil and causes [[anisocoria|anisocoria]]. An RAPD causes no anisocoria; both pupils behave as a pair.",
            deeper:
              "Chiasmal and retrochiasmal lesions affect fibers from both eyes and usually cause no RAPD. The exception is an optic tract lesion, which can produce a mild RAPD in the eye opposite the lesion, because that eye contributes the larger share of fibers to the tract.",
          },
        },
        { kind: "predict", title: "Locate the field cut", itemId: "m-svv-bitemporal" },
        { kind: "apply", title: "Read the pupils", itemId: "m-svv-rapd" },
        {
          kind: "summary",
          title: "Key points",
          points: [
            "One eye only: the eye or optic nerve.",
            "Both temporal halves: the chiasm, classically a pituitary mass.",
            "Same half in both eyes: tract, radiations, or occipital cortex on the opposite side.",
            "Superior quadrantanopia: opposite temporal lobe (Meyer loop). Inferior: parietal.",
            "Macular sparing favors the occipital cortex.",
            "RAPD: optic nerve disease on that side, with equal pupils at rest.",
          ],
          reviewItemIds: ["m-svv-bitemporal", "m-svv-rapd", "m-svv-meyer", "m-svv-occipital", "m-svv-prechiasmal"],
        },
      ],
    },
    {
      id: "l-vertigo-cerebellum",
      moduleId: M,
      title: "Vertigo and the cerebellum",
      concept: "In acute continuous vertigo, a few bedside eye signs separate inner ear from brain causes, and cerebellar signs are midline or limb-based and fall on the side of the lesion.",
      minutes: 8,
      meta: meta("l-vertigo-cerebellum", [CUR, HINTS]),
      steps: [
        {
          kind: "hook",
          title: "The room is spinning",
          body: "Two adults have had constant spinning, vomiting, and unsteadiness since this morning. One has inflammation of a vestibular nerve and will recover at home. The other has a cerebellar stroke that early brain MRI can miss. A three-part bedside eye examination is one of the best early separators, if it is used in the right patient by a practiced examiner.",
        },
        {
          kind: "explain",
          title: "Peripheral versus central vertigo",
          body:
            "[[vertigo|Vertigo]] is an illusion of movement. Peripheral causes involve the inner ear or vestibular nerve; central causes involve the brainstem or cerebellum.\n\n[[hints-exam|HINTS]] applies to the [[acute-vestibular-syndrome|acute vestibular syndrome]]: continuous vertigo for hours to days, with nausea, [[nystagmus|nystagmus]], and unsteady gait. It is not for brief positional spells. Its three parts:\n\nHead impulse: a quick head turn while the patient fixes on the examiner's nose. In vestibular neuritis the eyes are dragged off target, and a catch-up saccade follows, when the head turns toward the affected ear. A normal [[head-impulse-test|head impulse test]] in this setting is worrying, because a stroke usually spares the reflex.\n\nNystagmus: peripheral nystagmus beats in one direction, away from the affected ear, whichever way the patient looks. Nystagmus that changes direction with gaze is central.\n\nTest of skew: vertical misalignment on alternate cover testing ([[skew-deviation|skew deviation]]) is central.\n\nAny one central feature argues against a peripheral cause. In the original study, this examination was more sensitive for stroke than early MRI diffusion imaging. Other warnings: inability to sit or stand without support, purely vertical or torsional nystagmus, and new brainstem signs such as diplopia, dysarthria, or crossed sensory loss.",
          layers: {
            simpler:
              "The head impulse test checks the inner ear reflex directly. If the reflex is broken, the inner ear is the likely problem. If the reflex works in someone with severe ongoing vertigo, the problem may be in the brain.",
            mechanism:
              "The vestibulo-ocular reflex keeps the eyes on target during head movement by driving them opposite to the head. It runs from the semicircular canals through the vestibular nerve to the brainstem. Vestibular neuritis removes input from one side, so a fast turn toward that side outruns the eyes. A small cerebellar or brainstem stroke usually leaves this reflex arc intact while still causing vertigo.",
            compare:
              "Peripheral nystagmus is damped by visual fixation, is strongest when looking in the direction of the fast phase, and keeps its direction in all gaze positions. Central nystagmus may not be damped by fixation, may change direction with gaze, or may be purely vertical or torsional.",
            deeper:
              "The original HINTS results came from experienced examiners in patients with a defined acute vestibular syndrome. In patients without continuous vertigo and nystagmus, or in less practiced hands, the examination is less reliable. A normal early MRI does not exclude a small posterior fossa stroke.",
          },
        },
        { kind: "predict", title: "Inner ear or brain?", itemId: "m-svv-hints" },
        {
          kind: "explain",
          title: "Cerebellar signs, and why they are on the same side",
          body:
            "The midline cerebellum (vermis) controls the trunk and gait. A midline lesion causes [[truncal-ataxia|truncal ataxia]] and a wide-based, unsteady gait, sometimes with near-normal coordination of the arms.\n\nEach cerebellar hemisphere coordinates the limbs on its own side. A hemisphere lesion causes [[ipsilateral|ipsilateral]] limb [[ataxia|ataxia]]: [[dysmetria|dysmetria]] on finger-nose and heel-shin testing, [[intention-tremor|intention tremor]], and [[dysdiadochokinesia|dysdiadochokinesia]]. Strength is normal.\n\nWhy the same side? Cerebellar output crosses twice. The right hemisphere projects through the superior cerebellar peduncle, which crosses in the midbrain, to the left thalamus and left motor cortex. The left motor cortex controls the right limbs through the [[corticospinal-tract|corticospinal tract]], which crosses back at the pyramidal [[decussation|decussation]]. Two crossings put the effect on the side of the lesion.",
          layers: {
            simpler: "The middle of the cerebellum steadies the body; each side steadies the arm and leg on its own side.",
            mechanism:
              "Input also stays largely on one side: spinocerebellar fibers carrying limb position information reach the cerebellum on the same side as the limb. Same-side input and doubly crossed output together make the cerebellum the main exception to the rule that a brain lesion affects the opposite side of the body.",
            compare:
              "Cerebellar versus sensory ataxia: in sensory ataxia (dorsal columns or large-fiber neuropathy) the patient relies on vision, so balance worsens markedly with eyes closed (a positive [[romberg-test|Romberg test]]) and vibration and position sense are reduced. In cerebellar ataxia the patient is unsteady with eyes open too, and position sense is normal.",
            deeper:
              "A large cerebellar infarct or hemorrhage can swell over the following days and compress the brainstem and fourth ventricle, causing hydrocephalus and falling consciousness. A patient with acute vertigo who cannot walk deserves the same urgency as any other suspected stroke.",
          },
        },
        { kind: "apply", title: "Name the site", itemId: "m-svv-cerebellar-side" },
        {
          kind: "summary",
          title: "Key points",
          points: [
            "HINTS is for continuous acute vertigo with nystagmus, not brief positional spells.",
            "Central features: normal head impulse, direction-changing nystagmus, skew deviation.",
            "Also central: cannot stand unaided, vertical or torsional nystagmus, other brainstem signs.",
            "Midline cerebellum: truncal and gait ataxia. Hemisphere: ipsilateral limb ataxia.",
            "Cerebellar output crosses twice, so signs are on the side of the lesion.",
          ],
          reviewItemIds: ["m-svv-hints", "m-svv-redflags", "m-svv-cerebellar-side", "m-svv-midline", "m-svv-ipsi-why"],
        },
      ],
    },
  ],

  // ---------------------------------------------------------------- Items
  items: [
    // ---------------- l-sensory-patterns ----------------
    {
      id: "m-svv-cape",
      version: 1,
      format: "localization",
      skill: "localization",
      modules: [M],
      difficulty: 2,
      presentation: "cape-sensory-loss",
      usage: ["lesson", "review"],
      vignette:
        "A 34-year-old has burned both forearms on a stove without noticing. Pinprick and temperature sensation are lost over both shoulders, both arms, and the upper chest; below the nipples sensation is normal. Vibration and joint position sense are normal everywhere. The small hand muscles are wasted and the arm reflexes are absent.",
      stem: "Where is the lesion?",
      correct: ["cord-cervical"],
      partial: [
        { region: "cord-thoracic", credit: 0.5, feedback: "A cord lesion is right, but arm and hand involvement places its center in the cervical cord." },
        { region: "anterior-horn", credit: 0.3, feedback: "Anterior horn damage explains the wasted hands, but not the sensory loss. A lesion in the center of the cervical cord explains both." },
      ],
      rationale:
        "This is [[dissociated-sensory-loss|dissociated sensory loss]] in a cape. Pain and temperature fibers cross in front of the central canal, so a lesion in the center of the cord, such as [[syringomyelia|syringomyelia]], cuts the crossing fibers from both sides at the affected segments, while the [[dorsal-columns|dorsal columns]] at the back are spared. Spread into the anterior horns explains the wasted hands and absent arm reflexes. Sensation below the lesion is normal because the long tracts passing by are not yet involved.",
      meta: meta("m-svv-cape", [CUR]),
    },
    {
      id: "m-svv-wallenberg",
      version: 1,
      format: "mcq",
      skill: "localization",
      modules: [M],
      difficulty: 2,
      presentation: "crossed-face-body-sensory",
      usage: ["lesson", "review", "challenge"],
      vignette:
        "A 61-year-old has sudden vertigo, vomiting, hoarseness, and difficulty swallowing. Pinprick and temperature sensation are reduced on the left side of the face and on the right arm, trunk, and leg. The left pupil is small with a mild left ptosis, and the left arm is clumsy on finger-nose testing. Strength is normal.",
      stem: "Where is the lesion?",
      options: [
        { id: "a", text: "Left lateral medulla", correct: true, feedback: "Face loss on one side, body loss on the other, with same-side Horner syndrome, hoarseness, and limb ataxia, is the lateral medullary syndrome." },
        { id: "b", text: "Right lateral medulla", tag: "slip", feedback: "The face loss, Horner syndrome, and ataxia are all on the left, the side of the lesion; only the body sensory loss is on the opposite side." },
        { id: "c", text: "Right thalamus", tag: "misconception", feedback: "A thalamic lesion causes loss of the opposite face and body together, on one side, and does not cause hoarseness or Horner syndrome." },
        { id: "d", text: "Left cervical hemicord", tag: "misconception", feedback: "A cord lesion spares the face and would cause weakness on the side of the lesion." },
      ],
      reasoning: {
        stem: "Which finding most specifically places the lesion in the medulla rather than the cord or the thalamus?",
        options: [
          { id: "r1", text: "Pain and temperature loss on the left face with loss on the right body", correct: true },
          { id: "r2", text: "Vertigo and vomiting", feedback: "Vertigo occurs with inner ear and many brain lesions, so it does not place the lesion on its own." },
          { id: "r3", text: "Clumsy left arm", feedback: "Limb ataxia can arise from the cerebellum or its connections at several levels." },
        ],
      },
      rationale:
        "In the lateral medulla the spinal trigeminal tract (uncrossed face pain fibers) lies beside the [[spinothalamic-tract|spinothalamic tract]] (body fibers that crossed in the cord). One lesion removes pain and temperature from the [[ipsilateral|ipsilateral]] face and the [[contralateral|contralateral]] body. Neighbors complete the [[lateral-medullary-syndrome|lateral medullary syndrome]]: nucleus ambiguus (hoarseness, [[dysphagia|dysphagia]]), descending sympathetic fibers ([[horner-syndrome|Horner syndrome]]), vestibular nuclei ([[vertigo|vertigo]]), and the inferior cerebellar peduncle (ipsilateral [[ataxia|ataxia]]). The usual cause is occlusion of the vertebral or posterior inferior cerebellar artery.",
      meta: meta("m-svv-wallenberg", [CUR]),
    },
    {
      id: "m-svv-patterns",
      version: 1,
      format: "multi-select",
      skill: "localization",
      modules: [M],
      difficulty: 1,
      presentation: "sensory-pattern-sorting",
      usage: ["lesson", "review"],
      stem: "Select every sensory pattern that localizes to the spinal cord.",
      options: [
        { id: "a", text: "All sensation lost below a horizontal line at the umbilicus, with brisk leg reflexes", correct: true },
        { id: "b", text: "Pain and temperature lost over both shoulders and arms, with vibration sense normal", correct: true },
        { id: "c", text: "Numbness of both feet to the ankles and of the fingertips, with absent ankle reflexes", tag: "misconception", feedback: "A stocking-glove pattern points to a length-dependent polyneuropathy in the peripheral nerves." },
        { id: "d", text: "Numbness of the whole left face, arm, and leg, splitting at the midline", tag: "misconception", feedback: "Face and body together on one side points above the brainstem: the thalamus or cortex." },
        { id: "e", text: "Pain and temperature lost on the right face and the left arm and leg", tag: "misconception", feedback: "Crossed face and body loss points to the lateral medulla." },
        { id: "f", text: "A band of numbness along the outer forearm and thumb, with neck pain shooting down the arm", tag: "misconception", feedback: "One dermatome with radiating pain points to a nerve root (here C6), not the cord." },
      ],
      rationale:
        "A [[sensory-level|sensory level]] and cape-shaped [[dissociated-sensory-loss|dissociated loss]] are cord patterns. [[stocking-glove|Stocking-glove]] loss is peripheral nerve, a single [[dermatome|dermatome]] is a root, crossed face and body loss is the lateral medulla, and one whole side including the face is the thalamus or cortex.",
      meta: meta("m-svv-patterns", [CUR]),
    },
    {
      id: "m-svv-ring",
      version: 1,
      format: "localization",
      skill: "localization",
      modules: [M],
      difficulty: 3,
      presentation: "split-ring-finger",
      usage: ["lesson", "review", "challenge"],
      vignette:
        "A 45-year-old leans on his elbows at a desk all day. For 2 months the little finger and the half of the ring finger next to it have been numb. The numbness stops at the wrist crease; the forearm feels normal. Finger spreading is weak, but thumb abduction is strong. He has no neck pain.",
      stem: "Where is the lesion?",
      correct: ["peripheral-nerve"],
      partial: [
        { region: "root", credit: 0.3, feedback: "A C8 root lesion numbs the whole ring finger and extends up the inner forearm, and it weakens thumb abduction too. The split ring finger, normal forearm, and strong thumb abduction point to the ulnar nerve." },
        { region: "plexus", credit: 0.2, feedback: "A lower plexus lesion would also involve the inner forearm and median-supplied hand muscles such as thumb abduction." },
      ],
      rationale:
        "The ulnar nerve supplies sensation to the little finger and the adjacent half of the ring finger and ends at the wrist; the inner forearm is supplied by a separate nerve from the C8 and T1 segments. Thumb abduction shares the C8 and T1 roots but is supplied by the median nerve, so its strength separates an ulnar [[mononeuropathy|mononeuropathy]] from a C8 [[radiculopathy|radiculopathy]] or lower plexus lesion. The elbow is a common site of ulnar nerve compression.",
      meta: meta("m-svv-ring", [CUR]),
    },

    // ---------------- l-visual-fields ----------------
    {
      id: "m-svv-bitemporal",
      version: 1,
      format: "mcq",
      skill: "localization",
      modules: [M],
      difficulty: 1,
      presentation: "bitemporal-field-loss",
      usage: ["lesson", "review"],
      vignette:
        "A 47-year-old has months of headache and keeps bumping into people on both sides. Visual acuity is normal in each eye. Testing each eye separately by confrontation, she cannot see the examiner's fingers in the outer (temporal) half of the field of either eye.",
      stem: "Where is the lesion?",
      options: [
        { id: "a", text: "Optic chiasm", correct: true, feedback: "Loss of both temporal fields means the crossing nasal fibers are damaged, at the chiasm." },
        { id: "b", text: "Both optic nerves", tag: "misconception", feedback: "Optic nerve damage causes loss in the affected eye, usually with reduced acuity and an afferent pupillary defect; it would not neatly remove both temporal halves." },
        { id: "c", text: "Right occipital lobe", tag: "misconception", feedback: "An occipital lesion causes a homonymous hemianopia: the same half in both eyes, not both outer halves." },
        { id: "d", text: "Left optic tract", tag: "misconception", feedback: "A left tract lesion causes a right homonymous hemianopia." },
      ],
      reasoning: {
        stem: "Which feature of the field defect points to the chiasm?",
        options: [
          { id: "r1", text: "The loss respects the vertical midline and affects the temporal field of each eye", correct: true },
          { id: "r2", text: "Visual acuity is normal", feedback: "Normal acuity means central vision is spared, but it does not place the lesion along the pathway." },
          { id: "r3", text: "Headache", feedback: "Headache is nonspecific." },
        ],
      },
      rationale:
        "At the [[optic-chiasm|optic chiasm]] the nasal retinal fibers cross. They see the temporal visual fields, so a midline chiasmal lesion causes [[bitemporal-hemianopia|bitemporal hemianopia]]. A pituitary adenoma growing up from the sella is the classic cause.",
      meta: meta("m-svv-bitemporal", [VF, CUR]),
    },
    {
      id: "m-svv-rapd",
      version: 1,
      format: "free-text",
      skill: "interpretation",
      modules: [M],
      difficulty: 2,
      presentation: "swinging-flashlight",
      usage: ["lesson", "review"],
      vignette:
        "A 29-year-old reports dim, washed-out vision in the right eye. Both pupils are the same size in room light. With the swinging flashlight test, both pupils constrict when the light is on the left eye. When the light swings to the right eye, both pupils dilate.",
      stem: "Name the finding and the structure it most likely points to.",
      placeholder: "Finding and structure",
      answer: {
        full: [
          {
            id: "r-rapd-on",
            label: "Right relative afferent pupillary defect from right optic nerve disease",
            patterns: [
              "right relative afferent pupillary defect + optic nerve",
              "right afferent pupillary defect + optic nerve",
              "right rapd + optic nerve",
              "rapd + right optic nerve",
              "afferent pupillary defect + right optic nerve",
              "rapd + right optic neuritis",
              "afferent pupillary defect + right optic neuritis",
              "rapd + right optic neuropathy",
              "afferent pupillary defect + right optic neuropathy",
              "marcus gunn + right optic",
              "afferent pupil + right + optic nerve",
            ],
          },
        ],
        partial: [
          { concept: { id: "rapd-only", label: "RAPD without location", patterns: ["rapd", "relative afferent pupillary defect", "afferent pupillary defect", "marcus gunn"] }, credit: 0.6, feedback: "Right sign. Say where it points: asymmetric disease of the right optic nerve." },
          { concept: { id: "on-only", label: "Right optic nerve without naming the sign", patterns: ["right optic nerve", "right optic neuropathy", "right optic neuritis"] }, credit: 0.6, feedback: "Right location. Name the sign: a right relative afferent pupillary defect." },
        ],
        wrong: [
          { concept: { id: "left", label: "Left side", patterns: ["left optic nerve", "left optic neuropathy", "left optic neuritis", "left rapd", "left afferent pupillary defect"] }, tag: "slip", feedback: "Both pupils dilate when the light moves onto the right eye, so the weaker input comes from the right optic nerve." },
          { concept: { id: "efferent", label: "Efferent pupil disorder", patterns: ["third nerve", "oculomotor", "horner", "adie"] }, tag: "misconception", feedback: "Those damage the outflow to one pupil and cause unequal pupils. Here the pupils are equal and move together, so the defect is afferent." },
        ],
      },
      modelAnswer: "A right relative afferent pupillary defect, pointing to disease of the right optic nerve (for example optic neuritis).",
      rationale:
        "Both pupils share the reflex output, so they stay equal in size. When the light moves to the eye whose optic nerve carries the weaker signal, the brainstem registers less light and both pupils dilate: a right [[rapd|relative afferent pupillary defect]]. It indicates asymmetric optic nerve (or extensive retinal) disease on that side; cataract and refractive error do not cause it. In a young adult with blurred vision in one eye, optic neuritis is a common cause.",
      meta: meta("m-svv-rapd", [CUR]),
    },
    {
      id: "m-svv-meyer",
      version: 1,
      format: "mcq",
      skill: "localization",
      modules: [M],
      difficulty: 1,
      presentation: "superior-quadrantanopia",
      usage: ["lesson", "review"],
      vignette: "After surgery on the anterior right temporal lobe for epilepsy, a 38-year-old notices that he misses things in one part of his vision.",
      stem: "Which visual field defect is most expected?",
      options: [
        { id: "a", text: "Left superior quadrantanopia in both eyes", correct: true },
        { id: "b", text: "Right superior quadrantanopia in both eyes", tag: "slip", feedback: "Lesions behind the chiasm cause defects on the opposite side." },
        { id: "c", text: "Left inferior quadrantanopia in both eyes", tag: "misconception", feedback: "The lower field is carried by the parietal radiations; the temporal (Meyer) loop carries the upper field." },
        { id: "d", text: "Loss of vision in the right eye only", tag: "misconception", feedback: "Loss in one eye means a lesion in front of the chiasm." },
      ],
      rationale:
        "The lower fibers of the optic radiation sweep forward through the temporal lobe ([[meyer-loop|Meyer loop]]). They carry the upper visual field from the opposite side, so a right temporal lesion causes a left superior [[quadrantanopia|quadrantanopia]], present in both eyes ([[homonymous|homonymous]]).",
      meta: meta("m-svv-meyer", [VF, CUR]),
    },
    {
      id: "m-svv-occipital",
      version: 1,
      format: "free-text",
      skill: "localization",
      modules: [M],
      difficulty: 2,
      presentation: "macular-sparing-hemianopia",
      usage: ["lesson", "review", "challenge"],
      vignette:
        "A 70-year-old with atrial fibrillation suddenly cannot see things to her right. Testing each eye separately shows loss of the right half of the field in both eyes, but central vision just to the right of fixation is preserved. Strength, sensation, language, and pupils are normal.",
      stem: "Name the most likely lesion site, including the side.",
      placeholder: "Structure and side",
      answer: {
        full: [{ id: "l-occ", label: "Left occipital cortex", patterns: ["left occipital", "left calcarine", "left visual cortex", "left striate cortex", "left posterior cerebral"] }],
        partial: [
          { concept: { id: "occ", label: "Occipital cortex without side", patterns: ["occipital", "visual cortex", "calcarine", "posterior cerebral"] }, credit: 0.6, feedback: "Right structure. Give the side: a right-sided field defect means the left occipital lobe." },
          { concept: { id: "retro", label: "Other left retrochiasmal site", patterns: ["left optic tract", "left optic radiation", "left parietal", "left temporal"] }, credit: 0.5, feedback: "A left lesion behind the chiasm fits the hemianopia, but macular sparing with no other deficits points to the occipital cortex, typically a left posterior cerebral artery infarct." },
        ],
        wrong: [
          { concept: { id: "r-occ", label: "Right occipital", patterns: ["right occipital", "right calcarine", "right visual cortex", "right posterior cerebral"] }, tag: "misconception", feedback: "Lesions behind the chiasm cause defects on the opposite side: a right homonymous hemianopia comes from the left hemisphere." },
          { concept: { id: "chiasm", label: "Chiasm", patterns: ["chiasm", "pituitary"] }, tag: "misconception", feedback: "A chiasmal lesion causes loss of both outer halves, not the same half in both eyes." },
          { concept: { id: "eye", label: "Eye or optic nerve", patterns: ["right optic nerve", "retina", "retinal"] }, tag: "misconception", feedback: "A lesion in one eye or optic nerve affects that eye only; this defect is present in both eyes." },
        ],
      },
      modelAnswer: "The left occipital cortex, most likely a left posterior cerebral artery infarct.",
      rationale:
        "Loss of the same half of the field in both eyes is a [[homonymous|homonymous]] [[hemianopia|hemianopia]] from a lesion behind the chiasm on the opposite side. [[macular-sparing|Macular sparing]] and the absence of motor, sensory, or language deficits favor the occipital cortex. Sudden onset with atrial fibrillation suggests an embolic posterior cerebral artery infarct.",
      meta: meta("m-svv-occipital", [VF, CUR]),
    },
    {
      id: "m-svv-prechiasmal",
      version: 1,
      format: "multi-select",
      skill: "localization",
      modules: [M],
      difficulty: 1,
      presentation: "prechiasmal-signs",
      usage: ["lesson", "review"],
      stem: "Select every finding that places a visual lesion in front of the optic chiasm (in the eye or optic nerve).",
      options: [
        { id: "a", text: "Visual loss confined to one eye, present when that eye is tested alone", correct: true },
        { id: "b", text: "A relative afferent pupillary defect on the side of the visual loss", correct: true },
        { id: "c", text: "Colors look faded in one eye compared with the other", correct: true },
        { id: "d", text: "Loss of the right half of the field in each eye", tag: "misconception", feedback: "The same half lost in both eyes is a homonymous defect from a lesion behind the chiasm." },
        { id: "e", text: "Loss of the outer half of the field in each eye", tag: "misconception", feedback: "Bitemporal loss localizes to the chiasm itself." },
        { id: "f", text: "Unequal pupil sizes in dim light", tag: "misconception", feedback: "Unequal pupils reflect a problem with the pupil's outflow (sympathetic or parasympathetic), not the optic nerve. An afferent defect leaves the pupils equal." },
      ],
      rationale:
        "In front of the chiasm each eye's fibers travel alone, so lesions there affect one eye: reduced vision or field in that eye, faded color perception (prominent in optic nerve disease), and a [[rapd|relative afferent pupillary defect]]. A defect present in both eyes means the chiasm or the pathway behind it.",
      meta: meta("m-svv-prechiasmal", [VF, CUR]),
    },

    // ---------------- l-vertigo-cerebellum ----------------
    {
      id: "m-svv-hints",
      version: 1,
      format: "mcq",
      skill: "history-exam",
      modules: [M],
      difficulty: 2,
      presentation: "acute-vestibular-central",
      usage: ["lesson", "review", "challenge"],
      vignette:
        "A 66-year-old has had constant spinning vertigo, vomiting, and unsteadiness for 10 hours. Nystagmus beats to the left on left gaze and to the right on right gaze. The [[head-impulse-test|head impulse test]] is normal in both directions. Alternate cover testing shows no vertical misalignment. He cannot stand without holding on.",
      stem: "Which diagnosis is most important to pursue?",
      options: [
        { id: "a", text: "Posterior circulation stroke", correct: true, feedback: "Direction-changing nystagmus, a normal head impulse test, and inability to stand are central features." },
        { id: "b", text: "Vestibular neuritis", tag: "misconception", feedback: "Vestibular neuritis causes nystagmus in one direction and an abnormal head impulse test toward the affected side." },
        { id: "c", text: "Benign paroxysmal positional vertigo", tag: "misconception", feedback: "Positional vertigo causes brief spells triggered by head position, not hours of continuous vertigo." },
        { id: "d", text: "Anxiety-related dizziness", tag: "unsafe-priority", feedback: "This overlooks objective central signs on examination and risks missing a stroke." },
      ],
      reasoning: {
        stem: "Which finding is reassuring in many dizzy patients but a warning sign here?",
        options: [
          { id: "r1", text: "A normal head impulse test", correct: true },
          { id: "r2", text: "Vomiting", feedback: "Vomiting is common in both peripheral and central acute vertigo." },
          { id: "r3", text: "No skew deviation", feedback: "Absent skew does not exclude stroke; any one central feature is enough to raise concern." },
        ],
      },
      rationale:
        "In the [[acute-vestibular-syndrome|acute vestibular syndrome]], [[hints-exam|HINTS]] looks for central features: a normal head impulse test, nystagmus that changes direction with gaze, and [[skew-deviation|skew deviation]]. Any one suggests a central cause. Here two are present, plus severe [[truncal-ataxia|truncal ataxia]]. In the original HINTS study the bedside examination was more sensitive for stroke than early MRI diffusion imaging, so a normal early MRI would not settle the question.",
      meta: meta("m-svv-hints", [HINTS, CUR]),
    },
    {
      id: "m-svv-redflags",
      version: 1,
      format: "multi-select",
      skill: "history-exam",
      modules: [M],
      difficulty: 2,
      presentation: "vertigo-red-flags",
      usage: ["lesson", "review"],
      stem: "A patient has had continuous vertigo with nystagmus for several hours. Select every finding that points toward a central (brainstem or cerebellar) cause.",
      options: [
        { id: "a", text: "Normal head impulse test in both directions", correct: true },
        { id: "b", text: "Nystagmus that changes direction with the direction of gaze", correct: true },
        { id: "c", text: "Vertical misalignment of the eyes on alternate cover testing", correct: true },
        { id: "d", text: "Unable to sit or stand without support", correct: true },
        { id: "e", text: "Purely vertical (downbeating) nystagmus", correct: true },
        { id: "f", text: "New double vision and slurred speech", correct: true },
        { id: "g", text: "Nausea and vomiting", tag: "misconception", feedback: "Common in peripheral and central vertigo alike; it does not separate them." },
        { id: "h", text: "A catch-up saccade when the head is turned quickly toward one side", tag: "misconception", feedback: "An abnormal head impulse test points to a peripheral vestibular lesion on that side." },
        { id: "i", text: "Horizontal nystagmus beating in one direction that lessens when the patient fixes on a target", tag: "misconception", feedback: "One-direction nystagmus damped by fixation is the peripheral pattern." },
      ],
      rationale:
        "The three [[hints-exam|HINTS]] central features (normal head impulse, direction-changing nystagmus, [[skew-deviation|skew deviation]]) come from the original study. Severe [[truncal-ataxia|truncal ataxia]], vertical or torsional nystagmus, and other brainstem signs are widely taught additional warnings. Vomiting does not discriminate, and an abnormal head impulse test with one-direction, fixation-damped nystagmus is the peripheral pattern.",
      meta: meta("m-svv-redflags", [HINTS, CUR]),
    },
    {
      id: "m-svv-cerebellar-side",
      version: 1,
      format: "free-text",
      skill: "localization",
      modules: [M],
      difficulty: 2,
      presentation: "unilateral-limb-ataxia",
      usage: ["lesson", "review"],
      vignette:
        "A 57-year-old has had sudden clumsiness of the right hand for a day. On finger-nose testing the right hand overshoots the target, with a tremor that worsens as it nears the target. Rapid alternating hand movements are slow and irregular on the right. Heel-shin testing is clumsy on the right. Strength, reflexes, and sensation are normal, and the left side is normal.",
      stem: "Name the lesion site, including the side.",
      placeholder: "Structure and side",
      answer: {
        full: [{ id: "r-cbl", label: "Right cerebellar hemisphere", patterns: ["right cerebellar", "right cerebellum", "right dentate"] }],
        partial: [{ concept: { id: "cbl", label: "Cerebellum without side", patterns: ["cerebellar", "cerebellum"] }, credit: 0.5, feedback: "Right structure. Give the side: cerebellar hemisphere signs appear on the same side as the lesion, so this is the right hemisphere." }],
        wrong: [
          { concept: { id: "l-cbl", label: "Left cerebellum", patterns: ["left cerebellar", "left cerebellum"] }, tag: "misconception", feedback: "Cerebellar signs are ipsilateral: right limb ataxia means the right cerebellar hemisphere." },
          { concept: { id: "vermis", label: "Vermis", patterns: ["vermis", "midline cerebellum"] }, tag: "misconception", feedback: "A midline lesion causes truncal and gait ataxia; one-sided limb ataxia points to a hemisphere." },
          { concept: { id: "dc", label: "Dorsal columns", patterns: ["dorsal column", "posterior column", "sensory ataxia"] }, tag: "misconception", feedback: "Sensation, including position sense, is normal, so this is not sensory ataxia." },
        ],
      },
      modelAnswer: "The right cerebellar hemisphere.",
      rationale:
        "[[dysmetria|Dysmetria]], [[intention-tremor|intention tremor]], and [[dysdiadochokinesia|dysdiadochokinesia]] in one arm and leg with normal strength and sensation are hemispheric cerebellar signs. They are [[ipsilateral|ipsilateral]] because cerebellar output crosses to the opposite thalamus and motor cortex, and the [[corticospinal-tract|corticospinal tract]] crosses back. Sudden onset raises concern for cerebellar stroke.",
      meta: meta("m-svv-cerebellar-side", [CUR]),
    },
    {
      id: "m-svv-midline",
      version: 1,
      format: "mcq",
      skill: "localization",
      modules: [M],
      difficulty: 2,
      presentation: "gait-ataxia-midline",
      usage: ["lesson", "review", "challenge"],
      vignette:
        "A 55-year-old with long-standing heavy alcohol use has a broad-based, staggering gait that has worsened over months. He cannot walk heel to toe. Finger-nose testing is accurate in both arms. Vibration and joint position sense are normal in the toes, and standing with feet together he sways about as much with eyes open as with eyes closed.",
      stem: "Which part of the nervous system is most likely affected?",
      options: [
        { id: "a", text: "Midline cerebellum (vermis)", correct: true, feedback: "Gait and truncal ataxia with accurate arm coordination is the midline pattern." },
        { id: "b", text: "Both cerebellar hemispheres", tag: "misconception", feedback: "Hemispheric lesions cause limb ataxia, and his arm coordination is normal." },
        { id: "c", text: "Dorsal columns", tag: "misconception", feedback: "Sensory ataxia comes with reduced position and vibration sense and much worse balance with eyes closed." },
        { id: "d", text: "Left cerebellar hemisphere", tag: "misconception", feedback: "A hemisphere lesion causes ataxia of the arm and leg on that side." },
      ],
      reasoning: {
        stem: "Which finding best separates midline from hemispheric cerebellar disease here?",
        options: [
          { id: "r1", text: "Severe gait ataxia with accurate finger-nose testing", correct: true },
          { id: "r2", text: "Normal vibration sense", feedback: "This separates cerebellar from sensory ataxia, not midline from hemispheric." },
          { id: "r3", text: "Months of progression", feedback: "Tempo suggests the kind of process, not which part of the cerebellum is involved." },
        ],
      },
      rationale:
        "The vermis coordinates the trunk and gait, so midline lesions cause [[truncal-ataxia|truncal]] and gait [[ataxia|ataxia]] with relatively preserved arm coordination. Alcohol-related cerebellar degeneration typically affects the anterior vermis, so gait and legs suffer most. Normal position sense and a [[romberg-test|Romberg test]] that is not much worse with eyes closed argue against sensory ataxia.",
      meta: meta("m-svv-midline", [CUR]),
    },
    {
      id: "m-svv-ipsi-why",
      version: 1,
      format: "free-text",
      skill: "mechanism",
      modules: [M],
      difficulty: 1,
      presentation: "cerebellar-laterality",
      usage: ["lesson", "review"],
      stem: "A right cerebellar hemisphere lesion causes right-sided limb ataxia, although most brain lesions affect the opposite side of the body. Explain why.",
      placeholder: "Trace the output pathway",
      answer: {
        full: [
          {
            id: "double",
            label: "Output crosses twice",
            patterns: [
              "crosses twice",
              "cross twice",
              "double crossing",
              "double decussation",
              "decussates twice",
              "two crossings",
              "two decussations",
              "superior cerebellar peduncle + corticospinal",
              "contralateral thalamus + corticospinal",
              "contralateral motor cortex + corticospinal",
              "opposite motor cortex + corticospinal",
              "crosses back + corticospinal",
              "crosses again + corticospinal",
            ],
          },
        ],
        partial: [
          { concept: { id: "first-cross", label: "First crossing only", patterns: ["superior cerebellar peduncle", "contralateral thalamus", "opposite thalamus", "contralateral cortex", "opposite cortex"] }, credit: 0.5, feedback: "That is the first crossing. Add the second: the corticospinal tract crosses back at the pyramidal decussation, returning the effect to the side of the lesion." },
          { concept: { id: "input", label: "Ipsilateral input only", patterns: ["spinocerebellar", "ipsilateral input"] }, credit: 0.4, feedback: "Input is largely same-sided, but the key is the output: it crosses to the opposite cortex and then back in the corticospinal tract." },
        ],
      },
      modelAnswer:
        "Cerebellar output crosses twice: from the right cerebellum through the superior cerebellar peduncle to the left thalamus and motor cortex, then back to the right side in the corticospinal tract at the pyramidal decussation.",
      rationale:
        "The right cerebellar hemisphere sends its output through the superior cerebellar peduncle, which crosses in the midbrain, to the left thalamus and left motor cortex. The left motor cortex moves the right limbs through the [[corticospinal-tract|corticospinal tract]], which crosses at the pyramidal [[decussation|decussation]]. Two crossings cancel out, so hemispheric cerebellar signs are [[ipsilateral|ipsilateral]].",
      meta: meta("m-svv-ipsi-why", [CUR]),
    },
  ],

  // ---------------------------------------------------------------- Terms
  terms: [
    term("radiculopathy", "Radiculopathy", ["root lesion", "nerve root lesion"],
      "Damage to a spinal nerve root, often causing pain that shoots along a limb.",
      "Dysfunction of a spinal nerve root, giving pain, sensory loss in its dermatome, weakness in its myotome, and loss of the reflex it serves.",
      "ruh-dik-yoo-LOP-uh-thee",
      "Neck pain shooting to the thumb with a reduced biceps reflex suggests a C6 radiculopathy.",
      M, ["dermatome", "myotome", "mononeuropathy"]),
    term("mononeuropathy", "Mononeuropathy", ["single nerve lesion"],
      "Damage to one peripheral nerve.",
      "Dysfunction of a single named peripheral nerve, with sensory loss in that nerve's territory and weakness of the muscles it supplies.",
      "mon-oh-nyoo-ROP-uh-thee",
      "Numbness of the little finger and half the ring finger with weak finger spreading is an ulnar mononeuropathy.",
      M, ["radiculopathy", "stocking-glove"]),
    term("stocking-glove", "Stocking-glove sensory loss", ["length-dependent neuropathy", "glove and stocking"],
      "Numbness that starts in the feet and later reaches the hands, like wearing socks and gloves.",
      "Symmetric distal sensory loss from a length-dependent polyneuropathy: the longest axons fail first, so the feet are affected before the hands and ankle reflexes are lost early.",
      undefined,
      "Diabetes causes numb feet to mid-shin and numb fingertips: a stocking-glove pattern.",
      M, ["mononeuropathy", "axonal"]),
    term("dissociated-sensory-loss", "Dissociated sensory loss", ["sensory dissociation"],
      "Losing some kinds of feeling (such as pain and temperature) while others (such as vibration) are kept.",
      "Loss of one sensory modality group with preservation of another, reflecting damage to one pathway but not the other, for example spinothalamic loss with dorsal column sparing in a central cord lesion.",
      undefined,
      "Painless burns on the arms with normal vibration sense: dissociated sensory loss from a syrinx.",
      M, ["syringomyelia", "spinothalamic-tract", "dorsal-columns"]),
    term("syringomyelia", "Syringomyelia", ["syrinx"],
      "A fluid-filled cavity inside the spinal cord.",
      "A fluid-filled cavity (syrinx) within the spinal cord, usually cervical, that interrupts crossing spinothalamic fibers to cause cape-shaped pain and temperature loss, then may damage the anterior horns and corticospinal tracts as it expands.",
      "sih-ring-goh-my-EE-lee-uh",
      "Cape-shaped loss of pain sensation with wasted hands raises suspicion of syringomyelia.",
      M, ["dissociated-sensory-loss", "central-cord-syndrome"]),
    term("central-cord-syndrome", "Central cord syndrome", [],
      "Damage to the middle of the neck part of the spinal cord, affecting the arms more than the legs.",
      "Injury to the central cervical cord, often after neck hyperextension in a spondylotic spine, causing arm weakness greater than leg weakness and variable sensory loss below the lesion.",
      undefined,
      "After a fall onto the face, an older adult has weak hands but can walk: central cord syndrome.",
      M, ["syringomyelia", "dissociated-sensory-loss"]),
    term("lateral-medullary-syndrome", "Lateral medullary syndrome", ["Wallenberg syndrome"],
      "A stroke in the side of the lower brainstem causing dizziness, swallowing trouble, and numbness of the face on one side and the body on the other.",
      "Infarction of the lateral medulla, usually from vertebral or posterior inferior cerebellar artery occlusion: ipsilateral facial pain and temperature loss, contralateral body pain and temperature loss, ipsilateral Horner syndrome, ataxia, vertigo, hoarseness, and dysphagia.",
      undefined,
      "Left face and right body pain loss with hoarseness and a left Horner syndrome: lateral medullary syndrome.",
      M, ["horner-syndrome", "spinothalamic-tract", "vertigo"]),
    term("cortical-sensory-loss", "Cortical sensory loss", ["discriminative sensory loss"],
      "Feeling is present, but the brain cannot make sense of it, such as recognizing an object by touch.",
      "Impaired sensory discrimination from a parietal lesion (poor two-point discrimination, graphesthesia, stereognosis, and position sense, with extinction) while basic touch, pain, and temperature are relatively preserved.",
      undefined,
      "She feels the coin in her left hand but cannot tell what it is: cortical sensory loss from a right parietal lesion.",
      M, ["extinction", "neglect"]),
    term("optic-chiasm", "Optic chiasm", ["chiasm"],
      "The X-shaped place under the brain where nerve fibers from the two eyes partly cross.",
      "The junction of the optic nerves above the pituitary gland, where fibers from the nasal half of each retina (serving the temporal fields) cross to the opposite optic tract.",
      "KY-az-um",
      "A pituitary adenoma pressing on the optic chiasm causes bitemporal hemianopia.",
      M, ["bitemporal-hemianopia", "hemianopia"]),
    term("bitemporal-hemianopia", "Bitemporal hemianopia", [],
      "Loss of the outer half of vision in both eyes.",
      "Loss of the temporal visual field of each eye from damage to the crossing nasal fibers at the optic chiasm, classically from a pituitary tumor.",
      "by-TEM-puh-rul hem-ee-uh-NOH-pee-uh",
      "She bumps into people on both sides: bitemporal hemianopia from a chiasmal lesion.",
      M, ["optic-chiasm", "hemianopia"]),
    term("quadrantanopia", "Quadrantanopia", ["quadrantanopsia"],
      "Loss of one quarter of vision.",
      "Loss of one quadrant of the visual field. A homonymous superior quadrantanopia points to the opposite temporal lobe (Meyer loop); an inferior one points to the opposite parietal lobe.",
      "kwod-ran-tuh-NOH-pee-uh",
      "A right temporal lesion causes a left superior quadrantanopia.",
      M, ["meyer-loop", "homonymous"]),
    term("meyer-loop", "Meyer loop", ["Meyer's loop"],
      "Part of the visual wiring that loops forward through the temporal lobe.",
      "The lower fibers of the optic radiation, which sweep forward through the temporal lobe and carry the contralateral upper visual field.",
      "MY-er",
      "Temporal lobe surgery can cut Meyer loop and cause a contralateral superior quadrantanopia.",
      M, ["quadrantanopia", "homonymous"]),
    term("macular-sparing", "Macular sparing", [],
      "Keeping central vision even though one half of vision is lost.",
      "Preservation of central vision within a homonymous hemianopia, typical of occipital cortex lesions; often explained by the large cortical representation of the macula and dual blood supply of the occipital pole.",
      undefined,
      "A left PCA infarct causes a right hemianopia with macular sparing.",
      M, ["hemianopia", "homonymous"]),
    term("rapd", "Relative afferent pupillary defect", ["RAPD", "Marcus Gunn pupil", "afferent pupillary defect"],
      "Both pupils open up when a light is moved onto the eye with the weaker optic nerve.",
      "Asymmetric pupillary light response on the swinging flashlight test: both pupils dilate when light moves to the affected eye, indicating asymmetric optic nerve or extensive retinal disease. The pupils are equal at rest.",
      undefined,
      "Optic neuritis in the right eye produces a right RAPD.",
      M, ["anisocoria", "optic-chiasm"]),
    term("vertigo", "Vertigo", [],
      "A false feeling that you or the room is spinning or moving.",
      "An illusion of self-motion or environmental motion, from dysfunction of the inner ear, vestibular nerve (peripheral), or brainstem and cerebellum (central).",
      "VER-tih-go",
      "Constant spinning since waking, with vomiting and nystagmus, is acute vertigo.",
      M, ["acute-vestibular-syndrome", "nystagmus"]),
    term("acute-vestibular-syndrome", "Acute vestibular syndrome", ["AVS"],
      "Sudden, constant dizziness lasting a day or more, with vomiting and unsteady walking.",
      "Acute onset of continuous vertigo lasting days, with nausea or vomiting, nystagmus, head motion intolerance, and gait unsteadiness. The main causes are vestibular neuritis and posterior circulation stroke.",
      undefined,
      "HINTS is designed for the acute vestibular syndrome, not for brief positional vertigo.",
      M, ["vertigo", "hints-exam"]),
    term("hints-exam", "HINTS examination", ["HINTS", "Head Impulse, Nystagmus, Test of Skew"],
      "Three quick bedside eye tests that help tell an inner ear problem from a stroke in a patient with constant vertigo.",
      "Head Impulse, Nystagmus, Test of Skew: in the acute vestibular syndrome, a normal head impulse test, direction-changing nystagmus, or skew deviation each suggests a central cause.",
      undefined,
      "His HINTS examination shows a normal head impulse and direction-changing nystagmus: central until proven otherwise.",
      M, ["head-impulse-test", "skew-deviation", "nystagmus"]),
    term("truncal-ataxia", "Truncal ataxia", ["axial ataxia"],
      "Unsteadiness of the body when sitting, standing, or walking.",
      "Incoordination of the trunk causing difficulty sitting or standing unsupported and a wide-based gait, typical of midline (vermis) cerebellar lesions.",
      undefined,
      "He cannot sit up without support despite normal arm coordination: truncal ataxia.",
      M, ["ataxia", "dysmetria"]),
    term("intention-tremor", "Intention tremor", [],
      "Shaking that gets worse as the hand gets close to a target.",
      "Tremor that increases in amplitude as a limb approaches a target, a sign of cerebellar hemisphere or outflow dysfunction.",
      undefined,
      "His finger shakes more and more as it nears his nose: intention tremor.",
      M, ["dysmetria", "ataxia"]),
    term("dysdiadochokinesia", "Dysdiadochokinesia", [],
      "Trouble making quick alternating movements, like flipping the hand over and back.",
      "Impaired rapid alternating movements (slow, irregular rhythm and amplitude), a sign of cerebellar dysfunction on the same side.",
      "dis-dy-ad-oh-koh-kih-NEE-zhuh",
      "Patting the thigh with alternating palm and back of hand is slow and irregular on the right: right dysdiadochokinesia.",
      M, ["dysmetria", "ataxia"]),
    term("romberg-test", "Romberg test", ["Romberg sign"],
      "Standing with feet together and then closing the eyes, to check whether balance depends on vision.",
      "A test of proprioception: the patient stands feet together with eyes open, then closed. Marked worsening with eyes closed (a positive test) suggests sensory ataxia from dorsal column or large-fiber nerve disease; cerebellar patients are unsteady with eyes open as well.",
      "ROM-berg",
      "She is steady with eyes open but falls when she closes them: a positive Romberg test from B12 deficiency.",
      M, ["dorsal-columns", "ataxia"]),
  ],

  // ---------------------------------------------------------------- Sources
  sources: [
    {
      id: "kedar2011-visual-fields",
      kind: "review",
      citation: "Kedar S, Ghate D, Corbett JJ. Visual fields in neuro-ophthalmology. Indian J Ophthalmol. 2011;59(2):103-109. doi:10.4103/0301-4738.77013",
      title: "Visual fields in neuro-ophthalmology",
      authors: "Kedar S, Ghate D, Corbett JJ",
      journal: "Indian Journal of Ophthalmology",
      year: 2011,
      doi: "10.4103/0301-4738.77013",
      pmid: "21350279",
      url: "https://doi.org/10.4103/0301-4738.77013",
      lastVerified: "2026-11-06",
      verificationNote:
        "Title, authors, journal, year, volume, pages, DOI, PMID 21350279 and PMCID PMC3116538 confirmed on 2026-11-06 from web search results indexing PubMed Central, DOAJ, and the WHO IMSEAR record. PubMed itself cannot be opened from this environment and the article page was not opened directly; open the DOI link once to confirm before relying on page-level details.",
      verified: true,
    },
  ],
};

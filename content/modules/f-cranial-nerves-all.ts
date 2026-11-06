// Module f-cranial-nerves-all: the twelve cranial nerves, nuclei by brainstem level, upper versus
// lower motor neuron facial and bulbar weakness, and the classic crossed brainstem syndromes.
// CN III, IV, VI and INO are taught in depth in f-ocular-motor (l-diplopia) and only linked here.

import type { ModuleContent } from "./types";
import { meta, term } from "./types";

const M = "f-cranial-nerves-all";
const CURR = ["safdieh2019-curriculum"];
const BELL = ["baugh2013-bells"];
const HINTS = ["kattah2009-hints"];

export const CONTENT: ModuleContent | null = {
  moduleId: M,
  module: {
    summary:
      "What each cranial nerve does and how to test it in one line, where the nuclei sit in the brainstem, upper versus lower motor neuron weakness of the face and bulbar muscles, Bell palsy red flags, and the crossed brainstem syndromes.",
    objectives: [
      ["history-exam", "Name the main function of each cranial nerve and a one-line bedside test for it."],
      ["localization", "Place the nuclei of cranial nerves III to XII in the midbrain, pons, or medulla, and use them to set the level of a brainstem lesion."],
      ["mechanism", "Explain why upper motor neuron facial weakness spares the forehead and why pseudobulbar palsy needs lesions on both sides."],
      ["differential", "Recognize features that argue against Bell palsy and call for a search for another cause."],
      ["localization", "Localize Weber, ventral pontine, lateral medullary, and medial medullary syndromes as an ipsilateral cranial nerve sign plus a contralateral long tract sign."],
    ],
    prerequisites: ["f-localization"],
    lessons: ["l-cn-levels", "l-cn-face-bulbar", "l-cn-crossed"],
    challengeItems: ["m-cnall-medial-loc", "m-cnall-bell-flags", "m-cnall-weber", "m-cnall-wallenberg"],
    skills: ["history-exam", "localization", "mechanism", "differential"],
    minutes: 22,
    sources: ["safdieh2019-curriculum", "baugh2013-bells", "kattah2009-hints"],
  },

  lessons: [
    // ------------------------------------------------------------------ l-cn-levels
    {
      id: "l-cn-levels",
      moduleId: M,
      title: "Twelve nerves on three floors",
      concept: "Each cranial nerve has one main job and one quick bedside test, and because its nucleus sits at a fixed brainstem level, a cranial nerve sign tells you the level of a lesion.",
      minutes: 7,
      meta: meta("l-cn-levels", CURR),
      steps: [
        {
          kind: "hook",
          title: "A built-in ruler",
          body: "Limb weakness tells you a lesion is somewhere on a long pathway from cortex to muscle. Cranial nerves are different: each one leaves the brain at a known level. Find the cranial nerve that is not working and you have a ruler for the brainstem.",
        },
        {
          kind: "explain",
          title: "What each nerve does, and a one-line test",
          body:
            "I olfactory: smell. Test each nostril with a familiar, non-irritating scent; loss is [[anosmia|anosmia]].\nII optic: vision. Acuity, visual fields, and the pupil response to light (the afferent limb).\nIII, IV, VI: eye movements, the eyelid elevator (III), and pupil constriction (III). Follow a target in all directions. These three are taught in depth in the ocular motor module (lesson: Diplopia), so they are only placed on the map here.\nV [[trigeminal-nerve|trigeminal]]: facial sensation and chewing. Light touch in forehead, cheek, and jaw; clench the jaw. It is the sensory limb of the [[corneal-reflex|corneal reflex]].\nVII [[facial-nerve|facial]]: facial expression, plus taste on the front of the tongue. Raise the eyebrows, squeeze the eyes shut, show the teeth.\nVIII vestibulocochlear: hearing and balance. Finger rub at each ear; look for [[nystagmus|nystagmus]].\nIX glossopharyngeal and X [[vagus-nerve|vagus]]: palate, pharynx, larynx. Say 'ah' and watch the palate rise; listen to the voice and swallow. IX carries the sensory limb of the [[gag-reflex|gag reflex]], X the motor limb.\nXI accessory: sternocleidomastoid and trapezius. Shrug the shoulders and turn the head against resistance.\nXII [[hypoglossal-nerve|hypoglossal]]: the tongue. Stick it out; look for deviation, wasting, and [[fasciculation|fasciculations]].",
          layers: {
            simpler:
              "Smell, see, move the eyes, feel the face and chew, move the face, hear and balance, swallow and speak, shrug, move the tongue. Twelve jobs, roughly from front to back of the head, and roughly top to bottom of the brainstem.",
            mechanism:
              "Each genioglossus muscle pushes the tongue forward and toward the opposite side. If the right one is weak, the left pushes unopposed and the tongue points to the right: a lower motor neuron tongue deviates toward the weak side. The palate is the reverse: the strong side pulls the uvula toward itself, so the uvula points away from a weak vagus.",
            compare:
              "Lower motor neuron cranial nerve weakness looks like lower motor neuron weakness anywhere: wasting and fasciculations of the tongue, a flaccid palate. Upper motor neuron (corticobulbar) weakness of these muscles has no wasting, and because most bulbar nuclei receive input from both hemispheres, a one-sided upper motor neuron lesion gives only mild bulbar weakness.",
            deeper:
              "The accessory nerve turns the head away: the right sternocleidomastoid turns the chin to the left. Its nucleus lies mostly in the upper cervical cord, not the medulla. The trigeminal sensory nuclei run the whole length of the brainstem into the upper cervical cord, which is why a medullary stroke can numb the face.",
          },
        },
        {
          kind: "explain",
          title: "Nuclei by level: III and IV midbrain, V to VIII pons, IX to XII medulla",
          body:
            "Nerves I and II are extensions of the forebrain, not brainstem nerves. The rest have nuclei stacked in order:\n\nMidbrain: III and IV.\nPons: V (motor and main sensory nuclei), VI, VII, and VIII (at the junction with the medulla).\nMedulla: IX, X, XI (by convention), and XII.\n\nSo a cranial nerve sign sets the level. Add the long tracts, which pass through every level, and you have the side as well: a brainstem lesion causes an [[ipsilateral|ipsilateral]] cranial nerve sign with [[contralateral|contralateral]] limb weakness, because the [[corticospinal-tract|corticospinal tract]] has not yet crossed at the [[decussation|decussation]] in the lower medulla.",
          layers: {
            simpler: "Read the brainstem like a building: eye nerves III and IV on the top floor, face and hearing nerves in the middle, swallowing and tongue nerves on the bottom floor.",
            mechanism:
              "Cranial nerve nuclei are the brainstem equivalent of anterior horn cells. A lesion of the nucleus or its outgoing fibers is a lower motor neuron lesion of that nerve, on the same side. The corticospinal fibers passing the same level are upper motor neuron fibers for the opposite limbs.",
            compare:
              "A lesion of the nerve outside the brainstem (for example in the skull base) gives the cranial nerve sign without long tract signs. A cerebral hemisphere lesion gives long tract signs and upper motor neuron facial weakness, but no lower motor neuron cranial nerve sign.",
            deeper:
              "Several nerves together can still be outside the brainstem: lesions at the skull base or cavernous sinus affect neighboring nerves as they travel together. Long tract signs are what pull the localization into the brainstem.",
          },
        },
        { kind: "predict", title: "Read the tongue", itemId: "m-cnall-tongue" },
        { kind: "apply", title: "Use the ruler", itemId: "m-cnall-medial-loc" },
        {
          kind: "summary",
          title: "Key points",
          points: [
            "Each cranial nerve has one main job and a quick bedside test.",
            "III and IV midbrain; V to VIII pons; IX to XII medulla.",
            "A lower motor neuron tongue points toward the weak side; the uvula points away from a weak vagus.",
            "Cranial nerve sign plus opposite-side limb signs localizes to the brainstem at that nerve's level.",
          ],
          reviewItemIds: ["m-cnall-tongue", "m-cnall-medial-loc", "m-cnall-nuclei-order", "m-cnall-bedside"],
        },
      ],
    },

    // ------------------------------------------------------------------ l-cn-face-bulbar
    {
      id: "l-cn-face-bulbar",
      moduleId: M,
      title: "Upper or lower motor neuron? Face, palate, and tongue",
      concept: "Bilateral cortical input to the upper face and to most bulbar nuclei explains forehead sparing in central facial weakness and why pseudobulbar palsy needs lesions on both sides.",
      minutes: 7,
      meta: meta("l-cn-face-bulbar", [...CURR, ...BELL]),
      steps: [
        {
          kind: "hook",
          title: "Two drooping faces",
          body: "Two patients cannot smile on the right. One wrinkles both sides of the forehead normally; the other cannot raise the right eyebrow or close the right eye. One may be having a stroke; the other most likely has a facial nerve problem. The forehead decides which.",
        },
        {
          kind: "explain",
          title: "Forehead sparing and Bell palsy red flags",
          body:
            "The part of the facial nucleus that drives the upper face receives [[corticobulbar-tract|corticobulbar]] input from both hemispheres. The part for the lower face receives mainly crossed input.\n\nUpper motor neuron lesion (for example a hemisphere stroke): weakness of the contralateral lower face, forehead and eye closure largely spared, often with arm weakness on the same side.\n\nLower motor neuron lesion (facial nucleus or [[facial-nerve|facial nerve]]): the whole ipsilateral face is weak, forehead and eye closure included, sometimes with altered taste or [[hyperacusis|hyperacusis]].\n\n[[bell-palsy|Bell palsy]] is an acute, unilateral lower motor neuron facial palsy with no identifiable cause, so it is a diagnosis of exclusion. Red flags that call for a search for another cause: forehead sparing (think central lesion), other cranial nerve or limb signs, both sides affected, weakness that creeps on over weeks, recurrence on the same side, a parotid lump, ear canal vesicles ([[ramsay-hunt-syndrome|Ramsay Hunt syndrome]]), or no recovery by about 3 months.",
          layers: {
            simpler: "The forehead has a backup line from the other side of the brain. A stroke cuts one line, and the backup keeps the forehead working. A damaged facial nerve cuts the final wire, and no backup helps.",
            mechanism:
              "The facial nerve also carries the nerve to stapedius (which damps loud sound) and the chorda tympani (taste, front two thirds of the tongue). A lesion in the facial canal, as in Bell palsy, can therefore cause hyperacusis and altered taste along with the weakness.",
            compare:
              "Bilateral lower motor neuron facial weakness is rarely Bell palsy: think of Guillain-Barre syndrome, Lyme disease, sarcoidosis, or meningeal disease. Myasthenia gravis can weaken both faces but fluctuates and fatigues.",
            deeper:
              "A guideline for Bell palsy recommends history and examination to exclude other causes, no routine laboratory tests or imaging for typical cases, oral steroids for adults started within 72 hours of onset, eye protection when eye closure is impaired, and reassessment for new neurological signs, eye symptoms, or incomplete recovery at 3 months.",
          },
        },
        {
          kind: "explain",
          title: "Bulbar versus pseudobulbar palsy",
          body:
            "[[bulbar|Bulbar]] palsy is lower motor neuron weakness of the muscles of IX, X, and XII: nasal speech, [[dysphagia|dysphagia]], a weak palate, a reduced gag, and a wasted, fasciculating tongue. Lesions are in the medulla or the nerves (for example motor neuron disease, Guillain-Barre syndrome); junction disease such as myasthenia gravis gives similar weakness without wasting.\n\n[[pseudobulbar-palsy|Pseudobulbar palsy]] is upper motor neuron weakness of the same muscles from bilateral corticobulbar lesions above the medulla: slow, strained [[dysarthria|dysarthria]], dysphagia, a small, stiff tongue that moves slowly without wasting, a brisk [[jaw-jerk|jaw jerk]], and often [[pseudobulbar-affect|pseudobulbar affect]]. Causes include strokes in both hemispheres, multiple sclerosis, and motor neuron disease.",
          layers: {
            simpler: "Bulbar means the wires to the swallowing and tongue muscles are damaged: floppy, thin, twitchy. Pseudobulbar means the supervisors on both sides of the brain are damaged: stiff, slow, with jumpy reflexes in the jaw.",
            mechanism:
              "Most bulbar nuclei get corticobulbar input from both hemispheres, so one hemisphere can largely cover for the other. Substantial upper motor neuron bulbar weakness appears when both sides are damaged. The jaw jerk is the bulbar equivalent of a limb reflex: brisk when upper motor neurons are lost.",
            compare:
              "Motor neuron disease can show both at once: a wasted, fasciculating tongue (lower motor neuron) with a brisk jaw jerk (upper motor neuron). The mixture is itself a clue, as it is in the limbs.",
            deeper:
              "Swallowing can still be impaired after a single hemisphere stroke, so every stroke patient needs a swallow screen before eating or drinking. Pseudobulbar affect is crying or laughing out of proportion to, or unlike, the person's mood.",
          },
        },
        { kind: "predict", title: "Central or peripheral face?", itemId: "m-cnall-forehead" },
        { kind: "apply", title: "Is it really Bell palsy?", itemId: "m-cnall-bell-flags" },
        {
          kind: "summary",
          title: "Key points",
          points: [
            "Forehead spared: upper motor neuron lesion, usually in the opposite hemisphere.",
            "Whole half of the face weak: facial nucleus or nerve on the same side.",
            "Bell palsy is a diagnosis of exclusion; forehead sparing, other neurological signs, bilateral, slow, or recurrent weakness are red flags.",
            "Bulbar palsy is lower motor neuron (wasting, fasciculations); pseudobulbar palsy is bilateral upper motor neuron (brisk jaw jerk, emotional lability).",
          ],
          reviewItemIds: ["m-cnall-forehead", "m-cnall-bell-flags", "m-cnall-pseudobulbar"],
        },
      ],
    },

    // ------------------------------------------------------------------ l-cn-crossed
    {
      id: "l-cn-crossed",
      moduleId: M,
      title: "Crossed brainstem syndromes",
      concept: "A brainstem lesion causes an ipsilateral cranial nerve sign plus a contralateral long tract sign, and which nerve is involved names the level.",
      minutes: 8,
      meta: meta("l-cn-crossed", [...CURR, ...HINTS]),
      steps: [
        {
          kind: "hook",
          title: "One side of the face, the other side of the body",
          body: "A drooping left eyelid and a weak right arm look like two problems. In the brainstem they are one lesion. The named syndromes are just the same rule applied at four levels.",
        },
        {
          kind: "explain",
          title: "Ipsilateral cranial nerve plus contralateral long tract",
          body:
            "A [[crossed-brainstem-syndrome|crossed brainstem syndrome]] pairs a cranial nerve sign on the side of the lesion with a long tract sign on the opposite side. The nerve names the level.\n\n[[weber-syndrome|Weber syndrome]] (ventral midbrain): ipsilateral CN III palsy ([[ptosis|ptosis]], eye down and out, sometimes a dilated pupil) with contralateral [[hemiparesis|hemiparesis]], including the lower face, from the cerebral peduncle.\n\n[[ventral-pontine-syndrome|Ventral pontine syndrome]] (classically Millard-Gubler): ipsilateral lower motor neuron facial palsy, often with an abducens palsy, and contralateral hemiparesis.\n\n[[lateral-medullary-syndrome|Lateral medullary (Wallenberg) syndrome]]: ipsilateral loss of pain and temperature on the face, contralateral loss on the body, ipsilateral [[horner-syndrome|Horner syndrome]], hoarseness and dysphagia, ipsilateral limb [[ataxia|ataxia]], vertigo, and nystagmus. Limb strength is usually normal.\n\n[[medial-medullary-syndrome|Medial medullary syndrome]]: ipsilateral tongue weakness (CN XII), contralateral hemiparesis sparing the face, and contralateral loss of vibration and joint position from the [[medial-lemniscus|medial lemniscus]].",
          layers: {
            simpler: "Find the cranial nerve sign: that is the side and the floor of the lesion. The body signs are on the other side because those wires have not crossed yet.",
            mechanism:
              "In the lateral medulla, the spinal trigeminal nucleus and tract carry pain and temperature from the same side of the face, while the spinothalamic tract carries fibers that already crossed in the cord from the opposite side of the body. Hence the split sensory loss. The nucleus ambiguus (palate, pharynx, larynx), descending sympathetic fibers, vestibular nuclei, and inferior cerebellar peduncle explain the rest.",
            compare:
              "A useful layout: the medial brainstem holds the motor pathway, the medial lemniscus, the medial longitudinal fasciculus, and the nuclei or fibers of III, IV, VI, and XII. The lateral brainstem holds the spinothalamic tract, the trigeminal sensory nucleus, sympathetic fibers, and cerebellar connections. Medial syndromes weaken; lateral syndromes numb, unsteady, and give Horner syndrome.",
            deeper:
              "Lateral medullary stroke (vertebral or posterior inferior cerebellar artery) can present as acute vertigo that mimics an inner ear problem. A careful bedside eye examination (HINTS, taught in the vertigo module) helps detect it, and early diffusion MRI can miss small brainstem strokes. In the midbrain, uncal herniation can also compress CN III and the cerebral peduncle, but with falling consciousness.",
          },
        },
        {
          kind: "animation",
          title: "Crossed signs in the pons",
          animation: "motor-pathway",
          preset: "level",
          caption: "Schematic model of the motor and sensory pathways. The left ventral pons lesion shows the crossed pattern: cranial nerve signs on the left, limb weakness on the right.",
          task: "Select the left ventral pons and read which side of the face is weak and whether the forehead is involved. Then select the left internal capsule and compare the face.",
        },
        { kind: "predict", title: "Name the level", itemId: "m-cnall-weber" },
        { kind: "apply", title: "A split sensory picture", itemId: "m-cnall-wallenberg" },
        {
          kind: "summary",
          title: "Key points",
          points: [
            "Crossed syndrome: ipsilateral cranial nerve sign, contralateral long tract sign; the nerve names the level.",
            "Weber: CN III with contralateral hemiparesis (midbrain).",
            "Ventral pons: CN VII, often VI, with contralateral hemiparesis.",
            "Lateral medulla: face and body pain loss on opposite sides, Horner, hoarseness, ataxia, vertigo, usually no weakness.",
            "Medial medulla: CN XII with contralateral hemiparesis sparing the face and contralateral vibration loss.",
          ],
          reviewItemIds: ["m-cnall-weber", "m-cnall-wallenberg", "m-cnall-crossed-rule"],
        },
      ],
    },
  ],

  items: [
    // ---------------------------------------------------------------- l-cn-levels
    {
      id: "m-cnall-tongue",
      version: 1,
      format: "mcq",
      skill: "localization",
      modules: [M],
      difficulty: 1,
      presentation: "tongue-deviation",
      usage: ["lesson", "review"],
      vignette: "On protrusion the tongue deviates to the right. The right half of the tongue is thin, furrowed, and shows fine twitching.",
      stem: "Which nerve is affected, and is the lesion upper or lower motor neuron?",
      options: [
        { id: "a", text: "Right hypoglossal nerve (CN XII), lower motor neuron", correct: true, feedback: "Wasting and fasciculations are lower motor neuron signs, and a weak half of the tongue lets the tongue point toward that side." },
        { id: "b", text: "Left hypoglossal nerve (CN XII), lower motor neuron", tag: "slip", feedback: "The wasted, twitching half is the right half. A lower motor neuron tongue deviates toward the weak side." },
        { id: "c", text: "Left corticobulbar tract, upper motor neuron", tag: "misconception", feedback: "Upper motor neuron lesions do not cause wasting or fasciculations of the tongue." },
        { id: "d", text: "Right vagus nerve (CN X)", tag: "knowledge-gap", feedback: "The vagus moves the palate and larynx; its weakness shows as nasal or hoarse speech and a uvula pulled away from the weak side." },
      ],
      rationale:
        "Each genioglossus pushes the tongue forward and toward the opposite side. With the right side weak, the left pushes unopposed and the tongue points right. Wasting and [[fasciculation|fasciculations]] mark a lower motor neuron lesion of the right [[hypoglossal-nerve|hypoglossal]] nucleus or nerve.",
      meta: meta("m-cnall-tongue", CURR),
    },
    {
      id: "m-cnall-medial-loc",
      version: 1,
      format: "localization",
      skill: "localization",
      modules: [M],
      difficulty: 2,
      presentation: "tongue-hemiparesis",
      usage: ["lesson", "review", "challenge"],
      vignette:
        "A 67-year-old wakes with weakness of the right arm and leg and a right extensor plantar. The face moves symmetrically. On protrusion the tongue deviates to the left. Vibration and joint position sense are reduced in the right arm and leg; pinprick is normal.",
      stem: "Where is the lesion?",
      correct: ["medulla"],
      partial: [
        { region: "pons", credit: 0.3, feedback: "Crossed signs do mean brainstem, but there is no facial or abducens palsy. The cranial nerve involved is XII, whose nucleus is in the medulla." },
      ],
      rationale:
        "This is a crossed pattern: a left [[hypoglossal-nerve|CN XII]] palsy (the tongue points toward the weak left side) with right hemiparesis and right loss of vibration and position sense. The hypoglossal nucleus and fibers, the pyramid, and the [[medial-lemniscus|medial lemniscus]] lie together in the medial medulla, so this is a left [[medial-medullary-syndrome|medial medullary syndrome]]. The face is spared because the corticobulbar fibers to the facial nucleus have already left at the level of the pons. A left hemisphere lesion would weaken the right lower face and, if it moved the tongue at all, push it toward the weak right side.",
      meta: meta("m-cnall-medial-loc", CURR),
    },
    {
      id: "m-cnall-nuclei-order",
      version: 1,
      format: "order-priority",
      skill: "localization",
      modules: [M],
      difficulty: 1,
      presentation: "nucleus-levels",
      usage: ["lesson", "review"],
      stem: "Order these cranial nerve nuclei from the top of the brainstem to the bottom. Nuclei at the same level (midbrain, pons, medulla) can go in either order.",
      steps: [
        { id: "a", text: "Oculomotor nucleus (CN III)" },
        { id: "b", text: "Trochlear nucleus (CN IV)" },
        { id: "c", text: "Abducens nucleus (CN VI)" },
        { id: "d", text: "Facial motor nucleus (CN VII)" },
        { id: "e", text: "Nucleus ambiguus (CN X, palate and larynx)" },
        { id: "f", text: "Hypoglossal nucleus (CN XII)" },
      ],
      order: [["a", "b"], ["c", "d"], ["e", "f"]],
      rationale:
        "Midbrain: III and IV. Pons: V, VI, VII, and VIII. Medulla: IX, X, XI by convention, and XII. Knowing which floor each nucleus is on turns a cranial nerve sign into a brainstem level.",
      meta: meta("m-cnall-nuclei-order", CURR),
    },
    {
      id: "m-cnall-bedside",
      version: 1,
      format: "multi-select",
      skill: "history-exam",
      modules: [M],
      difficulty: 1,
      presentation: "cn-bedside-tests",
      usage: ["lesson", "review"],
      stem: "Select every correct pairing of a cranial nerve with a bedside test.",
      options: [
        { id: "a", text: "CN I: identify a familiar smell through each nostril separately", correct: true },
        { id: "b", text: "CN V: light touch on forehead, cheek, and jaw, and clench the jaw", correct: true },
        { id: "c", text: "CN VII: raise the eyebrows, squeeze the eyes shut, and show the teeth", correct: true },
        { id: "d", text: "CN XI: shrug the shoulders and turn the head against resistance", correct: true },
        { id: "e", text: "CN XII: say 'ah' and watch the palate rise", tag: "knowledge-gap", feedback: "Palate elevation tests CN X. CN XII moves the tongue: ask the patient to stick it out." },
        { id: "f", text: "CN VIII: test the corneal reflex", tag: "knowledge-gap", feedback: "The corneal reflex uses CN V (sensation) and CN VII (blink). CN VIII is hearing and balance." },
        { id: "g", text: "CN IV: shine a light to test pupil constriction", tag: "knowledge-gap", feedback: "Pupil constriction uses CN II (afferent) and CN III (efferent). CN IV moves the eye down when it is turned in." },
      ],
      rationale:
        "One quick test per nerve: smell (I), acuity, fields, and light response (II), eye movements (III, IV, VI), facial sensation and jaw (V), facial expression (VII), hearing (VIII), palate, voice, and swallow (IX, X), shrug and head turn (XI), tongue protrusion (XII).",
      meta: meta("m-cnall-bedside", CURR),
    },

    // ---------------------------------------------------------------- l-cn-face-bulbar
    {
      id: "m-cnall-forehead",
      version: 1,
      format: "mcq",
      skill: "localization",
      modules: [M],
      difficulty: 1,
      presentation: "facial-droop-arm-drift",
      usage: ["lesson", "review"],
      vignette:
        "A 66-year-old suddenly cannot smile on the right and drools from the right corner of the mouth. He wrinkles both sides of his forehead equally and closes both eyes tightly. His right arm drifts downward when held out.",
      stem: "Where is the lesion?",
      options: [
        { id: "a", text: "Left hemisphere, above the facial nucleus (upper motor neuron)", correct: true, feedback: "Lower face weakness with the forehead spared, plus arm drift on the same side, fits a contralateral upper motor neuron lesion." },
        { id: "b", text: "Right facial nerve (Bell palsy)", tag: "misconception", feedback: "A facial nerve lesion weakens the forehead and eye closure too, and it would not explain the arm drift." },
        { id: "c", text: "Left facial nerve", tag: "slip", feedback: "A left facial nerve lesion would weaken the left side of the face." },
        { id: "d", text: "Right pons", tag: "misconception", feedback: "A right pontine lesion damages the right facial nucleus or fibers (forehead included) and weakens the left limbs." },
      ],
      reasoning: {
        stem: "Which finding best shows that the facial weakness is upper motor neuron?",
        options: [
          { id: "r1", text: "Forehead wrinkling and eye closure are preserved", correct: true },
          { id: "r2", text: "Drooling from the corner of the mouth", feedback: "Any lower face weakness, central or peripheral, can cause drooling." },
          { id: "r3", text: "Sudden onset", feedback: "Sudden onset suggests a vascular cause, but Bell palsy also comes on quickly; tempo does not separate upper from lower motor neuron." },
        ],
      },
      rationale:
        "The upper face part of the facial nucleus receives [[corticobulbar-tract|corticobulbar]] input from both hemispheres, so a unilateral upper motor neuron lesion spares the forehead and eye closure. Arm drift on the same side as the facial weakness places the lesion in the opposite hemisphere.",
      meta: meta("m-cnall-forehead", CURR),
    },
    {
      id: "m-cnall-bell-flags",
      version: 1,
      format: "multi-select",
      skill: "differential",
      modules: [M],
      difficulty: 2,
      presentation: "acute-facial-palsy",
      usage: ["lesson", "review", "challenge"],
      vignette:
        "A 34-year-old woke with the left side of her face drooping. Within a day she could not close the left eye or raise the left eyebrow. She had an ache behind the left ear the day before, and food tastes odd on the left side of her tongue.",
      stem: "Which additional findings would argue against Bell palsy and call for a search for another cause? Select all that apply.",
      options: [
        { id: "a", text: "Small blisters in the left ear canal", correct: true, feedback: "Vesicles suggest Ramsay Hunt syndrome (varicella zoster reactivation)." },
        { id: "b", text: "Weakness of both sides of the face", correct: true, feedback: "Bilateral facial palsy suggests a systemic or meningeal cause such as Guillain-Barre syndrome, Lyme disease, or sarcoidosis." },
        { id: "c", text: "Double vision or numbness of the left face", correct: true, feedback: "Other cranial nerve involvement points to a brainstem, skull base, or meningeal process." },
        { id: "d", text: "Weakness that crept on gradually over several weeks", correct: true, feedback: "Slow progression suggests a compressive or infiltrating lesion such as a tumor." },
        { id: "e", text: "A firm lump in front of the left ear", correct: true, feedback: "A parotid mass can invade the facial nerve." },
        { id: "f", text: "Ordinary sounds seem uncomfortably loud in the left ear", tag: "misconception", feedback: "Hyperacusis fits Bell palsy: the nerve to stapedius leaves the facial nerve within its canal." },
        { id: "g", text: "Pain behind the ear before the weakness", tag: "misconception", feedback: "Ear or mastoid pain commonly comes before Bell palsy." },
        { id: "h", text: "Cannot close the left eye fully", tag: "misconception", feedback: "Poor eye closure is part of complete lower motor neuron facial weakness. It does not argue against Bell palsy, but the eye needs protection." },
      ],
      rationale:
        "[[bell-palsy|Bell palsy]] is acute, unilateral lower motor neuron facial weakness with no identifiable cause, so it is a diagnosis of exclusion made from the history and examination. Altered taste, [[hyperacusis|hyperacusis]], and ear pain fit a lesion in the facial canal. Ear vesicles ([[ramsay-hunt-syndrome|Ramsay Hunt syndrome]]), bilateral weakness, other cranial nerve or limb signs, slow progression, recurrence, or a parotid mass suggest another cause, and forehead sparing points to a central lesion. The guideline also advises reassessment if new neurological signs or eye symptoms appear, or if recovery is incomplete at 3 months.",
      meta: meta("m-cnall-bell-flags", BELL),
    },
    {
      id: "m-cnall-pseudobulbar",
      version: 1,
      format: "free-text",
      skill: "mechanism",
      modules: [M],
      difficulty: 2,
      presentation: "spastic-bulbar",
      usage: ["lesson", "review"],
      vignette:
        "A 72-year-old has had two strokes, one in each hemisphere, months apart. His speech is now slow, strained, and effortful, and he coughs when drinking. The tongue is not wasted and has no fasciculations but moves slowly. The jaw jerk is brisk. He bursts into tears or laughter with little provocation, unlike how he says he feels.",
      stem: "What syndrome is this, and what lesion pattern causes it?",
      placeholder: "Syndrome and lesion pattern",
      answer: {
        full: [
          {
            id: "pseudo",
            label: "Pseudobulbar palsy from bilateral upper motor neuron (corticobulbar) lesions",
            patterns: ["pseudobulbar palsy", "pseudobulbar syndrome", "pseudo bulbar", "bilateral corticobulbar", "bilateral upper motor neuron", "spastic bulbar palsy"],
          },
        ],
        partial: [
          { concept: { id: "affect", label: "Pseudobulbar affect", patterns: ["pseudobulbar affect", "emotional lability", "emotionalism"] }, credit: 0.5, feedback: "That names the emotional feature. The whole picture is pseudobulbar palsy, from corticobulbar lesions in both hemispheres." },
          { concept: { id: "umn", label: "Upper motor neuron", patterns: ["upper motor neuron", "corticobulbar"] }, credit: 0.6, feedback: "Right type of lesion. The key point is that it is bilateral: most bulbar nuclei get input from both hemispheres, so one side alone causes only mild weakness." },
        ],
        wrong: [
          { concept: { id: "bulbar", label: "Bulbar palsy", patterns: ["bulbar palsy", "lower motor neuron", "medulla", "medullary"] }, tag: "misconception", feedback: "Bulbar (lower motor neuron) palsy wastes the tongue, causes fasciculations, and does not make the jaw jerk brisk. This is upper motor neuron." },
          { concept: { id: "mg", label: "Myasthenia gravis", patterns: ["myasthenia"] }, tag: "misconception", feedback: "Myasthenia causes fatigable bulbar weakness but not a brisk jaw jerk or emotional lability." },
        ],
      },
      modelAnswer: "Pseudobulbar palsy, from bilateral upper motor neuron (corticobulbar) lesions above the brainstem.",
      rationale:
        "Most bulbar nuclei receive [[corticobulbar-tract|corticobulbar]] input from both hemispheres, so marked upper motor neuron bulbar weakness needs lesions on both sides. [[pseudobulbar-palsy|Pseudobulbar palsy]] gives spastic [[dysarthria|dysarthria]], [[dysphagia|dysphagia]], a slow, unwasted tongue, a brisk [[jaw-jerk|jaw jerk]], and [[pseudobulbar-affect|pseudobulbar affect]]. [[bulbar|Bulbar]] palsy is the lower motor neuron counterpart, with a wasted, fasciculating tongue.",
      meta: meta("m-cnall-pseudobulbar", CURR),
    },

    // ---------------------------------------------------------------- l-cn-crossed
    {
      id: "m-cnall-weber",
      version: 1,
      format: "mcq",
      skill: "localization",
      modules: [M],
      difficulty: 2,
      presentation: "ptosis-hemiparesis",
      usage: ["lesson", "review", "challenge"],
      vignette:
        "A 70-year-old, fully alert, has sudden drooping of the left eyelid. The left eye rests down and out, and the left pupil is larger than the right. The right arm and leg are weak, and the right lower face droops while the forehead moves normally.",
      stem: "Where is the lesion?",
      options: [
        { id: "a", text: "Left midbrain", correct: true, feedback: "A left CN III palsy with right hemiparesis is Weber syndrome: the third nerve fibers and the cerebral peduncle in the ventral midbrain." },
        { id: "b", text: "Right midbrain", tag: "slip", feedback: "The cranial nerve sign marks the side: the left third nerve is involved, so the lesion is on the left." },
        { id: "c", text: "Left pons", tag: "misconception", feedback: "Pontine crossed syndromes involve CN VI or VII. The third nerve nucleus and fibers are in the midbrain." },
        { id: "d", text: "Left internal capsule", tag: "misconception", feedback: "A left capsular lesion explains the right-sided weakness but cannot cause a left third nerve palsy." },
      ],
      reasoning: {
        stem: "Which finding sets the level at the midbrain?",
        options: [
          { id: "r1", text: "The left third nerve palsy", correct: true },
          { id: "r2", text: "The right hemiparesis", feedback: "Contralateral hemiparesis occurs with a crossed lesion at any brainstem level; it gives the side, not the level." },
          { id: "r3", text: "Right lower face weakness with the forehead spared", feedback: "Upper motor neuron facial weakness occurs with any lesion above the facial nucleus, so it does not pick out the midbrain." },
        ],
      },
      rationale:
        "In a [[crossed-brainstem-syndrome|crossed brainstem syndrome]], the cranial nerve names the level and the side. [[weber-syndrome|Weber syndrome]] damages the [[oculomotor-nerve|CN III]] fibers and the cerebral peduncle, which carries corticospinal and corticobulbar fibers that have not yet crossed. Result: left [[ptosis|ptosis]], a down-and-out eye, and possibly a dilated pupil, with right [[hemiparesis|hemiparesis]] including the right lower face.",
      meta: meta("m-cnall-weber", CURR),
    },
    {
      id: "m-cnall-wallenberg",
      version: 1,
      format: "free-text",
      skill: "localization",
      modules: [M],
      difficulty: 3,
      presentation: "acute-vertigo-split-sensory",
      usage: ["lesson", "review", "challenge"],
      vignette:
        "A 61-year-old develops sudden vertigo, vomiting, and hiccups. Her voice is hoarse and she chokes on water. The left eyelid droops slightly and the left pupil is small. The left arm and leg are clumsy on finger-nose and heel-shin testing, although strength is normal. Pinprick feels dull on the left side of the face and on the right arm, trunk, and leg.",
      stem: "Name the brainstem level and the side of the lesion.",
      placeholder: "Level and side",
      answer: {
        full: [
          {
            id: "left-lat-med",
            label: "Left lateral medulla",
            patterns: ["left lateral medulla", "left lateral medullary", "left medulla", "left medullary", "left wallenberg", "medulla on left", "medullary on left"],
          },
        ],
        partial: [
          { concept: { id: "medulla", label: "Medulla, side not given", patterns: ["lateral medulla", "lateral medullary", "medulla", "medullary", "wallenberg"] }, credit: 0.6, feedback: "Right level. Give the side too: the face sensory loss, Horner syndrome, ataxia, and hoarseness are ipsilateral, so the lesion is on the left." },
          { concept: { id: "pica", label: "Left PICA or vertebral territory", patterns: ["left pica", "left posterior inferior cerebellar", "left vertebral"] }, credit: 0.6, feedback: "Right vessel and side. The question asks for the level: the left lateral medulla." },
        ],
        wrong: [
          { concept: { id: "medial-med", label: "Medial medullary syndrome", patterns: ["medial medulla", "medial medullary", "dejerine"] }, tag: "misconception", feedback: "Right level, wrong part. The medial medulla carries the pyramid, medial lemniscus, and hypoglossal nucleus: tongue weakness with contralateral weakness and vibration loss. Horner syndrome, hoarseness, and split face and body pain loss are lateral medullary signs." },
          { concept: { id: "right-med", label: "Right medulla", patterns: ["right lateral medulla", "right medulla", "right medullary", "right wallenberg"] }, tag: "slip", feedback: "Right level, wrong side. The body pain loss is contralateral; the face, Horner, ataxia, and hoarseness are on the side of the lesion, the left." },
          { concept: { id: "pons", label: "Pons", patterns: ["pons", "pontine"] }, tag: "misconception", feedback: "Hoarseness and dysphagia come from the nucleus ambiguus (CN IX and X), which is in the medulla." },
          { concept: { id: "cbl", label: "Cerebellum", patterns: ["cerebellum", "cerebellar stroke", "cerebellar infarct"] }, tag: "misconception", feedback: "A cerebellar stroke can cause vertigo and ataxia, but not Horner syndrome, hoarseness, or split face and body pain loss." },
          { concept: { id: "mb", label: "Midbrain", patterns: ["midbrain"] }, tag: "misconception", feedback: "Midbrain syndromes involve CN III or IV. These are lower cranial nerve and medullary signs." },
        ],
      },
      modelAnswer: "The left lateral medulla (lateral medullary or Wallenberg syndrome), usually from left vertebral or PICA occlusion.",
      rationale:
        "The ipsilateral signs give the side: left face pain and temperature loss (spinal trigeminal nucleus and tract), left [[horner-syndrome|Horner syndrome]] (descending sympathetic fibers), hoarseness and [[dysphagia|dysphagia]] (nucleus ambiguus), and left limb [[ataxia|ataxia]] (inferior cerebellar peduncle). The contralateral long tract sign is right body pain and temperature loss (the spinothalamic tract, already crossed). Vertigo, vomiting, and [[nystagmus|nystagmus]] come from the vestibular nuclei. Strength is normal because the pyramids lie medially. This [[lateral-medullary-syndrome|lateral medullary syndrome]] can first look like an inner ear problem, so a careful bedside eye examination matters.",
      meta: meta("m-cnall-wallenberg", [...CURR, ...HINTS]),
    },
    {
      id: "m-cnall-crossed-rule",
      version: 1,
      format: "mcq",
      skill: "localization",
      modules: [M],
      difficulty: 1,
      presentation: "crossed-rule",
      usage: ["lesson", "review"],
      stem: "In a crossed brainstem syndrome, which finding tells you the side of the lesion?",
      options: [
        { id: "a", text: "The side of the cranial nerve deficit", correct: true },
        { id: "b", text: "The side of the limb weakness", tag: "misconception", feedback: "Limb weakness is contralateral, because the corticospinal tract crosses below the brainstem lesion in the lower medulla." },
        { id: "c", text: "The side with more sensory loss", tag: "weak-reasoning", feedback: "In lateral medullary syndrome, sensory loss is on both sides (face on the lesion side, body on the other), so it cannot settle the side on its own." },
        { id: "d", text: "The side cannot be told without imaging", tag: "knowledge-gap", feedback: "The examination localizes the side reliably: cranial nerve nuclei and their fibers are ipsilateral to the lesion." },
      ],
      rationale:
        "Cranial nerve nuclei and their fibers serve the same side, so the cranial nerve deficit is [[ipsilateral|ipsilateral]] to the lesion. Long tracts passing the same level are still uncrossed ([[decussation|decussation]] in the lower medulla for the corticospinal tract) or already crossed (spinothalamic tract), so their signs appear on the [[contralateral|contralateral]] body.",
      meta: meta("m-cnall-crossed-rule", CURR),
    },
  ],

  terms: [
    term("corticobulbar-tract", "Corticobulbar tract", ["corticonuclear tract"],
      "The nerve pathway that carries movement commands from the brain to the nerve centers for the face, jaw, throat, and tongue.",
      "Upper motor neuron fibers from motor cortex to motor cranial nerve nuclei in the brainstem. Most bulbar nuclei and the upper face part of the facial nucleus receive input from both hemispheres.",
      "kor-tih-koh-BUL-bar",
      "A left hemisphere stroke damages the corticobulbar fibers to the right lower face, so the forehead is spared.",
      M, ["umn", "corticospinal-tract", "pseudobulbar-palsy"]),
    term("trigeminal-nerve", "Trigeminal nerve", ["CN V", "fifth cranial nerve"],
      "The nerve that carries feeling from the face and moves the chewing muscles.",
      "Cranial nerve V: sensation of the face in three divisions (ophthalmic, maxillary, mandibular), the afferent limb of the corneal reflex, and motor supply to the muscles of mastication. Its sensory nuclei span the brainstem into the upper cervical cord.",
      "try-JEM-ih-nul",
      "Reduced light touch over the left cheek and a weak left jaw clench point to the left trigeminal nerve.",
      M, ["corneal-reflex", "facial-nerve"]),
    term("facial-nerve", "Facial nerve", ["CN VII", "seventh cranial nerve"],
      "The nerve that moves the muscles of facial expression and carries taste from the front of the tongue.",
      "Cranial nerve VII, with its nucleus in the pons: muscles of facial expression, stapedius, taste from the anterior two thirds of the tongue (chorda tympani), and lacrimal and salivary secretion.",
      undefined,
      "Weakness of the whole right face, forehead included, points to the right facial nucleus or nerve.",
      M, ["bell-palsy", "hyperacusis", "corticobulbar-tract"]),
    term("vagus-nerve", "Vagus nerve", ["CN X", "tenth cranial nerve"],
      "The nerve that moves the palate, throat, and voice box, among many other jobs.",
      "Cranial nerve X: motor to the palate, pharynx, and larynx from the nucleus ambiguus in the medulla, the efferent limb of the gag reflex, and parasympathetic supply to thoracic and abdominal organs. With unilateral weakness the uvula deviates away from the weak side.",
      "VAY-gus",
      "A hoarse voice and a palate that rises only on the right point to a left vagus lesion.",
      M, ["gag-reflex", "bulbar", "dysphagia"]),
    term("hypoglossal-nerve", "Hypoglossal nerve", ["CN XII", "twelfth cranial nerve"],
      "The nerve that moves the tongue.",
      "Cranial nerve XII, with its nucleus in the medulla: motor supply to the tongue. A lower motor neuron lesion causes wasting, fasciculations, and deviation of the protruded tongue toward the weak side.",
      "hy-poh-GLOSS-ul",
      "The tongue points to the left and the left half is wasted: left hypoglossal lesion.",
      M, ["medial-medullary-syndrome", "bulbar"]),
    term("anosmia", "Anosmia", ["loss of smell"],
      "Loss of the sense of smell.",
      "Loss of olfaction, tested one nostril at a time. Causes include upper airway disease, head injury, viral infection, neurodegenerative disease, and frontal masses.",
      "an-OZ-mee-uh",
      "She cannot identify coffee or soap with either nostril: bilateral anosmia.",
      M, []),
    term("corneal-reflex", "Corneal reflex", ["blink reflex"],
      "The blink that happens when the clear front of the eye is lightly touched.",
      "A brainstem reflex: touching the cornea causes both eyes to blink. The afferent limb is the trigeminal nerve (V1) and the efferent limb is the facial nerve. It is lost with lesions of either nerve or the pons.",
      "KOR-nee-ul",
      "Touching the left cornea produces no blink in either eye, but touching the right produces both: the left trigeminal afferent is impaired.",
      M, ["trigeminal-nerve", "facial-nerve"]),
    term("gag-reflex", "Gag reflex", ["pharyngeal reflex"],
      "The reflex that makes the throat contract when the back of it is touched.",
      "Touching the posterior pharynx causes pharyngeal contraction and palatal elevation. Afferent limb glossopharyngeal nerve (IX), efferent limb vagus (X). It is reduced in bulbar palsy, preserved or brisk in pseudobulbar palsy, and absent in some healthy people.",
      undefined,
      "The gag is absent on the left and the palate pulls to the right: a left lower cranial nerve lesion.",
      M, ["vagus-nerve", "bulbar"]),
    term("hyperacusis", "Hyperacusis", [],
      "Ordinary sounds seeming uncomfortably loud.",
      "Increased sensitivity to sound. In facial nerve lesions it reflects paralysis of stapedius, which normally damps loud sound, and helps place the lesion within the facial canal.",
      "hy-per-uh-KOO-sis",
      "With her Bell palsy, a closing door sounds painfully loud in the affected ear.",
      M, ["facial-nerve", "bell-palsy"]),
    term("bell-palsy", "Bell palsy", ["Bell's palsy", "idiopathic facial palsy"],
      "Sudden weakness of one whole side of the face from a facial nerve problem with no clear cause.",
      "Acute, unilateral lower motor neuron facial weakness without an identifiable cause, evolving rapidly. A diagnosis of exclusion; forehead sparing, other neurological signs, bilateral or slowly progressive weakness, or recurrence suggest another cause.",
      undefined,
      "She woke with the whole left face weak, forehead included, and no other neurological signs: probable Bell palsy.",
      M, ["facial-nerve", "ramsay-hunt-syndrome", "hyperacusis"]),
    term("ramsay-hunt-syndrome", "Ramsay Hunt syndrome", ["herpes zoster oticus"],
      "Facial weakness with a blistering rash in or around the ear, caused by the chickenpox virus waking up.",
      "Lower motor neuron facial palsy from varicella zoster reactivation in the geniculate ganglion, with vesicles in the ear canal or auricle and sometimes hearing loss or vertigo.",
      undefined,
      "Facial palsy with painful vesicles in the ear canal: Ramsay Hunt syndrome, not Bell palsy.",
      M, ["bell-palsy", "facial-nerve"]),
    term("pseudobulbar-palsy", "Pseudobulbar palsy", ["spastic bulbar palsy"],
      "Stiff, slow speech and swallowing caused by damage to the brain pathways on both sides, not to the nerves themselves.",
      "Upper motor neuron weakness of bulbar muscles from bilateral corticobulbar lesions: spastic dysarthria, dysphagia, a slow tongue without wasting, a brisk jaw jerk, and often pseudobulbar affect.",
      "soo-doh-BUL-bar",
      "After strokes in both hemispheres his speech is strained and his jaw jerk brisk: pseudobulbar palsy.",
      M, ["bulbar", "corticobulbar-tract", "jaw-jerk", "pseudobulbar-affect"]),
    term("pseudobulbar-affect", "Pseudobulbar affect", ["emotional lability", "emotionalism"],
      "Sudden crying or laughing that does not match how the person actually feels.",
      "Episodes of involuntary crying or laughing out of proportion to, or different from, the underlying mood, from disrupted corticobulbar control. Seen with bilateral strokes, multiple sclerosis, and motor neuron disease.",
      undefined,
      "He cries when greeted but says he is not sad: pseudobulbar affect.",
      M, ["pseudobulbar-palsy"]),
    term("jaw-jerk", "Jaw jerk", ["masseter reflex"],
      "A reflex where tapping the chin makes the jaw close.",
      "A stretch reflex of the masseter, mediated by the trigeminal nerve in the pons. Brisk with bilateral upper motor neuron lesions above the pons; a brisk jaw jerk with limb hyperreflexia places upper motor neuron disease above the cervical cord.",
      undefined,
      "A brisk jaw jerk supports pseudobulbar palsy rather than bulbar palsy.",
      M, ["pseudobulbar-palsy", "hyperreflexia"]),
    term("crossed-brainstem-syndrome", "Crossed brainstem syndrome", ["alternating hemiplegia", "crossed signs"],
      "A brainstem problem that affects a cranial nerve on one side and the body on the other side.",
      "An ipsilateral cranial nerve deficit with contralateral long tract signs (weakness or sensory loss). The cranial nerve involved identifies the brainstem level.",
      undefined,
      "Left facial palsy with right hemiparesis is a crossed syndrome of the left pons.",
      M, ["ipsilateral", "contralateral", "weber-syndrome", "lateral-medullary-syndrome"]),
    term("weber-syndrome", "Weber syndrome", ["ventral midbrain syndrome"],
      "A midbrain stroke causing a droopy eye on one side and weakness of the other side of the body.",
      "Ventral midbrain lesion involving the oculomotor fascicle and cerebral peduncle: ipsilateral CN III palsy with contralateral hemiparesis including the lower face.",
      "VAY-ber",
      "Left ptosis with a down-and-out left eye and right hemiparesis: Weber syndrome.",
      M, ["oculomotor-nerve", "crossed-brainstem-syndrome"]),
    term("ventral-pontine-syndrome", "Ventral pontine syndrome", ["Millard-Gubler syndrome"],
      "A pons stroke causing facial weakness on one side and body weakness on the other.",
      "Lesion of the ventral pons involving facial (and often abducens) fibers and the corticospinal tract: ipsilateral lower motor neuron facial palsy, with or without abducens palsy, and contralateral hemiparesis.",
      undefined,
      "Left whole-face weakness, a left abduction deficit, and right hemiparesis: left ventral pontine syndrome.",
      M, ["facial-nerve", "abducens-nerve", "crossed-brainstem-syndrome"]),
    term("lateral-medullary-syndrome", "Lateral medullary syndrome", ["Wallenberg syndrome"],
      "A stroke in the side of the lowest part of the brainstem, causing dizziness, swallowing trouble, and numbness on opposite sides of the face and body.",
      "Infarction of the lateral medulla, usually from vertebral or posterior inferior cerebellar artery occlusion: ipsilateral facial pain and temperature loss, contralateral body pain and temperature loss, ipsilateral Horner syndrome, dysphagia and hoarseness, ipsilateral ataxia, vertigo, and nystagmus, usually without weakness.",
      "WAL-en-berg",
      "Vertigo, hoarseness, a left Horner syndrome, and right body pain loss: left lateral medullary syndrome.",
      M, ["horner-syndrome", "dysphagia", "ataxia", "crossed-brainstem-syndrome"]),
    term("medial-medullary-syndrome", "Medial medullary syndrome", ["Dejerine syndrome"],
      "A stroke in the middle of the lowest part of the brainstem, causing tongue weakness on one side and body weakness on the other.",
      "Infarction of the medial medulla: ipsilateral hypoglossal palsy, contralateral hemiparesis sparing the face (pyramid), and contralateral loss of vibration and joint position sense (medial lemniscus).",
      undefined,
      "The tongue points left and the right arm and leg are weak with poor position sense: left medial medullary syndrome.",
      M, ["hypoglossal-nerve", "medial-lemniscus", "crossed-brainstem-syndrome"]),
    term("medial-lemniscus", "Medial lemniscus", [],
      "The brainstem pathway carrying the senses of vibration and limb position up to the brain.",
      "The crossed continuation of the dorsal column pathway, from the gracile and cuneate nuclei in the lower medulla to the thalamus. Lesions in the brainstem cause contralateral loss of vibration and joint position sense.",
      "MEE-dee-ul lem-NIS-kus",
      "A left medial medullary infarct reduces vibration sense in the right leg.",
      M, ["dorsal-columns", "medial-medullary-syndrome"]),
  ],

  sources: [],
};

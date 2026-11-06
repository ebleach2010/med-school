// Module c-polyneuropathy-radiculopathy: root versus plexus versus nerve, length-dependent
// polyneuropathy and its first-line screen, and mononeuritis multiplex as an urgent pattern.
// Builds on f-localization. Guillain-Barre syndrome and CIDP are taught in c-gbs; this module
// only points to them as reasons a neuropathy is atypical.

import type { ModuleContent } from "./types";
import { meta, term } from "./types";

const M = "c-polyneuropathy-radiculopathy";
const CUR = "safdieh2019-curriculum";
const ENG = "england2009-dsp";
const CAL = "callaghan2015-dsp";
const CTS = "padua2016-cts";
const RAD = "iyer2016-cervical-radiculopathy";
const VASC = "collins2010-nsvn";
const GBS = "vandoorn2023-gbs";
const CIDP = "vandenbergh2021-cidp";

export const CONTENT: ModuleContent | null = {
  moduleId: M,
  module: {
    summary:
      "Separate root, plexus, and single-nerve lesions at the bedside, recognize and screen a length-dependent polyneuropathy, and spot the atypical and urgent patterns, including mononeuritis multiplex.",
    objectives: [
      ["localization", "Distinguish radiculopathy, plexopathy, and mononeuropathy from the distribution of weakness, sensory loss, pain, and reflex change."],
      ["history-exam", "Recognize C6, C7, L5, and S1 radiculopathy, carpal tunnel syndrome, ulnar neuropathy at the elbow, and common fibular neuropathy, and separate the two common causes of foot drop."],
      ["investigation-selection", "Choose a sensible first-line screen for a new length-dependent sensorimotor polyneuropathy."],
      ["differential", "Identify features that make a neuropathy atypical (acute, asymmetric, motor-predominant, non-length-dependent) and recognize mononeuritis multiplex as a reason for urgent evaluation for vasculitis."],
    ],
    prerequisites: ["f-localization"],
    lessons: ["l-root-plexus-nerve", "l-length-dependent-pn", "l-mononeuritis-multiplex"],
    challengeItems: ["m-pnr-l5-footdrop", "m-pnr-upper-trunk", "m-pnr-b12", "m-pnr-redflags", "m-pnr-mm"],
    skills: ["localization", "history-exam", "investigation-selection", "differential"],
    minutes: 28,
    sources: [CUR, ENG, CAL, CTS, RAD, VASC, GBS, CIDP],
  },

  // ---------------------------------------------------------------- Lessons
  lessons: [
    {
      id: "l-root-plexus-nerve",
      moduleId: M,
      title: "Root, plexus, or nerve?",
      concept:
        "A root lesion follows a dermatome and myotome with radiating pain and a reflex change, a plexus lesion spans several roots and nerves in one limb, and a mononeuropathy stays inside one nerve's territory; testing muscles that share a root but not a nerve separates them.",
      minutes: 11,
      meta: meta("l-root-plexus-nerve", [CUR, RAD, CTS]),
      steps: [
        {
          kind: "hook",
          title: "Two foot drops",
          body:
            "Two patients cannot lift the front of the right foot, and both catch their toes on the stairs. One hurt his back lifting a box last week. The other lost a lot of weight after an illness and sits with her legs crossed for hours. One lesion is in a nerve root inside the spine; the other is in a nerve wrapped around the top of the fibula. One muscle test, turning the foot inward, usually tells them apart.",
        },
        {
          kind: "explain",
          title: "Three patterns",
          body:
            "A [[radiculopathy|radiculopathy]] (root lesion) causes pain that shoots along the limb, often worsened by neck or back movement, coughing, or straining. Sensory symptoms follow a [[dermatome|dermatome]], weakness follows a [[myotome|myotome]] (muscles supplied by that root, even though they belong to different nerves), and the reflex served by that root is reduced. Because dermatomes overlap, pain often outweighs measurable numbness.\n\nA [[plexopathy|plexopathy]] involves several roots and several nerves in one limb. The pattern does not fit any single root or any single nerve. Neck or back pain is usually absent, although some plexus disorders are very painful in the shoulder or thigh.\n\nA [[mononeuropathy|mononeuropathy]] stays inside one named nerve's territory: its own sensory patch and only the muscles that nerve supplies. Common sites are where a nerve runs through a tight tunnel or over bone: the median nerve at the wrist, the ulnar nerve at the elbow, and the common fibular (peroneal) nerve at the fibular head.\n\nThe bedside trick: find two muscles that share a root but are supplied by different nerves. If both are weak, think root (or plexus). If only one is weak, think nerve.",
          layers: {
            simpler:
              "Roots are the cables leaving the spine. The plexus is the junction box where cables mix. Nerves are the final wires to the limb. Damage to a cable, the junction box, or one wire each leaves its own pattern of weak muscles and numb skin.",
            mechanism:
              "Each root sends fibers into several nerves through the plexus, and each nerve carries fibers from several roots. So a root lesion produces partial weakness in muscles spread across several nerves, while a nerve lesion weakens every muscle that nerve supplies, regardless of root. The reflex arc runs through a specific root, so a reflex change is a strong root clue; a mononeuropathy changes a reflex only if that nerve carries the reflex.",
            compare:
              "Root versus nerve at a glance. Root: radiating limb pain, worse with spine movement; dermatomal symptoms; weakness across several nerves; reflex change. Nerve: symptoms limited to one nerve's patch, often with a local trigger (pressure, leaning, leg crossing); weakness only in that nerve's muscles; reflexes often normal.",
            deeper:
              "The sensory nerve cell bodies sit in the [[dorsal-root-ganglion|dorsal root ganglion]], just outside the spinal canal. A root lesion usually lies closer to the cord than the ganglion, so the peripheral sensory axons stay connected to their cell bodies and the [[snap|sensory nerve action potential]] on [[nerve-conduction-studies|nerve conduction studies]] stays normal, even in a numb limb. Plexus and nerve lesions lie beyond the ganglion and reduce it. [[electromyography|EMG]] adds another clue: the paraspinal muscles are supplied by branches that leave the root before the plexus, so they show denervation in radiculopathy but not in plexopathy.",
          },
        },
        {
          kind: "explain",
          title: "The classic roots",
          body:
            "C6: pain from the neck to the lateral forearm, thumb, and index finger; weak elbow flexion and wrist extension; reduced biceps and brachioradialis reflexes.\n\nC7: pain to the middle finger; weak elbow extension (triceps), wrist flexion, and finger extension; reduced triceps reflex.\n\nC6 and C7 are the cervical roots most often affected, usually by a disc herniation or bony narrowing of the exit foramen. Turning and extending the neck toward the painful side can reproduce the arm pain.\n\nL5: pain from the buttock down the outer leg to the top of the foot and big toe; weak ankle dorsiflexion, big toe extension, foot inversion and eversion, and hip abduction; usually no reliable reflex change.\n\nS1: pain down the back of the leg to the sole and outer foot; weak plantar flexion (cannot rise on the toes of that foot); reduced or absent ankle reflex.\n\n(For reference: L4 serves the knee reflex and knee extension.) Back pain with saddle numbness, new bladder or bowel dysfunction, or weakness in both legs suggests [[cauda-equina-syndrome|cauda equina syndrome]] and needs emergency imaging.",
          layers: {
            simpler: "Remember the reflexes by number: biceps and brachioradialis 5 and 6, triceps 7, knee 3 and 4, ankle 1 and 2 (S1).",
            mechanism:
              "Discs most often herniate to the side, where they compress the root exiting below them in the neck and the root traversing down to the next level in the lumbar spine. That is why a C5-C6 disc usually affects C6 and an L4-L5 disc usually affects L5.",
            compare:
              "C6 radiculopathy versus carpal tunnel syndrome: both numb the thumb and index finger. Neck pain, forearm numbness, weak elbow flexion or wrist extension, and a reduced biceps or brachioradialis reflex point to C6. Night-time tingling relieved by shaking the hand, numbness sparing the forearm, and weak thumb abduction with normal reflexes point to the median nerve at the wrist.",
            deeper:
              "Most compressive radiculopathies improve with time and conservative care, so imaging is usually reserved for red flags, progressive or severe weakness, or symptoms that persist long enough that a procedure is being considered. A disc bulge on MRI is common in people without symptoms, so imaging findings must match the clinical root level.",
          },
        },
        {
          kind: "explain",
          title: "The classic nerves",
          body:
            "[[carpal-tunnel-syndrome|Carpal tunnel syndrome]] (median nerve at the wrist): tingling and numbness in the thumb, index, middle, and half the ring finger, often waking the patient at night and relieved by shaking the hand. The little finger is spared. Sensation over the thenar eminence is usually spared too, because its branch leaves the median nerve before the tunnel. Later, the thenar muscles waste and thumb abduction weakens. Risk factors include diabetes, hypothyroidism, pregnancy, rheumatoid arthritis, and repetitive hand use. Tapping over the tunnel may reproduce tingling (a [[tinel-sign|Tinel sign]]); nerve conduction studies confirm focal slowing across the wrist.\n\n[[ulnar-neuropathy|Ulnar neuropathy at the elbow]]: numbness of the little finger and the adjacent half of the ring finger, weak finger spreading and wasting between the thumb and index finger, with thumb abduction (median) spared. Leaning on the elbows or prolonged elbow flexion aggravates it.\n\n[[peroneal-neuropathy|Common fibular (peroneal) neuropathy]] at the fibular head: [[foot-drop|foot drop]] with weak ankle dorsiflexion, toe extension, and eversion, and numbness over the top of the foot and outer lower leg. Inversion (tibialis posterior, tibial nerve) and hip abduction (gluteus medius) are normal. Triggers include leg crossing, weight loss, prolonged squatting or kneeling, tight casts, and long immobility.\n\nFoot drop rule: if inversion is weak too, think L5 root; if inversion is strong, think fibular nerve.",
          layers: {
            simpler:
              "Inversion is the key move for foot drop. The fibular nerve lifts the foot and turns it out; it does not turn it in. The L5 root feeds all of those muscles, including the one that turns the foot in.",
            mechanism:
              "The common fibular nerve winds superficially around the neck of the fibula, where it is exposed to pressure. Tibialis posterior is an L5 muscle but is supplied by the tibial nerve, and gluteus medius is an L5 muscle supplied by the superior gluteal nerve, so both are spared in a fibular lesion and both are weak in an L5 lesion.",
            compare:
              "Other foot drop causes: a sciatic nerve lesion (from hip surgery or injection) can mimic a fibular lesion because fibular fibers in the sciatic nerve are especially vulnerable; weakness of knee flexion or plantar flexion, or a reduced ankle reflex, points above the knee. A length-dependent polyneuropathy causes bilateral, gradual foot weakness. A parasagittal brain lesion can rarely cause foot drop with upper motor neuron signs.",
            deeper:
              "In ulnar neuropathy at the elbow, numbness often includes the back of the hand on the ulnar side, because the dorsal cutaneous branch leaves the nerve above the wrist. At the wrist (Guyon canal), the back of the hand is spared. A C8 root lesion instead numbs the inner forearm and weakens median-supplied thumb muscles as well.",
          },
        },
        { kind: "predict", title: "Root or nerve?", itemId: "m-pnr-c6" },
        { kind: "apply", title: "Foot drop with weak inversion", itemId: "m-pnr-l5-footdrop" },
        {
          kind: "summary",
          title: "Key points",
          points: [
            "Root: radiating pain, dermatomal symptoms, myotomal weakness across several nerves, reflex change.",
            "Plexus: several roots and several nerves in one limb, often without spine pain.",
            "Nerve: one nerve's territory only, often with a local pressure trigger.",
            "Reflexes: biceps and brachioradialis C5 to C6, triceps C7, knee L4, ankle S1; L5 has no reliable routine reflex.",
            "Carpal tunnel: thumb to half the ring finger at night, little finger and thenar skin spared, weak thumb abduction.",
            "Foot drop with weak inversion or hip abduction: L5. With normal inversion: common fibular nerve.",
          ],
          reviewItemIds: ["m-pnr-c6", "m-pnr-l5-footdrop", "m-pnr-cts", "m-pnr-reflexes", "m-pnr-upper-trunk", "p-loc-foot-drop"],
        },
      ],
    },
    {
      id: "l-length-dependent-pn",
      moduleId: M,
      title: "Length-dependent polyneuropathy: pattern, causes, and the first screen",
      concept:
        "A slowly progressive, symmetric, distal sensory-predominant neuropathy that starts in the toes is usually axonal, has a short list of common causes that a few blood tests screen for, and anything that departs from this pattern needs a different, often faster, evaluation.",
      minutes: 11,
      meta: meta("l-length-dependent-pn", [ENG, CAL, CUR]),
      steps: [
        {
          kind: "hook",
          title: "Socks that are not there",
          body:
            "A 66-year-old says it feels as if he is always wearing thick socks. It started in his toes two years ago and has crept up to his ankles. He has no diabetes that he knows of. What is happening in his nerves, which few tests are worth sending, and what would make you worry that this is something else?",
        },
        {
          kind: "explain",
          title: "The typical pattern",
          body:
            "A [[length-dependent|length-dependent]] sensorimotor polyneuropathy (also called distal symmetric polyneuropathy) affects the longest axons first. Numbness, tingling, or burning starts in the toes and spreads up the legs over months to years. When symptoms reach about the knees, the fingertips start to be involved: the [[stocking-glove|stocking-glove]] pattern. Ankle reflexes are lost early, while knee reflexes are kept until later. Weakness is mild and late, beginning with toe extension and the small foot muscles.\n\nWhich fibers are involved shapes the symptoms. [[small-fiber-neuropathy|Small-fiber]] involvement causes burning pain and loss of pain and temperature sensation, often with normal reflexes and normal nerve conduction studies (which test only large fibers). Large-fiber involvement causes loss of vibration and position sense, [[areflexia|lost reflexes]], and [[sensory-ataxia|sensory ataxia]] with a positive [[romberg-test|Romberg test]].\n\nMost length-dependent neuropathies are [[axonal|axonal]]: the axon itself degenerates from its far end back toward the cell body.",
          layers: {
            simpler:
              "Every nerve fiber is being damaged a little. The longest fibers, to the toes, have the most length to damage, so they fail first. The fibers to the fingertips are about as long as the fibers to the knee, so the hands join in when the legs are numb to the knees.",
            mechanism:
              "The cell body makes the proteins and organelles the whole axon needs and ships them down the axon. A diffuse metabolic or toxic insult makes that supply line fail first where it is longest: the far end of the longest axons. This is a dying-back axonopathy, and it is why loss of nerve signal amplitude, rather than slowing, is the typical finding.",
            compare:
              "In demyelinating neuropathies the myelin, not the axon, is the main target, so conduction slows or blocks. Acquired demyelinating neuropathies tend to involve proximal as well as distal segments and cause more weakness than a length-dependent axonal neuropathy. Guillain-Barre syndrome and [[cidp|CIDP]] are taught in the GBS module; here they matter as reasons a neuropathy looks atypical.",
            deeper:
              "A non-length-dependent sensory pattern (numbness starting in the hands, the face, or the trunk, or asymmetric from the start, often with marked sensory ataxia) suggests damage to the dorsal root ganglion cell bodies themselves: a sensory [[neuronopathy|neuronopathy]]. Its causes (paraneoplastic disease, Sjogren syndrome, some drugs) differ from those of length-dependent neuropathy.",
          },
        },
        {
          kind: "explain",
          title: "Common causes and the first-line screen",
          body:
            "Common causes:\n\nDiabetes, the most common cause in many countries, and impaired glucose tolerance.\n\nAlcohol use disorder, often with poor nutrition.\n\nVitamin B12 deficiency (for example from pernicious anemia, gastric surgery, long-term metformin, or nitrous oxide misuse), which can also damage the spinal cord.\n\nHypothyroidism and chronic kidney disease.\n\nChemotherapy and other drugs (for example platinum agents, taxanes, vincristine, and bortezomib).\n\n[[monoclonal-gammopathy|Monoclonal gammopathy]] and other plasma cell disorders.\n\nHereditary neuropathy, suggested by very slow progression, high arches and hammer toes, and a family history of foot problems ([[charcot-marie-tooth|Charcot-Marie-Tooth disease]]).\n\nIn a substantial share of patients, no cause is found even after testing.\n\nThe first-line screen in a typical case: fasting glucose or HbA1c (with a glucose tolerance test if these are normal), vitamin B12 (with [[methylmalonic-acid|methylmalonic acid]] when B12 is low-normal), and serum protein electrophoresis with [[immunofixation|immunofixation]]. These three gave the highest yield in the AAN practice parameter. Most clinicians add a blood count, a metabolic panel (kidney and liver function), and thyroid-stimulating hormone.\n\n[[nerve-conduction-studies|Nerve conduction studies]] and [[electromyography|EMG]] confirm the diagnosis, show whether it is axonal or demyelinating, and look for unexpected patterns. In a typical, slowly progressive, symmetric case they do not always change management, but they are important when anything is atypical.",
          layers: {
            simpler:
              "Check sugar, B12, and the blood proteins first. Those three find the most treatable causes. Then add a few common blood tests.",
            mechanism:
              "Immunofixation identifies the type of a monoclonal protein and detects small ones that a standard electrophoresis can miss. Methylmalonic acid rises when B12 is functionally deficient at the tissue level, so it uncovers deficiency hidden by a borderline serum level.",
            compare:
              "Tests usually not needed for a typical length-dependent neuropathy: brain or spine MRI (unless there are upper motor neuron signs or a root pattern), lumbar puncture (reserved for suspected inflammatory demyelinating neuropathy), broad antibody panels, and nerve biopsy.",
            deeper:
              "A monoclonal protein is common in older adults and is not always the cause of the neuropathy. A demyelinating neuropathy with an IgM monoclonal protein, a painful neuropathy with autonomic failure suggesting amyloidosis, or a monoclonal protein with weight loss or other systemic features should prompt hematology and neuromuscular input rather than a label of coincidence.",
          },
        },
        {
          kind: "animation",
          title: "Axonal versus demyelinating",
          animation: "conduction",
          caption:
            "Schematic nerve with simplified compound muscle action potentials. Compare axonal loss (smaller responses, near-normal speed) with demyelination (slowing, dispersion, and block).",
          task: "Select axonal loss and note the response size and timing. Then select demyelination and compare. Which pattern fits a typical diabetic length-dependent neuropathy?",
        },
        {
          kind: "explain",
          title: "When to worry",
          body:
            "The typical pattern is slow, symmetric, distal, sensory-predominant, and starts in the feet. Departures from it are red flags that need faster evaluation, usually with a neurologist:\n\nAcute or [[subacute|subacute]] onset or rapid progression over days to weeks: consider [[guillain-barre-syndrome|Guillain-Barre syndrome]], vasculitis, or a toxin.\n\nAsymmetry or a multifocal pattern: consider [[mononeuritis-multiplex|mononeuritis multiplex]] (next lesson).\n\nMotor-predominant weakness, or proximal weakness: consider an acquired demyelinating neuropathy such as CIDP, or motor neuron disease.\n\nNon-length-dependent onset (hands first, or face or trunk): consider a sensory neuronopathy or CIDP.\n\nProminent [[dysautonomia|autonomic failure]] (for example [[orthostatic-hypotension|orthostatic hypotension]]) with a painful neuropathy: consider amyloidosis.\n\nUpper motor neuron signs alongside the neuropathy: a second process in the cord, such as B12 deficiency or cervical [[myelopathy|myelopathy]].",
          layers: {
            simpler: "Slow, even, feet first, mostly numbness: usually routine. Fast, lopsided, weak more than numb, or hands first: look harder and sooner.",
            mechanism:
              "Diffuse metabolic insults injure all long axons a little at a time, which produces slow, symmetric, distal involvement. Patchy processes, such as ischemia of individual nerves or focal inflammation, injure nerves one at a time or at proximal sites, which produces asymmetry, proximal weakness, or rapid change.",
            compare:
              "Brisk knee reflexes with absent ankle reflexes and extensor plantar responses suggest combined cord and nerve disease. B12 deficiency (including from nitrous oxide) and copper deficiency are the classic treatable causes.",
            deeper:
              "Nerve conduction studies are especially useful when the picture is atypical: demyelinating features (marked slowing, prolonged distal latencies, conduction block) suggest CIDP or a hereditary demyelinating neuropathy; multifocal axonal loss suggests mononeuritis multiplex; normal sensory responses in a numb patient suggest a lesion proximal to the dorsal root ganglion.",
          },
        },
        { kind: "predict", title: "Why the feet first?", itemId: "m-pnr-stocking" },
        { kind: "apply", title: "Choose the first tests", itemId: "m-pnr-dsp-tests" },
        {
          kind: "summary",
          title: "Key points",
          points: [
            "Length-dependent: toes first, fingertips when the legs are numb to about the knees, ankle reflexes lost early.",
            "Most are axonal: lower amplitudes with near-normal conduction velocity.",
            "Common causes: diabetes, alcohol, B12 deficiency, hypothyroidism, kidney disease, chemotherapy, monoclonal gammopathy, hereditary.",
            "First screen: glucose or HbA1c, B12 (with methylmalonic acid if borderline), protein electrophoresis with immunofixation; add blood count, metabolic panel, TSH.",
            "Red flags: acute, asymmetric, motor-predominant, proximal, hands first, prominent autonomic failure, or upper motor neuron signs.",
          ],
          reviewItemIds: ["m-pnr-stocking", "m-pnr-dsp-tests", "m-pnr-redflags", "m-pnr-b12", "m-pnr-axonal"],
        },
      ],
    },
    {
      id: "l-mononeuritis-multiplex",
      moduleId: M,
      title: "Mononeuritis multiplex: the urgent pattern",
      concept:
        "Painful lesions of separate named nerves appearing one after another point to mononeuritis multiplex, whose most important cause is vasculitis, so the pattern calls for prompt evaluation before more nerves infarct.",
      minutes: 6,
      meta: meta("l-mononeuritis-multiplex", [VASC, CAL, CUR]),
      steps: [
        {
          kind: "hook",
          title: "One nerve, then another",
          body:
            "A 61-year-old wakes with a painful numb patch on the top of the left foot and, two days later, a left foot drop. Ten days after that, the right little finger goes numb. Each problem fits a single nerve, but they are different nerves on different limbs, arriving one after another. This is not three bad coincidences.",
        },
        {
          kind: "explain",
          title: "Recognizing the pattern",
          body:
            "[[mononeuritis-multiplex|Mononeuritis multiplex]] means lesions of two or more separate named nerves, usually appearing in steps over days to weeks, often with pain at onset. Common targets include the fibular, tibial, ulnar, median, and radial nerves. As more nerves are added, the deficits can merge and look like an asymmetric or even symmetric polyneuropathy; the history of stepwise, patchy onset is the clue.\n\nThe most important cause is [[vasculitic-neuropathy|vasculitis]]: inflammation of the small arteries that supply nerves, so segments of nerve infarct. It may be part of a systemic vasculitis (for example polyarteritis nodosa, ANCA-associated vasculitis, rheumatoid vasculitis, or cryoglobulinemia linked to hepatitis C) or confined to the peripheral nerves. Other causes include diabetes, infections (such as leprosy, HIV, or hepatitis B or C), sarcoidosis, malignant infiltration, and multiple compressions in a hereditary liability to pressure palsies.",
          layers: {
            simpler: "Each nerve has its own small blood vessels. If those vessels become inflamed and block, patches of nerve die one at a time, so the patient loses one nerve, then another.",
            mechanism:
              "Nerve trunks are most vulnerable to ischemia in watershed zones of their blood supply, such as the mid-thigh and mid-upper arm. An infarcted segment cuts the axons, which then degenerate beyond it ([[wallerian-degeneration|Wallerian degeneration]]), so nerve conduction studies show a patchy, asymmetric axonal pattern.",
            compare:
              "Mononeuritis multiplex versus multiple entrapments: entrapments occur at typical compression sites, usually develop slowly, and are rarely painful at onset. Versus Guillain-Barre syndrome: GBS is symmetric and usually areflexic throughout, with demyelinating or diffuse axonal changes.",
            deeper:
              "The Peripheral Nerve Society guideline separates vasculitis confined to the nerves from systemic vasculitis and recommends looking for systemic disease in every patient. Nerve biopsy, often combined with a muscle biopsy, gives the definite diagnosis and supports months of immunosuppression; corticosteroids are first-line for nonsystemic vasculitic neuropathy, with combination therapy for rapidly progressive disease.",
          },
        },
        {
          kind: "explain",
          title: "Why it is urgent, and what to do",
          body:
            "Each new nerve infarct may leave permanent deficits, and a systemic vasculitis can also damage the kidneys, lungs, gut, and skin. So mononeuritis multiplex is evaluated promptly, not at a routine follow-up months later.\n\nThe usual evaluation includes inflammatory markers (ESR, CRP), blood count, kidney function and urinalysis (looking for blood or protein from glomerulonephritis), glucose or HbA1c, ANCA, antinuclear antibodies, rheumatoid factor, complement, cryoglobulins, hepatitis B and C and HIV serology, and serum protein electrophoresis with immunofixation. [[nerve-conduction-studies|Nerve conduction studies]] and [[electromyography|EMG]] map which nerves are affected and pick a biopsy site. A nerve biopsy (often with muscle) confirms vasculitis before long-term immunosuppression, and the treating team usually involves neurology and rheumatology.",
          layers: {
            simpler: "Think of it like a stroke of the nerves that keeps happening. Find the cause quickly so treatment can stop the next one.",
            mechanism:
              "Systemic vasculitis is a disease of blood vessels throughout the body, so the same process damaging nerves can affect kidney glomeruli or lung capillaries. A urinalysis showing blood and protein can be the first sign of that wider involvement.",
            compare:
              "Typical length-dependent neuropathy: the outpatient screen in the previous lesson, at an ordinary pace. Mononeuritis multiplex: a broader, faster evaluation aimed at vasculitis and other systemic causes.",
            deeper:
              "Diabetes can cause both mononeuropathies and a painful lumbosacral radiculoplexus neuropathy with thigh pain, weight loss, and asymmetric leg weakness. Biopsies in that condition can show microvasculitis, so a diabetic with an asymmetric painful neuropathy still deserves careful evaluation rather than being attributed to ordinary diabetic neuropathy.",
          },
        },
        { kind: "predict", title: "Name the pattern", itemId: "m-pnr-mm" },
        { kind: "apply", title: "What now?", itemId: "m-pnr-mm-next" },
        {
          kind: "summary",
          title: "Key points",
          points: [
            "Mononeuritis multiplex: separate named nerves affected one after another, often painful.",
            "Vasculitis, systemic or confined to nerve, is the cause not to miss.",
            "Evaluate promptly: inflammatory markers, kidney function and urinalysis, ANCA and other serology, nerve studies, and usually nerve biopsy.",
            "Asymmetric, painful, stepwise neuropathy is never ordinary diabetic polyneuropathy by default.",
          ],
          reviewItemIds: ["m-pnr-mm", "m-pnr-mm-next", "m-pnr-redflags"],
        },
      ],
    },
  ],

  // ---------------------------------------------------------------- Items
  items: [
    // ---------------- l-root-plexus-nerve ----------------
    {
      id: "m-pnr-c6",
      version: 1,
      format: "localization",
      skill: "localization",
      modules: [M],
      difficulty: 1,
      presentation: "cervical-radicular-arm-pain",
      usage: ["lesson", "review"],
      vignette:
        "A 47-year-old has had 3 weeks of right neck pain shooting down the outer forearm into the thumb and index finger. Looking up and turning the head to the right makes it worse. Right elbow flexion and wrist extension are mildly weak. The right biceps and brachioradialis reflexes are reduced; other reflexes are normal and plantar responses are flexor. Pinprick is reduced over the right lateral forearm and thumb.",
      stem: "Where is the lesion?",
      correct: ["root"],
      partial: [
        { region: "peripheral-nerve", credit: 0.2, feedback: "Carpal tunnel syndrome also numbs the thumb and index finger, but it spares the forearm, does not weaken elbow flexion or wrist extension, does not change reflexes, and does not cause neck pain." },
        { region: "plexus", credit: 0.3, feedback: "The muscles involved share one root (C6) and the pain is worsened by neck movement, which points to the root rather than the plexus." },
        { region: "cord-cervical", credit: 0.2, feedback: "A cervical cord lesion would add upper motor neuron signs below it, such as brisk leg reflexes or extensor plantars. Here the signs are lower motor neuron and confined to one root level." },
      ],
      rationale:
        "Radiating neck-to-thumb pain worsened by neck movement, weakness of elbow flexion (biceps, musculocutaneous nerve) and wrist extension (radial nerve), and reduced biceps and brachioradialis reflexes follow the C6 [[dermatome|dermatome]] and [[myotome|myotome]] across two different nerves: a C6 [[radiculopathy|radiculopathy]]. Muscles from different nerves that share a root being weak together is the signature of a root lesion.",
      meta: meta("m-pnr-c6", [RAD, CUR]),
    },
    {
      id: "m-pnr-l5-footdrop",
      version: 1,
      format: "mcq",
      skill: "localization",
      modules: [M],
      difficulty: 2,
      presentation: "foot-drop-weak-inversion",
      family: "foot-drop-localization",
      usage: ["lesson", "review", "challenge"],
      vignette:
        "A 52-year-old developed low back pain after lifting a heavy box. Over the next days, pain spread down the back of the left thigh and outer calf to the top of the foot, and his left toes started catching on steps. Left ankle dorsiflexion, big toe extension, foot eversion, foot inversion, and hip abduction are weak. Plantar flexion is strong. Pinprick is reduced over the top of the left foot and outer lower leg. Knee and ankle reflexes are normal and symmetric.",
      stem: "What is the most likely diagnosis?",
      options: [
        { id: "a", text: "Left L5 radiculopathy", correct: true, feedback: "Weak inversion and hip abduction with radiating back pain point to the L5 root." },
        { id: "b", text: "Left common fibular (peroneal) neuropathy at the fibular head", tag: "misconception", feedback: "The fibular nerve does not supply tibialis posterior (inversion) or gluteus medius (hip abduction), so both would be strong in a fibular lesion." },
        { id: "c", text: "Left S1 radiculopathy", tag: "knowledge-gap", feedback: "S1 weakens plantar flexion and reduces the ankle reflex; both are normal here." },
        { id: "d", text: "Left sciatic neuropathy", tag: "weak-reasoning", feedback: "A sciatic lesion would also weaken knee flexion and plantar flexion and often reduce the ankle reflex, and would not weaken hip abduction, whose nerve leaves above the sciatic nerve." },
      ],
      reasoning: {
        stem: "Which finding best separates this from a common fibular neuropathy?",
        options: [
          { id: "r1", text: "Weak foot inversion", correct: true },
          { id: "r2", text: "Weak ankle dorsiflexion", feedback: "Both L5 and fibular lesions weaken dorsiflexion; that is why both cause foot drop." },
          { id: "r3", text: "Numbness over the top of the foot", feedback: "The L5 dermatome and the fibular nerve's territory overlap on the top of the foot, so this does not separate them." },
        ],
      },
      rationale:
        "Both L5 [[radiculopathy|radiculopathy]] and common fibular [[mononeuropathy|mononeuropathy]] cause [[foot-drop|foot drop]] and numbness on the top of the foot. Tibialis posterior (inversion) and gluteus medius (hip abduction) are L5 muscles supplied by the tibial and superior gluteal nerves, outside the fibular nerve, so their weakness places the lesion at the L5 root. Radiating back and leg pain after lifting supports a disc herniation. L5 has no reliable routine reflex, so normal reflexes do not argue against it.",
      meta: meta("m-pnr-l5-footdrop", [CUR]),
    },
    {
      id: "m-pnr-cts",
      version: 1,
      format: "free-text",
      skill: "differential",
      modules: [M],
      difficulty: 1,
      presentation: "nocturnal-hand-paresthesia",
      usage: ["lesson", "review"],
      vignette:
        "A 34-year-old in the third trimester of pregnancy has woken most nights for 6 weeks with tingling in the thumb, index, and middle fingers of both hands, worse on the right, and shakes her hands to relieve it. The little fingers feel normal. She has no neck pain. Sensation over the thenar eminence and forearm is normal. Right thumb abduction is slightly weak. Reflexes are normal. Tapping over the right wrist reproduces the tingling.",
      stem: "What is the most likely diagnosis?",
      placeholder: "Diagnosis",
      answer: {
        full: [
          {
            id: "cts",
            label: "Carpal tunnel syndrome",
            patterns: [
              "carpal tunnel",
              "cts",
              "median neuropathy at the wrist",
              "median nerve compression at the wrist",
              "median nerve entrapment at the wrist",
              "median mononeuropathy at the wrist",
              "median + wrist",
            ],
          },
        ],
        partial: [
          { concept: { id: "median", label: "Median neuropathy without site", patterns: ["median neuropathy", "median nerve", "median mononeuropathy"] }, credit: 0.6, feedback: "Right nerve. Name the site and syndrome: compression of the median nerve at the wrist, carpal tunnel syndrome." },
        ],
        wrong: [
          { concept: { id: "c6", label: "C6 radiculopathy", patterns: ["radiculopathy", "c6", "cervical root", "nerve root"] }, tag: "misconception", feedback: "A C6 root lesion causes neck pain, forearm numbness, and a reduced biceps or brachioradialis reflex. Night-time tingling relieved by shaking, with normal reflexes and forearm sensation, points to the median nerve at the wrist." },
          { concept: { id: "ulnar", label: "Ulnar neuropathy", patterns: ["ulnar", "cubital tunnel", "guyon"] }, tag: "misconception", feedback: "The ulnar nerve supplies the little finger, which is spared here." },
          { concept: { id: "pn", label: "Polyneuropathy", patterns: ["polyneuropathy", "peripheral neuropathy", "stocking glove"] }, tag: "weak-reasoning", feedback: "A length-dependent polyneuropathy starts in the feet and does not respect the median nerve's territory in the hands." },
        ],
      },
      modelAnswer: "Carpal tunnel syndrome: compression of the median nerve at the wrist, here associated with pregnancy.",
      rationale:
        "Nocturnal tingling in the thumb, index, and middle fingers relieved by shaking, sparing of the little finger, and weak thumb abduction fit the median nerve. Normal sensation over the thenar eminence places the lesion at or beyond the wrist, because the palmar cutaneous branch leaves before the carpal tunnel. A [[tinel-sign|Tinel sign]] at the wrist supports it, and pregnancy (fluid retention) is a recognized risk factor. [[carpal-tunnel-syndrome|Carpal tunnel syndrome]] is the most common entrapment neuropathy. [[nerve-conduction-studies|Nerve conduction studies]] confirm focal slowing across the wrist when the diagnosis is uncertain or surgery is considered.",
      meta: meta("m-pnr-cts", [CTS, CUR]),
    },
    {
      id: "m-pnr-reflexes",
      version: 1,
      format: "multi-select",
      skill: "localization",
      modules: [M],
      difficulty: 1,
      presentation: "reflex-root-pairs",
      usage: ["lesson", "review"],
      stem: "Select every correctly matched tendon reflex and the main root it tests.",
      options: [
        { id: "a", text: "Biceps reflex: C5 and C6", correct: true },
        { id: "b", text: "Brachioradialis reflex: C6", correct: true },
        { id: "c", text: "Triceps reflex: C7", correct: true },
        { id: "d", text: "Knee (patellar) reflex: L4", correct: true },
        { id: "e", text: "Ankle reflex: S1", correct: true },
        { id: "f", text: "Ankle reflex: L5", tag: "misconception", feedback: "The ankle reflex tests S1. L5 has no reliable routine reflex, so an L5 radiculopathy often leaves reflexes normal." },
        { id: "g", text: "Triceps reflex: C5", tag: "slip", feedback: "The triceps reflex tests C7; C5 contributes to the biceps reflex." },
        { id: "h", text: "Knee reflex: S1", tag: "slip", feedback: "The knee reflex tests L3 and L4; S1 is tested by the ankle reflex." },
      ],
      rationale:
        "A reduced reflex localizes to the root that carries its arc: biceps C5 to C6, brachioradialis C6, triceps C7, knee L3 to L4, ankle S1. L5 has no reliable routine reflex, which is why an L5 [[radiculopathy|radiculopathy]] is identified by its pattern of weakness (including inversion and hip abduction) rather than by a reflex change.",
      meta: meta("m-pnr-reflexes", [CUR, RAD]),
    },
    {
      id: "m-pnr-upper-trunk",
      version: 1,
      format: "localization",
      skill: "localization",
      modules: [M],
      difficulty: 3,
      presentation: "traumatic-shoulder-arm-weakness",
      usage: ["lesson", "review", "challenge"],
      vignette:
        "A 23-year-old was thrown from a motorcycle and landed on the right shoulder with the head forced to the left. Right shoulder abduction, shoulder external rotation, and elbow flexion are weak, and the brachioradialis is weak. The right biceps and brachioradialis reflexes are absent. Pinprick is reduced over the outer shoulder and lateral forearm. Scapular retraction (rhomboids) is strong and there is no scapular winging (serratus anterior intact). Hand and wrist strength are normal. He has no neck pain.",
      stem: "Where is the lesion?",
      correct: ["plexus"],
      partial: [
        { region: "root", credit: 0.4, feedback: "These muscles are C5 and C6, but the nerves to the rhomboids and serratus anterior branch directly from the roots before the plexus. Their sparing places the lesion beyond the roots, in the upper trunk of the brachial plexus. Root avulsion is still a concern after this injury, and EMG and imaging help exclude it." },
        { region: "peripheral-nerve", credit: 0.2, feedback: "The weak muscles belong to several nerves (axillary, suprascapular, musculocutaneous, radial), so no single nerve explains them." },
        { region: "cord-cervical", credit: 0.1, feedback: "A cord lesion would cause upper motor neuron signs below it. These are lower motor neuron signs confined to one arm." },
      ],
      rationale:
        "Weak shoulder abduction (axillary nerve), external rotation (suprascapular), elbow flexion (musculocutaneous), and brachioradialis (radial) span four nerves but only the C5 and C6 roots: the upper trunk pattern of a brachial [[plexopathy|plexopathy]], typical of traction that widens the angle between head and shoulder. The rhomboids (dorsal scapular nerve) and serratus anterior (long thoracic nerve) are supplied from the roots before they form the trunk, so their sparing places the lesion distal to the roots. On nerve studies the lateral forearm [[snap|sensory response]] would be reduced, because the lesion lies beyond the [[dorsal-root-ganglion|dorsal root ganglion]].",
      meta: meta("m-pnr-upper-trunk", [CUR]),
    },

    // ---------------- l-length-dependent-pn ----------------
    {
      id: "m-pnr-stocking",
      version: 1,
      format: "mcq",
      skill: "mechanism",
      modules: [M],
      difficulty: 1,
      presentation: "stocking-glove-mechanism",
      usage: ["lesson", "review"],
      vignette:
        "A 63-year-old with type 2 diabetes has had numb toes for 3 years. The numbness now reaches the mid-shins. Ankle reflexes are absent; knee reflexes are present.",
      stem: "Why do the feet go numb first, and when would the hands usually be expected to become involved?",
      options: [
        { id: "a", text: "The longest axons fail first; the fingertips are usually involved once leg symptoms reach about the knees", correct: true, feedback: "Fingertip axons are about as long as axons ending near the knee, so the hands join in at that point." },
        { id: "b", text: "The feet bear weight and are compressed; the hands are involved only if the patient uses a cane", tag: "misconception", feedback: "Pressure explains focal entrapments, not a symmetric distal neuropathy." },
        { id: "c", text: "The lumbar roots are damaged first; the hands are involved when the cervical roots are affected", tag: "misconception", feedback: "A root disease would cause dermatomal or proximal deficits, not a symmetric gradient from the toes upward." },
        { id: "d", text: "The feet have poorer blood supply; the hands are involved only if arterial disease develops in the arms", tag: "weak-reasoning", feedback: "Blood supply does not explain the predictable length-related gradient." },
      ],
      rationale:
        "In a [[length-dependent|length-dependent]] neuropathy every axon is affected, but the cell body must supply the whole length of its axon, so the farthest ends of the longest axons fail first: the toes. Axons to the fingertips are roughly as long as those ending near the knee, so hand symptoms usually begin when leg symptoms reach about knee level, producing the [[stocking-glove|stocking-glove]] pattern. The ankle reflex depends on the longest reflex arc, so it is lost early.",
      meta: meta("m-pnr-stocking", [CAL, CUR]),
    },
    {
      id: "m-pnr-dsp-tests",
      version: 1,
      format: "select-tests",
      skill: "investigation-selection",
      modules: [M],
      difficulty: 2,
      presentation: "new-distal-symmetric-neuropathy",
      usage: ["lesson", "review"],
      vignette:
        "A 64-year-old has 18 months of slowly spreading numbness and tingling in both feet, now to just above the ankles. He has no known medical problems, takes no medicines, drinks alcohol rarely, and has had no chemotherapy. Vibration and pinprick are reduced symmetrically in the toes, ankle reflexes are absent, and strength, knee reflexes, and plantar responses are normal. The hands are normal.",
      stem: "Which tests are appropriate for this new length-dependent polyneuropathy?",
      options: [
        { id: "a", label: "Fasting glucose or HbA1c", category: "necessary", why: "Diabetes is the most common cause, and glucose testing is among the highest-yield screening tests." },
        { id: "b", label: "Vitamin B12 level, with methylmalonic acid if the level is low-normal", category: "necessary", why: "B12 deficiency is common and treatable; metabolites uncover deficiency when the serum level is borderline." },
        { id: "c", label: "Serum protein electrophoresis with immunofixation", category: "necessary", why: "Detects a monoclonal protein, one of the highest-yield findings in polyneuropathy screening." },
        { id: "d", label: "Complete blood count and metabolic panel (kidney and liver function)", category: "reasonable", why: "Cheap, widely recommended, and can reveal kidney disease, liver disease, or macrocytosis." },
        { id: "e", label: "Thyroid-stimulating hormone", category: "reasonable", why: "Hypothyroidism is a treatable contributor and is commonly included in the first screen." },
        { id: "f", label: "Oral glucose tolerance test if fasting glucose and HbA1c are normal", category: "reasonable", why: "Can uncover impaired glucose tolerance that the other glucose tests miss." },
        { id: "g", label: "Nerve conduction studies and EMG", category: "reasonable", why: "Confirm the neuropathy and its axonal or demyelinating type; may not change management in a typical case but are useful if anything is atypical." },
        { id: "h", label: "MRI of the brain", category: "unnecessary", why: "Nothing points to the brain; the findings are peripheral." },
        { id: "i", label: "Lumbar puncture", category: "unnecessary", why: "CSF is examined when an inflammatory demyelinating neuropathy is suspected, not in a slow, symmetric, distal sensory neuropathy." },
        { id: "j", label: "Sural nerve biopsy", category: "unnecessary", why: "Invasive, leaves a permanent numb patch, and rarely changes management in a typical length-dependent neuropathy." },
      ],
      rationale:
        "In a typical [[length-dependent|length-dependent]] polyneuropathy, the AAN practice parameter found the highest yield from blood glucose (with glucose tolerance testing), vitamin B12 with metabolites, and serum protein electrophoresis with [[immunofixation|immunofixation]]. A review of distal symmetric polyneuropathy adds a blood count and metabolic panel, and TSH is commonly included. [[nerve-conduction-studies|Nerve conduction studies]] are helpful but not always required when the picture is typical. CSF, imaging, and biopsy are reserved for atypical features.",
      meta: meta("m-pnr-dsp-tests", [ENG, CAL]),
    },
    {
      id: "m-pnr-redflags",
      version: 1,
      format: "multi-select",
      skill: "differential",
      modules: [M],
      difficulty: 2,
      presentation: "atypical-neuropathy-red-flags",
      usage: ["lesson", "review", "challenge"],
      stem: "A patient is referred with \"peripheral neuropathy.\" Select every feature that makes it atypical for a length-dependent sensorimotor polyneuropathy and calls for faster or broader evaluation.",
      options: [
        { id: "a", text: "Numbness and weakness that reached their worst within 2 weeks", correct: true },
        { id: "b", text: "Foot drop on the left only, with a normal right leg", correct: true },
        { id: "c", text: "Weakness much more prominent than sensory loss", correct: true },
        { id: "d", text: "Numbness that began in the hands before the feet", correct: true },
        { id: "e", text: "Early weakness of the hip and shoulder muscles", correct: true },
        { id: "f", text: "Light-headedness on standing with a large blood pressure drop, alongside painful feet", correct: true },
        { id: "g", text: "Slow spread of numbness from the toes to the ankles over 3 years", tag: "misconception", feedback: "Slow, distal, symmetric progression is the typical pattern." },
        { id: "h", text: "Absent ankle reflexes with preserved knee reflexes", tag: "misconception", feedback: "Loss of the ankle reflexes first is expected in a length-dependent neuropathy." },
        { id: "i", text: "Burning feet that are worse at night", tag: "misconception", feedback: "Burning distal pain is common in typical neuropathies with small-fiber involvement, such as diabetic neuropathy." },
        { id: "j", text: "Reduced vibration sense at both big toes", tag: "misconception", feedback: "Distal symmetric large-fiber loss is part of the typical pattern." },
      ],
      rationale:
        "Typical length-dependent neuropathy is slow, symmetric, distal, sensory-predominant, and starts in the feet. Acute or [[subacute|subacute]] onset raises [[guillain-barre-syndrome|Guillain-Barre syndrome]] or vasculitis; asymmetry raises [[mononeuritis-multiplex|mononeuritis multiplex]] or a focal lesion; motor-predominant or proximal weakness raises an acquired demyelinating neuropathy such as [[cidp|CIDP]] or motor neuron disease; hands-first onset raises a sensory [[neuronopathy|neuronopathy]]; and prominent [[dysautonomia|autonomic failure]] with a painful neuropathy raises amyloidosis. Asymmetry, motor predominance, and acute onset are the features a review of distal symmetric polyneuropathy names as reasons for specialist referral.",
      meta: meta("m-pnr-redflags", [CAL, GBS, CIDP]),
    },
    {
      id: "m-pnr-b12",
      version: 1,
      format: "mcq",
      skill: "investigation-selection",
      modules: [M],
      difficulty: 2,
      presentation: "neuropathy-with-umn-signs",
      usage: ["lesson", "review", "challenge"],
      vignette:
        "A 58-year-old has had type 2 diabetes for 12 years, treated with metformin, and an HbA1c that has been near target. Over 8 months she has developed numb feet and unsteadiness in the dark. Vibration and joint position sense are absent at the toes, Romberg test is positive, ankle reflexes are absent, knee reflexes are brisk, and both plantar responses are extensor. Serum B12 is in the low-normal range.",
      stem: "Which test is most useful next?",
      options: [
        { id: "a", text: "Serum methylmalonic acid (with or without homocysteine)", correct: true, feedback: "A raised methylmalonic acid reveals functional B12 deficiency despite a low-normal serum level." },
        { id: "b", text: "Repeat HbA1c and attribute the findings to diabetic neuropathy", tag: "weak-reasoning", feedback: "Diabetic neuropathy does not cause brisk knee reflexes or extensor plantars. Stopping at diabetes misses a treatable second cause." },
        { id: "c", text: "Anti-ganglioside antibody panel", tag: "knowledge-gap", feedback: "Ganglioside antibodies are relevant to some immune neuropathies, not to a combined cord and nerve picture." },
        { id: "d", text: "Sural nerve biopsy", tag: "unsafe-priority", feedback: "Invasive and unhelpful here; a simple blood test can identify the likely cause." },
      ],
      reasoning: {
        stem: "Which finding most strongly argues that diabetes alone does not explain her picture?",
        options: [
          { id: "r1", text: "Brisk knee reflexes and extensor plantar responses", correct: true },
          { id: "r2", text: "Absent ankle reflexes", feedback: "Absent ankle reflexes are expected in diabetic length-dependent neuropathy." },
          { id: "r3", text: "Positive Romberg test", feedback: "Large-fiber diabetic neuropathy can also cause sensory ataxia." },
        ],
      },
      rationale:
        "Absent ankle reflexes with brisk knee reflexes and extensor plantars mean peripheral neuropathy plus [[myelopathy|myelopathy]]: the combined pattern of B12 deficiency (subacute combined degeneration with neuropathy). Long-term metformin use is associated with low B12. A low-normal serum B12 does not exclude deficiency, and the AAN practice parameter recommends B12 testing with metabolites; a raised [[methylmalonic-acid|methylmalonic acid]] confirms functional deficiency. Treatment is replacement, and recovery is better the earlier it starts.",
      meta: meta("m-pnr-b12", [ENG, CUR]),
    },
    {
      id: "m-pnr-axonal",
      version: 1,
      format: "mcq",
      skill: "interpretation",
      modules: [M],
      difficulty: 1,
      presentation: "ncs-length-dependent",
      usage: ["lesson", "review"],
      schematic: { kind: "ncs", pattern: "axonal" },
      vignette:
        "A 70-year-old with diabetes and numb feet has nerve conduction studies. The sural sensory responses are absent and the fibular motor response is small, but conduction velocities are normal or only slightly reduced, and distal latencies are normal. The schematic shows the motor responses.",
      stem: "What pattern do these studies show?",
      options: [
        { id: "a", text: "Length-dependent axonal sensorimotor polyneuropathy", correct: true, feedback: "Low or absent amplitudes with near-normal speed, worst in the legs, is the axonal length-dependent pattern." },
        { id: "b", text: "Demyelinating polyneuropathy", tag: "misconception", feedback: "Demyelination causes marked slowing, prolonged latencies, dispersion, or conduction block; speed is near normal here." },
        { id: "c", text: "Bilateral L5 radiculopathy", tag: "misconception", feedback: "Sensory responses are preserved in radiculopathy because the lesion lies proximal to the dorsal root ganglion; here they are absent." },
        { id: "d", text: "Normal study", tag: "slip", feedback: "Absent sural responses and a small motor response are abnormal." },
      ],
      rationale:
        "In [[axonal|axonal]] neuropathy fewer axons conduct, so response amplitudes fall, while the surviving myelinated axons conduct at nearly normal speed. Abnormalities that are worst in the longest nerves (sural, fibular) fit a [[length-dependent|length-dependent]] process such as diabetic neuropathy. Marked slowing, prolonged distal latencies, or [[conduction-block|conduction block]] would instead suggest [[demyelination|demyelination]], for example CIDP or a hereditary demyelinating neuropathy.",
      meta: meta("m-pnr-axonal", [CAL, CIDP]),
    },

    // ---------------- l-mononeuritis-multiplex ----------------
    {
      id: "m-pnr-mm",
      version: 1,
      format: "free-text",
      skill: "differential",
      modules: [M],
      difficulty: 2,
      presentation: "stepwise-painful-mononeuropathies",
      usage: ["lesson", "review", "challenge"],
      vignette:
        "A 59-year-old has lost 5 kg over 2 months and has had night sweats. Four weeks ago burning pain and numbness began on the top of the right foot, followed within days by a right foot drop. Ten days ago the left little finger went numb and finger spreading on the left became weak. This week the sole of the left foot went numb. The right ankle reflex is reduced; other reflexes are normal. ESR is high.",
      stem: "Name the pattern of nerve involvement and the most important cause to pursue urgently.",
      placeholder: "Pattern and cause",
      answer: {
        full: [
          {
            id: "mm-vasc",
            label: "Mononeuritis multiplex from vasculitis",
            patterns: [
              "mononeuritis multiplex + vasculitis",
              "mononeuritis multiplex + vasculitic",
              "mononeuropathy multiplex + vasculitis",
              "mononeuropathy multiplex + vasculitic",
              "multiple mononeuropathies + vasculitis",
              "multiple mononeuropathies + vasculitic",
              "mononeuritis multiplex + polyarteritis",
              "mononeuritis multiplex + anca",
            ],
          },
        ],
        partial: [
          { concept: { id: "mm", label: "Mononeuritis multiplex without cause", patterns: ["mononeuritis multiplex", "mononeuropathy multiplex", "multiple mononeuropathies", "multifocal neuropathy"] }, credit: 0.6, feedback: "Right pattern. Name the cause to pursue: vasculitis, systemic or confined to the nerves." },
          { concept: { id: "vasc", label: "Vasculitis without the pattern", patterns: ["vasculitis", "vasculitic neuropathy", "polyarteritis"] }, credit: 0.6, feedback: "Right cause. Name the pattern too: mononeuritis multiplex, separate nerves affected one after another." },
        ],
        wrong: [
          { concept: { id: "dsp", label: "Length-dependent polyneuropathy", patterns: ["length dependent", "stocking glove", "distal symmetric", "diabetic neuropathy"] }, tag: "misconception", feedback: "The deficits are asymmetric and fit separate named nerves (fibular, ulnar, tibial) appearing in steps, not a symmetric gradient from the toes." },
          { concept: { id: "gbs", label: "Guillain-Barre syndrome", patterns: ["guillain barre"] }, tag: "misconception", feedback: "GBS causes symmetric weakness with widespread areflexia, not stepwise lesions of individual nerves." },
          { concept: { id: "rad", label: "Radiculopathy", patterns: ["radiculopathy", "nerve root"] }, tag: "weak-reasoning", feedback: "The territories are those of named nerves on different limbs, not dermatomes, and there is no spine pain." },
        ],
      },
      modelAnswer: "Mononeuritis multiplex (right fibular, left ulnar, and left tibial nerves), most urgently from vasculitis.",
      rationale:
        "Painful lesions of separate named nerves (right common fibular, left ulnar, left tibial) arriving one after another are [[mononeuritis-multiplex|mononeuritis multiplex]]. With weight loss, night sweats, and a high ESR, a [[vasculitic-neuropathy|vasculitic neuropathy]], possibly part of a systemic vasculitis, is the leading concern. Inflamed vasa nervorum cause nerve infarcts, so further nerves can be lost while the evaluation waits.",
      meta: meta("m-pnr-mm", [VASC, CUR]),
    },
    {
      id: "m-pnr-mm-next",
      version: 1,
      format: "mcq",
      skill: "investigation-selection",
      modules: [M],
      difficulty: 2,
      presentation: "suspected-vasculitic-neuropathy",
      usage: ["lesson", "review"],
      vignette:
        "The patient with stepwise right fibular, left ulnar, and left tibial neuropathies, weight loss, and a high ESR is seen in clinic. Blood pressure is normal. He is walking with a foot drop.",
      stem: "Which plan is most appropriate?",
      options: [
        {
          id: "a",
          text: "Prompt evaluation this week: CRP, blood count, kidney function and urinalysis, ANCA, hepatitis B and C serology, cryoglobulins, protein electrophoresis, nerve conduction studies with EMG, and referral for nerve biopsy",
          correct: true,
          feedback: "This looks for systemic vasculitis and its organ involvement, maps the nerves, and sets up tissue confirmation before long-term immunosuppression.",
        },
        { id: "b", text: "Start a neuropathic pain medicine and review in 3 months", tag: "unsafe-priority", feedback: "Treating pain alone lets more nerves infarct and may miss kidney or lung involvement from systemic vasculitis." },
        { id: "c", text: "MRI of the cervical and lumbar spine to look for multilevel radiculopathy", tag: "weak-reasoning", feedback: "The deficits follow named nerves on different limbs, not roots, and imaging the spine delays the evaluation that matters." },
        { id: "d", text: "Admit for intravenous immunoglobulin as for Guillain-Barre syndrome", tag: "misconception", feedback: "The pattern is asymmetric and stepwise, not the symmetric ascending weakness of GBS." },
      ],
      rationale:
        "Suspected [[vasculitic-neuropathy|vasculitic neuropathy]] needs a prompt search for systemic vasculitis (inflammatory markers, kidney function and urinalysis, ANCA, hepatitis serology, cryoglobulins) and other causes of [[mononeuritis-multiplex|mononeuritis multiplex]], [[nerve-conduction-studies|nerve conduction studies]] and [[electromyography|EMG]] to map the multifocal axonal damage and choose a biopsy site, and usually a nerve (often with muscle) biopsy to confirm vasculitis before months of immunosuppression. The Peripheral Nerve Society guideline recommends corticosteroids first for vasculitis confined to the nerves, with combination therapy for rapidly progressive disease; treatment is directed by the specialist team.",
      meta: meta("m-pnr-mm-next", [VASC, CUR]),
    },
  ],

  // ---------------------------------------------------------------- Terms
  terms: [
    term("carpal-tunnel-syndrome", "Carpal tunnel syndrome", ["CTS", "median neuropathy at the wrist"],
      "Pressure on the median nerve at the wrist, causing tingling in the thumb and first fingers, often at night.",
      "Entrapment of the median nerve in the carpal tunnel: paresthesias of the thumb, index, middle, and radial half of the ring finger, typically nocturnal, with later thenar wasting and weak thumb abduction; the little finger and thenar skin are spared.",
      undefined,
      "She wakes at night shaking her hand to relieve tingling in the first three fingers: carpal tunnel syndrome.",
      M, ["mononeuropathy", "tinel-sign", "nerve-conduction-studies"]),
    term("ulnar-neuropathy", "Ulnar neuropathy", ["ulnar neuropathy at the elbow", "cubital tunnel syndrome"],
      "Damage to the ulnar nerve, usually at the elbow, numbing the little finger and weakening the hand.",
      "Mononeuropathy of the ulnar nerve, most often at the elbow: sensory loss in the little finger and ulnar half of the ring finger (often the ulnar back of the hand), and weakness of the interossei and hypothenar muscles with median-supplied thumb muscles spared.",
      "UL-nar",
      "Numb little finger and weak finger spreading after weeks of leaning on his elbows: ulnar neuropathy.",
      M, ["mononeuropathy", "radiculopathy"]),
    term("peroneal-neuropathy", "Common fibular (peroneal) neuropathy", ["fibular neuropathy", "common peroneal neuropathy", "peroneal palsy"],
      "Damage to the nerve that wraps around the outside of the knee, causing foot drop.",
      "Mononeuropathy of the common fibular nerve, usually from compression at the fibular head: weak ankle dorsiflexion, toe extension, and eversion with sensory loss over the dorsum of the foot and lateral leg, sparing inversion and hip abduction.",
      "per-oh-NEE-ul",
      "Foot drop after weeks of sitting cross-legged, with normal inversion: common fibular neuropathy.",
      M, ["foot-drop", "mononeuropathy", "radiculopathy"]),
    term("tinel-sign", "Tinel sign", ["Tinel's sign"],
      "Tingling felt along a nerve when the spot where it is squeezed is tapped.",
      "Paresthesias in a nerve's distribution produced by tapping over a site of nerve entrapment or regeneration, such as the carpal tunnel; supportive but not diagnostic.",
      "tih-NEL",
      "Tapping over her wrist sends tingling into her index finger: a Tinel sign.",
      M, ["carpal-tunnel-syndrome"]),
    term("dorsal-root-ganglion", "Dorsal root ganglion", ["DRG", "sensory ganglion"],
      "A cluster of sensory nerve cell bodies just outside the spine.",
      "The ganglion on each dorsal root, just outside the spinal canal, containing the cell bodies of primary sensory neurons. Lesions proximal to it (radiculopathy) preserve peripheral sensory nerve action potentials; lesions distal to it (plexus, nerve) reduce them.",
      undefined,
      "His numb hand had normal sensory responses, placing the lesion proximal to the dorsal root ganglion.",
      M, ["radiculopathy", "snap", "neuronopathy"]),
    term("snap", "Sensory nerve action potential", ["SNAP", "sensory response"],
      "The electrical signal recorded from a sensory nerve during nerve conduction testing.",
      "The compound action potential recorded from a sensory nerve after stimulation. Its amplitude falls with axonal loss distal to the dorsal root ganglion and is preserved in radiculopathy.",
      undefined,
      "The absent sural SNAP fits an axonal length-dependent neuropathy.",
      M, ["nerve-conduction-studies", "dorsal-root-ganglion", "cmap"]),
    term("electromyography", "Electromyography", ["EMG", "needle EMG"],
      "A test that records the electrical activity of muscles through a fine needle.",
      "Needle recording of muscle electrical activity at rest and during contraction, showing denervation and reinnervation; with nerve conduction studies it localizes lesions to the root, plexus, nerve, or muscle.",
      "ee-lek-troh-my-OG-ruh-fee",
      "EMG showed denervation in L5 muscles and the lumbar paraspinals: an L5 radiculopathy.",
      M, ["nerve-conduction-studies", "radiculopathy"]),
    term("small-fiber-neuropathy", "Small-fiber neuropathy", ["small fibre neuropathy"],
      "Damage to the thinnest nerve fibers, causing burning pain and loss of pain and temperature feeling.",
      "Neuropathy of thinly myelinated and unmyelinated fibers, causing burning pain, reduced pinprick and temperature sensation, and sometimes autonomic symptoms, often with normal reflexes, strength, and nerve conduction studies.",
      undefined,
      "Burning feet with normal reflexes and normal nerve conduction studies suggest a small-fiber neuropathy.",
      M, ["length-dependent", "nerve-conduction-studies"]),
    term("monoclonal-gammopathy", "Monoclonal gammopathy", ["paraprotein", "M protein", "MGUS"],
      "An abnormal protein in the blood made by a single group of plasma cells.",
      "A monoclonal immunoglobulin (paraprotein) in serum or urine, ranging from monoclonal gammopathy of undetermined significance to myeloma, amyloidosis, and related disorders; some types are associated with neuropathy.",
      "gam-OP-uh-thee",
      "Immunofixation showed an IgM monoclonal gammopathy in a man with a demyelinating neuropathy.",
      M, ["immunofixation", "neuropathy"]),
    term("immunofixation", "Immunofixation", ["immunofixation electrophoresis", "serum immunofixation"],
      "A blood test that identifies the type of an abnormal protein made by plasma cells.",
      "An electrophoresis-based test that identifies the heavy and light chain type of a monoclonal protein and detects small paraproteins that serum protein electrophoresis can miss.",
      undefined,
      "Protein electrophoresis looked normal, but immunofixation found a small IgG lambda paraprotein.",
      M, ["monoclonal-gammopathy"]),
    term("methylmalonic-acid", "Methylmalonic acid", ["MMA"],
      "A substance that builds up in the blood when the body is short of vitamin B12.",
      "A metabolite that accumulates when vitamin B12 is functionally deficient; raised levels support deficiency when serum B12 is low-normal.",
      "meth-il-muh-LOH-nik",
      "Her B12 was low-normal, but methylmalonic acid was high: functional B12 deficiency.",
      M, ["neuropathy", "myelopathy"]),
    term("charcot-marie-tooth", "Charcot-Marie-Tooth disease", ["CMT", "hereditary motor and sensory neuropathy"],
      "An inherited nerve disease that slowly weakens the feet and lower legs.",
      "A group of inherited neuropathies, demyelinating or axonal, with slowly progressive distal weakness and wasting, sensory loss, high arches, and hammer toes, often with a family history.",
      "shar-KOH mah-REE TOOTH",
      "High arches, hammer toes, and a father with the same thin calves suggest Charcot-Marie-Tooth disease.",
      M, ["length-dependent", "neuropathy"]),
    term("cidp", "Chronic inflammatory demyelinating polyradiculoneuropathy", ["CIDP"],
      "A long-lasting immune attack on nerve insulation that causes weakness and numbness.",
      "An immune-mediated demyelinating neuropathy progressing over more than 8 weeks, typically with symmetric proximal and distal weakness, sensory loss, and reduced reflexes; taught in the GBS module.",
      undefined,
      "Weakness of the hips and hands progressing for 4 months with absent reflexes suggested CIDP.",
      M, ["demyelination", "guillain-barre-syndrome"]),
    term("mononeuritis-multiplex", "Mononeuritis multiplex", ["mononeuropathy multiplex", "multiple mononeuropathies"],
      "Damage to several separate nerves, often one after another.",
      "Simultaneous or sequential lesions of two or more separate named nerves, often painful and asymmetric; the most important cause is vasculitis, and others include diabetes, infection, sarcoidosis, and infiltration.",
      "mon-oh-nyoo-RY-tis MUL-tih-pleks",
      "A right foot drop followed by a numb left little finger: mononeuritis multiplex.",
      M, ["vasculitic-neuropathy", "mononeuropathy"]),
    term("vasculitic-neuropathy", "Vasculitic neuropathy", ["nerve vasculitis", "nonsystemic vasculitic neuropathy"],
      "Nerve damage caused by inflamed blood vessels that cut off the nerve's blood supply.",
      "Ischemic axonal neuropathy from inflammation of the vasa nervorum, as part of a systemic vasculitis or confined to the peripheral nerves, usually presenting as painful mononeuritis multiplex or an asymmetric neuropathy.",
      "vas-kyoo-LIT-ik",
      "Nerve biopsy confirmed a vasculitic neuropathy in a man with stepwise painful mononeuropathies.",
      M, ["mononeuritis-multiplex", "axonal"]),
  ],

  // ---------------------------------------------------------------- Sources
  sources: [
    {
      id: "england2009-dsp",
      kind: "guideline",
      citation:
        "England JD, Gronseth GS, Franklin G, et al. Practice Parameter: evaluation of distal symmetric polyneuropathy: role of laboratory and genetic testing (an evidence-based review). Report of the American Academy of Neurology, American Association of Neuromuscular and Electrodiagnostic Medicine, and American Academy of Physical Medicine and Rehabilitation. Neurology. 2009;72(2):185-192. doi:10.1212/01.wnl.0000336370.51010.a1",
      title: "Practice Parameter: evaluation of distal symmetric polyneuropathy: role of laboratory and genetic testing (an evidence-based review)",
      authors: "England JD, Gronseth GS, Franklin G, et al.",
      journal: "Neurology",
      year: 2009,
      doi: "10.1212/01.wnl.0000336370.51010.a1",
      pmid: "19056666",
      url: "https://doi.org/10.1212/01.wnl.0000336370.51010.a1",
      lastVerified: "2026-11-06",
      verificationNote:
        "Title, lead author, journal, year, volume, issue, pages, DOI, and PMID 19056666 confirmed on 2026-11-06 from web search results indexing the AAN and AANEM guideline pages and an institutional PubMed-derived record (Weill Cornell VIVO). A companion version with the same title appeared in Muscle Nerve 2009 (PMID 19086068); this entry is the Neurology version. The AANEM page notes reaffirmation in 2025. Co-author names after the lead author were not individually confirmed, and PubMed itself cannot be opened from this environment; open the DOI link once to confirm.",
      verified: true,
    },
    {
      id: "callaghan2015-dsp",
      kind: "review",
      citation: "Callaghan BC, Price RS, Feldman EL. Distal symmetric polyneuropathy: a review. JAMA. 2015;314(20):2172-2181. doi:10.1001/jama.2015.13611",
      title: "Distal symmetric polyneuropathy: a review",
      authors: "Callaghan BC, Price RS, Feldman EL",
      journal: "JAMA",
      year: 2015,
      doi: "10.1001/jama.2015.13611",
      pmid: "26599185",
      url: "https://doi.org/10.1001/jama.2015.13611",
      lastVerified: "2026-11-06",
      verificationNote:
        "Title, authors, journal, year, volume, pages, DOI, and PMID 26599185 confirmed on 2026-11-06 from web search results indexing PubMed Central (author manuscript PMC5125083) and library catalog records. The abstract as indexed supports the first-line screen (blood count, metabolic panel, B12, protein electrophoresis with immunofixation, fasting glucose, glucose tolerance test) and referral for asymmetry, motor predominance, or acute onset. PubMed itself cannot be opened from this environment; open the DOI link once to confirm.",
      verified: true,
    },
    {
      id: "padua2016-cts",
      kind: "review",
      citation: "Padua L, Coraci D, Erra C, et al. Carpal tunnel syndrome: clinical features, diagnosis, and management. Lancet Neurol. 2016;15(12):1273-1284. doi:10.1016/S1474-4422(16)30231-9",
      title: "Carpal tunnel syndrome: clinical features, diagnosis, and management",
      authors: "Padua L, Coraci D, Erra C, Pazzaglia C, Paolasso I, Loreti C, Caliandro P, Hobson-Webb LD",
      journal: "Lancet Neurology",
      year: 2016,
      doi: "10.1016/S1474-4422(16)30231-9",
      pmid: "27751557",
      url: "https://doi.org/10.1016/S1474-4422(16)30231-9",
      lastVerified: "2026-11-06",
      verificationNote:
        "Title, authors, journal, year, volume, issue, pages, and DOI confirmed on 2026-11-06 from web search results indexing university repositories (Universita Cattolica, Duke Scholars) and library records. PMID 27751557 was seen only in a citing record and not on PubMed, which cannot be opened from this environment; confirm it. A 2023 update by the same group exists (Lancet Neurol 2023;22(3):255-267).",
      verified: true,
    },
    {
      id: "iyer2016-cervical-radiculopathy",
      kind: "review",
      citation: "Iyer S, Kim HJ. Cervical radiculopathy. Curr Rev Musculoskelet Med. 2016;9(3):272-280. doi:10.1007/s12178-016-9349-4",
      title: "Cervical radiculopathy",
      authors: "Iyer S, Kim HJ",
      journal: "Current Reviews in Musculoskeletal Medicine",
      year: 2016,
      doi: "10.1007/s12178-016-9349-4",
      pmid: "27250042",
      url: "https://doi.org/10.1007/s12178-016-9349-4",
      lastVerified: "2026-11-06",
      verificationNote:
        "Title, authors, journal, year, volume, issue, pages, DOI, PMID 27250042, and PMCID PMC4958381 confirmed on 2026-11-06 from web search results indexing PubMed and PubMed Central records. PubMed itself cannot be opened from this environment and the article was not opened directly; open the DOI link once to confirm before relying on details.",
      verified: true,
    },
    {
      id: "collins2010-nsvn",
      kind: "guideline",
      citation:
        "Collins MP, Dyck PJ, Gronseth GS, et al. Peripheral Nerve Society Guideline on the classification, diagnosis, investigation, and immunosuppressive therapy of non-systemic vasculitic neuropathy: executive summary. J Peripher Nerv Syst. 2010;15(3):176-184. doi:10.1111/j.1529-8027.2010.00281.x",
      title: "Peripheral Nerve Society Guideline on the classification, diagnosis, investigation, and immunosuppressive therapy of non-systemic vasculitic neuropathy: executive summary",
      authors: "Collins MP, Dyck PJ, Gronseth GS, Guillevin L, Hadden RD, Heuss D, Leger JM, Notermans NC, Pollard JD, Said G, Sobue G, Vrancken AF, Kissel JT",
      journal: "Journal of the Peripheral Nervous System",
      year: 2010,
      doi: "10.1111/j.1529-8027.2010.00281.x",
      pmid: "21040139",
      url: "https://doi.org/10.1111/j.1529-8027.2010.00281.x",
      lastVerified: "2026-11-06",
      verificationNote:
        "Title, authors, journal, year, volume, issue, pages, and DOI confirmed on 2026-11-06 from web search results indexing the UMC Utrecht research repository, a QxMD record, and library catalogs. PMID 21040139 comes from the QxMD record and was not confirmed on PubMed, which cannot be opened from this environment. The abstract as indexed supports corticosteroid monotherapy first-line and combination therapy for rapidly progressive disease. This guideline is from 2010; check for a newer revision.",
      verified: true,
    },
  ],
};

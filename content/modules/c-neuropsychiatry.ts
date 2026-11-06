// Module c-neuropsychiatry: neuropsychiatric presentations and medical mimics. Recognizing the
// red flags that suggest a medical or neurological cause for psychiatric symptoms, a sensible
// first workup, and the specific patterns (NMDA receptor encephalitis, catatonia, frontal
// syndromes and bvFTD, temporal lobe seizures, medication and substance causes) at a
// recognition level, with links to the modules that teach each disease in depth.

import type { ModuleContent } from "./types";
import { meta, term } from "./types";

const M = "c-neuropsychiatry";
const AP = "pollak2020-autoimmune-psychosis";
const CAT = "rogers2023-catatonia";
const AE = "graus2016-ae";
const DALMAU = "dalmau2018-nejm";
const NMDAR = "titulaer2013-nmdar";
const CAM = "inouye1990-cam";
const FTD = "rascovsky2011-bvftd";
const NMS = "berman2011-nms";
const ILAE = "fisher2017-seizure-classification";
const DLB = "mckeith2017-dlb";
const SS = "boyer2005-serotonin";
const WE = "sechi2007-wernicke";
const CURR = "safdieh2019-curriculum";

export const CONTENT: ModuleContent = {
  moduleId: M,
  module: {
    title: "Neuropsychiatric presentations and medical mimics",
    summary: "Noticing when psychiatric symptoms have a medical or neurological cause: the red flags, a sensible first workup and when to add MRI, EEG, or lumbar puncture, and recognition of delirium, NMDA receptor encephalitis, catatonia, frontal syndromes and bvFTD, temporal lobe seizures, and medication and substance causes.",
    objectives: [
      ["differential", "Identify red flags that suggest a medical or neurological cause for psychiatric symptoms, including atypical age, rapid onset, fluctuating attention, visual hallucinations, focal signs, seizures, catatonia, abnormal movements, autonomic instability, fever, cancer, immunosuppression, and substance use."],
      ["investigation-selection", "Choose a first workup for new psychiatric symptoms and decide when MRI, EEG, or lumbar puncture should be added."],
      ["differential", "Recognize delirium and anti-NMDA receptor encephalitis when they present as a psychiatric illness."],
      ["emergency", "Recognize catatonia, treat it first with a benzodiazepine while searching for medical causes, and use antipsychotics with caution because of neuroleptic malignant syndrome."],
      ["history-exam", "Recognize personality change from frontal syndromes and bvFTD, the psychic auras of temporal lobe seizures, and medication and substance causes of psychiatric symptoms."],
    ],
    prerequisites: ["c-autoimmune-encephalitis"],
    lessons: ["l-organic-red-flags", "l-neuropsych-patterns"],
    challengeItems: ["m-neuropsych-late-psychosis", "m-neuropsych-nmdar", "m-neuropsych-catatonia", "m-neuropsych-bvftd"],
    skills: ["differential", "investigation-selection", "emergency", "history-exam"],
    minutes: 18,
    sources: [AP, CAT, AE, DALMAU, NMDAR, CAM, FTD, NMS, ILAE, DLB, SS, WE, CURR],
  },
  lessons: [
    {
      id: "l-organic-red-flags",
      moduleId: M,
      title: "Red flags: when psychiatric symptoms have a medical cause",
      concept: "Psychiatric symptoms can be the first sign of a medical or neurological illness. A short list of red flags tells you when to look harder, and a basic workup, extended with MRI, EEG, or lumbar puncture when the picture calls for it, finds most treatable causes.",
      minutes: 9,
      meta: meta("l-organic-red-flags", [AP, CAM, AE, CURR]),
      steps: [
        {
          kind: "hook",
          title: "A first psychosis at 58",
          body: "A 58-year-old school administrator with no psychiatric history is brought in by her husband. For six weeks she has believed that the neighbors are watching the house, and at night she sees small children sitting in the living room. She was referred straight to the psychiatry clinic. What about her story should make you pause before anyone settles on a primary psychotic disorder?",
        },
        {
          kind: "explain",
          title: "The red flags",
          body:
            "Most people with psychiatric symptoms have a primary psychiatric disorder, and those disorders are real brain illnesses that deserve full treatment. But some presentations are caused by another medical or neurological process, often called a secondary or \"organic\" cause, and some of those causes are treatable and dangerous if missed. The two are not mutually exclusive: a person with long-standing schizophrenia can develop encephalitis, and attributing every new symptom to the known psychiatric diagnosis ([[diagnostic-overshadowing|diagnostic overshadowing]]) is a common route to a missed diagnosis.\n\nRed flags for a medical or neurological cause:\n\n- Age: a first episode after about 40 to 50, or in childhood, outside the usual age of onset for the disorder it resembles.\n- Onset: acute or subacute, over days to weeks, in someone who was previously well.\n- Fluctuating attention or level of consciousness: this is [[delirium|delirium]] until proved otherwise.\n- [[hallucination|Visual hallucinations]] (and olfactory or tactile ones), which are less typical of primary psychosis than auditory ones.\n- Focal neurological signs, new headache, or a new cognitive decline.\n- Seizures or unexplained episodes of staring or unresponsiveness.\n- [[catatonia|Catatonia]], abnormal movements such as [[orofacial-dyskinesia|orofacial dyskinesias]] or [[chorea|chorea]], and [[dysautonomia|autonomic instability]].\n- Fever, a viral-like [[prodrome|prodrome]], or other systemic symptoms.\n- A history of cancer, immunosuppression, or HIV.\n- Substance use, a new medicine, or withdrawal.\n- A poor response to, or poor tolerance of, standard psychiatric treatment, such as severe side effects from antipsychotics.\n\nOne red flag is a reason to look more carefully, not a diagnosis. Several together, or one strong one such as a seizure or fluctuating consciousness, call for a deliberate search for a cause.",
          layers: {
            simpler: "Ask: is this the wrong age, too fast, up and down through the day, or accompanied by body or brain signs such as fever, fits, odd movements, or weakness? Is the person on new drugs, withdrawing from alcohol, or immunosuppressed? Any of these means look for a medical cause as well as treating the psychiatric symptoms.",
            mechanism: "The same brain networks that produce mood, perception, and thought can be disturbed by many insults: antibodies against synaptic receptors, infection, seizures, tumors and strokes in the frontal or temporal lobes, neurodegeneration, metabolic disturbance, and drugs. Each red flag points to one of these mechanisms: fever and pleocytosis to inflammation or infection, fluctuating attention to a diffuse encephalopathy, seizures and dyskinesias to cortical and subcortical dysfunction, and immunosuppression to opportunistic infection or lymphoma.",
            compare: "Primary psychosis usually begins in late adolescence or early adulthood, often with a gradual prodrome, mainly auditory hallucinations, and a clear sensorium. A secondary cause is more likely when onset is late or abrupt, attention or consciousness fluctuates, hallucinations are visual, or neurological and systemic signs appear. The overlap is wide, so the flags raise or lower probability rather than settle the question.",
            deeper: "The international consensus on autoimmune psychosis lists warning signs similar to these (abnormal movements including catatonia and dyskinesias, autonomic instability, reduced consciousness, focal signs, seizures, an infectious prodrome, and poor response or intolerance to antipsychotics) and recommends that psychosis with such features prompt a neurological workup. The authors stress that the flags have not been validated as a screening rule; they guide clinical judgment.",
          },
        },
        { kind: "predict", title: "Which features are red flags?", itemId: "m-neuropsych-red-flags" },
        {
          kind: "explain",
          title: "Delirium: the commonest mimic",
          body:
            "[[delirium|Delirium]] is an acute disturbance of attention and awareness caused by a medical condition, a drug, or withdrawal. It is the most frequent medical cause of new behavioral change in hospital, and it is easy to mislabel as a psychiatric illness.\n\nThe Confusion Assessment Method (CAM) gives four features: (1) acute onset and fluctuating course, (2) inattention, (3) disorganized thinking, and (4) altered level of consciousness. Features 1 and 2 plus either 3 or 4 support delirium. Ask someone who knows the patient what they were like a week ago, and test attention directly (months of the year backward, or serial subtraction).\n\nThree forms are easily misread:\n\n- Hyperactive delirium, with agitation, fear, and vivid visual hallucinations, can look like mania or psychosis.\n- Hypoactive delirium, quiet, slowed, and withdrawn, is often mistaken for depression.\n- Mixed delirium swings between the two, which can look like a mood disorder with rapid cycling.\n\nThe treatment target is the cause: infection, drugs (especially sedatives, opioids, and anticholinergics), metabolic disturbance, hypoxia, pain, urinary retention, alcohol or benzodiazepine withdrawal, or a primary brain process. The bedside separation of delirium and dementia is taught in the mental status module (x-mental-status).",
          layers: {
            simpler: "New, up and down through the day, and unable to pay attention: think delirium, even if the person seems sad, frightened, or is seeing things. Find and treat the body problem behind it.",
            mechanism: "Delirium reflects a diffuse failure of the networks that maintain arousal and attention. Many different insults (inflammatory signals from infection, drugs that block acetylcholine, metabolic changes, low oxygen) converge on these networks, which is why the syndrome looks similar whatever the cause and why older brains and those with dementia are most vulnerable.",
            compare: "Delirium versus primary psychosis: delirium has inattention and fluctuating consciousness, onset over hours to days, and often visual hallucinations; primary psychosis has a clear sensorium. Hypoactive delirium versus depression: both look withdrawn, but the delirious patient cannot sustain attention and drifts in and out, while the depressed patient can attend if motivated.",
            deeper: "The CAM was designed so that non-psychiatrists could identify delirium quickly at the bedside, and it performed well against expert psychiatric assessment in its validation study. Its accuracy depends on actually testing attention rather than inferring it from conversation, and adapted versions exist for intensive care.",
          },
        },
        {
          kind: "explain",
          title: "A first workup, and when to add MRI, EEG, or lumbar puncture",
          body:
            "For new psychiatric symptoms with any red flag, start with tests that are cheap, quick, and catch common treatable causes:\n\n- Vital signs, including temperature, and a point-of-care glucose.\n- A full physical and neurological examination, including attention and cognition.\n- Full blood count, sodium, potassium, calcium, and renal and liver function.\n- Thyroid function and vitamin B12.\n- HIV test and syphilis serology.\n- Urine or blood toxicology, a pregnancy test where relevant, and a careful medication and substance history, including over-the-counter drugs, alcohol, and recent withdrawal.\n\nAdd tests when the picture calls for them:\n\n- MRI brain: a first episode at an atypical age, focal signs, new cognitive decline, a rapid course, headache, seizures, or other neurological features. MRI shows tumors, strokes, demyelination, encephalitis, and patterns of atrophy, which CT can miss.\n- EEG: fluctuating awareness, episodes of staring or unresponsiveness, suspected [[nonconvulsive-status-epilepticus|nonconvulsive seizures]], catatonia, or suspected encephalitis. Diffuse slowing supports an encephalopathy; epileptiform activity points to seizures.\n- [[lumbar-puncture|Lumbar puncture]]: fever, headache, [[meningism|meningism]], immunosuppression, seizures, or other features of encephalitis, with CSF cell count, protein, glucose, infection testing, and an autoimmune antibody panel on CSF and serum (taught in c-autoimmune-encephalitis).\n\nFollow up the results. A normal first workup does not prove the illness is primary psychiatric, and new red flags that appear later, such as a seizure or dyskinesias after starting an antipsychotic, should restart the search. Equally, normal tests are not the basis of a [[functional-neurological-disorder|functional neurological disorder]] diagnosis, which rests on positive clinical features (c-fnd).",
          layers: {
            simpler: "Check the basics first: temperature, blood sugar, salts and calcium, kidney, liver, thyroid, B12, HIV, syphilis, and drugs. Add a brain MRI, an EEG, or a spinal tap when there are brain signs, seizures, fever, or a story that does not fit.",
            mechanism: "Each first-line test looks for a common systemic cause: hypoglycemia, hyponatremia, and hypercalcemia disturb neuronal excitability; liver and kidney failure cause toxic encephalopathy; hypo- and hyperthyroidism alter mood and cognition; B12 deficiency injures the brain and spinal cord; HIV and syphilis infect the brain; drugs act on neurotransmitter systems directly. The second-line tests look inside the head: MRI at structure, EEG at electrical function, and CSF at inflammation and infection.",
            compare: "Screening everyone with every test is not useful and can mislead (incidental findings, low-titer serum antibodies). Selecting tests by red flags concentrates investigation where the probability of a secondary cause is higher. In contrast, the first-line blood and toxicology tests are reasonable for most first presentations because they are cheap and their targets are common.",
            deeper: "The autoimmune psychosis consensus suggests that patients with warning signs have MRI, EEG, and CSF analysis with antibody testing on CSF and serum, and notes that CSF is more informative than serum alone for NMDA receptor antibodies. Isolated low-titer serum antibodies in a patient without supportive features are interpreted with caution.",
          },
        },
        { kind: "apply", title: "New psychosis at 58", itemId: "m-neuropsych-late-psychosis" },
        {
          kind: "summary",
          title: "Key points",
          points: [
            "Red flags: atypical age (first episode after about 40 to 50), acute or subacute onset, fluctuating attention or consciousness, visual hallucinations, focal signs, seizures, catatonia, abnormal movements, autonomic instability, fever or headache, cancer, immunosuppression or HIV, substance use or withdrawal, and poor response to or tolerance of treatment.",
            "Delirium is the commonest mimic: acute onset, fluctuating course, and inattention. Hypoactive delirium is often mistaken for depression.",
            "First workup: vital signs and glucose, examination, blood count, electrolytes and calcium, renal and liver tests, thyroid, B12, HIV and syphilis serology, toxicology, and a medication history.",
            "Add MRI for atypical age, focal signs, or cognitive decline; EEG for fluctuating awareness, spells, or catatonia; lumbar puncture for fever, headache, immunosuppression, or features of encephalitis.",
            "A psychiatric diagnosis and a medical cause can coexist. Avoid diagnostic overshadowing, and restart the search when new red flags appear.",
          ],
          reviewItemIds: ["m-neuropsych-red-flags", "m-neuropsych-delirium", "m-neuropsych-late-psychosis"],
        },
      ],
    },
    {
      id: "l-neuropsych-patterns",
      moduleId: M,
      title: "Patterns that point to the brain",
      concept: "A handful of patterns account for many neurological and medical causes of psychiatric presentations: NMDA receptor encephalitis, catatonia, frontal syndromes and bvFTD, temporal lobe seizures, and medication and substance effects. Recognizing each one changes the next step.",
      minutes: 9,
      meta: meta("l-neuropsych-patterns", [DALMAU, NMDAR, CAT, NMS, FTD, ILAE, CAM]),
      steps: [
        {
          kind: "hook",
          title: "Five referrals in one week",
          body: "In one week the liaison psychiatry team sees a 21-year-old student with a first psychosis who has started chewing movements, a man with bipolar disorder who has stopped speaking and eating, an engineer whose wife says he has become a different person, a young woman with panic attacks that start with deja vu, and an older man seeing insects on the walls after a new bladder medicine. Each has a pattern that points beyond a primary psychiatric disorder. What are they?",
        },
        {
          kind: "explain",
          title: "Anti-NMDA receptor encephalitis: a first psychosis that is not",
          body:
            "[[nmdar-encephalitis|Anti-NMDA receptor encephalitis]] is an [[autoimmune-encephalitis|autoimmune encephalitis]] caused by antibodies against the GluN1 subunit of the NMDA receptor. It mainly affects children and young adults, more often women, and in young women it can be associated with an ovarian [[teratoma|teratoma]]. Because it often begins with psychiatric symptoms, many patients are first seen by psychiatry.\n\nThe typical sequence:\n\n1. A viral-like [[prodrome|prodrome]] in some patients: headache, fever, or malaise.\n2. A psychiatric phase over days to weeks: anxiety, insomnia, agitation, mood change, delusions and hallucinations, disorganized behavior, and sometimes catatonia.\n3. Then neurological features: reduced speech or mutism, reduced responsiveness, seizures, abnormal movements (especially [[orofacial-dyskinesia|orofacial dyskinesias]], with limb dyskinesias, choreoathetosis, or dystonia), [[dysautonomia|autonomic instability]] (swings in heart rate, blood pressure, and temperature), and sometimes central hypoventilation needing intensive care.\n\nMany patients tolerate antipsychotics poorly, developing rigidity, fever, or autonomic instability that can resemble [[neuroleptic-malignant-syndrome|neuroleptic malignant syndrome]]; that intolerance is itself a red flag.\n\nWhat to do when you suspect it: MRI (often normal or nonspecific), EEG (often slow, sometimes with the [[extreme-delta-brush|extreme delta brush]] pattern), and lumbar puncture with NMDA receptor antibodies on CSF as well as serum, because CSF testing is more sensitive and specific. Treat HSV encephalitis as possible until excluded, since it is a mimic and a trigger. Look for a teratoma with pelvic imaging. First-line immunotherapy and tumor removal are associated with better outcomes, and recovery often takes months. Diagnosis and treatment are covered in c-autoimmune-encephalitis.",
          layers: {
            simpler: "A young person, often a woman, who develops a sudden psychosis and then odd mouth movements, seizures, swinging pulse and blood pressure, or becomes mute, may have an immune attack on brain receptors. It is treatable. Test the spinal fluid, look for an ovarian tumor, and involve neurology.",
            mechanism: "The antibodies bind NMDA receptors on neurons and cause them to be internalized, reducing receptor numbers without killing the neurons. Drugs that block NMDA receptors, such as ketamine and phencyclidine, produce psychosis, dissociation, and abnormal movements, which explains why the disease looks this way. Because the neurons survive, removing the antibodies allows recovery.",
            compare: "NMDA receptor encephalitis versus primary first-episode psychosis: both can begin with insomnia, agitation, and psychosis in a young adult. A prodrome, rapid progression, dyskinesias, seizures, reduced consciousness, autonomic instability, and severe antipsychotic intolerance point to encephalitis. Versus neuroleptic malignant syndrome: NMS follows dopamine-blocking drugs with rigidity, fever, and a high creatine kinase; in NMDA receptor encephalitis, dyskinesias and autonomic changes can begin before any antipsychotic is given.",
            deeper: "The consensus criteria allow probable NMDA receptor encephalitis to be diagnosed clinically from rapid onset of several of its features (psychiatric symptoms, speech dysfunction, seizures, movement disorder, reduced consciousness, autonomic dysfunction or hypoventilation) with an abnormal EEG or CSF, or a teratoma, so that treatment need not wait for antibody results. A few patients present with isolated psychiatric symptoms, which the autoimmune psychosis consensus addresses.",
          },
        },
        { kind: "predict", title: "Psychosis, then chewing movements", itemId: "m-neuropsych-nmdar" },
        {
          kind: "explain",
          title: "Catatonia: recognize it, treat it, look for the cause",
          body:
            "[[catatonia|Catatonia]] is a syndrome of abnormal movement, behavior, and responsiveness. Signs include stupor, mutism, staring, posturing (holding a position against gravity), waxy flexibility, negativism (resisting instructions or movement), rigidity, echolalia and echopraxia (repeating the examiner's words or movements), stereotypies, and refusal to eat or drink. Diagnosis rests on finding several signs on a structured examination.\n\nCatatonia is not a diagnosis of cause. It occurs with mood disorders (most often), schizophrenia, and autism, and also with medical and neurological conditions: autoimmune encephalitis (especially NMDA receptor encephalitis), [[nonconvulsive-status-epilepticus|nonconvulsive seizures]], other encephalitides, metabolic and endocrine disturbance, lupus, and drugs or withdrawal (including abrupt benzodiazepine withdrawal). Every patient needs a medical assessment, including creatine kinase, and EEG, MRI, or CSF studies when the picture suggests a neurological cause.\n\nManagement points:\n\n- Benzodiazepines (lorazepam is the usual choice) are first-line, and a lorazepam challenge with a clear improvement supports the diagnosis. ECT is the main second-line treatment.\n- Use antipsychotics with caution. They can worsen catatonia, and catatonia overlaps with [[neuroleptic-malignant-syndrome|neuroleptic malignant syndrome]], which is triggered by dopamine-blocking drugs.\n- [[malignant-catatonia|Malignant catatonia]], with fever and autonomic instability, is a medical emergency. Stop dopamine blockers and manage with the medical team.\n- Watch for complications of immobility and poor intake: dehydration, venous thromboembolism, pressure injury, and aspiration.",
          layers: {
            simpler: "A person who stops moving, speaking, or eating, holds strange postures, or copies your words may have catatonia. It is treatable, usually with lorazepam. Look for a medical cause, and be careful with antipsychotic drugs, which can make it worse.",
            mechanism: "The mechanism is not fully understood, but the response to benzodiazepines points to reduced GABA-A function in motor and frontal circuits, and the risk with antipsychotics points to dopamine blockade. NMDA receptor dysfunction, as in NMDA receptor encephalitis, is another route, which is one reason that encephalitis so often produces catatonic features.",
            compare: "Catatonic stupor versus hypoactive delirium: the catatonic patient often has eyes open, tracks, and resists passive movement, while the delirious patient drifts in and out with inattention. Catatonia versus neuroleptic malignant syndrome: both can cause rigidity, mutism, fever, and autonomic instability; NMS follows a dopamine-blocking drug. Many authors regard NMS as a drug-induced form of malignant catatonia, and both are treated by stopping dopamine blockers and giving supportive care.",
            deeper: "The 2023 British Association for Psychopharmacology guideline notes that the evidence base is mostly observational. It recommends benzodiazepines first, ECT when they fail or the situation is life-threatening, investigation for underlying medical causes, and particular care with antipsychotics in acute catatonia and malignant catatonia. Abrupt withdrawal of benzodiazepines or clozapine can itself precipitate catatonia.",
          },
        },
        { kind: "apply", title: "Mute and motionless", itemId: "m-neuropsych-catatonia" },
        {
          kind: "explain",
          title: "Personality change and episodic fear: frontal and temporal lobes",
          body:
            "Frontal lobe syndromes change personality and behavior while memory and language may be normal. Damage to orbitofrontal and medial frontal regions causes [[disinhibition|disinhibition]], impulsivity, apathy, loss of empathy, poor judgment, and lack of insight. Causes include tumors (a frontal meningioma can grow silently), stroke, traumatic brain injury, [[neurosyphilis|neurosyphilis]], and neurodegeneration.\n\n[[frontotemporal-dementia|Behavioral variant frontotemporal dementia]] (bvFTD) usually begins in middle age and is often first labeled depression, bipolar disorder, or a midlife crisis. The revised criteria for possible bvFTD require three of six features: early disinhibition, early apathy or inertia, early loss of sympathy or empathy, perseverative, stereotyped, or compulsive behavior, hyperorality and dietary change, and a neuropsychological profile of executive deficits with relative sparing of memory and visuospatial function. The criteria also exclude behavior better explained by a psychiatric disorder, so careful history from a family member matters. MRI may show frontal and anterior temporal atrophy and excludes a structural lesion. Dementia syndromes are taught in c-dementia.\n\nTemporal lobe seizures can look like panic attacks or brief psychotic episodes. A [[seizure-aura|seizure aura]] is a focal aware seizure, and those arising in the mesial temporal lobe commonly cause a rising epigastric sensation, sudden fear, deja vu or jamais vu, or an unpleasant smell. The episode may stop there or progress to a [[focal-impaired-awareness-seizure|focal impaired awareness seizure]] with staring, [[automatism|automatisms]] such as lip smacking or fumbling, and postictal confusion. Clues that favor seizures over panic: brevity, stereotyped onset, impaired awareness, automatisms, and postictal confusion or amnesia. Evaluation is with EEG and MRI (c-epilepsy-mimics).",
          layers: {
            simpler: "When a middle-aged person becomes rude, careless, impulsive, or cold, without feeling sad and without seeing a problem, think frontal lobe: a degenerative disease such as bvFTD or a tumor. When short, identical attacks of fear or deja vu are followed by staring and lip smacking, think temporal lobe seizures.",
            mechanism: "The orbitofrontal cortex links emotion to social rules and consequences, so its loss releases impulsive and socially inappropriate behavior; medial frontal and anterior cingulate damage removes drive, producing apathy. The mesial temporal lobe (amygdala and hippocampus) generates fear and the feeling of familiarity, so seizures starting there reproduce those experiences before spreading.",
            compare: "bvFTD versus depression: apathy can look like low mood, but in bvFTD the person usually denies sadness, lacks insight, shows disinhibition and loss of empathy, and progresses despite antidepressants. Temporal lobe seizure versus panic attack: panic attacks typically build over minutes with fear of dying, breathlessness, and preserved awareness and memory; seizures are brief and stereotyped and may include impaired awareness, automatisms, and postictal confusion.",
            deeper: "Some people with a bvFTD-like picture do not progress and have normal imaging (the phenocopy syndrome), so probable bvFTD requires functional decline and typical imaging. Genetic forms, notably the C9orf72 expansion, can present with psychosis. In epilepsy, psychosis can follow a cluster of seizures after a lucid interval, which is another reason to ask about seizures in new psychosis.",
          },
        },
        {
          kind: "explain",
          title: "Medicines and substances",
          body:
            "Always take a medication and substance history, including over-the-counter drugs and recent changes. Common culprits:\n\n- Corticosteroids: mood elevation, irritability, insomnia, depression, and psychosis, usually early in treatment and more likely at higher doses.\n- Anticholinergic drugs (bladder antimuscarinics, sedating antihistamines, tricyclic antidepressants, and others): delirium with visual hallucinations. The [[anticholinergic-toxidrome|anticholinergic toxidrome]] adds dry, flushed, warm skin, dilated pupils, tachycardia, and urinary retention. Older adults are especially vulnerable.\n- Stimulants (amphetamines, cocaine): paranoia, psychosis, and agitation with a hyperadrenergic state.\n- [[alcohol-withdrawal|Alcohol withdrawal]]: tremor, sweating, tachycardia, anxiety, and hallucinations within the first days after stopping, sometimes seizures, and in severe cases delirium tremens. Give thiamine because [[wernicke-encephalopathy|Wernicke encephalopathy]] can coexist; benzodiazepines are the usual treatment for withdrawal. Benzodiazepine withdrawal behaves similarly.\n- Dopaminergic drugs for Parkinson disease: visual hallucinations and impulse control problems.\n- Serotonergic drug combinations: [[serotonin-syndrome|serotonin syndrome]], with agitation, tremor, clonus, and hyperreflexia.\n\nToxic and metabolic disorders are taught in c-toxic-nutritional.",
          layers: {
            simpler: "Many medicines and drugs can cause confusion, hallucinations, or mood change: steroids, bladder and allergy medicines, stimulants, and stopping alcohol suddenly are classic examples. Ask about every medicine and drink.",
            mechanism: "Acetylcholine supports attention and arousal, so blocking muscarinic receptors produces delirium, while blocking them in the body produces the dry, hot, dilated-pupil picture. Stimulants increase dopamine and noradrenaline, which can produce paranoid psychosis. Chronic alcohol use enhances GABA-A and blocks NMDA signaling; sudden withdrawal leaves the brain hyperexcitable.",
            compare: "Anticholinergic toxicity versus serotonin syndrome: both cause agitation, tachycardia, and fever. Anticholinergic patients have dry skin, urinary retention, and reduced bowel sounds; serotonin syndrome causes sweating, diarrhea, tremor, clonus, and hyperreflexia. Alcohol withdrawal versus anticholinergic delirium: withdrawal causes sweating and tremor, not dry skin.",
            deeper: "Medication burden adds up: several drugs with modest anticholinergic effects can together cause delirium in an older adult. Neuroleptic malignant syndrome, from dopamine blockade, and parkinsonism-hyperpyrexia syndrome, from abrupt withdrawal of dopaminergic drugs, are the dopamine-related emergencies to keep in mind.",
          },
        },
        {
          kind: "summary",
          title: "Key points",
          points: [
            "NMDA receptor encephalitis: a young person, often a woman, with a prodrome, then psychosis, then reduced speech, seizures, orofacial dyskinesias, and autonomic instability. Test CSF and serum, look for a teratoma, and involve neurology.",
            "Catatonia: stupor, mutism, posturing, negativism, echophenomena. Give a benzodiazepine, look for medical causes, use antipsychotics with caution because of NMS, and treat malignant catatonia as an emergency.",
            "Personality change with disinhibition, apathy, loss of empathy, and poor insight in middle age: think bvFTD or a frontal lesion and image the brain.",
            "Brief, stereotyped fear, deja vu, or rising epigastric feelings, sometimes with staring and automatisms: think temporal lobe seizures.",
            "Medicines and substances: corticosteroids, anticholinergics, stimulants, and alcohol withdrawal (give thiamine).",
          ],
          reviewItemIds: ["m-neuropsych-nmdar", "m-neuropsych-catatonia", "m-neuropsych-bvftd", "m-neuropsych-tle-aura", "m-neuropsych-anticholinergic"],
        },
      ],
    },
  ],
  items: [
    {
      id: "m-neuropsych-red-flags",
      version: 1,
      format: "multi-select",
      skill: "differential",
      modules: [M],
      difficulty: 1,
      presentation: "transplant-paranoia-fever",
      usage: ["lesson", "review"],
      vignette: "A 47-year-old man is referred to psychiatry with 10 days of increasing suspiciousness; he believes his neighbors are poisoning his water. He has no previous psychiatric history and works as a bus driver under some stress. His wife says he has complained of headaches, and twice this week he stared and smacked his lips for about a minute without answering her. He had a kidney transplant 6 years ago and takes tacrolimus and mycophenolate. He drinks two beers a week. Temperature is 38.1°C and heart rate 112. He is oriented but cannot say the months of the year backward.",
      stem: "Which features are red flags for a medical or neurological cause?",
      options: [
        { id: "a", text: "First episode of psychosis at age 47 with no psychiatric history", correct: true },
        { id: "b", text: "Fever", correct: true },
        { id: "c", text: "New headaches", correct: true },
        { id: "d", text: "Brief spells of staring and lip smacking without response", correct: true },
        { id: "e", text: "Immunosuppression after a transplant", correct: true },
        { id: "f", text: "Inattention (cannot say the months backward)", correct: true },
        { id: "g", text: "The persecutory content of his beliefs", tag: "misconception", feedback: "The content of delusions does not separate primary from secondary psychosis; persecutory beliefs occur in both." },
        { id: "h", text: "Stress at work", tag: "weak-reasoning", feedback: "Stress is common and does not explain fever, seizures, or inattention; it should not stop the search for a cause." },
        { id: "i", text: "Drinking two beers a week", tag: "knowledge-gap", feedback: "This level of drinking makes alcohol withdrawal or toxicity very unlikely; a substance history is a red flag when use is heavy or has recently stopped." },
      ],
      rationale: "New psychosis at an atypical age, fever, headache, possible [[focal-impaired-awareness-seizure|focal seizures]] with [[automatism|automatisms]], inattention suggesting [[delirium|delirium]], and immunosuppression all point to a secondary cause such as encephalitis, an opportunistic infection, or lymphoma. He needs examination, basic bloods, MRI, EEG, and lumbar puncture rather than a psychiatric label alone. The content of the delusion and everyday stress do not distinguish primary from secondary psychosis.",
      meta: meta("m-neuropsych-red-flags", [AP, AE, CAM]),
    },
    {
      id: "m-neuropsych-late-psychosis",
      version: 1,
      format: "select-tests",
      skill: "investigation-selection",
      modules: [M],
      difficulty: 2,
      presentation: "late-onset-psychosis-visual",
      usage: ["lesson", "review", "challenge"],
      vignette: "A 58-year-old woman with no psychiatric history has had 6 weeks of believing the neighbors are watching the house, and at night she sees small children sitting in the living room. Her husband thinks she has also become forgetful. Temperature, heart rate, and blood pressure are normal. She is alert; she makes errors on serial subtraction and draws the clock poorly. The neurological examination is otherwise normal. She takes no regular medicines and drinks little alcohol.",
      stem: "Choose the investigations for her first assessment.",
      options: [
        { id: "glucose", label: "Point-of-care glucose", category: "necessary", why: "Quick, and hypoglycemia can cause confusion and behavioral change." },
        { id: "bloods", label: "Full blood count, sodium, calcium, renal and liver function", category: "necessary", why: "Hyponatremia, hypercalcemia, and organ failure are common, treatable causes of new psychiatric and cognitive symptoms." },
        { id: "thyroid", label: "Thyroid function and vitamin B12", category: "necessary", why: "Thyroid disease and B12 deficiency can both present with psychiatric and cognitive change." },
        { id: "hivsyph", label: "HIV test and syphilis serology", category: "necessary", why: "Both infections can cause late-onset psychosis and cognitive decline and are treatable." },
        { id: "tox", label: "Urine toxicology and a medication and supplement review", category: "necessary", why: "Drugs and substances are common causes and the history alone can miss them." },
        { id: "mri", label: "MRI brain", category: "necessary", why: "A first psychosis at 58 with visual hallucinations and cognitive errors needs imaging for tumor, stroke, and patterns of neurodegeneration." },
        { id: "cog", label: "Structured cognitive assessment", category: "reasonable", why: "Visual hallucinations with cognitive decline raise dementia with Lewy bodies; documenting the deficits guides the next steps." },
        { id: "eeg", label: "EEG", category: "reasonable", why: "Useful if her attention fluctuates or episodes suggest seizures; diffuse slowing would support an encephalopathy." },
        { id: "lp", label: "Lumbar puncture with an autoimmune antibody panel", category: "reasonable", why: "Indicated if the first tests are unrevealing and the course is rapid, or features of encephalitis appear; not required first in every patient." },
        { id: "apoe", label: "APOE genotyping", category: "unnecessary", why: "A risk factor test that does not diagnose the cause of her symptoms." },
        { id: "geneschiz", label: "Genetic risk testing for schizophrenia", category: "unnecessary", why: "No clinically useful test of this kind exists, and it would not change management." },
        { id: "antipsych", label: "Start a high-potency antipsychotic and defer investigations until she responds", category: "harmful", why: "It delays finding a treatable cause, and patients with Lewy body disease can have severe, sometimes dangerous reactions to antipsychotics." },
      ],
      rationale: "A first psychosis after 50, with [[hallucination|visual hallucinations]] and new cognitive deficits, carries several red flags. The first workup is glucose, electrolytes and calcium, renal and liver tests, thyroid, B12, HIV and syphilis serology, toxicology with a medication review, and MRI brain because of the atypical age and cognitive change. Visual hallucinations with cognitive decline suggest [[dementia-with-lewy-bodies|dementia with Lewy bodies]], in which antipsychotic sensitivity is a recognized hazard. EEG and lumbar puncture are added when the picture points to seizures or encephalitis.",
      meta: meta("m-neuropsych-late-psychosis", [AP, DLB, CURR]),
    },
    {
      id: "m-neuropsych-delirium",
      version: 1,
      format: "free-text",
      skill: "differential",
      modules: [M],
      difficulty: 2,
      presentation: "postoperative-withdrawn-older-adult",
      usage: ["review"],
      vignette: "An 81-year-old woman is on day 3 after repair of a hip fracture. The ward team asks psychiatry to assess her for depression because she has become withdrawn and quiet. Her daughter says she lived alone and did crosswords daily until the fall. In the morning she drifts off mid-sentence and cannot follow a conversation; in the afternoon she is more alert but says she is at a railway station. Overnight she was picking at the air. She has a urinary catheter and is receiving oxycodone.",
      stem: "What syndrome best explains the change in her behavior?",
      placeholder: "Syndrome",
      answer: {
        full: [
          { id: "delirium", label: "Delirium", patterns: ["delirium", "acute confusional state", "hypoactive delirium", "mixed delirium", "acute confusion"] },
        ],
        partial: [
          { concept: { id: "enceph", label: "Encephalopathy", patterns: ["encephalopathy", "toxic metabolic", "drug induced confusion", "opioid toxicity"] }, credit: 0.6, feedback: "Close. The bedside syndrome is delirium: acute onset, fluctuating course, inattention, and altered consciousness. Name it, then look for the causes (drugs, infection, pain, retention)." },
        ],
        wrong: [
          { concept: { id: "depr", label: "Depression", patterns: ["depression", "depressive", "low mood"] }, tag: "misconception", feedback: "Hypoactive delirium is often mistaken for depression. The fluctuation, drowsiness, inattention, and disorientation point to delirium." },
          { concept: { id: "dem", label: "Dementia", patterns: ["dementia", "alzheimer", "sundowning"] }, tag: "misconception", feedback: "She was independent until days ago. An acute, fluctuating change with inattention is delirium; do not diagnose dementia during an episode." },
          { concept: { id: "psy", label: "Psychosis", patterns: ["psychosis", "psychotic", "schizophrenia"] }, tag: "weak-reasoning", feedback: "Her perceptual disturbance comes with inattention and fluctuating consciousness, which defines delirium rather than a primary psychosis." },
          { concept: { id: "dlb", label: "Dementia with Lewy bodies", patterns: ["lewy"] }, tag: "weak-reasoning", feedback: "Lewy body dementia fluctuates, but it develops over months to years; a change over days after surgery is delirium." },
        ],
      },
      modelAnswer: "Delirium (an acute confusional state), mainly hypoactive.",
      rationale: "The [[delirium|delirium]] criteria of the Confusion Assessment Method are met: acute onset and fluctuating course, inattention, and altered level of consciousness, with disorganized thinking. The quiet, withdrawn presentation is hypoactive delirium, which is often mistaken for depression. Likely contributors after hip surgery include opioids, pain, infection (the catheter), urinary retention, dehydration, and sleep disruption; the treatment target is the cause.",
      meta: meta("m-neuropsych-delirium", [CAM, CURR]),
    },
    {
      id: "m-neuropsych-nmdar",
      version: 1,
      format: "mcq",
      skill: "differential",
      modules: [M],
      difficulty: 2,
      presentation: "first-episode-psychosis-dyskinesia",
      family: "nmdar-psychosis",
      usage: ["lesson", "review", "challenge"],
      vignette: "A 21-year-old university student is admitted to a psychiatric unit with 2 weeks of insomnia, agitation, and the belief that her lecturers can hear her thoughts. Her roommate says she had a flu-like illness the week before. Urine toxicology is negative. Over the next 5 days, before any antipsychotic is given, she speaks less and less, then develops continuous chewing and grimacing movements of the mouth and writhing movements of the fingers. Her heart rate varies between 50 and 140 beats per minute.",
      stem: "What is the most likely diagnosis, and what is the right next step?",
      options: [
        { id: "a", text: "Anti-NMDA receptor encephalitis: transfer care with neurology, send NMDA receptor antibodies on CSF and serum with full CSF studies, and image the pelvis for a teratoma", correct: true, feedback: "Right. Psychosis after a prodrome, followed by reduced speech, orofacial and limb dyskinesias, and autonomic instability, is the typical sequence." },
        { id: "b", text: "Primary first-episode psychosis: start an antipsychotic and reassess in 2 weeks", tag: "unsafe-priority", feedback: "Dyskinesias, mutism, and autonomic instability arising before any antipsychotic are red flags for encephalitis, and these patients often tolerate antipsychotics poorly." },
        { id: "c", text: "Tardive dyskinesia: no action needed beyond observation", tag: "knowledge-gap", feedback: "Tardive dyskinesia follows long-term dopamine blocker exposure; she has received none." },
        { id: "d", text: "Neuroleptic malignant syndrome: check creatine kinase and stop antipsychotics", tag: "misconception", feedback: "NMS requires exposure to a dopamine-blocking drug and causes rigidity and fever; her movements and autonomic changes began without one." },
        { id: "e", text: "Substance-induced psychosis: observe until it clears", tag: "weak-reasoning", feedback: "Toxicology is negative, and worsening over days with new movements and autonomic instability is not the expected course of substance-induced psychosis." },
      ],
      reasoning: {
        stem: "Which feature most strongly argues against a primary psychotic disorder?",
        options: [
          { id: "r1", text: "Orofacial and limb dyskinesias with autonomic instability and falling speech output, before any antipsychotic", correct: true },
          { id: "r2", text: "Her age and sex", feedback: "Young women are often affected, but they are also the age group for primary psychosis; demographics do not separate the two." },
          { id: "r3", text: "Insomnia and agitation", feedback: "These are common early in both conditions." },
        ],
      },
      rationale: "[[nmdar-encephalitis|Anti-NMDA receptor encephalitis]] often begins with a viral-like [[prodrome|prodrome]] and a psychiatric phase, followed by reduced speech, seizures, [[orofacial-dyskinesia|orofacial dyskinesias]], [[dysautonomia|autonomic instability]], and reduced consciousness. CSF antibody testing is more sensitive than serum, an ovarian [[teratoma|teratoma]] should be sought, and HSV encephalitis is treated as possible until excluded. Early immunotherapy and tumor removal are associated with better long-term outcomes.",
      meta: meta("m-neuropsych-nmdar", [DALMAU, NMDAR, AE, AP]),
    },
    {
      id: "m-neuropsych-catatonia",
      version: 1,
      format: "mcq",
      skill: "emergency",
      modules: [M],
      difficulty: 2,
      presentation: "catatonic-stupor",
      usage: ["lesson", "review", "challenge"],
      vignette: "A 34-year-old man with bipolar disorder is brought in by his sister after 3 days of not speaking, eating, or drinking. He lies with his eyes open, staring. When the examiner lifts his arm, he holds it in the air for several minutes. He resists passive movement with force that matches the examiner's, and he repeats the examiner's questions back word for word. Temperature is 37.3°C, heart rate 98, blood pressure 136/84. Glucose and sodium are normal.",
      stem: "What is the best next step?",
      options: [
        { id: "a", text: "Give a benzodiazepine such as lorazepam as treatment and a diagnostic challenge, start a medical workup including creatine kinase, fluids, and EEG, and avoid antipsychotics for now", correct: true, feedback: "Right. This is catatonia: benzodiazepines are first-line, a response supports the diagnosis, and medical causes and complications must be looked for." },
        { id: "b", text: "Give intramuscular haloperidol for presumed psychotic depression", tag: "unsafe-priority", feedback: "Antipsychotics can worsen catatonia and catatonia overlaps with neuroleptic malignant syndrome; a benzodiazepine is first-line." },
        { id: "c", text: "Arrange outpatient psychiatric follow-up in a week", tag: "unsafe-priority", feedback: "He has not eaten or drunk for 3 days and is at risk of dehydration, thromboembolism, and malignant catatonia; he needs treatment now." },
        { id: "d", text: "Proceed directly to ECT without medical assessment", tag: "weak-reasoning", feedback: "ECT is second-line or for life-threatening cases, and a medical cause and fitness for anesthesia should be assessed first." },
        { id: "e", text: "Treat the absence of speech as a choice and encourage him to eat", tag: "misconception", feedback: "Mutism, posturing, and negativism are signs of catatonia, a treatable syndrome, not volitional behavior." },
      ],
      reasoning: {
        stem: "Why is caution with antipsychotics important in this situation?",
        options: [
          { id: "r1", text: "They can worsen catatonia, and catatonia overlaps with neuroleptic malignant syndrome, which dopamine blockers trigger", correct: true },
          { id: "r2", text: "Antipsychotics are never used in bipolar disorder", feedback: "Antipsychotics are widely used in bipolar disorder; the concern is their use during acute catatonia." },
          { id: "r3", text: "They prevent the EEG from being interpreted", feedback: "That is not the main reason; the risk is clinical worsening and NMS." },
        ],
      },
      rationale: "Staring, mutism, posturing with waxy flexibility, negativism, echolalia, and refusal of food and fluids are signs of [[catatonia|catatonia]]. Benzodiazepines are first-line, and improvement after lorazepam supports the diagnosis; ECT is second-line. Catatonia occurs in mood disorders and also with medical causes such as autoimmune encephalitis, nonconvulsive seizures, and metabolic disturbance, so a medical workup is part of management. Antipsychotics are used with caution because they can worsen catatonia and because of the overlap with [[neuroleptic-malignant-syndrome|neuroleptic malignant syndrome]]; fever and autonomic instability would indicate [[malignant-catatonia|malignant catatonia]].",
      meta: meta("m-neuropsych-catatonia", [CAT, NMS]),
    },
    {
      id: "m-neuropsych-bvftd",
      version: 1,
      format: "mcq",
      skill: "differential",
      modules: [M],
      difficulty: 2,
      presentation: "midlife-personality-change",
      usage: ["review", "challenge"],
      vignette: "A 56-year-old engineer has been treated for depression for 18 months with two antidepressants in turn, without benefit. His wife says he is a different person: he makes crude remarks to strangers, has spent their savings on lottery tickets, eats whole packets of biscuits at a sitting, and showed no concern when their daughter was admitted to hospital. He denies feeling sad and thinks nothing is wrong. He is oriented and recalls 3 of 3 words, but generates few words beginning with F in a minute and cannot alternate between numbers and letters.",
      stem: "What is the most likely explanation?",
      options: [
        { id: "a", text: "Behavioral variant frontotemporal dementia (or another frontal lobe process), needing MRI and neurological assessment", correct: true, feedback: "Right. Disinhibition, loss of empathy, hyperorality, and executive deficits with spared memory and poor insight fit bvFTD; MRI also excludes a frontal tumor." },
        { id: "b", text: "Treatment-resistant depression", tag: "misconception", feedback: "He denies low mood, and disinhibition, loss of empathy, hyperorality, and executive deficits are not explained by depression." },
        { id: "c", text: "Late-onset bipolar disorder in a manic phase", tag: "weak-reasoning", feedback: "There is no elevated mood, reduced need for sleep, or episodic course; the change is steady and progressive with executive deficits." },
        { id: "d", text: "Typical Alzheimer disease", tag: "knowledge-gap", feedback: "Early memory loss is the hallmark of typical Alzheimer disease; his recall is normal while behavior and executive function are affected." },
        { id: "e", text: "A personality change from life stress that needs no investigation", tag: "unsafe-priority", feedback: "A progressive change in personality in middle age with cognitive deficits needs a neurological explanation sought." },
      ],
      reasoning: {
        stem: "Which combination best points to bvFTD rather than depression?",
        options: [
          { id: "r1", text: "Disinhibition, loss of empathy, and dietary change with poor insight and executive deficits", correct: true },
          { id: "r2", text: "Lack of response to two antidepressants", feedback: "Non-response is a red flag, but many people with depression need several treatments; it does not by itself point to bvFTD." },
          { id: "r3", text: "His age", feedback: "Middle age is typical for bvFTD onset but also common for depression." },
        ],
      },
      rationale: "The revised criteria for possible [[frontotemporal-dementia|behavioral variant frontotemporal dementia]] require three of: early [[disinhibition|disinhibition]], early apathy, early loss of sympathy or empathy, compulsive or stereotyped behavior, hyperorality and dietary change, and an executive-predominant neuropsychological profile with relatively spared memory. He has at least four. bvFTD is often first treated as depression or a midlife crisis. MRI looks for frontal and anterior temporal atrophy and excludes structural causes such as a frontal meningioma.",
      meta: meta("m-neuropsych-bvftd", [FTD, CURR]),
    },
    {
      id: "m-neuropsych-tle-aura",
      version: 1,
      format: "mcq",
      skill: "history-exam",
      modules: [M],
      difficulty: 1,
      presentation: "episodic-fear-deja-vu",
      usage: ["review"],
      vignette: "A 26-year-old woman has been treated for panic disorder for a year. Several times a month she has episodes lasting about a minute that always begin the same way: a rising feeling in her stomach, sudden intense fear, and a strong sense that the moment has happened before. Her partner says that in some episodes she then stares, does not answer, smacks her lips, and fiddles with her sleeve, and afterward she is confused for 10 minutes and cannot remember what happened.",
      stem: "What is the most likely explanation for her episodes?",
      options: [
        { id: "a", text: "Focal seizures arising from the temporal lobe", correct: true, feedback: "Right. Stereotyped epigastric rising, fear, and deja vu are typical mesial temporal auras, and staring with automatisms and postictal confusion indicate focal impaired awareness seizures." },
        { id: "b", text: "Panic attacks", tag: "misconception", feedback: "Panic attacks usually build over minutes with preserved awareness and memory; staring, automatisms, and postictal confusion point to seizures." },
        { id: "c", text: "Functional (dissociative) seizures", tag: "weak-reasoning", feedback: "Brief, highly stereotyped episodes with an epigastric aura, lip smacking, and postictal confusion are characteristic of temporal lobe seizures." },
        { id: "d", text: "Migraine aura", tag: "knowledge-gap", feedback: "Migraine aura is usually visual or sensory, spreads over minutes, and does not cause automatisms or postictal confusion." },
        { id: "e", text: "Vasovagal syncope", tag: "knowledge-gap", feedback: "Syncope causes brief loss of consciousness with pallor and quick recovery, not deja vu, automatisms, and prolonged confusion." },
      ],
      rationale: "A [[seizure-aura|seizure aura]] is a focal aware seizure. In the ILAE classification, focal seizures can begin with autonomic (epigastric rising), emotional (fear), or cognitive (deja vu, jamais vu) features, and may progress to a [[focal-impaired-awareness-seizure|focal impaired awareness seizure]] with [[automatism|automatisms]]. Brevity, stereotypy, automatisms, and postictal confusion favor temporal lobe seizures over panic attacks. EEG and MRI are the next steps.",
      meta: meta("m-neuropsych-tle-aura", [ILAE, CURR]),
    },
    {
      id: "m-neuropsych-anticholinergic",
      version: 1,
      format: "mcq",
      skill: "differential",
      modules: [M],
      difficulty: 1,
      presentation: "older-adult-new-bladder-drug-hallucinations",
      usage: ["review"],
      vignette: "A 72-year-old man becomes agitated and starts seeing insects crawling on the walls 2 days after starting a medicine for an overactive bladder. He has also been taking an over-the-counter sleep aid containing diphenhydramine. He is disoriented and inattentive. His skin is flushed, warm, and dry, his mouth is dry, his pupils are dilated, his heart rate is 118, his temperature 37.9°C, and his bladder is palpable.",
      stem: "What is the most likely cause of his symptoms?",
      options: [
        { id: "a", text: "Delirium from anticholinergic toxicity", correct: true, feedback: "Right. Delirium with visual hallucinations plus dry, flushed skin, dilated pupils, tachycardia, and urinary retention is the anticholinergic toxidrome." },
        { id: "b", text: "Late-onset schizophrenia", tag: "misconception", feedback: "Inattention, disorientation, and autonomic signs that began after new anticholinergic drugs point to delirium, not a primary psychosis." },
        { id: "c", text: "Serotonin syndrome", tag: "knowledge-gap", feedback: "Serotonin syndrome follows serotonergic drugs and causes sweating, diarrhea, tremor, clonus, and hyperreflexia, not dry skin and urinary retention." },
        { id: "d", text: "Alcohol withdrawal", tag: "weak-reasoning", feedback: "Withdrawal causes tremor and sweating; his skin is dry and the timing follows a new medicine." },
        { id: "e", text: "Corticosteroid-induced psychosis", tag: "knowledge-gap", feedback: "Steroids can cause psychosis, but he has not taken them, and they do not cause dry skin, dilated pupils, and urinary retention." },
      ],
      rationale: "Blocking central muscarinic receptors causes [[delirium|delirium]], often with vivid visual [[hallucination|hallucinations]]; blocking peripheral receptors causes the rest of the [[anticholinergic-toxidrome|anticholinergic toxidrome]]: dry, flushed, warm skin, dilated pupils, tachycardia, and urinary retention. Older adults are especially vulnerable and effects add up across drugs. Management is to stop the offending drugs, relieve retention, and give supportive care. Dry skin and retention separate it from [[serotonin-syndrome|serotonin syndrome]].",
      meta: meta("m-neuropsych-anticholinergic", [CAM, SS, CURR]),
    },
  ],
  terms: [
    term("catatonia", "Catatonia", ["catatonic", "catatonic stupor"], "A state in which a person may stop moving, speaking, or eating, hold strange postures, or copy others' words or movements.", "A syndrome of motor, behavioral, and autonomic abnormalities including stupor, mutism, staring, posturing, waxy flexibility, negativism, rigidity, echolalia, echopraxia, and refusal of food and fluids. Occurs with mood disorders, schizophrenia, and autism and with medical and neurological conditions such as autoimmune encephalitis, nonconvulsive seizures, metabolic disturbance, and drug withdrawal. Benzodiazepines are first-line and ECT second-line.", "kat-uh-TOH-nee-uh", "He lay mute and staring and held his arm in the air after the examiner lifted it; lorazepam brought rapid improvement.", M, ["malignant-catatonia", "neuroleptic-malignant-syndrome", "nmdar-encephalitis"]),
    term("malignant-catatonia", "Malignant catatonia", ["lethal catatonia"], "A life-threatening form of catatonia with fever and an unstable pulse and blood pressure.", "Catatonia accompanied by fever and autonomic instability, which can progress to rhabdomyolysis and death. It overlaps clinically with neuroleptic malignant syndrome; management includes stopping dopamine blockers, supportive care, benzodiazepines, and early ECT.", undefined, "On the fourth day of catatonic stupor he developed a fever and swinging blood pressure: malignant catatonia.", M, ["catatonia", "neuroleptic-malignant-syndrome"]),
    term("psychosis", "Psychosis", ["psychotic", "first-episode psychosis"], "Losing touch with reality, with false beliefs or hearing or seeing things that are not there.", "A state characterized by delusions, hallucinations, or disorganized thought and behavior. It occurs in primary psychiatric disorders and secondary to medical, neurological, drug, and withdrawal causes.", "sy-KOH-sis", "Her first psychosis at 58, with visual hallucinations, prompted an MRI.", M, ["hallucination", "delirium"]),
    term("hallucination", "Hallucination", ["hallucinations", "visual hallucinations", "auditory hallucinations"], "Seeing, hearing, smelling, or feeling something that is not there.", "A perception without an external stimulus. Auditory hallucinations are typical of primary psychotic disorders; visual, olfactory, and tactile hallucinations raise suspicion of delirium, drug effects, dementia with Lewy bodies, seizures, or another neurological cause.", "huh-loo-sih-NAY-shun", "Visual hallucinations of insects on the wall began after he started a bladder antimuscarinic.", M, ["psychosis", "delirium", "dementia-with-lewy-bodies"]),
    term("diagnostic-overshadowing", "Diagnostic overshadowing", [], "Wrongly blaming new symptoms on a condition a person is already known to have.", "Attribution of new physical or neurological symptoms to a known psychiatric diagnosis or disability, leading to missed or delayed diagnosis of a medical cause.", undefined, "His new confusion was put down to his schizophrenia until a lumbar puncture showed encephalitis.", M, ["psychosis"]),
    term("disinhibition", "Disinhibition", ["disinhibited"], "Acting on impulses without the usual social restraint.", "Loss of the normal inhibition of socially inappropriate, impulsive, or risky behavior, typically from orbitofrontal dysfunction. An early core feature of behavioral variant frontotemporal dementia.", undefined, "He began making crude remarks to strangers and spending recklessly.", M, ["frontotemporal-dementia", "executive-function"]),
    term("seizure-aura", "Seizure aura", ["epileptic aura", "psychic aura"], "A warning feeling at the start of a seizure, such as fear, deja vu, a strange smell, or a rising feeling in the stomach.", "A focal aware seizure experienced subjectively, often preceding a focal impaired awareness or bilateral tonic-clonic seizure. Mesial temporal auras include epigastric rising, fear, deja vu or jamais vu, and olfactory sensations.", "OR-uh", "Each episode began with a rising feeling in her stomach and deja vu before she stared and smacked her lips.", M, ["focal-seizure", "focal-impaired-awareness-seizure"]),
    term("anticholinergic-toxidrome", "Anticholinergic toxidrome", ["anticholinergic toxicity", "antimuscarinic toxicity", "anticholinergic syndrome"], "Confusion with dry, hot, flushed skin and wide pupils caused by drugs that block acetylcholine.", "The clinical syndrome of muscarinic receptor blockade: delirium with visual hallucinations, dry flushed warm skin, dry mouth, mydriasis, tachycardia, hyperthermia, urinary retention, and reduced bowel sounds. Caused by antimuscarinic drugs, sedating antihistamines, tricyclic antidepressants, and some plants.", "AN-tee-koh-lin-ER-jik TOKS-ih-drohm", "Two days after starting a bladder antimuscarinic and a diphenhydramine sleep aid, he was delirious, flushed, and dry with a palpable bladder.", M, ["delirium", "serotonin-syndrome"]),
    term("alcohol-withdrawal", "Alcohol withdrawal", ["alcohol withdrawal syndrome", "delirium tremens", "DTs"], "Shaking, sweating, anxiety, and sometimes seizures or confusion when heavy drinking stops suddenly.", "A syndrome after reduction or cessation of heavy, prolonged alcohol use: tremor, sweating, tachycardia, anxiety, insomnia, and hallucinations within the first days, sometimes withdrawal seizures, and in severe cases delirium tremens with delirium and autonomic instability. Treated with benzodiazepines, with thiamine given because Wernicke encephalopathy can coexist.", undefined, "On the second day after admission he was tremulous, sweating, and seeing spiders: alcohol withdrawal.", M, ["delirium", "wernicke-encephalopathy", "thiamine"]),
  ],
  sources: [
    {
      id: AP,
      kind: "consensus-criteria",
      citation: "Pollak TA, Lennox BR, Müller S, et al. Autoimmune psychosis: an international consensus on an approach to the diagnosis and management of psychosis of suspected autoimmune origin. Lancet Psychiatry. 2020;7(1):93-108. doi:10.1016/S2215-0366(19)30290-1",
      title: "Autoimmune psychosis: an international consensus on an approach to the diagnosis and management of psychosis of suspected autoimmune origin",
      authors: "Pollak TA, Lennox BR, Müller S, et al.",
      journal: "Lancet Psychiatry",
      year: 2020,
      doi: "10.1016/S2215-0366(19)30290-1",
      pmid: "31669058",
      url: "https://doi.org/10.1016/S2215-0366(19)30290-1",
      lastVerified: "2026-11-06",
      verificationNote: "Title, first three authors, journal, volume, issue, pages (93-108), DOI, PMID, and online date (24 Oct 2019) confirmed on 2026-11-06 from web search results indexing the PubMed record, the University of Melbourne and Capital Region of Denmark research portals, the University of Adelaide repository, and the British Library catalog. The framework of possible, probable, and definite autoimmune psychosis, the warning signs (movement disorders including catatonia and dyskinesia, autonomic dysfunction, reduced consciousness, focal signs, seizures, infectious prodrome, poor response to antipsychotics), and the recommended workup were checked against secondary summaries; the full text could not be opened. PubMed and the publisher page could not be opened from this environment.",
      verified: true,
    },
    {
      id: CAT,
      kind: "guideline",
      citation: "Rogers JP, Oldham MA, Fricchione G, et al. Evidence-based consensus guidelines for the management of catatonia: recommendations from the British Association for Psychopharmacology. J Psychopharmacol. 2023;37(4):327-369. doi:10.1177/02698811231158232",
      title: "Evidence-based consensus guidelines for the management of catatonia: recommendations from the British Association for Psychopharmacology",
      authors: "Rogers JP, Oldham MA, Fricchione G, et al.",
      journal: "J Psychopharmacol",
      year: 2023,
      doi: "10.1177/02698811231158232",
      pmid: "37039129",
      url: "https://doi.org/10.1177/02698811231158232",
      lastVerified: "2026-11-06",
      verificationNote: "Title, first three authors, journal, volume, issue, pages (327-369), DOI, PMID, and PMC id (PMC10101189) confirmed on 2026-11-06 from web search results indexing PubMed, PMC, the UCL Discovery repository (open access copy and supplementary recommendations), the BAP website, and the Penn State research portal. Scope (diagnosis, aetiology, investigations including EEG, imaging, and autoantibodies; benzodiazepines first-line with lorazepam challenge; ECT second-line; sections on malignant catatonia, NMS, and antipsychotic-induced catatonia; mainly observational evidence) checked against search summaries. No doses are used. PubMed, PMC, and the publisher page could not be opened from this environment.",
      verified: true,
    },
  ],
};

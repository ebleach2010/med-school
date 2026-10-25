// Management actions available in encounters. Cases mark which are urgent, harmful, or
// neutral. Doses are deliberately omitted: this is an educational simulator, not a
// prescribing reference.

export interface ActionDef {
  id: string;
  label: string;
  category: "stabilize" | "treat" | "consult" | "disposition" | "monitor";
  minutes: number;
  note: string;
}

export const ACTIONS: ActionDef[] = [
  { id: "abc", label: "Assess airway, breathing, circulation", category: "stabilize", minutes: 1, note: "First step in any unstable patient." },
  { id: "oxygen", label: "Supplemental oxygen to target saturation", category: "stabilize", minutes: 1, note: "Only if hypoxic; routine oxygen is not beneficial." },
  { id: "dextrose", label: "Give IV dextrose", category: "stabilize", minutes: 1, note: "For documented hypoglycemia." },
  { id: "thiamine", label: "Give IV thiamine", category: "treat", minutes: 1, note: "Before or with glucose when thiamine deficiency is possible." },
  { id: "intubation", label: "Secure the airway (intubation)", category: "stabilize", minutes: 10, note: "For failing airway protection or ventilation." },
  { id: "icu", label: "Admit to ICU or high-dependency monitoring", category: "disposition", minutes: 5, note: "For patients at risk of rapid deterioration." },
  { id: "thrombolysis", label: "IV thrombolysis", category: "treat", minutes: 5, note: "Eligibility depends on timing, imaging excluding hemorrhage, and contraindications." },
  { id: "thrombectomy", label: "Activate endovascular thrombectomy", category: "treat", minutes: 5, note: "For anterior circulation large vessel occlusion within selection criteria." },
  { id: "bp-lowering", label: "Lower blood pressure to a target", category: "treat", minutes: 2, note: "Targets depend on context (for example before thrombolysis, or in hemorrhage)." },
  { id: "antiplatelet", label: "Start antiplatelet therapy", category: "treat", minutes: 1, note: "After hemorrhage is excluded; timing differs after thrombolysis." },
  { id: "anticoagulation", label: "Start anticoagulation", category: "treat", minutes: 1, note: "Indication specific." },
  { id: "reverse-anticoagulation", label: "Reverse anticoagulation", category: "treat", minutes: 3, note: "For hemorrhage on anticoagulants." },
  { id: "npo-swallow", label: "Nil by mouth until swallow screen", category: "monitor", minutes: 1, note: "Reduces aspiration risk after stroke or with bulbar weakness." },
  { id: "stroke-unit", label: "Admit to stroke unit", category: "disposition", minutes: 2, note: "Organized stroke unit care improves outcomes." },
  { id: "empiric-meningitis-abx", label: "Empiric bacterial meningitis antibiotics", category: "treat", minutes: 2, note: "Regimen depends on age, immune status, and local resistance (for example a third-generation cephalosporin plus vancomycin, with ampicillin when Listeria is a concern)." },
  { id: "dexamethasone", label: "Adjunctive dexamethasone", category: "treat", minutes: 1, note: "In suspected bacterial meningitis, given before or with the first antibiotic dose." },
  { id: "acyclovir", label: "Empiric IV acyclovir", category: "treat", minutes: 2, note: "When HSV encephalitis is possible, without waiting for PCR." },
  { id: "droplet-precautions", label: "Droplet precautions", category: "monitor", minutes: 1, note: "Until meningococcal infection is excluded or treated." },
  { id: "benzodiazepine", label: "Benzodiazepine for ongoing seizure", category: "treat", minutes: 1, note: "First-line therapy for status epilepticus." },
  { id: "second-line-asm", label: "Second-line IV antiseizure medication", category: "treat", minutes: 5, note: "Levetiracetam, fosphenytoin, or valproate when seizures persist after benzodiazepines." },
  { id: "anesthetic-infusion", label: "Anesthetic infusion with continuous EEG", category: "treat", minutes: 10, note: "For refractory status epilepticus." },
  { id: "start-asm", label: "Start long-term antiseizure medication", category: "treat", minutes: 2, note: "Decision depends on recurrence risk, patient values, and evidence." },
  { id: "safety-counsel", label: "Safety and driving counseling", category: "monitor", minutes: 3, note: "Required after a seizure or episode of loss of consciousness; rules vary by jurisdiction." },
  { id: "ivig", label: "Intravenous immunoglobulin", category: "treat", minutes: 5, note: "Immunotherapy for selected immune-mediated neuromuscular and CNS disorders." },
  { id: "plasma-exchange", label: "Plasma exchange", category: "treat", minutes: 10, note: "Removes circulating antibodies; alternative to IVIG in several disorders." },
  { id: "high-dose-steroids", label: "High-dose IV corticosteroids", category: "treat", minutes: 2, note: "Indicated in some inflammatory disorders; not beneficial in Guillain-Barre syndrome." },
  { id: "pyridostigmine", label: "Pyridostigmine", category: "treat", minutes: 1, note: "Symptomatic acetylcholinesterase inhibitor for myasthenia gravis." },
  { id: "avoid-nmj-drugs", label: "Review and stop drugs that worsen neuromuscular transmission", category: "treat", minutes: 2, note: "For example some antibiotics (aminoglycosides, fluoroquinolones, macrolides), magnesium, beta blockers." },
  { id: "tumor-removal", label: "Refer for tumor removal", category: "consult", minutes: 3, note: "When a tumor is driving a paraneoplastic or autoimmune syndrome." },
  { id: "neurosurgery", label: "Urgent neurosurgical consultation", category: "consult", minutes: 3, note: "For compressive or surgical lesions." },
  { id: "spinal-dexamethasone", label: "Dexamethasone for spinal cord compression", category: "treat", minutes: 1, note: "For suspected malignant compression with neurological deficit." },
  { id: "catheter", label: "Bladder catheterization", category: "monitor", minutes: 3, note: "For urinary retention." },
  { id: "neurology-consult", label: "Neurology consultation", category: "consult", minutes: 2, note: "Specialist input." },
  { id: "admit-observe", label: "Admit for observation", category: "disposition", minutes: 2, note: "When deterioration is possible or workup cannot be completed safely as an outpatient." },
  { id: "discharge-followup", label: "Discharge with outpatient follow-up", category: "disposition", minutes: 2, note: "Only when serious causes are reasonably excluded and safety-netting is in place." },
  { id: "respiratory-monitoring", label: "Serial vital capacity and respiratory monitoring", category: "monitor", minutes: 2, note: "Neuromuscular respiratory failure can occur with normal oxygen saturation." },
  { id: "dvt-prophylaxis", label: "VTE prophylaxis", category: "monitor", minutes: 1, note: "For immobile inpatients." },
];

export const ACTION_BY_ID = new Map(ACTIONS.map((a) => [a.id, a]));

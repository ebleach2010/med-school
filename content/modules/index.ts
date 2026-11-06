// Registry of module files. Each exports CONTENT (null while the module is still planned).

import type { ModuleContent } from "./types";
import { CONTENT as fTerminology } from "./f-terminology";
import { CONTENT as fCells } from "./f-cells";
import { CONTENT as fCranialNervesAll } from "./f-cranial-nerves-all";
import { CONTENT as fSensoryVisualVestibular } from "./f-sensory-visual-vestibular";
import { CONTENT as fAutonomicPathways } from "./f-autonomic-pathways";
import { CONTENT as xMentalStatus } from "./x-mental-status";
import { CONTENT as xCnExam } from "./x-cn-exam";
import { CONTENT as xMotorSensoryExam } from "./x-motor-sensory-exam";
import { CONTENT as xCoordinationGait } from "./x-coordination-gait";
import { CONTENT as xComa } from "./x-coma";
import { CONTENT as xSymptomsSigns } from "./x-symptoms-signs";
import { CONTENT as cIchSah } from "./c-ich-sah";
import { CONTENT as cTiaSecondary } from "./c-tia-secondary";
import { CONTENT as cCvtDissection } from "./c-cvt-dissection";
import { CONTENT as cEpilepsyMimics } from "./c-epilepsy-mimics";
import { CONTENT as cHeadache } from "./c-headache";
import { CONTENT as cParaneoplastic } from "./c-paraneoplastic";
import { CONTENT as cMs } from "./c-ms";
import { CONTENT as cNmosdMogad } from "./c-nmosd-mogad";
import { CONTENT as cEncephalitisViral } from "./c-encephalitis-viral";
import { CONTENT as cMyopathyMnd } from "./c-myopathy-mnd";
import { CONTENT as cPolyneuropathyRadiculopathy } from "./c-polyneuropathy-radiculopathy";
import { CONTENT as cParkinsonism } from "./c-parkinsonism";
import { CONTENT as cDementia } from "./c-dementia";
import { CONTENT as cRpd } from "./c-rpd";
import { CONTENT as cAutonomic } from "./c-autonomic";
import { CONTENT as cVertigoVision } from "./c-vertigo-vision";
import { CONTENT as cSleep } from "./c-sleep";
import { CONTENT as cNeuroOncology } from "./c-neuro-oncology";
import { CONTENT as cToxicNutritional } from "./c-toxic-nutritional";
import { CONTENT as cSpinalEmergencies } from "./c-spinal-emergencies";
import { CONTENT as cNeurocritical } from "./c-neurocritical";
import { CONTENT as cFnd } from "./c-fnd";
import { CONTENT as cPediatric } from "./c-pediatric";
import { CONTENT as cNeuropsychiatry } from "./c-neuropsychiatry";
import { CONTENT as aAtypicalOverlap } from "./a-atypical-overlap";
import { CONTENT as aMultipleDx } from "./a-multiple-dx";
import { CONTENT as aIncidental } from "./a-incidental";
import { CONTENT as aReviseEscalate } from "./a-revise-escalate";

const ALL: (ModuleContent | null)[] = [
  fTerminology,
  fCells,
  fCranialNervesAll,
  fSensoryVisualVestibular,
  fAutonomicPathways,
  xMentalStatus,
  xCnExam,
  xMotorSensoryExam,
  xCoordinationGait,
  xComa,
  xSymptomsSigns,
  cIchSah,
  cTiaSecondary,
  cCvtDissection,
  cEpilepsyMimics,
  cHeadache,
  cParaneoplastic,
  cMs,
  cNmosdMogad,
  cEncephalitisViral,
  cMyopathyMnd,
  cPolyneuropathyRadiculopathy,
  cParkinsonism,
  cDementia,
  cRpd,
  cAutonomic,
  cVertigoVision,
  cSleep,
  cNeuroOncology,
  cToxicNutritional,
  cSpinalEmergencies,
  cNeurocritical,
  cFnd,
  cPediatric,
  cNeuropsychiatry,
  aAtypicalOverlap,
  aMultipleDx,
  aIncidental,
  aReviseEscalate,
];

/** Modules that have been written, in curriculum order. */
export const BUILT_MODULES: ModuleContent[] = ALL.filter((m): m is ModuleContent => m !== null);

import type { AnimationId } from "../../shared/types";
import { MotorPathway } from "./MotorPathway";
import { NMJ } from "./NMJ";
import { Conduction } from "./Conduction";
import { VascularTerritories } from "./VascularTerritories";
import { EyeMovements } from "./EyeMovements";
import { SeizureEEG } from "./SeizureEEG";

export const ANIMATION_TITLES: Record<AnimationId, string> = {
  "motor-pathway": "Neuraxis lesion explorer",
  nmj: "Neuromuscular junction comparator",
  conduction: "Conduction explorer",
  "vascular-territories": "Vascular territory map",
  "eye-movements": "Eye movement simulator",
  "seizure-eeg": "Seizure spread and schematic EEG",
};

export function Animation({ id, preset }: { id: AnimationId; preset?: string }) {
  switch (id) {
    case "motor-pathway":
      return <MotorPathway preset={preset} />;
    case "nmj":
      return <NMJ />;
    case "conduction":
      return <Conduction />;
    case "vascular-territories":
      return <VascularTerritories />;
    case "eye-movements":
      return <EyeMovements />;
    case "seizure-eeg":
      return <SeizureEEG />;
  }
}

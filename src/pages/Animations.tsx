import { useState } from "react";
import type { AnimationId } from "../../shared/types";
import { Animation, ANIMATION_TITLES } from "../animations";

export function Animations() {
  const [id, setId] = useState<AnimationId>("motor-pathway");
  return (
    <div className="stack">
      <h1>Interactive models</h1>
      <p className="small muted">Simplified schematic models for building intuition. None show real patient data.</p>
      <div className="row" role="group" aria-label="Model">
        {(Object.keys(ANIMATION_TITLES) as AnimationId[]).map((k) => (
          <button key={k} className={`chip ${id === k ? "selected" : ""}`} aria-pressed={id === k} onClick={() => setId(k)}>
            {ANIMATION_TITLES[k]}
          </button>
        ))}
      </div>
      <Animation key={id} id={id} preset={id === "motor-pathway" ? "level" : undefined} />
    </div>
  );
}

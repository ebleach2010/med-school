import { useState } from "react";
import type { AnimationId } from "../../shared/types";
import { Link } from "react-router-dom";
import { Animation, ANIMATION_TITLES } from "../animations";
import { Icon } from "../components/Icon";

export function Animations() {
  const [id, setId] = useState<AnimationId>("motor-pathway");
  return (
    <div className="stack">
      <Link to="/learn" className="crumb">
        <Icon name="back" /> Learn
      </Link>
      <div>
        <h1>Interactive models</h1>
        <p className="small faint" style={{ margin: 0 }}>Simplified schematics for building intuition. None show real patient data.</p>
      </div>
      <div className="row" role="group" aria-label="Model">
        {(Object.keys(ANIMATION_TITLES) as AnimationId[]).map((k) => (
          <button key={k} className="chip" aria-pressed={id === k} onClick={() => setId(k)}>
            {ANIMATION_TITLES[k]}
          </button>
        ))}
      </div>
      <Animation key={id} id={id} preset={id === "motor-pathway" ? "level" : undefined} />
    </div>
  );
}

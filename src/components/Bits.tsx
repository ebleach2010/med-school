import type { StarAward } from "../../shared/types";

export function Stars({ stars, size = 16 }: { stars: StarAward[]; size?: number }) {
  const have = new Set(stars.map((s) => s.star));
  const labels = ["Understand and recognize", "Apply to a new case", "Delayed retention and transfer"];
  return (
    <span className="stars" role="img" aria-label={`${have.size} of 3 stars`}>
      {[1, 2, 3].map((n) => (
        <svg key={n} width={size} height={size} viewBox="0 0 24 24" className={have.has(n as 1 | 2 | 3) ? "on" : ""} aria-hidden="true">
          <title>{`Star ${n}: ${labels[n - 1]}${have.has(n as 1 | 2 | 3) ? " (earned)" : ""}`}</title>
          <path fill="currentColor" d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 20.9l1.6-7L2 9.2l7.1-.6z" />
        </svg>
      ))}
    </span>
  );
}

export function Bar({ value, tone = "teal", label }: { value: number; tone?: "teal" | "blue" | "green"; label: string }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <div className={`bar ${tone}`} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <span style={{ width: `${pct}%` }} />
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    demonstrated: ["green", "Demonstrated"],
    developing: ["blue", "Developing"],
    uncertain: ["amber", "Needs more evidence"],
    gap: ["red", "Gap"],
    unassessed: ["gray", "Not assessed"],
    complete: ["green", "Complete"],
    partial: ["amber", "Partial"],
    planned: ["gray", "Planned"],
    done: ["green", "Done"],
    "tested-out": ["green", "Tested out"],
    "can-skip": ["teal", "Can test out"],
    remediate: ["red", "Gap: start here"],
    next: ["blue", "Ready"],
    locked: ["gray", "After prerequisites"],
  };
  const [tone, label] = map[status] ?? ["gray", status];
  return <span className={`badge ${tone}`}>{label}</span>;
}

export function ErrorNote({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <div className="feedback bad" role="alert">
      {error}
    </div>
  );
}

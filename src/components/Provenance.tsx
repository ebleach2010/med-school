import { useState } from "react";
import type { ContentMeta, Provenance as P, ReviewState } from "../../shared/types";
import { SOURCE_BY_ID } from "../lib/content";
import { useReviewOverrides } from "../lib/hooks";

export function effectiveReview(meta: Pick<ContentMeta, "id" | "version" | "review">, overrides: ReturnType<typeof useReviewOverrides>): { status: ReviewState; reviewer?: string; date?: string } {
  const o = overrides[meta.id];
  if (o && o.version === meta.version) return { status: o.status, reviewer: o.reviewer, date: new Date(o.ts).toISOString().slice(0, 10) };
  return { status: meta.review };
}

export function ReviewBadge({ provenance, status }: { provenance: P; status: ReviewState }) {
  if (provenance === "synthetic")
    return (
      <span className="badge teal" title="Simulated teaching example, not a real patient">
        Synthetic example
      </span>
    );
  if (provenance === "adapted-published") return <span className="badge blue">Adapted published case</span>;
  if (status === "reviewed") return <span className="badge green">Reviewed</span>;
  if (status === "changes-requested") return <span className="badge red">Changes requested</span>;
  return (
    <span className="badge amber" title="Drafted by AI from the cited sources; not yet reviewed by a clinician">
      AI draft, awaiting review
    </span>
  );
}

/** Compact evidence line: review status, verification date, expandable sources. */
export function ProvenanceLine({ meta }: { meta: ContentMeta }) {
  const overrides = useReviewOverrides();
  const [open, setOpen] = useState(false);
  const r = effectiveReview(meta, overrides);
  const sources = meta.sources.map((id) => SOURCE_BY_ID.get(id)).filter(Boolean);
  return (
    <div className="prov">
      <ReviewBadge provenance={meta.provenance} status={r.status} />
      {r.reviewer && <span>by {r.reviewer}, {r.date}</span>}
      <span>Checked {meta.lastVerified}</span>
      <span aria-hidden="true">·</span>
      <button className="linkish" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {sources.length ? `${sources.length} source${sources.length > 1 ? "s" : ""}` : "No citation"}
      </button>
      {open && (
        <ul>
          {sources.map((s) => (
            <li key={s!.id}>
              <a href={s!.url} target="_blank" rel="noreferrer">
                {s!.citation}
              </a>
            </li>
          ))}
          {!sources.length && <li className="muted">No registry source is attached to this item yet. Treat it as general teaching pending review.</li>}
        </ul>
      )}
    </div>
  );
}

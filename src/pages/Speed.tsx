import { useEffect, useMemo, useState } from "react";
import type { EncounterView } from "../lib/encounterTypes";
import { api } from "../lib/api";
import { useLearner, update, recordAttempt, setResume } from "../lib/store";
import { INTENTS, MANEUVERS, INVESTIGATIONS } from "../lib/content";
import { now } from "../../shared/clock";
import { EventItem } from "./Encounter";
import { gradeToAttempts } from "../lib/caseAttempts";
import { ErrorNote } from "../components/Bits";
import { ReviewBadge } from "../components/Provenance";

type Kind = "history" | "exam" | "investigation";

function requestName(kind: Kind, id: string): string {
  if (kind === "history") return INTENTS.find((i) => i.id === id)?.ask ?? id;
  if (kind === "exam") return MANEUVERS.find((m) => m.id === id)?.label ?? id;
  return INVESTIGATIONS.find((i) => i.id === id)?.name ?? id;
}

export function anyName(id: string): string {
  return INVESTIGATIONS.find((i) => i.id === id)?.name ?? MANEUVERS.find((m) => m.id === id)?.label ?? INTENTS.find((i) => i.id === id)?.label ?? id;
}

/** One speed case at a time. Used by the Speed page and by timed sessions. */
export function SpeedRunner({ onNext, count }: { onNext?: () => void; count?: number }) {
  const s = useLearner();
  const [v, setV] = useState<EncounterView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [kind, setKind] = useState<Kind>("history");
  const [pick, setPick] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [dx, setDx] = useState("");
  const [busy, setBusy] = useState(false);
  const [played, setPlayed] = useState(0);
  const [seen, setSeen] = useState<string[]>(() => {
    try {
      return JSON.parse(sessionStorage.getItem("nt-speed-seen") ?? "[]");
    } catch {
      return [];
    }
  });

  const next = async () => {
    setError(null);
    setPick(null);
    setDx("");
    setQ("");
    try {
      const r = await api<EncounterView & { caseId: string }>("/api/speed/next", { method: "POST", json: { exclude: seen.slice(-15), profileId: s.profileId } });
      setV(r);
      const ns = [...seen, r.caseId];
      setSeen(ns);
      try {
        sessionStorage.setItem("nt-speed-seen", JSON.stringify(ns));
      } catch {
        // ignore
      }
    } catch (e) {
      setError((e as Error).message);
    }
  };

  useEffect(() => {
    void next();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const options = useMemo(() => {
    const ql = q.trim().toLowerCase();
    const list =
      kind === "history"
        ? INTENTS.map((i) => ({ id: i.id, name: i.label, detail: i.ask }))
        : kind === "exam"
          ? MANEUVERS.map((m) => ({ id: m.id, name: m.label, detail: m.tests }))
          : INVESTIGATIONS.map((i) => ({ id: i.id, name: i.name, detail: i.bundle?.length ? `Bundle: ${i.bundle.join(", ")}` : i.question, aliases: i.aliases }));
    return list.filter((o) => !ql || o.name.toLowerCase().includes(ql) || ("aliases" in o && (o.aliases as string[]).some((a) => a.toLowerCase().includes(ql))));
  }, [kind, q]);

  const request = async () => {
    if (!v || !pick) return;
    setBusy(true);
    try {
      setV(await api<EncounterView>(`/api/encounters/${v.id}/speed-request`, { method: "POST", json: { kind, id: pick } }));
      setPick(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const submit = async (skip: boolean) => {
    if (!v) return;
    setBusy(true);
    try {
      const r = await api<EncounterView>(`/api/encounters/${v.id}/speed-submit`, { method: "POST", json: { diagnosis: dx, skip } });
      setV({ ...r, caseId: v.caseId });
      if (r.grade && !skip) for (const a of gradeToAttempts(v.caseId ?? v.id, r.grade, "speed")) recordAttempt(a);
      update((x) => ({ ...x, encounters: { ...x.encounters, [v.id]: { caseLabel: v.case.label, mode: "speed", startedAt: now(), submitted: true } } }));
      setPlayed((p) => p + 1);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (error && !v) return <ErrorNote error={error} />;
  if (!v) return <p className="muted">Loading a case...</p>;
  const used = v.requestsUsed;
  const limit = v.requestLimit ?? 2;
  const done = v.status === "submitted";
  const pickedInv = kind === "investigation" && pick ? INVESTIGATIONS.find((i) => i.id === pick) : undefined;

  return (
    <div className="stack">
      <div className="row between">
        <span className="row">
          <strong>{v.case.label}</strong>
          <ReviewBadge provenance={v.case.provenance} status={v.case.review} />
        </span>
        <span className="badge blue" aria-live="polite">
          Requests: {used} of {limit}
        </span>
      </div>
      <div className="timeline">
        {v.events.map((e, i) => (
          <EventItem key={i} e={e} />
        ))}
      </div>
      <ErrorNote error={error} />

      {!done && (
        <>
          {used < limit ? (
            <div className="card stack">
              <div className="tabs" role="tablist" style={{ marginBottom: 0 }}>
                {(["history", "exam", "investigation"] as Kind[]).map((k) => (
                  <button key={k} role="tab" aria-selected={kind === k} onClick={() => { setKind(k); setPick(null); setQ(""); }}>
                    {k === "history" ? "History" : k === "exam" ? "Exam" : "Investigation"}
                  </button>
                ))}
              </div>
              <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" aria-label="Search requests" />
              <div style={{ maxHeight: 220, overflow: "auto" }} role="listbox" aria-label="Requests">
                {options.map((o) => (
                  <button key={o.id} role="option" aria-selected={pick === o.id} className={`option ${pick === o.id ? "selected" : ""}`} onClick={() => setPick(o.id)}>
                    <span>
                      <strong>{o.name}</strong>
                      <span className="tiny muted" style={{ display: "block" }}>{o.detail}</span>
                    </span>
                  </button>
                ))}
              </div>
              {pick && (
                <div className="notice">
                  <strong>This request:</strong> {requestName(kind, pick)}. <strong>Cost: 1 request</strong>
                  {pickedInv?.bundle?.length ? ` (bundle counts as one: ${pickedInv.bundle.join(", ")})` : ""}. {limit - used - 1} left after this.
                </div>
              )}
              <button className="btn primary" disabled={!pick || busy} onClick={request}>
                Use request
              </button>
            </div>
          ) : (
            <p className="small muted">Both requests used. Make your call.</p>
          )}
          <div className="card stack">
            <label className="field" htmlFor="speed-dx">Diagnosis</label>
            <input id="speed-dx" className="input" value={dx} onChange={(e) => setDx(e.target.value)} onKeyDown={(e) => e.key === "Enter" && dx.trim() && submit(false)} placeholder="Your diagnosis" />
            <div className="row">
              <button className="btn primary" disabled={!dx.trim() || busy} onClick={() => submit(false)}>
                Submit
              </button>
              <button className="btn ghost" disabled={busy} onClick={() => submit(true)}>
                Skip and show answer
              </button>
            </div>
          </div>
        </>
      )}

      {done && v.grade && (
        <div className={`feedback ${v.grade.dimensions.diagnosis.score >= 0.8 ? "good" : v.grade.dimensions.diagnosis.score > 0 ? "partial" : "bad"}`} aria-live="polite">
          <strong>{v.grade.dimensions.diagnosis.summary}</strong> <span>{v.grade.debrief.diagnosisLabel}</span>
          {v.grade.dimensions.diagnosis.details.slice(0, 1).map((d, i) => (
            <p key={i} className="small" style={{ margin: "4px 0" }}>{d}</p>
          ))}
          <p className="small" style={{ margin: "4px 0" }}>{v.grade.debrief.speedExplanation}</p>
          {v.grade.debrief.highYield && <p className="small" style={{ margin: 0 }}><span className="muted">Highest-yield requests:</span> {v.grade.debrief.highYield.map(anyName).join(", ")}</p>}
          <div className="row" style={{ marginTop: 8 }}>
            {count && played >= count ? (
              <button className="btn primary" onClick={onNext} autoFocus>
                Continue
              </button>
            ) : (
              <button className="btn primary" onClick={() => void next()} autoFocus>
                Next case
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function Speed() {
  useEffect(() => setResume("/speed", "Speed round"), []);
  return (
    <div className="stack">
      <h1>Two-question speed round</h1>
      <p className="small muted">Two requests, then commit. No hints until you answer. Bundled panels count as one request.</p>
      <SpeedRunner />
    </div>
  );
}

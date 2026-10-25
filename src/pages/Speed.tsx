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
import { FocusShell, useFocusProgress, useFocusScroll } from "../components/FocusShell";
import { Icon } from "../components/Icon";
import { useNavigate } from "react-router-dom";

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
  const scrollTop = useFocusScroll();
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

  const used = v?.requestsUsed ?? 0;
  const limit = v?.requestLimit ?? 2;
  const done = v?.status === "submitted";
  useFocusProgress(count ? (played + (done ? 0 : used / (limit + 1))) / count : (used + (done ? 1 : 0)) / (limit + 1), count ? `${Math.min(played + (done ? 0 : 1), count)}/${count}` : `Case ${played + (done ? 0 : 1)}`);

  if (error && !v) return <ErrorNote error={error} />;
  if (!v) return <p className="muted">Loading a case...</p>;
  const pickedInv = kind === "investigation" && pick ? INVESTIGATIONS.find((i) => i.id === pick) : undefined;
  const dxScore = v.grade?.dimensions.diagnosis.score ?? 0;
  const tone = dxScore >= 0.8 ? "good" : dxScore > 0 ? "partial" : "bad";

  return (
    <div>
      <div className="row between nowrap" style={{ marginBottom: 8 }}>
        <span className="focus-label" style={{ margin: 0 }}>
          Speed round
        </span>
        <span className="row nowrap small" style={{ gap: 6, fontWeight: 800, color: "var(--text-3)" }} aria-live="polite" aria-label={`${limit - used} of ${limit} requests left`}>
          {Array.from({ length: limit }, (_, k) => (
            <span key={k} style={{ width: 12, height: 12, borderRadius: 6, background: k < limit - used ? "var(--amber)" : "var(--surface-3)" }} />
          ))}
          {limit - used} left
        </span>
      </div>
      <div className="card tight">
        <div className="row between" style={{ marginBottom: 8 }}>
          <strong>{v.case.label}</strong>
          <ReviewBadge provenance={v.case.provenance} status={v.case.review} />
        </div>
        <div className="timeline">
          {v.events.map((e, i) => (
            <EventItem key={i} e={e} />
          ))}
        </div>
      </div>
      <ErrorNote error={error} />

      {!done && used < limit && (
        <div className="section">
          <h2 className="q" style={{ margin: "0 0 10px" }}>
            What one thing do you want to know?
          </h2>
          <div className="seg block" role="tablist" aria-label="Request type" style={{ marginBottom: 8 }}>
            {(["history", "exam", "investigation"] as Kind[]).map((k) => (
              <button key={k} role="tab" aria-selected={kind === k} onClick={() => { setKind(k); setPick(null); setQ(""); }}>
                {k === "history" ? "History" : k === "exam" ? "Exam" : "Test"}
              </button>
            ))}
          </div>
          <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" aria-label="Search requests" />
          <div className="list" style={{ maxHeight: 260, overflow: "auto", marginTop: 8 }} role="listbox" aria-label="Requests">
            {options.map((o) => (
              <button key={o.id} role="option" aria-selected={pick === o.id} className={`list-row ${pick === o.id ? "current" : ""}`} style={{ minHeight: 48, padding: "8px 12px" }} onClick={() => setPick(o.id)}>
                <div className="grow">
                  <div className="title small">{o.name}</div>
                  <div className="sub">{o.detail}</div>
                </div>
                {pick === o.id && (
                  <span style={{ color: "var(--blue)" }}>
                    <Icon name="check" size={18} />
                  </span>
                )}
              </button>
            ))}
          </div>
          {pick && (
            <div className="row nowrap" style={{ marginTop: 10 }}>
              <div className="grow small muted">
                {requestName(kind, pick)}
                {pickedInv?.bundle?.length ? ` (bundle counts as one: ${pickedInv.bundle.join(", ")})` : ""}
              </div>
              <button className="btn primary small" disabled={busy} onClick={request}>
                Ask (1 request)
              </button>
            </div>
          )}
        </div>
      )}

      {done && v.grade && (
        <div className="explain-box">
          <h3>Why</h3>
          {v.grade.dimensions.diagnosis.details.slice(0, 1).map((d, i) => (
            <p key={i}>{d}</p>
          ))}
          <p>{v.grade.debrief.speedExplanation}</p>
          {v.grade.debrief.highYield && (
            <p className="small" style={{ margin: 0 }}>
              <span className="faint">Highest-yield requests:</span> {v.grade.debrief.highYield.map(anyName).join(", ")}
            </p>
          )}
        </div>
      )}

      {!done && (
        <div className="check-bar">
          <div className="check-inner">
            {used >= limit && <div className="small faint">Both requests used. Make your call.</div>}
            <div className="check-row">
              <input id="speed-dx" className="input" style={{ flex: 2 }} value={dx} onChange={(e) => setDx(e.target.value)} onKeyDown={(e) => e.key === "Enter" && dx.trim() && submit(false)} placeholder="Your diagnosis" aria-label="Your diagnosis" />
              <button className="btn green" disabled={!dx.trim() || busy} onClick={() => submit(false)}>
                Check
              </button>
            </div>
            <button className="linkish small" style={{ alignSelf: "center" }} disabled={busy} onClick={() => submit(true)}>
              Skip and show the answer
            </button>
          </div>
        </div>
      )}

      {done && v.grade && (
        <div className={`check-bar ${tone}`} aria-live="polite">
          <div className="check-inner">
            <div className="verdict">
              <span className="vi">
                <Icon name={tone === "good" ? "check" : "x"} />
              </span>
              <div className="grow">
                <strong>{v.grade.dimensions.diagnosis.summary}</strong>
                <div className="vt">{v.grade.debrief.diagnosisLabel}</div>
              </div>
            </div>
            <div className="check-row">
              {count && played >= count ? (
                <button className={`btn lg ${tone === "good" ? "green" : tone === "partial" ? "primary" : "red"}`} onClick={onNext} autoFocus>
                  Continue
                </button>
              ) : (
                <button className={`btn lg ${tone === "good" ? "green" : tone === "partial" ? "primary" : "red"}`} onClick={() => { scrollTop(); void next(); }} autoFocus>
                  Next case
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Speed() {
  const nav = useNavigate();
  useEffect(() => setResume("/speed", "Speed round"), []);
  return (
    <FocusShell closeTo="/">
      <SpeedRunner onNext={() => nav("/")} />
    </FocusShell>
  );
}

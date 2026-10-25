import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLearner, update, exportState, importState, resetState, pullFromServer, lastSync } from "../lib/store";
import { api } from "../lib/api";
import { useAIStatus, setAIStatus, type AIStatus } from "../lib/hooks";
import { dayKey } from "../../shared/clock";
import { download } from "./Progress";
import { Disclaimer } from "./Today";
import { ErrorNote } from "../components/Bits";
import { STANDALONE } from "../lib/platform";

export function Settings() {
  const s = useLearner();
  const set = (patch: Partial<typeof s.settings>) => update((x) => ({ ...x, settings: { ...x.settings, ...patch } }));
  useEffect(() => {
    const h = window.location.hash.slice(1);
    if (h) document.getElementById(h)?.scrollIntoView();
  }, []);

  return (
    <div className="stack">
      <h1>Settings</h1>

      <section className="card stack" aria-labelledby="pacing">
        <h2 id="pacing">Pacing and display</h2>
        <div className="row">
          <label className="field" htmlFor="len">Default session</label>
          <select id="len" className="input" style={{ width: "auto" }} value={s.settings.sessionMinutes} onChange={(e) => set({ sessionMinutes: Number(e.target.value) as 3 | 5 | 10 | 20 | 0 })}>
            {[3, 5, 10, 20, 0].map((m) => (
              <option key={m} value={m}>{m ? `${m} minutes` : "Unrestricted"}</option>
            ))}
          </select>
        </div>
        <label className="row">
          <input type="checkbox" checked={s.settings.showTimers} onChange={(e) => set({ showTimers: e.target.checked })} /> Show session timer (optional; time is never scored)
        </label>
        <div className="row">
          <label className="field" htmlFor="motion">Motion</label>
          <select id="motion" className="input" style={{ width: "auto" }} value={s.settings.reducedMotion} onChange={(e) => set({ reducedMotion: e.target.value as "system" | "on" | "off" })}>
            <option value="system">Follow system setting</option>
            <option value="on">Reduce motion</option>
            <option value="off">Full animation</option>
          </select>
        </div>
        <div className="row">
          <label className="field" htmlFor="theme">Theme</label>
          <select id="theme" className="input" style={{ width: "auto" }} value={s.settings.theme} onChange={(e) => set({ theme: e.target.value as "system" | "light" | "dark" })}>
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
          <label className="field" htmlFor="scale">Text size</label>
          <select id="scale" className="input" style={{ width: "auto" }} value={s.settings.textScale} onChange={(e) => set({ textScale: Number(e.target.value) as 1 | 1.125 | 1.25 })}>
            <option value={1}>Standard</option>
            <option value={1.125}>Large</option>
            <option value={1.25}>Larger</option>
          </select>
        </div>
      </section>

      {STANDALONE ? <HostedAI /> : <AISettings />}

      <section className="card stack" id="clock" aria-labelledby="clock-h">
        <h2 id="clock-h">Simulated clock (testing)</h2>
        <p className="small muted">Moves the app's clock forward so you can test delayed review, retention decay, and star 3 without waiting. It is shown in the header whenever it is not zero.</p>
        <div className="row">
          <strong>Offset: {s.settings.clockOffsetDays} day{s.settings.clockOffsetDays === 1 ? "" : "s"}</strong>
          {[1, 3, 7, 30].map((d) => (
            <button key={d} className="btn small" onClick={() => set({ clockOffsetDays: s.settings.clockOffsetDays + d })}>
              +{d} d
            </button>
          ))}
          <button className="btn small ghost" onClick={() => set({ clockOffsetDays: 0 })}>
            Reset to real time
          </button>
        </div>
      </section>

      <DataSettings />

      <section className="card stack">
        <h2>About</h2>
        <Disclaimer />
        <p className="small">All patients are synthetic simulations. Content labeled "AI draft, awaiting review" was drafted from cited sources and has not yet been checked by a clinician. <Link to="/admin">Review workspace</Link>.</p>
      </section>
    </div>
  );
}

function HostedAI() {
  const ai = useAIStatus();
  return (
    <section className="card stack" id="ai" aria-labelledby="ai-h">
      <div className="row between">
        <h2 id="ai-h" style={{ margin: 0 }}>AI features</h2>
        <span className={`badge ${ai?.mode === "live" ? "green" : "gray"}`}>{ai?.mode === "live" ? "Available" : "Not available here"}</span>
      </div>
      <p className="small muted">
        On this hosted page the AI tutor and natural patient phrasing use your own Claude account, with no API key. The first use asks your permission and draws on your Claude usage. Everything else (lessons, rule-based patients, grading, review) works without it.
      </p>
      <p className="small muted">API keys, model choice, and the review workspace are part of the self-hosted version of the app.</p>
    </section>
  );
}

function AISettings() {
  const ai = useAIStatus();
  const [key, setKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [test, setTest] = useState<{ ok: boolean; latencyMs?: number; model?: string; error?: string; kind?: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [usage, setUsage] = useState<{ day: { calls: number; cost: number }; month: { calls: number; cost: number; input: number; output: number }; byRole30d: { role: string; calls: number; cost: number }[]; session: { calls: number; cost: number } } | null>(null);

  useEffect(() => {
    api<typeof usage>("/api/ai/usage").then(setUsage).catch(() => undefined);
  }, [test]);

  if (!ai) return <section className="card" id="ai"><h2>AI provider</h2><p className="small muted">The app server is not reachable, so AI settings are unavailable. Offline learning still works.</p></section>;

  const save = async (patch: Partial<AIStatus["settings"]>) => {
    setError(null);
    try {
      setAIStatus(await api<AIStatus>("/api/ai/settings", { method: "PUT", json: patch }));
    } catch (e) {
      setError((e as Error).message);
    }
  };
  const saveKey = async () => {
    setBusy(true);
    setError(null);
    try {
      setAIStatus(await api<AIStatus>("/api/ai/key", { method: "POST", json: { provider: ai.settings.provider, key, baseUrl: baseUrl || undefined } }));
      setKey("");
      setTest(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const runTest = async () => {
    setBusy(true);
    try {
      setTest(await api("/api/ai/test", { method: "POST", json: {} }));
    } catch (e) {
      setTest({ ok: false, error: (e as Error).message });
    } finally {
      setBusy(false);
    }
  };
  const guidance: Record<string, string> = {
    auth: "The key was rejected. Check that it is correct and active.",
    "missing-key": "No key saved. Paste one above.",
    network: "The server could not reach the provider. Check network access.",
    timeout: "The provider took too long. Try again or raise the timeout.",
    rate: "Rate limited by the provider. Wait a minute.",
    limit: "A spending or session limit in these settings was reached.",
  };

  return (
    <section className="card stack" id="ai" aria-labelledby="ai-h">
      <div className="row between">
        <h2 id="ai-h" style={{ margin: 0 }}>AI provider</h2>
        <span className={`badge ${ai.mode === "live" ? "green" : "gray"}`}>{ai.mode === "live" ? "Live" : ai.mode === "disabled" ? "Turned off" : "Demo mode (no key)"}</span>
      </div>
      <p className="small muted">
        Optional. Without a key the app runs fully in demo mode: rule-based patient dialogue, prewritten explanations, and rule-based grading. With a key you get natural patient dialogue, a streaming tutor, semantic answer checking, and AI-drafted content for review. Keys are stored only on the server and are never sent back to the browser.
      </p>
      <ErrorNote error={error} />
      <label className="row">
        <input type="checkbox" checked={ai.settings.enabled} onChange={(e) => save({ enabled: e.target.checked })} /> Enable AI features
      </label>
      <div className="row">
        <label className="field" htmlFor="prov">Provider</label>
        <select id="prov" className="input" style={{ width: "auto" }} value={ai.settings.provider} onChange={(e) => save({ provider: e.target.value as "anthropic" | "openai-compatible" })}>
          <option value="anthropic">Anthropic (Claude)</option>
          <option value="openai-compatible">OpenAI-compatible endpoint</option>
        </select>
      </div>
      <div className="small">
        Saved key: <span className="mono">{ai.maskedKey ?? "none"}</span> {ai.keySource === "env" && <span className="badge gray">from server environment</span>}
      </div>
      <form className="stack" onSubmit={(e) => { e.preventDefault(); void saveKey(); }}>
        <label className="field" htmlFor="key">{ai.maskedKey ? "Replace key" : "API key"}</label>
        <input id="key" className="input" type="password" autoComplete="off" spellCheck={false} value={key} onChange={(e) => setKey(e.target.value)} placeholder="Paste key" />
        {ai.settings.provider === "openai-compatible" && (
          <>
            <label className="field" htmlFor="base">Base URL</label>
            <input id="base" className="input" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder={ai.openaiBaseUrl ?? "https://example.com/v1"} />
          </>
        )}
        <div className="row">
          <button className="btn primary" disabled={busy || key.length < 8}>Save key</button>
          {ai.maskedKey && ai.keySource === "file" && (
            <button type="button" className="btn ghost" onClick={async () => setAIStatus(await api<AIStatus>(`/api/ai/key?provider=${ai.settings.provider}`, { method: "DELETE" }))}>
              Remove key
            </button>
          )}
          <button type="button" className="btn" disabled={busy || ai.mode !== "live"} onClick={runTest}>
            Test connection
          </button>
        </div>
      </form>
      {test && (
        <div className={`feedback ${test.ok ? "good" : "bad"}`} role="status">
          {test.ok ? `Connected to ${test.model} in ${test.latencyMs} ms.` : `${test.error ?? "Failed."} ${test.kind ? guidance[test.kind] ?? "" : ""}`}
        </div>
      )}
      {ai.settings.provider === "anthropic" ? (
        <div className="grid two">
          <div>
            <label className="field" htmlFor="model">Tutor, grader, and authoring model</label>
            <select id="model" className="input" value={ai.settings.model} onChange={(e) => save({ model: e.target.value })}>
              {ai.models.map((m) => (
                <option key={m.id} value={m.id}>{m.label} (${m.inputPerM}/${m.outputPerM} per M tokens)</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field" htmlFor="pmodel">Patient dialogue model</label>
            <select id="pmodel" className="input" value={ai.settings.patientModel} onChange={(e) => save({ patientModel: e.target.value })}>
              {ai.models.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div>
          <label className="field" htmlFor="omodels">Model ids (comma separated; the first is used)</label>
          <input id="omodels" className="input" defaultValue={ai.settings.openaiModels.join(", ")} onBlur={(e) => { const ids = e.target.value.split(",").map((x) => x.trim()).filter(Boolean); void save({ openaiModels: ids, model: ids[0] ?? "", patientModel: ids[0] ?? "" }); }} />
        </div>
      )}
      <div className="grid two">
        <label className="small">
          Timeout (seconds)
          <input className="input" type="number" min={5} max={300} defaultValue={ai.settings.timeoutMs / 1000} onBlur={(e) => save({ timeoutMs: Number(e.target.value) * 1000 })} />
        </label>
        <label className="small">
          Retries
          <input className="input" type="number" min={0} max={5} defaultValue={ai.settings.maxRetries} onBlur={(e) => save({ maxRetries: Number(e.target.value) })} />
        </label>
        <label className="small">
          AI calls per browser session
          <input className="input" type="number" min={1} max={1000} defaultValue={ai.settings.sessionCallLimit} onBlur={(e) => save({ sessionCallLimit: Number(e.target.value) })} />
        </label>
        <label className="small">
          Daily estimated cost limit (USD)
          <input className="input" type="number" min={0} step={0.5} defaultValue={ai.settings.dailyCostLimitUsd} onBlur={(e) => save({ dailyCostLimitUsd: Number(e.target.value) })} />
        </label>
      </div>
      {usage && (
        <div className="small">
          <strong>Usage (estimated cost)</strong>
          <div>This session: {usage.session.calls} calls, ${usage.session.cost.toFixed(4)}</div>
          <div>Last 24 hours: {usage.day.calls} calls, ${usage.day.cost.toFixed(4)}</div>
          <div>Last 30 days: {usage.month.calls} calls, {usage.month.input + usage.month.output} tokens, ${usage.month.cost.toFixed(4)}</div>
          {usage.byRole30d.length > 0 && <div className="muted">By role: {usage.byRole30d.map((r) => `${r.role} ${r.calls}`).join(", ")}</div>}
          <div className="tiny muted">Costs use a pricing snapshot and are estimates. Check your provider's billing for actual charges.</div>
        </div>
      )}
    </section>
  );
}

function DataSettings() {
  const s = useLearner();
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const copyExport = async () => {
    try {
      await navigator.clipboard.writeText(exportState());
      setMsg("Progress copied. Paste it into a file or note to keep a backup.");
    } catch {
      setMsg("Copying is blocked here. Use Export instead.");
    }
  };
  return (
    <section className="card stack" id="data" aria-labelledby="data-h">
      <h2 id="data-h">Your data</h2>
      {STANDALONE ? (
        <p className="small muted">Progress saves after every answer, in this browser and to your Claude account, so it follows you to other devices where you open this page signed in.</p>
      ) : (
        <>
          <p className="small muted">Progress is saved in this browser after every answer and synced to the app server. To continue on another device, enter this sync code there.</p>
          <div className="row">
            <span className="small">Sync code:</span>
            <code className="mono small" style={{ wordBreak: "break-all" }}>{s.profileId}</code>
            <button className="btn small" onClick={() => navigator.clipboard?.writeText(s.profileId)}>Copy</button>
          </div>
          <div className="tiny muted">{lastSync ? `Last server sync ${lastSync.ok ? "succeeded" : "failed (will retry)"} at ${new Date(lastSync.at).toLocaleTimeString()}.` : "Not synced yet this session."}</div>
          <form className="row" onSubmit={async (e) => { e.preventDefault(); const ok = await pullFromServer(code.trim()); setMsg(ok ? "Progress loaded from the sync code." : "No progress found for that code."); }}>
            <input className="input" style={{ flex: 1 }} value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter a sync code from another device" aria-label="Sync code" />
            <button className="btn" disabled={!code.trim()}>Load</button>
          </form>
        </>
      )}
      <div className="row">
        <button className="btn" onClick={async () => setMsg(await download(`neuro-tutor-progress-${dayKey(Date.now())}.json`, exportState()))}>Export</button>
        <button className="btn" onClick={copyExport}>Copy</button>
        <label className="btn">
          Import
          <input type="file" accept="application/json" className="sr-only" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; setMsg(importState(await f.text()) ? "Progress imported." : "That file is not a valid progress export."); }} />
        </label>
        {!confirmReset ? (
          <button className="btn ghost" onClick={() => setConfirmReset(true)}>Reset progress</button>
        ) : (
          <span className="row">
            <span className="small">Erase all progress? Export first if you want a copy.</span>
            <button className="btn small" onClick={() => { resetState(); setConfirmReset(false); setMsg("Progress erased."); }}>Erase</button>
            <button className="btn small ghost" onClick={() => setConfirmReset(false)}>Cancel</button>
          </span>
        )}
      </div>
      {msg && <div className="notice small" role="status">{msg}</div>}
    </section>
  );
}

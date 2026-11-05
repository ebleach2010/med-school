import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { McqItem, SkillId } from "../../shared/types";
import { useLearner } from "../lib/store";
import { api } from "../lib/api";
import { useAIStatus } from "../lib/hooks";
import { MODULES, MODULE_BY_ID } from "../lib/content";
import { buildPath } from "../../shared/recommend";
import { bySkill } from "../../shared/mastery";
import { now } from "../../shared/clock";
import { ItemView, type ItemResult } from "../components/ItemView";
import { ContinueBar, FocusShell } from "../components/FocusShell";
import { Icon } from "../components/Icon";

const STEMS_KEY = "nt-generated-stems";
const COUNT = 5;

function recentStems(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STEMS_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}
function rememberStems(stems: string[]) {
  try {
    localStorage.setItem(STEMS_KEY, JSON.stringify([...recentStems(), ...stems].slice(-30)));
  } catch {
    // ignore
  }
}

/** The module to practice when none is named: the learner's next or weakest module. */
export function defaultPracticeModule(s: ReturnType<typeof useLearner>): string {
  const path = buildPath(MODULES, s, now());
  return (path.find((p) => p.status === "remediate") ?? path.find((p) => p.status === "next") ?? path.find((p) => p.status !== "planned"))?.moduleId ?? MODULES[0].id;
}

/** Fresh AI-written questions on one module, targeted at the learner's weakest abilities. */
export function Practice() {
  const params = useParams();
  const s = useLearner();
  const nav = useNavigate();
  const ai = useAIStatus();
  const moduleId = params.moduleId ?? defaultPracticeModule(s);
  const m = MODULE_BY_ID.get(moduleId);
  const [items, setItems] = useState<McqItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [round, setRound] = useState(0);
  const [i, setI] = useState(0);
  const [results, setResults] = useState<ItemResult[]>([]);
  const started = useRef(-1);

  useEffect(() => {
    if (!m || ai?.mode !== "live" || started.current === round) return;
    started.current = round;
    setItems(null);
    setError(null);
    setI(0);
    setResults([]);
    const skills = bySkill(s.attempts, now());
    const rank = (k: SkillId) => ({ gap: 0, uncertain: 1, unassessed: 2, developing: 3, demonstrated: 4 })[skills[k].status];
    const focusSkills = [...m.skills].sort((a, b) => rank(a) - rank(b)).slice(0, 3);
    api<{ items: McqItem[] }>("/api/generate/questions", { method: "POST", json: { moduleId: m.id, count: COUNT, focusSkills, avoid: recentStems() } })
      .then((r) => {
        rememberStems(r.items.map((x) => x.stem));
        setItems(r.items);
      })
      .catch((e: Error) => setError(e.message));
  }, [m, ai?.mode, round]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!m) return <p>Module not found.</p>;

  if (ai && ai.mode !== "live")
    return (
      <div>
        <Link to={`/learn/${m.id}`} className="crumb">
          <Icon name="back" /> {m.title}
        </Link>
        <div className="done-screen">
          <div className="big-ico amber">
            <Icon name="sparkle" />
          </div>
          <h1>New questions need AI</h1>
          <p className="muted">On the hosted page, open it on claude.ai while signed in. In the self-hosted app, add an API key under Settings, AI provider.</p>
          <Link className="btn primary block lg" to="/settings#ai">
            Open AI settings
          </Link>
        </div>
      </div>
    );

  const total = items?.length ?? COUNT;
  const done = items !== null && i >= items.length;

  return (
    <FocusShell closeTo={`/learn/${m.id}`} progress={items ? i / total : 0} count={items && !done ? `${i + 1}/${total}` : undefined}>
      {!items && !error && (
        <div className="done-screen">
          <div className="big-ico pulse" style={{ background: "var(--blue-soft)", color: "var(--blue)" }}>
            <Icon name="sparkle" />
          </div>
          <h1>Writing new questions</h1>
          <p className="muted">
            {COUNT} questions on {m.title}, aimed at the abilities you are weakest at. This usually takes 15 to 60 seconds.
          </p>
        </div>
      )}
      {error && (
        <>
          <div className="done-screen">
            <div className="big-ico amber">
              <Icon name="info" />
            </div>
            <h1>Could not make questions</h1>
            <p className="muted">{error}</p>
          </div>
          <ContinueBar label="Try again" onClick={() => setRound((r) => r + 1)} secondary={<Link className="btn ghost" to={`/learn/${m.id}`}>Back</Link>} />
        </>
      )}
      {items && !done && (
        <ItemView
          key={items[i].id}
          item={items[i]}
          context="practice"
          label={`New question · ${m.title}`}
          onDone={(r) => {
            setResults((x) => [...x, r]);
            setI(i + 1);
          }}
        />
      )}
      {done && (
        <>
          <div className="done-screen">
            <div className="big-ico">
              <Icon name="check" />
            </div>
            <h1>Set complete</h1>
            <div className="score-row">
              <div className="score">
                <div className="v">
                  {results.filter((r) => r.grade.score >= 0.8).length}/{results.length}
                </div>
                <div className="l">Right</div>
              </div>
            </div>
            <p className="small faint">These questions were written by AI just now and nobody has checked them, so they do not count toward stars or mastery. If one looks wrong, trust the lesson over the question.</p>
          </div>
          <ContinueBar label={`${COUNT} more`} onClick={() => setRound((r) => r + 1)} secondary={<button className="btn ghost" onClick={() => nav(`/learn/${m.id}`)}>Done</button>} />
        </>
      )}
    </FocusShell>
  );
}

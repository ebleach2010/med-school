import { useEffect } from "react";
import { NavLink, Route, Routes, Link, useLocation } from "react-router-dom";
import { useLearner, pullFromServer } from "./lib/store";
import { useAIStatus } from "./lib/hooks";
import { STANDALONE } from "./lib/platform";
import { Today } from "./pages/Today";
import { Placement } from "./pages/Placement";
import { Learn } from "./pages/Learn";
import { ModulePage } from "./pages/ModulePage";
import { LessonPage } from "./pages/LessonPlayer";
import { ReviewPage } from "./pages/Review";
import { Challenge } from "./pages/Challenge";
import { Cases } from "./pages/Cases";
import { Encounter } from "./pages/Encounter";
import { Speed } from "./pages/Speed";
import { Reference } from "./pages/Reference";
import { AntibodyDetail, InvestigationDetail } from "./pages/ReferenceDetail";
import { Progress } from "./pages/Progress";
import { Settings } from "./pages/Settings";
import { Admin } from "./pages/Admin";
import { Session } from "./pages/Session";
import { Animations } from "./pages/Animations";

const NAV = [
  { to: "/", label: "Today", icon: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" },
  { to: "/learn", label: "Learn", icon: "M4 5h7a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM20 5h-7a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h7z" },
  { to: "/cases", label: "Cases", icon: "M8 3h8v3H8zM5 6h14v15H5zM12 10v6M9 13h6" },
  { to: "/reference", label: "Reference", icon: "M5 4h11l3 3v13H5zM9 9h6M9 13h6M9 17h4" },
  { to: "/progress", label: "Progress", icon: "M4 20V10M10 20V4M16 20v-7M22 20H2" },
];

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export function App() {
  const s = useLearner();
  const ai = useAIStatus();
  const loc = useLocation();

  useEffect(() => {
    // The hosted build always checks the account copy, which may be newer than this device's.
    if (STANDALONE || !s.attempts.length) void pullFromServer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    // On a hosted page the viewer sets data-theme itself; leave it alone unless the learner chose one.
    if (s.settings.theme === "system") {
      if (!STANDALONE) root.removeAttribute("data-theme");
    }
    else root.setAttribute("data-theme", s.settings.theme);
    root.style.setProperty("--scale", String(s.settings.textScale));
    if (s.settings.reducedMotion === "on") root.setAttribute("data-motion", "reduce");
    else root.removeAttribute("data-motion");
  }, [s.settings.theme, s.settings.textScale, s.settings.reducedMotion]);

  useEffect(() => {
    document.getElementById("main")?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [loc.pathname]);

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="topbar">
        <Link to="/" className="brand" aria-label="Neuro Tutor home">
          <span className="brand-mark" aria-hidden="true" />
          Neuro Tutor
        </Link>
        <span className="spacer" />
        {s.settings.clockOffsetDays !== 0 && (
          <Link to="/settings#clock" className="badge amber" title="Simulated clock for testing spaced review">
            Clock +{s.settings.clockOffsetDays}d
          </Link>
        )}
        <Link to="/settings#ai" className={`badge ${ai?.mode === "live" ? "green" : "gray"}`} title="AI provider status">
          {ai?.mode === "live" ? "AI live" : ai?.mode === "disabled" ? "AI off" : "Demo mode"}
        </Link>
        <Link to="/settings" className="btn small ghost" aria-label="Settings">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
          </svg>
        </Link>
      </header>
      <nav className="bottomnav" aria-label="Primary">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.to === "/"} className={({ isActive }) => (isActive ? "active" : "")}>
            <Icon d={n.icon} />
            <span>{n.label}</span>
          </NavLink>
        ))}
      </nav>
      <main id="main" className="main" tabIndex={-1} style={{ outline: "none" }}>
        <Routes>
          <Route path="/" element={<Today />} />
          <Route path="/placement" element={<Placement />} />
          <Route path="/session" element={<Session />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:moduleId" element={<ModulePage />} />
          <Route path="/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/challenge/:moduleId" element={<Challenge />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/encounter/:id" element={<Encounter />} />
          <Route path="/speed" element={<Speed />} />
          <Route path="/reference" element={<Reference />} />
          <Route path="/reference/antibody/:id" element={<AntibodyDetail />} />
          <Route path="/reference/investigation/:id" element={<InvestigationDetail />} />
          <Route path="/animations" element={<Animations />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<p>Page not found. <Link to="/">Go to Today</Link>.</p>} />
        </Routes>
      </main>
    </div>
  );
}

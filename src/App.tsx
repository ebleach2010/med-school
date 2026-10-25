import { useEffect } from "react";
import { NavLink, Route, Routes, Link, useLocation } from "react-router-dom";
import { useLearner, pullFromServer } from "./lib/store";
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
import { Icon, type IconName } from "./components/Icon";
import { streakDays } from "../shared/learner";
import { now } from "../shared/clock";

const NAV: { to: string; label: string; icon: IconName }[] = [
  { to: "/", label: "Today", icon: "home" },
  { to: "/learn", label: "Learn", icon: "book" },
  { to: "/cases", label: "Cases", icon: "case" },
  { to: "/reference", label: "Reference", icon: "ref" },
  { to: "/progress", label: "Progress", icon: "chart" },
];

export function App() {
  const s = useLearner();
  const loc = useLocation();
  const streak = streakDays(s.activity, now());

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
          <span className="brand-mark" aria-hidden="true">
            <Icon name="brain" />
          </span>
          Neuro Tutor
        </Link>
        <span className="spacer" />
        {s.settings.clockOffsetDays !== 0 && (
          <Link to="/settings#clock" className="badge amber" title="Simulated clock for testing spaced review">
            Clock +{s.settings.clockOffsetDays}d
          </Link>
        )}
        <Link to="/progress" className={`top-stat flame ${streak.today ? "on" : ""}`} aria-label={`${streak.days} day streak`}>
          <Icon name="flame" />
          {streak.days}
        </Link>
        <Link to="/progress" className="top-stat star" aria-label={`${s.stars.length} stars earned`}>
          <Icon name="star" />
          {s.stars.length}
        </Link>
        <Link to="/settings" className="icon-btn" aria-label="Settings">
          <Icon name="settings" />
        </Link>
      </header>
      <nav className="bottomnav" aria-label="Primary">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.to === "/"} className={({ isActive }) => (isActive || (n.to === "/learn" && /^\/(learn|lesson|challenge)/.test(loc.pathname)) ? "active" : "")}>
            <span className="nav-ico">
              <Icon name={n.icon} />
            </span>
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

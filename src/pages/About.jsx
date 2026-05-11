import { useEffect, useRef, useState } from "react";

/* анимированный счётчик */
function Counter({ target, suffix = "" }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true;
                const duration = 1400;
                const steps = 40;
                const inc = target / steps;
                let current = 0;
                const timer = setInterval(() => {
                    current += inc;
                    if (current >= target) { setCount(target); clearInterval(timer); }
                    else setCount(Math.floor(current));
                }, duration / steps);
            }
        }, { threshold: 0.3 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target]);

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const STACK = [
    { name: "React 19",       color: "#61dafb", bg: "rgba(97,218,251,0.08)",  icon: "⚛" },
    { name: "React Router v6",color: "#f44250", bg: "rgba(244,66,80,0.08)",   icon: "🔀" },
    { name: "Context API",    color: "#a78bfa", bg: "rgba(167,139,250,0.08)", icon: "⚡" },
    { name: "MockAPI",        color: "#3ecf8e", bg: "rgba(62,207,142,0.08)",  icon: "🌐" },
    { name: "localStorage",   color: "#f5a623", bg: "rgba(245,166,35,0.08)",  icon: "💾" },
    { name: "CSS Variables",  color: "#60a5fa", bg: "rgba(96,165,250,0.08)",  icon: "🎨" },
];

const TIMELINE = [
    { phase: "Midterm",  desc: "Basic SPA — routing, components, static layout", color: "var(--text-3)" },
    { phase: "Sprint 1", desc: "MockAPI integration, CRUD, loading & error states", color: "var(--blue)" },
    { phase: "Sprint 2", desc: "Auth context, protected routes, localStorage persistence", color: "var(--accent-text)" },
    { phase: "Sprint 3", desc: "Per-user data isolation, useMemo optimizations, custom hooks", color: "var(--amber)" },
    { phase: "Final",    desc: "Toast system, animations, React.memo, full dashboard", color: "var(--green)" },
];

const VALUES = [
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
        ),
        title: "Clean Architecture",
        text: "Separated concerns — components, hooks, services, context. No logic inside JSX.",
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
            </svg>
        ),
        title: "Real API",
        text: "Every task lives on MockAPI — not in memory. Data persists across sessions and devices.",
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
        ),
        title: "Per-User Isolation",
        text: "Each user sees only their own tasks — tagged with userId on creation, filtered on load.",
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
        ),
        title: "Performance",
        text: "useMemo, useCallback, React.memo — optimized to prevent unnecessary re-renders.",
    },
];

export default function About() {
    return (
        <div className="aboutPage">

            {/* ── Hero ── */}
            <section className="aboutHero card">
                <div className="aboutHeroText">
                    <p className="heroKicker">About</p>
                    <h1 className="aboutHeroTitle">Built to learn.<br />Designed to work.</h1>
                    <p className="aboutHeroSub">
                        BitTask is a semester project for <strong>Frontend Development & React</strong> at bachelor level —
                        built with production-grade patterns: real API, auth, protected routing, custom hooks, and persistent state.
                    </p>
                </div>
                <div className="aboutHeroStats">
                    <div className="aboutStat">
                        <div className="aboutStatNum"><Counter target={9} />+</div>
                        <div className="aboutStatLabel">Routes</div>
                    </div>
                    <div className="aboutStatDivider" />
                    <div className="aboutStat">
                        <div className="aboutStatNum"><Counter target={5} /></div>
                        <div className="aboutStatLabel">Custom Hooks</div>
                    </div>
                    <div className="aboutStatDivider" />
                    <div className="aboutStat">
                        <div className="aboutStatNum"><Counter target={100} />%</div>
                        <div className="aboutStatLabel">TypeScript-free</div>
                    </div>
                </div>
            </section>

            {/* ── Values ── */}
            <section className="aboutValues">
                {VALUES.map((v) => (
                    <div key={v.title} className="aboutValueCard card">
                        <div className="aboutValueIcon">{v.icon}</div>
                        <h3 className="aboutValueTitle">{v.title}</h3>
                        <p className="aboutValueText">{v.text}</p>
                    </div>
                ))}
            </section>

            {/* ── Tech Stack ── */}
            <section className="card aboutStack">
                <h2 className="aboutSectionTitle">Tech Stack</h2>
                <p className="muted" style={{ marginBottom: 20 }}>
                    Every library chosen intentionally — no bloat, no magic.
                </p>
                <div className="stackGrid">
                    {STACK.map((s) => (
                        <div key={s.name} className="stackItem" style={{ "--stack-color": s.color, "--stack-bg": s.bg }}>
                            <span className="stackIcon">{s.icon}</span>
                            <span className="stackName">{s.name}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Timeline ── */}
            <section className="card aboutTimeline">
                <h2 className="aboutSectionTitle">Development Timeline</h2>
                <p className="muted" style={{ marginBottom: 24 }}>From a blank CRA to a production-grade SPA.</p>
                <div className="timeline">
                    {TIMELINE.map((t, i) => (
                        <div key={t.phase} className="timelineItem">
                            <div className="timelineDot" style={{ background: t.color, boxShadow: `0 0 8px ${t.color}` }} />
                            {i < TIMELINE.length - 1 && <div className="timelineLine" />}
                            <div className="timelineContent">
                                <span className="timelinePhase" style={{ color: t.color }}>{t.phase}</span>
                                <p className="timelineDesc">{t.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}
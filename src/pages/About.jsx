import { useNavigate } from "react-router-dom";

const HIGHLIGHTS = [
    {
        icon: "⌘",
        title: "Command Palette",
        desc: "Press ⌘K anywhere to navigate, search tasks, or run actions — Linear / Raycast style.",
    },
    {
        icon: "🎯",
        title: "Drag-and-drop Kanban",
        desc: "Move cards between To Do, In Progress, and Done columns. Built on native HTML5 DnD — no external library.",
    },
    {
        icon: "✨",
        title: "Smart input",
        desc: "Type \"design ui tomorrow !high #web @nazarbek\" and BitTask auto-extracts priority, tag, assignee, and due date.",
    },
    {
        icon: "🔥",
        title: "Productivity score",
        desc: "Track your streak, completion rate, and earn 8 different achievements as you build momentum.",
    },
    {
        icon: "📊",
        title: "Activity heatmap",
        desc: "GitHub-style 12-week heatmap drawn in pure SVG. See which days you're most productive.",
    },
    {
        icon: "🌙",
        title: "Dark mode",
        desc: "Beautiful in both light and dark themes. Preference saved across sessions.",
    },
    {
        icon: "💾",
        title: "Data ownership",
        desc: "Export and import all your tasks as JSON. Your data is yours — leave whenever you want.",
    },
    {
        icon: "🔒",
        title: "Protected routes",
        desc: "Dashboard requires authentication and remembers where you wanted to go after login.",
    },
];

const TECH = [
    { name: "React 19",        icon: "⚛️" },
    { name: "React Router 7",  icon: "🛣️" },
    { name: "Context API",     icon: "🧠" },
    { name: "Custom Hooks",    icon: "🪝" },
    { name: "REST API",        icon: "🌐" },
    { name: "HTML5 DnD",       icon: "🖱️" },
    { name: "Inline SVG",      icon: "📐" },
    { name: "localStorage",    icon: "💾" },
    { name: "CSS Variables",   icon: "🎨" },
    { name: "Jest",            icon: "🧪" },
];

const STATS = [
    { value: "5", label: "Custom hooks" },
    { value: "11", label: "Routes" },
    { value: "13+", label: "Components" },
    { value: "24", label: "Passing tests" },
];

export default function About() {
    const navigate = useNavigate();

    return (
        <div className="page" style={{ maxWidth: 980 }}>
            {/* ===== Hero ===== */}
            <section className="aboutHero">
                <div className="aboutBadge">
                    <span className="aboutBadgeDot" />
                    Endterm project · Frontend Development & React
                </div>
                <h1 className="aboutHeroTitle">
                    A task manager built <br />
                    <span className="gradient">for the way you actually work.</span>
                </h1>
                <p className="aboutHeroLead">
                    BitTask is a fast, keyboard-first React SPA — not a tutorial app.
                    Every feature was chosen to make real productivity feel effortless.
                </p>
                <div className="aboutHeroCTA">
                    <button className="btn btn--primary" onClick={() => navigate("/")}>
                        Open workspace →
                    </button>
                    <button className="btn" onClick={() => navigate("/changelog")}>
                        View changelog
                    </button>
                </div>
            </section>

            {/* ===== Stats strip ===== */}
            <section className="aboutStats">
                {STATS.map((s) => (
                    <div key={s.label} className="aboutStat">
                        <div className="aboutStatValue">{s.value}</div>
                        <div className="aboutStatLabel">{s.label}</div>
                    </div>
                ))}
            </section>

            {/* ===== Highlights grid ===== */}
            <section style={{ marginTop: 56 }}>
                <h2 className="aboutSectionTitle">What makes it different</h2>
                <p className="aboutSectionLead">
                    Eight focused features that turn a basic todo list into a tool you actually want to open.
                </p>

                <div className="aboutGrid">
                    {HIGHLIGHTS.map((h) => (
                        <article key={h.title} className="aboutFeature">
                            <div className="aboutFeatureIcon">{h.icon}</div>
                            <h3 className="aboutFeatureTitle">{h.title}</h3>
                            <p className="aboutFeatureDesc">{h.desc}</p>
                        </article>
                    ))}
                </div>
            </section>

            {/* ===== Tech stack ===== */}
            <section style={{ marginTop: 56 }}>
                <h2 className="aboutSectionTitle">Built with</h2>
                <p className="aboutSectionLead">
                    Modern React fundamentals. No heavy UI libraries — just hooks, CSS, and good architecture.
                </p>

                <div className="aboutTechCloud">
                    {TECH.map((t) => (
                        <span key={t.name} className="aboutTechPill">
                            <span className="aboutTechIcon">{t.icon}</span>
                            {t.name}
                        </span>
                    ))}
                </div>
            </section>

            {/* ===== Architecture note ===== */}
            <section className="aboutArchitecture">
                <h2 className="aboutSectionTitle" style={{ marginBottom: 8 }}>Architecture</h2>
                <p className="aboutSectionLead" style={{ marginBottom: 24 }}>
                    Small decisions, made deliberately.
                </p>

                <div className="aboutArchList">
                    <div className="aboutArchItem">
                        <span className="aboutArchKey">State</span>
                        <span className="aboutArchValue">
                            Context API for global concerns (auth, theme, toast).
                            Local <code>useState</code> for everything else.
                            Redux would have been over-engineering.
                        </span>
                    </div>
                    <div className="aboutArchItem">
                        <span className="aboutArchKey">Data fetching</span>
                        <span className="aboutArchValue">
                            One custom <code>useFetch</code> hook handles loading, error,
                            and race-condition safety via a <code>cancelled</code> flag in cleanup.
                        </span>
                    </div>
                    <div className="aboutArchItem">
                        <span className="aboutArchKey">Persistence</span>
                        <span className="aboutArchValue">
                            All <code>localStorage</code> access is encapsulated in a single
                            <code> useLocalStorage</code> hook — no scattered <code>setItem</code> calls.
                        </span>
                    </div>
                    <div className="aboutArchItem">
                        <span className="aboutArchKey">API layer</span>
                        <span className="aboutArchValue">
                            Components never call <code>fetch</code> directly. Everything goes through
                            <code> taskService</code> which normalises responses and surfaces clean errors.
                        </span>
                    </div>
                    <div className="aboutArchItem">
                        <span className="aboutArchKey">Performance</span>
                        <span className="aboutArchValue">
                            <code>React.memo</code> on list rows, <code>useCallback</code> for handlers,
                            <code> useMemo</code> for derived data. Re-renders stay surgical.
                        </span>
                    </div>
                </div>
            </section>

            {/* ===== Footer CTA ===== */}
            <section className="aboutFinalCTA">
                <h2 className="aboutFinalTitle">Try it now</h2>
                <p className="aboutFinalDesc">
                    Press <span className="kbd">⌘</span><span className="kbd">K</span> to open the command palette,
                    or jump straight into the workspace.
                </p>
                <div className="aboutHeroCTA" style={{ marginTop: 20 }}>
                    <button className="btn btn--primary" onClick={() => navigate("/")}>
                        Get started →
                    </button>
                    <button className="btn" onClick={() => navigate("/shortcuts")}>
                        See shortcuts
                    </button>
                </div>
            </section>
        </div>
    );
}
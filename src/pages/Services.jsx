const FEATURES = [
    {
        icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 12l2 2 4-4"/></svg>),
        title: "Task CRUD", color: "var(--accent-text)", bg: "var(--accent-light)",
        items: ["Create tasks with title, priority, assignee","Toggle status: In Progress → Done","Delete with animated removal","View full detail on a separate route"],
    },
    {
        icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>),
        title: "Search & Filter", color: "var(--blue)", bg: "var(--blue-bg)",
        items: ["Real-time search by title, assignee, priority","Filter: All / Active / Done","Sort: Default / Title A–Z / High Priority","Optimized with useMemo — no wasted renders"],
    },
    {
        icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
        title: "Per-User Data", color: "var(--green)", bg: "var(--green-bg)",
        items: ["Login with any username + password","Tasks tagged with userId on creation","Users see only their own tasks","Session restored from localStorage on reload"],
    },
    {
        icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>),
        title: "Dashboard", color: "var(--amber)", bg: "var(--amber-bg)",
        items: ["Live stats: total, completed, active, rate","Visual progress bar per user","Export tasks as JSON","Nested routes: Profile, Settings, Activity"],
    },
    {
        icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>),
        title: "Auth & Protection", color: "#f472b6", bg: "rgba(244,114,182,0.08)",
        items: ["Login / logout flow via Context API","Protected routes — redirect if not logged in","Auth persisted in localStorage","ProtectedRoute wrapper component"],
    },
    {
        icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>),
        title: "REST API", color: "var(--accent-text)", bg: "var(--accent-light)",
        items: ["MockAPI as real REST backend","GET / POST / PUT / DELETE operations","Service layer — no fetch inside components","Loading, error, empty states everywhere"],
    },
];

const STEPS = [
    { n: "01", title: "Sign in",        desc: "Any username + password. Session saved — no re-login on refresh." },
    { n: "02", title: "Add tasks",      desc: "Set title, priority (High/Normal/Low), and assignee. Saved to API instantly." },
    { n: "03", title: "Manage",         desc: "Toggle done/active, search, filter, sort. Everything updates in real time." },
    { n: "04", title: "Track progress", desc: "Check Dashboard for live stats, completion rate, and activity feed." },
];

export default function Services() {
    return (
        <div className="servicesPage">
            <section className="servicesHero card">
                <p className="heroKicker">Features</p>
                <h1 className="servicesHeroTitle">Everything in one place</h1>
                <p className="muted servicesHeroSub">
                    BitTask ships with a complete feature set — real API, auth, routing, state management, and a responsive UI. No mocks, no placeholder data.
                </p>
            </section>

            <section className="featuresGrid">
                {FEATURES.map((f) => (
                    <div key={f.title} className="featureCard card">
                        <div className="featureIconWrap" style={{ background: f.bg, color: f.color }}>{f.icon}</div>
                        <h3 className="featureTitle" style={{ color: f.color }}>{f.title}</h3>
                        <ul className="featureList">
                            {f.items.map((item) => (
                                <li key={item} className="featureListItem">
                                    <span className="featureListDot" style={{ background: f.color }} />{item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </section>

            <section className="card howItWorks">
                <h2 className="aboutSectionTitle">How it works</h2>
                <p className="muted" style={{ marginBottom: 28 }}>Four steps from login to full productivity.</p>
                <div className="stepsGrid">
                    {STEPS.map((s, i) => (
                        <div key={s.n} className="stepCard">
                            <div className="stepNumber">{s.n}</div>
                            {i < STEPS.length - 1 && <div className="stepArrow">→</div>}
                            <h3 className="stepTitle">{s.title}</h3>
                            <p className="stepDesc">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
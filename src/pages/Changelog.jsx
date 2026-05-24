const RELEASES = [
    {
        version: "1.0.0",
        date: "2026-05-24",
        tag: "Major",
        tone: "brand",
        highlights: [
            "⌘K command palette with keyboard navigation",
            "Drag-and-drop Kanban board (To Do / In Progress / Done)",
            "Smart natural-language input (`!high`, `#tag`, `@user`, `tomorrow`)",
            "Productivity dashboard with SVG bar chart",
            "Full design system overhaul + dark mode polish",
        ],
    },
    {
        version: "0.4.0",
        date: "2026-05-10",
        tag: "Feature",
        tone: "info",
        highlights: [
            "Real REST API integration via MockAPI",
            "Loading, error, and empty states everywhere",
            "Per-user task isolation (`/tasks?userId=...`)",
        ],
    },
    {
        version: "0.3.0",
        date: "2026-04-22",
        tag: "Feature",
        tone: "info",
        highlights: [
            "Protected routes with redirect-back behavior",
            "Custom 404 page",
            "Nested dashboard layout (Overview / Profile / Settings / Activity)",
        ],
    },
    {
        version: "0.2.0",
        date: "2026-03-30",
        tag: "Refactor",
        tone: "warning",
        highlights: [
            "Extracted `useFetch`, `useLocalStorage`, `useToast` custom hooks",
            "Encapsulated all `localStorage` access in a single hook",
            "Moved API calls into a dedicated service layer",
        ],
    },
    {
        version: "0.1.0",
        date: "2026-02-14",
        tag: "Initial",
        tone: "muted",
        highlights: [
            "First public version of BitTask",
            "Add, toggle, and delete tasks",
            "Search by title and filter by status",
        ],
    },
];

const TAG_COLORS = {
    brand:   { color: "var(--brand)",   bg: "rgba(109,82,232,0.12)" },
    info:    { color: "var(--info)",    bg: "rgba(59,130,246,0.12)" },
    warning: { color: "var(--warning)", bg: "rgba(245,158,11,0.12)" },
    muted:   { color: "var(--muted)",   bg: "var(--bg-3)" },
};

export default function Changelog() {
    return (
        <div className="page">
            <header style={{ marginBottom: 32 }}>
                <p style={{
                    display: "inline-block",
                    fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
                    textTransform: "uppercase", color: "var(--brand)",
                    margin: "0 0 8px",
                }}>
                    Product updates
                </p>
                <h1 style={{ fontSize: 36, margin: 0 }}>Changelog</h1>
                <p className="muted" style={{ fontSize: 16, marginTop: 8 }}>
                    Every meaningful change shipped to BitTask, newest first.
                </p>
            </header>

            <div style={{ position: "relative", paddingLeft: 24 }}>
                {/* Vertical timeline line */}
                <div style={{
                    position: "absolute",
                    left: 6, top: 8, bottom: 8,
                    width: 2,
                    background: "var(--border-2)",
                    borderRadius: 2,
                }} />

                {RELEASES.map((release) => {
                    const tagStyle = TAG_COLORS[release.tone];
                    return (
                        <article key={release.version} style={{ position: "relative", marginBottom: 28 }}>
                            {/* Dot on the timeline */}
                            <span style={{
                                position: "absolute",
                                left: -22, top: 18,
                                width: 14, height: 14,
                                borderRadius: "50%",
                                background: "var(--brand-grad)",
                                boxShadow: "var(--brand-glow)",
                                border: "3px solid var(--bg)",
                            }} />

                            <div className="card">
                                <div style={{
                                    display: "flex", alignItems: "center", gap: 12,
                                    flexWrap: "wrap", marginBottom: 12,
                                }}>
                                    <span style={{
                                        fontSize: 11, fontWeight: 700,
                                        padding: "3px 9px", borderRadius: 999,
                                        color: tagStyle.color, background: tagStyle.bg,
                                        textTransform: "uppercase", letterSpacing: "0.05em",
                                    }}>
                                        {release.tag}
                                    </span>
                                    <h2 style={{ margin: 0, fontSize: 20 }}>v{release.version}</h2>
                                    <span className="muted" style={{ fontSize: 13 }}>
                                        {new Date(release.date).toLocaleDateString("en-US", {
                                            year: "numeric", month: "long", day: "numeric",
                                        })}
                                    </span>
                                </div>

                                <ul style={{
                                    margin: 0,
                                    paddingLeft: 18,
                                    lineHeight: 1.7,
                                    color: "var(--text-2)",
                                }}>
                                    {release.highlights.map((line, i) => (
                                        <li key={i}>{line}</li>
                                    ))}
                                </ul>
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}

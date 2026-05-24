const SECTIONS = [
    {
        title: "Global",
        items: [
            { keys: ["⌘", "K"],     label: "Open command palette" },
            { keys: ["Ctrl", "K"],  label: "Open command palette (Windows / Linux)" },
            { keys: ["Esc"],        label: "Close command palette / modal" },
        ],
    },
    {
        title: "Command palette",
        items: [
            { keys: ["↑"],    label: "Move selection up" },
            { keys: ["↓"],    label: "Move selection down" },
            { keys: ["↵"],    label: "Run selected command" },
            { keys: ["Type"], label: "Filter commands and tasks by substring" },
        ],
    },
    {
        title: "Tasks",
        items: [
            { keys: ["↵"], label: "Add task from the input field" },
            { keys: ["Click"], label: "Toggle task between done / active" },
            { keys: ["Drag"],  label: "Move card between Kanban columns" },
            { keys: ["Click title"], label: "Open task detail page" },
        ],
    },
    {
        title: "Smart input syntax",
        items: [
            { keys: ["!high"],     label: "Set priority to High" },
            { keys: ["!low"],      label: "Set priority to Low" },
            { keys: ["#tag"],      label: "Add a tag" },
            { keys: ["@name"],     label: "Assign to a person" },
            { keys: ["today"],     label: "Due today" },
            { keys: ["tomorrow"],  label: "Due tomorrow" },
            { keys: ["friday"],    label: "Due next Friday (any weekday works)" },
            { keys: ["12.05"],     label: "Specific date (DD.MM)" },
        ],
    },
];

function Kbd({ children }) {
    return (
        <span style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 28,
            height: 28,
            padding: "0 8px",
            borderRadius: 6,
            background: "var(--bg-3)",
            border: "1px solid var(--border-2)",
            boxShadow: "0 1px 0 var(--border-2), inset 0 -1px 0 var(--border)",
            fontSize: 12,
            fontFamily: '"SF Mono", Menlo, monospace',
            fontWeight: 600,
            color: "var(--text)",
        }}>
            {children}
        </span>
    );
}

export default function Shortcuts() {
    return (
        <div className="page">
            <header style={{ marginBottom: 32 }}>
                <p style={{
                    display: "inline-block",
                    fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
                    textTransform: "uppercase", color: "var(--brand)",
                    margin: "0 0 8px",
                }}>
                    Productivity
                </p>
                <h1 style={{ fontSize: 36, margin: 0 }}>Keyboard shortcuts</h1>
                <p className="muted" style={{ fontSize: 16, marginTop: 8 }}>
                    BitTask is designed to be driven from the keyboard. Here's everything you can do without a mouse.
                </p>
            </header>

            <div style={{ display: "grid", gap: 20 }}>
                {SECTIONS.map((section) => (
                    <section key={section.title} className="card">
                        <h2 style={{ fontSize: 18, marginBottom: 16 }}>{section.title}</h2>

                        <div>
                            {section.items.map((item, i) => (
                                <div key={i} style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "12px 0",
                                    borderBottom: i < section.items.length - 1 ? "1px solid var(--border)" : "none",
                                    gap: 16,
                                }}>
                                    <span style={{ color: "var(--text-2)", fontSize: 14 }}>
                                        {item.label}
                                    </span>
                                    <span style={{ display: "inline-flex", gap: 4, flexShrink: 0 }}>
                                        {item.keys.map((k, j) => (
                                            <Kbd key={j}>{k}</Kbd>
                                        ))}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            <p className="muted" style={{ marginTop: 24, fontSize: 13, textAlign: "center" }}>
                Tip: press <Kbd>⌘</Kbd> <Kbd>K</Kbd> right now to try the command palette.
            </p>
        </div>
    );
}

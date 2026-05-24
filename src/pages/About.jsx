export default function About() {
    return (
        <div className="page">
            <h1>About BitTask</h1>
            <p className="muted" style={{ fontSize: 16, marginTop: 8 }}>
                BitTask is a fast, keyboard-driven task manager built as my final React project.
                It demonstrates a production-style React 19 SPA with React Router 7, Context API,
                custom hooks, real REST integration, and a polished design system.
            </p>

            <h2 style={{ marginTop: 32 }}>Highlights</h2>
            <ul style={{ lineHeight: 1.8, color: "var(--text-2)" }}>
                <li>⌘K Command Palette with keyboard navigation</li>
                <li>Drag-and-drop Kanban board (HTML5 DnD, no library)</li>
                <li>Smart natural-language task input</li>
                <li>Productivity charts drawn with inline SVG</li>
                <li>Light & Dark themes with persistence</li>
                <li>Protected routes with redirect-back behavior</li>
            </ul>

            <h2 style={{ marginTop: 32 }}>Tech stack</h2>
            <p style={{ color: "var(--text-2)" }}>
                React 19 · React Router 7 · Context API · Custom Hooks · REST API · localStorage · Pure CSS
            </p>
        </div>
    );
}

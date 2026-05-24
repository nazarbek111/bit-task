import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";


export default function CommandPalette({ open, onClose, tasks = [] }) {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const { logout, user } = useAuth();

    const [query, setQuery] = useState("");
    const [activeIdx, setActiveIdx] = useState(0);
    const inputRef = useRef(null);

    // Build the full list of commands the user can invoke.
    const allCommands = useMemo(() => {
        const navItems = [
            { id: "nav-home",      label: "Go to Home",      sub: "/", icon: "🏠",  group: "Navigation", action: () => navigate("/") },
            { id: "nav-dashboard", label: "Go to Dashboard", sub: "/dashboard", icon: "📊", group: "Navigation", action: () => navigate("/dashboard") },
            { id: "nav-profile",   label: "Go to Profile",   sub: "/dashboard/profile", icon: "👤", group: "Navigation", action: () => navigate("/dashboard/profile") },
            { id: "nav-activity",  label: "Go to Activity",  sub: "/dashboard/activity", icon: "📈", group: "Navigation", action: () => navigate("/dashboard/activity") },
            { id: "nav-settings",  label: "Go to Settings",  sub: "/dashboard/settings", icon: "⚙️", group: "Navigation", action: () => navigate("/dashboard/settings") },
            { id: "nav-about",     label: "About BitTask",   sub: "/about", icon: "ℹ️",  group: "Navigation", action: () => navigate("/about") },
        ];

        const actions = [
            { id: "act-theme",  label: theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode", icon: theme === "light" ? "🌙" : "☀️", group: "Actions", action: toggleTheme },
            { id: "act-focus",  label: "Focus task input", sub: "Jump to the new-task field", icon: "✍️", group: "Actions", action: () => {
                    const input = document.querySelector('.taskForm input[name="title"]');
                    if (input) input.focus();
                }},
            ...(user ? [{ id: "act-logout", label: "Logout", icon: "🚪", group: "Actions", action: logout }] : []),
        ];

        const taskItems = tasks.slice(0, 50).map((t) => ({
            id: `task-${t.id}`,
            label: t.title,
            sub: `${t.priority || "Normal"} · ${t.status || (t.completed ? "done" : "todo")}`,
            icon: t.completed ? "✅" : "📌",
            group: "Tasks",
            action: () => navigate(`/tasks/${t.id}`),
        }));

        return [...navItems, ...actions, ...taskItems];
    }, [navigate, theme, toggleTheme, logout, user, tasks]);

    // Filter by query (case-insensitive substring).
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return allCommands;
        return allCommands.filter((c) =>
            c.label.toLowerCase().includes(q) ||
            (c.sub || "").toLowerCase().includes(q)
        );
    }, [allCommands, query]);

    // Group results by section while preserving order.
    const grouped = useMemo(() => {
        const map = new Map();
        filtered.forEach((c) => {
            if (!map.has(c.group)) map.set(c.group, []);
            map.get(c.group).push(c);
        });
        return Array.from(map.entries());
    }, [filtered]);

    // Reset state every time the palette opens.
    useEffect(() => {
        if (open) {
            setQuery("");
            setActiveIdx(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open]);

    useEffect(() => { setActiveIdx(0); }, [query]);

    const runActive = useCallback(() => {
        const item = filtered[activeIdx];
        if (item) {
            item.action();
            onClose();
        }
    }, [filtered, activeIdx, onClose]);

    // Local keyboard handler — only active while palette is open.
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
            if (e.key === "Escape") { e.preventDefault(); onClose(); }
            else if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
            }
            else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIdx((i) => Math.max(i - 1, 0));
            }
            else if (e.key === "Enter") {
                e.preventDefault();
                runActive();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, filtered.length, onClose, runActive]);

    if (!open) return null;

    // Build a flat index so we can highlight one row across grouped sections.
    let flatIdx = -1;

    return (
        <div className="cmdkOverlay" onClick={onClose}>
            <div className="cmdkModal" onClick={(e) => e.stopPropagation()}>
                <div className="cmdkInputWrap">
                    <span className="cmdkSearchIcon">🔍</span>
                    <input
                        ref={inputRef}
                        className="cmdkInput"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Type a command or search…"
                    />
                </div>

                <div className="cmdkList">
                    {grouped.length === 0 ? (
                        <div className="cmdkEmpty">No results for "{query}"</div>
                    ) : (
                        grouped.map(([groupName, items]) => (
                            <div key={groupName} className="cmdkGroup">
                                <div className="cmdkGroupTitle">{groupName}</div>
                                {items.map((item) => {
                                    flatIdx += 1;
                                    const isActive = flatIdx === activeIdx;
                                    const myIdx = flatIdx;
                                    return (
                                        <button
                                            key={item.id}
                                            className={`cmdkItem ${isActive ? "cmdkItem--active" : ""}`}
                                            onMouseEnter={() => setActiveIdx(myIdx)}
                                            onClick={() => { item.action(); onClose(); }}
                                        >
                                            <span className="cmdkIcon">{item.icon}</span>
                                            <span className="cmdkLabel">
                                                {item.label}
                                                {item.sub && <div className="cmdkSub">{item.sub}</div>}
                                            </span>
                                            {isActive && <span className="cmdkShortcut">↵</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        ))
                    )}
                </div>

                <div className="cmdkFooter">
                    <span><span className="kbd">↑</span><span className="kbd">↓</span> navigate</span>
                    <span><span className="kbd">↵</span> select</span>
                    <span><span className="kbd">esc</span> close</span>
                </div>
            </div>
        </div>
    );
}
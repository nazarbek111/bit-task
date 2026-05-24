import { useMemo } from "react";
import { useFetch } from "../../hooks/useFetch";
import { taskService } from "../../services/taskService";
import { useAuth } from "../../context/AuthContext";

/**
 * Productivity chart drawn entirely with inline SVG (no chart library).
 * Shows tasks created over the last 7 days.
 */
function WeeklyChart({ tasks }) {
    const data = useMemo(() => {
        const days = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            d.setHours(0, 0, 0, 0);
            days.push({
                date: d,
                label: d.toLocaleDateString("en-US", { weekday: "short" }),
                count: 0,
            });
        }
        for (const t of tasks) {
            if (!t.createdAt) continue;
            const created = new Date(t.createdAt);
            for (const day of days) {
                const next = new Date(day.date); next.setDate(day.date.getDate() + 1);
                if (created >= day.date && created < next) { day.count += 1; break; }
            }
        }
        return days;
    }, [tasks]);

    const max = Math.max(1, ...data.map((d) => d.count));
    const width = 600;
    const height = 220;
    const padding = { top: 20, right: 16, bottom: 36, left: 32 };
    const innerW = width - padding.left - padding.right;
    const innerH = height - padding.top - padding.bottom;
    const barW = innerW / data.length - 12;

    return (
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", maxWidth: 600 }}>
            <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#6d52e8" />
                </linearGradient>
            </defs>

            {/* Y-axis gridlines */}
            {[0, 0.5, 1].map((p) => {
                const y = padding.top + innerH * (1 - p);
                return (
                    <g key={p}>
                        <line x1={padding.left} y1={y} x2={width - padding.right} y2={y}
                              stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                        <text x={padding.left - 6} y={y + 4} fontSize="10" textAnchor="end" fill="currentColor" opacity="0.5">
                            {Math.round(max * p)}
                        </text>
                    </g>
                );
            })}

            {/* Bars */}
            {data.map((d, i) => {
                const x = padding.left + i * (innerW / data.length) + 6;
                const h = d.count === 0 ? 2 : (d.count / max) * innerH;
                const y = padding.top + innerH - h;
                return (
                    <g key={i}>
                        <rect x={x} y={y} width={barW} height={h} fill="url(#barGrad)" rx="4" />
                        {d.count > 0 && (
                            <text x={x + barW / 2} y={y - 6} fontSize="11" fontWeight="600" textAnchor="middle" fill="currentColor">
                                {d.count}
                            </text>
                        )}
                        <text x={x + barW / 2} y={height - 14} fontSize="11" textAnchor="middle" fill="currentColor" opacity="0.6">
                            {d.label}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}

/**
 * Priority distribution as a stacked horizontal bar.
 */
function PriorityBar({ tasks }) {
    const counts = useMemo(() => {
        const c = { High: 0, Normal: 0, Low: 0 };
        for (const t of tasks) c[t.priority] = (c[t.priority] || 0) + 1;
        return c;
    }, [tasks]);

    const total = counts.High + counts.Normal + counts.Low || 1;
    const segments = [
        { key: "High",   value: counts.High,   color: "var(--p-high)" },
        { key: "Normal", value: counts.Normal, color: "var(--p-normal)" },
        { key: "Low",    value: counts.Low,    color: "var(--p-low)" },
    ];

    return (
        <div>
            <div style={{ display: "flex", height: 14, borderRadius: 999, overflow: "hidden", background: "var(--bg-3)" }}>
                {segments.map((s) => s.value > 0 && (
                    <div key={s.key}
                         title={`${s.key}: ${s.value}`}
                         style={{ width: `${(s.value / total) * 100}%`, background: s.color }} />
                ))}
            </div>
            <div style={{ display: "flex", gap: 18, marginTop: 12, flexWrap: "wrap", fontSize: 13 }}>
                {segments.map((s) => (
                    <div key={s.key} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color, display: "inline-block" }} />
                        <span className="muted">{s.key}: <strong style={{ color: "var(--text)" }}>{s.value}</strong></span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Activity() {
    const { user } = useAuth();
    const { data: tasks, loading } = useFetch(
        () => taskService.getByUser(user?.username),
        [user?.username]
    );

    if (loading) return <p className="muted">Loading…</p>;
    const list = tasks || [];

    return (
        <div>
            <h2 style={{ marginBottom: 6 }}>Activity</h2>
            <p className="muted" style={{ marginBottom: 24 }}>Your last 7 days of work.</p>

            <div className="card" style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 16 }}>Tasks created per day</h3>
                <WeeklyChart tasks={list} />
            </div>

            <div className="card">
                <h3 style={{ marginBottom: 16 }}>Priority distribution</h3>
                <PriorityBar tasks={list} />
            </div>
        </div>
    );
}
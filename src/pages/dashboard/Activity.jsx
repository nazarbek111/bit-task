import { useMemo, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { taskService } from "../../services/taskService";
import { useAuth } from "../../context/AuthContext";
import { buildHeatmap, bestWeekday, calcStreak, topTags } from "../../utils/stats";

const WEEKDAY_LABELS = ["Mon", "", "Wed", "", "Fri", "", ""];

function Heatmap({ tasks, weeks = 12 }) {
    const grid = useMemo(() => buildHeatmap(tasks, weeks), [tasks, weeks]);
    const [hover, setHover] = useState(null);

    // Map raw count to intensity bucket 0-4.
    const level = (count) => {
        if (count === 0) return 0;
        if (count === 1) return 1;
        if (count === 2) return 2;
        if (count <= 4) return 3;
        return 4;
    };

    return (
        <div>
            <div className="heatmapWrap">
                {/* Y-axis labels */}
                <div className="heatmapCol" style={{ marginRight: 4 }}>
                    {WEEKDAY_LABELS.map((d, i) => (
                        <div key={i} style={{
                            height: 14, fontSize: 10, color: "var(--muted)",
                            display: "flex", alignItems: "center",
                        }}>
                            {d}
                        </div>
                    ))}
                </div>

                {grid.map((week, wi) => (
                    <div key={wi} className="heatmapCol">
                        {week.map((cell) => (
                            <div
                                key={cell.key}
                                className={[
                                    "heatmapCell",
                                    `heatmapCell--lvl${level(cell.count)}`,
                                    cell.isFuture ? "heatmapCell--future" : "",
                                ].join(" ")}
                                title={`${cell.key}: ${cell.count} task${cell.count === 1 ? "" : "s"}`}
                                onMouseEnter={() => setHover(cell)}
                                onMouseLeave={() => setHover(null)}
                            />
                        ))}
                    </div>
                ))}
            </div>

            <div className="heatmapLegend">
                <span style={{ marginRight: 6 }}>
                    {hover
                        ? `${hover.key}: ${hover.count} task${hover.count === 1 ? "" : "s"}`
                        : `Last ${weeks} weeks of activity`}
                </span>
                <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 4 }}>
                    Less
                    {[0, 1, 2, 3, 4].map((l) => (
                        <span key={l} className={`heatmapCell heatmapCell--lvl${l}`} />
                    ))}
                    More
                </span>
            </div>
        </div>
    );
}

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
    const width = 600, height = 200;
    const padding = { top: 20, right: 16, bottom: 36, left: 32 };
    const innerW = width - padding.left - padding.right;
    const innerH = height - padding.top - padding.bottom;
    const barW = innerW / data.length - 12;

    return (
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto" }}>
            <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#6d52e8" />
                </linearGradient>
            </defs>

            {[0, 0.5, 1].map((p) => {
                const y = padding.top + innerH * (1 - p);
                return (
                    <g key={p}>
                        <line x1={padding.left} y1={y} x2={width - padding.right} y2={y}
                              stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                        <text x={padding.left - 6} y={y + 4} fontSize="10" textAnchor="end"
                              fill="currentColor" opacity="0.5">{Math.round(max * p)}</text>
                    </g>
                );
            })}

            {data.map((d, i) => {
                const x = padding.left + i * (innerW / data.length) + 6;
                const h = d.count === 0 ? 2 : (d.count / max) * innerH;
                const y = padding.top + innerH - h;
                return (
                    <g key={i}>
                        <rect x={x} y={y} width={barW} height={h} fill="url(#barGrad)" rx="4" />
                        {d.count > 0 && (
                            <text x={x + barW / 2} y={y - 6} fontSize="11" fontWeight="600"
                                  textAnchor="middle" fill="currentColor">{d.count}</text>
                        )}
                        <text x={x + barW / 2} y={height - 14} fontSize="11" textAnchor="middle"
                              fill="currentColor" opacity="0.6">{d.label}</text>
                    </g>
                );
            })}
        </svg>
    );
}

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
            <div style={{
                display: "flex", height: 14, borderRadius: 999,
                overflow: "hidden", background: "var(--bg-3)",
            }}>
                {segments.map((s) => s.value > 0 && (
                    <div key={s.key} title={`${s.key}: ${s.value}`}
                         style={{ width: `${(s.value / total) * 100}%`, background: s.color }} />
                ))}
            </div>
            <div style={{ display: "flex", gap: 18, marginTop: 12, flexWrap: "wrap", fontSize: 13 }}>
                {segments.map((s) => (
                    <div key={s.key} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <span style={{
                            width: 10, height: 10, borderRadius: 3,
                            background: s.color, display: "inline-block",
                        }} />
                        <span className="muted">
                            {s.key}: <strong style={{ color: "var(--text)" }}>{s.value}</strong>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TopTags({ tasks }) {
    const tags = useMemo(() => topTags(tasks, 10), [tasks]);
    if (tags.length === 0) {
        return <p className="muted" style={{ margin: 0 }}>No tags yet. Try <code>#tag</code> in the smart input.</p>;
    }
    const max = tags[0].count;
    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {tags.map((t) => {
                const weight = 0.7 + (t.count / max) * 0.8; // 0.7-1.5 scale
                return (
                    <span key={t.name} style={{
                        padding: "6px 12px",
                        borderRadius: 999,
                        background: `rgba(109,82,232,${0.08 + (t.count / max) * 0.12})`,
                        border: "1px solid var(--border)",
                        fontSize: `${weight * 13}px`,
                        fontWeight: 600,
                        color: "var(--text)",
                    }}>
                        #{t.name}
                        <span style={{ color: "var(--muted)", fontWeight: 400, marginLeft: 6 }}>
                            {t.count}
                        </span>
                    </span>
                );
            })}
        </div>
    );
}

export default function Activity() {
    const { user } = useAuth();
    const { data: tasks, loading } = useFetch(
        () => taskService.getByUser(user?.username),
        [user?.username]
    );

    const list = useMemo(() => tasks || [], [tasks]);

    const insights = useMemo(() => {
        const best = bestWeekday(list);
        const streak = calcStreak(list);
        const last7 = list.filter((t) => {
            if (!t.createdAt) return false;
            return Date.now() - new Date(t.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000;
        }).length;
        return { best, streak, last7 };
    }, [list]);

    if (loading) return <p className="muted">Loading…</p>;

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ margin: 0, fontSize: 28 }}>Activity</h1>
                <p className="muted" style={{ margin: "4px 0 0" }}>Track your habits and momentum over time.</p>
            </div>

            {/* Insight chips */}
            <div className="metricRow">
                <MetricChip
                    icon="🔥" iconStyle="metricIcon--fire"
                    label="Streak"
                    value={`${insights.streak} day${insights.streak === 1 ? "" : "s"}`}
                />
                <MetricChip
                    icon="📅" iconStyle="metricIcon--blue"
                    label="Best day"
                    value={insights.best ? insights.best.name : "—"}
                    delta={insights.best ? `${insights.best.count} tasks created` : null}
                />
                <MetricChip
                    icon="📊" iconStyle="metricIcon--green"
                    label="Last 7 days"
                    value={`${insights.last7} new`}
                />
                <MetricChip
                    icon="🎯" iconStyle="metricIcon--brand"
                    label="Total tasks"
                    value={list.length}
                />
            </div>

            {/* Heatmap */}
            <div className="card dashSection">
                <div className="dashSectionHeader">
                    <h2 className="dashSectionTitle">Activity heatmap</h2>
                    <span className="dashSectionMeta">Last 12 weeks</span>
                </div>
                <Heatmap tasks={list} weeks={12} />
            </div>

            {/* Two columns: weekly chart + priority */}
            <div className="dashGrid2">
                <div className="card">
                    <div className="dashSectionHeader">
                        <h2 className="dashSectionTitle">Tasks per day</h2>
                        <span className="dashSectionMeta">Last 7 days</span>
                    </div>
                    <WeeklyChart tasks={list} />
                </div>
                <div className="card">
                    <div className="dashSectionHeader">
                        <h2 className="dashSectionTitle">Priority breakdown</h2>
                    </div>
                    <PriorityBar tasks={list} />
                </div>
            </div>

            {/* Top tags */}
            <div className="card dashSection" style={{ marginTop: 16 }}>
                <div className="dashSectionHeader">
                    <h2 className="dashSectionTitle">Top tags</h2>
                    <span className="dashSectionMeta">Most used</span>
                </div>
                <TopTags tasks={list} />
            </div>
        </div>
    );
}

function MetricChip({ icon, iconStyle, label, value, delta }) {
    return (
        <div className="metricCard">
            <div className={`metricIcon ${iconStyle}`}>{icon}</div>
            <div className="metricBody">
                <div className="metricLabel">{label}</div>
                <div className="metricValue">{value}</div>
                {delta && <div className="metricDelta">{delta}</div>}
            </div>
        </div>
    );
}
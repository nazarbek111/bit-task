import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { taskService } from "../../services/taskService";
import { useAuth } from "../../context/AuthContext";
import {
    productivityScore,
    calcStreak,
    recentActivity,
    dueSoon,
} from "../../utils/stats";
import { formatDueDate, relativeTime, dueDateStatus } from "../../utils/dateUtils";

function greeting(name) {
    const h = new Date().getHours();
    if (h < 5)  return { kicker: "Late night",   text: `Still up, ${name}?` };
    if (h < 12) return { kicker: "Good morning", text: `Good morning, ${name}` };
    if (h < 18) return { kicker: "Good afternoon", text: `Good afternoon, ${name}` };
    return { kicker: "Good evening", text: `Good evening, ${name}` };
}


function ScoreRing({ value, size = 120, stroke = 10 }) {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const offset = c - (value / 100) * c;

    return (
        <div className="scoreRingWrap" style={{ width: size, height: size }}>
            <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
                <defs>
                    <linearGradient id="scoreRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%"   stopColor="#6d52e8" />
                        <stop offset="100%" stopColor="#a78bfa" />
                    </linearGradient>
                </defs>
                <circle cx={size / 2} cy={size / 2} r={r}
                        fill="none" stroke="var(--bg-3)" strokeWidth={stroke} />
                <circle cx={size / 2} cy={size / 2} r={r}
                        fill="none" stroke="url(#scoreRingGrad)"
                        strokeWidth={stroke} strokeLinecap="round"
                        strokeDasharray={c} strokeDashoffset={offset}
                        style={{ transition: "stroke-dashoffset 0.8s var(--ease-out)" }} />
            </svg>
            <div className="scoreRingValue">
                <div style={{ textAlign: "center" }}>
                    <div className="scoreRingNum">{value}</div>
                    <div className="scoreRingLabel">Score</div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ icon, iconStyle, label, value, delta }) {
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

export default function Overview() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const { data: tasks, loading } = useFetch(
        () => taskService.getByUser(user?.username),
        [user?.username]
    );

    const list = useMemo(() => tasks || [], [tasks]);

    const stats = useMemo(() => {
        const done = list.filter((t) => t.completed).length;
        const total = list.length;
        const active = total - done;
        const overdue = list.filter((t) => {
            if (!t.dueDate || t.completed) return false;
            return new Date(t.dueDate) < new Date();
        }).length;
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const dueToday = list.filter((t) => {
            if (!t.dueDate || t.completed) return false;
            const d = new Date(t.dueDate);
            d.setHours(0, 0, 0, 0);
            return d.getTime() === today.getTime();
        }).length;

        return {
            total, done, active, overdue, dueToday,
            progress: total ? Math.round((done / total) * 100) : 0,
            score: productivityScore(list),
            streak: calcStreak(list),
        };
    }, [list]);

    const feed = useMemo(() => recentActivity(list, 6), [list]);
    const upcoming = useMemo(() => dueSoon(list).slice(0, 5), [list]);

    if (loading) return <p className="muted">Loading overview…</p>;

    const { kicker, text } = greeting(user?.username || "friend");

    const scoreCopy =
        stats.score >= 80 ? "You're crushing it. Take a moment to enjoy this." :
            stats.score >= 60 ? "Strong rhythm — keep pushing the high-priority items." :
                stats.score >= 40 ? "Steady. A little focus today will boost your score." :
                    stats.total === 0 ? "Add your first task — the score updates in real time." :
                        "Start small. Complete one task to build momentum.";

    return (
        <div>
            {/* Greeting */}
            <div className="greetingHero">
                <p className="greetingTime">{kicker}</p>
                <h1 className="greetingTitle">{text} 👋</h1>
                <p className="greetingSub">
                    {stats.total === 0
                        ? "Your workspace is empty. Add a task to get started."
                        : stats.dueToday > 0
                            ? `You have ${stats.dueToday} task${stats.dueToday > 1 ? "s" : ""} due today.`
                            : stats.overdue > 0
                                ? `${stats.overdue} overdue task${stats.overdue > 1 ? "s need" : " needs"} your attention.`
                                : `You're up to date — ${stats.active} active task${stats.active === 1 ? "" : "s"} to go.`}
                </p>
            </div>

            {/* Productivity score */}
            <div className="dashSection">
                <div className="scoreCard">
                    <ScoreRing value={stats.score} />
                    <div className="scoreText">
                        <h3>Productivity Score</h3>
                        <p>{scoreCopy}</p>
                    </div>
                </div>
            </div>

            {/* Key metrics */}
            <div className="dashSection">
                <div className="metricRow">
                    <MetricCard
                        icon="🔥" iconStyle="metricIcon--fire"
                        label="Current streak"
                        value={`${stats.streak} day${stats.streak === 1 ? "" : "s"}`}
                        delta={stats.streak >= 3 ? "On fire!" : null}
                    />
                    <MetricCard
                        icon="✓" iconStyle="metricIcon--green"
                        label="Completion rate"
                        value={`${stats.progress}%`}
                        delta={`${stats.done} of ${stats.total} done`}
                    />
                    <MetricCard
                        icon="📌" iconStyle="metricIcon--blue"
                        label="Active tasks"
                        value={stats.active}
                    />
                    <MetricCard
                        icon="⚠️" iconStyle="metricIcon--brand"
                        label="Overdue"
                        value={stats.overdue}
                    />
                </div>
            </div>

            {/* Quick actions */}
            <div className="dashSection">
                <div className="dashSectionHeader">
                    <h2 className="dashSectionTitle">Quick actions</h2>
                </div>
                <div className="quickGrid">
                    <button className="quickBtn" onClick={() => navigate("/")}>
                        <span className="quickIcon">➕</span>
                        <span className="quickLabel">Add a task</span>
                        <span className="quickHint">Go to workspace</span>
                    </button>
                    <button className="quickBtn" onClick={() => navigate("/dashboard/activity")}>
                        <span className="quickIcon">📈</span>
                        <span className="quickLabel">View activity</span>
                        <span className="quickHint">Weekly heatmap</span>
                    </button>
                    <button className="quickBtn" onClick={() => navigate("/dashboard/profile")}>
                        <span className="quickIcon">🏆</span>
                        <span className="quickLabel">Achievements</span>
                        <span className="quickHint">See your badges</span>
                    </button>
                    <button className="quickBtn" onClick={() => navigate("/shortcuts")}>
                        <span className="quickIcon">⌨️</span>
                        <span className="quickLabel">Shortcuts</span>
                        <span className="quickHint">Master the keys</span>
                    </button>
                </div>
            </div>

            {/* Two-column: due soon + recent activity */}
            <div className="dashGrid2">
                {/* Due soon */}
                <div className="card">
                    <div className="dashSectionHeader">
                        <h2 className="dashSectionTitle">Due this week</h2>
                        <span className="dashSectionMeta">{upcoming.length} items</span>
                    </div>
                    {upcoming.length === 0 ? (
                        <p className="muted" style={{ margin: 0 }}>Nothing due in the next 7 days. 🌴</p>
                    ) : (
                        <div className="dueList">
                            {upcoming.map((t) => {
                                const status = dueDateStatus(t.dueDate);
                                const pillClass =
                                    status === "overdue" ? "duePill--overdue" :
                                        status === "today"   ? "duePill--today" :
                                            "duePill--soon";
                                return (
                                    <div key={t.id} className="dueItem"
                                         onClick={() => navigate(`/tasks/${t.id}`)}
                                         style={{ cursor: "pointer" }}>
                                        <span className={`duePill ${pillClass}`}>{formatDueDate(t.dueDate)}</span>
                                        <span className="dueTitle">{t.title}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Recent activity */}
                <div className="card">
                    <div className="dashSectionHeader">
                        <h2 className="dashSectionTitle">Recent activity</h2>
                        <span className="dashSectionMeta">{feed.length} events</span>
                    </div>
                    {feed.length === 0 ? (
                        <p className="muted" style={{ margin: 0 }}>No activity yet. Create a task!</p>
                    ) : (
                        <div className="feedList">
                            {feed.map((e) => (
                                <div key={e.id} className="feedItem">
                                    <div className={`feedDot feedDot--${e.type}`}>
                                        {e.type === "created" ? "+" : "✓"}
                                    </div>
                                    <div className="feedBody">
                                        <p className="feedTitle">
                                            {e.type === "created" ? "Created" : "Completed"}: {e.task.title}
                                        </p>
                                        <p className="feedMeta">
                                            {e.task.priority} · {e.task.assignee || "Unassigned"}
                                        </p>
                                    </div>
                                    <span className="feedTime">{relativeTime(e.at)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


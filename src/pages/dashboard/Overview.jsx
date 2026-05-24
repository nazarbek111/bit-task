import { useMemo } from "react";
import { useFetch } from "../../hooks/useFetch";
import { taskService } from "../../services/taskService";
import { useAuth } from "../../context/AuthContext";

/**
 * Dashboard Overview — key metrics + breakdown.
 */
export default function Overview() {
    const { user } = useAuth();
    const { data: tasks, loading } = useFetch(
        () => taskService.getByUser(user?.username),
        [user?.username]
    );

    const stats = useMemo(() => {
        const list = tasks || [];
        const done   = list.filter((t) => t.completed).length;
        const active = list.length - done;
        const high   = list.filter((t) => t.priority === "High" && !t.completed).length;
        const overdue = list.filter((t) => {
            if (!t.dueDate || t.completed) return false;
            return new Date(t.dueDate) < new Date();
        }).length;
        const progress = list.length ? Math.round((done / list.length) * 100) : 0;
        return { total: list.length, done, active, high, overdue, progress };
    }, [tasks]);

    if (loading) return <p className="muted">Loading overview…</p>;

    return (
        <div>
            <h2 style={{ marginBottom: 6 }}>Overview</h2>
            <p className="muted" style={{ marginBottom: 24 }}>A snapshot of your workspace.</p>

            <div className="statCards">
                <div className="statCard">
                    <div className="statCardLabel">Total tasks</div>
                    <div className="statCardValue">{stats.total}</div>
                </div>
                <div className="statCard">
                    <div className="statCardLabel">Completed</div>
                    <div className="statCardValue statCardValue--brand">{stats.done}</div>
                    <div className="statCardSub">{stats.progress}% of all tasks</div>
                </div>
                <div className="statCard">
                    <div className="statCardLabel">Active</div>
                    <div className="statCardValue">{stats.active}</div>
                </div>
                <div className="statCard">
                    <div className="statCardLabel">High priority</div>
                    <div className="statCardValue" style={{ color: "var(--p-high)" }}>{stats.high}</div>
                </div>
                <div className="statCard">
                    <div className="statCardLabel">Overdue</div>
                    <div className="statCardValue" style={{ color: "var(--warning)" }}>{stats.overdue}</div>
                </div>
            </div>

            <h3>Completion progress</h3>
            <div className="progressBar">
                <div className="progressFill" style={{ width: `${stats.progress}%` }} />
            </div>
            <p className="muted" style={{ marginTop: 8, fontSize: 13 }}>
                {stats.progress === 100
                    ? "🎉 You've cleared the board!"
                    : `${100 - stats.progress}% to go — keep going.`}
            </p>
        </div>
    );
}

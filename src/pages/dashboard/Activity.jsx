import { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useFetch } from "../../hooks/useFetch";
import { taskService } from "../../services/taskService";

const STATUS_ICON = {
    done:     { icon: "✓", label: "Completed task" },
    active:   { icon: "◎", label: "In progress" },
    high:     { icon: "!", label: "High priority" },
};

function getRelativeTime(id) {
    return null;
}

export default function Activity() {
    const { user } = useAuth();
    const username = user?.username;

    const { data: tasks, loading, error, refetch } = useFetch(
        () => taskService.getByUser(username),
        [username]
    );

    const activities = useMemo(() => {
        const all = tasks || [];
        return [...all]
            .sort((a, b) => Number(b.id) - Number(a.id))
            .slice(0, 10)
            .map((task) => {
                const isHigh = task.priority === "High" && !task.completed;
                const key = task.completed ? "done" : isHigh ? "high" : "active";
                return {
                    id: task.id,
                    icon: STATUS_ICON[key].icon,
                    iconColor: task.completed
                        ? "var(--green)"
                        : isHigh ? "var(--red)" : "var(--amber)",
                    iconBg: task.completed
                        ? "rgba(62,207,142,0.1)"
                        : isHigh ? "rgba(241,96,96,0.1)" : "rgba(245,166,35,0.1)",
                    iconBorder: task.completed
                        ? "rgba(62,207,142,0.2)"
                        : isHigh ? "rgba(241,96,96,0.2)" : "rgba(245,166,35,0.2)",
                    action: STATUS_ICON[key].label,
                    details: task.title,
                    meta: `Priority: ${task.priority} · Assignee: ${task.assignee}`,
                    taskId: task.id,
                };
            });
    }, [tasks]);

    return (
        <div className="dashboardSection">
            <h2>Activity</h2>
            <p>Your 10 most recent tasks — sorted by latest first.</p>

            {loading && (
                <p className="muted" style={{ marginTop: 16 }}>Loading activity...</p>
            )}

            {error && (
                <div style={{ marginTop: 16 }}>
                    <p style={{ color: "var(--red)", fontSize: 13 }}>⚠️ {error}</p>
                    <button className="btn" style={{ marginTop: 8 }} onClick={refetch}>
                        Retry
                    </button>
                </div>
            )}

            {!loading && !error && activities.length === 0 && (
                <div className="emptyState" style={{ marginTop: 16 }}>
                    No activity yet. Add some tasks on the Home page!
                </div>
            )}

            {!loading && !error && activities.length > 0 && (
                <ul className="activityList">
                    {activities.map((item) => (
                        <li key={item.id} className="activityItem">
                            <div
                                className="activityIcon"
                                style={{
                                    color: item.iconColor,
                                    background: item.iconBg,
                                    borderColor: item.iconBorder,
                                    borderRadius: 9,
                                    fontFamily: "var(--font-mono)",
                                }}
                            >
                                {item.icon}
                            </div>
                            <div className="activityDetails">
                                <h4>{item.action}</h4>
                                <p>{item.details}</p>
                                <span className="activityTime">{item.meta}</span>
                            </div>
                            <span
                                className="activityTime"
                                style={{ marginLeft: "auto", flexShrink: 0 }}
                            >
                                #{item.taskId}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
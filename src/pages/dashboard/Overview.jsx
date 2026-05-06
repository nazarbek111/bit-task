import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useFetch } from "../../hooks/useFetch";
import { taskService } from "../../services/taskService";

export default function Overview() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const { data: tasks, loading, error } = useFetch(
        () => taskService.getByUser(user?.username),
        [user?.username]
    );

    const stats = useMemo(() => {
        const all = tasks || [];
        const done = all.filter((t) => t.completed).length;
        const active = all.length - done;
        const rate = all.length === 0 ? 0 : Math.round((done / all.length) * 100);
        const high = all.filter((t) => t.priority === "High" && !t.completed).length;
        return { total: all.length, done, active, rate, high };
    }, [tasks]);

    return (
        <div className="dashboardSection">
            <h2>Dashboard Overview</h2>
            <p>
                Welcome back, <strong>{user?.username}</strong>! Here's a live summary of your tasks.
            </p>

            {loading && <p className="muted" style={{ marginTop: 16 }}>Loading stats...</p>}

            {error && (
                <p style={{ color: "var(--danger)", marginTop: 16, fontSize: 13 }}>
                    ⚠️ Could not load tasks: {error}
                </p>
            )}

            {!loading && !error && (
                <>
                    <div className="overviewGrid">
                        <div className="overviewCard">
                            <h3>Total Tasks</h3>
                            <p className="overviewNumber">{stats.total}</p>
                        </div>
                        <div className="overviewCard">
                            <h3>Completed</h3>
                            <p className="overviewNumber" style={{ color: "var(--green)" }}>
                                {stats.done}
                            </p>
                        </div>
                        <div className="overviewCard">
                            <h3>Active</h3>
                            <p className="overviewNumber" style={{ color: "var(--amber)" }}>
                                {stats.active}
                            </p>
                        </div>
                        <div className="overviewCard">
                            <h3>Completion Rate</h3>
                            <p className="overviewNumber">{stats.rate}%</p>
                        </div>
                        {stats.high > 0 && (
                            <div className="overviewCard">
                                <h3>High Priority</h3>
                                <p className="overviewNumber" style={{ color: "var(--red)" }}>
                                    {stats.high}
                                </p>
                            </div>
                        )}
                    </div>

                    {stats.total === 0 ? (
                        <div className="emptyState" style={{ marginTop: 8 }}>
                            You have no tasks yet. Go to Home to add your first task!
                        </div>
                    ) : (
                        <div className="progressSection" style={{ marginBottom: 24 }}>
                            <div style={{
                                display: "flex", justifyContent: "space-between",
                                fontSize: 12, color: "var(--text-2)", marginBottom: 6
                            }}>
                                <span>Overall progress</span>
                                <span>{stats.rate}%</span>
                            </div>
                            <div style={{
                                height: 6, background: "var(--surface-3)",
                                borderRadius: 999, overflow: "hidden"
                            }}>
                                <div style={{
                                    width: `${stats.rate}%`,
                                    height: "100%",
                                    background: stats.rate === 100
                                        ? "var(--green)"
                                        : "var(--accent)",
                                    borderRadius: 999,
                                    transition: "width 0.6s ease"
                                }} />
                            </div>
                        </div>
                    )}
                </>
            )}

            <div className="quickActions">
                <h3>Quick Actions</h3>
                <div className="actionButtons">
                    <button className="actionBtn" onClick={() => navigate("/")}>
                        Add New Task
                    </button>
                    <button className="actionBtn" onClick={() => navigate("/dashboard/activity")}>
                        View Activity
                    </button>
                    <button
                        className="actionBtn"
                        onClick={() => {
                            const data = JSON.stringify(tasks || [], null, 2);
                            const blob = new Blob([data], { type: "application/json" });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `${user?.username}-tasks.json`;
                            a.click();
                            URL.revokeObjectURL(url);
                        }}
                    >
                        Export JSON
                    </button>
                </div>
            </div>
        </div>
    );
}
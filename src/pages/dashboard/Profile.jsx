import { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useFetch } from "../../hooks/useFetch";
import { taskService } from "../../services/taskService";

export default function Profile() {
    const { user } = useAuth();
    const username = user?.username || "User";

    const { data: tasks, loading } = useFetch(
        () => taskService.getByUser(username),
        [username]
    );

    const stats = useMemo(() => {
        const all = tasks || [];
        const done = all.filter((t) => t.completed).length;
        const active = all.length - done;
        const high = all.filter((t) => t.priority === "High").length;
        return { total: all.length, done, active, high };
    }, [tasks]);

    const joinedDate = useMemo(() => {
        const raw = user?.loggedInAt;
        if (!raw) return "—";
        return new Date(raw).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
        });
    }, [user]);

    const initials = username.slice(0, 2).toUpperCase();

    return (
        <div className="dashboardSection">
            <h2>Profile</h2>

            <div className="profileCard">
                <div className="avatarPlaceholder">{initials}</div>
                <div className="profileInfo">
                    <h3>{username}</h3>
                    <p className="profileRole">Member</p>
                    <p><strong>Session started:</strong> {joinedDate}</p>
                    <p><strong>Account type:</strong> Local auth</p>
                </div>
            </div>

            {loading ? (
                <p className="muted" style={{ marginTop: 12 }}>Loading stats...</p>
            ) : (
                <div className="profileStats">
                    <div className="statCard">
                        <h4>{stats.done}</h4>
                        <p>Completed</p>
                    </div>
                    <div className="statCard">
                        <h4>{stats.active}</h4>
                        <p>Active Tasks</p>
                    </div>
                    <div className="statCard">
                        <h4>{stats.total}</h4>
                        <p>Total Tasks</p>
                    </div>
                    <div className="statCard">
                        <h4 style={{ color: stats.high > 0 ? "var(--red)" : "var(--accent-text)" }}>
                            {stats.high}
                        </h4>
                        <p>High Priority</p>
                    </div>
                </div>
            )}
        </div>
    );
}
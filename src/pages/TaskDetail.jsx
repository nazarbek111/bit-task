import { useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { taskService } from "../services/taskService";
import { useFetch } from "../hooks/useFetch";
import { useToast } from "../hooks/useToast";
import { formatDueDate, relativeTime } from "../utils/dateUtils";

export default function TaskDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [actionLoading, setActionLoading] = useState(false);

    const { data: task, loading, error, refetch } = useFetch(
        () => taskService.getById(id),
        [id]
    );

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        setActionLoading(true);
        try {
            await taskService.remove(id);
            toast("Task deleted", "info");
            setTimeout(() => navigate("/"), 600);
        } catch (err) {
            toast(`Error: ${err.message || "Failed to delete task"}`, "error");
            setActionLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        setActionLoading(true);
        try {
            const nextCompleted = !task.completed;
            await taskService.update(id, {
                ...task,
                completed: nextCompleted,
                status: nextCompleted ? "done" : "todo",
            });
            await refetch();
            toast("Status updated", "success");
        } catch (err) {
            toast(`Update failed: ${err.message}`, "error");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="page centered">
                <div className="muted">Loading task…</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page centered">
                <div className="errorState">
                    <p>⚠️ {error}</p>
                    <button className="btn" onClick={refetch}>Retry</button>
                </div>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="page centered">
                <div className="emptyState">
                    <div className="emptyIcon">🔍</div>
                    <p>Task not found.</p>
                    <Link to="/" className="btn btn--primary" style={{ marginTop: 12 }}>Back to Dashboard</Link>
                </div>
            </div>
        );
    }

    const dateLabel = formatDueDate(task.dueDate);

    return (
        <div className="task-detail-container">
            <header className="task-header">
                <Link to="/" className="back-btn">← Back to Dashboard</Link>
            </header>

            <article className="card detailCard">
                <h1 className="detailTitle">{task.title}</h1>

                <div className="detailMeta">
                    <span className={`taskBadge ${task.completed ? "taskBadge--done" : "taskBadge--progress"}`}>
                        {task.completed ? "Done" : (task.status === "in-progress" ? "In Progress" : "To Do")}
                    </span>
                    <span className={`taskPriority taskPriority--${task.priority?.toLowerCase()}`}>
                        {task.priority}
                    </span>
                    {dateLabel && <span className="taskDate">🗓 {dateLabel}</span>}
                </div>

                <div className="detailSection">
                    <div className="detailLabel">Assignee</div>
                    <div className="detailValue">{task.assignee || "Unassigned"}</div>
                </div>

                {task.tags?.length > 0 && (
                    <div className="detailSection">
                        <div className="detailLabel">Tags</div>
                        <div className="detailValue">
                            {task.tags.map((t) => <span key={t} className="taskTag" style={{ marginRight: 6 }}>#{t}</span>)}
                        </div>
                    </div>
                )}

                {task.description && (
                    <div className="detailSection">
                        <div className="detailLabel">Description</div>
                        <div className="detailValue">{task.description}</div>
                    </div>
                )}

                {task.createdAt && (
                    <div className="detailSection">
                        <div className="detailLabel">Created</div>
                        <div className="detailValue muted">{relativeTime(task.createdAt)}</div>
                    </div>
                )}

                <div className="detailActions">
                    <button className="btn btn--primary" onClick={handleToggleStatus} disabled={actionLoading}>
                        {task.completed ? "↺ Mark as active" : "✓ Mark as done"}
                    </button>
                    <button className="btn btn--danger" onClick={handleDelete} disabled={actionLoading}>
                        ✕ Delete task
                    </button>
                </div>
            </article>
        </div>
    );
}

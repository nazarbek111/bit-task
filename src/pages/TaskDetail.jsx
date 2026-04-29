import { useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { taskService } from "../services/taskService";
import { useFetch } from "../hooks/useFetch";

export default function TaskDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [deleting, setDeleting] = useState(false);
    const [toggling, setToggling] = useState(false);

    const { data: task, loading, error, refetch } = useFetch(
        () => taskService.getById(id),
        [id]
    );

    const handleDelete = async () => {
        if (!window.confirm("Delete this task?")) return;
        setDeleting(true);
        try {
            await taskService.remove(id);
            navigate("/");
        } catch {
            alert("Failed to delete task");
            setDeleting(false);
        }
    };

    const handleToggle = async () => {
        setToggling(true);
        try {
            await taskService.update(id, { completed: !task.completed });
            refetch();
        } catch {
            alert("Failed to update task");
        } finally {
            setToggling(false);
        }
    };

    if (loading) {
        return (
            <div className="page">
                <div className="loadingSpinner">Loading task...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page">
                <div className="errorState">
                    <p>⚠️ {error}</p>
                    <button className="btn" onClick={refetch}>Try again</button>
                </div>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="page">
                <div className="emptyState">
                    <p>Task not found.</p>
                    <Link to="/" className="btn">Go back</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page" style={{ maxWidth: 600 }}>
            <Link to="/" className="backLink">← Back to tasks</Link>

            <div className="card" style={{ marginTop: 20, padding: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                    <h1 style={{ margin: 0, fontSize: 24 }}>{task.title}</h1>
                    <span className={`badge ${task.completed ? "badge--done" : "badge--progress"}`}>
            {task.completed ? "Done" : "In Progress"}
          </span>
                </div>

                <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                    <div className="detailRow">
                        <span className="detailLabel">Priority</span>
                        <span className={`priority priority--${task.priority?.toLowerCase()}`}>
              {task.priority}
            </span>
                    </div>
                    <div className="detailRow">
                        <span className="detailLabel">Assignee</span>
                        <span>{task.assignee}</span>
                    </div>
                    <div className="detailRow">
                        <span className="detailLabel">Task ID</span>
                        <span className="muted">#{task.id}</span>
                    </div>
                </div>

                <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <button
                        className="btn btn--primary"
                        onClick={handleToggle}
                        disabled={toggling}
                    >
                        {toggling ? "Updating..." : task.completed ? "Mark In Progress" : "Mark Done"}
                    </button>
                    <button
                        className="btn btn--danger"
                        onClick={handleDelete}
                        disabled={deleting}
                    >
                        {deleting ? "Deleting..." : "Delete Task"}
                    </button>
                </div>
            </div>
        </div>
    );
}
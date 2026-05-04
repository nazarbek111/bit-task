import { useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { taskService } from "../services/taskService";
import { useFetch } from "../hooks/useFetch";


export default function TaskDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [actionLoading, setActionLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    const { data: task, loading, error, refetch } = useFetch(
        () => taskService.getById(id),
        [id]
    );

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;

        setActionLoading(true);
        try {
            await taskService.remove(id);
            setSuccessMsg("Task deleted successfully!");
            setTimeout(() => navigate("/"), 1500);
        } catch (err) {
            alert("Error: " + (err.message || "Failed to delete task"));
            setActionLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        setActionLoading(true);
        try {
            await taskService.update(id, { completed: !task.completed });
            setSuccessMsg("Status updated!");
            await refetch();
            setTimeout(() => setSuccessMsg(""), 2000);
        } catch (err) {
            alert("Update failed: " + err.message);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return (
        <div className="page centered">
            <div className="spinner">Loading task details...</div>
        </div>
    );

    if (error) return (
        <div className="page centered">
            <div className="error-card">
                <p>⚠️ Error: {error}</p>
                <button className="btn" onClick={refetch}>Retry</button>
            </div>
        </div>
    );

    if (!task) return <div className="page centered">Task not found.</div>;

    return (
        <div className="page task-detail-container">
            <header className="task-header">
                <Link to="/" className="back-btn">← Back to Dashboard</Link>
                {successMsg && <span className="toast-success">{successMsg}</span>}
            </header>

            <article className="card shadow-lg">
                <section className="card-header">
                    <h1>{task.title}</h1>
                    <span className={`status-badge ${task.completed ? "done" : "pending"}`}>
                        {task.completed ? "Completed" : "In Progress"}
                    </span>
                </section>

                <hr />

                <section className="card-body">
                    <div className="info-grid">
                        <div className="info-item">
                            <label>Priority:</label>
                            <span className={`prio-${task.priority?.toLowerCase()}`}>{task.priority}</span>
                        </div>
                        <div className="info-item">
                            <label>Assignee:</label>
                            <span>{task.assignee}</span>
                        </div>
                        <div className="info-item">
                            <label>ID:</label>
                            <span className="text-muted">#{task.id}</span>
                        </div>
                    </div>
                </section>

                <footer className="card-actions">
                    <button
                        className="btn btn-primary"
                        onClick={handleToggleStatus}
                        disabled={actionLoading}
                    >
                        {actionLoading ? "Processing..." : task.completed ? "Undo Task" : "Complete Task"}
                    </button>

                    <button
                        className="btn btn-outline-danger"
                        onClick={handleDelete}
                        disabled={actionLoading}
                    >
                        Delete
                    </button>
                </footer>
            </article>
        </div>
    );
}
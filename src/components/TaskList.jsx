import { useNavigate } from "react-router-dom";

export default function TaskList({ tasks, onToggle, onDelete }) {
    const navigate = useNavigate();

    if (tasks.length === 0) return <p className="muted">No tasks found.</p>;

    return (
        <div className="taskList">
            {tasks.map((task) => (
                <div className="taskItem" key={task.id}>
                    <div className="taskLeft">
                        <button
                            className={"badge " + (task.completed ? "badge--done" : "badge--progress")}
                            onClick={() => onToggle(task.id)}
                            type="button"
                        >
                            {task.completed ? "Done" : "In Progress"}
                        </button>

                        <div>
                            <div
                                className={"taskTitle " + (task.completed ? "taskTitle--done" : "")}
                                onClick={() => navigate(`/tasks/${task.id}`)}
                                style={{ cursor: "pointer" }}
                                title="View details"
                            >
                                {task.title}
                            </div>
                            <div className="muted">Assignee: {task.assignee}</div>
                            <div className="muted">
                                Priority:{" "}
                                <span className={"priority priority--" + task.priority?.toLowerCase()}>
                                    {task.priority}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button className="btn btn--danger" onClick={() => onDelete(task.id)} type="button">
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
}
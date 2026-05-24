import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDueDate, dueDateStatus } from "../utils/dateUtils";

const PRIORITY_CLASS = {
    High:   "taskItem--high",
    Normal: "taskItem--normal",
    Low:    "taskItem--low",
};

const TaskItem = memo(function TaskItem({ task, onToggle, onDelete }) {
    const { id, title, priority, assignee, completed, tags, dueDate } = task;
    const navigate = useNavigate();
    const [removing, setRemoving] = useState(false);

    const handleDelete = (event) => {
        event.stopPropagation();
        setRemoving(true);
        setTimeout(() => onDelete(id), 280);
    };

    const dateLabel = formatDueDate(dueDate);
    const dateState = dueDateStatus(dueDate);

    return (
        <div className={[
            "taskItem",
            PRIORITY_CLASS[priority] || "",
            removing ? "taskItem--removing" : "",
            completed ? "taskItem--done" : "",
        ].join(" ")}>
            <div className="taskItemAccent" />
            <div className="taskLeft">
                <button
                    className={"taskCheck " + (completed ? "taskCheck--done" : "")}
                    onClick={() => onToggle(id)}
                    type="button"
                    title="Toggle status"
                >
                    {completed ? "✓" : ""}
                </button>
                <div className="taskBody">
                    <div
                        className={"taskTitle " + (completed ? "taskTitle--done" : "")}
                        onClick={() => navigate(`/tasks/${id}`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && navigate(`/tasks/${id}`)}
                    >
                        {title}
                    </div>
                    <div className="taskMeta">
                        <span className={`taskPriority taskPriority--${priority?.toLowerCase()}`}>
                            {priority}
                        </span>
                        <span className="taskMetaDot">·</span>
                        <span className="taskAssignee">{assignee || "Unassigned"}</span>
                        {dateLabel && (
                            <>
                                <span className="taskMetaDot">·</span>
                                <span className={`taskDate taskDate--${dateState}`}>🗓 {dateLabel}</span>
                            </>
                        )}
                        {tags?.map((t) => (
                            <span key={t} className="taskTag">#{t}</span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="taskRight">
                <span className={"taskBadge " + (completed ? "taskBadge--done" : "taskBadge--progress")}>
                    {completed ? "Done" : "In Progress"}
                </span>
                <button
                    className="taskDeleteBtn"
                    onClick={handleDelete}
                    type="button"
                    title="Delete task"
                >
                    ✕
                </button>
            </div>
        </div>
    );
});

export default TaskItem;
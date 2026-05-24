import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { formatDueDate, dueDateStatus } from "../utils/dateUtils";

const COLUMNS = [
    { id: "todo",        title: "To Do",       dot: "kanbanColDot--todo" },
    { id: "in-progress", title: "In Progress", dot: "kanbanColDot--in-progress" },
    { id: "done",        title: "Done",        dot: "kanbanColDot--done" },
];

function KanbanCard({ task, onClickTitle, onDragStart, onDragEnd, isDragging }) {
    const dateLabel = formatDueDate(task.dueDate);
    const dateState = dueDateStatus(task.dueDate);
    const initials = (task.assignee || "?").slice(0, 2).toUpperCase();
    const priority = (task.priority || "Normal").toLowerCase();

    return (
        <div
            className={`kCard kCard--${priority} ${isDragging ? "kCard--dragging" : ""}`}
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
        >
            <div className="kCardTitle" onClick={onClickTitle}>{task.title}</div>

            <div className="kCardMeta">
                <span className={`taskPriority taskPriority--${priority}`}>{task.priority}</span>
                {task.tags?.map((t) => (
                    <span key={t} className="taskTag">#{t}</span>
                ))}
                {dateLabel && (
                    <span className={`taskDate taskDate--${dateState}`}>
                        🗓 {dateLabel}
                    </span>
                )}
            </div>

            <div className="kCardFooter">
                <div className="kCardAssignee">
                    <span className="kCardAvatar">{initials}</span>
                    {task.assignee || "Unassigned"}
                </div>
            </div>
        </div>
    );
}

export default function KanbanBoard({ tasks, onStatusChange }) {
    const navigate = useNavigate();
    const [draggingId, setDraggingId] = useState(null);
    const [overCol, setOverCol] = useState(null);

    // Group tasks by their derived status.
    const grouped = useMemo(() => {
        const g = { todo: [], "in-progress": [], done: [] };
        for (const t of tasks) {
            const s = t.status || (t.completed ? "done" : "todo");
            (g[s] || g.todo).push(t);
        }
        return g;
    }, [tasks]);

    const handleDragStart = useCallback((id) => (e) => {
        setDraggingId(id);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", String(id));
    }, []);

    const handleDragEnd = useCallback(() => {
        setDraggingId(null);
        setOverCol(null);
    }, []);

    const handleDragOver = useCallback((colId) => (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (overCol !== colId) setOverCol(colId);
    }, [overCol]);

    const handleDragLeave = useCallback(() => setOverCol(null), []);

    const handleDrop = useCallback((colId) => (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("text/plain");
        setOverCol(null);
        setDraggingId(null);
        if (!id) return;
        onStatusChange(id, colId);
    }, [onStatusChange]);

    return (
        <div className="kanban">
            {COLUMNS.map((col) => (
                <div
                    key={col.id}
                    className={`kanbanCol ${overCol === col.id ? "kanbanCol--over" : ""}`}
                    onDragOver={handleDragOver(col.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop(col.id)}
                >
                    <div className="kanbanColHeader">
                        <div className="kanbanColTitle">
                            <span className={`kanbanColDot ${col.dot}`} />
                            {col.title}
                        </div>
                        <span className="kanbanColCount">{grouped[col.id].length}</span>
                    </div>

                    <div className="kanbanCards">
                        {grouped[col.id].length === 0 ? (
                            <div className="kanbanEmpty">Drop tasks here</div>
                        ) : (
                            grouped[col.id].map((task) => (
                                <KanbanCard
                                    key={task.id}
                                    task={task}
                                    isDragging={draggingId === task.id}
                                    onClickTitle={() => navigate(`/tasks/${task.id}`)}
                                    onDragStart={handleDragStart(task.id)}
                                    onDragEnd={handleDragEnd}
                                />
                            ))
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
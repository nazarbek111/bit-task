import { useState, useMemo } from "react";
import { parseSmartInput } from "../utils/smartParser";

const initialForm = { title: "", priority: "Normal", assignee: "" };

export default function TaskForm({ onAddTask, disabled }) {
    const [formData, setFormData] = useState(initialForm);
    const [error, setError] = useState("");

    // Live preview of what the parser is currently extracting.
    const preview = useMemo(() => parseSmartInput(formData.title), [formData.title]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError("");
    };

    const submit = (event) => {
        event.preventDefault();

        const parsed = parseSmartInput(formData.title);
        const title = parsed.title;
        const priority = parsed.priority !== "Normal" ? parsed.priority : formData.priority;
        const assignee = parsed.assignee || formData.assignee.trim();

        if (!title) {
            setError("Task title is required.");
            return;
        }

        onAddTask({
            title,
            priority,
            assignee: assignee || "Unassigned",
            tags: parsed.tags,
            dueDate: parsed.dueDate,
            status: "todo",
            completed: false,
        });

        setFormData(initialForm);
        setError("");
    };

    const { title, priority, assignee } = formData;

    // Show the live preview only when shortcuts are actually present.
    const hasShortcuts =
        preview.priority !== "Normal" ||
        preview.tags.length > 0 ||
        preview.assignee ||
        preview.dueDate;

    return (
        <form className="taskForm" onSubmit={submit}>
            <input
                className="input"
                name="title"
                type="text"
                value={title}
                onChange={handleChange}
                placeholder='Add task… try "design landing tomorrow !high #web"'
                disabled={disabled}
                autoComplete="off"
            />

            <select
                className="select"
                name="priority"
                value={priority}
                onChange={handleChange}
                disabled={disabled}
            >
                <option value="High">High</option>
                <option value="Normal">Normal</option>
                <option value="Low">Low</option>
            </select>

            <input
                className="input"
                name="assignee"
                type="text"
                value={assignee}
                onChange={handleChange}
                placeholder="Assignee (optional)"
                disabled={disabled}
            />

            <button className="btn btn--primary" type="submit" disabled={disabled}>
                {disabled ? "Adding…" : "Add Task"}
            </button>

            {hasShortcuts && (
                <p className="smartHint">
                    ✨ Detected:&nbsp;
                    {preview.priority !== "Normal" && <code>!{preview.priority}</code>}
                    {preview.assignee && <> <code>@{preview.assignee}</code></>}
                    {preview.tags.length > 0 && <> {preview.tags.map((t) => <code key={t}>#{t}</code>)}</>}
                    {preview.dueDate && <> <code>🗓 {new Date(preview.dueDate).toLocaleDateString()}</code></>}
                </p>
            )}

            {!hasShortcuts && (
                <p className="smartHint">
                    💡 Tip: type <code>!high</code> <code>#tag</code> <code>@name</code> <code>tomorrow</code> for shortcuts
                </p>
            )}

            {error && <p className="formError">{error}</p>}
        </form>
    );
}
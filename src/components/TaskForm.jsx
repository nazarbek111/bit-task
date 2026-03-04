import { useState } from "react";

export default function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Normal");

  const submit = (event) => {
    event.preventDefault();

    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    onAddTask(cleanTitle, priority);
    setTitle("");
    setPriority("Normal");
  };

  return (
    <form className="taskForm" onSubmit={submit}>
      <input
        className="input"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="New task title"
      />

      <select
        className="select"
        value={priority}
        onChange={(event) => setPriority(event.target.value)}
      >
        <option value="Normal">Normal</option>
        <option value="High">High</option>
      </select>

      <button className="btn btn--primary" type="submit">
        Add Task
      </button>
    </form>
  );
}

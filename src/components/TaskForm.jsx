import { useState } from "react";

const initialForm = {
  title: "",
  priority: "Normal",
  assignee: "",
};

export default function TaskForm({ onAddTask }) {
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submit = (event) => {
    event.preventDefault();

    const trimmedData = {
      title: formData.title.trim(),
      priority: formData.priority.trim(),
      assignee: formData.assignee.trim(),
    };

    if (!trimmedData.title || !trimmedData.priority || !trimmedData.assignee) {
      setError("Please fill in all fields.");
      return;
    }

    onAddTask(trimmedData);
    setFormData(initialForm);
    setError("");
  };

  const { title, priority, assignee } = formData;

  return (
    <form className="taskForm" onSubmit={submit}>
      <input
        className="input"
        name="title"
        type="text"
        value={title}
        onChange={handleChange}
        placeholder="Task title"
      />

      <select
        className="select"
        name="priority"
        value={priority}
        onChange={handleChange}
      >
        <option value="Normal">Normal</option>
        <option value="High">High</option>
        <option value="Low">Low</option>
      </select>

      <input
        className="input"
        name="assignee"
        type="text"
        value={assignee}
        onChange={handleChange}
        placeholder="Assignee"
      />

      <button className="btn btn--primary" type="submit">
        Add Task
      </button>

      {error && <p className="muted">{error}</p>}
    </form>
  );
}
import { useState } from 'react';

const initialForm = {
    title: '',
    priority: 'Normal',
    assignee: '',
};

export default function TaskForm({ onAddTask, disabled }) {
    const [formData, setFormData] = useState(initialForm);
    const [error, setError] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const submit = (event) => {
        event.preventDefault();

        const trimmedData = {
            title: formData.title.trim(),
            priority: formData.priority.trim(),
            assignee: formData.assignee.trim(),
        };

        if (!trimmedData.title || !trimmedData.priority || !trimmedData.assignee) {
            setError('Please fill in all fields before adding a task.');
            return;
        }

        onAddTask(trimmedData);
        setFormData(initialForm);
        setError('');
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
                disabled={disabled}
            />

            <select
                className="select"
                name="priority"
                value={priority}
                onChange={handleChange}
                disabled={disabled}
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
                disabled={disabled}
            />

            <button className="btn btn--primary" type="submit" disabled={disabled}>
                {disabled ? 'Adding...' : 'Add Task'}
            </button>

            {error && <p className="formError">{error}</p>}
        </form>
    );
}
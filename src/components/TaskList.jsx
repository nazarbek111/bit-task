import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onToggle, onDelete }) {
    if (tasks.length === 0) {
        return <p className="muted">No tasks match your filters.</p>;
    }

    return (
        <div className="taskList">
            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
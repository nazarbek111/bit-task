export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div className="taskItem">
      <div className="taskLeft">
        <button
          className={"badge " + (task.completed ? "badge--done" : "badge--progress")}
          onClick={() => onToggle(task.id)}
          type="button"
          title="Toggle status"
        >
          {task.completed ? "Done" : "In Progress"}
        </button>

        <div>
          <div className={"taskTitle " + (task.completed ? "taskTitle--done" : "")}>{task.title}</div>
          <div className="muted">
            Priority: <span className={"priority priority--" + task.priority.toLowerCase()}>{task.priority}</span>
          </div>
        </div>
      </div>

      <button className="btn btn--danger" onClick={() => onDelete(task.id)} type="button">
        Delete
      </button>
    </div>
  );
}

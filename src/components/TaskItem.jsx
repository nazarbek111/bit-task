export default function TaskItem({ task, onToggle, onDelete }) {
  const { id, title, priority, assignee, completed } = task;

  return (
    <div className="taskItem">
      <div className="taskLeft">
        <button
          className={"badge " + (completed ? "badge--done" : "badge--progress")}
          onClick={() => onToggle(id)}
          type="button"
          title="Toggle status"
        >
          {completed ? "Done" : "In Progress"}
        </button>

        <div>
          <div className={"taskTitle " + (completed ? "taskTitle--done" : "")}>
            {title}
          </div>

          <div className="muted">
            Assignee: {assignee}
          </div>

          <div className="muted">
            Priority:{" "}
            <span className={"priority priority--" + priority.toLowerCase()}>
              {priority}
            </span>
          </div>
        </div>
      </div>

      <button
        className="btn btn--danger"
        onClick={() => onDelete(id)}
        type="button"
      >
        Delete
      </button>
    </div>
  );
}
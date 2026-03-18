export default function TaskFilters({ filter, onChange, sortBy, onSortChange }) {
  return (
    <div className="filters">
      <button
        className={"chip " + (filter === "all" ? "chip--active" : "")}
        onClick={() => onChange("all")}
        type="button"
      >
        All
      </button>

      <button
        className={"chip " + (filter === "active" ? "chip--active" : "")}
        onClick={() => onChange("active")}
        type="button"
      >
        Active
      </button>

      <button
        className={"chip " + (filter === "done" ? "chip--active" : "")}
        onClick={() => onChange("done")}
        type="button"
      >
        Done
      </button>

      <select
        className="select"
        value={sortBy}
        onChange={(event) => onSortChange(event.target.value)}
      >
        <option value="default">Sort: Default</option>
        <option value="title">Sort: Title A-Z</option>
        <option value="priority">Sort: High Priority</option>
      </select>
    </div>
  );
}
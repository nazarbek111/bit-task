export default function TaskFilters({ filter, onChange }) {
  return (
    <div className="filters">
      <button
        className={"chip " + (filter === "all" ? "chip--active" : "")}
        onClick={() => onChange("all")} // event listener: onClick
        type="button"
      >
        All
      </button>

      <button
        className={"chip " + (filter === "active" ? "chip--active" : "")}
        onClick={() => onChange("active")} // event listener: onClick
        type="button"
      >
        Active
      </button>

      <button
        className={"chip " + (filter === "done" ? "chip--active" : "")}
        onClick={() => onChange("done")} // event listener: onClick
        type="button"
      >
        Done
      </button>
    </div>
  );
}
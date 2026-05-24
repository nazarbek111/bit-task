export default function TaskFilters({ filter, onChange, sortBy, onSortChange }) {
    return (
        <div className="filters">
            <button className={"chip " + (filter === "all" ? "chip--active" : "")}    onClick={() => onChange("all")}    type="button">All</button>
            <button className={"chip " + (filter === "active" ? "chip--active" : "")} onClick={() => onChange("active")} type="button">Active</button>
            <button className={"chip " + (filter === "done" ? "chip--active" : "")}   onClick={() => onChange("done")}   type="button">Done</button>

            <select className="select" value={sortBy} onChange={(event) => onSortChange(event.target.value)}>
                <option value="default">Default</option>
                <option value="title">A→Z</option>
                <option value="priority">By priority</option>
                <option value="dueDate">By due date</option>
            </select>
        </div>
    );
}

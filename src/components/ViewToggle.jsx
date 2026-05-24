export default function ViewToggle({ value, onChange }) {
    return (
        <div className="viewToggle">
            <button
                type="button"
                className={`viewToggleBtn ${value === "list" ? "viewToggleBtn--active" : ""}`}
                onClick={() => onChange("list")}
            >
                ☰ List
            </button>
            <button
                type="button"
                className={`viewToggleBtn ${value === "board" ? "viewToggleBtn--active" : ""}`}
                onClick={() => onChange("board")}
            >
                ⊞ Board
            </button>
        </div>
    );
}
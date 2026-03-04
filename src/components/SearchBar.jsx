export default function SearchBar({ value, onChange }) {
  return (
    <input
      className="input"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search tasks by title"
    />
  );
}

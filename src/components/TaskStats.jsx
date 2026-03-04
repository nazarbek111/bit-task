export default function TaskStats({ total, done }) {
  const progress = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="stats">
      <span className="pill">Total: {total}</span>
      <span className="pill">Done: {done}</span>
      <span className="pill">Progress: {progress}%</span>
    </div>
  );
}

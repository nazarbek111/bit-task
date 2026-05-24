export default function TaskStats({ total, done, progress }) {
    return (
        <div className="stats">
            <span className="pill">Total <strong>{total}</strong></span>
            <span className="pill">Done <strong>{done}</strong></span>
            <span className="pill">Progress <strong>{progress}%</strong></span>
        </div>
    );
}

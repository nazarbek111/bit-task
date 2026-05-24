import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="page centered">
            <div style={{ textAlign: "center" }}>
                <h1 style={{
                    fontSize: 140, margin: 0, lineHeight: 1,
                    background: "var(--brand-grad)",
                    WebkitBackgroundClip: "text", backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: 800, letterSpacing: "-0.05em",
                }}>404</h1>
                <h2 style={{ marginBottom: 12 }}>Page not found</h2>
                <p className="muted" style={{ marginBottom: 24 }}>
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link to="/" className="btn btn--primary">← Back to Home</Link>
            </div>
        </div>
    );
}

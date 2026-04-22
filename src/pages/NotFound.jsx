import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="page" style={{ textAlign: "center", marginTop: 48 }}>
            <p style={{ fontSize: 72, margin: "0 0 8px", fontWeight: 800 }}>404</p>
            <h1 style={{ margin: "0 0 12px" }}>Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <Link to="/" className="submitBtn" style={{ display: "inline-block", marginTop: 16, textDecoration: "none" }}>
                Go Home
            </Link>
        </div>
    );
}
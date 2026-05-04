import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="page" style={{ textAlign: 'center', marginTop: '100px' }}>
            <h1 style={{ fontSize: '120px', color: 'var(--accent-purple)', margin: 0 }}>404</h1>
            <h2 style={{ marginBottom: '20px' }}>Oops! Page not found.</h2>
            <p className="text-muted" style={{ marginBottom: '30px' }}>
                The page you are looking for doesn't exist or has been moved.
            </p>
            <Link to="/" className="btn btn--primary">
                Back to Home
            </Link>
        </div>
    );
}
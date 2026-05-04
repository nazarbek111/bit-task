import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        const ok = login(username, password);
        if (ok) {
            navigate("/dashboard");
        } else {
            setError("Please enter both username and password.");
        }
    };

    return (
        <div className="page" style={{ maxWidth: 420, marginTop: 48 }}>
            <h1>Sign In</h1>
            <p>Enter any username and password to continue.</p>
            <form className="contactForm" onSubmit={handleSubmit}>
                <div className="formGroup">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        className="input"
                        placeholder="e.g. nazarbek"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="formGroup">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        className="input"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && (
                    <p className="formError">{error}</p>
                )}
                <button type="submit" className="submitBtn">
                    Sign In
                </button>
            </form>
        </div>
    );
}
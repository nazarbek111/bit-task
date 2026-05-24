import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const redirectTo = location.state?.from || "/";

    const validate = () => {
        const e = {};
        if (!username.trim()) e.username = "Username is required.";
        if (!password.trim()) e.password = "Password is required.";
        if (password.length > 0 && password.length < 3) e.password = "Password must be at least 3 characters.";
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setLoading(true);
        // Simulate latency so the spinner is visible.
        await new Promise((r) => setTimeout(r, 600));
        const ok = login(username.trim(), password.trim());
        setLoading(false);

        if (ok) {
            toast(`Welcome back, ${username}!`, "success");
            navigate(redirectTo, { replace: true });
        } else {
            setErrors({ form: "Enter any username and password to continue." });
        }
    };

    return (
        <div className="loginPage">
            <div className="loginSide">
                <div className="loginSideContent">
                    <div className="loginLogo">
                        <span className="loginLogoDot" />
                        BitTask
                    </div>
                    <h2 className="loginSideTitle">Plan less.<br />Ship more.</h2>
                    <p className="loginSideText">
                        A clean, keyboard-first workspace for tasks, sprints, and personal goals.
                        Built for the way you actually work.
                    </p>
                    <div className="loginFeatures">
                        {[
                            "⌘K command palette",
                            "Drag-and-drop Kanban",
                            "Smart natural-language input",
                            "Dark mode included",
                        ].map((f) => (
                            <div key={f} className="loginFeatureItem">
                                <span className="loginFeatureDot" />
                                {f}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <form className="loginForm" onSubmit={handleSubmit}>
                <div className="loginFormInner">
                    <h1 className="loginTitle">Sign in</h1>
                    <p className="loginSubtitle">Enter any username and password to continue.</p>

                    {errors.form && <div className="loginError">{errors.form}</div>}

                    <div className="loginFields">
                        <div className="formGroup">
                            <label>Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => { setUsername(e.target.value); setErrors({}); }}
                                className={errors.username ? "inputError" : ""}
                                placeholder="e.g. nazarbek"
                                autoFocus
                            />
                            {errors.username && <span className="fieldError">{errors.username}</span>}
                        </div>

                        <div className="formGroup">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setErrors({}); }}
                                className={errors.password ? "inputError" : ""}
                                placeholder="••••••••"
                            />
                            {errors.password && <span className="fieldError">{errors.password}</span>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={"loginBtn " + (loading ? "loginBtn--loading" : "")}
                        disabled={loading}
                    >
                        {loading ? <span className="loginSpinner" /> : "Sign in →"}
                    </button>
                </div>
            </form>
        </div>
    );
}
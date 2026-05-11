import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";

export default function Login() {
    const { login } = useAuth();
    const navigate  = useNavigate();
    const toast     = useToast();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading,  setLoading]  = useState(false);
    const [errors,   setErrors]   = useState({});

    const validate = () => {
        const e = {};
        if (!username.trim()) e.username = "Username is required.";
        if (!password.trim()) e.password = "Password is required.";
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setLoading(true);
        await new Promise((r) => setTimeout(r, 600));
        const ok = login(username.trim(), password.trim());
        setLoading(false);
        if (ok) {
            toast("Welcome back, " + username + "!", "success");
            navigate("/");
        } else {
            setErrors({ form: "Enter any username and password to continue." });
        }
    };

    return (
        <div className="loginPage">
            <div className="loginSide">
                <div className="loginSideContent">
                    <div className="loginLogo"><span className="loginLogoDot" />BitTask</div>
                    <h2 className="loginSideTitle">Manage tasks.<br />Stay focused.</h2>
                    <p className="loginSideText">A clean workspace for your daily tasks — priorities, progress, and nothing else.</p>
                    <div className="loginFeatures">
                        {["Per-user task isolation","Real-time API sync","Dark mode included"].map((f) => (
                            <div key={f} className="loginFeatureItem"><span className="loginFeatureDot" />{f}</div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="loginForm">
                <div className="loginFormInner">
                    <h1 className="loginTitle">Sign in</h1>
                    <p className="loginSubtitle">Enter any username and password to continue.</p>
                    {errors.form && <div className="loginError">{errors.form}</div>}
                    <div className="loginFields">
                        <div className="formGroup">
                            <label>Username</label>
                            <input type="text" value={username} onChange={(e) => { setUsername(e.target.value); setErrors({}); }} className={errors.username ? "inputError" : ""} placeholder="e.g. nazarbek" autoFocus />
                            {errors.username && <span className="fieldError">{errors.username}</span>}
                        </div>
                        <div className="formGroup">
                            <label>Password</label>
                            <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setErrors({}); }} className={errors.password ? "inputError" : ""} placeholder="••••••••" />
                            {errors.password && <span className="fieldError">{errors.password}</span>}
                        </div>
                    </div>
                    <button className={"loginBtn " + (loading ? "loginBtn--loading" : "")} onClick={handleSubmit} disabled={loading}>
                        {loading ? <span className="loginSpinner" /> : "Sign in →"}
                    </button>
                </div>
            </div>
        </div>
    );
}
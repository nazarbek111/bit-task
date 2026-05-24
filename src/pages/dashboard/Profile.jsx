import { useAuth } from "../../context/AuthContext";

export default function Profile() {
    const { user } = useAuth();
    if (!user) return null;

    const initials = user.username.slice(0, 2).toUpperCase();
    const loggedAt = new Date(user.loggedInAt).toLocaleString();

    return (
        <div>
            <h2 style={{ marginBottom: 6 }}>Profile</h2>
            <p className="muted" style={{ marginBottom: 24 }}>Your account information.</p>

            <div className="card" style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{
                    width: 64, height: 64, borderRadius: 16,
                    background: "var(--brand-grad)", color: "white",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 24, fontWeight: 700,
                    boxShadow: "var(--brand-glow)",
                }}>
                    {initials}
                </div>
                <div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{user.username}</div>
                    <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>
                        Logged in at {loggedAt}
                    </div>
                </div>
            </div>
        </div>
    );
}
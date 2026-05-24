import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useTheme } from "../../context/ThemeContext";

const defaultSettings = {
    notifications: true,
    confettiOnComplete: true,
    compactView: false,
};

export default function Settings() {
    const [settings, setSettings] = useLocalStorage("bittask.settings", defaultSettings);
    const { theme, toggleTheme } = useTheme();

    const toggle = (key) => setSettings({ ...settings, [key]: !settings[key] });

    const Row = ({ label, value, onChange, hint }) => (
        <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "14px 0", borderBottom: "1px solid var(--border)",
        }}>
            <div>
                <div style={{ fontWeight: 500 }}>{label}</div>
                {hint && <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{hint}</div>}
            </div>
            <button
                className={`viewToggleBtn ${value ? "viewToggleBtn--active" : ""}`}
                onClick={onChange}
                style={{ minWidth: 60 }}
            >
                {value ? "ON" : "OFF"}
            </button>
        </div>
    );

    return (
        <div>
            <h2 style={{ marginBottom: 6 }}>Settings</h2>
            <p className="muted" style={{ marginBottom: 16 }}>Personalize your BitTask experience.</p>

            <div className="card">
                <Row
                    label="Dark mode"
                    hint="Theme is saved across sessions"
                    value={theme === "dark"}
                    onChange={toggleTheme}
                />
                <Row
                    label="Toast notifications"
                    hint="Show feedback messages after actions"
                    value={settings.notifications}
                    onChange={() => toggle("notifications")}
                />
                <Row
                    label="Confetti on full completion"
                    hint="Celebrate when all tasks are done 🎉"
                    value={settings.confettiOnComplete}
                    onChange={() => toggle("confettiOnComplete")}
                />
                <Row
                    label="Compact view"
                    hint="Reduce paddings in lists"
                    value={settings.compactView}
                    onChange={() => toggle("compactView")}
                />
            </div>
        </div>
    );
}
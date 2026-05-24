import { useRef } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../hooks/useToast";
import { useFetch } from "../../hooks/useFetch";
import { useAuth } from "../../context/AuthContext";
import { taskService } from "../../services/taskService";

const defaultSettings = {
    notifications: true,
    confettiOnComplete: true,
    compactView: false,
    soundEffects: false,
    defaultView: "list",
    defaultSort: "default",
    dateFormat: "smart",
};

function Switch({ on, onChange, label }) {
    return (
        <button
            type="button"
            className={"switch " + (on ? "switch--on" : "")}
            onClick={onChange}
            aria-pressed={on}
            aria-label={label}
        />
    );
}

function Segmented({ value, options, onChange }) {
    return (
        <div className="segmented">
            {options.map((o) => (
                <button
                    key={o.value}
                    type="button"
                    className={"segmentedBtn " + (value === o.value ? "segmentedBtn--active" : "")}
                    onClick={() => onChange(o.value)}
                >
                    {o.label}
                </button>
            ))}
        </div>
    );
}

export default function Settings() {
    const [settings, setSettings] = useLocalStorage("bittask.settings", defaultSettings);
    const { theme, toggleTheme } = useTheme();
    const toast = useToast();
    const { user } = useAuth();
    const fileInputRef = useRef(null);


    const { data: tasks, refetch } = useFetch(
        () => taskService.getByUser(user?.username),
        [user?.username]
    );

    const setOption = (key, value) => setSettings({ ...settings, [key]: value });
    const toggle    = (key) => setOption(key, !settings[key]);


    const handleExport = () => {
        const payload = {
            exportedAt: new Date().toISOString(),
            user: user?.username,
            tasks: tasks || [],
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `bittask-${user?.username}-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast(`Exported ${tasks?.length || 0} tasks`, "success");
    };


    const handleImport = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            if (!Array.isArray(data.tasks)) throw new Error("Invalid file");

            let imported = 0;
            for (const t of data.tasks) {
                const { id, userId, ...rest } = t;
                await taskService.create(rest, user?.username);
                imported += 1;
            }
            await refetch();
            toast(`Imported ${imported} tasks`, "success");
        } catch (err) {
            toast(`Import failed: ${err.message}`, "error");
        } finally {
            event.target.value = "";
        }
    };


    const handleResetLocal = () => {
        if (!window.confirm("Reset all local preferences? Tasks on the server are not affected.")) return;
        localStorage.removeItem("bittask.settings");
        localStorage.removeItem("bittask.profile");
        localStorage.removeItem("bittask.view");
        setSettings(defaultSettings);
        toast("Local preferences reset", "info");
    };

    const handleDeleteAllTasks = async () => {
        if (!tasks?.length) { toast("Nothing to delete", "info"); return; }
        const confirm = window.prompt(
            `This will delete ALL ${tasks.length} of your tasks.\nType DELETE to confirm:`
        );
        if (confirm !== "DELETE") return;
        try {
            await Promise.all(tasks.map((t) => taskService.remove(t.id)));
            await refetch();
            toast(`Deleted ${tasks.length} tasks`, "info");
        } catch (err) {
            toast(`Failed: ${err.message}`, "error");
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 20 }}>
                <h1 style={{ margin: 0, fontSize: 28 }}>Settings</h1>
                <p className="muted" style={{ margin: "4px 0 0" }}>Customize your BitTask workspace.</p>
            </div>

            {/* APPEARANCE */}
            <div className="settingsGroup">
                <div className="settingsGroupHeader">
                    <h3 className="settingsGroupTitle">Appearance</h3>
                </div>
                <div className="settingsRow">
                    <div>
                        <div className="settingsRowLabel">Theme</div>
                        <div className="settingsRowHint">Switch between light and dark — saved across sessions.</div>
                    </div>
                    <div className="settingsRowAction">
                        <Segmented
                            value={theme}
                            options={[{ value: "light", label: "☀ Light" }, { value: "dark", label: "🌙 Dark" }]}
                            onChange={(v) => v !== theme && toggleTheme()}
                        />
                    </div>
                </div>
                <div className="settingsRow">
                    <div>
                        <div className="settingsRowLabel">Compact view</div>
                        <div className="settingsRowHint">Reduce padding for higher information density.</div>
                    </div>
                    <Switch on={settings.compactView} onChange={() => toggle("compactView")} label="Compact view" />
                </div>
            </div>

            {/* WORKSPACE */}
            <div className="settingsGroup">
                <div className="settingsGroupHeader">
                    <h3 className="settingsGroupTitle">Workspace defaults</h3>
                </div>
                <div className="settingsRow">
                    <div>
                        <div className="settingsRowLabel">Default view</div>
                        <div className="settingsRowHint">Open the workspace in this layout.</div>
                    </div>
                    <Segmented
                        value={settings.defaultView}
                        options={[
                            { value: "list",  label: "☰ List" },
                            { value: "board", label: "⊞ Board" },
                        ]}
                        onChange={(v) => setOption("defaultView", v)}
                    />
                </div>
                <div className="settingsRow">
                    <div>
                        <div className="settingsRowLabel">Default sort</div>
                        <div className="settingsRowHint">How tasks are ordered when you load the page.</div>
                    </div>
                    <select
                        className="select"
                        style={{ width: "auto" }}
                        value={settings.defaultSort}
                        onChange={(e) => setOption("defaultSort", e.target.value)}
                    >
                        <option value="default">Default</option>
                        <option value="title">A → Z</option>
                        <option value="priority">By priority</option>
                        <option value="dueDate">By due date</option>
                    </select>
                </div>
                <div className="settingsRow">
                    <div>
                        <div className="settingsRowLabel">Date format</div>
                        <div className="settingsRowHint">How dates appear throughout the app.</div>
                    </div>
                    <Segmented
                        value={settings.dateFormat}
                        options={[
                            { value: "smart", label: "Smart" },
                            { value: "iso",   label: "ISO" },
                            { value: "us",    label: "US" },
                            { value: "eu",    label: "EU" },
                        ]}
                        onChange={(v) => setOption("dateFormat", v)}
                    />
                </div>
            </div>

            {/* NOTIFICATIONS */}
            <div className="settingsGroup">
                <div className="settingsGroupHeader">
                    <h3 className="settingsGroupTitle">Notifications & feedback</h3>
                </div>
                <div className="settingsRow">
                    <div>
                        <div className="settingsRowLabel">Toast notifications</div>
                        <div className="settingsRowHint">Show feedback after actions like add/delete.</div>
                    </div>
                    <Switch on={settings.notifications} onChange={() => toggle("notifications")} label="Notifications" />
                </div>
                <div className="settingsRow">
                    <div>
                        <div className="settingsRowLabel">Confetti on full completion</div>
                        <div className="settingsRowHint">Celebrate when all tasks are done 🎉</div>
                    </div>
                    <Switch on={settings.confettiOnComplete} onChange={() => toggle("confettiOnComplete")} label="Confetti" />
                </div>
                <div className="settingsRow">
                    <div>
                        <div className="settingsRowLabel">Sound effects</div>
                        <div className="settingsRowHint">Play a subtle chime on task completion.</div>
                    </div>
                    <Switch on={settings.soundEffects} onChange={() => toggle("soundEffects")} label="Sounds" />
                </div>
            </div>

            {/* DATA */}
            <div className="settingsGroup">
                <div className="settingsGroupHeader">
                    <h3 className="settingsGroupTitle">Data</h3>
                </div>
                <div className="settingsRow">
                    <div>
                        <div className="settingsRowLabel">Export tasks</div>
                        <div className="settingsRowHint">
                            Download all your tasks as a JSON file ({tasks?.length || 0} items).
                        </div>
                    </div>
                    <button className="btn" onClick={handleExport}>⬇ Export JSON</button>
                </div>
                <div className="settingsRow">
                    <div>
                        <div className="settingsRowLabel">Import tasks</div>
                        <div className="settingsRowHint">Upload a previously exported file to restore tasks.</div>
                    </div>
                    <>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json,application/json"
                            onChange={handleImport}
                            style={{ display: "none" }}
                        />
                        <button className="btn" onClick={() => fileInputRef.current?.click()}>
                            ⬆ Import JSON
                        </button>
                    </>
                </div>
            </div>

            {/* DANGER ZONE */}
            <div className="settingsGroup dangerZone">
                <div className="settingsGroupHeader">
                    <h3 className="settingsGroupTitle">Danger zone</h3>
                </div>
                <div className="settingsRow">
                    <div>
                        <div className="settingsRowLabel">Reset local preferences</div>
                        <div className="settingsRowHint">Clears settings, theme, and profile customisations. Tasks are safe.</div>
                    </div>
                    <button className="btn btn--danger" onClick={handleResetLocal}>Reset</button>
                </div>
                <div className="settingsRow">
                    <div>
                        <div className="settingsRowLabel">Delete all tasks</div>
                        <div className="settingsRowHint">Permanently remove every task on the server. Cannot be undone.</div>
                    </div>
                    <button className="btn btn--danger" onClick={handleDeleteAllTasks}>Delete all</button>
                </div>
            </div>
        </div>
    );
}
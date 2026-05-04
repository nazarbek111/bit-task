import { useLocalStorage } from '../../hooks/useLocalStorage';

const defaultSettings = {
    notifications: true,
    autoSave: true,
    language: 'en',
};

export default function Settings() {
    const [settings, setSettings] = useLocalStorage('bittask.settings', defaultSettings);

    const handleToggle = (key) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="dashboardSection">
            <h2>Settings</h2>
            <p className="muted" style={{ marginTop: 0 }}>
                Your preferences are saved automatically to local storage.
            </p>
            <div className="settingsList">
                <div className="settingItem">
                    <div className="settingInfo">
                        <h4>Email Notifications</h4>
                        <p>Receive email updates about your tasks</p>
                    </div>
                    <label className="toggle">
                        <input
                            type="checkbox"
                            checked={settings.notifications}
                            onChange={() => handleToggle('notifications')}
                        />
                        <span className="toggleSlider"></span>
                    </label>
                </div>

                <div className="settingItem">
                    <div className="settingInfo">
                        <h4>Auto Save</h4>
                        <p>Settings are automatically saved to local storage</p>
                    </div>
                    <label className="toggle">
                        <input
                            type="checkbox"
                            checked={settings.autoSave}
                            onChange={() => handleToggle('autoSave')}
                        />
                        <span className="toggleSlider"></span>
                    </label>
                </div>

                <div className="settingItem">
                    <div className="settingInfo">
                        <h4>Language</h4>
                        <p>Select your preferred language</p>
                    </div>
                    <select
                        value={settings.language}
                        onChange={(e) =>
                            setSettings((prev) => ({ ...prev, language: e.target.value }))
                        }
                        className="languageSelect"
                    >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
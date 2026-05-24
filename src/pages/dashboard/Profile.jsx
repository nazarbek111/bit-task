import { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useFetch } from "../../hooks/useFetch";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { taskService } from "../../services/taskService";
import { evaluateAchievements } from "../../utils/achievements";
import { calcStreak } from "../../utils/stats";

const AVATAR_COLORS = [
    { id: "purple", value: "linear-gradient(135deg, #6d52e8 0%, #a78bfa 100%)" },
    { id: "blue",   value: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)" },
    { id: "green",  value: "linear-gradient(135deg, #10b981 0%, #34d399 100%)" },
    { id: "orange", value: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)" },
    { id: "pink",   value: "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)" },
    { id: "red",    value: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)" },
    { id: "slate",  value: "linear-gradient(135deg, #475569 0%, #94a3b8 100%)" },
];

const defaultProfile = {
    bio: "",
    avatarColor: "purple",
};

export default function Profile() {
    const { user } = useAuth();
    const [profile, setProfile] = useLocalStorage("bittask.profile", defaultProfile);

    const { data: tasks } = useFetch(
        () => taskService.getByUser(user?.username),
        [user?.username]
    );
    const list = useMemo(() => tasks || [], [tasks]);

    const achievements = useMemo(() => evaluateAchievements(list), [list]);
    const unlocked = achievements.filter((a) => a.unlocked).length;

    const stats = useMemo(() => ({
        tasks: list.length,
        done:  list.filter((t) => t.completed).length,
        streak: calcStreak(list),
        achievements: `${unlocked}/${achievements.length}`,
    }), [list, unlocked, achievements.length]);

    if (!user) return null;

    const initials = user.username.slice(0, 2).toUpperCase();
    const memberSince = new Date(user.loggedInAt).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
    });
    const activeColor = AVATAR_COLORS.find((c) => c.id === profile.avatarColor) || AVATAR_COLORS[0];

    return (
        <div>
            <div style={{ marginBottom: 20 }}>
                <h1 style={{ margin: 0, fontSize: 28 }}>Profile</h1>
                <p className="muted" style={{ margin: "4px 0 0" }}>Make your workspace yours.</p>
            </div>

            {/* Hero card */}
            <div className="profileHero">
                <div className="profileAvatar" style={{ background: activeColor.value }}>
                    {initials}
                </div>
                <div className="profileMeta">
                    <h2 className="profileName">{user.username}</h2>
                    <p className="profileSub">Member since {memberSince}</p>
                    <div className="profileStats">
                        <div className="profileStat">
                            <span className="profileStatNum">{stats.tasks}</span>
                            <span className="profileStatLabel">Total tasks</span>
                        </div>
                        <div className="profileStat">
                            <span className="profileStatNum">{stats.done}</span>
                            <span className="profileStatLabel">Completed</span>
                        </div>
                        <div className="profileStat">
                            <span className="profileStatNum">{stats.streak}🔥</span>
                            <span className="profileStatLabel">Day streak</span>
                        </div>
                        <div className="profileStat">
                            <span className="profileStatNum">{stats.achievements}</span>
                            <span className="profileStatLabel">Achievements</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Avatar customization */}
            <div className="card dashSection">
                <div className="dashSectionHeader">
                    <h2 className="dashSectionTitle">Avatar color</h2>
                    <span className="dashSectionMeta">Saved automatically</span>
                </div>
                <div className="colorPicker">
                    {AVATAR_COLORS.map((c) => (
                        <button
                            key={c.id}
                            type="button"
                            className={"colorSwatch " + (profile.avatarColor === c.id ? "colorSwatch--active" : "")}
                            style={{ background: c.value }}
                            onClick={() => setProfile({ ...profile, avatarColor: c.id })}
                            aria-label={`Select ${c.id}`}
                        />
                    ))}
                </div>
            </div>

            {/* Bio */}
            <div className="card dashSection">
                <div className="dashSectionHeader">
                    <h2 className="dashSectionTitle">About you</h2>
                    <span className="dashSectionMeta">{profile.bio.length}/240</span>
                </div>
                <textarea
                    className="bioTextarea"
                    placeholder="Write a short bio… what are you working on?"
                    value={profile.bio}
                    onChange={(e) => {
                        if (e.target.value.length <= 240) {
                            setProfile({ ...profile, bio: e.target.value });
                        }
                    }}
                />
            </div>

            {/* Achievements */}
            <div className="card dashSection">
                <div className="dashSectionHeader">
                    <h2 className="dashSectionTitle">Achievements</h2>
                    <span className="dashSectionMeta">{unlocked} of {achievements.length} unlocked</span>
                </div>
                <div className="achievementGrid">
                    {achievements.map((a) => (
                        <div
                            key={a.id}
                            className={"achievementCard " + (a.unlocked ? "achievementCard--unlocked" : "achievementCard--locked")}
                            title={a.unlocked ? "Unlocked!" : "Locked"}
                        >
                            <div className="achievementIcon">{a.icon}</div>
                            <div className="achievementTitle">{a.title}</div>
                            <div className="achievementDesc">{a.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

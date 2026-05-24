import { calcStreak } from "./stats";

export const ACHIEVEMENTS = [
    {
        id: "first-task",
        icon: "🌱",
        title: "First Steps",
        desc: "Create your first task",
        check: (tasks) => tasks.length >= 1,
    },
    {
        id: "five-done",
        icon: "✅",
        title: "Getting Things Done",
        desc: "Complete 5 tasks",
        check: (tasks) => tasks.filter((t) => t.completed).length >= 5,
    },
    {
        id: "ten-done",
        icon: "💪",
        title: "Productive",
        desc: "Complete 10 tasks",
        check: (tasks) => tasks.filter((t) => t.completed).length >= 10,
    },
    {
        id: "perfectionist",
        icon: "💎",
        title: "Perfectionist",
        desc: "Complete every task (min. 3)",
        check: (tasks) => tasks.length >= 3 && tasks.every((t) => t.completed),
    },
    {
        id: "tagger",
        icon: "🏷️",
        title: "Organized",
        desc: "Use 5+ different tags",
        check: (tasks) => {
            const all = new Set();
            tasks.forEach((t) => (t.tags || []).forEach((tag) => all.add(tag)));
            return all.size >= 5;
        },
    },
    {
        id: "high-priority",
        icon: "🔥",
        title: "Focused",
        desc: "Complete a High-priority task",
        check: (tasks) => tasks.some((t) => t.completed && t.priority === "High"),
    },
    {
        id: "streak-3",
        icon: "⚡",
        title: "On Fire",
        desc: "Maintain a 3-day streak",
        check: (tasks) => calcStreak(tasks) >= 3,
    },
    {
        id: "veteran",
        icon: "👑",
        title: "Veteran",
        desc: "Create 25+ tasks overall",
        check: (tasks) => tasks.length >= 25,
    },
];

export function evaluateAchievements(tasks) {
    return ACHIEVEMENTS.map((a) => ({ ...a, unlocked: a.check(tasks) }));
}

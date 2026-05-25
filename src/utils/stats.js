const toDate = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
};

const toDayKey = (value) => {
    const date = toDate(value);
    if (!date) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const startOfLocalDay = (value = new Date()) => {
    const date = toDate(value) || new Date();
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export function buildHeatmap(tasks = [], weeks = 12) {
    const today = startOfLocalDay();
    const days = weeks * 7;
    const start = new Date(today);
    start.setDate(today.getDate() - days + 1);

    const counts = new Map();

    tasks.forEach((task) => {
        const key = toDayKey(task.createdAt);
        if (!key) return;
        counts.set(key, (counts.get(key) || 0) + 1);
    });

    const cells = Array.from({ length: days }, (_, index) => {
        const date = new Date(start);
        date.setDate(start.getDate() + index);

        const key = toDayKey(date);

        return {
            date: key,
            count: counts.get(key) || 0,
        };
    });

    return Array.from({ length: weeks }, (_, weekIndex) =>
        cells.slice(weekIndex * 7, weekIndex * 7 + 7)
    );
}

export function calcStreak(tasks = []) {
    if (!tasks.length) return 0;

    const taskDays = new Set(
        tasks
            .map((task) => toDayKey(task.createdAt))
            .filter(Boolean)
    );

    let streak = 0;
    const cursor = startOfLocalDay();

    while (taskDays.has(toDayKey(cursor))) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
}

export function bestWeekday(tasks = []) {
    if (!tasks.length) return null;

    const labels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const counts = new Array(7).fill(0);

    tasks.forEach((task) => {
        const date = toDate(task.createdAt);
        if (!date) return;
        counts[date.getDay()] += 1;
    });

    const bestIndex = counts.indexOf(Math.max(...counts));
    if (counts[bestIndex] === 0) return null;

    return {
        name: labels[bestIndex],
        count: counts[bestIndex],
    };
}

export function productivityScore(tasks = []) {
    if (!tasks.length) return 0;

    const completed = tasks.filter((task) => task.completed).length;
    const completionRate = completed / tasks.length;

    const streakBonus = Math.min(calcStreak(tasks) * 5, 25);
    const volumeBonus = Math.min(tasks.length * 2, 25);

    return Math.min(100, Math.round(completionRate * 50 + streakBonus + volumeBonus));
}

export function topTags(tasks = [], limit = 5) {
    const counts = new Map();

    tasks.forEach((task) => {
        const tags = Array.isArray(task.tags) ? task.tags : [];
        tags.forEach((tag) => {
            counts.set(tag, (counts.get(tag) || 0) + 1);
        });
    });

    return Array.from(counts.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
}
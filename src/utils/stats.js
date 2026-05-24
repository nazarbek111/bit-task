function groupByDay(tasks, dateField = "createdAt") {
    const map = new Map();
    for (const t of tasks) {
        if (!t[dateField]) continue;
        const d = new Date(t[dateField]);
        const key = d.toISOString().slice(0, 10);
        map.set(key, (map.get(key) || 0) + 1);
    }
    return map;
}

export function buildHeatmap(tasks, weeks = 12) {
    const counts = groupByDay(tasks, "createdAt");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Align right edge to the upcoming Sunday so weeks look natural.
    const endOfWeek = new Date(today);
    const daysUntilSun = (7 - today.getDay()) % 7;
    endOfWeek.setDate(today.getDate() + daysUntilSun);

    const totalDays = weeks * 7;
    const startDate = new Date(endOfWeek);
    startDate.setDate(endOfWeek.getDate() - totalDays + 1);

    const cells = [];
    for (let i = 0; i < totalDays; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        const key = d.toISOString().slice(0, 10);
        cells.push({
            date: d,
            key,
            count: counts.get(key) || 0,
            isFuture: d > today,
        });
    }

    // Slice into weeks (columns of 7).
    const grid = [];
    for (let w = 0; w < weeks; w++) {
        grid.push(cells.slice(w * 7, w * 7 + 7));
    }
    return grid;
}

export function calcStreak(tasks) {
    const counts = groupByDay(tasks, "createdAt");
    let streak = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    // Walk backwards until we hit a day with zero activity.
    for (let i = 0; i < 365; i++) {
        const key = cursor.toISOString().slice(0, 10);
        if (counts.get(key)) {
            streak += 1;
        } else if (i > 0) {
            // First day (today) without activity doesn't reset; allows current day to be slow.
            break;
        }
        cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
}

export function bestWeekday(tasks) {
    const buckets = [0, 0, 0, 0, 0, 0, 0];
    for (const t of tasks) {
        if (!t.createdAt) continue;
        buckets[new Date(t.createdAt).getDay()] += 1;
    }
    const max = Math.max(...buckets);
    if (max === 0) return null;
    const idx = buckets.indexOf(max);
    const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return { name: names[idx], count: max };
}

export function productivityScore(tasks) {
    if (tasks.length === 0) return 0;

    const done = tasks.filter((t) => t.completed).length;
    const completion = (done / tasks.length) * 100;

    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recent = tasks.filter((t) => t.createdAt && new Date(t.createdAt).getTime() >= sevenDaysAgo).length;
    const activityBonus = Math.min(recent * 4, 25);

    const streakBonus = Math.min(calcStreak(tasks) * 3, 15);

    return Math.min(100, Math.round(completion * 0.6 + activityBonus + streakBonus));
}

export function recentActivity(tasks, limit = 6) {
    const events = [];
    for (const t of tasks) {
        if (t.createdAt) {
            events.push({ id: `c-${t.id}`, type: "created", at: t.createdAt, task: t });
        }
        if (t.completed && t.completedAt) {
            events.push({ id: `d-${t.id}`, type: "completed", at: t.completedAt, task: t });
        }
    }
    return events
        .sort((a, b) => new Date(b.at) - new Date(a.at))
        .slice(0, limit);
}

export function topTags(tasks, limit = 8) {
    const counts = new Map();
    for (const t of tasks) {
        for (const tag of t.tags || []) {
            counts.set(tag, (counts.get(tag) || 0) + 1);
        }
    }
    return [...counts.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
}

export function dueSoon(tasks) {
    const now = Date.now();
    const weekFromNow = now + 7 * 24 * 60 * 60 * 1000;
    return tasks
        .filter((t) => !t.completed && t.dueDate && new Date(t.dueDate).getTime() <= weekFromNow)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
}
const PRIORITY_MAP = {
    high: "High", h: "High", "!!": "High",
    normal: "Normal", n: "Normal", med: "Normal", "!": "Normal",
    low: "Low", l: "Low",
};

const WEEKDAYS = {
    sunday: 0, sun: 0,
    monday: 1, mon: 1,
    tuesday: 2, tue: 2, tues: 2,
    wednesday: 3, wed: 3,
    thursday: 4, thu: 4, thur: 4,
    friday: 5, fri: 5,
    saturday: 6, sat: 6,
};

function nextWeekday(targetDow) {
    const now = new Date();
    const currentDow = now.getDay();
    let diff = targetDow - currentDow;
    if (diff <= 0) diff += 7;
    const d = new Date(now);
    d.setDate(now.getDate() + diff);
    d.setHours(9, 0, 0, 0);
    return d.toISOString();
}

function parseDateKeyword(token) {
    const t = token.toLowerCase();
    const now = new Date();

    if (t === "today") {
        const d = new Date(now); d.setHours(18, 0, 0, 0);
        return d.toISOString();
    }
    if (t === "tomorrow" || t === "tmr") {
        const d = new Date(now); d.setDate(now.getDate() + 1); d.setHours(9, 0, 0, 0);
        return d.toISOString();
    }
    if (WEEKDAYS[t] !== undefined) {
        return nextWeekday(WEEKDAYS[t]);
    }
    // 12.05 or 12/05 (DD.MM)
    const dm = t.match(/^(\d{1,2})[./](\d{1,2})$/);
    if (dm) {
        const day = parseInt(dm[1], 10);
        const month = parseInt(dm[2], 10) - 1;
        let year = now.getFullYear();
        const candidate = new Date(year, month, day, 9, 0, 0, 0);
        if (candidate < now) candidate.setFullYear(year + 1);
        return candidate.toISOString();
    }
    return null;
}

export function parseSmartInput(raw) {
    if (!raw) return { title: "", priority: "Normal", tags: [], assignee: "", dueDate: null };

    let priority = null;
    let assignee = "";
    const tags = [];
    let dueDate = null;
    const titleParts = [];

    const tokens = raw.split(/\s+/);
    for (const token of tokens) {
        if (!token) continue;

        // !priority
        if (token.startsWith("!")) {
            const key = token.slice(1).toLowerCase();
            if (PRIORITY_MAP[key]) { priority = PRIORITY_MAP[key]; continue; }
        }
        // #tag
        if (token.startsWith("#") && token.length > 1) {
            tags.push(token.slice(1));
            continue;
        }
        // @assignee
        if (token.startsWith("@") && token.length > 1) {
            assignee = token.slice(1);
            continue;
        }
        // date keyword
        const maybeDate = parseDateKeyword(token);
        if (maybeDate) { dueDate = maybeDate; continue; }

        titleParts.push(token);
    }

    return {
        title: titleParts.join(" ").trim(),
        priority: priority || "Normal",
        tags,
        assignee,
        dueDate,
    };
}
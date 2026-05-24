import { buildHeatmap, calcStreak, bestWeekday, productivityScore, topTags } from "./stats";

function makeTask(overrides = {}) {
    return {
        id: Math.random().toString(36),
        title: "test",
        priority: "Normal",
        completed: false,
        tags: [],
        createdAt: new Date().toISOString(),
        ...overrides,
    };
}

describe("buildHeatmap", () => {
    test("returns the requested number of weeks", () => {
        const grid = buildHeatmap([], 12);
        expect(grid).toHaveLength(12);
        grid.forEach((week) => expect(week).toHaveLength(7));
    });

    test("counts a task into the correct day cell", () => {
        const today = new Date().toISOString();
        const grid = buildHeatmap([makeTask({ createdAt: today })], 12);
        const total = grid.flat().reduce((sum, c) => sum + c.count, 0);
        expect(total).toBe(1);
    });
});

describe("calcStreak", () => {
    test("zero for empty", () => {
        expect(calcStreak([])).toBe(0);
    });

    test("at least 1 when there is a task today", () => {
        expect(calcStreak([makeTask({ createdAt: new Date().toISOString() })])).toBeGreaterThanOrEqual(1);
    });
});

describe("bestWeekday", () => {
    test("returns null for empty", () => {
        expect(bestWeekday([])).toBeNull();
    });

    test("identifies the day with most tasks", () => {
        // pick a fixed Monday
        const monday = new Date("2026-05-04T10:00:00Z"); // Mon
        const tasks = [
            makeTask({ createdAt: monday.toISOString() }),
            makeTask({ createdAt: monday.toISOString() }),
            makeTask({ createdAt: new Date("2026-05-06T10:00:00Z").toISOString() }), // Wed
        ];
        const result = bestWeekday(tasks);
        expect(result).not.toBeNull();
        expect(result.count).toBe(2);
    });
});

describe("productivityScore", () => {
    test("zero for empty input", () => {
        expect(productivityScore([])).toBe(0);
    });

    test("higher when more tasks are completed", () => {
        const low = [makeTask(), makeTask(), makeTask()];
        const high = [makeTask({ completed: true }), makeTask({ completed: true }), makeTask({ completed: true })];
        expect(productivityScore(high)).toBeGreaterThan(productivityScore(low));
    });

    test("never exceeds 100", () => {
        const tasks = Array.from({ length: 20 }, () => makeTask({ completed: true }));
        expect(productivityScore(tasks)).toBeLessThanOrEqual(100);
    });
});

describe("topTags", () => {
    test("returns empty list when no tags", () => {
        expect(topTags([makeTask()])).toEqual([]);
    });

    test("sorts by count descending", () => {
        const tasks = [
            makeTask({ tags: ["a", "b"] }),
            makeTask({ tags: ["a"] }),
            makeTask({ tags: ["a", "c"] }),
        ];
        const result = topTags(tasks);
        expect(result[0]).toEqual({ name: "a", count: 3 });
    });
});
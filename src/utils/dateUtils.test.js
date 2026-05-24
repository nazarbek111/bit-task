import { formatDueDate, dueDateStatus } from "./dateUtils";

describe("formatDueDate", () => {
    test("returns null for missing date", () => {
        expect(formatDueDate(null)).toBeNull();
        expect(formatDueDate(undefined)).toBeNull();
    });

    test("returns 'Today' for today", () => {
        const today = new Date().toISOString();
        expect(formatDueDate(today)).toBe("Today");
    });

    test("returns 'Tomorrow' for next day", () => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        expect(formatDueDate(d.toISOString())).toBe("Tomorrow");
    });
});

describe("dueDateStatus", () => {
    test("returns 'none' when no date", () => {
        expect(dueDateStatus(null)).toBe("none");
    });

    test("returns 'today' for today", () => {
        expect(dueDateStatus(new Date().toISOString())).toBe("today");
    });

    test("returns 'overdue' for past dates", () => {
        const past = new Date();
        past.setDate(past.getDate() - 5);
        expect(dueDateStatus(past.toISOString())).toBe("overdue");
    });

    test("returns 'upcoming' for future dates", () => {
        const future = new Date();
        future.setDate(future.getDate() + 5);
        expect(dueDateStatus(future.toISOString())).toBe("upcoming");
    });
});
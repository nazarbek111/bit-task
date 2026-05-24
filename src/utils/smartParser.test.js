import { parseSmartInput } from "./smartParser";

describe("parseSmartInput", () => {
    test("returns defaults for empty input", () => {
        const r = parseSmartInput("");
        expect(r.title).toBe("");
        expect(r.priority).toBe("Normal");
        expect(r.tags).toEqual([]);
        expect(r.assignee).toBe("");
        expect(r.dueDate).toBeNull();
    });

    test("extracts plain title with no shortcuts", () => {
        const r = parseSmartInput("buy milk");
        expect(r.title).toBe("buy milk");
        expect(r.priority).toBe("Normal");
    });

    test("extracts priority", () => {
        const r = parseSmartInput("fix bug !high");
        expect(r.title).toBe("fix bug");
        expect(r.priority).toBe("High");
    });

    test("extracts multiple tags and assignee", () => {
        const r = parseSmartInput("review pr #web #urgent @alice");
        expect(r.title).toBe("review pr");
        expect(r.tags).toEqual(["web", "urgent"]);
        expect(r.assignee).toBe("alice");
    });

    test("extracts tomorrow as a date", () => {
        const r = parseSmartInput("call mom tomorrow");
        expect(r.title).toBe("call mom");
        expect(r.dueDate).not.toBeNull();
        const date = new Date(r.dueDate);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        expect(date.getDate()).toBe(tomorrow.getDate());
    });

    test("combines all shortcuts", () => {
        const r = parseSmartInput("design landing tomorrow !high #web @nazarbek");
        expect(r.title).toBe("design landing");
        expect(r.priority).toBe("High");
        expect(r.tags).toEqual(["web"]);
        expect(r.assignee).toBe("nazarbek");
        expect(r.dueDate).not.toBeNull();
    });
});
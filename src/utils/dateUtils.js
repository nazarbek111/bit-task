/**
 * Small, dependency-free date helpers used across the app.
 */

export function formatDueDate(iso) {
    if (!iso) return null;
    const date = new Date(iso);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays > 1 && diffDays < 7) {
        return date.toLocaleDateString("en-US", { weekday: "long" });
    }
    if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;

    return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

export function dueDateStatus(iso) {
    if (!iso) return "none";
    const date = new Date(iso);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (target < today) return "overdue";
    if (target.getTime() === today.getTime()) return "today";
    return "upcoming";
}

export function relativeTime(iso) {
    if (!iso) return "";
    const diff = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(iso).toLocaleDateString();
}
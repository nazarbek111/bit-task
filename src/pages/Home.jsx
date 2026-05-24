import { useMemo, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import TaskForm from "../components/TaskForm";
import SearchBar from "../components/SearchBar";
import TaskFilters from "../components/TaskFilters";
import TaskStats from "../components/TaskStats";
import TaskList from "../components/TaskList";
import KanbanBoard from "../components/KanbanBoard";
import ViewToggle from "../components/ViewToggle";
import { useFetch } from "../hooks/useFetch";
import { useToast } from "../hooks/useToast";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { taskService } from "../services/taskService";
import { useAuth } from "../context/AuthContext";

function Skeleton() {
    return (
        <div className="skeletonList">
            {[1, 2, 3].map((i) => (
                <div key={i} className="skeletonItem">
                    <div className="skeletonAccent" />
                    <div className="skeletonCheck" />
                    <div className="skeletonBody">
                        <div className="skeletonLine skeletonLine--title" />
                        <div className="skeletonLine skeletonLine--meta" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function Confetti() {
    return (
        <div className="confettiWrap" aria-hidden="true">
            {Array.from({ length: 28 }).map((_, i) => (
                <div
                    key={i}
                    className="confettiPiece"
                    style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 1.2}s`,
                        background: ["#6d52e8", "#3ecf8e", "#f5a623", "#f16060", "#60a5fa", "#a78bfa"][i % 6],
                    }}
                />
            ))}
        </div>
    );
}

/**
 * Landing screen shown to logged-out visitors.
 */
function Landing() {
    const navigate = useNavigate();
    const features = [
        { icon: "🎯", title: "Kanban + List view", desc: "Drag and drop cards between columns, or work in a clean focused list." },
        { icon: "⌘",  title: "Command Palette",   desc: "Press ⌘K to jump anywhere or run any action without touching the mouse." },
        { icon: "✨", title: "Smart input",       desc: "Type \"design ui tomorrow !high #web\" and BitTask understands you." },
        { icon: "🌙", title: "Dark mode",         desc: "Beautiful in both light and dark — your eyes will thank you." },
        { icon: "💾", title: "Persistent",        desc: "Your session and preferences live across refreshes." },
        { icon: "📊", title: "Productivity stats",desc: "Track your weekly progress with built-in charts." },
    ];

    return (
        <main>
            <section className="landingHero">
                <div className="landingBadge">🚀 Built with React 19 & React Router 7</div>
                <h1 className="landingTitle">
                    The task manager <br />
                    <span className="gradient">designed for focus.</span>
                </h1>
                <p className="landingSubtitle">
                    BitTask is a fast, keyboard-driven workspace for daily tasks.
                    Inspired by Linear and Raycast — built for students who ship.
                </p>
                <div className="landingCTA">
                    <button className="btn btn--primary" onClick={() => navigate("/login")}>
                        Get started →
                    </button>
                    <button className="btn" onClick={() => navigate("/about")}>
                        Learn more
                    </button>
                </div>
            </section>

            <section className="featureGrid main">
                {features.map((f) => (
                    <div key={f.title} className="featureCard">
                        <div className="featureIcon">{f.icon}</div>
                        <div className="featureTitle">{f.title}</div>
                        <div className="featureDesc">{f.desc}</div>
                    </div>
                ))}
            </section>

            <Footer />
        </main>
    );
}

/**
 * Authenticated workspace: hero, board controls, list/kanban switcher.
 */
function Workspace() {
    const { user } = useAuth();
    const toast = useToast();
    const userId = user?.username;

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [sortBy, setSortBy] = useState("default");
    const [view, setView] = useLocalStorage("bittask.view", "list");
    const [submitting, setSubmitting] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    const { data: tasks, loading, error, refetch } = useFetch(
        () => taskService.getByUser(userId),
        [userId]
    );

    const safeTasks = useMemo(() => tasks || [], [tasks]);

    const doneCount = useMemo(
        () => safeTasks.reduce((n, t) => (t.completed ? n + 1 : n), 0),
        [safeTasks]
    );
    const progress = useMemo(
        () => (safeTasks.length === 0 ? 0 : Math.round((doneCount / safeTasks.length) * 100)),
        [safeTasks, doneCount]
    );

    // Side effect with cleanup: clear confetti after 3 s so the DOM stays clean.
    useEffect(() => {
        if (safeTasks.length > 0 && doneCount === safeTasks.length) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [doneCount, safeTasks.length]);

    const visibleTasks = useMemo(() => {
        const q = search.trim().toLowerCase();
        const order = { High: 0, Normal: 1, Low: 2 };
        const filtered = safeTasks.filter((t) => {
            const matchQ =
                !q ||
                t.title?.toLowerCase().includes(q) ||
                t.assignee?.toLowerCase().includes(q) ||
                t.priority?.toLowerCase().includes(q) ||
                t.tags?.some((tag) => tag.toLowerCase().includes(q));
            const matchF =
                filter === "all" ||
                (filter === "done" && t.completed) ||
                (filter === "active" && !t.completed);
            return matchQ && matchF;
        });
        if (sortBy === "title")    return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
        if (sortBy === "priority") return [...filtered].sort((a, b) => order[a.priority] - order[b.priority]);
        if (sortBy === "dueDate")  return [...filtered].sort((a, b) => {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
        });
        return filtered;
    }, [safeTasks, search, filter, sortBy]);

    const addTask = useCallback(async (task) => {
        setSubmitting(true);
        try {
            await taskService.create(task, userId);
            await refetch();
            toast("Task added ✨", "success");
        } catch {
            toast("Failed to add task.", "error");
        } finally {
            setSubmitting(false);
        }
    }, [refetch, userId, toast]);

    const toggleTask = useCallback(async (id) => {
        const task = safeTasks.find((t) => t.id === id);
        if (!task) return;
        try {
            const nextCompleted = !task.completed;
            await taskService.update(id, {
                ...task,
                completed: nextCompleted,
                status: nextCompleted ? "done" : "todo",
            });
            await refetch();
            toast(task.completed ? "Marked as active" : "Task completed! ✓",
                task.completed ? "info" : "success");
        } catch {
            toast("Failed to update.", "error");
        }
    }, [safeTasks, refetch, toast]);

    const deleteTask = useCallback(async (id) => {
        try {
            await taskService.remove(id);
            await refetch();
            toast("Task deleted.", "info");
        } catch {
            toast("Failed to delete.", "error");
        }
    }, [refetch, toast]);

    // Drag-and-drop: when card lands on a new column.
    const changeStatus = useCallback(async (id, status) => {
        const task = safeTasks.find((t) => String(t.id) === String(id));
        if (!task) return;
        const nextCompleted = status === "done";
        if (task.status === status) return;
        try {
            await taskService.update(id, { ...task, status, completed: nextCompleted });
            await refetch();
            toast(`Moved to ${status.replace("-", " ")}`, "info");
        } catch {
            toast("Failed to move card.", "error");
        }
    }, [safeTasks, refetch, toast]);

    return (
        <main className="main">
            {showConfetti && <Confetti />}

            <section className="heroBanner">
                <div>
                    <p className="heroKicker">Workspace</p>
                    <h2>Welcome back, {userId} 👋</h2>
                    <p className="muted">
                        {safeTasks.length === 0
                            ? "Add your first task to get started."
                            : progress === 100
                                ? "🎉 All tasks done — take a break!"
                                : `${doneCount} of ${safeTasks.length} tasks completed.`}
                    </p>
                </div>
                <TaskStats total={safeTasks.length} done={doneCount} progress={progress} />
            </section>

            <section className="card boardCard">
                <div className="boardTop">
                    <div>
                        <h3>Your tasks</h3>
                        <p className="muted boardSubtitle">Add, search, filter, and manage your tasks.</p>
                    </div>
                    <ViewToggle value={view} onChange={setView} />
                </div>

                <TaskForm onAddTask={addTask} disabled={submitting} />

                <div className="boardTools">
                    <SearchBar value={search} onChange={setSearch} />
                    <TaskFilters
                        filter={filter} onChange={setFilter}
                        sortBy={sortBy} onSortChange={setSortBy}
                    />
                </div>

                {loading && <Skeleton />}

                {!loading && error && (
                    <div className="errorState">
                        <div className="emptyIcon">⚠️</div>
                        <p>{error}</p>
                        <button className="btn" onClick={refetch}>Try again</button>
                    </div>
                )}

                {!loading && !error && safeTasks.length === 0 && (
                    <div className="emptyState">
                        <div className="emptyIcon">📋</div>
                        <p>No tasks yet.</p>
                        <span>Type something above — try the smart syntax!</span>
                    </div>
                )}

                {!loading && !error && safeTasks.length > 0 && visibleTasks.length === 0 && (
                    <div className="emptyState">
                        <div className="emptyIcon">🔍</div>
                        <p>No tasks match your filters.</p>
                    </div>
                )}

                {!loading && !error && visibleTasks.length > 0 && (
                    view === "list" ? (
                        <TaskList tasks={visibleTasks} onToggle={toggleTask} onDelete={deleteTask} />
                    ) : (
                        <KanbanBoard tasks={visibleTasks} onStatusChange={changeStatus} />
                    )
                )}
            </section>

            <Footer />
        </main>
    );
}

/**
 * Decides which experience to render based on auth state.
 */
export default function Home() {
    const { user } = useAuth();
    return user ? <Workspace /> : <Landing />;
}
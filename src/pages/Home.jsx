import { useMemo, useState, useCallback, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TaskForm from "../components/TaskForm";
import SearchBar from "../components/SearchBar";
import TaskFilters from "../components/TaskFilters";
import TaskStats from "../components/TaskStats";
import TaskList from "../components/TaskList";
import { useFetch } from "../hooks/useFetch";
import { useToast } from "../hooks/useToast";
import { taskService } from "../services/taskService";
import { useAuth } from "../context/AuthContext";

function Skeleton() {
    return (
        <div className="skeletonList">
            {[1,2,3].map((i) => (
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
            {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="confettiPiece" style={{
                    left: (Math.random() * 100) + "%",
                    animationDelay: (Math.random() * 1.2) + "s",
                    background: ["#6d52e8","#3ecf8e","#f5a623","#f16060","#60a5fa","#a78bfa"][i % 6],
                }} />
            ))}
        </div>
    );
}

export default function Home() {
    const { user }  = useAuth();
    const toast     = useToast();
    const userId    = user?.username;

    const [search,     setSearch]     = useState("");
    const [filter,     setFilter]     = useState("all");
    const [sortBy,     setSortBy]     = useState("default");
    const [submitting, setSubmitting] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    const { data: tasks, loading, error, refetch } = useFetch(
        () => taskService.getByUser(userId),
        [userId]
    );

    const safeTask = useMemo(() => tasks || [], [tasks]);

    const doneCount = useMemo(
        () => safeTask.reduce((n, t) => (t.completed ? n + 1 : n), 0),
        [safeTask]
    );

    const progress = useMemo(
        () => safeTask.length === 0 ? 0 : Math.round((doneCount / safeTask.length) * 100),
        [safeTask, doneCount]
    );

    // конфетти когда всё выполнено
    useEffect(() => {
        if (safeTask.length > 0 && doneCount === safeTask.length) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
        }
    }, [doneCount, safeTask.length]);

    const visibleTasks = useMemo(() => {
        const q = search.trim().toLowerCase();
        const order = { High: 0, Normal: 1, Low: 2 };
        const filtered = safeTask.filter((t) => {
            const matchQ = !q || t.title?.toLowerCase().includes(q) || t.assignee?.toLowerCase().includes(q) || t.priority?.toLowerCase().includes(q);
            const matchF = filter === "all" || (filter === "done" && t.completed) || (filter === "active" && !t.completed);
            return matchQ && matchF;
        });
        if (sortBy === "title")    return [...filtered].sort((a,b) => a.title.localeCompare(b.title));
        if (sortBy === "priority") return [...filtered].sort((a,b) => order[a.priority] - order[b.priority]);
        return filtered;
    }, [safeTask, search, filter, sortBy]);

    const addTask = useCallback(async ({ title, priority, assignee }) => {
        setSubmitting(true);
        try {
            await taskService.create({ title, priority, assignee, completed: false }, userId);
            refetch();
            toast("Task added!", "success");
        } catch {
            toast("Failed to add task. Check API.", "error");
        } finally {
            setSubmitting(false);
        }
    }, [refetch, userId, toast]);

    const toggleTask = useCallback(async (id) => {
        const task = safeTask.find((t) => t.id === id);
        if (!task) return;
        try {
            await taskService.update(id, { completed: !task.completed });
            refetch();
            toast(task.completed ? "Marked as active" : "Task completed! ✓", task.completed ? "info" : "success");
        } catch {
            toast("Failed to update.", "error");
        }
    }, [safeTask, refetch, toast]);

    const deleteTask = useCallback(async (id) => {
        try {
            await taskService.remove(id);
            refetch();
            toast("Task deleted.", "info");
        } catch {
            toast("Failed to delete.", "error");
        }
    }, [refetch, toast]);

    return (
        <div id="top" className="app">
            {showConfetti && <Confetti />}
            <Header />
            <main className="main">
                <section className="heroBanner card">
                    <div className="heroBannerLeft">
                        <p className="heroKicker">Dashboard</p>
                        <p className="muted">
                            Welcome back, <strong style={{ color: "var(--text)" }}>{userId}</strong>.
                            {safeTask.length > 0 && progress === 100 && " 🎉 All tasks done!"}
                        </p>
                    </div>
                    <TaskStats total={safeTask.length} done={doneCount} progress={progress} />
                </section>

                <section id="board" className="card boardCard">
                    <div className="boardTop">
                        <div>
                            <h3>Tasks</h3>
                            <p className="muted boardSubtitle">Add, search, filter, and manage your tasks.</p>
                        </div>
                    </div>

                    <TaskForm onAddTask={addTask} disabled={submitting} />

                    <div className="boardTools">
                        <SearchBar value={search} onChange={setSearch} />
                        <TaskFilters filter={filter} onChange={setFilter} sortBy={sortBy} onSortChange={setSortBy} />
                    </div>

                    {loading && <Skeleton />}

                    {!loading && error && (
                        <div className="errorState">
                            <p>⚠️ {error}</p>
                            <button className="btn" onClick={refetch}>Try again</button>
                        </div>
                    )}

                    {!loading && !error && safeTask.length === 0 && (
                        <div className="emptyState">
                            <div className="emptyIcon">📋</div>
                            <p>No tasks yet.</p>
                            <span>Add your first task using the form above.</span>
                        </div>
                    )}

                    {!loading && !error && safeTask.length > 0 && visibleTasks.length === 0 && (
                        <div className="emptyState">
                            <div className="emptyIcon">🔍</div>
                            <p>No tasks match your filters.</p>
                        </div>
                    )}

                    {!loading && !error && visibleTasks.length > 0 && (
                        <TaskList tasks={visibleTasks} onToggle={toggleTask} onDelete={deleteTask} />
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
}
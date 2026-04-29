import { useMemo, useState, useCallback } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TaskForm from "../components/TaskForm";
import SearchBar from "../components/SearchBar";
import TaskFilters from "../components/TaskFilters";
import TaskStats from "../components/TaskStats";
import TaskList from "../components/TaskList";
import { useFetch } from "../hooks/useFetch";
import { taskService } from "../services/taskService";

export default function Home() {

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [sortBy, setSortBy] = useState("default");
    const [submitting, setSubmitting] = useState(false);

    const { data: tasks, loading, error, refetch } = useFetch(
        () => taskService.getAll(),
        []
    );

    const safeTask = useMemo(() => tasks || [], [tasks]);

    const doneCount = useMemo(
        () => safeTask.reduce((count, task) => (task.completed ? count + 1 : count), 0),
        [safeTask]
    );

    const progress = useMemo(() => {
        return safeTask.length === 0 ? 0 : Math.round((doneCount / safeTask.length) * 100);
    }, [safeTask, doneCount]);

    const visibleTasks = useMemo(() => {
        const query = search.trim().toLowerCase();
        const priorityOrder = { High: 0, Normal: 1, Low: 2 };

        const filtered = safeTask.filter((task) => {
            const matchesQuery =
                task.title?.toLowerCase().includes(query) ||
                task.assignee?.toLowerCase().includes(query) ||
                task.priority?.toLowerCase().includes(query);

            const matchesFilter =
                filter === "all" ||
                (filter === "done" && task.completed) ||
                (filter === "active" && !task.completed);

            return matchesQuery && matchesFilter;
        });

        if (sortBy === "title") return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
        if (sortBy === "priority") return [...filtered].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        return filtered;
    }, [safeTask, search, filter, sortBy]);

    const addTask = useCallback(async ({ title, priority, assignee }) => {
        setSubmitting(true);
        try {
            await taskService.create({ title, priority, assignee, completed: false });
            refetch();
        } catch {
            alert("Failed to add task. Check your API connection.");
        } finally {
            setSubmitting(false);
        }
    }, [refetch]);

    const toggleTask = useCallback(async (id) => {
        const task = safeTask.find((t) => t.id === id);
        if (!task) return;
        try {
            await taskService.update(id, { completed: !task.completed });
            refetch();
        } catch {
            alert("Failed to update task.");
        }
    }, [safeTask, refetch]);

    const deleteTask = useCallback(async (id) => {
        try {
            await taskService.remove(id);
            refetch();
        } catch {
            alert("Failed to delete task.");
        }
    }, [refetch]);

    return (
        <div id="top" className="app">
            <Header />
            <main className="main">
                <section className="hero card">
                    <div className="heroContent">
                        <div>
                            <p className="heroKicker">Dashboard</p>
                            <p className="muted heroText">
                                A simple productivity workspace for managing daily tasks, priorities,
                                and progress in one place.
                            </p>
                        </div>
                        <TaskStats total={safeTask.length} done={doneCount} progress={progress} />
                    </div>
                </section>

                <section id="board" className="card boardCard">
                    <div className="boardTop">
                        <div>
                            <h3>Tasks</h3>
                            <p className="muted boardSubtitle">
                                Add, search, filter, and manage your current tasks.
                            </p>
                        </div>
                    </div>

                    <div className="formBlock">
                        <TaskForm onAddTask={addTask} disabled={submitting} />
                    </div>

                    <div className="boardTools">
                        <SearchBar value={search} onChange={setSearch} />
                        <TaskFilters filter={filter} onChange={setFilter} sortBy={sortBy} onSortChange={setSortBy} />
                    </div>

                    {loading && <div className="loadingSpinner">Loading tasks...</div>}

                    {!loading && error && (
                        <div className="errorState">
                            <p>⚠️ {error}</p>
                            <button className="btn" onClick={refetch}>Try again</button>
                        </div>
                    )}

                    {!loading && !error && safeTask.length === 0 && (
                        <div className="emptyState">
                            <p>No tasks yet. Add your first task above!</p>
                        </div>
                    )}

                    {!loading && !error && safeTask.length > 0 && (
                        <TaskList
                            tasks={visibleTasks}
                            onToggle={toggleTask}
                            onDelete={deleteTask}
                        />
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
}
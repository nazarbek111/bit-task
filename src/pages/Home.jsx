import { useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TaskForm from "../components/TaskForm";
import SearchBar from "../components/SearchBar";
import TaskFilters from "../components/TaskFilters";
import TaskStats from "../components/TaskStats";
import TaskList from "../components/TaskList";
import { useLocalStorage } from "../hooks/useLocalStorage";

const initialTasks = [
    {
        id: 1,
        title: "Create React project",
        priority: "High",
        assignee: "Nazarbek",
        completed: true,
    },
    {
        id: 2,
        title: "Split UI into components",
        priority: "High",
        assignee: "Nazarbek",
        completed: true,
    },
    {
        id: 3,
        title: "Add events and state",
        priority: "Normal",
        assignee: "Nazarbek",
        completed: false,
    },
];

export default function Home() {
    // useLocalStorage — custom hook encapsulating persistence logic
    const [tasks, setTasks] = useLocalStorage("bittask.tasks", initialTasks);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [sortBy, setSortBy] = useState("default");


    const doneCount = useMemo(
        () =>
            tasks.reduce((count, task) => {
                return task.completed ? count + 1 : count;
            }, 0),
        [tasks]
    );

    const progress = useMemo(() => {
        return tasks.length === 0 ? 0 : Math.round((doneCount / tasks.length) * 100);
    }, [tasks, doneCount]);

    const visibleTasks = useMemo(() => {
        const query = search.trim().toLowerCase();
        const priorityOrder = {
            High: 0,
            Normal: 1,
            Low: 2,
        };

        const filteredTasks = tasks.filter((task) => {
            const { title, assignee, priority, completed } = task;

            const matchesQuery =
                title.toLowerCase().includes(query) ||
                assignee.toLowerCase().includes(query) ||
                priority.toLowerCase().includes(query);

            const matchesFilter =
                filter === "all" ||
                (filter === "done" && completed) ||
                (filter === "active" && !completed);

            return matchesQuery && matchesFilter;
        });

        if (sortBy === "title") {
            return [...filteredTasks].sort((a, b) => a.title.localeCompare(b.title));
        }

        if (sortBy === "priority") {
            return [...filteredTasks].sort(
                (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
            );
        }

        return filteredTasks;
    }, [tasks, search, filter, sortBy]);

    const addTask = ({ title, priority, assignee }) => {
        const nextTask = {
            id: Date.now(),
            title,
            priority,
            assignee,
            completed: false,
        };

        setTasks((prev) => [nextTask, ...prev]);
    };

    const toggleTask = (id) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const deleteTask = (id) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
    };

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

                        <TaskStats total={tasks.length} done={doneCount} progress={progress} />
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
                        <TaskForm onAddTask={addTask} />
                    </div>

                    <div className="boardTools">
                        <SearchBar value={search} onChange={setSearch} />
                        <TaskFilters
                            filter={filter}
                            onChange={setFilter}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                        />
                    </div>

                    <TaskList
                        tasks={visibleTasks}
                        onToggle={toggleTask}
                        onDelete={deleteTask}
                    />
                </section>
            </main>
            <Footer />
        </div>
    );
}
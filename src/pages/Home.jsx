import { useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TaskForm from "../components/TaskForm";
import SearchBar from "../components/SearchBar";
import TaskFilters from "../components/TaskFilters";
import TaskStats from "../components/TaskStats";
import TaskList from "../components/TaskList";

const initialTasks = [
  { id: 1, title: "Create React project", priority: "High", completed: true },
  { id: 2, title: "Split UI into components", priority: "High", completed: true },
  { id: 3, title: "Add events and state", priority: "Normal", completed: false },
];

export default function Home() {
  const [tasks, setTasks] = useState(initialTasks);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showTip, setShowTip] = useState(false);

  const doneCount = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks]
  );

  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesQuery = task.title.toLowerCase().includes(query);
      const matchesFilter =
        filter === "all" ||
        (filter === "done" && task.completed) ||
        (filter === "active" && !task.completed);

      return matchesQuery && matchesFilter;
    });
  }, [tasks, search, filter]);

  const addTask = (title, priority) => {
    const nextTask = {
      id: Date.now(),
      title,
      priority,
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
    <div className="app">
      <Header />

      <main className="main">
        <section className="hero card">
          <p className="heroKicker">Semester project</p>
          <h2>BitTask Dashboard</h2>
          <p className="muted">
            Component-based task manager with filtering, quick search, and
            interactive state updates.
          </p>

          <div className="row">
            <TaskStats total={tasks.length} done={doneCount} />
            <button
              className="btn"
              type="button"
              onClick={() => setShowTip((prev) => !prev)}
            >
              {showTip ? "Hide tip" : "Show tip"}
            </button>
          </div>

          {showTip && (
            <p className="tipText">
              Keep each task title short and actionable. It makes weekly planning
              faster.
            </p>
          )}
        </section>

        <section id="board" className="card boardCard">
          <div className="boardTop">
            <h3>Tasks Board</h3>
            <span className="pill">Showing: {visibleTasks.length}</span>
          </div>

          <TaskForm onAddTask={addTask} />

          <div className="boardTools">
            <SearchBar value={search} onChange={setSearch} />
            <TaskFilters filter={filter} onChange={setFilter} />
          </div>

          <TaskList tasks={visibleTasks} onToggle={toggleTask} onDelete={deleteTask} />
        </section>
      </main>

      <Footer />
    </div>
  );
}

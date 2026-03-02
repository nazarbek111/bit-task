import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";


/* TASK 5 — Separate Component + Props */
function Greeting({ name }) {
  return <p className="muted">Hello, {name}!</p>;
}

/* TASK 6 — Dynamic Card + Props + Conditional Rendering */
function TaskCard({ title, priority, completed, assignee }) {
  return (
    <div className="taskCard">
      <div className="taskTop">
        <h3 className="taskTitle">{title}</h3>
        <span
          className={"badge " + (completed ? "badge--done" : "badge--progress")}
        >
          {completed ? "Done" : "In Progress"}
        </span>
      </div>

      <p className="muted">
        Assignee: <b>{assignee}</b>
      </p>

      <p className="muted">
        Priority:{" "}
        <span
          className={
            "pill " + (priority === "High" ? "pill--high" : "pill--normal")
          }
        >
          {priority}
        </span>
      </p>
    </div>
  );
}

export default function Home() {
  
/* TASK 3 — Variables (Expressions) */
  const userName = "Nazarbek";
  const year = 2026;

  /* BONUS — useState */
  const [showTip, setShowTip] = useState(false);
  
  /* TASK 4 — Array for List Rendering */
  const tasks = [
    {
      id: 1,
      title: "Create React project (CRA)",
      priority: "High",
      completed: true,
      assignee: "Nazarbek",
    },
    {
      id: 2,
      title: "Build Header/Main/Footer components",
      priority: "High",
      completed: true,
      assignee: "Nazarbek",
    },
    {
      id: 3,
      title: "Implement JSX rules + styling",
      priority: "Normal",
      completed: false,
      assignee: "Nazarbek",
    },
  ];

  const doneCount = tasks.filter((t) => t.completed).length;

  return (
    /* TASK 1 — Basic JSX Rendering (Single root element)*/
    <div className="app">
      <Header />

      <main className="main">
        {/* Project Intro + JSX expressions */}
        <section className="card">
          <h2>BitTask — Task Manager (Bitrix-style)</h2>
          <p className="muted">
            This is the base MVP of my semester project. Next weeks I will add
            create/edit/delete tasks, statuses, filters, and persistence.
          </p>

          <div className="row">
            <span className="pill">Current year: {year}</span>
            <span className="pill">Total tasks: {tasks.length}</span>
            <span className="pill">Done: {doneCount}</span>
            <span className="pill">5 + 5 = {5 + 5}</span>
          </div>

          <Greeting name={userName} />

          {/* onClick bonus */}
          <button
            className="btn"
            onClick={() => setShowTip(!showTip)}
          >
            {showTip ? "Hide tip" : "Show tip"}
          </button>

          {showTip && (
            <p className="muted">
              Tip: Next week I will implement create, edit and delete task functionality.
            </p>
          )}
        </section>

        {/* TASK 1 — Basic JSX Rendering */}
        <section className="card">
          <h3>Tasks</h3>

          <p className="muted">
            Status: {tasks.length >= 3 ? "Active board" : "Small board"}
          </p>

          {tasks.length === 0 && (
            <p className="muted">No tasks yet. Add your first task.</p>
          )}

          <div className="tasksGrid">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                title={task.title}
                priority={task.priority}
                completed={task.completed}
                assignee={task.assignee}
              />
            ))}
          </div>
        </section>

        {/* Profile Card */}
        <section className="card">
          <h3>Profile</h3>
          <div className="profile">
            <img
              className="avatar"
              src="https://placehold.co/120x120/png"
              alt="Nazarbek"
              width="120"
              height="120"
            />
            <div>
              <h4 className="profileName">{userName}</h4>
              <p className="muted">Role: Frontend Developer</p>
              <span className="badge badge--active">Active</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
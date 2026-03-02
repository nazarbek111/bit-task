# BitTask – Task Manager (Bitrix-style)

## Project Description

BitTask is a Task Manager web application inspired by Bitrix24 task workflow. The goal of this project is to help students and junior professionals organize their tasks in a structured and simple interface. The application will gradually evolve throughout the semester by adding task management, status control, filtering, and persistence.

The target audience includes students and individuals who need a lightweight tool for organizing personal or academic tasks. The application solves the problem of scattered task tracking by providing one centralized and clean workspace.

### MVP (Initial Stage)
- Project structure (components/pages/assets)
- 3 functional components (Header, MainContent, Footer)
- Basic SPA layout
- Clean UI styling

---

## SPA Theory Answers

### What is a Single Page Application (SPA)?
A Single Page Application is a web application that loads a single HTML page and dynamically updates content without reloading the entire page. Navigation happens inside the browser using JavaScript. This provides a smoother and faster user experience compared to traditional page reloads.

### How does SPA differ from traditional Multi-Page Applications (MPA)?
In a Multi-Page Application, each navigation request loads a completely new HTML page from the server. In contrast, an SPA loads once and updates only necessary parts of the page dynamically. SPAs rely heavily on client-side rendering and APIs, while MPAs rely more on server-side rendering.

### What is the Virtual DOM?
The Virtual DOM is a lightweight copy of the real DOM stored in memory. When a change occurs, React updates the Virtual DOM first, compares it with the previous version, and then applies only the necessary updates to the real DOM. This improves performance by reducing expensive direct DOM manipulations.

### Why does React use a component-based architecture?
React uses a component-based architecture to divide the user interface into reusable and independent pieces. This makes applications easier to maintain, scale, and test. Components improve code organization and allow developers to build complex UIs by combining smaller parts.







### JSX Lab – Explanation

In my BitTask project, JSX is used to build the interface of the task manager. JSX allows me to write UI structure directly inside JavaScript components. Instead of separating HTML and JS, I combine them in one place using React functional components.

In this project, JSX is used to:
	•	Render task cards
	•	Display dynamic task data
	•	Show conditional statuses (Done / In Progress)
	•	Render lists of tasks using .map()
	•	Handle user interaction with onClick

React converts this JSX into regular JavaScript before rendering it in the browser.
⸻

### Three JSX Rules Used in My Project
1. Single Root Element
Each component in my project returns one root element.
For example, the Home component returns: <div className="app">
All content is wrapped inside this container.

2. All Tags Must Be Closed
Every tag in my project is properly closed: <img src="..." alt="..." /> and <p></p>. React requires strict syntax.

3. className Instead of class
Since class is reserved in JavaScript, I use className: <div className="taskCard">
This is used throughout the project for styling.

⸻

### Embedded Expressions in My Project

JSX allows embedding JavaScript expressions using {}.
In my BitTask project I use expressions to render dynamic data.

Example:
<span className="pill">Total tasks: {tasks.length}</span>
<span className="pill">Done: {doneCount}</span>

Here:
	•	{tasks.length} dynamically shows total number of tasks
	•	{doneCount} counts completed tasks

### Conditional Rendering in My Project
I use a ternary operator to display task status: {completed ? "Done" : "In Progress"}
I also use logical &&: {showTip && <p>Tip: Next week I will implement CRUD operations.</p>}

### List Rendering
Tasks are rendered dynamically using .map(): 
{tasks.map((task) => (
  <TaskCard key={task.id} ... />
))}
The key is required so React can efficiently update the DOM.

### Props Usage
I created reusable components:
	•	Greeting
	•	TaskCard

Example: <Greeting name={userName} />
Props allow passing data between components.


### Bonus: useState and onClick
I implemented state management using useState: const [showTip, setShowTip] = useState(false);
And an event handler: <button onClick={() => setShowTip(!showTip)}>
This allows dynamic UI updates without page reload.

### Conclusion

All JSX lab requirements were directly integrated into the BitTask semester project. Instead of creating a separate demo page, I implemented JSX concepts inside the real task manager structure.

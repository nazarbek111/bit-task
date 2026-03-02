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

What is JSX?

JSX (JavaScript XML) is a syntax extension for JavaScript used in React. It allows developers to write HTML-like code inside JavaScript. JSX makes UI structure more readable and easier to understand. React later transforms JSX into regular JavaScript using Babel. It helps combine UI and logic in one place.

⸻

### Three Rules of JSX
	1.	JSX must return a single root element.
This means all elements must be wrapped inside one parent element, such as a <div> or a React Fragment <> </>.
	2.	All tags must be properly closed.
For example, <img /> must be self-closing, and <p></p> must have both opening and closing tags.
	3.	Use className instead of class.
Since class is a reserved keyword in JavaScript, React uses className for CSS classes.

⸻

### Example of Embedded Expression

JSX allows embedding JavaScript expressions inside curly braces {}.

Example from my project:
<h2>Hello, {name}!</h2>
<p>5 + 5 = {5 + 5}</p>
<p>Status: {age >= 18 ? "Adult" : "Minor"}</p>

Here:
	•	{name} displays a variable
	•	{5 + 5} performs a mathematical operation
	•	{age >= 18 ? "Adult" : "Minor"} uses a conditional expression
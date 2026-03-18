BitTask

Project Overview

BitTask is a React-based task manager made as my semester project for Front-End Development. The idea of the project is to create a simple and useful workspace where a user can add tasks, track progress, filter tasks, search by title, and manage daily work more comfortably.

I decided to continue the same project from previous assignments and improve it step by step instead of creating something new every time. Because of that, BitTask now includes reusable React components, state management, event handling, form validation, dynamic rendering, and local storage support.

⸻

Main Features
	•	Add a new task
	•	Delete a task
	•	Change task status (done / in progress)
	•	Search tasks by title
	•	Filter tasks by status
	•	Sort tasks
	•	Show task statistics
	•	Save tasks in localStorage
	•	Responsive and clean UI

⸻

Technologies Used
	•	React
	•	JavaScript
	•	JSX
	•	CSS
	•	localStorage

⸻

Project Structure

The project is divided into reusable components to keep the code clean and easier to manage.

Main components:
	•	Header
	•	Footer
	•	TaskForm
	•	SearchBar
	•	TaskFilters
	•	TaskStats
	•	TaskList
	•	TaskItem

Main page:
	•	Home.jsx

⸻

JavaScript Concepts Used

This project demonstrates the main JavaScript and React topics covered in class:
	•	variables and data types
	•	arrays and objects
	•	conditional logic
	•	functions and arrow functions
	•	map()
	•	filter()
	•	reduce()
	•	destructuring
	•	spread operator
	•	callbacks
	•	import/export
	•	React state with useState
	•	React optimization with useMemo
	•	side effects with useEffect

⸻

Form Handling

The application contains a working task form with controlled inputs.

Form fields:
	•	task title
	•	priority
	•	assignee

Validation:
	•	empty fields cannot be submitted

⸻

Dynamic Rendering

The task list is rendered dynamically using map().
The app also uses:
	•	filtering by task status
	•	searching by keyword
	•	conditional rendering for empty results
	•	dynamic statistics based on current task data

⸻

State and Events

The app uses React state and event handling to make the interface interactive.

Examples:
	•	onSubmit — adding a new task
	•	onChange — updating search and form values
	•	onClick — toggling task status, deleting tasks, changing filters

⸻

Data Persistence

Tasks are stored in localStorage, so after refreshing the page the saved data is still available.

-----
Why I Made This Project

I chose a task manager because it is practical and easy to expand step by step. It also fits well with React because I can clearly demonstrate components, props, state, events, forms, and dynamic rendering in one project.

⸻

Current Result

At this stage, BitTask is already a working React SPA with task management features and a clear component structure. Compared to the first assignments, the project now has much more logic, interactivity, and better usability.
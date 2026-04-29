// API service layer — all API calls go through here, never directly in components
const BASE_URL = "https://69f1a2b8c1533dbedc9ea975.mockapi.io";

const handleResponse = async (res) => {
    if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
    }
    return res.json();
};

export const taskService = {
    // GET all tasks
    getAll: () =>
        fetch(`${BASE_URL}/tasks`).then(handleResponse),

    // GET one task by id
    getById: (id) =>
        fetch(`${BASE_URL}/tasks/${id}`).then(handleResponse),

    // POST create new task
    create: (task) =>
        fetch(`${BASE_URL}/tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task),
        }).then(handleResponse),

    // PUT update task
    update: (id, data) =>
        fetch(`${BASE_URL}/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then(handleResponse),

    // DELETE task
    remove: (id) =>
        fetch(`${BASE_URL}/tasks/${id}`, {
            method: "DELETE",
        }).then(handleResponse),
};
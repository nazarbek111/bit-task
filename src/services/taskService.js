const BASE_URL = process.env.REACT_APP_API_URL;

async function handleResponse(res) {
    if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
    return res.json();
}

// Backwards compatibility: derive `status` from old `completed` boolean.
export function deriveStatus(task) {
    if (task.status) return task.status;
    return task.completed ? "done" : "todo";
}

function normalize(task) {
    return {
        ...task,
        status: deriveStatus(task),
        tags: task.tags || [],
        completed: task.completed ?? task.status === "done",
    };
}

export const taskService = {
    getAll: () =>
        fetch(`${BASE_URL}/tasks`)
            .then(handleResponse)
            .then((tasks) => tasks.map(normalize)),

    getByUser: (userId) =>
        fetch(`${BASE_URL}/tasks`)
            .then(handleResponse)
            .then((tasks) => tasks.filter((t) => t.userId === userId).map(normalize)),

    getById: (id) =>
        fetch(`${BASE_URL}/tasks/${id}`).then(handleResponse).then(normalize),

    create: (task, userId) =>
        fetch(`${BASE_URL}/tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...task,
                userId,
                createdAt: new Date().toISOString(),
            }),
        }).then(handleResponse).then(normalize),

    update: (id, data) =>
        fetch(`${BASE_URL}/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then(handleResponse).then(normalize),

    remove: (id) =>
        fetch(`${BASE_URL}/tasks/${id}`, { method: "DELETE" }).then(handleResponse),
};

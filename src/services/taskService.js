const BASE_URL = process.env.REACT_APP_API_URL;

const handleResponse = async (res) => {
    if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
    }
    return res.json();
};

export const taskService = {
    getAll: () =>
        fetch(`${BASE_URL}/tasks`).then(handleResponse),

    // Задачи конкретного пользователя — фильтрация на клиенте
    getByUser: (userId) =>
        fetch(`${BASE_URL}/tasks`)
            .then(handleResponse)
            .then((tasks) => tasks.filter((t) => t.userId === userId)),

    getById: (id) =>
        fetch(`${BASE_URL}/tasks/${id}`).then(handleResponse),

    // userId обязателен при создании
    create: (task, userId) =>
        fetch(`${BASE_URL}/tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...task, userId }),
        }).then(handleResponse),

    update: (id, data) =>
        fetch(`${BASE_URL}/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then(handleResponse),

    remove: (id) =>
        fetch(`${BASE_URL}/tasks/${id}`, { method: "DELETE" }).then(handleResponse),
};
const BASE_URL = "https://69f1a2b8c1533dbedc9ea975.mockapi.io";

const handleResponse = async (res) => {
    if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
    }
    return res.json();
};

export const taskService = {
    // Получаем ВСЕ задачи, фильтруем по userId на клиенте
    getAll: () =>
        fetch(`${BASE_URL}/tasks`).then(handleResponse),

    // Получаем задачи конкретного пользователя
    getByUser: (userId) =>
        fetch(`${BASE_URL}/tasks`)
            .then(handleResponse)
            .then((tasks) => tasks.filter((task) => task.userId === userId)),

    getById: (id) =>
        fetch(`${BASE_URL}/tasks/${id}`).then(handleResponse),

    // При создании обязательно передаём userId
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
        fetch(`${BASE_URL}/tasks/${id}`, {
            method: "DELETE",
        }).then(handleResponse),
};
import {AxiosService} from "./base/AxiosService";

export const TodoAxiosService = {
    fetchAll(query = {}) {
        if (query.completed)
            return AxiosService.get('todos/completed');
        else if (query.completed === false)
            return AxiosService.get('todos/pending');
        else
            return AxiosService.get('todos');
    },

    fetchById(id) {
        return AxiosService.get(`/todos/${id}`);
    },
    create(payload) {
        return AxiosService.post('todos', payload);
    },
    update(todo) {
        return AxiosService.put(`todos/${todo.id}`, todo);
    },

    delete(id) {
        return AxiosService.delete(`todos/${id}`);
    },
    deleteAll() {
        return AxiosService.delete(`todos`);
    }
};

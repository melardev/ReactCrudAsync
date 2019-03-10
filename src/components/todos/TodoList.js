import React from "react";

import {NavLink} from "react-router-dom";
import DeleteModal from "./partials/DeleteModal";
import {TodoAxiosService} from "../../services/remote/TodoAxiosService";
import {NotificationService} from "../../services/local/NotificationService";

export default class TodoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: 'Todos',
            todoToDelete: {},
            showDialog: false,
            todos: [],
        };

        this.deleteTodo.bind(this);
    }

    componentDidMount() {
        console.trace('TodoList::componentDidMount');
        this.loadTodos();
    }

    loadTodos(query) {
        TodoAxiosService.fetchAll(query).then(res => {
            if (res.status === 200) {
                NotificationService.showToastSuccess('Todos loaded successfully');
                this.setState({
                    todos: res.data,
                    message: 'loaded successfully'
                });
            } else {
            }
        }).catch(err => {
            NotificationService.showDialogError(err.message);
        });
    }

    deleteTodo() {
        this.setState({showDialog: false});
        TodoAxiosService.delete(this.state.todoToDelete.id).then(res => {
            if (res.status === 204) {
                NotificationService.showToastSuccess('Todo deleted successfully');
                this.setState({todos: this.state.todos.filter(t => t.id !== this.state.todoToDelete.id)});
            } else if (res.status === 404) {
                NotificationService.showDialogError('Todo not found');
            } else {
                if (res.data.full_messages instanceof Array && res.data.full_messages.length > 0)
                    NotificationService.showDialogError(res.data.full_messages[0]);
                else
                    NotificationService.showDialogError('Unknown error');
            }
        }).catch(err => {
            NotificationService.showDialogError('Error:' + err.message);
        });
    }

    requestDelete(todo) {
        this.setState({
            todoToDelete: todo,
            showDialog: true,
        });
    }

    toggleComplete(todo) {
        const todoToUpdate = {...todo};
        todoToUpdate.completed = !todoToUpdate.completed;
        TodoAxiosService.update(todoToUpdate).then(res => {
            const newTodo = res.data;
            this.setState({
                todos: this.state.todos.map(t => t.id === todoToUpdate.id ? newTodo : t)
            });
            NotificationService.showToastSuccess('Updated successfully');
        }).catch(err => {
            NotificationService.showDialogError(err.message);
        });
    }

    render() {
        return (
            <div className="container">
                <DeleteModal todo={this.state.todoToDelete} onDeleteClicked={this.deleteTodo.bind(this)}
                             shouldShow={this.state.showDialog}
                             onCancelClicked={() => {
                                 this.setState({showDialog: false})
                             }}/>
                <NavLink className="btn btn-primary" to="/todos/new">Create</NavLink>
                <table>
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Completed</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.todos.map((todo, index) => {
                        return <tr key={index}>
                            <td>
                                {todo.title}
                            </td>
                            <td>
                                <input type='checkbox' onChange={() => this.toggleComplete.bind(this)(todo)}
                                       checked={todo.completed}/>
                            </td>
                            <td>
                                {todo.created_at}
                            </td>
                            <td>
                                {todo.updated_at}
                            </td>
                            <td>
                                <NavLink to={'/todos/' + todo.id} className='btn btn-info'>Details</NavLink>
                            </td>
                            <td>
                                <NavLink to={`/todos/${todo.id}/edit`} className='btn btn-warning'>Edit</NavLink>
                            </td>
                            <td>
                                <span className='btn btn-danger'
                                      onClick={(evt) => this.requestDelete(todo)}>Delete</span>
                            </td>
                        </tr>;
                    })}
                    </tbody>

                </table>
            </div>
        );
    }
}


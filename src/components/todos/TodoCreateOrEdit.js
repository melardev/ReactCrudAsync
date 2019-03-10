import React from 'react';
import {NavLink, withRouter} from "react-router-dom";
import {TodoAxiosService} from "../../services/remote/TodoAxiosService";
import {NotificationService} from "../../services/local/NotificationService";

class TodoCreateOrEditComponent extends React.Component {
    /*
    static contextTypes = {
        router: React.PropTypes.object
    };
    */
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            title: '',
            description: '',
            completed: false,
            editMode: false,
        };
    }

    componentWillMount() {
        const id = this.props.match.params.id;
        if (id) {
            this.setState({editMode: true});
            TodoAxiosService.fetchById(id).then(res => {
                if (res.status === 200 && res.data.id) {
                    NotificationService.showToastSuccess('Todo Loaded successfully');
                    this.setState({
                        ...res.data,
                    });
                } else {
                    if (res.full_messages instanceof Array && res.full_messages.length > 0)
                        NotificationService.showDialogError(res.full_messages[0]);
                    else
                        NotificationService.showDialogError('Unknown error');
                }
            }).catch(err => {
                console.error(err);
            });
        } else
            this.setState({editMode: false});
    }

    onDeleteClick() {
        this.props.deleteTodo(this.props.params.id)
            .then(() => {
                // Todo: Show something dialog, snack etc
                this.context.router.push('/');
            });
    }

    onInputChange(key, evt) {
        // For <input type="text" we get the target.value, for the type="checkbox" we get the target.checked
        this.setState({
            [key]: key === 'completed' ? evt.target.checked : evt.target.value
        });
    }

    updateTodo() {
        const self = this;
        TodoAxiosService.update(this.state).then((res) => {
            if (res.status === 200) {
                NotificationService.showToastSuccess('Todo updated successfully');
                this.setState({...res});
            } else
                NotificationService.showDialogError('Error updating todo ' +
                res.data.full_messages && res.data.full_messages.length > 0 ?
                    res.data.full_messages[0] : 'Unknown showDialogError');
        }).catch(err => {
            console.error(err);
            NotificationService.showDialogError('Error updating todo ' + err.message);
        });
    }

    createTodo() {
        TodoAxiosService.create(this.state).then(res => {
            if (res.status === 201) {
                NotificationService.showToastSuccess('Todo created successfully');
                this.setState({...res.data, editMode: true});
            }

        }).catch(err => {
            NotificationService.showDialogError(err.message);
        });
    }

    deleteTodo() {
        TodoAxiosService.delete(this.state.id).then(res => {
            if (res.status === 204) {
                this.props.history.push('/');
                NotificationService.showToastSuccess('Todo deleted successfully')
            } else {
                NotificationService.showDialogError('Something went wrong');
            }

        });
    }

    createOrUpdate() {
        if (this.state.editMode)
            this.updateTodo();
        else
            this.createTodo();
    }

    render() {

        if (this.state.id === 0 && this.state.editMode) {
            return <div>Loading...</div>
        }

        return (
            <div className="text-center container">
                <div className="row">
                    <div className="col-lg-8 col-md-10 mx-auto">
                        <div className="form-group">
                            <label htmlFor="title"/>Title:
                            <input type="text" name="title" value={this.state.title} className="form-control"
                                   onChange={(evt) => this.onInputChange('title', evt)}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="description"/>Description:
                            <input type="text" name="description" className="form-control"
                                   value={this.state.description}
                                   onChange={(evt) => this.onInputChange('description', evt)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="completed"/>Completed:
                            <input id="completed" type="checkbox" name="checkbox" checked={this.state.completed}
                                   onChange={(evt) => this.onInputChange('completed', evt)}
                            />
                        </div>
                    </div>
                </div>
                <br/>
                <button className="btn btn-info" onClick={this.createOrUpdate.bind(this)}
                        disabled={this.state.submitting}>
                    {this.state.id !== 0 ? 'Update' : 'Create'}
                </button>
                &nbsp;
                {this.state.editMode && <button className="btn btn-danger" onClick={this.deleteTodo.bind(this)}>Delete
                </button>}
                &nbsp;
                <NavLink className="btn btn-success" to="/">Back to home
                </NavLink>
            </div>
        )
    }
};


export const TodoCreateOrEdit = withRouter(TodoCreateOrEditComponent);

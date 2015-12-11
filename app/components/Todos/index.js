import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as TodosActions from 'actions/todos';
import TodoList from './list';
// import './style.scss';

/**
 * Todos wrapper component
 */

class Todos extends Component {

  componentWillMount() {
    if (!this.props.todos.length) {
      this.props.actions.loadTodos();
    }
  }

  hadleTodoAdd() {
    this.props.actions.addTodo('New todo');
  }

  render () {
    return (
      <div className="Todos">
        <TodoList {...this.props} />
        <button onClick={this.hadleTodoAdd.bind(this)}>Add</button>
      </div>
    );
  }
}

export default connect(
  (state) => ({ todos: state.todos }),
  (dispatch) => ({ actions: bindActionCreators(TodosActions, dispatch) })
)(Todos);

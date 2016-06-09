import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as providers from 'providers';
import TodoList from './list';
// import './style.scss';

/**
 * Todos wrapper component
 */

class Todos extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    let { todos, actions } = this.props;
    if (!todos.length) {
      actions.todo.loadAsync();
    }
  }

  hadleTodoAdd() {
    let { actions } = this.props;
    actions.todo.addAsync('New todo');
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
  (dispatch) => ({
    actions: {
      todo: bindActionCreators(providers.todo.actions, dispatch),
    },
  })
)(Todos);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as providers from '../../providers';
import TodoList from './atoms/list';
// import './style.scss';

import iconAdd from 'assets/icons/add.svg';

/**
 * Todos wrapper component
 */

class Todos extends Component {
  static propTypes = {
    todosFetched: PropTypes.bool.isRequired,
    todos: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
  };

  state = {};

  componentWillMount() {
    // fired on server + client
    let { todosFetched, actions } = this.props;
    if (!todosFetched) {
      actions.todo.loadAsync();
    }
  }

  hadleTodoAdd = () => {
    let { actions } = this.props;
    actions.todo.addAsync('New todo');
  };

  render() {
    let { todos } = this.props;
    return (
      <div className="Todos">
        <TodoList todos={todos} />
        <button onClick={this.hadleTodoAdd}>
          <svg width="24" height="24">
            <use xlinkHref={`#${iconAdd.id}`} />
          </svg>
          Add
        </button>
      </div>
    );
  }
}

export default connect(
  state => ({
    todosFetched: state.entities.todos.fetched,
    todos: providers.todo.selectors.getAll(state),
  }),
  dispatch => ({
    actions: {
      todo: bindActionCreators(providers.todo.actions, dispatch),
    },
  })
)(Todos);

import React, { PropTypes } from 'react';

import TodoItem from './item';

/**
 * TodoList component
 */

const propTypes = {
  todos: PropTypes.array,
};

const TodoList = ({ todos = [] }) => (
  <div className="TodoList">
    <h2>Todo list</h2>
    <ul>
      {todos.map((todo, i) => (
        <TodoItem key={i} {...todo} />
      ))}
    </ul>
  </div>
);

TodoList.propTypes = propTypes;

export default TodoList;

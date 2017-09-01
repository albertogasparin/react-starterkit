import React from 'react';
import _ from 'lodash';

import TodoItem from './item';

/**
 * TodoList component
 */

const TodoList = ({ todos = [] }) => (
  <div className="TodoList">
    <h2>Todo list</h2>
    <ul>{_.map(todos, (todo, i) => <TodoItem key={i} {...todo} />)}</ul>
  </div>
);

export default TodoList;

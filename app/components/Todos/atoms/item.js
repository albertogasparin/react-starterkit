import React from 'react';

/**
 * TodoItem component
 */

const TodoItem = ({ id, text = '', completed = false }) =>
  <div className="TodoItem">
    <h4>{text}</h4>
    id: {id}, completed: {completed ? 'true' : 'false'}
  </div>;

export default TodoItem;

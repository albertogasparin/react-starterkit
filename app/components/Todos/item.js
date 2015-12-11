import React, { PropTypes } from 'react';

/**
 * TodoItem component
 */

const propTypes = {
  id: PropTypes.number,
  text: PropTypes.string,
  completed: PropTypes.bool,
};

const TodoItem = ({ id, text = '', completed = false }) => (
  <div className="TodoItem">
    <h4>{text}</h4>
    id: {id}, completed: {completed ? 'true' : 'false'}
  </div>
);

TodoItem.propTypes = propTypes;

export default TodoItem;

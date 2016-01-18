import _reject from 'lodash/reject';

/**
 * Todos Reducers
 */

const todos = (state = [], action) => {
  switch (action.type) {
    case 'LOAD_TODOS':
      return action.todos;
    case 'ADD_TODO':
      return state.concat(action.todo);
    case 'REMOVE_TODO':
      return _reject(state, { id: action.id });
    default:
      return state;
  }
};


export default todos;

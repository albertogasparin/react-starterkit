import { combineReducers } from 'redux';

/**
 * Export all actions and the combined reducer
 */

import * as todo from 'providers/todo';

export {
  todo,
};

export default combineReducers({
  todos: todo.reducer,
});

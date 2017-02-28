import { combineReducers } from 'redux';

/**
 * Export all actions and the combined reducer
 */

import * as todo from './todo';

export {
  todo,
};

export default combineReducers({
  entities: combineReducers({
    todos: todo.reducer,
  }),
});

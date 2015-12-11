import { combineReducers } from 'redux';
import { routeReducer } from 'redux-simple-router';
import _reject from 'lodash/collection/reject';

/**
 * Redux Reducers
 */

// optionally move each reducer to a separate file
function todos(state = [], action) {
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
}


// Extend reducers with redux-simple-router reducer
// The key will be the final store object namespace
export default combineReducers({
  todos,
  routing: routeReducer,
});

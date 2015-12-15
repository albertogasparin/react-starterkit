import { combineReducers } from 'redux';
import { routeReducer } from 'redux-simple-router';

/**
 * Redux Reducers
 */

import todos from './todos';

// Extend reducers with redux-simple-router reducer
// The key will be the final store object namespace
export default combineReducers({
  todos,
  routing: routeReducer,
});

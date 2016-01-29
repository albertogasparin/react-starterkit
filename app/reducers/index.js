import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';

/**
 * Redux Reducers
 */

import todos from './todos';

// Extend reducers with react-router-redux reducer
// The key will be the final store object namespace
export default combineReducers({
  todos,
  routing: routeReducer,
});

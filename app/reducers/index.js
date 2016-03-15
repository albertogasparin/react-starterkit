import { combineReducers } from 'redux';

/**
 * Redux Reducers
 */

import todos from './todos';

// The key will be the final store object namespace
export default combineReducers({
  todos,
});

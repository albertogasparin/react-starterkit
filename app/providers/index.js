import { combineReducers } from 'redux';

/**
 * createAction helper
 * forked from https://github.com/acdlite/redux-actions/ (until #60 fixed)
 */

export function createAction(type, actionCreator = (a) => (a), metaCreator) {
  return (...args) => {
    const action = {
      type,
      payload: actionCreator(...args),
    };

    if (action.payload instanceof Error) { // Handle FSA errors
      action.error = true;
    }

    if (typeof metaCreator === 'function') {
      action.meta = metaCreator(...args);
    }

    return action;
  };
}

/**
 * Export all actions and the combined reducer
 */

import { actions as TodoActions, reducer as todos } from 'providers/todo';

export {
  TodoActions,
};

export default combineReducers({
  todos,
});

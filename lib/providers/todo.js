/**
 * Server side provider
 */

import co from 'co';
import { types, reducer, actions as _actions } from '../../app/providers/todo';

// method that returns todos from DB
import { TODOS } from '../../api/todos';
const getTodosAsync = (cb) => {
  setTimeout(() => cb(null, TODOS), 200);
};

/**
 * Actions overrides
 */

const actions = {
  // Preserve all actions
  ..._actions,

  // Override async/fetch actions
  loadAsync() {
    return (dispatch, getState) => {
      // Called on server side rendering,
      // using co we return a promise and we can yield
      return co.wrap(function *() {
        let todos = yield getTodosAsync;
        dispatch(actions.load(todos));
      })();
    };
  },

};


// Export same objects as app/providers
export { types, reducer, actions };

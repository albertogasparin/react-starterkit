/**
 * Server side provider
 */

import { types, reducer, actions as _actions } from '../../app/providers/todo';

// method that returns todos from DB
import { TODOS } from '../../api/todos';

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
      // we return a function that will be executed later (yield)
      return (done) => {
        setTimeout(() => {
          dispatch(actions.load(TODOS));
          // once completed, resume the generetor
          done(null);
        });
      };
    };
  },

};


// Export same objects as app/providers
export { types, reducer, actions };

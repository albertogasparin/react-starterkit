/**
 * Server side Redux Actions
 */

import { TODOS } from '../../api/todos';

import Actions from '../../app/actions/todos.js';

// Override async/fetch actions

function loadTodosAsync() {
  return (dispatch, getState) => {
    // Called on server side rendering,
    // we just store the logic into a queue on the store
    // that will be executed later by the koa router yield
    let action = (done) => {

      setTimeout(() => {
        dispatch(Actions.loadTodos(TODOS));
        // once fetched, resume the generetor
        done(null);
      }, 200);

    };

    getState().__queue(action);
  };
}

export default {
  ...Actions,
  loadTodosAsync,
};

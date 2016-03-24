/**
 * Server side Redux Actions
 */

import { TODOS } from '../../api/todos';

import Actions from '../../app/actions/todos.js';

// Override async/fetch actions

function loadTodosAsync() {
  return (dispatch, getState) => {
    // Called on server side rendering,
    // we return a function that will be executed later (yield)
    return (done) => {
      setTimeout(() => {
        dispatch(Actions.loadTodos(TODOS));
        // once completed, resume the generetor
        done(null);
      });
    };
  };
}


const API = {
  ...Actions,
  loadTodosAsync,
};

export default API;

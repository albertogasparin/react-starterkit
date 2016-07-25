/* eslint-disable complexity */
import _ from 'lodash';
import { createAction, handleActions } from 'redux-actions';

/**
 * Action types
 */

const types = {
  LOAD: 'TODO_LOAD',
  ADD: 'TODO_ADD',
  REMOVE: 'TODO_REMOVE',
};

/**
 * Reducer
 */

const defaultState = [];

const reducer = handleActions({

  [types.LOAD](state, { payload }) {
    return payload;
  },

  [types.ADD](state, { payload }) {
    return state.concat(payload);
  },

  [types.REMOVE](state, { payload }) {
    return _.reject(state, { id: payload });
  },

}, defaultState);


/**
 * Actions
 */

const actions = {

  load: createAction(types.LOAD),

  add: createAction(types.ADD),

  remove: createAction(types.REMOVE),

  loadAsync() {
    // redux-thunk magic: it allow actions to return functions
    // w/ dispatch as argument, so we can call it as many times as needed
    return (dispatch) => {
      window.fetch(CONFIG_CLIENT.publicPath + 'api/todos', CONFIG_CLIENT.fetch)
      .then((response) => response.json())
      .then((json) => {
        // add todos fetched from the server
        dispatch(actions.load(json));
      });
    };
  },

  addAsync(text) {
    return (dispatch) => {
      // optimisticly add todo
      let tmpTodo = { id: 0, text: `${text} (Saving...)` };
      dispatch(actions.add(tmpTodo));

      window.fetch('/api/todos', {
        ...CONFIG_CLIENT.fetch,
        method: 'post',
        body: JSON.stringify({ text }),
      })
      .then((response) => response.json())
      .then((json) => {
        // remove optimistic todo and add server saved one
        dispatch(actions.remove(tmpTodo.id));
        dispatch(actions.add(json));
      })
      .catch((err) => {
        actions.remove(tmpTodo.id);
        alert(err.message); // eslint-disable-line no-alert
      });
    };
  },

};

/**
 * Exports
 */

export { types, reducer, actions };

/* eslint-disable complexity */
import _ from 'lodash';
import { createAction, handleActions } from 'redux-actions';
import { normalize, schema } from 'normalizr';
import { createSelector } from 'reselect';

/**
 * Action types
 */

export const types = {
  LOAD: 'TODO_LOAD',
  ADD: 'TODO_ADD',
  REMOVE: 'TODO_REMOVE',
};

/**
 * Normalizr schemas
 */

export const schemas = {
  todo: new schema.Entity('todos'),
};

/**
 * Reducer
 */

const defaultState = {
  byId: {},
  ids: [],
};

export const reducer = handleActions({

  [types.LOAD] (state, { payload }) {
    return {
      byId: payload.entities.todos,
      ids: payload.result,
    };
  },

  [types.ADD] (state, { payload }) {
    return {
      byId: { ...state.byId, ...payload.entities.todos },
      ids: state.ids.concat(payload.result),
    };
  },

  [types.REMOVE] (state, { payload }) {
    return {
      byId: _.pickBy(state.byId, (ent) => ent.id !== payload),
      ids: state.ids.filter((id) => id !== payload),
    };
  },

}, defaultState);

/**
 * Selectors
 */

export const selectors = {
  getAll: createSelector(
    (state) => state.entities.todos,
    (collection) => {
      return collection.ids.map((id) => collection.byId[id]);
    }
  ),
};

/**
 * Actions
 */

export const actions = {

  load: createAction(types.LOAD),

  loadAsync () {
    // redux-thunk magic: it allow actions to return functions
    // w/ dispatch as argument, so we can call it as many times as needed
    return (dispatch, getState, api) => {
      return api.get('/todos')
        .then((data) => {
          // add todos fetched from the server
          data = normalize(data, [schemas.todo]);
          dispatch(actions.load(data));
        });
    };
  },

  add: createAction(types.ADD),

  addAsync (text) {
    return (dispatch, getState, api) => {
      // optimisticly add todo
      let tmpTodo = { id: 0, text: `${text} (Saving...)` };
      dispatch(actions.add(normalize(tmpTodo, schemas.todo)));

      return api.post('/todos', {
        data: { text },
      })
        .then((data) => {
          // remove optimistic todo and add server saved one
          dispatch(actions.remove(tmpTodo.id));
          data = normalize(data, schemas.todo);
          dispatch(actions.add(data));
        })
        .catch((err) => {
          actions.remove(tmpTodo.id);
          alert(err.message); // eslint-disable-line no-alert
        });
    };
  },

  remove: createAction(types.REMOVE),

};

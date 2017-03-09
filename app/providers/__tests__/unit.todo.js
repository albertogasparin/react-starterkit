/* eslint-env jest */

import { types, reducer } from '../todo';

describe('Reducers: todo', () => {

  describe('default', () => {
    it('should return the state', () => {
      let stateBefore;
      let action = { type: 'DUMMY' };
      let stateAfter = { byId: {}, ids: [] };
      expect(reducer(stateBefore, action)).toEqual(stateAfter);
    });
  });


  describe(types.LOAD, () => {

    it('should return a whole new collection', () => {
      let stateBefore = [];
      let action = {
        type: types.LOAD,
        payload: [{ id: 1 }, { id: 2 }],
      };
      let stateAfter = {
        byId: { 1: { id: 1 }, 2: { id: 2 } },
        ids: [1, 2],
      };

      expect(reducer(stateBefore, action)).toEqual(stateAfter);
    });

  });


  describe(types.ADD, () => {

    it('should add a todo into the store', () => {
      let stateBefore = {
        byId: { 1: { id: 1 } },
        ids: [1],
      };
      let action = {
        type: types.ADD,
        payload: { id: 2 },
      };
      let stateAfter = {
        byId: { 1: { id: 1 }, 2: { id: 2 } },
        ids: [1, 2],
      };

      expect(reducer(stateBefore, action)).toEqual(stateAfter);
    });

  });


  describe(types.REMOVE, () => {

    it('should remove the todo from the store', () => {
      let stateBefore = {
        byId: { 1: { id: 1 }, 2: { id: 2 } },
        ids: [1, 2],
      };
      let action = {
        type: types.REMOVE,
        payload: { id: 1 },
      };
      let stateAfter = {
        byId: { 2: { id: 2 } },
        ids: [2],
      };

      expect(reducer(stateBefore, action)).toEqual(stateAfter);
    });

  });

});

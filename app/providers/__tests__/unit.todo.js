/* eslint-env mocha */

import { expect } from 'chai';
import { normalize } from 'normalizr';
import { types, schemas, reducer } from '../todo';

describe('Reducers: todo', () => {

  describe('default', () => {
    it('should return the state', () => {
      let stateBefore;
      let action = { type: 'DUMMY' };
      let stateAfter = { byId: {}, ids: [] };
      expect(reducer(stateBefore, action)).to.deep.equal(stateAfter);
    });
  });


  describe(types.LOAD, () => {

    it('should return a whole new collection', () => {
      let stateBefore = [];
      let action = {
        type: types.LOAD,
        payload: normalize([{ id: 1 }, { id: 2 }], [schemas.todo]),
      };
      let stateAfter = {
        byId: { 1: { id: 1 }, 2: { id: 2 } },
        ids: [1, 2],
      };

      expect(reducer(stateBefore, action)).to.deep.equal(stateAfter);
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
        payload: normalize({ id: 2 }, schemas.todo),
      };
      let stateAfter = {
        byId: { 1: { id: 1 }, 2: { id: 2 } },
        ids: [1, 2],
      };

      expect(reducer(stateBefore, action)).to.deep.equal(stateAfter);
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
        payload: 1,
      };
      let stateAfter = {
        byId: { 2: { id: 2 } },
        ids: [2],
      };

      expect(reducer(stateBefore, action)).to.deep.equal(stateAfter);
    });

  });

});

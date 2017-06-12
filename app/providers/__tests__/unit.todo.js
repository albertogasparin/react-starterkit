/* eslint-env mocha */

import { expect } from 'chai';
import { types, reducer } from '../todo';

describe('Reducers: todo', () => {

  describe('default', () => {
    it('should return the state', () => {
      let stateBefore;
      let action = { type: 'DUMMY' };
      let stateAfter = { byId: {}, ids: [], fetched: false };
      expect(reducer(stateBefore, action)).to.deep.equal(stateAfter);
    });
  });


  describe(types.LOAD, () => {

    it('should return a whole new collection', () => {
      let stateBefore = {
        byId: {},
        ids: [],
        fetched: false,
      };
      let action = {
        type: types.LOAD,
        payload: [{ id: 1 }, { id: 2 }],
      };
      let stateAfter = {
        byId: { 1: { id: 1 }, 2: { id: 2 } },
        ids: [1, 2],
        fetched: true,
      };

      expect(reducer(stateBefore, action)).to.eql(stateAfter);
    });

  });


  describe(types.ADD, () => {

    it('should add a todo into the store', () => {
      let stateBefore = {
        byId: { 1: { id: 1 } },
        ids: [1],
        fetched: true,
      };
      let action = {
        type: types.ADD,
        payload: { id: 2 },
      };
      let stateAfter = {
        byId: { 1: { id: 1 }, 2: { id: 2 } },
        ids: [1, 2],
        fetched: true,
      };

      expect(reducer(stateBefore, action)).to.eql(stateAfter);
    });

  });


  describe(types.REMOVE, () => {

    it('should remove the todo from the store', () => {
      let stateBefore = {
        byId: { 1: { id: 1 }, 2: { id: 2 } },
        ids: [1, 2],
        fetched: true,
      };
      let action = {
        type: types.REMOVE,
        payload: { id: 1 },
      };
      let stateAfter = {
        byId: { 2: { id: 2 } },
        ids: [2],
        fetched: true,
      };

      expect(reducer(stateBefore, action)).to.eql(stateAfter);
    });

  });

});

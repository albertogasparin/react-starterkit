/* eslint-env mocha */

import { expect } from 'chai';

import { types, reducer } from '../todo';

describe('Reducers: todo', () => {

  describe('default', () => {
    it('should return the state', () => {
      let stateBefore;
      let action = { type: 'DUMMY' };
      let stateAfter = [];
      expect(reducer(stateBefore, action)).to.deep.equal(stateAfter);
    });
  });


  describe(types.LOAD, () => {

    it('should return a whole new collection', () => {
      let stateBefore = [];
      let action = {
        type: types.LOAD,
        payload: [{ id: 1 }],
      };
      let stateAfter = [{ id: 1 }];

      expect(reducer(stateBefore, action)).to.deep.equal(stateAfter);
    });

  });


  describe(types.ADD, () => {

    it('should add a todo into the store', () => {
      let stateBefore = [{ id: 1 }];
      let action = {
        type: types.ADD,
        payload: { id: 2 },
      };
      let stateAfter = [{ id: 1 }, { id: 2 }];

      expect(reducer(stateBefore, action)).to.deep.equal(stateAfter);
    });

  });


  describe(types.REMOVE, () => {

    it('should remove the todo from the store', () => {
      let stateBefore = [{ id: 1 }, { id: 2 }];
      let action = {
        type: types.REMOVE,
        payload: 1,
      };
      let stateAfter = [{ id: 2 }];

      expect(reducer(stateBefore, action)).to.deep.equal(stateAfter);
    });

  });

});

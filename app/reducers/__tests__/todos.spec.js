/* eslint-env mocha */

import { expect } from 'chai';
import deepFreeze from 'deep-freeze';

import todos from '../todos';

describe('Reducers: todos', () => {

  describe('default', () => {
    it('should return the state', () => {
      let stateBefore;
      let action = { type: 'DUMMY' };
      let stateAfter = [];
      expect(todos(stateBefore, action)).to.deep.equal(stateAfter);
    });
  });


  describe('LOAD_TODOS', () => {

    it('should return a whole new collection', () => {
      let stateBefore = [];
      let action = {
        type: 'LOAD_TODOS',
        todos: [{ id: 1 }],
      };
      let stateAfter = [{ id: 1 }];

      deepFreeze(stateBefore);
      deepFreeze(action);
      expect(todos(stateBefore, action)).to.deep.equal(stateAfter);
    });

  });


  describe('ADD_TODO', () => {

    it('should add a todo into the store', () => {
      let stateBefore = [{ id: 1 }];
      let action = {
        type: 'ADD_TODO',
        todo: { id: 2 },
      };
      let stateAfter = [{ id: 1 }, { id: 2 }];

      deepFreeze(stateBefore);
      deepFreeze(action);
      expect(todos(stateBefore, action)).to.deep.equal(stateAfter);
    });

  });


  describe('REMOVE_TODO', () => {

    it('should remove the todo from the store', () => {
      let stateBefore = [{ id: 1 }, { id: 2 }];
      let action = {
        type: 'REMOVE_TODO',
        id: 1,
      };
      let stateAfter = [{ id: 2 }];

      deepFreeze(stateBefore);
      deepFreeze(action);
      expect(todos(stateBefore, action)).to.deep.equal(stateAfter);
    });

  });

});

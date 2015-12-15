/* eslint-env mocha *//* eslint-disable no-unused-vars */

import { expect } from 'chai';
import deepFreeze from 'deep-freeze';

import todos from '../todos';

describe('Reducers: todos', () => {

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
});

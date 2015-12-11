/* eslint-env mocha *//* eslint-disable no-unused-vars */

import { expect } from 'chai';
import { spy, stub } from 'sinon';

import routes from '..';

describe('GET /todos', () => {
  let route = routes['GET /todos'];

  it('should return all todos', () => {
    let context = {};
    let generator = route.call(context);
    generator.next();
    expect(context.body).to.have.length.gt(0);
  });

});

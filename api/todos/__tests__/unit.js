/* eslint-env mocha *//* eslint-disable no-unused-vars */

import co from 'co';
import { expect } from 'chai';

import routes from '..';
import db from '../../../lib/db';

describe('GET /todos', () => {
  let route = routes['GET /todos'];

  it('should return all todos', function *() {
    let ctx = { request: {}, response: {} };
    yield route.call(ctx);
    expect(ctx.response.body).to.have.length.gt(0);
  });

});


describe('POST /todos', () => {
  let route = routes['POST /todos'];

  it('should return new todo', function *() {
    let ctx = { request: { body: {} }, response: {} };
    let expected = { id: db.todos.length + 1, text: '', completed: false };
    yield route.call(ctx);
    expect(ctx.response.body).to.deep.equal(expected);
  });

});

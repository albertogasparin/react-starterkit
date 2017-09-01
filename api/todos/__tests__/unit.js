/* eslint-env mocha */ /* eslint-disable no-unused-vars */

import { expect } from 'chai';

import routes from '..';
import db from '../../../lib/db';

describe('GET /todos', () => {
  let route = routes['GET /todos'];

  it('should return all todos', async () => {
    let ctx = { request: {}, response: {} };
    await route(ctx);
    expect(ctx.response.body).to.have.length.gt(0);
  });
});

describe('POST /todos', () => {
  let route = routes['POST /todos'];

  it('should return new todo', async () => {
    let ctx = { request: { body: {} }, response: {} };
    let expected = { id: db.todos.length + 1, text: '', completed: false };
    await route(ctx);
    expect(ctx.response.body).to.deep.equal(expected);
  });
});

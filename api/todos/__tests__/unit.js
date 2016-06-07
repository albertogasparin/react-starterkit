/* eslint-env mocha *//* eslint-disable no-unused-vars */

import co from 'co';
import { expect } from 'chai';

import routes from '..';

describe('GET /todos', () => {
  let route = routes['GET /todos'];

  it('should return all todos', co.wrap(function *() {
    let context = {};
    yield route.call(context);
    expect(context.body).to.have.length.gt(0);
  }));

});


describe('POST /todos', () => {
  let route = routes['POST /todos'];
  const TODOS = require('..').TODOS;

  it('should return new todo', co.wrap(function *() {
    let context = { request: { body: {} } };
    let expected = { id: TODOS.length + 1, text: '', completed: false };
    yield route.call(context);
    expect(context.body).to.deep.equal(expected);
  }));

});


describe('GET /todos/:id', () => {
  let route = routes['GET /todos/:id'];
  const TODOS = require('..').TODOS;

  it('should return a todo', co.wrap(function *() {
    let context = { params: { id: 1 } };
    let expected = TODOS[0];
    yield route.call(context);
    expect(context.body).to.deep.equal(expected);
  }));

});

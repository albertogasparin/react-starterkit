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


describe('POST /todos', () => {
  let route = routes['POST /todos'];
  const TODOS = require('..').TODOS;

  it('should return new todo', () => {
    let context = { request: { body: {} } };
    let generator = route.call(context);
    let expected = { id: TODOS.length + 1, text: '', completed: false };
    generator.next();
    expect(context.body).to.deep.equal(expected);
  });

});


describe('GET /todos/:id', () => {
  let route = routes['GET /todos/:id'];
  const TODOS = require('..').TODOS;

  it('should return a todo', () => {
    let context = { params: { id: 1 } };
    let generator = route.call(context);
    let expected = TODOS[0];
    generator.next();
    expect(context.body).to.deep.equal(expected);
  });

});

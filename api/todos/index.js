/**
 * This file illustrates how you may map
 * single routes using an exported object
 */

import db from '../../lib/db';

function wait (ms) { return (cb) => setTimeout(cb, ms); }

function *all () {
  const { response } = this;
  yield wait(200); // fake delay
  response.body = db.todos;
}

function *create () {
  const { request, response } = this;
  let { text } = request.body;
  let todo = {
    id: db.todos.length + 1,
    text: text || '',
    completed: false,
  };
  db.todos.push(todo);
  yield wait(200); // fake delay
  response.body = todo;
}


const API = {
  'GET /todos': all,
  'POST /todos': create,
};

export default API;

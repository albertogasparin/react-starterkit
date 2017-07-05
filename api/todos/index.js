/**
 * This file illustrates how you may map
 * single routes using an exported object
 */

import db from '../../lib/db';

function wait(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function all({ response }) {
  await wait(200); // fake delay
  response.body = db.todos;
}

async function create({ request, response }) {
  let { text } = request.body;
  let todo = {
    id: db.todos.length + 1,
    text: text || '',
    completed: false,
  };
  db.todos.push(todo);
  await wait(200); // fake delay
  response.body = todo;
}

const API = {
  'GET /todos': all,
  'POST /todos': create,
};

export default API;

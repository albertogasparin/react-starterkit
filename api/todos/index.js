/**
 * This file illustrates how you may map
 * single routes using an exported object
 */

const TODOS = [
  { id: 1, text: 'Write tests', completed: false },
  { id: 2, text: 'Add Redux', completed: true },
];

function *all(next) {
  this.body = TODOS;
}

function *create(next) {
  let todo = {
    id: TODOS.length + 1,
    text: this.request.body.text || '',
    completed: false,
  };
  TODOS.push(todo);
  this.body = todo;
}

function *get(next) {
  let todo = TODOS.find((t) => t.id === Number(this.params.id));
  this.body = todo;
}

export default {
  'GET /todos': all,
  'POST /todos': create,
  'GET /todos/:id': get,
};

export { TODOS as TODOS };

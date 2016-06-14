/**
 * This file illustrates how you may map
 * single routes using an exported object
 */

const TODOS = [
  { id: 1, text: 'Write tests', completed: false },
  { id: 2, text: 'Add Redux', completed: true },
];

function *all() {
  let getTodosAsync = (cb) => {
    setTimeout(() => cb(null, TODOS), 200);
  };
  this.body = yield getTodosAsync;
}

function *create() {
  let { text } = this.request.body;
  let todo = {
    id: TODOS.length + 1,
    text: text || '',
    completed: false,
  };
  TODOS.push(todo);
  this.body = todo;
}

function *find() {
  let todo = TODOS.find((t) => t.id === Number(this.params.id));
  this.body = todo;
}



const API = {
  'GET /todos': all,
  'POST /todos': create,
  'GET /todos/:id': find,
};

export default API;
export { TODOS };

/**
 * Redux Actions
 */

function loadTodos(todos = []) {
  return {
    todos,
    type: 'LOAD_TODOS',
  };
}

function addTodo(todo = {}) {
  return {
    todo,
    type: 'ADD_TODO',
  };
}

function removeTodo(id) {
  return {
    id,
    type: 'REMOVE_TODO',
  };
}

function loadTodosAsync() {
  // redux-thunk magic: it allow actions to return functions
  // w/ dispatch as argument, so we can call it as many times as needed
  return (dispatch) => {
    window.fetch('/api/todos')
    .then((response) => response.json())
    .then((json) => {
      // add todos fetched from the server
      dispatch(loadTodos(json));
    });
  };
}

function addTodoAsync(text) {
  return (dispatch) => {
    // optimisticly add todo
    let tmpTodo = { id: 0, text: `${text} (Saving...)` };
    dispatch(addTodo(tmpTodo));

    window.fetch('/api/todos', {
      method: 'post',
      body: JSON.stringify({ text }),
    })
    .then((response) => response.json())
    .then((json) => {
      // remove optimistic todo and add server saved one
      dispatch(removeTodo(tmpTodo.id));
      dispatch(addTodo(json));
    })
    .catch((err) => {
      removeTodo(tmpTodo.id);
      alert(err.message); // eslint-disable-line
    });
  };
}

const API = {
  loadTodos,
  addTodo,
  removeTodo,
  loadTodosAsync,
  addTodoAsync,
};

export default API;

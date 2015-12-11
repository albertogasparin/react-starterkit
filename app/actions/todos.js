/**
 * Redux Actions
 */

export function loadTodosImmediate(todos = []) {
  return {
    todos,
    type: 'LOAD_TODOS',
  };
}

export function addTodoImmediate(todo = {}) {
  return {
    todo,
    type: 'ADD_TODO',
  };
}

export function removeTodoImmediate(id) {
  return {
    id,
    type: 'REMOVE_TODO',
  };
}

export function loadTodos() {
  // redux-thunk magic: it allow actions to return functions
  // w/ dispatch as argument, so we can call it as many times as needed
  return (dispatch) => {
    fetch('/api/todos')
    .then((response) => response.json())
    .then((json) => {
      // add todos fetched from the server
      dispatch(loadTodosImmediate(json));
    });
  };
}

export function addTodo(text) {
  return (dispatch) => {
    // optimisticly add todo
    let tmpTodo = { id: 0, text: `${text} (Saving...)` };
    dispatch(addTodoImmediate(tmpTodo));

    fetch('/api/todos', {
      method: 'post',
      body: JSON.stringify({ text }),
    })
    .then((response) => response.json())
    .then((json) => {
      // remove optimistic todo and add server saved one
      dispatch(removeTodoImmediate(tmpTodo.id));
      dispatch(addTodoImmediate(json));
    })
    .catch((err) => {
      removeTodoImmediate(tmpTodo.id);
      alert(err.message); // eslint-disable-line
    });
  };
}

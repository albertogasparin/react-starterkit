import React, { PropTypes, Component } from 'react';
import TodoList from './list';
// import './style.scss';

/**
 * Todos wrapper component
 */

class Todos extends Component {


  hadleTodoAdd() {
  }

  render () {
    return (
      <div className="Todos">
        <TodoList {...this.props} />
        <button onClick={this.hadleTodoAdd.bind(this)}>Add</button>
      </div>
    );
  }
}

export default Todos;

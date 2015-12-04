import React, { PropTypes, Component } from 'react';

/**
 * App component
 */

const propTypes = {
  children: PropTypes.object, // nested routes
};

const defaultProps = {};

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  handleAdd() {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return (
      <div className="App">
        <p>{this.state.count}</p>
        <button className="App-btnAdd" onClick={this.handleAdd.bind(this)}>
          Add +1
        </button>

        {this.props.children}
      </div>
    );
  }

}

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default App;

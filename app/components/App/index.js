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
    window.fetch('/api/example/0')
      .then((response) => response.json())
      .then((json) => {
        this.setState({ count: this.state.count + json.id });
      })
      .catch((err) => console.error(err)); // eslint-disable-line no-console
  }

  render() {
    return (
      <div className="App">
        <button className="App-btnAdd" onClick={this.handleAdd.bind(this)}>
          Get something from API
        </button>
        <p>{this.state.count}</p>

        {this.props.children}
      </div>
    );
  }

}

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default App;

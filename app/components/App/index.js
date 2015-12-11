import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import './style.scss';

/**
 * App component
 */

const propTypes = {};

const App = ({ children }) => (
  <div className="App">
    <header>
      <Link to="/todos">Show Todos</Link>
    </header>
    <section>
      {children}
    </section>
  </div>
);

App.propTypes = propTypes;

export default App;

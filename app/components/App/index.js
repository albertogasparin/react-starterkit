import React from 'react';
import { Link } from 'react-router';

import './style.scss';

/**
 * App component
 */

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

export default App;

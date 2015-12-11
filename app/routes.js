import React from 'react';
import { Route } from 'react-router';

import App from './components/App';
import Todos from './components/Todos';

/**
 * Routes for both server and client
 */

export default (
  <Route path="/" component={App}>
    <Route path="todos" component={Todos} />
  </Route>
);


import React from 'react';
import { Router, Route } from 'react-router';

import App from './components/App';

/**
 * Routes for both server and client
 */

export default function(history) {
  return (
    <Router history={history}>
      <Route path="/" component={App}>
      </Route>
    </Router>
  );
}

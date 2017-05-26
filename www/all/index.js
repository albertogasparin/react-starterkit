
import React from 'react';
import ReactDOM from 'react-dom/server';
import co from 'co';
import { match, RouterContext } from 'react-router';
import { Provider } from 'react-redux';

import createMainStore from '../../app/store';
import * as api from './api';

function renderApp (store, props) {
  return ReactDOM.renderToString(
    <Provider store={store}>
      <RouterContext {...props} />
    </Provider>
  );
}

/**
 * Setup React router server side rendering
 */

function *all (next) {
  const routes = require('../../app/routes').default; // enable hot reload server-side
  let location = this.url;
  let redirectLocation, renderProps;

  // Use react-router match() to check if valid route
  try {
    [ redirectLocation, renderProps ] = yield match.bind(this, { routes, location });
  } catch (err) {
    this.throw(500, err.message);
  }

  if (redirectLocation) {
    return this.redirect(redirectLocation.pathname + redirectLocation.search, '/');
  }

  if (!renderProps) {
    return this.throw(404);
  }

  /**
   * If you are NOT intersted in server-side rendering
   * then replace following code with just:
   *
   * this.render(__dirname, 'index', {});
   */

  // Provide a customised thunk middleware
  // that queues async actions to resolve them later
  let asyncActions = [];
  let thunkMiddleware = {
    withExtraArgument (arg) {
      return function thunk ({ dispatch, getState }) {
        return (nxt) => (action) =>
          (typeof action === 'function')
            ? asyncActions[asyncActions.length] = action(dispatch, getState, arg)
            : nxt(action);
      };
    },
  };

  this.render(__dirname, 'index', {
    // Async template data, returns a promise handled by marko
    getRenderedApp: co(function *() {
      let reduxStore = createMainStore({}, api, thunkMiddleware);
      let html = renderApp(reduxStore, renderProps);
      while (asyncActions.length > 0) {
        yield asyncActions.shift();
        html = renderApp(reduxStore, renderProps);
      }
      return { html, state: reduxStore.getState() };
    }).catch((err) => this.app.emit('error', err)),
  });
}


const ROUTES = {
  'GET *': all,
};

export default ROUTES;

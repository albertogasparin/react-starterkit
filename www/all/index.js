
import createError from 'http-errors';
import React from 'react';
import ReactDOM from 'react-dom/server';
import pify from 'pify';
import { match, RouterContext } from 'react-router';
import { Provider } from 'react-redux';
import _ from 'lodash';

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

async function all ({ request, response, redirect, render, app }, next) {
  const routes = require('../../app/routes').default; // enable hot reload server-side
  let redirectLocation, renderProps;

  // Use react-router match() to check if valid route
  try {
    let matchAsync = pify(match, { multiArgs: true });
    [ redirectLocation, renderProps ] = await matchAsync({ routes, location: request.url });
  } catch (err) {
    throw createError(500, err);
  }

  if (redirectLocation) {
    return redirect(redirectLocation.pathname + redirectLocation.search, '/');
  }

  if (!renderProps) {
    throw createError(404);
  }

  /**
   * If you are NOT intersted in server-side rendering
   * then replace following code with just:
   *
   * render(__dirname, 'index', {});
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

  let boundApi = _.mapValues(api, (v) => v.bind({ req: request.req }));

  render(__dirname, 'index', {
    // Async template data, returns a promise handled by marko
    async getRenderedApp () {
      try {
        let reduxStore = createMainStore({}, boundApi, thunkMiddleware);
        let html = renderApp(reduxStore, renderProps);
        while (asyncActions.length > 0) {
          await asyncActions.shift();
          html = renderApp(reduxStore, renderProps);
        }
        return { html, state: reduxStore.getState() };
      } catch (err) {
        app.emit('error', err);
      }
    },
  });
}


const ROUTES = {
  'GET *': all,
};

export default ROUTES;

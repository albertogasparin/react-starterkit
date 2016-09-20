
import React from 'react';
import ReactDOM from 'react-dom/server';
import co from 'co';
import { match, RouterContext } from 'react-router';
import { Provider } from 'react-redux';

import config from '../config';

/**
 * Setup React router routes matching
 * thanks to react-router match
 */
export default function (router) {

  router.get(config.router.react.path, function *(next) {

    if (!config.isomorphic) {
      this.render(config.router.react.template);
      return;
    }

    let routes = require(config.router.react.routes).default;
    let location = this.url;
    let redirectLocation, renderProps;

    // Use react-router match() to check if valid route
    // yield will throw if match() will return an error
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

    // Provide a customised thunk middleware
    // that queues async actions to resolve them later
    let actionsQueue = [];
    function thunkMiddleware({ dispatch, getState }) {
      return (nxt) => (act) =>
        (typeof act === 'function') ? actionsQueue.push(act(dispatch, getState)) : nxt(act);
    }

    // Create Redux store instance
    let createMainStore = require(config.router.react.store).default;
    let reduxStore = createMainStore({}, thunkMiddleware);

    let renderApp = (store, props) => {
      return ReactDOM.renderToString(
        <Provider store={store}>
          <RouterContext {...props} />
        </Provider>
      );
    };

    this.render(config.router.react.template, {
      // Async template data, returns a promise handled by marko
      getRenderedApp: co.wrap(function *() {
        // Render once to collect providers async actions
        // then yield run each action and when done we re-render again
        let html = renderApp(reduxStore, renderProps);
        if (actionsQueue.length) {
          yield actionsQueue;
          html = renderApp(reduxStore, renderProps);
        }
        return { html, state: reduxStore.getState() };
      }),
    });

  });

}

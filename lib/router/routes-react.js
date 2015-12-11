
import React from 'react';
import ReactDOM from 'react-dom/server';
import { match, RoutingContext } from 'react-router';
import { createLocation } from 'history';
import { Provider } from 'react-redux';

import createMainStore from '../../app/store';

/**
 * Setup React router routes matching
 * thanks to react-router match
 */
export default function (app, config, router) {

  router.get('*', function *(next) { // eslint-disable-line complexity

    if (!config.react.isomorphic) {
      this.render('index');
      return;
    }

    let routes = require(config.react.routes).default;
    let location = createLocation(this.url);
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

    // Create Redux store instance
    let reduxStore = createMainStore();
    let renderApp = (store, props) => {
      return ReactDOM.renderToString(
        <Provider store={store}>
          <RoutingContext {...props} />
        </Provider>
      );
    };

    // Without hacking Redux, just add a custom getter to the store
    // so it is not enumerable. store.__queue() => push()
    let actionsQueue = [];
    Object.defineProperty(reduxStore.getState(), '__queue', {
      get() { return actionsQueue.push.bind(actionsQueue); },
    });

    // Render app once to collect server-side dispatchers actions
    let renderedApp = renderApp(reduxStore, renderProps);

    // yield will run each action fn and wait the callback to be called
    // once done, the store will be updated and we re-render the app
    if (actionsQueue.length) {
      for (let action of actionsQueue) {
        yield action;
      }
      renderedApp = renderApp(reduxStore, renderProps);
    }

    this.render('index', { renderedApp, storeState: reduxStore.getState() });

  });

}

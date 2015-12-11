
import React from 'react';
import ReactDOM from 'react-dom/server';
import { match, RoutingContext } from 'react-router';
import { createLocation } from 'history';

// wrap react-router match() to allow yield-ing
let thunkMatch = (what) => {
  return (callback) => match(what, callback);
};

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

    try {
      // use react-router match to check if valid route
      [ redirectLocation, renderProps ] = yield thunkMatch({ routes, location });
    } catch (err) {
      this.throw(500, err.message);
    }

    if (redirectLocation) {
      return this.redirect(redirectLocation.pathname + redirectLocation.search, '/');
    }

    if (!renderProps) {
      return this.throw(404);
    }

    let renderedApp = ReactDOM.renderToString(<RoutingContext {...renderProps} />);

    this.render('index', { renderedApp });

  });

}

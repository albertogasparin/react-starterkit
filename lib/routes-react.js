
import React from 'react';
import ReactDOM from 'react-dom/server';
import { match, RoutingContext } from 'react-router';
import { createLocation } from 'history';
import createRoutes from '../app/routes';

/**
 * Setup React router routes matching
 * thanks to react-router match
 */
export default function (app, config, router) {

  router.get('*', function *(next) {
    let routes = createRoutes();
    let location = createLocation(this.url);

    yield (() => {
      // use react-router match to check if valid route
      match({ routes, location }, (err, redirectLocation, renderProps) => {
        if (redirectLocation) {
          return this.redirect(redirectLocation.pathname + redirectLocation.search, '/');
        }

        if (err) {
          return this.throw(500, err.message);
        }

        if (!renderProps) {
          return this.throw(404);
        }

        let renderedApp = ReactDOM.renderToString(<RoutingContext {...renderProps} />);
        this.render('index', { renderedApp });
      });
    });

  });

}

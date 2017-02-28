
import path from 'path';
import koaRouter from 'koa-router';
import _ from 'lodash';
import marko from 'marko';

import config from '../lib/config';
import errorHandler from './errors';

// import and combine all routes
import allRoutes from './all';

export const routes = {
  ...allRoutes,
};

export const router = koaRouter({
  prefix: '/',
});

export default function setup (app) {
  // add global error handling
  errorHandler(app);

  const $global = {
    ENV: config.env,
    CONFIG_CLIENT: config.client,
  };

  // Enhance context with .render() template method
  app.use(function *(next) {
    function getTpl (p, n) {
      return marko.load(path.join(p, 'templates', n + '.marko'), { writeToDisk: false });
    }

    Object.assign(this, {
      render (routePath, tplName, locals = {}) {
        this.type = 'text/html';
        this.body = getTpl(routePath, tplName).stream({ $global, ...locals });
      },
      renderSync (routePath, tplName, locals = {}) {
        this.type = 'text/html';
        this.body = getTpl(routePath, tplName).renderToString({ $global, ...locals });
      },
    });
    yield next;
  });

  // add all routes to router
  _.forEach(routes, (fn, key) => {
    let [ method, routePath ] = key.split(' '); // eg: GET /foo/:id
    router[method.toLowerCase()](routePath, fn);
  });

  // attach router middleware
  app.use(router.routes());
}

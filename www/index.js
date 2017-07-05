import koaRouter from 'koa-router';
import _ from 'lodash';
import 'marko/node-require'; // enhance require to handle `.marko` files

import config from '../lib/config';
import errorHandler from './errors';

// import and combine all routes
import allRoutes from './all';

export const routes = {
  ...allRoutes,
};

export const router = new koaRouter({
  prefix: '/',
});

export default function setup(app) {
  // add global error handling
  errorHandler(app);

  const $global = {
    ENV: config.env,
    CONFIG_CLIENT: config.client,
  };

  // Enhance context with .render() template method
  app.use(async (ctx, next) => {
    Object.assign(ctx, {
      render(compiledTpl, locals = {}) {
        ctx.response.type = 'text/html';
        ctx.response.body = compiledTpl.stream({ $global, ...locals });
      },
      renderSync(compiledTpl, locals = {}) {
        ctx.response.type = 'text/html';
        ctx.response.body = compiledTpl.renderToString({ $global, ...locals });
      },
    });
    await next();
  });

  // add all routes to router
  _.forEach(routes, (fn, key) => {
    let [method, routePath] = key.split(' '); // eg: GET /foo/:id
    router[method.toLowerCase()](routePath, fn);
  });

  // attach router middleware
  app.use(router.routes());
}

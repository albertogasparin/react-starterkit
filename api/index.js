
import koaRouter from 'koa-router';
import _ from 'lodash';

// import and combine all routes
import todosRoutes from './todos';

export const routes = {
  ...todosRoutes,
};


export const router = new koaRouter({
  prefix: '/api',
});


export default function setup (app) {

  router.use(async (ctx, next) => {
    ctx.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    await next();
  });

  // add all routes to router
  _.forEach(routes, (fn, key) => {
    let [ method, routePath ] = key.split(' '); // eg: GET /foo/:id
    router[method.toLowerCase()](routePath, fn);
  });

  // attach router middleware
  app.use(router.routes());
  app.use(router.allowedMethods());
}

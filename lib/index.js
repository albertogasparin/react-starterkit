/**
 * Dependencies
 */
import Koa from 'koa';

import config from './config';
import koaSetup from './koa';
import koaRouterSetup from './router';

/**
 * Server
 */
const app = new Koa();

/* istanbul ignore next */
if (config.env === 'development') {
  // setup webpack middlewares (enables webpack server + hot reload)
  require('./webpack-server').default(app);
}

// setup app middlewares
// like static serving, error handling, templates engine
koaSetup(app);

// setup router
// with routes matching for /api and react router
koaRouterSetup(app);

export default app;

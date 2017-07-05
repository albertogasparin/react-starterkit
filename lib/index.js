/**
 * Dependencies
 */
import Koa from 'koa';
// import mongoose from 'mongoose';

import config from './config';
import './react-compat';
import koaSetup from './koa';
import koaRouterSetup from './router';

/**
 * Connect to database
 */
// mongoose.connect(config.mongo.url);
// mongoose.connection.on('error', function(err) {
//   console.log(err);
// });

/**
 * Server
 */
const app = new Koa();

// setup webpack middlewares
// enables webpack serving + React hot reload
/* istanbul ignore next */
if (config.env === 'development') {
  let webpackSetup = require('./webpack').default;
  webpackSetup(app);
}

// setup app middlewares
// like static serving, error handling, templates engine
koaSetup(app);

// setup router
// with routes matching for /api and react router
koaRouterSetup(app);

export default app;

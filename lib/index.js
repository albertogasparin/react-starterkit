/**
 * Dependencies
 */
import koa from 'koa';
// import mongoose from 'mongoose';

import config from './config';
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
const app = koa();

// setup webpack middlewares
// enables webpack serving + React hot reload
if (config.env !== 'production') {
  let webpackSetup = require('./webpack').default;
  webpackSetup(app);
}

// setup app middlewares
// like static serving, error handling, templates engine
koaSetup(app);

// enhance require
// to be better compatible w/ React - Webpack env
if (config.isomorphic) {
  require('./react-compat');
}

// setup router
// with routes matching for /api and react router
koaRouterSetup(app);


/**
 * Start the app
 */
app.listen(config.port);
console.log(`# Server [${config.env}] started on http://${config.host}:${config.port}/`); // eslint-disable-line

export default app;

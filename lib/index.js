/**
 * Dependencies
 */
import koa from 'koa';
import koaRouter from 'koa-router';
// import mongoose from 'mongoose';

/**
 * App config
 */
import config from './config';
import koaSetup from './koa';
import routesApi from './routes-api';
import routesReact from './routes-react';

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

/**
 * Router
 */
const router = koaRouter();

// setup app middlewares
// like static serving, error handling, templates engine
koaSetup(app, config);

// setup api routes matching
// with automatic loading of ./api/foo/index.js export
routesApi(app, config, router);

// setup react routes matching
// wildcard with 404/redirect support
routesReact(app, config, router);

// attach router middleware
app.use(router.routes());

/**
 * Start the app
 */
app.listen(config.port);
console.log(`# Node server [${config.env}] listening on port ${config.port}`); // eslint-disable-line

export default app;

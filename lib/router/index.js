
import koaRouter from 'koa-router';

import routesApi from './routes-api';
import routesReact from './routes-react';


const router = koaRouter();

export default function(app, config) {

  // setup api routes matching
  // with automatic loading of ./api/foo/index.js export
  routesApi(app, config, router);

  // setup react routes matching
  // wildcard with 404/redirect support
  routesReact(app, config, router);

  // attach router middleware
  app.use(router.routes());

}

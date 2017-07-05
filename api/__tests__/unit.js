/* eslint-env mocha */ /* eslint-disable max-nested-callbacks */

// import { expect } from 'chai';
import td from 'testdouble';

import Koa from 'koa';
import routesApi, { router, routes } from '..';

describe('routesApi()', () => {
  let app = new Koa();
  let routesMw = (ctx, next) => routes;

  beforeEach(() => {
    td.replace(app, 'use');
    td.replace(router, 'get');
    td.replace(router, 'post');
    td.replace(router, 'put');
    td.replace(router, 'delete');
    td.replace(router, 'routes', () => routesMw);
    routesApi(app);
  });

  it('should set routes on router', () => {
    td.verify(router.get(td.matchers.isA(String), td.matchers.isA(Function)));
    td.verify(router.post(td.matchers.isA(String), td.matchers.isA(Function)));
  });

  it('should add routes to app', () => {
    td.verify(app.use(routesMw));
  });
});

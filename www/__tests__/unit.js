/* eslint-env mocha *//* eslint-disable max-nested-callbacks */

import { expect } from 'chai';
import td from 'testdouble';

import stream from 'stream';
import co from 'co';
import koa from 'koa';
import routesWww, { router, routes } from '..';

describe('routesWww()', () => {
  let app = koa(), ctx;

  beforeEach(() => {
    ctx = { status: 404, response: {}, ...td.object(['throw']) };
    td.replace(app, 'use');
    td.replace(router, 'get');
    td.replace(router, 'routes', () => routes);
    td.when(app.use(td.matchers.isA(Function)))
      .thenDo(co.wrap(function *(fn) { yield fn.bind(ctx, function *() {}); }));
    routesWww(app);
  });

  it('should add routes to app', () => {
    td.verify(app.use(routes));
  });

  it('should set routes on router', () => {
    td.verify(router.get(td.matchers.isA(String), td.matchers.isA(Function)));
  });

  describe('ctx.render()', () => {
    it('should render template to body as a stream', () => {
      ctx.render(__dirname + '/../errors', 'error');
      expect(ctx.body).to.be.instanceof(stream.Readable);
    });
  });

  describe('ctx.renderSync()', () => {
    it('should render template to body as a string', () => {
      ctx.renderSync(__dirname + '/../errors', 'error');
      expect(ctx.body).to.be.a('string');
    });
  });

});

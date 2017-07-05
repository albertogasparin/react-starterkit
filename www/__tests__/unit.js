/* eslint-env mocha */ /* eslint-disable max-nested-callbacks */

// import { expect } from 'chai';
import td from 'testdouble';

import Koa from 'koa';
import routesWww, { router, routes } from '..';

describe('routesWww()', () => {
  let app = new Koa(),
    ctx;

  beforeEach(() => {
    ctx = { status: 404, response: {}, ...td.object(['throw']) };
    td.replace(app, 'use');
    td.replace(router, 'get');
    td.replace(router, 'routes', () => routes);
    td
      .when(app.use(td.matchers.isA(Function)))
      .thenDo(async fn => await fn(ctx, async () => {}));
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
      let tpl = td.object(['stream']);
      ctx.render(tpl, { status: 1 });
      td.verify(tpl.stream(td.matchers.isA(Object)));
    });
  });

  describe('ctx.renderSync()', () => {
    it('should render template to body as a string', () => {
      let tpl = td.object(['renderToString']);
      ctx.renderSync(tpl, { status: 1 });
      td.verify(tpl.renderToString(td.matchers.isA(Object)));
    });
  });
});

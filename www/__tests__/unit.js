/* eslint-env jest *//* eslint-disable max-nested-callbacks */

import stream from 'stream';
import co from 'co';
import koa from 'koa';
import routesWww, { router } from '..';

describe('routesWww()', () => {
  let app = koa(), ctx;

  beforeEach(() => {
    ctx = { status: 404, response: {}, throw: jest.fn() };
    jest.spyOn(app, 'use').mockImplementation(co.wrap(function *(fn) {
      yield fn.bind(ctx, function *() {});
    }));
    jest.spyOn(router, 'get');
    routesWww(app);
  });

  it('should add routes to app', () => {
    expect(app.use).toHaveBeenCalled();
  });

  it('should set routes on router', () => {
    expect(router.get).toHaveBeenCalledWith(
      expect.any(String), expect.any(Function)
    );
  });

  describe('ctx.render()', () => {
    it('should render template to body as a stream', () => {
      ctx.render(__dirname + '/../errors', 'error');
      expect(ctx.body).toBeInstanceOf(stream.Readable);
    });
  });

  describe('ctx.renderSync()', () => {
    it('should render template to body as a string', () => {
      ctx.renderSync(__dirname + '/../errors', 'error');
      expect(ctx.body).toContain('html');
    });
  });

});

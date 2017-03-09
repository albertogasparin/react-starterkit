/* eslint-env jest *//* eslint-disable max-nested-callbacks */

import koa from 'koa';
import routesApi, { router } from '..';

describe('routesApi()', () => {
  let app = koa();

  beforeEach(() => {
    jest.spyOn(app, 'use');
    jest.spyOn(router, 'get');
    routesApi(app);
  });

  it('should set routes on router', () => {
    expect(router.get).toHaveBeenCalledWith(
      expect.any(String), expect.any(Function)
    );
  });

  it('should add routes to app', () => {
    expect(app.use).toHaveBeenCalled();
  });

});

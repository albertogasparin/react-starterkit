/* eslint-env jest *//* eslint-disable max-nested-callbacks */

import routes from '..';

describe('GET *', () => {
  let route = routes['GET *'];
  let ctx;

  describe('if existing path', () => {
    it('should call render', function *() {
      ctx = { url: '/', render: jest.fn() };
      yield route.call(ctx, null);
      expect(ctx.render).toHaveBeenCalledWith(
        expect.any(String), 'index', expect.any(Object)
      );
    });
  });

  describe('if not found path', () => {
    it('should return 404', function *() {
      ctx = { url: '/asd', throw: jest.fn() };
      yield route.call(ctx, null);
      expect(ctx.throw).toHaveBeenCalledWith(404);
    });
  });

});

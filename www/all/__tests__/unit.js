/* eslint-env mocha *//* eslint-disable max-nested-callbacks */

// import { expect } from 'chai';
import td from 'testdouble';

import routes from '..';

describe('GET *', () => {
  let route = routes['GET *'];
  let ctx;

  describe('if existing path', () => {
    it('should call render', function *() {
      ctx = { url: '/', ...td.object(['render']) };
      yield route.call(ctx, null);
      td.verify(ctx.render(td.matchers.isA(String), 'index', td.matchers.isA(Object)));
    });
  });

  describe('if not found path', () => {
    it('should return 404', function *() {
      ctx = { url: '/asd', ...td.object(['throw']) };
      yield route.call(ctx, null);
      td.verify(ctx.throw(404));
    });
  });

});

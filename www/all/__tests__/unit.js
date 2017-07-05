/* eslint-env mocha */

import { expect } from 'chai';
import td from 'testdouble';

import routes from '..';

describe('GET *', () => {
  let route = routes['GET *'];
  let ctx;

  describe('if existing path', () => {
    it('should call render', async () => {
      ctx = {
        request: { url: '/' },
        render: td.function(),
        redirect: td.function(),
        app: {},
      };
      await route(ctx);
      td.verify(
        ctx.render(td.matchers.isA(Object), {
          getRenderedApp: td.matchers.isA(Function),
        })
      );
    });
  });

  describe('if not found path', () => {
    it('should return 404', async () => {
      ctx = {
        request: { url: '/asd' },
        render: td.function(),
        redirect: td.function(),
        app: {},
      };
      try {
        await route(ctx);
      } catch (err) {
        expect(err.status).to.eql(404);
      }
    });
  });
});

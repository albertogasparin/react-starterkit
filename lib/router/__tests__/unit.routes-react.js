/* eslint-env mocha *//* eslint-disable max-nested-callbacks */

import { expect } from 'chai';
import td from 'testdouble';

import config from '../../config';
import routesReact from '../routes-react';

const matchAny = td.matchers.anything;

describe('routesReact()', () => {
  let routeFn, ctx, _isomorphic = config.isomorphic;

  beforeEach(() => {
    let router = { get(path, fn) { return routeFn = fn; } };
    routesReact(router);
  });

  describe('if not isomorphic', () => {
    beforeEach(function *() {
      config.isomorphic = false;
      ctx = td.object(['render']);
      yield routeFn.call(ctx, null);
    });

    afterEach(() => {
      config.isomorphic = _isomorphic;
    });

    it('should call render immediately', () => {
      expect(ctx.render).to.have.been.calledWith(config.router.react.template);
    });

  });


  describe('if isomorphic and existing path', () => {
    let getRenderedApp;

    beforeEach(function *() {
      config.isomorphic = true;
      ctx = { url: '/', ...td.object(['render']) };
      td.when(ctx.render(matchAny(), matchAny()))
        .thenDo((tpl, o) => getRenderedApp = o.getRenderedApp);
      yield routeFn.call(ctx, null);
    });

    afterEach(() => {
      config.isomorphic = _isomorphic;
    });

    it('should call render', () => {
      expect(ctx.render).to.have.been.called;
    });

    it('should set getRenderedApp that render the React app', function *() {
      let result = yield getRenderedApp();
      expect(result).to.have.all.keys(['html', 'state']);
    });

  });


  describe('if isomorphic and not found path', () => {

    beforeEach(function *() {
      config.isomorphic = true;
      ctx = { url: '/asd', ...td.object(['throw']) };
      yield routeFn.call(ctx, null);
    });

    afterEach(() => {
      config.isomorphic = _isomorphic;
    });

    it('should return 404', () => {
      expect(ctx.throw).to.have.been.calledWith(404);
    });

  });



});

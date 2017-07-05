/* eslint-env mocha */ /* eslint-disable no-unused-vars */

import { expect } from 'chai';
import td from 'testdouble';

import app from '../index';

describe('Server', () => {
  it('should be an Application', () => {
    expect(app.constructor.name).to.equal('Application');
  });

  describe('onerror()', () => {
    it('should print if unexpected error', () => {
      td.replace(console, 'error');
      app.onerror(new Error('err'));
      td.verify(console.error(td.matchers.isA(String))); // eslint-disable-line no-console
    });

    it('should do nothing if is 404', () => {
      let err = new Error('err');
      err.status = 404;
      app.onerror(err);
    });
  });
});

/* eslint-env jest *//* eslint-disable no-unused-vars */

import app from '../index';

describe('Server', () => {

  it('should be an Application', () => {
    expect(app.constructor.name).toEqual('Application');
  });

  describe('onerror()', () => {

    it('should print if unexpected error', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      app.onerror(new Error('err'));
      expect(console.error).toHaveBeenCalledWith(expect.any(String)); // eslint-disable-line no-console
    });

    it('should do nothing if is 404', () => {
      let err = new Error('err');
      err.status = 404;
      app.onerror(err);
    });

  });

});

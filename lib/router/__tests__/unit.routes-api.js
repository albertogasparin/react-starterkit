/* eslint-env mocha *//* eslint-disable max-nested-callbacks */

// import { expect } from 'chai';
import td from 'testdouble';

import routesApi from '../routes-api';

describe('routesApi()', () => {
  let router = td.object(['get', 'post', 'put', 'delete']);

  beforeEach(() => {
    routesApi(router);
  });

  it('should set routes on router', () => {
    td.verify(router.post(td.matchers.isA(String), td.matchers.anything()));
  });

});

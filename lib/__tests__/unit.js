/* eslint-env mocha *//* eslint-disable no-unused-vars */

import { expect } from 'chai';

import app from '../index';

describe('Server', () => {

  it('should be an Application', () => {
    expect(app.constructor.name).to.equal('Application');
  });

});

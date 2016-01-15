/* eslint-env mocha *//* eslint-disable no-unused-vars */

import { expect } from 'chai';
import { spy, stub } from 'sinon';

import app from '../index';

describe('Server', () => {

  it('should be an Application', () => {
    expect(app.constructor.name).to.equal('Application');
  });

});

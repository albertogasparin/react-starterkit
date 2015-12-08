/* eslint-env mocha *//* eslint-disable no-unused-vars */

import { expect } from 'chai';
import { spy, stub } from 'sinon';

import routes from '..';

describe('GET /example', () => {
  let route = routes['GET /example'];

  it('should return all examples', () => {
    let context = {};
    let generator = route.call(context);
    generator.next();
    expect(context.body).to.have.length.gt(0);
  });

});

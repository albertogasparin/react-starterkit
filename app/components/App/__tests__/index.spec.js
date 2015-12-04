/* eslint-env mocha *//* eslint-disable no-unused-vars */

import React from 'react';
import { expect } from 'chai';
import { spy, stub } from 'sinon';
import { render } from '../../../../tests/specs/helpers-client';

import App from '../index';

describe('App', () => {

  describe('DOM', () => {

    it('should render', () => {
      let { vdom, $, instance } = render(App, {});
      expect(vdom.type).to.equal('div');
      expect($('.App-btnAdd').length).to.equal(1);
      expect(instance.state.count).to.equal(0);
    });

  });
});

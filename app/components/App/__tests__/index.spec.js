/* eslint-env mocha *//* eslint-disable no-unused-vars */

import React from 'react';
import { expect } from 'chai';
import { spy, stub } from 'sinon';
import { shallow } from 'enzyme';

import App from '..';

describe('<App />', () => {

  describe('DOM', () => {

    it('should render', () => {
      let wrapper = shallow(<App />);
      expect(wrapper.is('div')).to.be.true;
      expect(wrapper.find('.App-btnAdd')).to.have.length(1);
      expect(wrapper.state('count')).to.equal(0);
    });

  });
});

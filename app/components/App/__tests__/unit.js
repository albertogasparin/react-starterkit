/* eslint-env mocha *//* eslint-disable no-unused-vars */

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import App from '..';

describe('<App />', () => {

  describe('DOM', () => {

    it('should render', () => {
      let wrapper = shallow(<App />);
      expect(wrapper.type()).to.equal('div');
      expect(wrapper.find('header')).to.have.length(1);
    });

  });
});

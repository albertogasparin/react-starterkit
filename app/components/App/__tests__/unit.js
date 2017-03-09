/* eslint-env jest *//* eslint-disable no-unused-vars */

import React from 'react';
import { shallow } from 'enzyme';

import App from '..';

describe('<App />', () => {

  describe('DOM', () => {

    it('should render', () => {
      let wrapper = shallow(<App />);
      expect(wrapper.type()).toEqual('div');
      expect(wrapper.find('header')).toHaveLength(1);
    });

  });
});

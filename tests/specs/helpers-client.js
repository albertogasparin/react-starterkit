
import React from 'react';
import { createRenderer } from 'react-addons-test-utils';
import ShallowTestUtils from 'react-shallow-testutils';

/**
 * Simple window mock
 */
global.window = {
  location: {},
  setTimeout(cb, time) {},
  clearTimeout(timer) {},
};


/**
 * Shallow reandering a component
 * @returns {object} API with access to instance and tree
 */
export function render(Component, props) {
  let renderer = createRenderer();
  renderer.render(<Component {...props}/>);

  let API = {};

  /**
   * Returns the component instance */
  API.instance = ShallowTestUtils.getMountedInstance(renderer);

  /**
   * Allows child matching */
  API.$ = (what) => {
    switch (typeof what) {
      case 'string':
        return /^\./.test(what)
          ? ShallowTestUtils.findAllWithClass(API.vdom, what.substring(1))
          : ShallowTestUtils.findAllWithType(API.vdom, what);
      case 'function':
        return ShallowTestUtils.findAll(API.vdom, what);
      default: // react component
        return ShallowTestUtils.findAllWithType(API.vdom, what);
    }
  };

  /**
   * Returns an updated copy of the rendered tree */
  Object.defineProperty(API, 'vdom', {
    get() { return renderer.getRenderOutput(); },
  });

  return API;
}

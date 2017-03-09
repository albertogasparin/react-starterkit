/* eslint-env jest */

// This is where you might want to extend jest

import config from '../../lib/config';

// expose React required globals
global.__CLIENT__ = false;
global.CONFIG_CLIENT = config.client;

// This is where you might want to set up globals hooks
require('jasmine-co').install();

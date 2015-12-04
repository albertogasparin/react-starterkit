/**
 * Load Babel
 * and enhance require with ES6
 */

require('babel-polyfill');
require('babel-register');

// Init the server app
require('./lib/index');

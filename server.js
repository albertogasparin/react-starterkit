console.log('\x1b[33mNode server starting...\x1b[0m'); // eslint-disable-line


/**
 * Load .env file (if any)
 * Providing custom props in process.env
 */
require('dotenv').load({ silent: true });


/**
 * Load dependencies
 */
var requireHacker = require('require-hacker');
var path = require('path');


/**
 * Ignore non js extensions
 * (sadly .babelrc "ignore" does not work)
 */
var REQUIRE_IGNORE = /\.(css|scss|jpe?g|png|gif|svg)$/;

requireHacker.global_hook('ignore extensions', function (pathName, module) {
  if (REQUIRE_IGNORE.test(pathName)) { return ''; }
});


/**
 * Add support Webpack-like require() aliasing
 * Allows resolving to custom paths/files
 */
var REQUIRE_ALIAS = {
  actions: path.join(__dirname, 'lib', 'actions'),
};

requireHacker.resolver(function (pathName, module) {
  for (var alias in REQUIRE_ALIAS) {
    if (pathName === alias || pathName.indexOf(alias + '/') === 0) {
      pathName = pathName.substring(alias.length);
      return requireHacker.resolve(path.join(REQUIRE_ALIAS[alias], pathName), module);
    }
  }
});


/**
 * Load Babel to enhance require with ES6
 * plus polyfill generators
 */
require('babel-polyfill');
require('babel-register');



// Init the server app
require('./lib/index');

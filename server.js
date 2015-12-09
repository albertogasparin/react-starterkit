console.log('\x1b[33mNode server starting...\x1b[0m'); // eslint-disable-line


/**
 * Load .env file (if any)
 * Providing custom props in process.env
 */
require('dotenv').load({ silent: true });

/**
 * Load Babel
 * and enhance require with ES6
 */
require('babel-polyfill');
require('babel-register');

/**
 * Ignore non js extensions
 * (sadly .babelrc "ignore" does not work)
 */
require.extensions['.css'] = function() { return; };
require.extensions['.scss'] = function() { return; };

// Init the server app
require('./lib/index');

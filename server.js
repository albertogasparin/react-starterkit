console.log('\x1b[33mNode server starting...'); // eslint-disable-line


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

// Init the server app
require('./lib/index');

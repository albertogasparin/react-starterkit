console.log('\x1b[33mNode server starting...\x1b[0m'); // eslint-disable-line


/**
 * Load .env file (if any)
 * Providing custom props in process.env
 */
require('dotenv').load({ silent: true });


/**
 * Load Babel to enhance require with ES6
 * plus polyfill generators
 */
require('babel-polyfill');
require('babel-register');



// Init the server app
require('./lib/index');

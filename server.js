/* eslint-disable no-console */
console.log('\x1b[33mNode server starting...\x1b[0m');


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


/**
 * Start the app
 */
var config = require('./lib/config').default;
var app = require('./lib/index').default;
app.listen(config.port);


console.log(`# Server [${config.env}] started on http://${config.host}:${config.port}/`); // eslint-disable-line


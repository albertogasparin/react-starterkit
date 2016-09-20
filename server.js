/* eslint-disable no-console */
'use strict';
console.log('\x1b[33mNode server starting...\x1b[0m');


/**
 * Load Babel to enhance require with ES6
 * plus polyfill generators
 */
require('babel-register');


/**
 * Start the app
 */
const config = require('./lib/config');
const app = require('./lib/index').default;
app.listen(config.port);


console.log('\x1b[33mServer [%s] started on http://%s:%s/\x1b[0m',
  config.env, config.host, config.port);

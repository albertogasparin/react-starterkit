/* eslint-env es6: false *//* eslint-disable no-var, no-console */
console.log('\x1b[33mNode server starting...\x1b[0m');


/**
 * Load Babel to enhance require with ES6
 * plus polyfill generators
 */
require('babel-polyfill');
require('babel-register');


/**
 * Start the app
 */
var config = require('./lib/config');
var app = require('./lib/index').default;
app.listen(config.port);


console.log('\x1b[33mServer [%s] started on http://%s:%s/\x1b[0m',
  config.env, config.host, config.port);

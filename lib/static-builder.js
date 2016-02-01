/* eslint-env es6: false *//* eslint-disable no-var, no-console */

/**
 * Load Babel to enhance require with ES6
 */
require('babel-polyfill');
require('babel-register');

/**
 * Static template generator
 */

var fs = require('fs');
var path = require('path');
var request = require('supertest');

var config = require('./config');
var app = require('./index').default;


function staticBuilder (url, fileName) {
  var server = app.listen();

  request(server)
    .get(url)
    .end(function(err, res) {
      fs.writeFile(path.join(config.root, 'public' , fileName), res.text, function (error) {
        if (error) { throw error; }
        console.log('\x1b[33mStatic template ./public/%s generated\x1b[0m', fileName);
      });
      server.close();
    });
}

// Exec builder only if called from command line
if (!module.parent) {
  staticBuilder('/', 'index.html');
}

module.exports = staticBuilder;

/* eslint-disable no-console */
'use strict';

/**
 * Load Babel to enhance require with ES6
 */
require('babel-register');

/**
 * Static template generator
 */

const fs = require('fs');
const path = require('path');
const request = require('supertest');

const config = require('./config');
const app = require('./index').default;


function staticBuilder (url, fileName) {
  const server = app.listen();

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

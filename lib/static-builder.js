/* eslint-disable no-console */

/**
 * Static template generator
 * Remember to run it with babel-node
 */

import fs from 'fs';
import path from 'path';
import request from 'supertest';

import config from './config';
import app from './index';


function staticBuilder (url, fileName) {
  let server = app.listen();

  request(server)
    .get(url)
    .end(function(err, res) {
      fs.writeFile(path.join(config.root, 'public' , fileName), res.text, (error) => {
        if (error) { throw error; }
        console.log('\x1b[33mStatic template ./public/' + fileName + ' generated\x1b[0m');
      });
      server.close();
    });
}

// Run builder only if called from command line
if (!module.parent && process.argv.length === 4) {
  staticBuilder(process.argv[2], process.argv[3]);
}

export default staticBuilder;

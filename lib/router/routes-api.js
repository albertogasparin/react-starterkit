
import path from 'path';
import fs from 'fs';
import _ from 'lodash';

import config from '../config';

/**
 * Setup API routes
 * by loading every folder/index.js inside ./api
 */
export default function (router) {

  if (!config.router.api) {
    return;
  }

  _.forEach(fs.readdirSync(config.router.api.folder), (file) => {
    let dir = path.resolve(config.router.api.folder, file);
    let routesConfig;

    if (!fs.lstatSync(dir).isDirectory()) {
      return;
    }

    try {
      // assume there is an index.js file in each folder
      routesConfig = require(dir).default;
    } catch (e) {
      /* eslint-disable no-console */
      console.log(
        `\x1b[31m[router] Found ./api/${file} but cannot load index.js routes: \n`,
        e.stack, '\x1b[0m');
      return;
    }

    _.forEach(routesConfig, (fn, key) => {
      let [ method, routePath ] = key.split(' '); // eg: GET /foo/:id
      router[method.toLowerCase()](config.router.api.prefix + routePath, fn);
    });
  });
}

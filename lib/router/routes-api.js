
import path from 'path';
import fs from 'fs';
import _forEach from 'lodash/collection/forEach';

import config from '../config';

/**
 * Setup API routes
 * by loading every folder/index.js inside ./api
 */
export default function (app, router) {

  const apiDir = path.join(config.root, 'api');

  _forEach(fs.readdirSync(apiDir), (file) => {
    let dir = path.resolve(apiDir, file);
    let routesConfig;

    if (!fs.lstatSync(dir).isDirectory()) {
      return;
    }

    try {
      // assume there is an index.js file in each folder
      routesConfig = require(path.join(dir, 'index')).default;
    } catch (e) {
      /* eslint-disable no-console */
      console.log(
        `\x1b[31m[router] Found ./api/${file} but cannot load index.js routes: \n`,
        e.stack, '\x1b[0m');
      return;
    }

    _forEach(routesConfig, (fn, key) => {
      let [ method, routePath ] = key.split(' '); // eg: GET /foo/:id
      router[method.toLowerCase()](config.api + routePath, fn);
    });
  });
}


import path from 'path';
import fs from 'fs';
import _forEach from 'lodash/collection/forEach';

/**
 * Setup API routes
 * by loading every folder/index.js inside ./api
 */
export default function (app, config, router) {

  const apiDir = path.join(config.root, 'api');

  fs.readdirSync(apiDir).forEach((file) => {
    let dir = path.resolve(apiDir, file);
    let routesConfig;

    try {
      // assume there is an index.js file in each folder
      routesConfig = require(path.join(dir, 'index')).default;
    } catch (e) {
      /* eslint-disable no-console */
      console.log(`\x1b[33m[router] Found ./api/${file} but cannot load index.js routes`);
      return;
    }

    _forEach(routesConfig, (fn, key) => {
      let method = key.split(' ')[0].toLowerCase(); // eg: get
      let routePath = key.split(' ')[1]; // eg: /foo/:id
      router[method](config.api + routePath, fn);
    });
  });
}

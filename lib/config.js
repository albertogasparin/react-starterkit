/* eslint-disable no-process-env, object-shorthand */

const path = require('path');

/**
 * Load .env file (if any)
 * Providing custom props in process.env and sets defaults
 */
require('dotenv').config({ silent: true });

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.HOST = process.env.HOST || '127.0.0.1';
process.env.PORT = process.env.PORT || 3000;

/**
 * Global config
 */

const root = path.normalize(path.join(__dirname, '/..'));

const config = {
  root: root,
  env: process.env.NODE_ENV,
  host: process.env.HOST,
  port: process.env.PORT,
  isomorphic: true,

  router: {
    api: {
      prefix: '/api', // prepended to all APIs routes
      folder: path.join(root, 'api'),
    },
    react: {
      path: '*', // matcher for routes that should return react
      template: 'index', // template we are rendering into
      routes: path.join(root, 'app', 'routes.js'),
      store: path.join(root, 'app', 'store.js'),
    },
  },

  server: {
    static: { // koa-static-cache
      maxAge: 365 * 24 * 60 * 60,
      gzip: true,
      dynamic: true,
    },

    resolve: { // webpack compat
      ignore: /\.(s?css|less|jpe?g|png|gif|svg|swf|mp[34])$/,
      alias: {
        providers: path.join(root, 'lib', 'providers'),
        tests: path.join(root, 'tests'),
      },
    },
  },

  webpack: {
    resolve: {
      extensions: ['', '.js', '.jsx', '.scss'],
      alias: {
        // SASS paths aliases (use with ~alias/file)
        assets: path.join(root, 'app', 'assets'),
        scss: path.join(root, 'app', 'scss'),
        // JS paths aliases
        providers: path.join(root, 'app', 'providers'),
      },
    },
  },

  client: {

    publicPath: process.env.PUBLIC_PATH || '/',

    fetch: {
      credentials: 'include',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    },

    gaProperty: process.env.GA_PROPERTY || '',
  },
};

if (config.env === 'development') {
  // use full URL otherwise CSS images break (css-loader bug)
  config.client.publicPath = 'http://' + config.host + ':' + config.port + '/';
}

module.exports = config;

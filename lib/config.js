
import path from 'path';

let env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
let root = path.normalize(path.join(__dirname, '/..'));

export default {
  env,
  root,
  port: process.env.PORT || 3000,
  host: process.env.HOST || '127.0.0.1',
  session: {
    keys: [process.env.COOKIE_SECRET || 'cookie-secret'],
  },
  api: '/api', // prefix of all API URL calls
  react: {
    routes: path.join(root, 'app', 'routes.js'),
    store: path.join(root, 'app', 'store.js'),
    isomorphic: true, // optionally disable
  },
  resolve: {
    ignore: /\.(s?css|less|jpe?g|png|gif|svg|swf|mp[34])$/,
    alias: {
      actions: path.join(root, 'lib', 'actions'),
    },
  },
  serve: {
    cache: {
      maxAge: 365 * 24 * 60 * 60,
      gzip: true,
    },
  },
  gaProperty: process.env.GA_PROPERTY || '',
};

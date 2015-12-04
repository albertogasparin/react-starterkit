
import path from 'path';
import _ from 'lodash';

let env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

let base = {
  app: {
    env,
    name: 'App',
    root: path.normalize(path.join(__dirname, '/..')),
    port: process.env.PORT || 3000,
    api: '/api', // api root path
    keys: ['im a cookie secret', 'i like isomorph unicorns'],
  },
  proxyWebpack: {
    host: 'http://localhost:8080',
    match: /^\/(_assets\/)|app|(\w+.hot-update)/,
  },
};

let specific = {
  development: {},
  test: {},
  production: {},
};

export default _.merge(base, specific[env]);

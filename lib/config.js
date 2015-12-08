
import path from 'path';

let env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
let root = path.normalize(path.join(__dirname, '/..'));

export default {
  env,
  root,
  port: process.env.PORT || 3000,
  session: {
    keys: [process.env.COOKIE_SECRET || 'im a cookie secret'],
  },
  api: '/api', // api root URL path
  react: {
    routes: path.join(root, 'app', 'routes.js'),
    isomorphic: process.env.ISOMORPHIC === 'false' ? false : true,
  },
  gaProperty: process.env.GA_PROPERTY || '',
};

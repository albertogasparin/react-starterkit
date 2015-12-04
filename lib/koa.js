
import path from 'path';
import serve from 'koa-static-cache';
import session from 'koa-generic-session';
import logger from 'koa-logger';
import compress from 'koa-compress';
import errorHandler from 'koa-error';
import bodyParser from 'koa-bodyparser';
import Jade from 'koa-jade';

const STATIC_FILES_MAP = {};
const SERVE_OPTIONS = {
  maxAge: 365 * 24 * 60 * 60,
  gzip: true,
};

export default function(app, config) {

  // serve static files through koa on production
  // while on development proxy to webpak server to hot reload
  if (config.app.env === 'production') {
    app.use(serve(path.join(config.app.root, 'public'), SERVE_OPTIONS, STATIC_FILES_MAP));
  } else {
    app.use(require('koa-proxy')(config.proxyWebpack));
  }

  // console log requests
  // defined after koa-proxy to skip logging hot reload req
  if (config.app.env !== 'test') {
    app.use(logger());
  }

  // provide default error handling
  // template parsed with swing lang
  app.use(errorHandler({
    template: path.join(config.app.root, 'views', 'error.html'),
  }));

  app.keys = config.app.keys; // cookie keys
  app.use(session({
    // defaults to memory store
    // on production use a proper one https://github.com/koajs/generic-session
    // eg: `store: new MongoStore({ url: config.mongo.url })`
  }));

  app.use(bodyParser());
  app.use(compress());

  let jade = new Jade({
    viewPath: path.join(config.app.root, 'views'),
    pretty: false, // otherwise react complains
    compileDebug: config.app.env !== 'production',
    noCache: config.app.env !== 'production',
    locals: { env: config.app.env },
    helperPath: [{ _: require('lodash') }],
  });

  app.use(jade.middleware);

}

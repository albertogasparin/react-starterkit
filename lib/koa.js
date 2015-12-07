
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

  // console log requests
  if (config.env !== 'test') {
    app.use(logger());
  }

  // serve static files with cache control
  app.use(serve(path.join(config.root, 'public'), SERVE_OPTIONS, STATIC_FILES_MAP));

  // provide default error handling
  // template parsed with swing lang
  app.use(errorHandler({
    template: path.join(config.root, 'views', 'error.html'),
  }));

  app.keys = config.session.keys;
  app.use(session({
    // defaults to memory store
    // on production use a proper one https://github.com/koajs/generic-session
    // eg: `store: new MongoStore({ url: config.mongo.url })`
  }));

  app.use(bodyParser());
  app.use(compress());

  let jade = new Jade({
    viewPath: path.join(config.root, 'views'),
    pretty: false, // otherwise react complains
    compileDebug: config.env !== 'production',
    noCache: config.env !== 'production',
    locals: { env: config.env },
    helperPath: [{ _: require('lodash') }],
  });

  app.use(jade.middleware);

}


import path from 'path';
import serve from 'koa-static-cache';
import logger from 'koa-logger';
import compress from 'koa-compress';
import errorHandler from 'koa-error';
import body from 'koa-better-body';
import Jade from 'koa-jade';

import config from './config';

export default function(app) {

  // serve static files with cache control
  app.use(serve(path.join(config.root, 'public'), config.server.cache, {}));

  // console log requests
  if (config.env !== 'test') {
    app.use(logger());
  }

  // provide default error handling
  // template parsed with swing lang
  app.use(errorHandler({
    engine: 'jade',
    template: path.join(config.root, 'templates', 'error.jade'),
  }));

  // to add session management, see https://github.com/koajs/generic-session
  // eg:
  // app.keys = config.server.session.keys;
  // app.use(session({
  //   store: new MongoStore({ url: config.server.mongo.url }),
  // }));

  app.use(body({
    encoding: 'utf-8',
    fields: 'body', // set this.request.body
    files: 'files', // set this.request.files
  }));

  app.use(compress());

  // attach koa-jade APIs to app
  let jade = new Jade({
    app,
    viewPath: path.join(config.root, 'templates'),
    pretty: false, // otherwise react complains about spaces
    compileDebug: config.env !== 'production',
    noCache: config.env !== 'production',
  });

  jade.locals = {
    config,
  };

  jade.helperPath = [
    { _: require('lodash') }, // expose lodash to all templates
  ];

}

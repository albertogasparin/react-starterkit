
import path from 'path';
import serve from 'koa-static-cache';
import logger from 'koa-logger';
import compress from 'koa-compress';
import errorHandler from 'koa-error';
import bodyParser from 'koa-bodyparser';
import Jade from 'koa-jade';

import config from './config';

export default function(app) {

  // console log requests
  if (config.env !== 'test') {
    app.use(logger());
  }

  // serve static files with cache control
  app.use(serve(path.join(config.root, 'public'), config.server.cache, {}));

  // provide default error handling
  // template parsed with swing lang
  app.use(errorHandler({
    template: path.join(config.root, 'views', 'error.html'),
  }));

  // to add session management, see https://github.com/koajs/generic-session
  // eg:
  // app.keys = config.server.session.keys;
  // app.use(session({
  //   store: new MongoStore({ url: config.server.mongo.url }),
  // }));

  app.use(bodyParser({
    extendTypes: {
      json: ['text/plain'], // parse type as a JSON string
    },
  }));

  app.use(compress());

  // attach koa-jade APIs to app
  let jade = new Jade({
    app,
    viewPath: path.join(config.root, 'views'),
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

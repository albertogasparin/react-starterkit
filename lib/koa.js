import path from 'path';
import serve from 'koa-static-cache';
import logger from 'koa-logger';
import compress from 'koa-compress';
import body from 'koa-bodyparser';
import session from 'koa-session';

import config from './config';
import log from './logger';

export default function(app) {
  // serve static files with cache control
  app.use(serve(path.join(config.root, 'public'), config.server.static, {}));

  // console log requests
  /* istanbul ignore next */
  if (config.env !== 'test') {
    app.use(logger());
  }

  // Override default onerror implementation
  app.onerror = function(err) {
    /* eslint-disable no-console */
    if (err.status === 404 || err.expose) {
      return;
    }
    log.error(err);
  };

  // Session management
  app.keys = config.server.session.keys;
  app.use(session(config.server.session.options, app));

  app.use(body());

  app.use(
    compress({
      flush: require('zlib').Z_SYNC_FLUSH, // better for streaming
    })
  );
}

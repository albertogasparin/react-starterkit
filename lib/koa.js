
import path from 'path';
import serve from 'koa-static-cache';
import logger from 'koa-logger';
import compress from 'koa-compress';
import body from 'koa-better-body';

import config from './config';

export default function (app) {

  // serve static files with cache control
  app.use(serve(path.join(config.root, 'public'), config.server.static, {}));

  // console log requests
  /* istanbul ignore next */
  if (config.env !== 'test') {
    app.use(logger());
  }

  // Override default onerror implementation
  app.onerror = function (err) { /* eslint-disable no-console */
    if (err.status === 404 || err.expose) { return; }
    let msg = err.stack.split(/\n/)
      .filter((v, i) => i === 0 || v.includes(config.root))
      .map((v, i) => i === 0 && !err.status ? `\x1b[91m${v}\x1b[0m` : v.replace(config.root, '.'))
      .join('\n');

    let log = err.status ? console.log : console.error;
    log(`\n${msg}\n`);
  };

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

  app.use(compress({
    flush: require('zlib').Z_SYNC_FLUSH, // better for streaming
  }));

}

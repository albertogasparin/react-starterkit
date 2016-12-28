
import path from 'path';
import serve from 'koa-static-cache';
import logger from 'koa-logger';
import compress from 'koa-compress';
import onError from 'koa-onerror';
import body from 'koa-better-body';
import marko from 'marko';
import markoCompiler from 'marko/compiler';

import config from './config';

export default function(app) {

  // serve static files with cache control
  app.use(serve(path.join(config.root, 'public'), config.server.static, {}));

  // console log requests
  if (config.env !== 'test') {
    app.use(logger());
  }

  // Override default onerror implementation
  app.onerror = function (err) { /* eslint-disable no-console */
    if (err.status === 404 || err.expose || this.silent) { return; }
    let msg = err.stack || err.toString();
    let ignoreExp = /\((node\.js)/;
    msg = msg.split(/\n/).filter((v) => !ignoreExp.test(v)).join('\n');
    console.error();
    console.error(msg);
    console.error();
  };

  // 404 handling (as onError ignores it by default)
  app.use(function *(next) {
    yield next;
    if (this.status >= 400) {
      this.throw(this.status, this.response.message);
    }
  });

  // global error handling
  onError(app, {
    html(error) {
      if (!this.body) {
        let tpl = marko.load(path.join(config.root, 'templates', 'error.marko'));
        this.body = tpl.renderToString({ error, status: this.status });
      }
    },
  });

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

  // disable marko temp files (until we can customize destination)
  markoCompiler.defaultOptions.writeToDisk = false;

  // Enhance context with .render() template method
  app.use(function *(next) {
    Object.assign(this, {
      render(relPath, locals = {}) {
        if (!/\.marko$/.test(relPath)) {
          relPath += '.marko';
        }
        let tpl = marko.load(path.join(config.root, 'templates', relPath));
        this.type = 'text/html';
        this.body = tpl.stream(locals);
      },
    });
    yield next;
  });

}

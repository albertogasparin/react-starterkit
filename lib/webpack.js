
import requireHacker from 'require-hacker';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import webpackConfig from '../webpack.config';
import config from './config';

/**
 * This file is load ONLY if env is development
 * We enable hot reloading on client / server
 */

// Hack to enable hot reload on node
// We delete require cache for each module required by react routes
requireHacker.resolver(function (pathName, module) {
  if (pathName === config.router.react.routes || config.server.resolve.alias[pathName]) {
    (function clearCache(fileId) {
      let cache = require.cache[fileId] || { children: [] };
      cache.children.forEach((child) => clearCache(child.id));
      delete require.cache[fileId];
    })(pathName);
  }
});


// Add webpack middlewares to Koa
// we need to adapt webpack express mw to work on Koa
export default function (app) {

  const compiler = webpack(webpackConfig);
  const hotMiddleware = webpackHotMiddleware(compiler);
  const devMiddleware = webpackDevMiddleware(compiler, webpackConfig.devMiddleware);

  // Add webpack Dev middleware
  app.use(function *(next) {
    let ctx = this;
    let runNext = yield expressMiddleware(devMiddleware, this.req, {
      end(content) {
        ctx.body = content;
      },
      setHeader() {
        ctx.set.apply(ctx, arguments);
      },
    });
    if (runNext && next) {
      yield next;
    }
  });

  // Add webpack Hot middleware
  app.use(function *(next) {
    yield hotMiddleware.bind(null, this.req, this.res);
    yield next;
  });

}


// Generic wrapper to adapt express middlewares to Koa
// used by webpackDevMiddleware
function expressMiddleware(doIt, req, res) {
  let originalEnd = res.end;
  return function (done) {
    res.end = function () {
      originalEnd.apply(this, arguments);
      done(null, 0);
    };
    doIt(req, res, function () {
      done(null, 1);
    });
  };
}

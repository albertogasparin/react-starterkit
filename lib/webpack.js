
import requireHacker from 'require-hacker';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack.config';

// wrapper to adapt express middlewares to Koa
function expressMiddleware(doIt, req, res) {
  var originalEnd = res.end;
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


export default function(app, config) {

  const compiler = webpack(webpackConfig);
  const hotMiddleware = webpackHotMiddleware(compiler, {});
  const devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    contentBase: webpackConfig.output.path,
    hot: true,
    inline: true,
    lazy: false,
    quiet: true,
    noInfo: false,
  });


  // Add webpack Dev middleware
  // adapting the code to be Koa compatible
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
      yield *next;
    }
  });


  // Add webpack Hot middleware
  // adapting the code to be Koa compatible
  app.use(function *(next) {
    let nextStep = yield expressMiddleware(hotMiddleware, this.req, this.res);
    if (nextStep && next) {
      yield *next;
    }
  });


  // Hack to enable hot reload on node
  // We delete require cache for each module required by react routes
  function clearCache(fileId) {
    let cache = require.cache[fileId] || { children: [] };
    cache.children.forEach((child) => clearCache(child.id));
    delete require.cache[fileId];
  }

  requireHacker.resolver(function (pathName, module) {
    if (pathName === config.react.routes) {
      clearCache(pathName);
    }
  });

}

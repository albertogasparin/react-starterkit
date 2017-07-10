'use strict';

/*
 * Load dependencies
 */
const webpack = require('webpack');
const path = require('path');

const config = require('./lib/config');

/*
 * Main webpack config
 */
let webpackCfg = {
  target: 'node',
  devtool: 'source-map',
  entry: {
    index: [path.join(config.root, 'server')],
  },
  resolve: config.webpack.resolve,
  stats: {
    colors: true,
    reasons: true,
    children: false,
  },
  output: {
    path: path.join(config.root, 'server_build'),
    filename: '[name].js',
  },
  performance: {
    hints: false,
  },
  node: {
    console: false,
    global: false,
    process: false,
    __filename: false,
    __dirname: false,
    Buffer: false,
    setImmediate: false,
  },
  externals: [
    (context, request, callback) => {
      // Absolute & Relative paths are not externals
      if (request.match(/^(\.{0,2})\//)) {
        return callback();
      }

      try {
        // Attempt to resolve the module via Node
        require.resolve(request);
        callback(null, 'commonjs ' + request);
      } catch (e) {
        // Node couldn't find it, so it must be user-aliased
        callback();
      }
    },
  ],
};

/*
 * Webpack modules
 */
webpackCfg.module = {
  rules: [
    {
      // JS/JSX loader + hot reload
      test: /\.jsx?$/,
      use: [{ loader: 'babel-loader' }],
    },
    {
      test: /\.marko$/,
      use: [{ loader: 'marko-loader', query: { target: 'server' } }],
    },
    {
      // SVG Icons sprite loader
      test: /\.svg$/,
      include: [path.join(config.root, 'app', 'assets', 'icons')],
      use: [
        {
          loader: 'svg-sprite-loader',
          options: {
            symbolId: 'i-[name]',
          },
        },
      ],
    },
  ],
};

/*
 * Webpack plugins
 */
webpackCfg.plugins = [
  // Variable replacement to bridge client/server side globals
  new webpack.DefinePlugin(
    Object.assign(
      {
        // 'process.env.NODE_ENV': JSON.stringify(config.env),
        __CLIENT__: false, // allow detection if serverside rendering
      },
      // provide server side config vars
      pathKeys(config.client, 'CONFIG_CLIENT')
    )
  ),

  new webpack.BannerPlugin({
    banner: 'require("source-map-support").install();',
    raw: true,
    entryOnly: false,
  }),

  new webpack.NormalModuleReplacementPlugin(
    config.server.resolve.ignore,
    res => {
      if (!/assets\/icons\/(.*)\.svg$/.test(res.request)) {
        res.request = 'lodash/noop';
      }
    }
  ),
];

function pathKeys(obj, root) {
  return Object.keys(obj).reduce((r, k) => {
    r[root + '.' + k] = JSON.stringify(obj[k]);
    return r;
  }, {});
}

module.exports = webpackCfg;

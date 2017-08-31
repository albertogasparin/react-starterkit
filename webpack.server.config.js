'use strict';

/*
 * Load dependencies
 */
const webpack = require('webpack');
const path = require('path');

const config = require('./lib/config');
const packageJSON = require('./package.json');
const deps = [].concat(
  Object.keys(packageJSON.dependencies),
  Object.keys(packageJSON.devDependencies)
);

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
      // Check if dependency or attempt to resolve the module via Node
      if (request.match(/^(\.{0,2})\//)) {
        // Absolute & Relative paths are not externals
        return callback();
      }

      try {
        if (deps.includes(request) || require.resolve(request)) {
          return callback(null, 'commonjs ' + request);
        }
      } catch (e) {
        // Node couldn't find it, so it must be user-aliased
        return callback();
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

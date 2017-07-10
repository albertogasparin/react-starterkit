'use strict';

/**
 * Load dependencies
 */
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SvgSpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const autoprefixer = require('autoprefixer');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const LodashPlugin = require('lodash-webpack-plugin');

const config = require('./lib/config');

/**
 * Private vars and fn
 * to customise config based on env
 */
const supportedBrowsers = ['last 3 versions', 'IE >= 11', 'Android >= 4.4'];
const isProduction = config.env === 'production';
const extractCSS = new ExtractTextPlugin({
  filename: '[name].css',
  allChunks: true,
});

/**
 * Main webpack config
 */
let webpackCfg = {
  context: config.root,
  devtool: isProduction ? 'source-map' : 'cheap-module-eval-source-map',
  entry: {
    // vendor: ['react'],
    app: extendEntrySources([path.join(config.root, 'app', 'client')]),
  },
  resolve: config.webpack.resolve,
  stats: {
    colors: true,
    reasons: true,
    children: false,
  },
  output: {
    path: path.join(config.root, 'public', 'assets'),
    publicPath: config.client.publicPath + 'assets/',
    filename: '[name].js',
    chunkFilename: '[id].[hash].js',
  },
  performance: {
    hints: false,
  },
  node: {
    Buffer: false, // prevent axios 0.16.1 from bundling buffer
  },
};

/**
 * Webpack devServer
 */
webpackCfg.devServer = {
  contentBase: webpackCfg.output.path,
  publicPath: webpackCfg.output.publicPath,
  hot: true,
  inline: true,
  lazy: false,
  quiet: true,
  noInfo: false,
};

/**
 * Webpack modules
 */
webpackCfg.module = {
  rules: [
    {
      // JS/JSX loader + hot reload
      test: /\.jsx?$/,
      include: path.join(config.root, 'app'),
      use: [
        {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: [
              [
                'env',
                {
                  targets: { browsers: supportedBrowsers },
                  loose: true,
                  modules: false,
                },
              ],
              'react',
              'stage-2',
            ],
            plugins: isProduction
              ? [
                  'lodash',
                  ['transform-react-remove-prop-types', { removeImport: true }],
                  'transform-react-constant-elements',
                  'transform-react-inline-elements',
                ]
              : [
                  [
                    'react-transform',
                    {
                      transforms: [
                        {
                          transform: 'react-transform-hmr',
                          imports: ['react'],
                          locals: ['module'],
                        },
                      ],
                    },
                  ],
                ],
          },
        },
      ],
    },
    {
      // CSS/SASS loader + autoprefixer
      test: /\.scss$/,
      include: path.join(config.root, 'app'),
      use: extendCSSLoaders([
        {
          loader: 'css-loader',
          options: {
            minimize: false,
            sourceMap: true,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => [autoprefixer({ browsers: supportedBrowsers })],
            sourceMap: true,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            outputStyle: 'expanded',
            sourceMap: !isProduction, // breaks build sass-loader#309
          },
        },
      ]),
    },
    {
      // Image/SVG loader + base64 encode + optimisation
      test: /\.(jpe?g|png|gif|svg)$/i,
      exclude: /assets\/icons/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: '[name].[hash:6].[ext]',
          },
        },
        {
          loader: 'image-webpack-loader',
          options: {
            bypassOnDebug: true,
            progressive: true,
          },
        },
      ],
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
            extract: isProduction,
            spriteFilename: 'icons.svg',
          },
        },
        {
          loader: 'image-webpack-loader',
        },
      ],
    },
    {
      // Generic file loader
      test: /\.(eot|ttf|woff2?|swf|mp[34]|wav)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[hash:6].[ext]',
          },
        },
      ],
    },
  ],
};

/**
 * Webpack plugins
 */
webpackCfg.plugins = extendPlugins([
  new webpack.LoaderOptionsPlugin({
    debug: !isProduction,
  }),
  // Variable replacement to bridge client/server side globals
  new webpack.DefinePlugin(
    Object.assign(
      {
        'process.env.NODE_ENV': JSON.stringify(config.env),
        __CLIENT__: true, // allow detection if clientside rendering
      },
      // provide server side config vars
      pathKeys(config.client, 'CONFIG_CLIENT')
    )
  ),

  // Fixes for commonly used libraries (triggered only if lib is actually used)
  new webpack.ProvidePlugin({
    Promise: 'exports-loader?global.Promise!promise-polyfill', // IE11 Promise polyfill
  }),

  // Convert lodash-es to lodash, avoiding duplication
  new webpack.NormalModuleReplacementPlugin(/^lodash-es(\/|$)/, res => {
    res.request = res.request.replace(/^lodash-es(\/|$)/, 'lodash$1');
  }),

  // Disable Moment langs from being auto-required
  new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),

  new LodashPlugin({
    shorthands: true, // Iteratee shorthands for _.property, _.matches, & _.matchesProperty
    cloning: true, // Support “clone” methods & cloning source objects
    currying: true, // Support “curry” methods
    caching: true, // Caches for methods like _.cloneDeep, _.isEqual, & _.uniq
    collections: true, // Support objects in “Collection” methods
    // deburring: true, // Support deburring letters
    memoizing: true, // Support _.memoize & memoization
    coercions: true, // Coercion methods like _.toInteger, _.toNumber, & _.toString
    flattening: true, // Support “flatten” methods & flattening rest arguments
    paths: true, // Deep property path support for methods like _.get, _.has, & _.set
    placeholders: true, // Argument placeholder support for “bind”, “curry”, & “partial” methods
  }),

  // Add any additional provide/define plugin here
]);

function extendEntrySources(sources) {
  if (!isProduction) {
    sources.unshift('webpack-hot-middleware/client');
  }
  return sources;
}

function extendCSSLoaders(loaders) {
  if (!isProduction) {
    loaders.unshift({
      loader: 'style-loader',
      options: { convertToAbsoluteUrls: true },
    });
    return loaders;
  }
  // move css to separate file
  return extractCSS.extract({
    fallback: 'style-loader',
    use: loaders,
    publicPath: './', // make css image urls relative
  });
}

function extendPlugins(plugins) {
  if (!isProduction) {
    plugins.unshift(new webpack.HotModuleReplacementPlugin());
  } else {
    plugins.push(
      extractCSS,
      new SvgSpriteLoaderPlugin(),
      new OptimizeCssAssetsPlugin({
        cssProcessorOptions: { discardComments: { removeAll: true } },
        canPrint: false,
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false },
        output: { comments: false },
        sourceMap: true,
      })
    );
  }
  return plugins;
}

function pathKeys(obj, root) {
  return Object.keys(obj).reduce((r, k) => {
    r[root + '.' + k] = JSON.stringify(obj[k]);
    return r;
  }, {});
}

module.exports = webpackCfg;

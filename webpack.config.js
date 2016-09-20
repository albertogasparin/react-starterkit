/* eslint-disable object-shorthand */
'use strict';

/**
 * Load dependencies
 */
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ExtractSVGPlugin = require('svg-sprite-loader/lib/extract-svg-plugin');
const autoprefixer = require('autoprefixer');
const LodashPlugin = require('lodash-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HappyPack = require('happypack');
const happyTPool = HappyPack.ThreadPool({ size: 4 });

const config = require('./lib/config');

/**
 * Private vars and fn
 * to customise config based on env
 */
const isProduction = config.env === 'production';
const extractCSS = new ExtractTextPlugin('[name].css', { allChunks: true });
const extractSVG = new ExtractSVGPlugin('icons.svg');

function extendEntrySources(sources) {
  if (!isProduction) {
    sources.unshift('webpack-hot-middleware/client');
  }
  return sources;
}

function extendCSSLoaders(loaders) {
  if (!isProduction) {
    loaders.unshift('style-loader');
    return loaders.join('!');
  }
  // move css to separate file
  return extractCSS.extract('style-loader', loaders.join('!'), {
    publicPath: './', // make css image urls relative
  });
}

function extendSVGLoader(loaders) {
  loaders = loaders.join('!');
  if (!isProduction) {
    return loaders;
  }
  loaders = loaders.replace('sprite-loader?', 'sprite-loader?extract=true&');
  return extractSVG.extract(loaders);
}

function extendPlugins(plugins) {
  if (!isProduction) {
    plugins.unshift(new webpack.HotModuleReplacementPlugin());
    plugins.push(new webpack.ProvidePlugin({
      'window.reduxImmutable': 'redux-immutable-state-invariant',
    }));
  } else {
    // plugins.push(new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   minChunks: Infinity,
    // }));
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false, screw_ie8: true },
      comments: false,
      sourceMap: false,
    }));
    plugins.push(extractCSS);
    plugins.push(extractSVG);
    plugins.push(new OptimizeCssAssetsPlugin({
      cssProcessorOptions: { discardComments: { removeAll: true } },
    }));
  }
  return plugins;
}

/**
 * Main config
 */
module.exports = {
  debug: !isProduction,
  devtool: !isProduction ? 'cheap-module-eval-source-map' : false,
  entry: {
    // vendor: ['react'],
    app: extendEntrySources(['./app/client']),
  },
  resolve: config.webpack.resolve,
  stats: {
    colors: true,
    reasons: true,
  },
  output: {
    path: path.join(config.root, 'public', 'assets'),
    publicPath: config.client.publicPath + 'assets/',
    filename: '[name].js',
    chunkFilename: '[id].[hash].js',
  },
  devMiddleware: {
    publicPath: config.client.publicPath + 'assets/', // same as output.publicPath
    contentBase: path.join(config.root, 'public', 'assets'), // same as output.path
    hot: true,
    inline: true,
    lazy: false,
    quiet: true,
    noInfo: false,
  },
  module: {
    loaders: [
      { // JS/JSX loader + hot reload
        test: /\.jsx?$/,
        include: path.join(config.root, 'app'),
        loader: 'babel-loader',
        query: {
          'presets': ['es2015'],
          'plugins': isProduction ? ['lodash'] : [
            ['react-transform', {
              'transforms': [{
                'transform': 'react-transform-hmr',
                'imports': ['react'],
                'locals': ['module'],
              }],
            }],
          ],
        },
        happy: { id: 'js' },
      }, { // CSS/SASS loader + autoprefixer
        test: /\.s?css$/,
        include: path.join(config.root, 'app'),
        loader: extendCSSLoaders([
          'css-loader?'
            + ['sourceMap', '-minimize', '-autoprefixer'].join('&'),
          'postcss-loader',
          'sass-loader?'
            + ['sourceMap', 'outputStyle=expanded'].join('&'),
        ]),
        happy: { id: 'css' },
      }, { // Image/SVG loader + base64 encode + optimisation
        test: /\.(jpe?g|png|gif|svg)$/i,
        exclude: /assets\/icons/,
        loaders: [
          'url-loader?'
            + ['limit=8192', 'name=[name].[hash:6].[ext]'].join('&'),
          'image-webpack-loader?'
            + ['bypassOnDebug', 'progressive=true'].join('&'),
        ],
      }, { // SVG Icons sprite loader
        test: /\.svg$/,
        include: [path.join(config.root, 'app', 'assets', 'icons')],
        loader: extendSVGLoader([
          'svg-sprite-loader?' + ['name=i-[name]'].join('&'),
          'image-webpack-loader',
        ]),
      }, { // Generic file loader
        test: /\.(eot|ttf|woff2?|swf|mp[34]|wav)$/i,
        loaders: [
          'file-loader?'
            + ['name=[name].[hash:6].[ext]'].join('&'),
        ],
      },
    ],
  },
  postcss: function () {
    return [autoprefixer({ browsers: ['last 3 versions', 'IE >= 9', 'Android >= 4'] })];
  },
  plugins: extendPlugins([
    new webpack.optimize.OccurrenceOrderPlugin(),

    new HappyPack({ id: 'js', threadPool: happyTPool, verbose: false }),
    new HappyPack({ id: 'css', threadPool: happyTPool, verbose: false, enabled: !isProduction }),

    // Variable replacement to bridge client/server side globals
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(config.env) },
      __CLIENT__: true, // allow detection if clientside rendering
      // provide server side config vars (ensure strings are quoted)
      CONFIG_CLIENT: JSON.stringify(config.client),
    }),

    // Fixes for commonly used libraries (triggered only if lib is actually used)
    new webpack.ProvidePlugin({
      'Promise': 'exports-loader?global.Promise!es6-promise', // Promise polyfill
      'window.fetch': 'exports-loader?self.fetch!whatwg-fetch', // Fetch polyfill
    }),

    // Disable Moment langs from being auto-required
    new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),

    new webpack.optimize.DedupePlugin(),

    // Remove lodash features (comment to save more)
    new LodashPlugin({
      shorthands: true, // Iteratee shorthands for _.property, _.matches, & _.matchesProperty
      cloning: true, // Support “clone” methods & cloning source objects
      currying: true, // Support “curry” methods
      caching: true, // Caches for methods like _.cloneDeep, _.isEqual, & _.uniq
      collections: true, // Support objects in “Collection” methods
      deburring: true, // Support deburring letters
      coercions: true, // Coercion methods like _.toInteger, _.toNumber, & _.toString
      memoizing: true, // Support _.memoize & memoization
      flattening: true, // Support “flatten” methods & flattening rest arguments
      paths: true, // Deep property path support for methods like _.get, _.has, & _.set
      placeholders: true, // Argument placeholder support for “bind”, “curry”, & “partial” methods
    }),

    // Add any additional provide/define plugin here
  ]),
};

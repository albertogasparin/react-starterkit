/* eslint-disable no-var, object-shorthand */

/**
 * Load dependencies
 */
var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ExtractSVGPlugin = require('svg-sprite-loader/lib/extract-svg-plugin');
var autoprefixer = require('autoprefixer');
var LodashPlugin = require('lodash-webpack-plugin');

var config = require('./lib/config');

/**
 * Private vars and fn
 * to customise config based on env
 */
var isProduction = config.env === 'production';
var extractCSS = new ExtractTextPlugin('[name].css', { allChunks: true });
var extractSVG = new ExtractSVGPlugin('icons.svg');

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
    }));
    plugins.push(extractCSS);
    plugins.push(extractSVG);
  }
  return plugins;
}

/**
 * Main config
 */
module.exports = {
  debug: !isProduction,
  devtool: !isProduction ? 'cheap-module-eval-source-map' : 'cheap-source-map',
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
      }, { // CSS/SASS loader + autoprefixer
        test: /\.s?css$/,
        loader: extendCSSLoaders([
          'css-loader?'
            + ['sourceMap', (isProduction ? '' : '-') + 'minimize', '-autoprefixer'].join('&'),
          'postcss-loader',
          'sass-loader?'
            + ['sourceMap', 'outputStyle=expanded'].join('&'),
        ]),
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

    // Variable replacement to bridge client/server side globals
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({ NODE_ENV: config.env }),
      __CLIENT__: true, // allow detection if clientside rendering
      CONFIG_CLIENT: JSON.stringify(config.client), // provide server side config vars
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
      flattening: true, // Support “flatten” methods & flattening rest arguments
      paths: true, // Deep property path support for methods like _.get, _.has, & _.set
      memoizing: true, // Support _.memoize & memoization
      placeholders: true, // Argument placeholder support for “bind”, “curry”, & “partial” methods
    }),

    // Add any additional provide/define plugin here
  ]),
};

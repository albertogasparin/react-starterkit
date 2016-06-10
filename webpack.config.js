/* eslint-disable no-var, object-shorthand */

/**
 * Load dependencies
 */
var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');

var config = require('./lib/config');

/**
 * Private vars and fn
 * to customise config based on env
 */
var isProduction = config.env === 'production';

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
  return ExtractTextPlugin.extract('style-loader', loaders.join('!'), {
    publicPath: './', // make css image urls relative
  });
}

function extendSVGLoader(loaders) {
  loaders = loaders.join('!');
  return loaders;
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
    plugins.push(new ExtractTextPlugin('[name].css', {
      allChunks: true,
    }));
    plugins.push(new webpack.NoErrorsPlugin());
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
  resolve: config.client.resolve,
  stats: {
    colors: true,
    reasons: true,
  },
  output: {
    path: path.join(config.root, 'public', 'assets'),
    publicPath: config.publicPath + 'assets/',
    filename: '[name].js',
    chunkFilename: '[id].[hash].js',
  },
  devMiddleware: {
    publicPath: config.publicPath + 'assets/', // same as output.publicPath
    contentBase: path.join(config.root, 'public', 'assets'), // same as output.path
    hot: true,
    inline: true,
    lazy: false,
    quiet: true,
    noInfo: false,
  },
  module: {
    loaders: [
      { // CSS/SASS loader + autoprefixer
        test: /\.s?css$/,
        exclude: /(node_modules|bower_components)/,
        loader: extendCSSLoaders([
          'css-loader?'
            + ['sourceMap', (isProduction ? '' : '-') + 'minimize', '-autoprefixer'].join('&'),
          'postcss-loader',
          'sass-loader?'
            + ['sourceMap', 'outputStyle=expanded'].join('&'),
        ]),
      }, { // JS/JSX loader + hot reload
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
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
          'svg-sprite-loader?' + JSON.stringify({ name: 'i-[name]' }),
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
    new webpack.optimize.OccurenceOrderPlugin(),

    // Variable replacement to bridge client/server side globals
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(config.env) },
      __CLIENT__: true, // allow detection if clientside rendering
      // provide server side config vars (ensure strings are quoted)
      'CONFIG': {
        publicPath: JSON.stringify(config.publicPath),
        fetch: JSON.stringify(config.client.fetch),
      },
    }),

    // Fixes for commonly used libraries (triggered only if lib is actually used)
    new webpack.ProvidePlugin({
      'Promise': 'exports-loader?global.Promise!es6-promise', // Promise polyfill
      'window.fetch': 'exports-loader?self.fetch!whatwg-fetch', // Fetch polyfill
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]), // Disable Moment langs auto-required

    new webpack.optimize.DedupePlugin(),
    // Add any additional provide/define plugin here
  ]),
};

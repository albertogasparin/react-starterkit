/* eslint-disable object-shorthand */

/**
 * Load .env file (if any)
 * Providing custom props in process.env
 */
require('dotenv').load({ silent: true });

/**
 * Load dependencies
 */
var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');

/**
 * Private vars and fn
 * to customise config based on env
 */
var isProduction = process.env.NODE_ENV === 'production';
var NODE_HOST = process.env.HOST || '127.0.0.1';
var NODE_PORT = process.env.PORT || 3000;

function extendEntrySources(sources) {
  if (!isProduction) {
    sources.unshift('webpack-hot-middleware/client');
  }
  return sources;
}

function extendCSSLoaders (loaders) {
  if (!isProduction) {
    loaders.unshift('style-loader');
    return loaders.join('!');
  }
  // move css to separate file
  return ExtractTextPlugin.extract('style-loader', loaders.join('!'));
}

function extendPlugins(plugins) {
  if (!isProduction) {
    plugins.unshift(new webpack.HotModuleReplacementPlugin());
  } else {
    plugins.push(new webpack.optimize.DedupePlugin());
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
  devtool: !isProduction ? 'eval-source-map' : '',
  entry: {
    // vendor: ['react'],
    app: extendEntrySources(['./app/client']),
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss'],
    alias: {
      // SASS paths aliases (use with ~alias/file)
      assets: path.join(__dirname, 'app', 'assets'),
      scss: path.join(__dirname, 'app', 'scss'),
      // JS paths aliases
      actions: path.join(__dirname, 'app', 'actions'),
    },
  },
  stats: {
    colors: true,
    reasons: true,
  },
  output: {
    path: path.join(__dirname, 'public', 'assets'),
    publicPath: (isProduction ? '' : 'http://' + NODE_HOST + ':' + NODE_PORT) + '/assets/',
    filename: '[name].js',
    chunkFilename: '[id].[hash].js',
  },
  devMiddleware: {
    publicPath: 'http://' + NODE_HOST + ':' + NODE_PORT + '/assets/', // same as output.publicPath
    contentBase: path.join(__dirname, 'public', 'assets'), // same as output.path
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
          'plugins': isProduction ? [] : [
            ['react-transform', {
              'transforms': [{
                'transform': 'react-transform-hmr',
                'imports': ['react'],
                'locals': ['module'],
              }, {
                'transform': 'react-transform-catch-errors',
                'imports': ['react', 'redbox-react'],
              }],
            }],
          ],
        },
      }, { // Image/SVG loader + base64 encode + optimisation
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'url-loader?'
            + ['limit=8192', 'name=[name].[hash:6].[ext]'].join('&'),
          'image-webpack-loader?'
            + ['bypassOnDebug', 'progressive=true'].join('&'),
        ],
      }, { // WOFF loader + base64 encode
        test: /\.(woff)$/i,
        loaders: [
          'url-loader?'
            + ['limit=8192', 'name=[name].[hash:6].[ext]'].join('&'),
        ],
      }, { // Generic file loader
        test: /\.(eot|ttf|woff2|swf|mp[34]|wav)$/i,
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

    // Provide global variable to detect if clientside
    new webpack.DefinePlugin({
      __CLIENT__: true,
    }),

    // Fixes for commonly used libraries (triggered only if lib is actually used)
    new webpack.ProvidePlugin({
      'Promise': 'exports-loader?global.Promise!es6-promise', // Promise polyfill
      'window.fetch': 'exports-loader?self.fetch!whatwg-fetch', // Fetch polyfill
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]), // Disable Moment langs auto-required

    // Add any additional provide/define plugin here
  ]),
};

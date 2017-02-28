'use strict';

/**
 * Load dependencies
 */
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ExtractSVGPlugin = require('svg-sprite-loader/lib/extract-svg-plugin');
const autoprefixer = require('autoprefixer');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HappyPack = require('happypack');

const config = require('./lib/config');

/**
 * Private vars and fn
 * to customise config based on env
 */
const supportedBrowsers = ['last 3 versions', 'IE >= 11', 'Android >= 4.1'];
const isProduction = config.env === 'production';
const extractCSS = new ExtractTextPlugin({ filename: '[name].css', allChunks: true });
const extractSVG = new ExtractSVGPlugin('icons.svg');

/**
 * Main webpack config
 */
let webpackCfg = {
  devtool: isProduction ? 'source-map' : 'cheap-module-eval-source-map',
  entry: {
    // vendor: ['react'],
    app: extendEntrySources([
      path.join(config.root, 'app', 'client'),
    ]),
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
    { // JS/JSX loader + hot reload
      test: /\.jsx?$/,
      include: path.join(config.root, 'app'),
      use: [{
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: [['env', {
            targets: { browsers: supportedBrowsers },
            modules: false,
          }]],
          plugins: isProduction ? [
            'lodash',
            'transform-react-remove-prop-types',
            'transform-react-constant-elements',
            'transform-react-inline-elements',
          ] : [
            ['react-transform', {
              transforms: [
                { transform: 'react-transform-hmr', imports: ['react'], locals: ['module'] },
              ],
            }],
          ],
        },
      }],
    }, { // CSS/SASS loader + autoprefixer
      test: /\.scss$/,
      include: path.join(config.root, 'app'),
      use: extendCSSLoaders([{
        loader: 'css-loader',
        options: {
          minimize: false,
          sourceMap: true,
        },
      }, {
        loader: 'postcss-loader',
        options: {
          plugins: () => [
            autoprefixer({ browsers: supportedBrowsers }),
          ],
        },
      }, {
        loader: 'sass-loader',
        options: {
          outputStyle: 'expanded',
          sourceMap: !isProduction, // breaks build sass-loader#309
        },
      }]),
    }, { // Image/SVG loader + base64 encode + optimisation
      test: /\.(jpe?g|png|gif|svg)$/i,
      exclude: /assets\/icons/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: '[name].[hash:6].[ext]',
        },
      }, {
        loader: 'image-webpack-loader',
        options: {
          bypassOnDebug: true,
          progressive: true,
        },
      }],
    }, { // SVG Icons sprite loader
      test: /\.svg$/,
      include: [path.join(config.root, 'app', 'assets', 'icons')],
      use: extendSVGLoader([{
        loader: 'svg-sprite-loader',
        options: {
          name: 'i-[name]',
        },
      }, {
        loader: 'image-webpack-loader',
      }]),
    }, { // Generic file loader
      test: /\.(eot|ttf|woff2?|swf|mp[34]|wav)$/i,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name].[hash:6].[ext]',
        },
      }],
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
  new webpack.DefinePlugin(Object.assign({
    'process.env.NODE_ENV': JSON.stringify(config.env),
    __CLIENT__: true, // allow detection if clientside rendering
  }, pathKeys(config.client, 'CONFIG_CLIENT'))), // provide server side config vars

  // Fixes for commonly used libraries (triggered only if lib is actually used)
  new webpack.ProvidePlugin({
    'Promise': 'exports-loader?global.Promise!promise-polyfill', // IE11 Promise polyfill
    // 'window.fetch': 'exports-loader?self.fetch!whatwg-fetch', // Fetch polyfill
  }),

  // Disable Moment langs from being auto-required
  new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),

  // Add any additional provide/define plugin here
]);


function extendEntrySources (sources) {
  if (!isProduction) {
    sources.unshift('webpack-hot-middleware/client');
  }
  return sources;
}

function extendCSSLoaders (loaders) {
  if (!isProduction) {
    loaders.unshift({ loader: 'style-loader' });
    return loaders;
  }
  // move css to separate file
  return extractCSS.extract({
    fallback: 'style-loader',
    use: loaders,
    publicPath: './', // make css image urls relative
  });
}

function extendSVGLoader (loaders) {
  if (!isProduction) {
    return loaders;
  }
  return extractSVG.extract({ use: loaders });
}

function extendPlugins (plugins) {
  if (!isProduction) {
    plugins.unshift(
      new webpack.HotModuleReplacementPlugin(),
      new HappyPack({
        id: 'js', verbose: false, loaders: webpackCfg.module.rules[0].use,
      }),
      new webpack.ProvidePlugin({
        'window.reduxImmutable': 'redux-immutable-state-invariant',
      })
    );
    webpackCfg.module.rules[0].use = ['happypack/loader?id=js'];
  } else {
    plugins.push(
      extractCSS,
      extractSVG,
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

function pathKeys (obj, root) {
  return Object.keys(obj)
    .reduce((r, k) => {
      r[root + '.' + k] = JSON.stringify(obj[k]);
      return r;
    }, {});
}


module.exports = webpackCfg;

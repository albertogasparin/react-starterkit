var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var isProduction = process.env.NODE_ENV === 'production';

var NODE_SERVER_PORT = process.env.PORT || 3000;

function extendEntrySources(sources) {
  if (!isProduction) {
    sources.unshift('webpack-dev-server/client?http://localhost:8080');
    sources.unshift('webpack/hot/only-dev-server');
  }
  return sources;
}

function extendCSSLoaders (loaders) {
  if (!isProduction) {
    loaders.unshift('style-loader');
    return loaders.join('!');
  }
  // if production
  return ExtractTextPlugin.extract('style-loader', loaders.join('!'));
}

function extendPlugins(plugins) {
  plugins.push(new webpack.optimize.OccurenceOrderPlugin());

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

function extendConfig(config) {
  if (!isProduction) {
    config.debug = true;
    config.devtool = 'eval-source-map';
    config.devServer = {
      publicPath: config.output.publicPath, // 'http://0.0.0.0:8080/',
      contentBase: config.output.path, // './public',
      hot: true,
      inline: true,
      lazy: false,
      quiet: true,
      noInfo: false,
      headers: { 'Access-Control-Allow-Origin': '*' },
      stats: { colors: true },
      host: '0.0.0.0',
      proxy: {
        '*': 'http://0.0.0.0:' + NODE_SERVER_PORT,
      },
    };
  }
  return config;
}


module.exports = extendConfig({
  entry: {
    // vendor: ['react'],
    app: extendEntrySources(['./app/client']),
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss'],
  },
  stats: {
    colors: true,
    reasons: true,
  },
  output: {
    path: path.join(__dirname, 'public', 'assets'),
    publicPath: 'http://0.0.0.0:8080/assets/',
    filename: '[name].js',
    chunkFilename: '[id].[hash].js',
  },
  module: {
    preLoaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'source-map',
    }],
    loaders: [
      {
        test: /\.s?css$/,
        exclude: /(node_modules|bower_components)/,
        loader: extendCSSLoaders([
          'css-loader?'
            + ['sourceMap', (isProduction ? '' : '-') + 'minimize', '-autoprefixer'].join('&'),
          'autoprefixer-loader?'
            + ['browsers=last 3 version'].join('&'),
          'sass-loader?'
            + ['sourceMap', 'outputStyle=expanded'].join('&'),
        ]),
      }, {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loaders: [
          'react-hot-loader',
          'babel-loader',
        ],
      }, {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'url-loader?'
            + ['limit=8192', 'name=[name].[hash:6].[ext]'].join('&'),
          'image-webpack-loader?'
            + ['progressive=true'].join('&'),
        ],
      },
    ],
  },
  plugins: extendPlugins([
    new webpack.DefinePlugin({
      __CLIENT__: true,
    }),
    new webpack.ProvidePlugin({
      'Promise': 'exports-loader?global.Promise!es6-promises',
      'window.fetch': 'exports-loader?self.fetch!whatwg-fetch',
    }),
  ]),

});

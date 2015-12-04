var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var isProduction = process.env.NODE_ENV === 'production';

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
  if (!isProduction) {
    plugins.unshift(new webpack.HotModuleReplacementPlugin());
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

function extendConfig(config) {
  if (!isProduction) {
    config.debug = true;
    config.devtool = 'eval-source-map';
    config.devServer = {
      publicPath: 'http://localhost:8080/',
      contentBase: './public',
      hot: true,
      inline: true,
      lazy: false,
      quiet: true,
      noInfo: false,
      headers: { 'Access-Control-Allow-Origin': '*' },
      stats: { colors: true },
      host: 'localhost',
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
    path: __dirname + '/public',
    publicPath: '/',
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
            + ['limit=8192', 'name=assets/[name].[hash:6].[ext]'].join('&'),
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
      'Promise': 'exports?global.Promise!es6-promise',
      'window.fetch': 'exports?self.fetch!whatwg-fetch',
    }),
    // Protects against multiple React installs when npm linking
    new webpack.NormalModuleReplacementPlugin(/^react?$/, require.resolve('react')),
  ]),

});

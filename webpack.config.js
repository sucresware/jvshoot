var path = require('path')
var webpack = require('webpack')
var BrowserSyncPlugin = require('browser-sync-webpack-plugin')

module.exports = {
  entry: {
    main: [path.resolve(__dirname, 'src/main.js')],
    cordova: [path.resolve(__dirname, 'src/cordova.js')],
    facebook: [path.resolve(__dirname, 'src/facebook.js')],
    vendor: ['phaser']
  },
  mode: 'development',
  output: {
    pathinfo: true,
    path: path.resolve(__dirname, 'www/dist'),
    publicPath: './www/dist/',
    filename: '[name].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true),
      PLUGIN_FBINSTANT: JSON.stringify(true)
    }),
    new BrowserSyncPlugin({
      host: process.env.IP || 'localhost',
      port: process.env.PORT || 3000,
      server: {
        baseDir: ['./www']
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        // use: ['babel-loader'],
        loader: 'babel-loader',
        include: path.join(__dirname, 'src'),
        options: {
          presets: [
            '@babel/preset-env',
            { 'plugins': ['@babel/plugin-proposal-class-properties'] }
          ]
        }
      }
    ]
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'all'
    }
  }
}

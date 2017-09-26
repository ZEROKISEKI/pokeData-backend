import webpack from 'webpack'
import merge from 'webpack-merge'
import webpackBaseConfig from './webpack.base.conf'
import { styleLoader } from './config'
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

module.exports = merge(webpackBaseConfig, {
  entry: {
    app: [
      'eventsource-polyfill',
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
      './client/main.js'
    ]
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: styleLoader()
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    // NoErrorsPlugin被废弃了, 换用NoEmitOnErrorsPlugin
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'page.html',
      template: './views/page.html',
      inject: true
    }),
    new FriendlyErrorsPlugin()
  ]
})
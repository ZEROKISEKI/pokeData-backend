import webpack from 'webpack'
import merge from 'webpack-merge'
import webpackBaseConfig from './webpack.base.conf'
import { styleLoader } from './config'
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'

module.exports = merge(webpackBaseConfig, {
  entry: {
    app: [
      'eventsource-polyfill',
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
      './client/main.js'
    ],
    model: ['./common/model.js'],
  },
  output: {
    chunkFilename: '[name].js'
  },
  devtool: '#cheap-module-eval-source-map',
  module: {
    rules: styleLoader()
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    }),
    // TODO 利用CommonsChunkPlugin 减少app.js的大小
    // new webpack.optimize.CommonsChunkPlugin('vendors.js'),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'model',
      minChunks: Infinity
    }),
    /* new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      minChunks: function (module, count) {
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }), */
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
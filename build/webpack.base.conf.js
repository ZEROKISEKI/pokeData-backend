import path from 'path'
import {vueLoaderConfig} from './config'
import eslintFriendlyFormatter from 'eslint-friendly-formatter'

export default {
  entry: {
    app: './client/main.js',
  },
  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: '/static/',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['*', '.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.join(__dirname, '../client'),
      'proto': path.join(__dirname, '../common/model.js')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        // 强制为 preLoader
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          // 参考 eslint-loader 文档设置为 eslint-friendly-formatter
          formatter: eslintFriendlyFormatter,
          // 配置客户端 eslint 规则文件
          // eslintPath: path.join(__dirname, '../.eslintrc-client.js')
        },
        include: [
          path.join(__dirname, '../client')
        ],
        exclude: [
          path.join(__dirname, '../node_modules')
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['env', 'es2015', 'stage-2'],
          plugins: ['transform-runtime', 'syntax-dynamic-import']
        },
        include: [
          path.join(__dirname, '../client')
        ],
        exclude: [
          path.join(__dirname, '../node_modules')
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          // name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          // name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          // name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
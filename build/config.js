/**
 * 大致对于vue-loader的构建思路:
 * 首先对于js和html的部分, 一般是直接采用默认的
 * 关键在于style的模块的处理
 * style模块根据lang设置, 只要配置一个Object, 包含css,sass,scss的配置准则即可
 * 但是要分生产模式和开发模式, 在生产模式将style提取出来, 用的是extract-text-webpack-plugin
 * 在style里面, 可能import一些不是*.vue的样式文件m, 所以在webpack module rules还要配置对应
 * 样式文件的规则, 同样按照开发模式和生产模式区分
 */

import ExtractTextPlugin from 'extract-text-webpack-plugin'

const isProduction = process.env.NODE_ENV === 'production'

/**
 * 配置sourcemap:
 * 由于生产模式要用extract-text-webpack-plugin切分文件
 * 为了能让切分成功, 需要进行设置sourceMap: true
 * 而开发模式不用切分文件, 不用设置sourceMap
 */

function vueStyleLoader() {

  let sourceMap
  if (isProduction) {
    sourceMap = true
  }

  const cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: isProduction,
      sourceMap
    }
  }

  function generateLoader(loader, options) {
    const loaders = [cssLoader]
    if (loader) {
      loaders.push({
        loader,
        options: Object.assign({}, options, {sourceMap})
      })
    }
    if (isProduction) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader', ...loaders]
    }
  }

  return {
    css: generateLoader(),
    postcss: generateLoader(),
    less: generateLoader('less-loader'),
    sass: generateLoader('sass-loader', {indentedSyntax: true}),
    scss: generateLoader('sass-loader')
  }
}

export function styleLoader() {
  const output = []
  const loaders = vueStyleLoader()
  // 增加webpack处理import进去的非vue后缀的样式文件
  for (const extension in loaders) {
    output.push({
      test: new RegExp(`\.${extension}$`),
      use: loaders[extension]
    })
  }
  return output
}

export const vueLoaderConfig = {
  loaders: vueStyleLoader(),
  // https://vue-loader.vuejs.org/zh-cn/options.html
  // 转为require资源的模式, 给webpack调用loader处理
  transformToRequire: {
    video: 'src',
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
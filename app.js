import Koa from 'koa'
import logger from 'koa-logger'
import bodyParser from 'koa-better-body'
import server from 'koa-static'
import convert from 'koa-convert'
import mount from 'koa-mount'
import path from 'path'

import './common/mongodb'

import errorHandler from './middlewares/errorHandler'
import pbHandler from './middlewares/pbHandler'
import checkReq from './middlewares/checkReq'

import pokemon from './routers/pokemon'
import item from './routers/item'
import skill from './routers/skill'
import user from './routers/user'
import baseConfig from './routers/baseConfig'
import person from './routers/person'

import page from './routers/page'

const app = new Koa()

if (app.env === 'development') {

  // 开发模式配置webpack

  if (typeof process.env.NODE_ENV === 'undefined') {
    process.env.NODE_ENV = 'development'
  }

  const webpack = require('webpack')
  const { devMiddleware, hotMiddleware } = require('koa-webpack-middleware')
  const webpackConfig = require('./build/webpack.dev.conf')

  const compiler = webpack(webpackConfig)

  app.use(devMiddleware(compiler, {
    publicPath: '/static',
    quiet: true
  }))

  app.use(hotMiddleware(compiler, {
    log: false
  }))

  compiler.plugin('after-emit', (compilation, callback) => {
    // 编译内存系统输出到目录之后覆写render方法, 实现从内存读注入模板
    app.context.render = (fileName) => {
      return new Promise((resolve, reject) =>{
        const filePath = path.join(compiler.outputPath, fileName)
        const result = compiler.outputFileSystem.readFileSync(filePath) + '';
        resolve(result)
      });
    }
    callback()
  })

  app.use(mount('/public', server(path.join(__dirname, 'public'))))
} else {
  // 生产模式用koa-views从dist读取注入模板
  app.use(mount('/public', server(path.join(__dirname, 'public'))))
}

app.use(convert(bodyParser({
  buffer: true,
  // fields: 'body',
  extendTypes: {
    buffer: ['application/octet-stream']
  }
})))

app.use(logger())

// 错误处理中间件
app.use(errorHandler)

app.use(page.routes())
app.use(page.allowedMethods())

// PB请求处理中间件
app.use(pbHandler)

app.use(baseConfig.routes())
app.use(baseConfig.allowedMethods())
app.use(user.routes())
app.use(user.allowedMethods())
app.use(item.routes())
app.use(item.allowedMethods())
app.use(skill.routes())
app.use(skill.allowedMethods())
app.use(person.routes())
app.use(person.allowedMethods())
app.use(pokemon.routes())
app.use(pokemon.allowedMethods())

// 检查请求类型中间件
app.use(checkReq)

export default app
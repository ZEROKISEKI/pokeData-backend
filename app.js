import Koa from 'koa'
import logger from 'koa-logger'
import bodyParser from 'koa-better-body'
import server from 'koa-static'
import convert from 'koa-convert'
import mount from 'koa-mount'

import db from './common/mongodb'

import errorHandler from './middlewares/errorHandler'
import pokemon from './routers/pokemon'
import item from './routers/item'
import skill from './routers/skill'
import user from './routers/user'

const app = new Koa()

app.use(convert(bodyParser({
  buffer: true,
  // fields: 'body',
  extendTypes: {
    buffer: ['application/octet-stream']
  }
})))

app.use(mount('/static', server(`${__dirname}/public`)))

app.use(logger())

// 错误中间件处理
app.use(errorHandler)

app.use(user.routes())
app.use(user.allowedMethods())
app.use(item.routes())
app.use(item.allowedMethods())
app.use(skill.routes())
app.use(skill.allowedMethods())
app.use(pokemon.routes())
app.use(pokemon.allowedMethods())


export default app
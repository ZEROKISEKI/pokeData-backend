import protobuf from 'protobufjs/minimal'

export default async function (ctx, next) {
  // 抛出错误
  try {
    await next()
  } catch (err) {
    if (err.status === 200) {
      return
    }
    if (err.status === 401) {
      return ctx.throw(401, '请先进行登录!')
    }

    if (err.status === 405) {
      return ctx.throw(405, err.message)
    }

    if (err instanceof protobuf.util.ProtocolError) {
      return ctx.throw(403, err.message)
    }

    if (!err.errors) {
      ctx.throw(404, err.message)
    } else {
      // 抛出数据库检测错误
      let result = ''
      for (const error of Object.getOwnPropertyNames(err.errors)) {
        result += `${err.errors[error].message}\n`
      }
      ctx.throw(500, result)
    }
  }
}
import { PokeData } from '../common/model'
import protobuf from 'protobufjs/minimal'

export default async function pbHandler(ctx, next) {

  ctx.pb = {}

  if (ctx.method === 'GET') {

    if (ctx.querystring) {
      // 解码base64数据取得buffer
      const buffer = protobuf.util.newBuffer(protobuf.util.base64.length(ctx.querystring))
      protobuf.util.base64.decode(ctx.querystring, buffer, 0)

      ctx.pb.req = PokeData.PBMessageReq.decode(buffer)
      ctx.pb.msgType = ctx.pb.req.messageType
    }

  } else if (ctx.method === 'POST') {
    ctx.body = ctx.request.body

    ctx.pb.req = PokeData.PBMessageReq.decode(ctx.body)
    ctx.pb.msgType = ctx.pb.req.messageType

  } else {
    ctx.status = 405
    throw new Error('请求方法有误!')
  }

  await next()
}
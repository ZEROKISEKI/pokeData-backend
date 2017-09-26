export default async function checkReq(ctx, next) {

  if (ctx.pb.msgType !== ctx.msgType) {
    throw new Error('请求消息类型错误! 请检查消息类型!')
  }

  await next()
}
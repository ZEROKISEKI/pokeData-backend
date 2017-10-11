import axios from 'axios'
import { PokeData } from '../../common/model'
import protobuf from 'protobufjs/minimal'
import 'text-encoding'

axios.interceptors.response.use(null, (err) => {
  // const encoding = {}
  // 由于数据传输采用arraybuffer(PB数据), 错误数据用了string, 所以要进行转换
  // TODO 增加PB Error类型, 替换TextDecoder
  console.log('查看错误', err.response)
  err.message = new TextDecoder().decode(new Uint8Array(err.response.data))
  return Promise.reject(err)
})

// 客户端封装PB数据请求交互处理
export default async function (url, messageType, requestBody, responseType, method = 'get') {

  let req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
    requestBody,
    messageType
  })).finish()

  const token = localStorage.getItem('jwt')
  const headers = {
    'Content-Type': 'application/octet-stream',
    'Accept': 'application/octet-stream'
  }
  if (token) {
    headers['authorization'] = `Bearer ${token}`
  }

  if (method === 'get') {
    req = protobuf.util.base64.encode(req, 0, req.length)
    url = `${url}?${req}`
  }

  const request = {
    method,
    url,
    headers,
    responseType: 'arraybuffer'
  }

  if (method === 'post') {
    request.data = req
    request.transformRequest = [(data, headers) => {
      return data
    }]
  }

  const res = await axios(request)

  if (messageType === PokeData.PBMessageType.USER_LOGIN) {
    const token = res.headers['authorization'].split(' ')[1]
    if (token) {
      localStorage.setItem('jwt', token)
    }
  }

  const response = PokeData.PBMessageRes.decode(new Uint8Array(res.data))

  // 如果有请求返回数据PB类型, 则解析messageData并返回
  if (responseType && PokeData[responseType]) {
    const messageData = PokeData[responseType]
      .toObject(PokeData[responseType].decode(new Uint8Array(response.messageData)), {
        defaults: true
      })
    // string设置为"" decode是有的, 而不带属性(default会变成"") decode是不带的
    // TODO 遍历属性
    return messageData
  }
}
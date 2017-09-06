import { PokeData } from './model'

export function handleRequest (messageType, body, requestType) {

  const requestBody = PokeData[requestType].encode(new PokeData[requestType](body)).finish()
  const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
	messageType: PokeData.PBMessageType[messageType],
	requestBody
  })).finish()

  return req
}

export function handleResponse (body) {
  return PokeData.PBMessageRes.decode(body)
}
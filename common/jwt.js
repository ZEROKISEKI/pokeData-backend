import jsonWebToken from 'jsonwebtoken'
import { jwt } from "../config"

export function sign(payload, opts = {}) {
  return jsonWebToken.sign(payload, jwt.secret, opts)
}


export function decode(token, opts = {}) {

  try {
	jsonWebToken.verify(token, jwt.secret, opts)

	const decoded = jsonWebToken.decode(token, {
	  complete: true
	})

    return decoded

  } catch (err) {
	throw new Error('用户认证已经失效！请重新登录认证!')
  }

}
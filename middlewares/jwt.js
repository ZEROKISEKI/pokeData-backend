import koaJwt from 'koa-jwt'
import { jwt } from "../config"

export default function (unless) {
  return koaJwt({
	secret: jwt.secret
  }).unless(unless)
}
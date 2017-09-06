import { expect } from 'chai'
import request from 'supertest'
import server from '../../bin/www'
import { PokeData } from '../../common/model'
import { decode } from '../../common/jwt'

describe('User', () => {
  it('测试账号注册', (done) => {

    const body = {
	  username: 'sora1',
	  password: '123456',
	  // inviteCode: '123456'
	}

	const requestBody = PokeData.PBUserReq.encode(new PokeData.PBUserReq(body)).finish()
	const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
	  messageType: PokeData.PBMessageType.USER_REGISTER,
	  requestBody
	})).finish()

    request(server)
	  .post('/user/register')
	  .set('Content-Type', 'application/octet-stream')
	  .send(req)
	  .expect(200)
	  .end((err, res) => {
      	if (err) {
		  done(err)
		  return
		}

		done()
	  })
  })

  it.only('测试账号登录', (done) => {
    const body = {
      username: 'sora1',
	  password: '123456'
	}

	const requestBody = PokeData.PBUserReq.encode(new PokeData.PBUserReq(body)).finish()
	const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
	  messageType: PokeData.PBMessageType.USER_LOGIN,
	  requestBody
	})).finish()

	request(server)
	  .post('/user/login')
	  .set('Content-Type', 'application/octet-stream')
	  .send(req)
	  .expect(200)
	  .end((err, res) => {

      	if (err) {
      	  done(err)
		  return
		}

		const response = PokeData.PBMessageRes.decode(res.body)

		const messageData = PokeData.PBUser.decode(response.messageData)
		decode(res.headers['authorization'].split(' ')[1])

		done()
	  })
  })

})
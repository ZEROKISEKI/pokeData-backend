import {expect} from 'chai'
import request from 'supertest'
import server from '../../bin/www'
import {PokeData} from '../../common/model'
import {decode} from '../../common/jwt'
import protobuf from 'protobufjs/minimal'

describe('User', () => {
  it('测试账号注册', (done) => {

    const body = {
      username: 'mocha',
      password: '4261530520',
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

  it('测试账号登录', (done) => {
    const body = {
      username: 'mocha',
      password: '4261530520'
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
        console.log(res.headers['authorization'].split(' ')[1])
        decode(res.headers['authorization'].split(' ')[1])

        done()
      })
  })

  it('测试获取全部用户', (done) => {

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE1LCJ1c2VybmFtZSI6InNvcmExIiwiYXZhdGFyIjpudWxsLCJsYXN0TG9naW5UaW1lIjoiMjAxNy0wOS0wNlQwNzozODo0My45MTVaIiwicm9sZSI6MSwiaWF0IjoxNTA0NjgzNTIzfQ.tFv816xJSAOM8lYG7YmnXdYfp_5LwesnLWSYyOmdmv4'

    const requestBody = PokeData.PBListReq.encode(new PokeData.PBListReq({
      offset: 0,
      limit: 20
    })).finish()

    const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
      messageType: PokeData.PBMessageType.GET_ALL_USERS,
      requestBody
    })).finish()

    const base64Req = protobuf.util.base64.encode(req, 0, req.length)

    request(server)
      .get('/user/all')
      .set('Content-Type', 'application/octet-stream')
      .set('authorization', `Bearer ${token}`)
      .query(base64Req)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err)
          return
        }

        const response = PokeData.PBMessageRes.decode(res.body)
        const messageData = PokeData.PBUserList.decode(response.messageData)

        // console.log(PokeData.PBUserList.toObject(messageData))

        done()
      })
  })

  it('测试根据ID获取用户', (done) => {

    const id = 14
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE1LCJ1c2VybmFtZSI6InNvcmExIiwiYXZhdGFyIjpudWxsLCJsYXN0TG9naW5UaW1lIjoiMjAxNy0wOS0wNlQwNzozODo0My45MTVaIiwicm9sZSI6MSwiaWF0IjoxNTA0NjgzNTIzfQ.tFv816xJSAOM8lYG7YmnXdYfp_5LwesnLWSYyOmdmv4'

    const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
      messageType: PokeData.PBMessageType.GET_USER_BY_ID
    })).finish()

    const base64Req = protobuf.util.base64.encode(req, 0, req.length)

    request(server)
      .get(`/user/${id}`)
      .set('Content-Type', 'application/octet-stream')
      .set('authorization', `Bearer ${token}`)
      .query(base64Req)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err)
          return
        }

        const response = PokeData.PBMessageRes.decode(res.body)
        const messageData = PokeData.PBUser.decode(response.messageData)

        console.log(messageData)

        done()
      })
  })

  it('测试修改账号', (done) => {

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJ1c2VybmFtZSI6Im1vZSIsImF2YXRhciI6bnVsbCwibGFzdExvZ2luVGltZSI6IjIwMTctMDktMDZUMTQ6MTM6MzUuMzY1WiIsInJvbGUiOjEsImlhdCI6MTUwNDcwNzIxNX0.7-q2T0WdbyRpYSUIStjTLka98psoVxrWre_jI10EFdg'

    const body = {
      userId: 16,
      isLocked: false,
      role: PokeData.PBUserRole.SUPER_ADMIN
    }

    const requestBody = PokeData.PBUser.encode(new PokeData.PBUser(body)).finish()
    const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
      messageType: PokeData.PBMessageType.UPDATE_USER_BY_ID,
      requestBody,
      requestTime: Date.now()
    })).finish()

    request(server)
      .post(`/user/${body.userId}`)
      .set('Content-Type', 'application/octet-stream')
      .set('authorization', `Bearer ${token}`)
      .send(req)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err)
          return
        }

        const response = PokeData.PBMessageRes.decode(res.body)
        const messageData = PokeData.PBUser.decode(response.messageData)

        // console.log(messageData)

        done()
      })

  })

  it('测试添加新账号', (done) => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE1LCJ1c2VybmFtZSI6InNvcmExIiwiYXZhdGFyIjpudWxsLCJsYXN0TG9naW5UaW1lIjoiMjAxNy0wOS0wNlQwNzozODo0My45MTVaIiwicm9sZSI6MSwiaWF0IjoxNTA0NjgzNTIzfQ.tFv816xJSAOM8lYG7YmnXdYfp_5LwesnLWSYyOmdmv4'

    const body = {
      username: 'moe',
      password: 'CJG.15521117213',
    }

    const requestBody = PokeData.PBUser.encode(new PokeData.PBUser(body)).finish()
    const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
      messageType: PokeData.PBMessageType.ADD_USER,
      requestBody,
      requestTime: Date.now()
    })).finish()

    request(server)
      .post('/user/add')
      .set('Content-Type', 'application/octet-stream')
      .set('authorization', `Bearer ${token}`)
      .send(req)
      .expect(200)
      .end((err, res) => {

        if (err) {
          done(err)
          return
        }

        const response = PokeData.PBMessageRes.decode(res.body)

        done()
      })

  })

  it('测试删除账号', (done) => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE1LCJ1c2VybmFtZSI6InNvcmExIiwiYXZhdGFyIjpudWxsLCJsYXN0TG9naW5UaW1lIjoiMjAxNy0wOS0wNlQwNzozODo0My45MTVaIiwicm9sZSI6MSwiaWF0IjoxNTA0NjgzNTIzfQ.tFv816xJSAOM8lYG7YmnXdYfp_5LwesnLWSYyOmdmv4'

    const id = 15

    const requestBody = PokeData.PBIdObject.encode(new PokeData.PBIdObject({id})).finish()
    const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
      requestBody,
      messageType: PokeData.PBMessageType.REMOVE_USER,
      requestTime: Date.now()
    })).finish()

    request(server)
      .post('/user/remove')
      .set('Content-Type', 'application/octet-stream')
      .set('authorization', `Bearer ${token}`)
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

  it('测试获取个人信息', (done) => {

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0LCJ1c2VybmFtZSI6ImFvbm9zb3JhIiwiYXZhdGFyIjpudWxsLCJsYXN0TG9naW5UaW1lIjoiMjAxNy0wOS0wOVQxNDo1NToxNC45MjFaIiwicm9sZSI6MSwiaWF0IjoxNTA0OTY4OTE0fQ.friljVLqpBfSMSdXOYbBX-Pc-8bVs5FaCDrMPQSUlL4'

    const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
      messageType: PokeData.PBMessageType.GET_USER_BY_ID,
      requestTime: Date.now()
    })).finish()

    const base64Req = protobuf.util.base64.encode(req, 0, req.length)

    request(server)
      .get('/user/setting')
      .set('Content-Type', 'application/octet-stream')
      .set('authorization', `Bearer ${token}`)
      .query(base64Req)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err)
          return
        }

        const response = PokeData.PBMessageRes.decode(res.body)
        const messageData = PokeData.PBUser.decode(response.messageData)

        console.log(messageData)

        done()
      })
  })

  it('测试修改个人信息', (done) => {

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJ1c2VybmFtZSI6Im1vZSIsImF2YXRhciI6bnVsbCwibGFzdExvZ2luVGltZSI6IjIwMTctMDktMDZUMTQ6MTM6MzUuMzY1WiIsInJvbGUiOjEsImlhdCI6MTUwNDcwNzIxNX0.7-q2T0WdbyRpYSUIStjTLka98psoVxrWre_jI10EFdg'

    const body = {
      userId: 16,
      isLocked: false
      // username: 'mocha',
      // password: '4261530520'
    }

    const requestBody = PokeData.PBUser.encode(new PokeData.PBUser(body)).finish()
    const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
      requestBody,
      messageType: PokeData.PBMessageType.UPDATE_USER_BY_ID,
      requestTime: Date.now()
    })).finish()

    request(server)
      .post('/user/setting')
      .set('Content-Type', 'application/octet-stream')
      .set('authorization', `Bearer ${token}`)
      .send(req)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err)
          return
        }

        const response = PokeData.PBMessageRes.decode(res.body)
        const messageData = PokeData.PBUser.decode(response.messageData)

        console.log(messageData)

        done()

      })

  })

})
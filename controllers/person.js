import * as model from '../models'
import {PokeData} from '../common/model'
import {dateToTime} from '../utils/moment'
import {decode} from '../common/jwt'

class Person {

  static async getAllPersons(ctx, next) {
    ctx.msgType = PokeData.PBMessageType.GET_PERSONS
    await next()
    const req = ctx.pb.req
    const {offset = 0, limit = 20, visible} = PokeData.PBListReq.toObject(PokeData.PBListReq.decode(req.requestBody))
    const persons = await model.Person
      .find()
      .select({
        '_id': 0,
        '__v': 0,
      })
      .skip(offset)
      .limit(limit)
      .exec()
    let data = persons.map(person => new PokeData.PBPerson(Object.assign({}, JSON.parse(JSON.stringify(person)), {
      createTime: dateToTime(person.createTime),
      modifyTime: person.modifyTime ? dateToTime(person.modifyTime) : null
    })))

    if (typeof visible !== 'undefined') {
      data = data.filter(item => item.visible === visible)
    }

    const messageData = PokeData.PBPersonList.encode(new PokeData.PBPersonList({
      persons: data,
      offset,
      limit
    })).finish()
    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      messageData,
      responseTime: Date.now()
    })).finish()
    ctx.response.body = res
  }

  static async getPersonById(ctx, next) {
    ctx.msgType = PokeData.PBMessageType.GET_PERSON_BY_ID
    await next()
    const req = ctx.pb.req
    const {id} = PokeData.PBIdObject.toObject(PokeData.PBIdObject.decode(req.requestBody))
    const person = await model.Person
      .findOne({personId: id})
      .select({
        '_id': 0,
        '__v': 0
      })
      .exec()
    if (!person) {
      throw new Error('目标不存在!')
    }
    const messageData = PokeData.PBPerson
      .encode(new PokeData.PBPerson(Object.assign({}, JSON.parse(JSON.stringify(person)), {
        createTime: dateToTime(person.createTime),
        modifyTime: person.modifyTime ? dateToTime(person.modifyTime) : null
      }))).finish()
    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      messageData,
      responseTime: Date.now()
    })).finish()

    ctx.response.body = res
  }

  static async addPerson(ctx, next) {
    if (ctx.state.user.role === PokeData.PBUserRole.NORMAL_USER) {
      ctx.status = 401
      throw new Error('普通用户不可进行此操作!')
    }
    ctx.msgType = PokeData.PBMessageType.ADD_PERSON
    await next()
    const req = ctx.pb.req
    const requestBody = PokeData.PBPerson.toObject(PokeData.PBPerson.decode(req.requestBody))

    const person = new model.Person(Object.assign({
      createTime: Date.now()
    }, requestBody))

    await person.validate()
    await person.save()

    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      responseTime: Date.now()
    })).finish()

    ctx.response.body = res
  }

  static async removePerson(ctx, next) {
    if (ctx.state.user.role === PokeData.PBUserRole.NORMAL_USER) {
      ctx.status = 401
      throw new Error('普通用户不可进行此操作!')
    }
    ctx.msgType = PokeData.PBMessageType.REMOVE_PERSON
    await next()
    const req = ctx.pb.req
    const {id} = PokeData.PBIdObject.toObject(PokeData.PBIdObject.decode(req.requestBody))
    const {result} = await model.Person.remove({personId: id}).exec()
    if (!result.n) {
      throw new Error('目标人物不存在!')
    }

    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      responseTime: Date.now()
    })).finish()

    ctx.response.body = res
  }

  static async updatePerson(ctx, next) {
    let token
    if (!ctx.headers['authorization']) {
      ctx.status = 401
      throw new Error('无权进行此操作!')
    }
    token = ctx.headers['authorization'].split(' ')[1]
    if (!token) {
      ctx.status = 401
      throw new Error('不正确的身份认证!')
    }
    const {payload: {role}} = decode(token)
    if (role === PokeData.PBUserRole.NORMAL_USER) {
      ctx.status = 401
      throw new Error('普通用户不可进行此操作!')
    }

    ctx.msgType = PokeData.PBMessageType.UPDATE_PERSON
    await next()
    const req = ctx.pb.req
    const requestBody = PokeData.PBPerson.decode(req.requestBody)
    const {id} = ctx.params
    const oldPerson = await model.Person
      .findOne({personId: +id})
      .select({'_id': 0, '__v': 0, 'createTime': 0})
      .exec()

    if (!oldPerson) {
      throw new Error('目标不存在!')
    }

    // 采用toObject方法会出现空数组丢失问题, 换用Object.assign
    const data = Object.assign({}, requestBody)

    if (data.personId) {
      delete data.personId
    }
    if (data.createTime) {
      delete data.createTime
    }
    data.modifyTime = Date.now()
    const result = await model.Person.update({
      personId: +id
    }, {$set: data}).exec()

    if (!result.n) {
      throw new Error('修改人物失败! 请重新尝试!')
    }

    const messageData = PokeData.PBPerson
      .encode(new PokeData.PBPerson(Object.assign({}, JSON.parse(JSON.stringify(oldPerson)), data, {
        createTime: dateToTime(oldPerson.createTime)
      }))).finish()
    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      messageData,
      responseTime: Date.now()
    })).finish()

    ctx.response.body = res
  }

  // TODO 完成搜索人物接口
  static async searchPersons(ctx, next) {

  }
}

export default Person
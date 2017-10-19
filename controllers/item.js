import * as model from '../models'
import {PokeData} from '../common/model'
import {dateToTime} from '../utils/moment'

class Item {

  // 获取道具
  static async getItems(ctx, next) {

    ctx.msgType = PokeData.PBMessageType.GET_ITEMS
    await next()
    const req = ctx.pb.req
    const requestBody = PokeData.PBListReq.toObject(PokeData.PBListReq.decode(req.requestBody))

    let items = await model.Item
      .find()
      .select({
        '__v': 0, '_id': 0,
        'obtain.one._id': 0, 'obtain.one.version._id': 0,
        'obtain.repeat._id': 0, 'obtain.repeat.version._id': 0
      })
      .skip(requestBody.offset)
      .limit(requestBody.limit)
      .exec()

    let data = JSON.parse(JSON.stringify(items))

    // 解决日期字符串不转为时间戳在数组上报错的问题
    data = data.map(item => {
      item.createTime = dateToTime(item.createTime) || null
      item.modifyTime = item.modifyTime ? dateToTime(item.modifyTime) : item.modifyTime
      return new PokeData.PBItem(item)
    })

    if (typeof requestBody.visible !== 'undefined') {
      data = data.filter(item => item.visible === requestBody.visible)
    }

    const messageData = PokeData.PBItemList.encode(new PokeData.PBItemList({
      items: data,
      offset: requestBody.offset,
      limit: requestBody.limit
    })).finish()

    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      messageData,
      responseTime: Date.now()
    })).finish()

    ctx.response.body = res

  }

  // 根据ID获取道具
  static async getItemById(ctx, next) {
    ctx.msgType = PokeData.PBMessageType.GET_ITEM_BY_ID
    await next()
    const req = ctx.pb.req
    const {id} = PokeData.PBIdObject.toObject(PokeData.PBIdObject.decode(req.requestBody))

    const item = await model.Item
      .findOne({itemId: id})
      .select({'__v': 0, '_id': 0, 'createTime': 0})
      .exec()

    if (!item) {
      throw new Error('道具不存在!')
    }

    // 转成JSON字符串, 解决嵌套对象携带ObjectId或者迭代产生ObjectId的问题
    const data = JSON.parse(JSON.stringify(item))

    const messageData = PokeData.PBItem
      .encode(new PokeData.PBItem(Object.assign({}, data, {
        modifyTime: dateToTime(data.modifyTime)
      }))).finish()
    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      messageData,
      responseTime: Date.now()
    })).finish()

    ctx.response.body = res
  }

  // TODO 搜索道具接口
  static async searchItems(ctx, next) {
    ctx.msgType = PokeData.PBMessageType.SEARCH_ITEMS
    await next()
    const req = ctx.pb.req
  }

  // 修改道具(仅限管理员和超级管理员)
  static async updateItem(ctx, next) {
    if (ctx.state.user.role === PokeData.PBUserRole.NORMAL_USER) {
      ctx.status = 401
      throw new Error('普通用户不可进行此操作!')
    }
    ctx.msgType = PokeData.PBMessageType.UPDATE_ITEM
    await next()
    const req = ctx.pb.req
    const requestBody = PokeData.PBItem.decode(req.requestBody)
    const {id} = ctx.params

    const oldItem = await model.Item
      .findOne({itemId: +id})
      .select({'_id': 0, '__v': 0, 'createTime': 0})
      .exec()

    if (!oldItem) {
      throw new Error('目标道具不存在!')
    }

    const data = Object.assign({}, requestBody)
    if (data.itemId) {
      delete data.itemId
    }
    data.modifyTime = Date.now()
    const modify = await model.Item.update({
      itemId: +id
    }, {$set: data}).exec()

    if (!modify.n) {
      throw new Error('修改道具失败! 请重新尝试!')
    }

    const messageData = PokeData.PBItem
      .encode(new PokeData.PBItem(Object.assign({}, JSON.parse(JSON.stringify(oldItem)), data))).finish()
    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      messageData,
      responseTime: Date.now()
    })).finish()

    ctx.response.body = res
  }

  // 添加道具(仅限管理员和超级管理员)
  static async addItem(ctx, next) {
    if (ctx.state.user.role === PokeData.PBUserRole.NORMAL_USER) {
      ctx.status = 401
      throw new Error('普通用户不可进行此操作!')
    }

    ctx.msgType = PokeData.PBMessageType.ADD_ITEM
    await next()
    const req = ctx.pb.req
    const requestBody = PokeData.PBItem.toObject(PokeData.PBItem.decode(req.requestBody))

    const item = new model.Item(Object.assign({
      visible: true,
    }, requestBody, {
      createTime: Date.now()
    }))

    await item.validate()
    await item.save()

    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      responseTime: Date.now()
    })).finish()

    ctx.response.body = res
  }

  // 删除道具(仅限管理员和超级管理员)
  static async removeItem(ctx, next) {
    if (ctx.state.user.role === PokeData.PBUserRole.NORMAL_USER) {
      ctx.status = 401
      throw new Error('普通用户不可进行此操作!')
    }

    ctx.msgType = PokeData.PBMessageType.REMOVE_ITEM
    await next()
    const req = ctx.pb.req
    const {id} = PokeData.PBIdObject.toObject(PokeData.PBIdObject.decode(req.requestBody))


    const result = await model.Item.remove({itemId: id}).exec()

    if (!result.result.n) {
      throw new Error('目标道具不存在!')
    }

    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      responseTime: Date.now()
    })).finish()

    ctx.response.body = res
  }
}

export default Item
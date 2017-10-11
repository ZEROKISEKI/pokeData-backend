import * as model from '../models'
import {PokeData} from '../common/model'
import {dateToTime} from '../utils/moment'
import {decode} from '../common/jwt'

class BaseConfig {

  static async getVersions(ctx, next) {
    ctx.msgType = PokeData.PBMessageType.GET_VERSIONS
    await next()

    let token

    if (ctx.headers['authorization']) {
      token = ctx.headers['authorization'].split(' ')[1]
      // 进行token认证
      decode(token)
    }

    const versions = await model.Version
      .find()
      .select({
        '_id': 0,
        '__v': 0
      }).exec()

    // TODO 根据有没有token返回不同的结果
    const data = versions.map(version => new PokeData.PBVersion({
      versionId: version.versionId,
      name: version.name,
      abstr: version.abstr,
      generation: version.generation,
      background: version.color.background,
      font: version.color.font,
      createTime: dateToTime(version.createTime),
      modifyTime: version.modifyTime ? dateToTime(version.modifyTime) : null
    })) || []

    const messageData = PokeData.PBVersionList.encode(new PokeData.PBVersionList({
      versions: data
    })).finish()
    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      messageData,
      responseTime: Date.now()
    })).finish()

    ctx.response.body = res
  }

  static async getVersionById(ctx, next) {
    ctx.msgType = PokeData.PBMessageType.GET_VERSION_BY_ID
    await next()
    const req = ctx.pb.req
    const {id} = PokeData.PBIdObject.toObject(PokeData.PBIdObject.decode(req.requestBody))
    const version = await model.Version
      .findOne({versionId: id})
      .select({
        '_id': 0,
        '__v': 0
      })
      .exec()
    if (!version) {
      throw new Error('目标不存在!')
    }
    const data = JSON.parse(JSON.stringify(version))
    data.background = data.color.background
    data.font = data.color.font
    delete data.color
    const messageData = PokeData.PBVersion
      .encode(new PokeData.PBVersion(Object.assign({}, data, {
        createTime: dateToTime(version.createTime),
        modifyTime: version.modifyTime ? dateToTime(version.modifyTime) : null
      }))).finish()
    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      messageData,
      responseTime: Date.now()
    })).finish()

    ctx.response.body = res
  }

  static async addVersion(ctx, next) {

    if (ctx.state.user.role === PokeData.PBUserRole.NORMAL_USER) {
      ctx.status = 401
      throw new Error('普通用户不可进行此操作!')
    }

    ctx.msgType = PokeData.PBMessageType.ADD_VERSION
    await next()
    const req = ctx.pb.req
    const requestBody = PokeData.PBVersion.toObject(PokeData.PBVersion.decode(req.requestBody))
    const data = Object.assign({color: {}}, requestBody)
    if (typeof data.background !== 'undefined') {
      data.color.background = data.background
      delete data.background
    }
    if (typeof data.font !== 'undefined') {
      data.color.font = data.font
      delete data.font
    }
    const version = new model.Version(data)
    await version.validate()
    await version.save()

    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      responseTime: Date.now()
    })).finish()

    ctx.response.body = res
  }

  static async removeVersion(ctx, next) {

    if (ctx.state.user.role === PokeData.PBUserRole.NORMAL_USER) {
      ctx.status = 401
      throw new Error('普通用户不可进行此操作!')
    }

    ctx.msgType = PokeData.PBMessageType.REMOVE_VERSION
    await next()
    const req = ctx.pb.req
    const {id} = PokeData.PBIdObject.toObject(PokeData.PBIdObject.decode(req.requestBody))

    const {result} = await model.Version.remove({versionId: id}).exec()
    if (!result.n) {
      throw new Error('目标不存在!')
    }

    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      responseTime: Date.now()
    })).finish()

    ctx.response.body = res
  }

  static async updateVersion(ctx, next) {

    if (ctx.state.user.role === PokeData.PBUserRole.NORMAL_USER) {
      ctx.status = 401
      throw new Error('普通用户不可进行此操作!')
    }

    ctx.msgType = PokeData.PBMessageType.UPDATE_VERSION
    await next()
    const req = ctx.pb.req
    const requestBody = PokeData.PBVersion.toObject(PokeData.PBVersion.decode(req.requestBody))
    const {id} = ctx.params

    const oldVersion = await model.Version.findOne({
      versionId: +id
    }).select({
      '_id': 0,
      '__v': 0,
      'createTime': 0
    }).exec()

    if (!oldVersion) {
      throw new Error('目标不存在!')
    }

    requestBody.modifyTime = Date.now()
    const data = Object.assign({}, requestBody)
    if (typeof data.background !== 'undefined') {
      data['color.background'] = data.background
      delete data.background
    }
    if (typeof data.font !== 'undefined') {
      data['color.font'] = data.font
      delete data.font
    }
    const result = await model.Version.update({
      versionId: +id
    }, {$set: data}).exec()

    if (!result.n) {
      throw new Error('修改失败! 请重新尝试!')
    }

    const oldData = JSON.parse(JSON.stringify(oldVersion))
    if (oldData.color) {
      delete oldData.color
    }

    const messageData = PokeData.PBVersion
      .encode(new PokeData.PBVersion(Object.assign({}, oldData, requestBody))).finish()
    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      messageData,
      responseTime: Date.now()
    })).finish()

    ctx.response.body = res
  }

  static async getEggGroups(ctx, next) {
    ctx.msgType = PokeData.PBMessageType.GET_EGGGROUPS
    await next()

    const eggGroups = await model.EggGroup
      .find()
      .select({
        '_id': 0,
        '__v': 0
      }).exec()

    const data = eggGroups.map(eggGroup => new PokeData.PBEggGroup({
      eggGroupId: eggGroup.eggGroupId,
      name: eggGroup.name,
      background: eggGroup.color.background,
      border: eggGroup.color.border,
      createTime: dateToTime(eggGroup.createTime),
      modifyTime: eggGroup.modifyTime ? dateToTime(eggGroup.modifyTime) : null
    })) || []

    const messageData = PokeData.PBEggGroupList.encode(new PokeData.PBEggGroupList({
      eggGroups: data
    })).finish()
    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      messageData,
      responseTime: Date.now()
    })).finish()

    ctx.response.body = res
  }

  static async getEggGroupById(ctx, next) {
    ctx.msgType = PokeData.PBMessageType.GET_EGGGROUP_BY_ID
    await next()
    const req = ctx.pb.req
    const {id} = PokeData.PBIdObject.toObject(PokeData.PBIdObject.decode(req.requestBody))
    const eggGroup = await model.EggGroup
      .findOne({eggGroupId: id})
      .select({
        '_id': 0,
        '__v': 0
      })
      .exec()
    if (!eggGroup) {
      throw new Error('目标不存在!')
    }
    const messageData = PokeData.PBEggGroup
      .encode(new PokeData.PBEggGroup(Object.assign({}, JSON.parse(JSON.stringify(eggGroup)), {
        createTime: dateToTime(eggGroup.createTime),
        modifyTime: eggGroup.modifyTime ? dateToTime(eggGroup.modifyTime) : null
      }))).finish()
    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      messageData,
      responseTime: Date.now()
    })).finish()

    ctx.response.body = res
  }

  static async addEggGroup(ctx, next) {

    if (ctx.state.user.role === PokeData.PBUserRole.NORMAL_USER) {
      ctx.status = 401
      throw new Error('普通用户不可进行此操作!')
    }

    ctx.msgType = PokeData.PBMessageType.ADD_EGGGROUP
    await next()
    const req = ctx.pb.req
    const requestBody = PokeData.PBEggGroup.toObject(PokeData.PBEggGroup.decode(req.requestBody))
    const data = Object.assign({color: {}}, requestBody)
    if (typeof data.background !== 'undefined') {
      data.color.background = data.background
      delete data.background
    }
    if (typeof data.border !== 'undefined') {
      data.color.border = data.border
      delete data.border
    }
    const eggGroup = new model.EggGroup(data)
    await eggGroup.validate()
    await eggGroup.save()

    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      responseTime: Date.now()
    })).finish()

    ctx.response.body = res
  }

  static async removeEggGroup(ctx, next) {
    if (ctx.state.user.role === PokeData.PBUserRole.NORMAL_USER) {
      ctx.status = 401
      throw new Error('普通用户不可进行此操作!')
    }

    ctx.msgType = PokeData.PBMessageType.REMOVE_EGGGROUP
    await next()
    const req = ctx.pb.req
    const {id} = PokeData.PBIdObject.toObject(PokeData.PBIdObject.decode(req.requestBody))

    const {result} = await model.EggGroup.remove({eggGroupId: id}).exec()
    if (!result.n) {
      throw new Error('目标不存在!')
    }

    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      responseTime: Date.now()
    })).finish()

    ctx.response.body = res
  }

  static async updateEggGroup(ctx, next) {

    if (ctx.state.user.role === PokeData.PBUserRole.NORMAL_USER) {
      ctx.status = 401
      throw new Error('普通用户不可进行此操作!')
    }

    ctx.msgType = PokeData.PBMessageType.UPDATE_EGGGROUP
    await next()
    const req = ctx.pb.req
    const requestBody = PokeData.PBEggGroup.toObject(PokeData.PBEggGroup.decode(req.requestBody))
    const {id} = ctx.params

    const oldEggGroup = await model.EggGroup.findOne({
      eggGroupId: +id
    }).select({
      '_id': 0,
      '__v': 0,
      'createTime': 0
    }).exec()

    if (!oldEggGroup) {
      throw new Error('目标不存在!')
    }

    requestBody.modifyTime = Date.now()
    const data = Object.assign({}, requestBody)
    if (typeof data.background !== 'undefined') {
      data['color.background'] = data.background
      delete data.background
    }
    if (typeof data.border !== 'undefined') {
      data['color.border'] = data.border
      delete data.border
    }
    const result = await model.EggGroup.update({
      eggGroupId: +id
    }, {$set: data}).exec()

    if (!result.n) {
      throw new Error('修改失败! 请重新尝试!')
    }

    const messageData = PokeData.PBEggGroup
      .encode(new PokeData.PBEggGroup(Object.assign({}, JSON.parse(JSON.stringify(oldEggGroup)), requestBody))).finish()
    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      messageData,
      responseTime: Date.now()
    })).finish()

    ctx.response.body = res
  }

  static async getProperties(ctx, next) {
    ctx.msgType = PokeData.PBMessageType.GET_PROPERTIES
    await next()

    const properties = await model.Property
      .find()
      .select({
        '_id': 0,
        '__v': 0
      }).exec()

    const data = properties.map(property => new PokeData.PBProperty({
      propertyId: property.propertyId,
      name: property.name,
      background: property.color.background,
      border: property.color.border,
      createTime: dateToTime(property.createTime),
      modifyTime: property.modifyTime ? dateToTime(property.modifyTime) : null
    })) || []

    const messageData = PokeData.PBPropertyList.encode(new PokeData.PBPropertyList({
      properties: data
    })).finish()
    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      messageData,
      responseTime: Date.now()
    })).finish()

    ctx.response.body = res
  }

  static async getPropertyById(ctx, next) {
    ctx.msgType = PokeData.PBMessageType.GET_PROPERTY_BY_ID
    await next()
    const req = ctx.pb.req
    const {id} = PokeData.PBIdObject.toObject(PokeData.PBIdObject.decode(req.requestBody))
    const property = await model.Property
      .findOne({propertyId: id})
      .select({
        '_id': 0,
        '__v': 0
      })
      .exec()
    if (!property) {
      throw new Error('目标不存在!')
    }
    const messageData = PokeData.PBProperty
      .encode(new PokeData.PBProperty(Object.assign({}, JSON.parse(JSON.stringify(property)), {
        createTime: dateToTime(property.createTime),
        modifyTime: property.modifyTime ? dateToTime(property.modifyTime) : null
      }))).finish()
    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      messageData,
      responseTime: Date.now()
    })).finish()

    ctx.response.body = res
  }

  static async addProperty(ctx, next) {

    if (ctx.state.user.role === PokeData.PBUserRole.NORMAL_USER) {
      ctx.status = 401
      throw new Error('普通用户不可进行此操作!')
    }

    ctx.msgType = PokeData.PBMessageType.ADD_PROPERTY
    await next()
    const req = ctx.pb.req
    const requestBody = PokeData.PBProperty.toObject(PokeData.PBProperty.decode(req.requestBody))
    const data = Object.assign({color: {}}, requestBody)
    if (typeof data.background !== 'undefined') {
      data.color.background = data.background
      delete data.background
    }
    if (typeof data.border !== 'undefined') {
      data.color.border = data.border
      delete data.border
    }
    const property = new model.Property(data)
    await property.validate()
    await property.save()

    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      responseTime: Date.now()
    })).finish()

    ctx.response.body = res
  }

  static async removeProperty(ctx, next) {
    if (ctx.state.user.role === PokeData.PBUserRole.NORMAL_USER) {
      ctx.status = 401
      throw new Error('普通用户不可进行此操作!')
    }

    ctx.msgType = PokeData.PBMessageType.REMOVE_PROPERTY
    await next()
    const req = ctx.pb.req
    const {id} = PokeData.PBIdObject.toObject(PokeData.PBIdObject.decode(req.requestBody))

    const {result} = await model.Property.remove({propertyId: id}).exec()
    if (!result.n) {
      throw new Error('目标不存在!')
    }

    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      responseTime: Date.now()
    })).finish()

    ctx.response.body = res
  }

  static async updateProperty(ctx, next) {

    if (ctx.state.user.role === PokeData.PBUserRole.NORMAL_USER) {
      ctx.status = 401
      throw new Error('普通用户不可进行此操作!')
    }

    ctx.msgType = PokeData.PBMessageType.UPDATE_PROPERTY
    await next()
    const req = ctx.pb.req
    const requestBody = PokeData.PBProperty.toObject(PokeData.PBProperty.decode(req.requestBody))
    const {id} = ctx.params

    const oldProperty = await model.Property.findOne({
      propertyId: +id
    }).select({
      '_id': 0,
      '__v': 0,
      'createTime': 0
    }).exec()

    if (!oldProperty) {
      throw new Error('目标不存在!')
    }

    requestBody.modifyTime = Date.now()
    const data = Object.assign({}, requestBody)
    if (typeof data.background !== 'undefined') {
      data['color.background'] = data.background
      delete data.background
    }
    if (typeof data.border !== 'undefined') {
      data['color.border'] = data.border
      delete data.border
    }
    const result = await model.Property.update({
      propertyId: +id
    }, {$set: data}).exec()

    if (!result.n) {
      throw new Error('修改失败! 请重新尝试!')
    }

    const messageData = PokeData.PBProperty
      .encode(new PokeData.PBProperty(Object.assign({}, JSON.parse(JSON.stringify(oldProperty)), requestBody))).finish()
    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      messageData,
      responseTime: Date.now()
    })).finish()

    ctx.response.body = res
  }

  static async getFeatures(ctx, next) {
    ctx.msgType = PokeData.PBMessageType.GET_FEATURES
    await next()
    const req = ctx.pb.req
    const {offset = 0, limit = 20, visible} = PokeData.PBListReq.toObject(PokeData.PBListReq.decode(req.requestBody))
    const features = await model.Feature
      .find()
      .select({
        '_id': 0,
        '__v': 0,
      })
      .skip(offset)
      .limit(limit)
      .exec()
    let data = features.map(feature => new PokeData.PBFeature(Object.assign({}, JSON.parse(JSON.stringify(feature)), {
      createTime: dateToTime(feature.createTime),
      modifyTime: feature.modifyTime ? dateToTime(feature.modifyTime) : null
    })))

    if (typeof visible !== 'undefined') {
      data = data.filter(item => item.visible === visible)
    }

    const messageData = PokeData.PBFeatureList.encode(new PokeData.PBFeatureList({
      features: data,
      offset,
      limit
    })).finish()
    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      messageData,
      responseTime: Date.now()
    })).finish()
    ctx.response.body = res
  }

  static async addFeature(ctx, next) {
    if (ctx.state.user.role === PokeData.PBUserRole.NORMAL_USER) {
      ctx.status = 401
      throw new Error('普通用户不可进行此操作!')
    }
    ctx.msgType = PokeData.PBMessageType.ADD_FEATURE
    await next()
    const req = ctx.pb.req
    const requestBody = PokeData.PBFeature.toObject(PokeData.PBFeature.decode(req.requestBody))

    const feature = new model.Feature(Object.assign({
      createTime: Date.now()
    }, requestBody))

    await feature.validate()
    await feature.save()

    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      responseTime: Date.now()
    })).finish()

    ctx.response.body = res
  }

  static async removeFeature(ctx, next) {
    if (ctx.state.user.role === PokeData.PBUserRole.NORMAL_USER) {
      ctx.status = 401
      throw new Error('普通用户不可进行此操作!')
    }
    ctx.msgType = PokeData.PBMessageType.REMOVE_FEATURE
    await next()
    const req = ctx.pb.req
    const {id} = PokeData.PBIdObject.toObject(PokeData.PBIdObject.decode(req.requestBody))
    const {result} = await model.Feature.remove({featureId: id}).exec()
    if (!result.n) {
      throw new Error('目标不存在!')
    }

    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      responseTime: Date.now()
    })).finish()

    ctx.response.body = res
  }

  static async getFeatureById(ctx, next) {
    ctx.msgType = PokeData.PBMessageType.GET_FEATURE_BY_ID
    await next()
    const req = ctx.pb.req
    const {id} = PokeData.PBIdObject.toObject(PokeData.PBIdObject.decode(req.requestBody))
    const feature = await model.Feature
      .findOne({featureId: id})
      .select({
        '_id': 0,
        '__v': 0
      })
      .exec()
    if (!feature) {
      throw new Error('目标不存在!')
    }
    const messageData = PokeData.PBFeature
      .encode(new PokeData.PBFeature(Object.assign({}, JSON.parse(JSON.stringify(feature)), {
        createTime: dateToTime(feature.createTime),
        modifyTime: feature.modifyTime ? dateToTime(feature.modifyTime) : null
      }))).finish()
    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      messageData,
      responseTime: Date.now()
    })).finish()

    ctx.response.body = res
  }

  static async updateFeature(ctx, next) {
    if (ctx.state.user.role === PokeData.PBUserRole.NORMAL_USER) {
      ctx.status = 401
      throw new Error('普通用户不可进行此操作!')
    }
    ctx.msgType = PokeData.PBMessageType.UPDATE_FEATURE
    await next()
    const req = ctx.pb.req
    const requestBody = PokeData.PBFeature.decode(req.requestBody)
    const {id} = ctx.params
    const oldFeature = await model.Feature
      .findOne({featureId: +id})
      .select({'_id': 0, '__v': 0, 'createTime': 0})
      .exec()

    if (!oldFeature) {
      throw new Error('目标不存在!')
    }

    // 采用toObject方法会出现空数组丢失问题, 换用Object.assign
    const data = Object.assign({}, requestBody)

    if (data.featureId) {
      delete data.featureId
    }
    if (data.createTime) {
      delete data.createTime
    }
    data.modifyTime = Date.now()
    const result = await model.Feature.update({
      featureId: +id
    }, {$set: data}).exec()

    if (!result.n) {
      throw new Error('修改失败! 请重新尝试!')
    }

    const messageData = PokeData.PBFeature
      .encode(new PokeData.PBFeature(Object.assign({}, JSON.parse(JSON.stringify(oldFeature)), data, {
        createTime: dateToTime(oldFeature.createTime)
      }))).finish()
    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      messageData,
      responseTime: Date.now()
    })).finish()

    ctx.response.body = res
  }

}

export default BaseConfig
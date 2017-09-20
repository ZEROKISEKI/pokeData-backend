import * as model from '../models'
import { PokeData } from '../common/model'
import { dateToTime } from "../utils/moment"
import { decode } from "../common/jwt"

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

  static async addVersion(ctx, next) {

	if(ctx.state.user.role === PokeData.PBUserRole.NORMAL_USER) {
	  ctx.status = 401
	  throw new Error('普通用户不可进行此操作!')
	}

    ctx.msgType = PokeData.PBMessageType.ADD_VERSION
	await next()
	const req = ctx.pb.req
	const requestBody = PokeData.PBVersion.toObject(PokeData.PBVersion.decode(req.requestBody))
	const data = Object.assign({ color: {} }, requestBody)
	if(typeof data.background !== 'undefined') {
      data.color.background = data.background
	  delete data.background
	}
	if(typeof data.font !== 'undefined') {
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

    if(ctx.state.user.role === PokeData.PBUserRole.NORMAL_USER) {
	  ctx.status = 401
	  throw new Error('普通用户不可进行此操作!')
	}

    ctx.msgType = PokeData.PBMessageType.REMOVE_VERSION
	await next()
	const req = ctx.pb.req
	const { id } = PokeData.PBIdObject.toObject(PokeData.PBIdObject.decode(req.requestBody))

	const { result } = await model.Version.remove({ versionId: id }).exec()
	if(!result.n) {
	  throw new Error('目标不存在!')
	}

	const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
	  responseTime: Date.now()
	})).finish()

	ctx.response.body = res
  }

  static async updateVersion(ctx, next) {

	if(ctx.state.user.role === PokeData.PBUserRole.NORMAL_USER) {
	  ctx.status = 401
	  throw new Error('普通用户不可进行此操作!')
	}

    ctx.msgType = PokeData.PBMessageType.UPDATE_VERSION
	await next()
	const req = ctx.pb.req
	const requestBody = PokeData.PBVersion.toObject(PokeData.PBVersion.decode(req.requestBody))
	const { id } = ctx.params

	const oldVersion = await model.Version.findOne({
	  versionId: +id
	}).select({
	  '_id': 0,
	  '__v': 0,
	  'createTime': 0
	}).exec()

	if(!oldVersion) {
      throw new Error('目标不存在!')
	}

	requestBody.modifyTime = Date.now()
	const data = Object.assign({}, requestBody)
	if(typeof data.background !== 'undefined') {
	  data['color.background'] = data.background
	  delete data.background
	}
	if(typeof data.font !== 'undefined') {
	  data['color.font'] = data.font
	  delete data.font
	}
	const result = await model.Version.update({
	  versionId: +id
	}, { $set: data }).exec()

	if(!result.n) {
      throw new Error('修改失败! 请重新尝试!')
	}

	const messageData = PokeData.PBVersion
	  .encode(new PokeData.PBVersion(Object.assign({}, JSON.parse(JSON.stringify(oldVersion)), requestBody))).finish()
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

  static async addEggGroup(ctx, next) {

	if(ctx.state.user.role === PokeData.PBUserRole.NORMAL_USER) {
	  ctx.status = 401
	  throw new Error('普通用户不可进行此操作!')
	}

	ctx.msgType = PokeData.PBMessageType.ADD_EGGGROUP
	await next()
	const req = ctx.pb.req
	const requestBody = PokeData.PBEggGroup.toObject(PokeData.PBEggGroup.decode(req.requestBody))
	const data = Object.assign({ color: {} }, requestBody)
	if(typeof data.background !== 'undefined') {
	  data.color.background = data.background
	  delete data.background
	}
	if(typeof data.border !== 'undefined') {
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
	if(ctx.state.user.role === PokeData.PBUserRole.NORMAL_USER) {
	  ctx.status = 401
	  throw new Error('普通用户不可进行此操作!')
	}

	ctx.msgType = PokeData.PBMessageType.REMOVE_EGGGROUP
	await next()
	const req = ctx.pb.req
	const { id } = PokeData.PBIdObject.toObject(PokeData.PBIdObject.decode(req.requestBody))

	const { result } = await model.EggGroup.remove({ eggGroupId: id }).exec()
	if(!result.n) {
	  throw new Error('目标不存在!')
	}

	const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
	  responseTime: Date.now()
	})).finish()

	ctx.response.body = res
  }

  static async updateEggGroup(ctx, next) {

	if(ctx.state.user.role === PokeData.PBUserRole.NORMAL_USER) {
	  ctx.status = 401
	  throw new Error('普通用户不可进行此操作!')
	}

	ctx.msgType = PokeData.PBMessageType.UPDATE_EGGGROUP
	await next()
	const req = ctx.pb.req
	const requestBody = PokeData.PBEggGroup.toObject(PokeData.PBEggGroup.decode(req.requestBody))
	const { id } = ctx.params

	const oldEggGroup = await model.EggGroup.findOne({
	  eggGroupId: +id
	}).select({
	  '_id': 0,
	  '__v': 0,
	  'createTime': 0
	}).exec()

	if(!oldEggGroup) {
	  throw new Error('目标不存在!')
	}

	requestBody.modifyTime = Date.now()
	const data = Object.assign({}, requestBody)
	if(typeof data.background !== 'undefined') {
	  data['color.background'] = data.background
	  delete data.background
	}
	if(typeof data.border !== 'undefined') {
	  data['color.border'] = data.border
	  delete data.border
	}
	const result = await model.EggGroup.update({
	  eggGroupId: +id
	}, { $set: data }).exec()

	if(!result.n) {
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
	  modifyTime: property.modifyTime ? dateToTime(property.modifyTime): null
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

  static async addProperty(ctx, next) {

	if(ctx.state.user.role === PokeData.PBUserRole.NORMAL_USER) {
	  ctx.status = 401
	  throw new Error('普通用户不可进行此操作!')
	}

	ctx.msgType = PokeData.PBMessageType.ADD_PROPERTY
	await next()
	const req = ctx.pb.req
	const requestBody = PokeData.PBProperty.toObject(PokeData.PBProperty.decode(req.requestBody))
	const data = Object.assign({ color: {} }, requestBody)
	if(typeof data.background !== 'undefined') {
	  data.color.background = data.background
	  delete data.background
	}
	if(typeof data.border !== 'undefined') {
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
	if(ctx.state.user.role === PokeData.PBUserRole.NORMAL_USER) {
	  ctx.status = 401
	  throw new Error('普通用户不可进行此操作!')
	}

	ctx.msgType = PokeData.PBMessageType.REMOVE_PROPERTY
	await next()
	const req = ctx.pb.req
	const { id } = PokeData.PBIdObject.toObject(PokeData.PBIdObject.decode(req.requestBody))

	const { result } = await model.Property.remove({ propertyId: id }).exec()
	if(!result.n) {
	  throw new Error('目标不存在!')
	}

	const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
	  responseTime: Date.now()
	})).finish()

	ctx.response.body = res
  }

  static async updateProperty(ctx, next) {

	if(ctx.state.user.role === PokeData.PBUserRole.NORMAL_USER) {
	  ctx.status = 401
	  throw new Error('普通用户不可进行此操作!')
	}

	ctx.msgType = PokeData.PBMessageType.UPDATE_PROPERTY
	await next()
	const req = ctx.pb.req
	const requestBody = PokeData.PBProperty.toObject(PokeData.PBProperty.decode(req.requestBody))
	const { id } = ctx.params

	const oldProperty = await model.Property.findOne({
	  propertyId: +id
	}).select({
	  '_id': 0,
	  '__v': 0,
	  'createTime': 0
	}).exec()

	if(!oldProperty) {
	  throw new Error('目标不存在!')
	}

	requestBody.modifyTime = Date.now()
	const data = Object.assign({}, requestBody)
	if(typeof data.background !== 'undefined') {
	  data['color.background'] = data.background
	  delete data.background
	}
	if(typeof data.border !== 'undefined') {
	  data['color.border'] = data.border
	  delete data.border
	}
	const result = await model.Property.update({
	  propertyId: +id
	}, { $set: data }).exec()

	if(!result.n) {
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

}

export default BaseConfig
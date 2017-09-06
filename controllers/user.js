import * as model from '../models'
import { PokeData } from '../common/model'
import cryto from 'crypto'
import { sign } from "../common/jwt"
import { dateToTime } from '../utils/moment'
import protobuf from 'protobufjs/minimal'

class User {

  // 账号注册
  static async register(ctx) {

    if (ctx.state.user && ctx.state.user.userId) {
      throw new Error('请先退出登录!')
	}

    ctx.body = ctx.request.body

    const req = PokeData.PBMessageReq.decode(ctx.body)
    const msgType = req.messageType

    if (msgType === PokeData.PBMessageType.USER_REGISTER) {

      const requestBody = PokeData.PBUserReq.toObject(PokeData.PBUserReq.decode(req.requestBody))
	  requestBody.createTime = Date.now()
      const user = new model.User({
        name: requestBody.username,
        password: User.encrypt(requestBody.password, requestBody.createTime),
		createTime: requestBody.createTime
      })

      if (requestBody.inviteCode) {
        // 有邀请码则设置为普通管理员
        user.set({
          inviteCode: requestBody.inviteCode,
          role: PokeData.PBUserRole.NORMAL_ADMIN
        })
      }

      await user.validate()
      await user.save()

      const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
		responseTime: Date.now()
	  })).finish()

      ctx.response.body = res

    } else {
      throw new Error('请求消息类型错误! 请检查消息类型!')
    }
  }

  // 账号登录
  static async login(ctx) {

    if (ctx.state.user&& ctx.state.user.userId) {
      throw new Error('账号已经登录! 请先退出已有登录账号!')
	}

    ctx.body = ctx.request.body

    const req = PokeData.PBMessageReq.decode(ctx.body)
    const msgType = req.messageType

    if (msgType === PokeData.PBMessageType.USER_LOGIN) {
      const requestBody = PokeData.PBUserReq.toObject(PokeData.PBUserReq.decode(req.requestBody))
	  const user = await model.User.findOne({
		name: requestBody.username
	  }).exec()

      if (user && user.password === User.encrypt(requestBody.password, dateToTime(user.createTime))) {

        if (user.locked) {
          throw new Error('该账号已经被锁定！无法进行登录')
        }

        user.set({
		  lastLoginTime: Date.now()
        })

        await user.save()

        // 登录成功, 生成JWT用户认证
		const token = sign({
		  userId: user.userId,
          username: user.name,
          avatar: user.avatar,
          lastLoginTime: user.lastLoginTime,
		  role: user.role
        })

        const messageData = PokeData.PBUser.encode(new PokeData.PBUser({
		  userId: user.userId,
		  username: user.name,
		  avatar: user.avatar,
		  lastLoginTime: user.lastLoginTime,
		  lastModifyTime: user.updateTime,
		  role: user.role
		})).finish()

        const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
          messageData,
          responseTime: Date.now()
        })).finish()

        // 设置响应头token
        ctx.set('authorization', `Bearer ${token}`)
        ctx.response.body = res

      } else {
        throw new Error('用户名不存在或密码错误!')
      }

    } else {
      throw new Error('请求消息类型错误! 请检查消息类型!')
    }
  }

  // 获取账号列表(只有超级管理员才有该权限)
  static async getAllUsers(ctx) {

	if (ctx.state.user.role !== PokeData.PBUserRole.SUPER_ADMIN) {
	  // TODO 设置ctx.status
	  throw new Error('只有超级管理员才有权操作!')
	}

    // 解码base64获取buffer数据
	const buffer = protobuf.util.newBuffer(protobuf.util.base64.length(ctx.querystring))
	protobuf.util.base64.decode(ctx.querystring, buffer, 0)

    const req = PokeData.PBMessageReq.decode(buffer)
    const msgType = req.messageType

	if(msgType === PokeData.PBMessageType.GET_ALL_USERS) {
      const requestBody = PokeData.PBListReq.toObject(PokeData.PBListReq.decode(req.requestBody))

	  let users = await model.User
		.find()
		.skip(requestBody.offset)
		.limit(requestBody.limit)
		.exec()

	  users = users.map(user => {
	    return new PokeData.PBUser({
		  userId: user.userId,
		  username: user.name,
		  avatar: user.avatar,
		  role: user.role,
		  isLocked: user.locked,
		  inviteCode: user.inviteCode,
		  createTime: user.createTime,
		  lastLoginTime: user.lastLoginTime,
		  lastModifyTime: user.updateTime
		})
	  })

	  const messageData = PokeData.PBUserList.encode(new PokeData.PBUserList({
		users: users,
		offset: requestBody.offset,
		limit: requestBody.limit
	  })).finish()

	  const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
		messageData,
		responseTime: Date.now()
	  })).finish()

	  ctx.response.body = res

	} else {
      throw new Error('请求消息类型错误! 请检查消息类型!')
	}
  }

  // 根据ID获取账号(仅限超级管理员)
  static async getUsersById(ctx) {

	if (ctx.state.user.role !== PokeData.PBUserRole.SUPER_ADMIN) {
	  throw new Error('只有超级管理员才有权操作!')
	}

    const buffer = protobuf.util.newBuffer(protobuf.util.base64.length(ctx.querystring))
	protobuf.util.base64.decode(ctx.querystring, buffer, 0)

	const req = PokeData.PBMessageReq.decode(buffer)
	const msgType = req.messageType

	if (msgType === PokeData.PBMessageType.GET_USER_BY_ID) {
	  const { id } = ctx.params

	  if(!id || Object.is(NaN, +id) || parseInt(id) !== id) {
	    throw new Error('id不能为空或非整数!')
	  }

	  const user = await model.User.findOne({ 'userId': id }).exec()

	  if (!user) {
	    throw new Error('用户不存在!')
	  }

	  const messageData = PokeData.PBUser.encode(new PokeData.PBUser({
		userId: user.userId,
		username: user.name,
		avatar: user.avatar,
		role: user.role,
		isLocked: user.locked,
		inviteCode: user.inviteCode,
		createTime: user.createTime,
		lastLoginTime: user.lastLoginTime,
		lastModifyTime: user.updateTime
	  })).finish()

	  const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
		messageData,
		responseTime: Date.now()
	  })).finish()

	  ctx.response.body = res

	} else {
	  throw new Error('请求消息类型错误! 请检查消息类型!')
	}

  }

  // 根据ID修改某个账号(仅限超级管理员)
  static async updateUsersById(ctx) {
    if (ctx.state.user.role !== PokeData.PBUserRole.SUPER_ADMIN) {
	  throw new Error('只有超级管理员才有权操作!')
	}

	ctx.body = ctx.request.body

	const req = PokeData.PBMessageReq.decode(ctx.body)
	const msgType = req.messageType

	if (msgType === PokeData.PBMessageType.UPDATE_USER_BY_ID) {
      const requestBody = PokeData.PBUser.toObject(PokeData.PBUser.decode(req.requestBody))

	  const oldUser = await model.User.findOne({ userId: requestBody.userId }).exec()

	  if (!oldUser) {
        throw new Error('用户不存在!')
	  }

	  const data = Object.assign({}, requestBody)
	  delete data.userId
	  if (data.username) {
        delete data.username
		data.name = requestBody.username
	  }
	  if (typeof data.isLocked !== 'undefined') {
        delete data.isLocked
		data.locked = requestBody.isLocked
	  }
	  if (data.password) {
        data.password = User.encrypt(data.password, dateToTime(oldUser.createTime))
	  }
	  data.updateTime = Date.now()

	  const modifyUser = model.User.update({
		userId: requestBody.userId
	  }, { $set: data })

	  const user = await modifyUser.exec()

	  if (!user.n) {
        throw new Error('修改失败! 请重新尝试!')
	  }

	  const {
		userId = oldUser.userId,
		username = data.name,
		isLocked = data.locked,
		avatar = oldUser.avatar,
		role = oldUser.role,
		inviteCode = oldUser.inviteCode,
		createTime = oldUser.createTime,
		lastLoginTime = oldUser.lastLoginTime,
		lastModifyTime = data.updateTime,
	  } = data

	  const messageData = PokeData.PBUser.encode(new PokeData.PBUser({
		userId,
		username,
		isLocked,
		avatar,
		role,
		inviteCode,
		createTime,
		lastLoginTime,
		lastModifyTime
	  })).finish()


	  const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
		messageData,
		responseTime: Date.now()
	  })).finish()

	  ctx.response.body = res

	} else {
	  throw new Error('请求消息类型错误! 请检查消息类型!')
	}
  }

  // 添加账号(仅限超级管理员)
  static async addUser(ctx) {

    if (ctx.state.user.role !== PokeData.PBUserRole.SUPER_ADMIN) {
	  throw new Error('只有超级管理员才有权操作!')
	}

    ctx.body = ctx.request.body

	const req = PokeData.PBMessageReq.decode(ctx.body)
	const msgType = req.messageType
	if (msgType === PokeData.PBMessageType.ADD_USER) {

      const requestBody = PokeData.PBUser.toObject(PokeData.PBUser.decode(req.requestBody))
	  const data = Object.assign({}, requestBody)
	  delete data.username
	  data.name = requestBody.username
	  if (typeof data.isLocked !== 'undefined') {
        delete data.isLocked
		data.locked = requestBody.isLocked
	  }
	  data.createTime = Date.now()
	  data.password = User.encrypt(data.password, data.createTime)

	  const user = new model.User(data)

	  await user.validate()
	  await user.save()

	  const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
		responseTime: Date.now()
	  })).finish()

	  ctx.response.body = res

	} else {
	  throw new Error('请求消息类型错误! 请检查消息类型!')
	}
  }

  // 删除账号(仅限超级管理员)
  static async removeUser(ctx) {

    ctx.body = ctx.request.body

	if (ctx.state.user.role !== PokeData.PBUserRole.SUPER_ADMIN) {
	  throw new Error('只有超级管理员才有权操作!')
	}

	const req = PokeData.PBMessageReq.decode(ctx.body)
	const msgType = req.messageType

	if (msgType === PokeData.PBMessageType.REMOVE_USER) {

      const { id } = PokeData.PBIdObject.toObject(PokeData.PBIdObject.decode(req.requestBody))

      const result = await model.User.remove({ 'userId': id }).exec()

	  if (!result.result.n) {
        throw new Error('目标用户不存在!')
	  }

	  const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
		responseTime: Date.now()
	  })).finish()

	  ctx.response.body = res

	} else {
	  throw new Error('请求消息类型错误! 请检查消息类型!')
	}

  }

  // 获取个人信息
  static async getMessage(ctx) {

    const buffer = protobuf.util.newBuffer(protobuf.util.base64.length(ctx.querystring))
	protobuf.util.base64.decode(ctx.querystring, buffer, 0)

	const req = PokeData.PBMessageReq.decode(buffer)
	const msgType = req.messageType
	if (msgType === PokeData.PBMessageType.GET_USER_BY_ID) {

      const user = await model.User.findOne({ 'userId': ctx.state.user.userId }).exec()

	  if (!user) {
        throw new Error('用户不存在!')
	  }

	  const messageData = PokeData.PBUser.encode(new PokeData.PBUser({
		userId: user.userId,
		username: user.name,
		avatar: user.avatar,
		role: user.role,
		isLocked: user.locked,
		inviteCode: user.inviteCode,
		createTime: user.createTime,
		lastLoginTime: user.lastLoginTime,
		lastModifyTime: user.updateTime
	  })).finish()

	  const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
		messageData,
		responseTime: Date.now()
	  })).finish()

	  ctx.response.body = res

	} else {
	  throw new Error('请求消息类型错误! 请检查消息类型!')
	}
  }

  // 修改个人信息
  static async updateMessage(ctx) {
    ctx.body = ctx.request.body

	const req = PokeData.PBMessageReq.decode(ctx.body)
	const msgType = req.messageType
	if (msgType === PokeData.PBMessageType.UPDATE_USER_BY_ID) {
      const requestBody = PokeData.PBUser.toObject(PokeData.PBUser.decode(req.requestBody))

	  if (requestBody.userId !== ctx.state.user.userId) {
        throw new Error('修改信息错误!请重新登录进行尝试!')
	  }

	  const oldUser = await model.User.findOne({
		userId: requestBody.userId
	  }).exec()

	  if (!oldUser) {
		throw new Error('用户不存在!')
	  }

	  const data = Object.assign({}, requestBody)
	  delete data.userId
	  if (data.username) {
		delete data.username
		data.name = requestBody.username
	  }
	  // 改变锁定状态
	  if (typeof data.isLocked !== 'undefined') {
        delete data.isLocked
		data.locked = requestBody.isLocked
	  }
	  data.updateTime = Date.now()

	  if (requestBody.password) {
        data.password = User.encrypt(data.password, dateToTime(oldUser.createTime))
	  }

	  const modifyUser = model.User.update({
		userId: requestBody.userId
	  }, { $set: data })

	  const user = await modifyUser.exec()

	  if (!user.n) {
		throw new Error('修改失败! 请重新尝试!')
	  }

	  const {
		userId = oldUser.userId,
		username = data.name,
		isLocked = data.locked,
		avatar = oldUser.avatar,
		role = oldUser.role,
		inviteCode = oldUser.inviteCode,
		createTime = oldUser.createTime,
		lastLoginTime = oldUser.lastLoginTime,
		lastModifyTime = data.updateTime,
	  } = data

	  const messageData = PokeData.PBUser.encode(new PokeData.PBUser({
		userId,
		username,
		isLocked,
		avatar,
		role,
		inviteCode,
		createTime,
		lastLoginTime,
		lastModifyTime
	  })).finish()

	  const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
		messageData,
		responseTime: Date.now()
	  })).finish()

	  ctx.response.body = res

	} else {
	  throw new Error('请求消息类型错误! 请检查消息类型!')
	}
  }

  // 加密函数
  static encrypt(password, key) {
    const salt = cryto.createHash('sha256')
    salt.update(`${key}`)
    const result = cryto.createHmac('sha256', salt.digest('hex'))
    result.update(password)
    return result.digest('hex')
  }

}

export default User
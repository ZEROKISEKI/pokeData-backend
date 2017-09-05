import * as model from '../models'
import { PokeData } from '../common/model'

class User {

  // 账号登录
  static async register(ctx) {
    ctx.body = ctx.request.body
    const req = PokeData.PBMessageReq.decode(ctx.body)
    const msgType = PokeData.PBMessageType.decode(req.messageType)

    if (msgType === PokeData.PBMessageType.USER_REGISTER) {

      const { requestBody } = req
      const user = new model.User(requestBody)
      await user.validate()
      await user.save()
      const res = new PokeData.PBMessageRes({
		responseTime: Date.now()
      }).encode().finish()

      ctx.response.body = res

    } else {
      throw new Error('请求消息类型错误! 请检查消息类型!')
    }
  }

  // 账号注册
  static async login(ctx) {

  }

  // 获取账号列表(只有超级管理员才有该权限)
  static async getAllUsers(ctx) {

  }

  // 根据ID获取账号(仅限超级管理员)
  static async getUsersById(ctx) {

  }

  // 根据ID修改某个账号(仅限超级管理员)
  // 修改账号信息，锁定账号，解锁账号
  static async updateUsersById(ctx) {

  }

  // 添加账号(仅限超级管理员)
  static async addUser(ctx) {

  }

  // 删除账号(仅限超级管理员)
  static async removeUser(ctx) {

  }

  // 获取个人信息
  static async getMessage(ctx) {

  }

  // 修改个人信息
  static async updateMessage(ctx) {

  }

}

export default User
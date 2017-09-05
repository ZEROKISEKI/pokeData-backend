import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'
import uniqueValidator from 'mongoose-unique-validator'

const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: {						// 账户名
    type: String,
	required: true,
	unique: true
  },
  avatar: {						// 账户头像, 为null使用默认头像
    type: String,
	default: null
  },
  password: {					// 账户密码
    type: String,
	required: true
  },
  role: {						// 账户角色
    type: Number,
	enum: [1, 2, 3],			// 1: 普通用户 2: 普通管理员 3: 超级管理员
	default: 1
  },
  locked: {						// 账号锁定状态
    type: Boolean,
	default: false
  },
  inviteCode: {					// 账户邀请码(拥有邀请码可为管理员)
    type: String,
	default: null
  },
  createTime: {					// 账户创建时间
    type: Date,
	default: Date.now
  },
  updateTime: {					// 账户修改时间
    type: Date,
	default: Date.now
  },
  lastLoginTime: {				// 账号上次登录时间
    type: Date,
	default: null
  }
})

UserSchema.plugin(autoIncrement.plugin, {
  model: 'User',
  field: 'userId',
  startAt: 1
})

UserSchema.plugin(uniqueValidator)

const User = mongoose.model('User', UserSchema)

export default User
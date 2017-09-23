import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'
import uniqueValidator from 'mongoose-unique-validator'

const Schema = mongoose.Schema

const VersionSchema = new Schema({
  name: {							// 全名
	type: String,
	required: true
  },
  abstr: {							// 展示名称
	type: String,
	required: true,
	index: true,
	unique: true
  },
  generation: {						// 游戏版本所属世代
	type: Number,
	required: true,
	default: 1,
	min: 1
  },
  color: {									// 颜色设置
	background: {							// 背景色
	  type: String,
	  default: '#EBEBEB'
	},
	font: {									// 字体色
	  type: String,
	  default: '#929292'
	}
  },
  createTime: {
	type: Date,
	default: Date.now
  },
  modifyTime: {
	type: Date,
	default: null
  }
})

VersionSchema.plugin(autoIncrement.plugin, {
  model: 'Version',
  field: 'versionId',
  startAt: 1
})

VersionSchema.plugin(uniqueValidator)

const Version = mongoose.model('Version', VersionSchema)

export default Version
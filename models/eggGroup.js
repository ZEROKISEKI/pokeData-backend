import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'
import uniqueValidator from 'mongoose-unique-validator'

const Schema = mongoose.Schema

const EggGroupSchema = new Schema({
  name: {
    type: String,
	required: true,
	unique: true,
	index: true
  },
  color: {									// 颜色设置
    background: {							// 背景色
      type: String,
	  default: '#BBBBAA'
	},
	border: {								// 边距色
      type: String,
	  default: '#8A8A7B'
	}
  },
  modifyTime: {
    type: Date,
	default: null
  },
  createTime: {
    type: Date,
	default: Date.now
  }
})

EggGroupSchema.plugin(autoIncrement.plugin, {
  model: 'EggGroup',
  field: 'eggGroupId',
  startAt: 1
})

EggGroupSchema.plugin(uniqueValidator)

const EggGroup = mongoose.model('EggGroup', EggGroupSchema)

export default EggGroup
import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'
import uniqueValidator from 'mongoose-unique-validator'

const Schema = mongoose.Schema

const FeatureSchema = new Schema({
  name: {						// 特性名称
    type: String,
	unique: true,
	index: true,
	required: true
  },
  description: {				// 特性描述
    type: String,
	required: true
  },
  effect: [String],				// 具体效果
  visible: {					// 是否可见
    type: Boolean,
	default: true
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

FeatureSchema.plugin(autoIncrement.plugin, {
  model: 'Feature',
  field: 'featureId',
  startAt: 1,
})

FeatureSchema.plugin(uniqueValidator)

const Feature = mongoose.model('Feature', FeatureSchema)

export default Feature
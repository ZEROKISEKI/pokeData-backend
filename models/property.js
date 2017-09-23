import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import autoIncrement from 'mongoose-auto-increment'

const Schema = mongoose.Schema

const PropertySchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		index: true
	},
	color: {										// 颜色设置
		background: {							// 背景色
			type: String,
			default: '#BBBBAA'
		},
		border: {									// 边距色
			type: String,
			default: '#8A8A7B'
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

PropertySchema.plugin(autoIncrement.plugin, {
	model: 'Property',
	field: 'propertyId',
	startAt: 1
})
PropertySchema.plugin(uniqueValidator)

const Property = mongoose.model('Property', PropertySchema)

export default Property
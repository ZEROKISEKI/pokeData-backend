import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'
// import uniqueValidator from 'mongoose-unique-validator'

const Schema = mongoose.Schema

const PlaceSchema = new Schema({
	createTime: {               // 文档创建时间
		type: Date,
		default: Date.now
	},
	modifyTime: {               // 文档修改时间
		type: Date,
		default: Date.now
	}
})

PlaceSchema.plugin(autoIncrement.plugin, {
	model: 'Place',
	field: 'placeId',
	startAt: 1
})

const Place = mongoose.model('Place', PlaceSchema)

export default Place
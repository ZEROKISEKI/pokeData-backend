import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'

const Schema = mongoose.Schema

const PersonSchema = new Schema({
  createTime: {               // 文档创建时间
	type: Date,
	default: Date.now
  },
  modifyTime: {               // 文档修改时间
	type: Date,
	default: Date.now
  }
})

PersonSchema.plugin(autoIncrement.plugin, {
  model: 'Person',
  field: 'personId',
  startAt: 1
})

const Person = mongoose.model('Person', PersonSchema)

export default Person
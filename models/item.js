import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'
import uniqueValidator from 'mongoose-unique-validator'

const Schema = mongoose.Schema

const ItemSchema = new Schema({
	name: {                     // 道具名
		type: String,
		required: true,
		unique: true
	},
	aliasName: [String],        // 道具别名
	image: {                    // 道具图像
		type: String,
		default: null
	},
	icon: {                     // 道具图标
		type: String,
		default: null
	},
	description: String,        // 说明
	result: [String],           // 效果(不等于说明)
	scene: {                    // 使用场景
		type: Boolean,            // 为true表示对战外, 为false表示对战内
		default: null             // 为null表示没有使用场景
	},
	usage: {
		type: Number,             // 1: "一次性" , 2: "不可使用" ,  3: "多次使用"
		enum: [1, 2, 3],
		default: 1
	},
	appearance: [String],       // 第一次出现
	pay: {                      // 购入价格
		type: Number,
		default: null             // 为null表示无法购入
	},
	sale: {                     // 售出价格
		type: Number,
		default: null             // 为null表示无法售出
	},
	throw: {                    // 投掷次数
		type: Number,
		default: null             // 为null表示无法投掷
	},
	obtain: {                   // 获得方式
		one: [{                   // 一次性获取
			version: [{
				name: String,
				abstr: String
			}],
			way: String
		}],
		repeat: [{                // 重复获取
			version: [{
				name: String,         // 全名
				abstr: String         // 缩略
			}],
			way: String
		}]
	},
	visible: {                  // 道具是否可见
		type: Boolean,
		default: true
	},
	createTime: {               // 文档创建时间
		type: Date,
		default: Date.now
	},
	modifyTime: {               // 文档修改时间
		type: Date,
		default: null
	}
})

ItemSchema.plugin(autoIncrement.plugin, {
	model: 'Item',
	field: 'itemId',
	startAt: 1
})
ItemSchema.plugin(uniqueValidator)

const Item = mongoose.model('Item', ItemSchema)

export default Item
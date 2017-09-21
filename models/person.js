import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'
import uniqueValidator from 'mongoose-unique-validator'

const Schema = mongoose.Schema

const PersonSchema = new Schema({
  name: {					 	// 人物名称
    type: String,
	required: true,
	unique: true,
	index: true
  },
  aliasName: [String],			// 人物别名
  avatar: {						// 人物立绘
    type: String,
	default: null
  },
  high: {						// 身高
    type: Number,
	default: null
  },
  weight: {						// 体重
    type: Number,
	default: null
  },
  sex: {						// 性别
    type: Number,
	enum: [1, 2, 3],			// 1: '男'  2: '女'  3: '未知'
	default: 1
  },
  birthday: {					// 出生日期(不包括年份)
    type: String,
	default: null
  },
  age: [{						// 年龄(多个时期年龄不同)
    value: Number,
	duration: String
  }],
  others: [{					// 其他属性(不同人物属性差别可能比较大)
	key: String,
	value: String
  }],
  pokemons: [{					// 宝可梦
    person: {					// 人物
	  identity: {				// 身份
	    type: String,
		default: null
	  },
	  name: String,				// 名称
	  image: {					// 图标
	    type: String,
		default: null
	  }
	},
	place: String,				// 地点
	version: [{					// 游戏版本
      name: String,
	  abstr: String
	}],
	pokemons: [{				// 拥有宝可梦
	  icon: String,				// 宝可梦图标
	  name: String,				// 宝可梦名称
	  properties: [String],		// 宝可梦属性
	  level: {					// 宝可梦等级
	    type: Number,
		min: 1,
		max: 100
	  },
	  sex: [{					// 宝可梦性别
		type: Number,
		enum: [1, 2, 3],		// 1: '♂'  2: '♀'  3: ''
		default: 1
	  }],
	  feature: [String],		// 宝可梦特性
	  item: {					// 宝可梦携带道具
	    type: {
		  icon: String,
		  name: String
		},
		default: null
	  },
	  skills: [{				// 宝可梦招式
	    name: String,			// 招式名称
		property: String,		// 招式属性
	  }]
	}],
	money: {					// 战利品
	  way: {					// 战斗方式
	    type: String,
		default: null
	  },
	  value: {					// 金钱数目
	    type: Number,
		min: 1
	  }
	},
	items: [{					// 使用道具
	  icon: String,
	  name: String
	}],
	description: String			// 其他说明
  }],
  visible: {                  	// 是否可见
	type: Boolean,
	default: true
  },
  createTime: {               	// 创建时间
	type: Date,
	default: Date.now
  },
  modifyTime: {               	// 修改时间
	type: Date,
	default: null
  }
})

PersonSchema.plugin(autoIncrement.plugin, {
  model: 'Person',
  field: 'personId',
  startAt: 1
})
PersonSchema.plugin(uniqueValidator)

const Person = mongoose.model('Person', PersonSchema)

export default Person
import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'
import uniqueValidator from 'mongoose-unique-validator'

const Schema = mongoose.Schema

const PokemonSchema = new Schema({
  number: {						// 编号
    type: Number,
	min: 1,
	required: true,
	unique: true
  },
  name: {						// 名称
    type: String,
	required: true,
	unique: true
  },
  avatar: {						// 对应立绘图片
    type: String,
	default: null				// null表示使用默认立绘
  },
  icon: {						// 对应小图标
    type: String,
	default: null				// null表示使用默认图标
  },
  properties: [String],			// 属性
  features: [{					// 特性(普通特性)
    name: String,
	description: String
  }],
  specialFeatures: {			// 梦特性(隐藏特性)
    type: {
      name: String,
	  description: String
	},
	default: null				// 为null表示没有梦特性
  },
  sex: {						// 性别比例(为null表示无性别)
    type: {
	  male: Number,
	  female: Number
	},
	default: null				// 为null表示没有性别比例
  },
  capture: {
    type: {
	  percent: Number,			// 捕获概率
	  point: Number,			// 捕获度
	},
	required: true
  },
  weight: Number,				// 体重
  high: Number,					// 身高
  hatch: {
    period: Number,				// 孵化周期
    step: Number				// 步数
  },
  egg: [String],				// 蛋群
  point: {
    hp: {						// HP
      type: Number,
	  default: 0
	},
	atk: {						// 攻击
      type: Number,
	  default: 0
	},
	def: {						// 防御
      type: Number,
	  default: 0
	},
	specAtk: {					// 特攻
	  type: Number,
	  default: 0
	},
	specDef: {					// 特防
      type: Number,
	  default: 0
	},
	spd: {						// 速度
      type: Number,
	  default: 0
	}
  },
  racePoint: {					// 种族值
    base: {
      hp: Number,
	  atk: Number,
	  def: Number,
	  specAtk: Number,
	  specDef: Number,
	  spd: Number
	},
	level50: {
	  hp: { max: Number, min: Number },
	  atk: { max: Number, min: Number },
	  def: { max: Number, min: Number },
	  specAtk: { max: Number, min: Number },
	  specDef: { max: Number, min: Number },
	  spd: { max: Number, min: Number }
	},
	level100: {
	  hp: { max: Number, min: Number },
	  atk: { max: Number, min: Number },
	  def: { max: Number, min: Number },
	  specAtk: { max: Number, min: Number },
	  specDef: { max: Number, min: Number },
	  spd: { max: Number, min: Number }
	}
  },
  mega: [{						// mega形态(空数组表示没有)
    name: {
      type: String,
	  required: true
	},
	avatar: String,
	icon: String,
	properties: [String],
	feature: {
      name: String,
	  description: String
	},
	weight: Number,
	high: Number,
	racePoint: {
	  base: {
		hp: Number,
		atk: Number,
		def: Number,
		specAtk: Number,
		specDef: Number,
		spd: Number
	  },
	  level50: {
		hp: { max: Number, min: Number },
		atk: { max: Number, min: Number },
		def: { max: Number, min: Number },
		specAtk: { max: Number, min: Number },
		specDef: { max: Number, min: Number },
		spd: { max: Number, min: Number }
	  },
	  level100: {
		hp: { max: Number, min: Number },
		atk: { max: Number, min: Number },
		def: { max: Number, min: Number },
		specAtk: { max: Number, min: Number },
		specDef: { max: Number, min: Number },
		spd: { max: Number, min: Number }
	  }
	}
  }],
  special: [{					// 特殊形态(空数组表示没有)
	name: {
	  type: String,
	  required: true
	},
	avatar: String,
	icon: String,
	properties: [String],
	feature: {
	  name: String,
	  description: String
	},
	weight: Number,
	high: Number,
	racePoint: {
	  base: {
		hp: Number,
		atk: Number,
		def: Number,
		specAtk: Number,
		specDef: Number,
		spd: Number
	  },
	  level50: {
		hp: { max: Number, min: Number },
		atk: { max: Number, min: Number },
		def: { max: Number, min: Number },
		specAtk: { max: Number, min: Number },
		specDef: { max: Number, min: Number },
		spd: { max: Number, min: Number }
	  },
	  level100: {
		hp: { max: Number, min: Number },
		atk: { max: Number, min: Number },
		def: { max: Number, min: Number },
		specAtk: { max: Number, min: Number },
		specDef: { max: Number, min: Number },
		spd: { max: Number, min: Number }
	  }
	}
  }],
  phase: [{						// 属性相性
    condition: [String],		// 条件(自身属性, 世代, 自身特性)
	properties: [{
      name: String,				// 属性名称
	  value: {					// 相性倍数
        type: Number,
		default: null
	  }
	}]
  }],
  skills: [{
    generation: Number,			// 世代
	level: [{					// 通过升级习得招式
	  level: {
		type: Number,
		default: null
	  },
	  name: String,
	  property: String,			// 招式属性
	  sort: {					// 招式分类
		type: String,
		enum: ['变化', '物理', '特殊']
	  },
	  power: {					// 威力
		type: Number,
		default: null
	  },
	  hit: {					// 命中率
		type: Number,
		default: null,
		max: 100,
	  },
	  pp: {						// pp数(使用次数)
		type: Number
	  }
	}],
	item: [{					// 通过技能学习器习得招式
	  number: Number,			// 技能机编号
	  name: String,
	  property: String,			// 招式属性
	  sort: {					// 招式分类
		type: String,
		enum: ['变化', '物理', '特殊']
	  },
	  power: {					// 威力
		type: Number,
		default: null
	  },
	  hit: {					// 命中率
		type: Number,
		default: null,
		max: 100,
	  },
	  pp: {						// pp数(使用次数)
		type: Number
	  }
	}],
	egg: [{						// 通过生蛋遗传习得招式
	  parents: [Number],		// 亲代
	  name: String,
	  property: String,			// 招式属性
	  sort: {					// 招式分类
		type: String,
		enum: ['变化', '物理', '特殊']
	  },
	  power: {					// 威力
		type: Number,
		default: null
	  },
	  hit: {					// 命中率
		type: Number,
		default: null,
		max: 100,
	  },
	  pp: {						// pp数(使用次数)
		type: Number
	  }
	}],
	learn: [{					// 通过教授习得招式
	  version: [{				// 游戏版本
	    name: String,
		abstr: String
	  }],
	  name: String,
	  property: String,			// 招式属性
	  sort: {					// 招式分类
		type: String,
		enum: ['变化', '物理', '特殊']
	  },
	  power: {					// 威力
		type: Number,
		default: null
	  },
	  hit: {					// 命中率
		type: Number,
		default: null,
		max: 100,
	  },
	  pp: {						// pp数(使用次数)
		type: Number
	  }
	}]
  }],
  evolution: [{					// 进化链
    title: {					// 进化子标题(为null表示没有)
      type: String,
	  default: null
	},
	chains: [{
      name: String,
	  image: String,
	  properties: [String],
	  parent: {					// 上级进化链, 为null表示终结
		type: [{
		  name: String,
		  condition: {
			description: {
			  type: String,
			  default: null
			},
			icon: {
			  type: String,
			  default: null
			}
		  }
		}],
		default: null
	  },
	  children: {				// 下级进化链, 为null表示终结
        type: [{
		  name: String,
		  condition: {
		    description: {
		      type: String,
			  default: null
			},
			icon: {
		      type: String,
			  default: null
			}
		  }
		}],
		default: null
	  }
	}]
  }],
  megaEvolution: {				// 超级进化链
    type: {
      base: {
		name: String,			// 名称
		image: String,			// 图片
		properties: [String]	// 属性
	  },
	  mega: [{
		condition: {			// 条件
		  description: {
			type: String,
			default: null
		  },
		  icon: {
			type: String,
			default: null
		  }
		},
		name: String,			// 名称
		image: String,			// 图片
		properties: [String]	// 属性
	  }]
	},
	default: null
  },
  specialEvolution: [{			// 型态变化链
    condition: {				// 条件
	  description: {
		type: String,
		default: null
	  },
	  icon: {
		type: String,
		default: null
	  }
	},
	name: String,				// 名称
	image: String,				// 图片
	properties: [String]		// 属性
  }],
  createTime: {               // 文档创建时间
	type: Date,
	default: Date.now
  },
  modifyTime: {               // 文档修改时间
	type: Date,
	default: Date.now
  }
})

// 设置自增id
PokemonSchema.plugin(autoIncrement.plugin, {
  model: 'Pokemon',
  field: 'pokemonId',
  startAt: 1,
})

// 增加唯一性检查
PokemonSchema.plugin(uniqueValidator)

const Pokemon = mongoose.model('Pokemon', PokemonSchema)

// 检查相关字段
Pokemon.schema.path('properties').validate(value => {
  return value.length >= 1 && value.length <= 2
}, '一只宝可梦至少有一种属性！最多两个属性!')

Pokemon.schema.path('features').validate(value => {
  return value.length >= 1 && value.length <= 2
}, '一只宝可梦至少有一种普通特性! 最多两种普通特性分布!')

Pokemon.schema.path('egg').validate(value => {
  return value.length >= 1 && value.length <= 2
}, '一只宝可梦至少属于一个蛋群! 最多划分到两个蛋群!')

export default Pokemon
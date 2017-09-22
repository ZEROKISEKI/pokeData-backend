import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'
import uniqueValidator from 'mongoose-unique-validator'

const Schema = mongoose.Schema

const PokemonSchema = new Schema({
  number: {						// 宝可梦编号
    type: Number,
	min: 1,
	required: true,
	unique: true,
	index: true
  },
  name: {						// 名称
    type: String,
	required: true,
	unique: true,
	index: true
  },
  aliasName: [String],			// 宝可梦别名
  avatar: {						// 对应立绘图片
    type: String,
	default: null				// null表示使用默认立绘
  },
  icon: {						// 对应小图标
    type: String,
	default: null				// null表示使用默认图标
  },
  properties: [String],			// 宝可梦属性
  features: [{					// 特性(普通特性)
    name: String,
	description: String
  }],
  specialFeature: {				// 梦特性(隐藏特性)
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
  eggGroups: [String],			// 蛋群
  point: {
    hp: {						// HP努力值
      type: Number,
	  default: 0
	},
	atk: {						// 攻击努力值
      type: Number,
	  default: 0
	},
	def: {						// 防御努力值
      type: Number,
	  default: 0
	},
	specAtk: {					// 特攻努力值
	  type: Number,
	  default: 0
	},
	specDef: {					// 特防努力值
      type: Number,
	  default: 0
	},
	spd: {						// 速度努力值
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
	level50: {					// 50级各项能力范围
	  hp: { max: Number, min: Number },
	  atk: { max: Number, min: Number },
	  def: { max: Number, min: Number },
	  specAtk: { max: Number, min: Number },
	  specDef: { max: Number, min: Number },
	  spd: { max: Number, min: Number }
	},
	level100: {					// 100级各项能力范围
	  hp: { max: Number, min: Number },
	  atk: { max: Number, min: Number },
	  def: { max: Number, min: Number },
	  specAtk: { max: Number, min: Number },
	  specDef: { max: Number, min: Number },
	  spd: { max: Number, min: Number }
	}
  },
  mega: [{						// mega形态(空数组表示没有)
    name: {						// mega形态名称
      type: String,
	  required: true
	},
	avatar: String,				// mega形态立绘
	icon: String,				// mega形态图标
	properties: [String],		// mega形态属性
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
        type: String,
		default: null
	  }
	}]
  }],
  skill: {
    levelWay: [{				// 通过升级习得招式
      generation: Number,
	  skills: [{
		level: {
		  type: Number,
		  default: null			// 为null表示不能习得该技能，为0表示 -(没有等级要求)
		},
		name: String,			// 招式名称
		property: String,		// 招式属性
		kind: {					// 招式分类
		  type: Number,
		  enum: [1, 2, 3],		// 1: '物理'  2: '特殊'  3: '变化'
		  default: 1
		},
		power: {				// 招式威力
		  type: Number,
		  default: null
		},
		hit: {					// 招式命中率
		  type: Number,
		  default: null,
		  max: 100,
		},
		pp: {					// pp数(使用次数)
		  type: Number
		}
	  }]
	}],
	itemWay: [{					// 通过技能学习器习得招式
      generation: Number,
	  skills: [{
		number: Number,			// 技能机编号
		name: String,			// 招式名称
		property: String,		// 招式属性
		kind: {					// 招式分类
		  type: Number,
		  enum: [1, 2, 3],		// 1: '物理'  2: '特殊'  3: '变化'
		  default: 1
		},
		power: {				// 招式威力
		  type: Number,
		  default: null			// 为null 表示 -, 区别于level
		},
		hit: {					// 招式命中率
		  type: Number,
		  default: null,		// 为null 表示 -, 区别于level
		  max: 100,
		},
		pp: {					// pp数(使用次数)
		  type: Number
		}
	  }]
	}],
	inheritWay: [{				// 通过生蛋遗传习得招式
      generation: Number,
	  skills: [{
		parents: [{				// 亲代
		  name: String,
		  icon: String
		}],
		name: String,			// 招式名称
		property: String,		// 招式属性
		kind: {					// 招式分类
		  type: Number,
		  enum: [1, 2, 3],		// 1: '物理'  2: '特殊'  3: '变化'
		  default: 1
		},
		power: {				// 招式威力
		  type: Number,
		  default: null
		},
		hit: {					// 招式命中率
		  type: Number,
		  default: null,
		  max: 100,
		},
		pp: {					// pp数(使用次数)
		  type: Number
		}
	  }]
	}],
	learnWay: [{				// 通过教授习得招式
      generation: Number,
	  skills: [{
		version: [{				// 游戏版本
		  name: String,
		  abstr: String
		}],
		name: String,			// 招式名称
		property: String,		// 招式属性
		kind: {					// 招式分类
		  type: Number,
		  enum: [1, 2, 3],		// 1: '物理'  2: '特殊'  3: '变化'
		  default: 1
		},
		power: {				// 招式威力
		  type: Number,
		  default: null
		},
		hit: {					// 招式命中率
		  type: Number,
		  default: null,
		  max: 100,
		},
		pp: {					// pp数(使用次数)
		  type: Number
		}
	  }]
	}],
	othersWay: [{				// 通过其他途径习得招式
	  generation: Number,
	  skills: [{
	    name: String,			// 招式名称
		property: String,		// 招式属性
		kind: {					// 招式分类
		  type: Number,
		  enum: [1, 2, 3],		// 1: '物理'  2: '特殊'  3: '变化'
		  default: 1
		},
		power: {				// 招式威力
		  type: Number,
		  default: null
		},
		hit: {					// 招式命中率
		  type: Number,
		  default: null,
		  max: 100,
		},
		pp: {					// pp数(使用次数)
		  type: Number
		},
		way: String,			// 习得方式说明
	  }]
	}]
  },
  evolution: [{					// 进化链
    title: {					// 进化子标题(为null表示没有)
      type: String,
	  default: null
	},
	chains: [{					// BFS算法进化链结构
      name: String,
	  image: String,
	  properties: [String],
	  parent: {					// 进化链的上一级(子对父是一对多, 父对子是一对一)
        type: {
		  name: String,			// name与chain的name对应
		  condition: {
			description: {
			  type: String,
			  default: null
			},
			item: {
			  type: {
			    name: String,
				icon: String
			  },
			  default: null
			}
		  }
		},
		default: null
	  },
	  children: [{				// 进化链的下一级
		name: String,
		condition: {
		  description: {
			type: String,
			default: null
		  },
		  item: {
			type: {
			  name: String,
			  icon: String
			},
			default: null
		  }
		}
	  }]
	}]
  }],
  megaEvolution: {				// 超级进化链
    type: {
      base: {
		name: String,			// 宝可梦名称
		image: String,			// 宝可梦立绘
		properties: [String]	// 宝可梦属性
	  },
	  mega: [{
		condition: {			// 宝可梦mega进化条件
		  description: {		// 进化条件附加文字说明
			type: String,
			default: null
		  },
		  item: {				// mega石头
		    type: {
		      name: String,
			  icon: String
			},
			default: null
		  }
		},
		name: String,			// mega形态宝可梦名称
		image: String,			// mega形态宝可梦立绘
		properties: [String]	// mega形态宝可梦属性
	  }]
	},
	default: null
  },
  specialEvolution: [{			// 形态变化链(普通形态也算在这里)
	condition: {				// 特殊形态变化条件
	  description: {			// 文字说明
		type: String,
		default: null
	  },
	  item: {					// 条件物品
		type: {
		  name: String,
		  icon: String
		},
		default: null
	  }
	},
	name: String,				// 特殊形态宝可梦名称
	image: String,				// 特殊形态宝可梦立绘
	properties: [String]		// 特殊形态宝可梦属性
  }],
  visible: {					// 文档是否可见
    type: Boolean,
	default: true
  },
  createTime: {               	// 文档创建时间
	type: Date,
	default: Date.now
  },
  modifyTime: {               	// 文档修改时间
	type: Date,
	default: null
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

Pokemon.schema.path('eggGroups').validate(value => {
  return value.length >= 1 && value.length <= 2
}, '一只宝可梦至少属于一个蛋群! 最多划分到两个蛋群!')

export default Pokemon
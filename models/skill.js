import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'
import uniqueValidator from 'mongoose-unique-validator'

const Schema = mongoose.Schema

const SkillSchema = new Schema({
  number: {										// 招式编号
    type: Number,
    min: 1,
    required: true,
    unique: true
  },
  name: {					  					// 招式名称
    type: String,
    required: true,
    unique: true,
    index: true
  },
  aliasName: [String],		  	// 招式别名
  scene: {                    // 场景(gif图)
    type: String,
    default: null             // 为null表示没有场景
  },
  property: {				 					// 招式属性
    type: String,
    required: true
  },
  kind: {											// 招式分类
    type: Number,
    enum: [1, 2, 3],		  		// 1: '物理'  2: '特殊'  3: '变化'
    default: 1
  },
  description: String,        // 招式描述
  power: {					  				// 威力
    type: Number,
    default: null             // 为null -> -
  },
  hit: {					  					// 命中率
    type: Number,
    default: null,            // 为null -> -
    max: 100,
  },
  pp: {						  					// pp数(使用次数)
    base: Number,
    max: {                    // 最大pp使用次数
      type: Number,
      default: null
    }
  },
  features: [String],         // 相关特性说明
  effect: [String],           // 招式附加效果(不同于特性说明)
  range: {										// 招式作用范围
    type: Number,
    enum: [1, 2, 3],					// 1: '自身之外一只宝可梦'  2: '自身之外其他宝可梦'  3: '自身'
    default: 1
  },
  zSkill: {                   // Z招式
    type: {
      crystal: String,        // Z纯晶
      name: String,           // Z招式名称
      power: String           // Z招式威力(可以是数字或者说明)
    },
    default: null
  },
  pokemons: {                 // 能学会该招式的pokemon
    level: [{                 // 等级提升
      number: Number,					// 宝可梦编号
      name: String,
      icon: String,
      properties: [String],
      generations: [{
        number: Number,       // 世代数
        value: [{
          version: [{         // 对应游戏版本
            name: String,
            abstr: String
          }],
          level: {
            type: Number,
            default: null    	// 为null表示不能习得该技能 为0表示 -
          }
        }]
      }]
    }],
    inherit: [{               // 生蛋遗传
      number: Number,
      name: String,
      icon: String,
      properties: [String],
      generations: [{
        number: Number,       // 世代
        parents: [{         	// 亲代
          name: String,
          icon: String,
        }]
      }]
    }],
    item: [{                  // 招式学习器
      number: Number,
      name: String,
      icon: String,
      properties: [String],
      generations: [{
        number: Number,
        items: [Number]      	// 技能机器编号
      }]
    }],
    learn: [{                 // 教授招式
      number: Number,
      name: String,
      icon: String,
      properties: [String],
      generations: [{
        number: Number,
        version: [{         	// 对应游戏版本
          name: String,
          abstr: String
        }]
      }]
    }],
    others: [{                // 特殊途径
      generation: Number,     // 世代
      data: [{
        number: Number,
        name: String,
        icon: String,
        properties: [String],
        way: String           // 获得方式
      }]
    }]
  },
  visible: {									// 是否可见
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

SkillSchema.plugin(autoIncrement.plugin, {
  model: 'Skill',
  field: 'skillId',
  startAt: 1
})

SkillSchema.plugin(uniqueValidator)

const Skill = mongoose.model('Skill', SkillSchema)

export default Skill
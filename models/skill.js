import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'
import uniqueValidator from 'mongoose-unique-validator'

const Schema = mongoose.Schema

const SkillSchema = new Schema({
  scene: {                    // 场景(gif图)
    type: String,
    default: null             // 为null表示没有场景
  },
  description: String,        // 招式说明
  power: {					  // 威力
	type: Number,
	default: null             // 为null -> -
  },
  hit: {					  // 命中率
	type: Number,
	default: null,            // 为null -> -
	max: 100,
  },
  pp: {						  // pp数(使用次数)
    base: Number,
    max: {                    // 最大pp使用次数
      type: Number,
      default: null
    }
  },
  features: [String],         // 相关特性说明
  effect: [String],           // 招式附加效果(不同于特性说明)
  change: [String],           // 招式变更
  range: String,              // 作用范围
  zSkill: {                   // Z招式
	crystal: String,          // Z纯晶
    name: String,             // Z招式名称
    power: Number             // Z招式威力
  },
  pokemons: {                 // 能学会该招式的pokemon
    level: [{                 // 等级提升
      name: String,
      icon: String,
      properties: [String],
      generations: [{
        key: Number,          // 世代数
        value: [{
		  version: [{           // 对应游戏版本
			name: String,
			abstr: String
		  }],
          level: [{
            type: Number,
            default: null     // 为null表示 -
          }]
        }]
      }]
    }],
    inherit: [{               // 生蛋遗传
	  name: String,
	  icon: String,
	  properties: [String],
      generations: [{
	    key: Number,          // 世代
        version: [{           // 对应游戏版本
		  name: String,
		  abstr: String
		}],
        parents: [{           // 亲代
	      name: String,
          icon: String,
        }]
      }]
    }],
    item: [{                  // 招式学习器
	  name: String,
	  icon: String,
	  properties: [String],
      generations: [{
	    key: Number,
        version: [{
		  name: String,
		  abstr: String
		}],
        items: [Number]       // 技能机器编号
      }]
    }],
    learn: [{                 // 教授招式
	  name: String,
	  icon: String,
	  properties: [String],
      generations: [{
	    key: Number,
        version: [{
	      name: String,
          abstr: String
        }],
        canLearn: {           // 是否可以学习
	      type: Boolean,
          default: false
        }
      }]
    }],
    others: [{                // 特殊途径
      generation: Number,     // 世代
      data: [{
        name: String,
        icon: String,
        properties: [String],
        way: String           // 获得方式
      }]
    }]
  },
  createTime: {               // 文档创建时间
	type: Date,
	default: Date.now
  },
  modifyTime: {               // 文档修改时间
	type: Date,
	default: Date.now
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
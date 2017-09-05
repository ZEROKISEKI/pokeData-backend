import * as model from '../models'

class Skill {

  static async getSkillById(ctx, next) {
	if (!id || Object.is(NaN, +id)) {
	  throw new Error('id不能为空或非数字!')
	}
	const skill = await model.Skill.findOne({id: ctx.params.id})
	console.log('skill', skill)
	ctx.body = '获取数据成功'
  }

}

export default Skill
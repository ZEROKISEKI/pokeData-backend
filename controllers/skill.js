import * as model from '../models'
import {PokeData} from '../common/model'
import {dateToTime} from '../utils/moment'
import {decode} from '../common/jwt'

class Skill {

	static async getAllSkills(ctx, next) {
		ctx.msgType = PokeData.PBMessageType.GET_SKILLS
		await next()
		const req = ctx.pb.req
		const {offset = 0, limit = 20, visible} = PokeData.PBListReq.toObject(PokeData.PBListReq.decode(req.requestBody))
		const skills = await model.Skill
			.find()
			.select({
				'_id': 0,
				'__v': 0,
			})
			.skip(offset)
			.limit(limit)
			.exec()
		let data = skills.map(skill => new PokeData.PBSkill(Object.assign({}, JSON.parse(JSON.stringify(skill)), {
			createTime: dateToTime(skill.createTime),
			modifyTime: skill.modifyTime ? dateToTime(skill.modifyTime) : null
		})))

		if (typeof visible !== 'undefined') {
			data = data.filter(item => item.visible === visible)
		}

		const messageData = PokeData.PBSkillList.encode(new PokeData.PBSkillList({
			skills: data,
			offset,
			limit
		})).finish()
		const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
			messageData,
			responseTime: Date.now()
		})).finish()
		ctx.response.body = res
	}

	static async getSkillById(ctx, next) {
		ctx.msgType = PokeData.PBMessageType.GET_SKILL_BY_ID
		await next()
		const req = ctx.pb.req
		const {id} = PokeData.PBIdObject.toObject(PokeData.PBIdObject.decode(req.requestBody))
		const skill = await model.Skill
			.findOne({skillId: id})
			.select({
				'_id': 0,
				'__v': 0
			})
			.exec()
		if (!skill) {
			throw new Error('技能不存在!')
		}
		const messageData = PokeData.PBSkill
			.encode(new PokeData.PBSkill(Object.assign({}, JSON.parse(JSON.stringify(skill)), {
				createTime: dateToTime(skill.createTime),
				modifyTime: skill.modifyTime ? dateToTime(skill.modifyTime) : null
			}))).finish()
		const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
			messageData,
			responseTime: Date.now()
		})).finish()

		ctx.response.body = res
	}

	static async addSkill(ctx, next) {
		if (ctx.state.user.role === PokeData.PBUserRole.NORMAL_USER) {
			ctx.status = 401
			throw new Error('普通用户不可进行此操作!')
		}
		ctx.msgType = PokeData.PBMessageType.ADD_SKILL
		await next()
		const req = ctx.pb.req
		const requestBody = PokeData.PBSkill.toObject(PokeData.PBSkill.decode(req.requestBody))

		const skill = new model.Skill(Object.assign({
			createTime: Date.now()
		}, requestBody))

		await skill.validate()
		await skill.save()

		const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
			responseTime: Date.now()
		})).finish()

		ctx.response.body = res
	}

	static async removeSkill(ctx, next) {
		if (ctx.state.user.role === PokeData.PBUserRole.NORMAL_USER) {
			ctx.status = 401
			throw new Error('普通用户不可进行此操作!')
		}
		ctx.msgType = PokeData.PBMessageType.REMOVE_SKILL
		await next()
		const req = ctx.pb.req
		const {id} = PokeData.PBIdObject.toObject(PokeData.PBIdObject.decode(req.requestBody))
		const {result} = await model.Skill.remove({skillId: id}).exec()
		if (!result.n) {
			throw new Error('技能不存在!')
		}

		const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
			responseTime: Date.now()
		})).finish()

		ctx.response.body = res
	}

	static async updateSkillById(ctx, next) {
		let token
		if (!ctx.headers['authorization']) {
			ctx.status = 401
			throw new Error('无权进行此操作!')
		}
		token = ctx.headers['authorization'].split(' ')[1]
		if (!token) {
			ctx.status = 401
			throw new Error('不正确的身份认证!')
		}
		const {payload: {role}} = decode(token)
		if (role === PokeData.PBUserRole.NORMAL_USER) {
			ctx.status = 401
			throw new Error('普通用户不可进行此操作!')
		}

		ctx.msgType = PokeData.PBMessageType.UPDATE_SKILL
		await next()
		const req = ctx.pb.req
		const requestBody = PokeData.PBSkill.decode(req.requestBody)
		const {id} = ctx.params
		const oldSkill = await model.Skill
			.findOne({skillId: +id})
			.select({'_id': 0, '__v': 0, 'createTime': 0})
			.exec()

		if (!oldSkill) {
			throw new Error('目标不存在!')
		}

		// 采用toObject方法会出现空数组丢失问题, 换用Object.assign
		const data = Object.assign({}, requestBody)

		if (data.skillId) {
			delete data.skillId
		}
		if (data.createTime) {
			delete data.createTime
		}
		data.modifyTime = Date.now()
		const result = await model.Skill.update({
			skillId: +id
		}, {$set: data}).exec()

		if (!result.n) {
			throw new Error('修改技能失败! 请重新尝试!')
		}

		const messageData = PokeData.PBSkill
			.encode(new PokeData.PBSkill(Object.assign({}, JSON.parse(JSON.stringify(oldSkill)), data, {
				createTime: dateToTime(oldSkill.createTime)
			}))).finish()
		const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
			messageData,
			responseTime: Date.now()
		})).finish()

		ctx.response.body = res
	}

	// TODO 完成搜索技能接口
	static async searchSkills(ctx, next) {

	}
}

export default Skill
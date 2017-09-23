import {PokeData} from '../../common/model'
import {expect} from 'chai'
import server from '../../bin/www'
import request from 'supertest'
import protobuf from 'protobufjs/minimal'

describe('Person', () => {
	it('测试添加人物', done => {

		const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJ1c2VybmFtZSI6Im1vY2hhIiwiYXZhdGFyIjpudWxsLCJsYXN0TG9naW5UaW1lIjoiMjAxNy0wOS0xMFQxNToxNzoyOS40MTZaIiwicm9sZSI6MywiaWF0IjoxNTA1MDU2NjQ5fQ.LVblwrCiQ5qqaRhvM2RfYysgaDa-jbbC6U4TCEmfEjg'

		const body = {
			name: '菊子4',
			aliasName: ['喜久子', '纪久子'],
			sex: PokeData.PBSex.FEMALE,
			others: [{
				key: '擅长属性',
				value: '幽灵'
			}, {
				key: '家乡',
				value: '未知'
			}, {
				key: '家乡所在地',
				value: '关都地区或城都地区'
			}, {
				key: '眼睛颜色',
				value: '黑色'
			}, {
				key: '头发颜色',
				value: '灰金色'
			}],
			pokemons: [{
				person: {
					identity: '四天王',
					name: '菊子'
				},
				place: '石英高原',
				version: [{
					name: '精灵宝可梦火红叶绿版',
					abstr: '火红'
				}, {
					name: '精灵宝可梦火红叶绿版',
					abstr: '叶绿'
				}],
				pokemons: [{
					name: '耿鬼',
					icon: 'https://s0.52poke.wiki/assets/sprite/sm/icon_161118.png',
					properties: ['幽灵', '毒'],
					feature: ['漂浮'],
					sex: [PokeData.PBSex.FEMALE],
					level: 54,
					skills: [{
						name: '奇异之光',
						property: '幽灵'
					}, {
						name: '暗影拳',
						property: '幽灵'
					}, {
						name: '影子分身',
						property: '一般'
					}, {
						name: '剧毒',
						property: '毒'
					}]
				}, {
					name: '大嘴蝠',
					icon: 'https://s0.52poke.wiki/assets/sprite/sm/icon_161118.png',
					properties: ['毒', '飞行'],
					sex: [PokeData.PBSex.FEMALE],
					level: 54,
					feature: ['精神力'],
					skills: [{
						name: '奇异之光',
						property: '幽灵'
					}, {
						name: '咬住',
						property: '恶'
					}, {
						name: '空气利刃',
						property: '飞行'
					}, {
						name: '剧毒牙',
						property: '毒'
					}]
				}, {
					name: '耿鬼',
					icon: 'https://s0.52poke.wiki/assets/sprite/sm/icon_161118.png',
					properties: ['幽灵', '毒'],
					sex: [PokeData.PBSex.FEMALE],
					level: 58,
					feature: ['漂浮'],
					item: {
						name: '文柚果',
						icon: 'https://wiki.52poke.com/wiki/文柚果（道具）'
					},
					skills: [{
						name: '暗影球',
						property: '幽灵'
					}, {
						name: '污泥炸弹',
						property: '毒'
					}, {
						name: '催眠术',
						property: '超能'
					}, {
						name: '噩梦',
						property: '幽灵'
					}]
				}],
				money: {
					way: '单打对战',
					value: 5800
				}
			}]
		}

		const requestBody = PokeData.PBPerson.encode(new PokeData.PBPerson(body)).finish()
		const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
			messageType: PokeData.PBMessageType.ADD_PERSON,
			requestBody,
			requestTime: Date.now()
		})).finish()

		request(server)
			.post('/person/add')
			.set('Content-Type', 'application/octet-stream')
			.set('authorization', `Bearer ${token}`)
			.send(req)
			.expect(200)
			.end((err, res) => {
				if (err) {
					done(err)
					return
				}
				done()
			})
	})

	it('测试修改人物', done => {

		const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJ1c2VybmFtZSI6Im1vY2hhIiwiYXZhdGFyIjpudWxsLCJsYXN0TG9naW5UaW1lIjoiMjAxNy0wOS0xMFQxNToxNzoyOS40MTZaIiwicm9sZSI6MywiaWF0IjoxNTA1MDU2NjQ5fQ.LVblwrCiQ5qqaRhvM2RfYysgaDa-jbbC6U4TCEmfEjg'

		const id = 10

		const body = {
			name: '菊子3',
			aliasName: ['喜久子', '纪久子'],
			sex: PokeData.PBSex.FEMALE,
			others: [{
				key: '擅长属性',
				value: '幽灵'
			}, {
				key: '家乡',
				value: '未知'
			}, {
				key: '家乡所在地',
				value: '关都地区或城都地区'
			}, {
				key: '眼睛颜色',
				value: '黑色'
			}, {
				key: '头发颜色',
				value: '灰金色'
			}, {
				key: '道馆',
				value: '常磐道馆'
			}],
			pokemons: [],
			visible: false
		}

		const requestBody = PokeData.PBPerson.encode(new PokeData.PBPerson(body)).finish()
		const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
			messageType: PokeData.PBMessageType.UPDATE_PERSON,
			requestBody,
			requestTime: Date.now()
		})).finish()

		request(server)
			.post(`/person/${id}`)
			.set('Content-Type', 'application/octet-stream')
			.set('authorization', `Bearer ${token}`)
			.send(req)
			.expect(200)
			.end((err, res) => {
				if (err) {
					done(err)
					return
				}

				const response = PokeData.PBMessageRes.decode(res.body)
				const messageData = PokeData.PBPerson.decode(response.messageData)
				console.log(messageData)

				done()
			})
	})

	it('测试删除人物', done => {

		const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJ1c2VybmFtZSI6Im1vY2hhIiwiYXZhdGFyIjpudWxsLCJsYXN0TG9naW5UaW1lIjoiMjAxNy0wOS0xMFQxNToxNzoyOS40MTZaIiwicm9sZSI6MywiaWF0IjoxNTA1MDU2NjQ5fQ.LVblwrCiQ5qqaRhvM2RfYysgaDa-jbbC6U4TCEmfEjg'

		const id = 4

		const requestBody = PokeData.PBIdObject.encode(new PokeData.PBIdObject({
			id
		})).finish()
		const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
			messageType: PokeData.PBMessageType.REMOVE_PERSON,
			requestBody,
			requestTime: Date.now()
		})).finish()

		request(server)
			.post('/person/remove')
			.set('Content-Type', 'application/octet-stream')
			.set('authorization', `Bearer ${token}`)
			.send(req)
			.expect(200)
			.end((err, res) => {
				if (err) {
					done(err)
					return
				}
				done()
			})
	})

	it('测试根据id获取人物', done => {

		const id = 3

		const requestBody = PokeData.PBIdObject.encode(new PokeData.PBIdObject({
			id
		})).finish()
		const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
			messageType: PokeData.PBMessageType.GET_PERSON_BY_ID,
			requestBody,
			requestTime: Date.now()
		})).finish()
		const base64Req = protobuf.util.base64.encode(req, 0, req.length)

		request(server)
			.get(`/person/${id}`)
			.set('Content-Type', 'application/octet-stream')
			.query(base64Req)
			.expect(200)
			.end((err, res) => {
				if (err) {
					done(err)
					return
				}
				const response = PokeData.PBMessageRes.decode(res.body)
				const messageData = PokeData.PBPerson.decode(response.messageData)
				console.log(messageData)
				done()
			})
	})

	it('测试获取人物列表', done => {

		const body = {
			visible: true,
			offset: 0,
			limit: 20
		}

		const requestBody = PokeData.PBListReq.encode(new PokeData.PBListReq(body)).finish()
		const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
			messageType: PokeData.PBMessageType.GET_PERSONS,
			requestBody,
			requestTime: Date.now()
		})).finish()
		const base64Req = protobuf.util.base64.encode(req, 0, req.length)

		request(server)
			.get('/person/all')
			.set('Content-Type', 'application/octet-stream')
			.query(base64Req)
			.expect(200)
			.end((err, res) => {
				if (err) {
					done(err)
					return
				}
				const response = PokeData.PBMessageRes.decode(res.body)
				const messageData = PokeData.PBPersonList.decode(response.messageData)
				console.log(messageData.persons)
				done()
			})
	})

	// TODO 完成搜索人物测试单元
	it('测试搜索人物', done => {

	})

})
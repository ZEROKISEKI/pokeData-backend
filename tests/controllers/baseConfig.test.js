import {PokeData} from '../../common/model'
import {expect} from 'chai'
import server from '../../bin/www'
import request from 'supertest'
import protobuf from 'protobufjs/minimal'

describe('BaseConfig', () => {
	it('测试获取游戏版本', done => {

		const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJ1c2VybmFtZSI6Im1vY2hhIiwiYXZhdGFyIjpudWxsLCJsYXN0TG9naW5UaW1lIjoiMjAxNy0wOS0xMFQxNToxNzoyOS40MTZaIiwicm9sZSI6MywiaWF0IjoxNTA1MDU2NjQ5fQ.LVblwrCiQ5qqaRhvM2RfYysgaDa-jbbC6U4TCEmfEjg`

		const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
			messageType: PokeData.PBMessageType.GET_VERSIONS,
			requestTime: Date.now()
		})).finish()
		const base64Req = protobuf.util.base64.encode(req, 0, req.length)

		request(server)
			.get('/base/version')
			.set('Content-Type', 'application/octet-stream')
			.set('authorization', `Bearer ${token}`)
			.query(base64Req)
			.expect(200)
			.end((err, res) => {

				if (err) {
					done(err)
					return
				}

				const response = PokeData.PBMessageRes.decode(res.body)
				const messageData = PokeData.PBVersionList.toObject(PokeData.PBVersionList.decode(response.messageData))
				console.log(messageData)

				done()
			})
	})

	it('测试添加游戏版本', done => {

		const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJ1c2VybmFtZSI6Im1vY2hhIiwiYXZhdGFyIjpudWxsLCJsYXN0TG9naW5UaW1lIjoiMjAxNy0wOS0xMFQxNToxNzoyOS40MTZaIiwicm9sZSI6MywiaWF0IjoxNTA1MDU2NjQ5fQ.LVblwrCiQ5qqaRhvM2RfYysgaDa-jbbC6U4TCEmfEjg`

		const body = {
			name: '精灵宝可梦皮卡丘版',
			abstr: '皮卡丘',
			generation: 1,
			font: '#A68C21',
			background: '#FFE57A'
		}

		const requestBody = PokeData.PBVersion.encode(new PokeData.PBVersion(body)).finish()
		const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
			requestBody,
			messageType: PokeData.PBMessageType.ADD_VERSION,
			requestTime: Date.now()
		})).finish()

		request(server)
			.post('/base/version/add')
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

	it('测试修改游戏版本', done => {

		const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJ1c2VybmFtZSI6Im1vY2hhIiwiYXZhdGFyIjpudWxsLCJsYXN0TG9naW5UaW1lIjoiMjAxNy0wOS0xMFQxNToxNzoyOS40MTZaIiwicm9sZSI6MywiaWF0IjoxNTA1MDU2NjQ5fQ.LVblwrCiQ5qqaRhvM2RfYysgaDa-jbbC6U4TCEmfEjg`

		const id = 1

		const body = {
			font: '#A60B0B',
			background: '#FF6464'
		}

		const requestBody = PokeData.PBVersion.encode(new PokeData.PBVersion(body)).finish()
		const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
			messageType: PokeData.PBMessageType.UPDATE_VERSION,
			requestBody,
			requestTime: Date.now()
		})).finish()

		request(server)
			.post(`/base/version/update/${id}`)
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
				const messageData = PokeData.PBVersion.decode(response.messageData)
				console.log(messageData)

				done()
			})
	})

	it('测试删除游戏版本', done => {

		const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJ1c2VybmFtZSI6Im1vY2hhIiwiYXZhdGFyIjpudWxsLCJsYXN0TG9naW5UaW1lIjoiMjAxNy0wOS0xMFQxNToxNzoyOS40MTZaIiwicm9sZSI6MywiaWF0IjoxNTA1MDU2NjQ5fQ.LVblwrCiQ5qqaRhvM2RfYysgaDa-jbbC6U4TCEmfEjg`

		const id = 2

		const requestBody = PokeData.PBIdObject.encode(new PokeData.PBIdObject({
			id
		})).finish()
		const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
			messageType: PokeData.PBMessageType.REMOVE_VERSION,
			requestBody,
			requestTime: Date.now()
		})).finish()

		request(server)
			.post('/base/version/remove')
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

	it('测试获取蛋群', done => {
		const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJ1c2VybmFtZSI6Im1vY2hhIiwiYXZhdGFyIjpudWxsLCJsYXN0TG9naW5UaW1lIjoiMjAxNy0wOS0xMFQxNToxNzoyOS40MTZaIiwicm9sZSI6MywiaWF0IjoxNTA1MDU2NjQ5fQ.LVblwrCiQ5qqaRhvM2RfYysgaDa-jbbC6U4TCEmfEjg`

		const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
			messageType: PokeData.PBMessageType.GET_EGGGROUPS,
			requestTime: Date.now()
		})).finish()
		const base64Req = protobuf.util.base64.encode(req, 0, req.length)

		request(server)
			.get('/base/egg')
			.set('Content-Type', 'application/octet-stream')
			.set('authorization', `Bearer ${token}`)
			.query(base64Req)
			.expect(200)
			.end((err, res) => {

				if (err) {
					done(err)
					return
				}

				const response = PokeData.PBMessageRes.decode(res.body)
				const messageData = PokeData.PBEggGroupList
					.toObject(PokeData.PBEggGroupList.decode(response.messageData))
				console.log(messageData)

				done()
			})
	})

	it('测试添加蛋群', done => {

		const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJ1c2VybmFtZSI6Im1vY2hhIiwiYXZhdGFyIjpudWxsLCJsYXN0TG9naW5UaW1lIjoiMjAxNy0wOS0xMFQxNToxNzoyOS40MTZaIiwicm9sZSI6MywiaWF0IjoxNTA1MDU2NjQ5fQ.LVblwrCiQ5qqaRhvM2RfYysgaDa-jbbC6U4TCEmfEjg`

		const body = {
			name: '水中1'
		}

		const requestBody = PokeData.PBEggGroup.encode(new PokeData.PBEggGroup(body)).finish()
		const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
			messageType: PokeData.PBMessageType.ADD_EGGGROUP,
			requestBody,
			requestTime: Date.now()
		})).finish()

		request(server)
			.post('/base/egg/add')
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

	it('测试修改蛋群', done => {

		const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJ1c2VybmFtZSI6Im1vY2hhIiwiYXZhdGFyIjpudWxsLCJsYXN0TG9naW5UaW1lIjoiMjAxNy0wOS0xMFQxNToxNzoyOS40MTZaIiwicm9sZSI6MywiaWF0IjoxNTA1MDU2NjQ5fQ.LVblwrCiQ5qqaRhvM2RfYysgaDa-jbbC6U4TCEmfEjg`

		const id = 1

		const body = {
			background: '#d25064',
			border: '#933846'
		}

		const requestBody = PokeData.PBEggGroup.encode(new PokeData.PBEggGroup(body)).finish()
		const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
			messageType: PokeData.PBMessageType.UPDATE_EGGGROUP,
			requestBody,
			requestTime: Date.now()
		})).finish()

		request(server)
			.post(`/base/egg/update/${id}`)
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
				const messageData = PokeData.PBEggGroup.decode(response.messageData)
				console.log(messageData)

				done()
			})
	})

	it('测试删除蛋群', done => {
		const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJ1c2VybmFtZSI6Im1vY2hhIiwiYXZhdGFyIjpudWxsLCJsYXN0TG9naW5UaW1lIjoiMjAxNy0wOS0xMFQxNToxNzoyOS40MTZaIiwicm9sZSI6MywiaWF0IjoxNTA1MDU2NjQ5fQ.LVblwrCiQ5qqaRhvM2RfYysgaDa-jbbC6U4TCEmfEjg`

		const id = 3

		const requestBody = PokeData.PBIdObject.encode(new PokeData.PBIdObject({
			id
		})).finish()
		const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
			messageType: PokeData.PBMessageType.REMOVE_EGGGROUP,
			requestBody,
			requestTime: Date.now()
		})).finish()

		request(server)
			.post('/base/egg/remove')
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

	it('测试获取属性', done => {
		const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJ1c2VybmFtZSI6Im1vY2hhIiwiYXZhdGFyIjpudWxsLCJsYXN0TG9naW5UaW1lIjoiMjAxNy0wOS0xMFQxNToxNzoyOS40MTZaIiwicm9sZSI6MywiaWF0IjoxNTA1MDU2NjQ5fQ.LVblwrCiQ5qqaRhvM2RfYysgaDa-jbbC6U4TCEmfEjg`

		const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
			messageType: PokeData.PBMessageType.GET_PROPERTIES,
			requestTime: Date.now()
		})).finish()
		const base64Req = protobuf.util.base64.encode(req, 0, req.length)

		request(server)
			.get('/base/property')
			.set('Content-Type', 'application/octet-stream')
			.set('authorization', `Bearer ${token}`)
			.query(base64Req)
			.expect(200)
			.end((err, res) => {

				if (err) {
					done(err)
					return
				}

				const response = PokeData.PBMessageRes.decode(res.body)
				const messageData = PokeData.PBPropertyList
					.toObject(PokeData.PBPropertyList.decode(response.messageData))
				console.log(messageData)

				done()
			})
	})

	it('测试添加属性', done => {

		const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJ1c2VybmFtZSI6Im1vY2hhIiwiYXZhdGFyIjpudWxsLCJsYXN0TG9naW5UaW1lIjoiMjAxNy0wOS0xMFQxNToxNzoyOS40MTZaIiwicm9sZSI6MywiaWF0IjoxNTA1MDU2NjQ5fQ.LVblwrCiQ5qqaRhvM2RfYysgaDa-jbbC6U4TCEmfEjg`

		const body = {
			name: '格斗',
			background: '#BB5544',
			border: '#912E1E'
		}

		const requestBody = PokeData.PBProperty.encode(new PokeData.PBProperty(body)).finish()
		const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
			messageType: PokeData.PBMessageType.ADD_PROPERTY,
			requestBody,
			requestTime: Date.now()
		})).finish()

		request(server)
			.post('/base/property/add')
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

	it('测试修改属性', done => {

		const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJ1c2VybmFtZSI6Im1vY2hhIiwiYXZhdGFyIjpudWxsLCJsYXN0TG9naW5UaW1lIjoiMjAxNy0wOS0xMFQxNToxNzoyOS40MTZaIiwicm9sZSI6MywiaWF0IjoxNTA1MDU2NjQ5fQ.LVblwrCiQ5qqaRhvM2RfYysgaDa-jbbC6U4TCEmfEjg`

		const id = 2

		const body = {
			background: '#FF4422',
			border: '#BA1F00'
		}

		const requestBody = PokeData.PBProperty.encode(new PokeData.PBProperty(body)).finish()
		const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
			messageType: PokeData.PBMessageType.UPDATE_PROPERTY,
			requestBody,
			requestTime: Date.now()
		})).finish()

		request(server)
			.post(`/base/property/update/${id}`)
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
				const messageData = PokeData.PBEggGroup.decode(response.messageData)
				console.log(messageData)

				done()
			})
	})

	it('测试删除属性', done => {
		const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJ1c2VybmFtZSI6Im1vY2hhIiwiYXZhdGFyIjpudWxsLCJsYXN0TG9naW5UaW1lIjoiMjAxNy0wOS0xMFQxNToxNzoyOS40MTZaIiwicm9sZSI6MywiaWF0IjoxNTA1MDU2NjQ5fQ.LVblwrCiQ5qqaRhvM2RfYysgaDa-jbbC6U4TCEmfEjg`

		const id = 3

		const requestBody = PokeData.PBIdObject.encode(new PokeData.PBIdObject({
			id
		})).finish()
		const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
			messageType: PokeData.PBMessageType.REMOVE_PROPERTY,
			requestBody,
			requestTime: Date.now()
		})).finish()

		request(server)
			.post('/base/property/remove')
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

	it('测试添加特性', done => {

		const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJ1c2VybmFtZSI6Im1vY2hhIiwiYXZhdGFyIjpudWxsLCJsYXN0TG9naW5UaW1lIjoiMjAxNy0wOS0xMFQxNToxNzoyOS40MTZaIiwicm9sZSI6MywiaWF0IjoxNTA1MDU2NjQ5fQ.LVblwrCiQ5qqaRhvM2RfYysgaDa-jbbC6U4TCEmfEjg`

		const body = {
			name: '太阳之力',
			description: '晴朗天气时，特攻会提高，而每回合ＨＰ会减少。',
			effect: [
				'大晴天和大日照天气下特攻增至1.5倍，但每回合损失最大ＨＰ的1⁄8。'
			]
		}

		const requestBody = PokeData.PBFeature.encode(new PokeData.PBFeature(body)).finish()
		const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
			messageType: PokeData.PBMessageType.ADD_FEATURE,
			requestBody,
			requestTime: Date.now()
		})).finish()

		request(server)
			.post('/base/feature/add')
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

	it('测试删除特性', done => {

		const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJ1c2VybmFtZSI6Im1vY2hhIiwiYXZhdGFyIjpudWxsLCJsYXN0TG9naW5UaW1lIjoiMjAxNy0wOS0xMFQxNToxNzoyOS40MTZaIiwicm9sZSI6MywiaWF0IjoxNTA1MDU2NjQ5fQ.LVblwrCiQ5qqaRhvM2RfYysgaDa-jbbC6U4TCEmfEjg`

		const id = 4

		const requestBody = PokeData.PBIdObject.encode(new PokeData.PBIdObject({
			id
		})).finish()
		const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
			messageType: PokeData.PBMessageType.REMOVE_FEATURE,
			requestBody,
			requestTime: Date.now()
		})).finish()

		request(server)
			.post('/base/feature/remove')
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

	it('测试根据ID获取特性', done => {

		const id = 3

		const requestBody = PokeData.PBIdObject.encode(new PokeData.PBIdObject({
			id
		})).finish()
		const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
			messageType: PokeData.PBMessageType.GET_FEATURE_BY_ID,
			requestBody,
			requestTime: Date.now()
		})).finish()
		const base64Req = protobuf.util.base64.encode(req, 0, req.length)

		request(server)
			.get(`/base/feature/${id}`)
			.set('Content-Type', 'application/octet-stream')
			.query(base64Req)
			.expect(200)
			.end((err, res) => {
				if (err) {
					done(err)
					return
				}
				const response = PokeData.PBMessageRes.decode(res.body)
				const messageData = PokeData.PBFeature.decode(response.messageData)
				console.log(messageData)
				done()
			})
	})

	it('测试获取特性列表', done => {
		const body = {
			visible: true,
			offset: 0,
			limit: 20
		}

		const requestBody = PokeData.PBListReq.encode(new PokeData.PBListReq(body)).finish()
		const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
			messageType: PokeData.PBMessageType.GET_FEATURES,
			requestBody,
			requestTime: Date.now()
		})).finish()
		const base64Req = protobuf.util.base64.encode(req, 0, req.length)

		request(server)
			.get('/base/feature')
			.set('Content-Type', 'application/octet-stream')
			.query(base64Req)
			.expect(200)
			.end((err, res) => {
				if (err) {
					done(err)
					return
				}
				const response = PokeData.PBMessageRes.decode(res.body)
				const messageData = PokeData.PBFeatureList.decode(response.messageData)
				console.log(messageData.features)
				done()
			})
	})

	it('测试修改特性', done => {

		const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJ1c2VybmFtZSI6Im1vY2hhIiwiYXZhdGFyIjpudWxsLCJsYXN0TG9naW5UaW1lIjoiMjAxNy0wOS0xMFQxNToxNzoyOS40MTZaIiwicm9sZSI6MywiaWF0IjoxNTA1MDU2NjQ5fQ.LVblwrCiQ5qqaRhvM2RfYysgaDa-jbbC6U4TCEmfEjg`

		const id = 2

		const body = {
			visible: false
		}

		const requestBody = PokeData.PBFeature.encode(new PokeData.PBFeature(body)).finish()
		const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
			messageType: PokeData.PBMessageType.UPDATE_FEATURE,
			requestBody,
			requestTime: Date.now()
		})).finish()

		request(server)
			.post(`/base/feature/update/${id}`)
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
				const messageData = PokeData.PBFeature.decode(response.messageData)
				console.log(messageData)

				done()
			})
	})

})
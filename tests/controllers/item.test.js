import {PokeData} from '../../common/model'
import {expect} from 'chai'
import server from '../../bin/www'
import request from 'supertest'
import protobuf from 'protobufjs/minimal'

describe('Item', () => {
  it('测试添加道具', done => {

	const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJ1c2VybmFtZSI6Im1vY2hhIiwiYXZhdGFyIjpudWxsLCJsYXN0TG9naW5UaW1lIjoiMjAxNy0wOS0xMFQxNToxNzoyOS40MTZaIiwicm9sZSI6MywiaWF0IjoxNTA1MDU2NjQ5fQ.LVblwrCiQ5qqaRhvM2RfYysgaDa-jbbC6U4TCEmfEjg`

	const body = {
	  name: '白银喷雾',
	  aliasName: ['白銀噴霧器'],
	  description: '弱小的野生宝可梦将完全不会出现。效果比除虫喷雾更持久。',
	  result: ['使用后在200步之内不会遇见比队伍中第一只宝可梦等级低的野生宝可梦。'],
	  scene: true,
	  appearance: ['红', '绿', '蓝'],
	  pay: 500,
	  sale: 250,
	  visible: true,
	  obtain: {
		one: [{
		  version: [{
			name: '精灵宝可梦红宝石蓝宝石版',
			abstr: '红宝石'
		  }, {
			name: '精灵宝可梦红宝石蓝宝石版',
			abstr: '蓝宝石'
		  }, {
			name: '精灵宝可梦绿宝石版',
			abstr: '绿宝石'
		  }],
		  way: '１１３号道路，１１９号道路，１２３号道路，送火山'
		}, {
		  version: [{
			name: '精灵宝可梦钻石珍珠版',
			abstr: '钻石'
		  }, {
			name: '精灵宝可梦钻石珍珠版',
			abstr: '珍珠'
		  }, {
			name: '精灵宝可梦白金版',
			abstr: '白金'
		  }],
		  way: '２０５号道路，２０６号道路，２０９号道路（隐藏）Pt，２１０号道路'
		}, {
		  version: [{
			name: '精灵宝可梦心金魂银版',
			abstr: '心金'
		  }, {
			name: '精灵宝可梦心金魂银版',
			abstr: '魂银'
		  }],
		  way: '漩涡列岛（隐藏），光辉灯塔'
		}, {
		  version: [{
			name: '精灵宝可梦黑版2 / 白版2',
			abstr: '黑2'
		  }, {
			name: '精灵宝可梦黑版2 / 白版2',
			abstr: '白2'
		  }],
		  way: '乔英大道'
		}],
		repeat: [{
		  version: [{
			name: '精灵宝可梦红绿蓝版',
			abstr: '红'
		  }, {
			name: '精灵宝可梦红绿蓝版',
			abstr: '绿'
		  }, {
			name: '精灵宝可梦红绿蓝版',
			abstr: '蓝'
		  }, {
			name: '精灵宝可梦皮卡丘版',
			abstr: '皮卡丘'
		  }],
		  way: '紫苑镇，浅红市友好商店，彩虹百货公司'
		}, {
		  version: [{
			name: '精灵宝可梦金银版',
			abstr: '金'
		  }, {
			name: '精灵宝可梦金银版',
			abstr: '银'
		  }, {
			name: '精灵宝可梦水晶版',
			abstr: '水晶'
		  }],
		  way: '浅黄市，卡吉镇，尼比市，华蓝市，彩虹市友好商店'
		}]
	  }
	}

	body.obtain.one = body.obtain.one.map(item => {
	  item.version = item.version.map(version => {
		return new PokeData.PBVersion(version)
	  })
	  return new PokeData.PBItemObtain.PBObtainContent(item)
	})

	body.obtain.repeat = body.obtain.repeat.map(item => {
	  item.version = item.version.map(version => {
		return new PokeData.PBVersion(version)
	  })
	  return new PokeData.PBItemObtain.PBObtainContent(item)
	})

	body.obtain = new PokeData.PBItemObtain(body.obtain)

	const requestBody = PokeData.PBItem.encode(new PokeData.PBItem(body)).finish()

	const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
	  messageType: PokeData.PBMessageType.ADD_ITEM,
	  requestBody,
	  requestTime: Date.now()
	})).finish()

	request(server)
	  .post('/item/add')
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

  it('测试删除道具', done => {

	const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJ1c2VybmFtZSI6Im1vY2hhIiwiYXZhdGFyIjpudWxsLCJsYXN0TG9naW5UaW1lIjoiMjAxNy0wOS0xMFQxNToxNzoyOS40MTZaIiwicm9sZSI6MywiaWF0IjoxNTA1MDU2NjQ5fQ.LVblwrCiQ5qqaRhvM2RfYysgaDa-jbbC6U4TCEmfEjg`

	const id = 8;

	const requestBody = PokeData.PBIdObject.encode(new PokeData.PBIdObject({
	  id
	})).finish()
	const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
	  messageType: PokeData.PBMessageType.REMOVE_ITEM,
	  requestBody,
	  requestTime: Date.now()
	})).finish()

	request(server)
	  .post('/item/remove')
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

  it('测试根据ID获取道具', done => {
	const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJ1c2VybmFtZSI6Im1vY2hhIiwiYXZhdGFyIjpudWxsLCJsYXN0TG9naW5UaW1lIjoiMjAxNy0wOS0xMFQxNToxNzoyOS40MTZaIiwicm9sZSI6MywiaWF0IjoxNTA1MDU2NjQ5fQ.LVblwrCiQ5qqaRhvM2RfYysgaDa-jbbC6U4TCEmfEjg`
	const id = 7

	const requestBody = PokeData.PBIdObject.encode(new PokeData.PBIdObject({
	  id
	})).finish()
	const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
	  messageType: PokeData.PBMessageType.GET_ITEM_BY_ID,
	  requestBody,
	  requestTime: Date.now()
	})).finish()
	const base64Req = protobuf.util.base64.encode(req, 0, req.length)

	request(server)
	  .get(`/item/${id}`)
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
		const messageData = PokeData.PBItem.toObject(PokeData.PBItem.decode(response.messageData))

		console.log(messageData.obtain.one[0], messageData.obtain.one)

		done()
	  })
  })

  it('测试获取道具', done => {
	const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJ1c2VybmFtZSI6Im1vY2hhIiwiYXZhdGFyIjpudWxsLCJsYXN0TG9naW5UaW1lIjoiMjAxNy0wOS0xMFQxNToxNzoyOS40MTZaIiwicm9sZSI6MywiaWF0IjoxNTA1MDU2NjQ5fQ.LVblwrCiQ5qqaRhvM2RfYysgaDa-jbbC6U4TCEmfEjg`

	const body = {
	  offset: 0,
	  limit: 20
	}

	const requestBody = PokeData.PBListReq.encode(new PokeData.PBListReq(body)).finish()
	const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
	  messageType: PokeData.PBMessageType.GET_ITEMS,
	  requestBody,
	  requestTime: Date.now()
	})).finish()
	const base64Req = protobuf.util.base64.encode(req, 0, req.length)

	request(server)
	  .get('/item/all')
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
		const messageData = PokeData.PBItemList.decode(response.messageData)
		console.log(messageData.items)

		done()
	  })
  })

  it('测试修改道具', done => {
	const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJ1c2VybmFtZSI6Im1vY2hhIiwiYXZhdGFyIjpudWxsLCJsYXN0TG9naW5UaW1lIjoiMjAxNy0wOS0xMFQxNToxNzoyOS40MTZaIiwicm9sZSI6MywiaWF0IjoxNTA1MDU2NjQ5fQ.LVblwrCiQ5qqaRhvM2RfYysgaDa-jbbC6U4TCEmfEjg`
	const id = 8

	const body = {
	  name: '白银喷器',
	  description: '弱小的野生宝可梦将完全不会出现。效果比除虫喷雾更持久些。',
	  result: ['使用后在200步之内不会遇见比队伍中第一只宝可梦等级低的野生宝可梦。', '测试特殊效果'],
	  scene: true,
	  appearance: ['心金', '魂银'],
	  pay: 550,
	  sale: 300,
	  visible: false,
	  obtain: {
		one: [{
		  version: [{
			name: '精灵宝可梦心金魂银版',
			abstr: '心金'
		  }, {
			name: '精灵宝可梦心金魂银版',
			abstr: '魂银'
		  }],
		  way: '漩涡列岛（隐藏），光辉灯塔'
		}, {
		  version: [{
			name: '精灵宝可梦黑版2 / 白版2',
			abstr: '黑2'
		  }, {
			name: '精灵宝可梦黑版2 / 白版2',
			abstr: '白2'
		  }],
		  way: '乔英大道'
		}],
		repeat: [{
		  version: [{
			name: '精灵宝可梦心金魂银版',
			abstr: '心金'
		  }, {
			name: '精灵宝可梦心金魂银版',
			abstr: '魂银'
		  }],
		  way: '全部的友好商店（获得3个徽章后），满金百货大楼'
		}]
	  }
	}

	const requestBody = PokeData.PBItem.encode(new PokeData.PBItem(body)).finish()
	const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
	  messageType: PokeData.PBMessageType.UPDATE_ITEM,
	  requestBody,
	  requestTime: Date.now()
	})).finish()

	request(server)
	  .post(`/item/${id}`)
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
		const messageData = PokeData.PBItem.decode(response.messageData)
		console.log(messageData)

		done()

	  })
  })

  // TODO 测试搜索道具
  it('测试搜索道具', done => {

  })
})
import {expect} from 'chai';
import request from 'supertest'
import server from '../../bin/www'
import {PokeData} from '../../common/model'
import protobuf from 'protobufjs/minimal'

describe('Pokemon', () => {
  it.only('测试添加宝可梦', done => {

    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJ1c2VybmFtZSI6Im1vY2hhIiwiYXZhdGFyIjpudWxsLCJsYXN0TG9naW5UaW1lIjoiMjAxNy0wOS0xMFQxNToxNzoyOS40MTZaIiwicm9sZSI6MywiaWF0IjoxNTA1MDU2NjQ5fQ.LVblwrCiQ5qqaRhvM2RfYysgaDa-jbbC6U4TCEmfEjg`

    const body = {
      number: 3,
      name: '妙蛙花',
      aliasName: ['奇異種子', '妙蛙種子'],
      properties: ['草', '毒'],
      features: [{
        name: '茂盛',
        description: 'ＨＰ减少的时候，草属性的招式威力会提高。'
      }],
      specialFeature: {
        name: '叶绿素',
        description: '晴朗天气时，速度会提高。'
      },
      sex: {
        male: 87.5,
        female: 12.5
      },
      capture: {
        percent: 5.9,
        point: 45
      },
      weight: 6.9,
      high: 0.7,
      hatch: {
        period: 20,
        step: 5140
      },
      eggGroups: ['怪兽', '植物'],
      point: {
        hp: 0,
        atk: 0,
        def: 0,
        specAtk: 1,
        specDef: 0,
        spd: 0
      },
      racePoint: {
        base: {
          hp: 45,
          atk: 49,
          def: 49,
          specAtk: 65,
          specDef: 65,
          spd: 45
        },
        level50: {
          hp: {min: 105, max: 152},
          atk: {min: 48, max: 111},
          def: {min: 48, max: 111},
          specAtk: {min: 63, max: 128},
          specDef: {min: 63, max: 128},
          spd: {min: 45, max: 106}
        },
        level100: {
          hp: {min: 200, max: 294},
          atk: {min: 92, max: 216},
          def: {min: 92, max: 216},
          specAtk: {min: 121, max: 251},
          specDef: {min: 121, max: 251},
          spd: {min: 85, max: 207}
        }
      },
      phase: [{
        condition: ['草', '毒', '第一世代'],
        properties: [{
          name: '一般',
          value: '1'
        }, {
          name: '格斗',
          value: '1/2'
        }, {
          name: '飞行',
          value: '2'
        }]
      }],
      skill: {
        levelWay: [{
          generation: 7,
          skills: [{
            level: 0,
            name: '撞击',
            property: '一般',
            kind: PokeData.PBSkillKind.PHYSICAL,
            power: 40,
            hit: 100,
            pp: 35
          }, {
            level: 3,
            name: '叫声',
            property: '一般',
            kind: PokeData.PBSkillKind.CHANGED,
            hit: 100,
            pp: 40
          }]
        }],
        itemWay: [{
          generation: 7,
          skills: [{
            number: 10,
            name: '觉醒力量',
            property: '一般',
            kind: PokeData.PBSkillKind.SPECIAL,
            power: 60,
            hit: 100,
            pp: 15
          }]
        }],
        inheritWay: [{
          generation: 7,
          skills: [{
            parents: [{
              name: '臭臭花',
              icon: 'https://s0.52poke.wiki/assets/sprite/sm/icon_161118.png'
            }, {
              name: '藤藤蛇',
              icon: 'https://s0.52poke.wiki/assets/sprite/sm/icon_161118.png'
            }],
            name: '终极吸取',
            property: '草',
            kind: PokeData.PBSkillKind.SPECIAL,
            power: 75,
            hit: 100,
            pp: 10
          }]
        }],
        learnWay: [{
          generation: 7,
          skills: [{
            version: [{
              name: '精灵宝可梦 太阳/月亮',
              abstr: '太阳'
            }, {
              name: '精灵宝可梦 太阳/月亮',
              abstr: '月亮'
            }],
            name: '草之誓约',
            property: '草',
            kind: PokeData.PBSkillKind.SPECIAL,
            power: 80,
            hit: 100,
            pp: 10
          }]
        }]
      },
      evolution: [{
        chains: [{
          name: '妙蛙种子',
          image: 'wiki/thumb/b/b8/001Bulbasaur_Dream.png/120px-001.png',
          properties: ['草', '毒'],
          children: [{
            name: '妙蛙草',
            condition: {
              description: '🉐️等级16',
              item: {
                name: '神奇糖果',
                icon: 'https://s1.52poke.wiki/wiki/f/ff/Bag_神奇糖果_Sprite.png'
              }
            }
          }]
        }, {
          name: '妙蛙草',
          image: 'wiki/thumb/9/9c/002Ivysaur_Dream.png/120px-002.png',
          properties: ['草', '毒'],
          children: [{
            name: '妙蛙花',
            condition: {
              description: '🉐️等级32',
              item: {
                name: '神奇糖果',
                icon: 'https://s1.52poke.wiki/wiki/f/ff/Bag_神奇糖果_Sprite.png'
              }
            }
          }]
        }, {
          name: '妙蛙花',
          image: 'wiki/thumb/9/9c/002Ivysaur_Dream.png/120px-003.png',
          properties: ['草', '毒'],
        }]
      }],
    }

    const requestBody = PokeData.PBPokemon.encode(new PokeData.PBPokemon(body)).finish()
    const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
      messageType: PokeData.PBMessageType.ADD_POKEMON,
      requestBody,
      requestTime: Date.now()
    })).finish()

    request(server)
      .post('/pokemon/add')
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

  it('测试删除宝可梦', done => {

    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJ1c2VybmFtZSI6Im1vY2hhIiwiYXZhdGFyIjpudWxsLCJsYXN0TG9naW5UaW1lIjoiMjAxNy0wOS0xMFQxNToxNzoyOS40MTZaIiwicm9sZSI6MywiaWF0IjoxNTA1MDU2NjQ5fQ.LVblwrCiQ5qqaRhvM2RfYysgaDa-jbbC6U4TCEmfEjg`

    const id = 2

    const requestBody = PokeData.PBIdObject.encode(new PokeData.PBIdObject({
      id
    })).finish()
    const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
      messageType: PokeData.PBMessageType.REMOVE_POKEMON,
      requestBody,
      requestTime: Date.now()
    })).finish()

    request(server)
      .post('/pokemon/remove')
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

  it('测试根据ID获取宝可梦', done => {

    const id = 3

    const requestBody = PokeData.PBIdObject.encode(new PokeData.PBIdObject({
      id
    })).finish()
    const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
      messageType: PokeData.PBMessageType.GET_POKEMON_BY_ID,
      requestBody,
      requestTime: Date.now()
    })).finish()
    const base64Req = protobuf.util.base64.encode(req, 0, req.length)

    request(server)
      .get(`/pokemon/${id}`)
      .set('Content-Type', 'application/octet-stream')
      .query(base64Req)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err)
          return
        }
        const response = PokeData.PBMessageRes.decode(res.body)
        const messageData = PokeData.PBPokemon.decode(response.messageData)
        console.log(PokeData.PBPokemon.toObject(messageData))
        done()
      })
  })

  it('测试获取宝可梦列表', done => {

    const body = {
      visible: true,
      offset: 0,
      limit: 20
    }

    const requestBody = PokeData.PBListReq.encode(new PokeData.PBListReq(body)).finish()
    const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
      messageType: PokeData.PBMessageType.GET_POKEMONS,
      requestBody,
      requestTime: Date.now()
    })).finish()
    const base64Req = protobuf.util.base64.encode(req, 0, req.length)

    request(server)
      .get('/pokemon/all')
      .set('Content-Type', 'application/octet-stream')
      .query(base64Req)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err)
          return
        }
        const response = PokeData.PBMessageRes.decode(res.body)
        const messageData = PokeData.PBPokemonList.decode(response.messageData)
        console.log(messageData.pokemons)
        done()
      })
  })

  it('测试修改宝可梦', done => {
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJ1c2VybmFtZSI6Im1vY2hhIiwiYXZhdGFyIjpudWxsLCJsYXN0TG9naW5UaW1lIjoiMjAxNy0wOS0xMFQxNToxNzoyOS40MTZaIiwicm9sZSI6MywiaWF0IjoxNTA1MDU2NjQ5fQ.LVblwrCiQ5qqaRhvM2RfYysgaDa-jbbC6U4TCEmfEjg`

    const id = 10

    const body = {}

    const requestBody = PokeData.PBPokemon.encode(new PokeData.PBPokemon(body)).finish()
    const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
      messageType: PokeData.PBMessageType.UPDATE_POKEMON,
      requestBody,
      requestTime: Date.now()
    })).finish()

    request(server)
      .post(`/pokemon/${id}`)
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
        const messageData = PokeData.PBPokemon.decode(response.messageData)
        console.log(messageData)

        done()
      })
  })

  // TODO 完成搜索宝可梦测试单元
  it('测试搜索宝可梦', done => {

  })

})
import {expect} from 'chai'
import request from 'supertest'
import server from '../../bin/www'
import {PokeData} from '../../common/model'
import protobuf from 'protobufjs/minimal'

describe('Skill', () => {

  it('测试添加技能', done => {

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJ1c2VybmFtZSI6Im1vY2hhIiwiYXZhdGFyIjpudWxsLCJsYXN0TG9naW5UaW1lIjoiMjAxNy0wOS0xMFQxNToxNzoyOS40MTZaIiwicm9sZSI6MywiaWF0IjoxNTA1MDU2NjQ5fQ.LVblwrCiQ5qqaRhvM2RfYysgaDa-jbbC6U4TCEmfEjg'

    const body = {
      number: 92,
      name: '挖洞1',
      aliasName: ['挖地洞', '遁地'],
      property: '地面',
      kind: PokeData.PBSkillKind.PHYSICAL,
      description: '第１回合钻入，第２回合攻击对手。',
      power: 80,
      hit: 100,
      pp: {
        base: 10,
        max: 16
      },
      features: [
        '是接触类招式',
        '受守住影响',
        '不受魔法反射影响',
        '不可以被抢夺',
        '受鹦鹉学舌影响',
        '受王者之证等类似道具影响',
        '可以在对战外使用'
      ],
      effect: [
        '使用挖洞的宝可梦在第一回合潜入地下进行蓄力，第二回合发动攻击。',
        '蓄气的回合会进行行动判定，成功发出招式则消耗ＰＰ。进行蓄力时不能下达指令。',
        '攻击的回合会进行行动判定，出现不能行动的情况则攻击取消，攻击动作不消耗ＰＰ。',
        '携带强力香草，可以在蓄力结束后立刻发动攻击，不多消耗一回合。',
        '对使用挖洞的宝可梦（无论当回合是在进行蓄力或进行攻击）使用突袭都能成功，但是否命中需要另外计算。',
        '该招式无法被梦话发动。',
        '在洞穴之类的地点使用，可使主角立即回到洞穴的入口。'
      ],
      range: PokeData.PBSkillRange.TO_ONE,
      zSkill: {
        crystal: '地面Ｚ',
        name: '地隆啸天大终结',
        power: '160'
      },
      pokemons: {
        level: [{
          number: 27,
          name: '穿山鼠',
          icon: 'https://s0.52poke.wiki/assets/sprite/sm/icon_161118.png',
          properties: ['地面'],
          generations: [{
            number: 5,
            value: [{
              version: [{
                name: '精灵宝可梦黑版2 / 白版2',
                abstr: '黑2'
              }, {
                name: '精灵宝可梦黑版2 / 白版2',
                abstr: '白2'
              }],
              level: 30
            }]
          }, {
            number: 6,
            value: [{
              version: [{
                name: '精灵宝可梦 X‧Y',
                abstr: 'X'
              }, {
                name: '精灵宝可梦 X‧Y',
                abstr: 'Y'
              }, {
                name: '精灵宝可梦 终极红宝石‧始源蓝宝石',
                abstr: '终极红宝石'
              }, {
                name: '精灵宝可梦 终极红宝石‧始源蓝宝石',
                abstr: '始源蓝宝石'
              }],
              level: 30
            }]
          }, {
            number: 7,
            value: [{
              version: [{
                name: '精灵宝可梦 太阳 / 月亮',
                abstr: '太阳'
              }, {
                name: '精灵宝可梦 太阳 / 月亮',
                abstr: '月亮'
              }],
              level: 30
            }]
          }]
        }],
        inherit: [{
          number: 98,
          name: '大钳蟹',
          icon: 'https://s0.52poke.wiki/assets/sprite/sm/icon_161118.png',
          properties: ['水'],
          generations: [{
            number: 2,
            parents: [{
              name: '化石盔',
              icon: 'https://s0.52poke.wiki/assets/sprite/sm/icon_161118.png'
            }]
          }, {
            number: 3,
            parents: [{
              name: '化石盔',
              icon: 'https://s0.52poke.wiki/assets/sprite/sm/icon_161118.png'
            }]
          }, {
            number: 4,
            parents: [{
              name: '化石盔',
              icon: 'https://s0.52poke.wiki/assets/sprite/sm/icon_161118.png'
            }]
          }]
        }],
        item: [{
          number: 4,
          name: '小火龙',
          icon: 'https://s0.52poke.wiki/assets/sprite/sm/icon_161118.png',
          properties: ['火'],
          generations: [{
            number: 1,
            items: [28]
          }, {
            number: 2,
            items: [28]
          }, {
            number: 3,
            items: [28]
          }, {
            number: 4,
            items: [28]
          }, {
            number: 5,
            items: [28]
          }, {
            number: 6,
            items: [28]
          }]
        }],
        learn: [{
          number: 4,
          name: '小火龙',
          icon: 'https://s0.52poke.wiki/assets/sprite/sm/icon_161118.png',
          properties: ['火'],
          generations: [{
            number: 4,
          }, {
            number: 5
          }, {
            number: 6
          }]
        }],
        others: [{
          generation: 4,
          data: [{
            number: 239,
            name: '电击怪',
            icon: 'https://s0.52poke.wiki/assets/sprite/sm/icon_161118.png',
            properties: ['电'],
            way: '宝可计步器 - 住宅地、交流之原'
          }]
        }, {
          generation: 5,
          data: [{
            number: 56,
            name: '猴怪',
            icon: 'https://s0.52poke.wiki/assets/sprite/sm/icon_161118.png',
            properties: ['电'],
            way: '梦境世界 - 崎岖山脉'
          }, {
            number: 165,
            name: '芭瓢虫',
            icon: 'https://s0.52poke.wiki/assets/sprite/sm/icon_161118.png',
            properties: ['虫', '飞行'],
            way: '梦境世界 - 广阔天空'
          }]
        }]
      }
    }

    const requestBody = PokeData.PBSkill.encode(new PokeData.PBSkill(body)).finish()
    const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
      messageType: PokeData.PBMessageType.ADD_SKILL,
      requestBody,
      requestTime: Date.now()
    })).finish()

    request(server)
      .post('/skill/add')
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

  it('测试删除技能', done => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJ1c2VybmFtZSI6Im1vY2hhIiwiYXZhdGFyIjpudWxsLCJsYXN0TG9naW5UaW1lIjoiMjAxNy0wOS0xMFQxNToxNzoyOS40MTZaIiwicm9sZSI6MywiaWF0IjoxNTA1MDU2NjQ5fQ.LVblwrCiQ5qqaRhvM2RfYysgaDa-jbbC6U4TCEmfEjg'

    const id = 2

    const requestBody = PokeData.PBIdObject.encode(new PokeData.PBIdObject({
      id
    })).finish()
    const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
      messageType: PokeData.PBMessageType.REMOVE_SKILL,
      requestBody,
      requestTime: Date.now()
    })).finish()

    request(server)
      .post('/skill/remove')
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

  it('测试根据ID获取技能', done => {
    const id = 1

    const requestBody = PokeData.PBIdObject.encode(new PokeData.PBIdObject({
      id
    })).finish()
    const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
      messageType: PokeData.PBMessageType.GET_SKILL_BY_ID,
      requestBody,
      requestTime: Date.now()
    })).finish()
    const base64Req = protobuf.util.base64.encode(req, 0, req.length)

    request(server)
      .get(`/skill/${id}`)
      .set('Content-Type', 'application/octet-stream')
      .query(base64Req)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err)
          return
        }
        const response = PokeData.PBMessageRes.decode(res.body)
        const messageData = PokeData.PBSkill.decode(response.messageData)
        console.log(messageData, PokeData.PBSkill.toObject(messageData))
        done()
      })
  })


  it('测试获取技能列表', done => {
    const body = {
      visible: true,
      offset: 0,
      limit: 20
    }

    const requestBody = PokeData.PBListReq.encode(new PokeData.PBListReq(body)).finish()
    const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
      messageType: PokeData.PBMessageType.GET_SKILLS,
      requestBody,
      requestTime: Date.now()
    })).finish()
    const base64Req = protobuf.util.base64.encode(req, 0, req.length)

    request(server)
      .get('/skill/all')
      .set('Content-Type', 'application/octet-stream')
      .query(base64Req)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err)
          return
        }
        const response = PokeData.PBMessageRes.decode(res.body)
        const messageData = PokeData.PBSkillList.decode(response.messageData)
        console.log(messageData.skills)
        done()
      })
  })

  it('测试修改技能', done => {

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJ1c2VybmFtZSI6Im1vY2hhIiwiYXZhdGFyIjpudWxsLCJsYXN0TG9naW5UaW1lIjoiMjAxNy0wOS0xMFQxNToxNzoyOS40MTZaIiwicm9sZSI6MywiaWF0IjoxNTA1MDU2NjQ5fQ.LVblwrCiQ5qqaRhvM2RfYysgaDa-jbbC6U4TCEmfEjg'

    const id = 3;

    const body = {
      number: 93,
      name: '挖洞2',
      aliasName: ['挖地洞', '遁地'],
      property: '地面',
      kind: PokeData.PBSkillKind.PHYSICAL,
      description: '第１回合钻入，第２回合攻击对手。',
      power: 80,
      hit: 100,
      pp: {
        base: 10,
        max: 16
      },
      features: [
        '是接触类招式',
        '受守住影响',
        '不受魔法反射影响',
        '不可以被抢夺',
        '受鹦鹉学舌影响',
        '受王者之证等类似道具影响',
        '可以在对战外使用'
      ],
      effect: [
        '使用挖洞的宝可梦在第一回合潜入地下进行蓄力，第二回合发动攻击。',
        '蓄气的回合会进行行动判定，成功发出招式则消耗ＰＰ。进行蓄力时不能下达指令。',
        '攻击的回合会进行行动判定，出现不能行动的情况则攻击取消，攻击动作不消耗ＰＰ。',
        '携带强力香草，可以在蓄力结束后立刻发动攻击，不多消耗一回合。',
        '对使用挖洞的宝可梦（无论当回合是在进行蓄力或进行攻击）使用突袭都能成功，但是否命中需要另外计算。',
        '该招式无法被梦话发动。',
        '在洞穴之类的地点使用，可使主角立即回到洞穴的入口。'
      ],
      range: PokeData.PBSkillRange.TO_ONE,
      zSkill: {
        crystal: '地面Ｚ',
        name: '地隆啸天大终结',
        power: '160'
      },
      pokemons: {
        level: [{
          number: 27,
          name: '穿山鼠',
          icon: 'https://s0.52poke.wiki/assets/sprite/sm/icon_161118.png',
          properties: ['地面'],
          generations: [{
            number: 5,
            value: [{
              version: [{
                name: '精灵宝可梦黑版2 / 白版2',
                abstr: '黑2'
              }, {
                name: '精灵宝可梦黑版2 / 白版2',
                abstr: '白2'
              }],
              level: 30
            }]
          }, {
            number: 6,
            value: [{
              version: [{
                name: '精灵宝可梦 X‧Y',
                abstr: 'X'
              }, {
                name: '精灵宝可梦 X‧Y',
                abstr: 'Y'
              }, {
                name: '精灵宝可梦 终极红宝石‧始源蓝宝石',
                abstr: '终极红宝石'
              }, {
                name: '精灵宝可梦 终极红宝石‧始源蓝宝石',
                abstr: '始源蓝宝石'
              }],
              level: 30
            }]
          }, {
            number: 7,
            value: [{
              version: [{
                name: '精灵宝可梦 太阳 / 月亮',
                abstr: '太阳'
              }, {
                name: '精灵宝可梦 太阳 / 月亮',
                abstr: '月亮'
              }],
              level: 30
            }]
          }]
        }],
        inherit: [{
          number: 98,
          name: '大钳蟹',
          icon: 'https://s0.52poke.wiki/assets/sprite/sm/icon_161118.png',
          properties: ['水'],
          generations: [{
            number: 2,
            parents: [{
              name: '化石盔',
              icon: 'https://s0.52poke.wiki/assets/sprite/sm/icon_161118.png'
            }]
          }, {
            number: 3,
            parents: [{
              name: '化石盔',
              icon: 'https://s0.52poke.wiki/assets/sprite/sm/icon_161118.png'
            }]
          }, {
            number: 4,
            parents: [{
              name: '化石盔',
              icon: 'https://s0.52poke.wiki/assets/sprite/sm/icon_161118.png'
            }]
          }]
        }],
        item: [{
          number: 4,
          name: '小火龙',
          icon: 'https://s0.52poke.wiki/assets/sprite/sm/icon_161118.png',
          properties: ['火'],
          generations: [{
            number: 1,
            items: [28]
          }, {
            number: 2,
            items: [28]
          }, {
            number: 3,
            items: [28]
          }, {
            number: 4,
            items: [28]
          }, {
            number: 5,
            items: [28]
          }, {
            number: 6,
            items: [28]
          }]
        }],
        learn: [{
          number: 4,
          name: '小火龙',
          icon: 'https://s0.52poke.wiki/assets/sprite/sm/icon_161118.png',
          properties: ['火'],
          generations: [{
            number: 4,
          }, {
            number: 5
          }, {
            number: 6
          }]
        }],
        others: [{
          generation: 4,
          data: [{
            number: 239,
            name: '电击怪',
            icon: 'https://s0.52poke.wiki/assets/sprite/sm/icon_161118.png',
            properties: ['电'],
            way: '宝可计步器 - 住宅地、交流之原'
          }]
        }, {
          generation: 5,
          data: [{
            number: 56,
            name: '猴怪',
            icon: 'https://s0.52poke.wiki/assets/sprite/sm/icon_161118.png',
            properties: ['电'],
            way: '梦境世界 - 崎岖山脉'
          }, {
            number: 165,
            name: '芭瓢虫',
            icon: 'https://s0.52poke.wiki/assets/sprite/sm/icon_161118.png',
            properties: ['虫', '飞行'],
            way: '梦境世界 - 广阔天空'
          }]
        }]
      },
      visible: false
    }

    const requestBody = PokeData.PBSkill.encode(new PokeData.PBSkill(body)).finish()
    const req = PokeData.PBMessageReq.encode(new PokeData.PBMessageReq({
      messageType: PokeData.PBMessageType.UPDATE_SKILL,
      requestBody,
      requestTime: Date.now()
    })).finish()

    request(server)
      .post(`/skill/${id}`)
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
        const messageData = PokeData.PBSkill.decode(response.messageData)
        console.log(messageData)

        done()
      })
  })

  // TODO 完成搜索技能测试单元
  it('测试搜索技能', done => {

  })

})
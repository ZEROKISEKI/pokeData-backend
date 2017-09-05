import { expect } from 'chai';
import request from 'supertest'
import server from '../../bin/www'


describe('Pokemon', () => {
  it('测试添加宝可梦', async () => {
	/* const res = await request(server)
      .post('/add')
      .send({
        number: 1,
		name: '妙蛙种子',
		properties: ['草', '毒'],
		features: [{
          name: '茂盛',
          description: 'ＨＰ减少的时候，草属性的招式威力会提高。'
        }],
		specialFeatures: {
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
		egg: ['怪兽群', '植物群'],
        point: {
		  specAtk: 1
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
            hp: { min: 105, max: 152 },
            atk: { min: 48, max: 111 },
            def: { min: 48, max: 111 },
            specAtk: { min: 63, max: 128 },
            specDef: { min: 63, max: 128 },
            spd: { min: 45, max: 106 },
          },
          level100: {
			hp: { min: 200, max: 294 },
			atk: { min: 92, max: 216 },
			def: { min: 92, max: 216 },
			specAtk: { min: 121, max: 251 },
			specDef: { min: 121, max: 251 },
			spd: { min: 85, max: 207 },
          }
        },
        mega: [],
        special: [],
		phase: [{
		  condition: ['草', '毒', ''],
		  properties: [
		    { name: '一般', value: 1 },
            { name: '格斗', value: 0.5 },
            { name: '飞行', value: 2 },
            { name: '毒', value: 1 },
            { name: '地面', value: 1 },
            { name: '岩石', value: 1 },
            { name: '虫', value: 1 },
            { name: '幽灵', value: 1 },
            { name: '钢', value: 1 },
            { name: '火', value: 2 },
            { name: '水', value: 0.5 },
            { name: '草', value: 0.25 },
            { name: '电', value: 0.5 },
            { name: '超能流', value: 2 },
            { name: '冰', value: 2 },
            { name: '龙', value: 1 },
            { name: '恶', value: 1 },
            { name: '妖精', value: 0.5 }
          ]
        }, {
		  condition: ['草', '毒', 'Gen1'],
		  properties: [
			{ name: '一般', value: 1 },
			{ name: '格斗', value: 0.5 },
			{ name: '飞行', value: 2 },
			{ name: '毒', value: 1 },
			{ name: '地面', value: 1 },
			{ name: '岩石', value: 1 },
			{ name: '虫', value: 4 },
			{ name: '幽灵', value: 1 },
			{ name: '钢' },
			{ name: '火', value: 2 },
			{ name: '水', value: 0.5 },
			{ name: '草', value: 0.25 },
			{ name: '电', value: 0.5 },
			{ name: '超能流', value: 2 },
			{ name: '冰', value: 2 },
			{ name: '龙', value: 1 },
			{ name: '恶' },
			{ name: '妖精' }
          ]
        }],
		skills: [{

        }],
        evolution: [{
          chains: [{
            name: '',
            image: ''
          }]
        }],
		specialEvolution: []
      })
      .expect(200)

    expect(res.text).to.be.equal('添加宝可梦成功') */
  })
})
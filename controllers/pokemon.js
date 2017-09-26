import * as model from '../models'
import {PokeData} from '../common/model'
import {dateToTime} from '../utils/moment'

class Pokemon {

  static async getPokemonById(ctx, next) {
    ctx.msgType = PokeData.PBMessageType.GET_POKEMON_BY_ID
    await next()
    const req = ctx.pb.req
    const {id} = PokeData.PBIdObject.toObject(PokeData.PBIdObject.decode(req.requestBody))
    const pokemon = await model.Pokemon
      .findOne({pokemonId: id})
      .select({
        '_id': 0,
        '__v': 0
      })
      .exec()
    if (!pokemon) {
      throw new Error('宝可梦不存在!')
    }
    const messageData = PokeData.PBPokemon
      .encode(new PokeData.PBPokemon(Object.assign({}, JSON.parse(JSON.stringify(pokemon)), {
        createTime: dateToTime(pokemon.createTime),
        modifyTime: pokemon.modifyTime ? dateToTime(pokemon.modifyTime) : null
      }))).finish()
    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      messageData,
      responseTime: Date.now()
    })).finish()

    ctx.response.body = res
  }

  static async getPokemons(ctx, next) {
    ctx.msgType = PokeData.PBMessageType.GET_POKEMONS
    await next()
    const req = ctx.pb.req
    const {offset = 0, limit = 20, visible} = PokeData.PBListReq.toObject(PokeData.PBListReq.decode(req.requestBody))
    const pokemons = await model.Pokemon
      .find()
      .select({
        '_id': 0,
        '__v': 0,
      })
      .skip(offset)
      .limit(limit)
      .exec()
    let data = pokemons.map(pokemon => new PokeData.PBPokemon(Object.assign({}, JSON.parse(JSON.stringify(pokemon)), {
      createTime: dateToTime(pokemon.createTime),
      modifyTime: pokemon.modifyTime ? dateToTime(pokemon.modifyTime) : null
    })))

    if (typeof visible !== 'undefined') {
      data = data.filter(item => item.visible === visible)
    }

    const messageData = PokeData.PBPokemonList.encode(new PokeData.PBPokemonList({
      pokemons: data,
      offset,
      limit
    })).finish()
    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      messageData,
      responseTime: Date.now()
    })).finish()
    ctx.response.body = res
  }

  static async addPokemon(ctx, next) {
    if (ctx.state.user.role === PokeData.PBUserRole.NORMAL_USER) {
      ctx.status = 401
      throw new Error('普通用户不可进行此操作!')
    }
    ctx.msgType = PokeData.PBMessageType.ADD_POKEMON
    await next()
    const req = ctx.pb.req
    const requestBody = PokeData.PBPokemon.toObject(PokeData.PBPokemon.decode(req.requestBody))

    const pokemon = new model.Pokemon(Object.assign({
      createTime: Date.now()
    }, requestBody))

    await pokemon.validate()
    await pokemon.save()

    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      responseTime: Date.now()
    })).finish()

    ctx.response.body = res
  }

  static async removePokemon(ctx, next) {
    if (ctx.state.user.role === PokeData.PBUserRole.NORMAL_USER) {
      ctx.status = 401
      throw new Error('普通用户不可进行此操作!')
    }
    ctx.msgType = PokeData.PBMessageType.REMOVE_POKEMON
    await next()
    const req = ctx.pb.req
    const {id} = PokeData.PBIdObject.toObject(PokeData.PBIdObject.decode(req.requestBody))
    const {result} = await model.Pokemon.remove({pokemonId: id}).exec()
    if (!result.n) {
      throw new Error('宝可梦不存在!')
    }

    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      responseTime: Date.now()
    })).finish()

    ctx.response.body = res
  }

  static async updatePokemonById(ctx, next) {
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

    ctx.msgType = PokeData.PBMessageType.UPDATE_POKEMON
    await next()
    const req = ctx.pb.req
    const requestBody = PokeData.PBPokemon.decode(req.requestBody)
    const {id} = ctx.params
    const oldPokemon = await model.Pokemon
      .findOne({pokemonId: +id})
      .select({'_id': 0, '__v': 0, 'createTime': 0})
      .exec()

    if (!oldPokemon) {
      throw new Error('宝可梦不存在!')
    }

    // 采用toObject方法会出现空数组丢失问题, 换用Object.assign
    const data = Object.assign({}, requestBody)

    if (data.pokemonId) {
      delete data.pokemonId
    }
    if (data.createTime) {
      delete data.createTime
    }
    data.modifyTime = Date.now()
    const result = await model.Pokemon.update({
      pokemonId: +id
    }, {$set: data}).exec()

    if (!result.n) {
      throw new Error('修改宝可梦失败! 请重新尝试!')
    }

    const messageData = PokeData.PBPokemon
      .encode(new PokeData.PBPokemon(Object.assign({}, JSON.parse(JSON.stringify(oldPokemon)), data, {
        createTime: dateToTime(oldPokemon.createTime)
      }))).finish()
    const res = PokeData.PBMessageRes.encode(new PokeData.PBMessageRes({
      messageData,
      responseTime: Date.now()
    })).finish()

    ctx.response.body = res
  }

  // TODO 搜索宝可梦接口
  static async searchPokemons(ctx, next) {

  }
}

export default Pokemon
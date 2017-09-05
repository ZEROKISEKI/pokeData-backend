import * as model from '../models'

// 普通的增删查改操作
class Pokemon {

  static async getPokemonById(ctx) {
	if (!id || Object.is(NaN, +id)) {
	  throw new Error('id不能为空或非数字!')
	}
	const pokemon = await model.Pokemon.findOne({id: ctx.params.id})
	console.log('pokemon', pokemon)
	ctx.body = '获取数据成功'
  }

  static async getPokemons(ctx) {
	const { offset = 0, limit = 20 } = ctx.query
	const pokemons = await model.Pokemon.find().skip(offset).limit(limit)
	console.log('pokemons', pokemons)
	ctx.body = '获取数据成功'
  }

  static async searchPokemons(ctx) {

  }

  static async updatePokemonById(ctx) {

  }

  static async addPokemon(ctx) {
	const data = ctx.request.body
	const pokemon = new model.Pokemon(data)
	await pokemon.validate()
	await pokemon.save()
	ctx.body = '添加宝可梦成功~'
  }

  static async removePokemon(ctx) {
	const { id } = ctx.params

	if (!id || Object.is(NaN, +id)) {
	  throw new Error('id不能为空或非数字!')
	}

	await model.Pokemon.remove({ id })
	ctx.body = '删除宝可梦成功~'
  }
}

export default Pokemon
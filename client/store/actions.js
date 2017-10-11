import sendRequest from '../utils/pbHandler'
import * as type from './mutations'
import { PokeData } from '../../common/model'
import jwtDecode from 'jwt-decode'

export default {

  async login({ commit }, { username, password }) {

    const requestBody = PokeData.PBUserReq.encode(new PokeData.PBUserReq({
      username,
      password
    })).finish()

    commit(type.LOADING, false)
    const user = await sendRequest('/user/login',
      PokeData.PBMessageType.USER_LOGIN, requestBody, 'PBUser', 'post')
    commit(type.LOGIN, user)
    commit(type.LOADING, true)
    return user
  },

  async register({ commit }, { username, password, inviteCode }) {

    const requestBody = PokeData.PBUserReq.encode(new PokeData.PBUserReq({
      username,
      password,
      inviteCode
    })).finish()

    commit(type.LOADING, false)
    await sendRequest('/user/register',
      PokeData.PBMessageType.USER_REGISTER, requestBody, null, 'post')
    commit(type.LOADING, true)
  },

  logged({ commit }) {
    commit(type.LOADING, false)
    const token = localStorage.getItem('jwt')
    if (!token) {
      commit(type.LOGGED)
      commit(type.LOADING, true)
    } else {
      try {
        const payload = jwtDecode(token)
        commit(type.LOGGED, payload)
        commit(type.LOADING, true)
      } catch (err) {
        commit(type.LOGGED)
        commit(type.LOADING, true)
      }
    }
  },

  // TODO actions 测试获取宝可梦列表
  async FetchPokemons({ commit }, { visible, offset = 0, limit = 20 }) {
    commit(type.LOADING, false)
    const requestBody = PokeData.PBListReq.encode(new PokeData.PBListReq({
      visible,
      offset,
      limit
    })).finish()
    const pokemons = await sendRequest('/pokemon/all',
      PokeData.PBMessageType.GET_POKEMONS, requestBody, 'PBPokemonList')
    commit(type.FETCHPOKEMONS, pokemons)
    commit(type.LOADING, true)
    return pokemons
  },

  // TODO actions 测试获取宝可梦(id)
  async FetchPokemon({ commit }, id) {
    commit(type.LOADING, false)
    const requestBody = PokeData.PBIdObject.encode(new PokeData.PBIdObject({
      id
    })).finish()
    const pokemon = await sendRequest(`/pokemon/${id}`,
      PokeData.PBMessageType.GET_POKEMON_BY_ID, requestBody, 'PBPokemon')
    commit(type.LOADING, true)
    return pokemon
  },

  // TODO actions 测试添加宝可梦
  async AddPokemon({ commit }, pokemon) {
    commit(type.LOADING, false)
    const requestBody = PokeData.PBPokemon.encode(new PokeData.PBPokemon(pokemon)).finish()
    await sendRequest('/pokemon/add', PokeData.PBMessageType.ADD_POKEMON, requestBody, null, 'post')
    commit(type.LOADING, true)
  },

  // TODO actions 测试删除宝可梦
  async RemovePokemon({ commit }, id) {
    commit(type.LOADING, false)
    const requestBody = PokeData.PBIdObject.encode(new PokeData.PBIdObject({ id })).finish()
    await sendRequest('/pokemon/remove',
      PokeData.PBMessageType.REMOVE_POKEMON, requestBody, null, 'post')
    commit(type.LOADING, true)
  },

  // TODO actions 测试修改宝可梦
  async UpdatePokemon({ commit }, { pokemon, id }) {
    commit(type.LOADING, false)
    const requestBody = PokeData.PBPokemon.encode(new PokeData.PBPokemon(pokemon)).finish()
    const newPokemon = await sendRequest(`/pokemon/${id}`,
      PokeData.PBMessageType.UPDATE_POKEMON, requestBody, 'PBPokemon', 'post')
    commit(type.LOADING, true)
    return newPokemon
  },

  async FetchItems({ commit }, { visible, offset = 0, limit = 20 }) {
    commit(type.LOADING, false)
    const requestBody = PokeData.PBListReq.encode(new PokeData.PBListReq({
      visible,
      offset,
      limit
    })).finish()
    const items = await sendRequest('/item/all',
      PokeData.PBMessageType.GET_ITEMS, requestBody, 'PBItemList')
    commit(type.FETCHITEMS, items)
    commit(type.LOADING, false)
    return items
  },

  async FetchItem({ commit }, id) {
    commit(type.LOADING, false)
    const requestBody = PokeData.PBIdObject.encode(new PokeData.PBIdObject({ id })).finish()
    const item = await sendRequest(`/item/${id}`,
      PokeData.PBMessageType.GET_ITEM_BY_ID, requestBody, 'PBItem')
    commit(type.FETCHITEM, item)
    commit(type.LOADING, true)
    return item
  },

  // TODO 测试添加道具
  async AddItem({ commit }, item) {
    commit(type.LOADING, false)
    const requestBody = PokeData.PBItem.encode(new PokeData.PBItem(item)).finish()
    await sendRequest('/item/add', PokeData.PBMessageType.ADD_ITEM, requestBody, null, 'post')
    commit(type.LOADING, true)
  },

  // TODO 测试获取人物列表
  async FetchPersons({ commit }, { visible, offset = 0, limit = 20 }) {
    commit(type.LOADING, false)
    const requestBody = PokeData.PBListReq.encode(new PokeData.PBListReq({
      visible,
      offset,
      limit
    })).finish()
    const persons = await sendRequest('/person/all',
      PokeData.PBMessageType.GET_PERSONS, requestBody, 'PBPersonList')
    commit(type.FETCHPERSONS, persons)
    commit(type.LOADING, true)
    return persons
  },

  // TODO 测试获取人物(id)
  async FetchPerson({ commit }, id) {
    commit(type.LOADING, false)
    const requestBody = PokeData.PBIdObject.encode(new PokeData.PBIdObject({ id })).finish()
    const person = await sendRequest(`/person/${id}`,
      PokeData.PBMessageType.GET_PERSON_BY_ID, requestBody, 'PBPerson')
    commit(type.FETCHPERSON, person)
    commit(type.LOADING, true)
    return person
  },

  // TODO 测试添加人物
  async AddPerson({ commit }, person) {
    commit(type.LOADING, false)
    const requestBody = PokeData.PBPerson.encode(new PokeData.PBPerson(person)).finish()
    await sendRequest('/person/add', PokeData.PBMessageType.ADD_PERSON, requestBody, null, 'post')
    commit(type.LOADING, true)
  },

  // TODO 测试删除人物
  async RemovePerson({ commit }, id) {
    commit(type.LOADING, false)
    const requestBody = PokeData.PBPerson.encode(new PokeData.PBPerson(person)).finish()
    await sendRequest('/person/remove',
      PokeData.PBMessageType.REMOVE_PERSON, requestBody, null, 'post')
    commit(type.LOADING, true)
  },

  async FetchVersions({ commit }) {
    commit(type.LOADING, false)
    const versions = await sendRequest('/base/version',
      PokeData.PBMessageType.GET_VERSIONS, null, 'PBVersionList')
    commit(type.FETCHVERSIONS, versions)
    commit(type.LOADING, true)
    return versions
  },

  async FetchVersion({ commit }, id) {
    commit(type.LOADING, false)
    const requestBody = PokeData.PBIdObject.encode(new PokeData.PBIdObject({ id })).finish()
    const version = await sendRequest(`/base/version/${id}`,
      PokeData.PBMessageType.GET_VERSION_BY_ID, requestBody, 'PBVersion')
    commit(type.FETCHVERSION, version)
    commit(type.LOADING, true)
    return version
  },

  async UpdateVersion({ commit }, { id, version }) {
    commit(type.LOADING, false)
    const requestBody = PokeData.PBVersion.encode(new PokeData.PBVersion(version)).finish()
    const result = await sendRequest(`/base/version/update/${id}`,
      PokeData.PBMessageType.UPDATE_VERSION, requestBody, 'PBVersion', 'post')
    commit(type.UPDATEVERSION, result)
    commit(type.LOADING, true)
    return result
  },

  async AddVersion({ commit }, version) {
    commit(type.LOADING, false)
    const requestBody = PokeData.PBVersion.encode(new PokeData.PBVersion(version)).finish()
    await sendRequest('/base/version/add',
      PokeData.PBMessageType.ADD_VERSION, requestBody, null, 'post')
    commit(type.LOADING, true)
  },

  async RemoveVersion({ commit }, id) {
    commit(type.LOADING, false)
    const requestBody = PokeData.PBIdObject.encode(new PokeData.PBIdObject({ id })).finish()
    await sendRequest('/base/version/remove',
      PokeData.PBMessageType.REMOVE_VERSION, requestBody, null, 'post')
    commit(type.LOADING, true)
  },

}
import {
  FETCHVERSIONS,
  FETCHVERSION,
  UPDATEVERSION
} from '../mutations'

export default {
  state: {
    version: {},
    versions: []
  },
  mutations: {
    [FETCHVERSIONS](state, data) {
      state.versions = data.versions
    },
    [FETCHVERSION](state, data) {
      state.version = data
    },
    [UPDATEVERSION](state, data) {
      state.version = data
    }
  }
}
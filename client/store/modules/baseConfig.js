import {
  FETCHVERSIONS,
  FETCHVERSION,
  UPDATEVERSION,
  FETCHEGGGROUPS,
  FETCHEGGGROUP,
  UPDATEEGGGROUP,
  FETCHPROPERTIES,
  FETCHPROPERTY,
  UPDATEPROPERTY,
  FETCHFEATURES,
  FETCHFEATURE,
  UPDATEFEATURE
} from '../mutations'

export default {
  state: {
    version: {},          // 某个游戏版本的数据
    versions: [],         // 游戏版本列表数据
    eggGroup: {},         // 某个蛋群的数据
    eggGroups: [],        // 蛋群列表数据
    property: {},         // 某个属性的数据
    properties: [],       // 属性列表数据
    feature: {},          // 某个特性的数据
    features: [],         // 特性列表数据
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
    },
    [FETCHEGGGROUPS](state, data) {
      state.eggGroups = data.eggGroups
    },
    [FETCHEGGGROUP](state, data) {
      state.eggGroup = data
    },
    [UPDATEEGGGROUP](state, data) {
      state.eggGroup = data
    },
    [FETCHPROPERTIES](state, data) {
      state.properties = data.properties
    },
    [FETCHPROPERTY](state, data) {
      state.property = data
    },
    [UPDATEPROPERTY](state, data) {
      state.property = data
    },
    [FETCHFEATURES](state, data) {
      state.features = data.features
    },
    [FETCHFEATURE](state, data) {
      state.feature = data
    },
    [UPDATEFEATURE](state, data) {
      state.feature = data
    }
  }
}
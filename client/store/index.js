import common from './modules/common'
import auth from './modules/auth'
import pokemon from './modules/pokemon'
import item from './modules/item'
import person from './modules/person'
import baseConfig from './modules/baseConfig'

import actions from './actions'

export default {
  // 仅在开发模式启动严格模式
  // strict: process.env.NODE_ENV !== 'production',
  modules: {
    common,
    auth,
    pokemon,
    item,
    person,
    baseConfig
  },
  actions
}
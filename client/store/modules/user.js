import {
  FETCHUSERS,
  FETCHUSER,
  UPDATEUSER
} from '../mutations'

export default {
  state: {
    user: {},     // 某个用户
    users: [],    // 用户列表
  },
  mutations: {
    [FETCHUSERS](state, data) {
      state.users = data.users
    },
    [FETCHUSER](state, data) {
      state.user = data
    },
    [UPDATEUSER](state, data) {
      state.user = data
    }
  }
}
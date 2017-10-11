import {
  LOGIN,
  LOGGED
} from '../mutations'

export default {
  state: {
    userId: null,
    username: null,
    avatar: null,
    lastLoginTime: null,
    lastModifyTime: null,
    role: null
  },
  mutations: {
    [LOGIN](state, data) {
      // 考虑换用Object.assign
      state.userId = data.userId
      state.username = data.username
      state.avatar = data.avatar
      state.lastLoginTime = data.lastLoginTime
      state.lastModifyTime = data.lastModifyTime
      state.role = data.role
    },
    [LOGGED](state, data) {
      if (data) {
        state.userId = data.userId
        state.username = data.username
        state.avatar = data.avatar
        state.lastLoginTime = data.lastLoginTime
        state.lastModifyTime = data.lastModifyTime
        state.role = data.role
      }
    }
  }
}
import {
  LOADING
} from '../mutations'


export default {
  state: {
    loadComplete: false
  },
  mutations: {
    [LOADING](state, data) {
      state.loadComplete = data
    }
  }
}
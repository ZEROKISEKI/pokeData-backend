import {
  LOADING,
  UPLOADING
} from '../mutations'


export default {
  state: {
    loadComplete: true,
    uploadComplete: true
  },
  mutations: {
    [LOADING](state, data) {
      state.loadComplete = data
    },
    [UPLOADING](state, data) {
      state.uploadComplete = data
    }
  }
}
import {
  FETCHITEMS,
  FETCHITEM
} from '../mutations'

export default {
  state: {
    items: [],
    item: {}
  },
  mutations: {
    [FETCHITEMS](state, data) {
      state.items = data.items
    },
    [FETCHITEM](state, item) {
      state.item = item
    }
  }
}
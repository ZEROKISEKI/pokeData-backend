import {
  FETCHPERSONS,
  FETCHPERSON
} from '../mutations'

export default {
  state: {
    persons: [],
    person: {}
  },
  mutations: {
    [FETCHPERSONS](state, persons) {
      state.persons = persons
    },
    [FETCHPERSON](state, person) {
      state.person = person
    }
  }
}
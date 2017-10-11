import {
  FETCHPOKEMONS,
  FETCHPOKEMON,
  // ADDPOKEMON
} from '../mutations'

export default {
  state: {
    pokemons: [],
    pokemon: {},
  },
  mutations: {
    [FETCHPOKEMONS](state, pokemons) {
      state.pokemons = pokemons
    },
    [FETCHPOKEMON](state, pokemon) {
      state.pokemon = pokemon
    }
  }
}
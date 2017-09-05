import Router from 'koa-router'
import Pokemon from '../controllers/pokemon'

const router = new Router({
  prefix: '/pokemon'
})

router.get('/', Pokemon.getPokemons)

router.post('/add', Pokemon.addPokemon)

router.get('/search', Pokemon.searchPokemons)

router.post('/update/:id', Pokemon.updatePokemonById)

router.delete('/remove/:id', Pokemon.removePokemon)

router.get('/:id', Pokemon.getPokemonById)

export default router
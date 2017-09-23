import Router from 'koa-router'
import Pokemon from '../controllers/pokemon'
import jwt from '../middlewares/jwt'

const router = new Router({
	prefix: '/pokemon'
})

router.use(jwt({
	path: ['/pokemon/all', '/pokemon/search', /pokemon\/([0-9]+)/]
}))

router.get('/all', Pokemon.getPokemons)
router.get('/search', Pokemon.searchPokemons)

router.post('/add', Pokemon.addPokemon)
router.post('/remove', Pokemon.removePokemon)

router.get('/:id([0-9]+)', Pokemon.getPokemonById)
router.post('/:id([0-9]+)', Pokemon.updatePokemonById)

export default router
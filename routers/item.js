import Router from 'koa-router'
import Item from '../controllers/item'
import jwt from '../middlewares/jwt'

const router = new Router({
	prefix: '/item'
})

router.use(jwt({
	path: []
}))

router.get('/all', Item.getItems)
router.get('/search', Item.searchItems)

router.post('/add', Item.addItem)
router.post('/remove', Item.removeItem)

router.get('/:id([0-9]+)', Item.getItemById)
router.post('/:id([0-9]+)', Item.updateItem)

export default router

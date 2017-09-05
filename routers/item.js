import Router from 'koa-router'
import Item from '../controllers/item'

const router = new Router({
  prefix: '/item'
})

router.get('/:id', Item.getItemById)

export default router

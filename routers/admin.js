import Router from 'koa-router'
import Admin from '../controllers/admin'

const router = new Router({
  'prefix': '/admin'
})

router.post('/register', Admin.register)

router.post('/login', Admin.login)

export default router
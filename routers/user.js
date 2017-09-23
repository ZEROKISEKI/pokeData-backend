import Router from 'koa-router'
import User from '../controllers/user'
import jwt from '../middlewares/jwt'

const router = new Router({
	'prefix': '/user'
})

// 配置不需要进行jwt验证的路由
router.use(jwt({
	path: ['/user/register', '/user/login']
}))

router.get('/setting', User.getMessage)
router.post('/setting', User.updateMessage)

router.get('/all', User.getAllUsers)

router.post('/register', User.register)

router.post('/login', User.login)

router.post('/add', User.addUser)

router.post('/remove', User.removeUser)

router.get('/:id([0-9]+)', User.getUsersById)
router.post('/:id([0-9]+)', User.updateUsersById)

export default router
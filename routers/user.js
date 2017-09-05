import Router from 'koa-router'
import User from '../controllers/user'

const router = new Router({
  'prefix': '/user'
})

router.get('/setting', User.getMessage)
router.post('/setting', User.updateMessage)

router.get('/all', User.getAllUsers)

router.post('/register', User.register)

router.post('/login', User.login)

router.post('/add', User.addUser)

router.post('/remove', User.removeUser)

router.get('/:id', User.getUsersById)
router.post('/:id', User.updateUsersById)


export default router
import Router from 'koa-router'
import jwt from '../middlewares/jwt'
import Person from '../controllers/person'

const router = new Router({
	prefix: '/person'
})

router.use(jwt({
	path: ['/person/all', '/person/search', /person\/([0-9]+)/]
}))

router.get('/all', Person.getAllPersons)
router.get('/search', Person.searchPersons)

router.post('/add', Person.addPerson)
router.post('/remove', Person.removePerson)

router.get('/:id([0-9]+)', Person.getPersonById)
router.post('/:id([0-9]+)', Person.updatePerson)

export default router
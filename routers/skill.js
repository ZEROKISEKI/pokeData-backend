import Router from 'koa-router'
import jwt from '../middlewares/jwt'
import Skill from '../controllers/skill'

const router = new Router({
  prefix: '/skill'
})

router.use(jwt({
  path: ['/skill/all', '/skill/search', /skill\/([0-9]+)/]
}))

router.get('/all', Skill.getAllSkills)
router.get('/search', Skill.searchSkills)

router.post('/add', Skill.addSkill)
router.post('/remove', Skill.removeSkill)

router.get('/:id([0-9]+)', Skill.getSkillById)
router.post('/:id([0-9]+)', Skill.updateSkillById)

export default router
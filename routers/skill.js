import Router from 'koa-router'
import Skill from '../controllers/skill'

const router = new Router({
  prefix: '/skill'
})

router.get('/:id', Skill.getSkillById)

export default router
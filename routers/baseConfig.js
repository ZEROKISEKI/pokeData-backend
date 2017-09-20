import Router from 'koa-router'
import jwt from '../middlewares/jwt'
import BaseConfig from '../controllers/baseConfig'

const router = new Router({
  prefix: '/base'
})

router.use(jwt({
  path: ['/base/egg', '/base/version', '/base/property']
}))

router.get('/egg', BaseConfig.getEggGroups)
router.get('/version',  BaseConfig.getVersions)
router.get('/property', BaseConfig.getProperties)

router.post('/egg/add', BaseConfig.addEggGroup)
router.post('/egg/remove', BaseConfig.removeEggGroup)
router.post('/egg/update', BaseConfig.updateEggGroup)

router.post('/version/add', BaseConfig.addVersion)
router.post('/version/remove', BaseConfig.removeVersion)
router.post('/version/update', BaseConfig.updateVersion)

router.post('/property/add', BaseConfig.addProperty)
router.post('/property/remove', BaseConfig.removeProperty)
router.post('/property/update', BaseConfig.updateProperty)

export default router
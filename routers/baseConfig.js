import Router from 'koa-router'
import jwt from '../middlewares/jwt'
import BaseConfig from '../controllers/baseConfig'

const router = new Router({
  prefix: '/base'
})

router.use(jwt({
  path: ['/base/egg', '/base/version', '/base/property', '/base/feature',
    /base\/(feature|egg|version|property)\/([0-9]+)/, ]
}))

router.get('/egg', BaseConfig.getEggGroups)
router.get('/version', BaseConfig.getVersions)
router.get('/property', BaseConfig.getProperties)
router.get('/feature', BaseConfig.getFeatures)

router.post('/egg/add', BaseConfig.addEggGroup)
router.post('/egg/remove', BaseConfig.removeEggGroup)
router.get('/egg/:id([0-9]+)', BaseConfig.getEggGroupById)
router.post('/egg/update/:id([0-9]+)', BaseConfig.updateEggGroup)

router.post('/version/add', BaseConfig.addVersion)
router.post('/version/remove', BaseConfig.removeVersion)
router.get('/version/:id([0-9]+)', BaseConfig.getVersionById)
router.post('/version/update/:id([0-9]+)', BaseConfig.updateVersion)

router.post('/property/add', BaseConfig.addProperty)
router.post('/property/remove', BaseConfig.removeProperty)
router.get('/property/:id([0-9]+)', BaseConfig.getPropertyById)
router.post('/property/update/:id([0-9]+)', BaseConfig.updateProperty)

router.post('/feature/add', BaseConfig.addFeature)
router.post('/feature/remove', BaseConfig.removeFeature)
router.get('/feature/:id([0-9]+)', BaseConfig.getFeatureById)
router.post('/feature/update/:id([0-9]+)', BaseConfig.updateFeature)

export default router
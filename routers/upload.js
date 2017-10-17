import Router from 'koa-router'
import jwt from '../middlewares/jwt'
import Upload from '../controllers/upload'

const router = new Router({
  prefix: '/upload'
})

router.use(jwt({
  path: []
}))

router.post('/image', Upload.uploadImage)

export default router
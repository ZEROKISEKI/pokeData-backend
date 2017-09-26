// page.js为backend客户端界面入口点

import Router from 'koa-router'

const router = new Router({
  prefix: '/page'
})

// 采用ejs模板引擎, 读取assets.json的静态资源(utils.assetWebpack)
router.get('/all', async ctx => {
  ctx.type = 'text/html'
  ctx.body = await ctx.render('page.html')
})

export default router
import Router from 'koa-router'

const router = Router()

router.get('/*', async (ctx, next) => {
  await ctx.render('index', {
    title: 'RSS Insight'
  })
})

export default router
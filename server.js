import http from 'http'
import Koa from 'koa'
import Router from 'koa-router'
import render from 'koa-ejs'
import logger from 'koa-logger'
import parser from 'koa-bodyparser'
import serve from 'koa-static'

import path from 'path'
import co from 'co'
import errors from './modules/errors.js'

import RssService from './rss-service/transport'

const PORT = process.env.PORT
const app = new Koa()

app.use(serve(path.join(__dirname, 'public')))

render(app, {
  root: path.join(__dirname, 'view'),
  layout: 'template',
  viewExt: 'html',
  cache: false,
  debug: true
})

app.context.render = co.wrap(app.context.render)

app
.use(errors())
// .use(logger())
.use(parser())

// Catch-All Route
app.use(async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello'
  })
})

// save the client side primus code so its available
// to the html page
const server = RssService(http.createServer(app.callback()))

server.listen(PORT, () => {
  console.log(`listening to port *:${PORT}.\npress ctrl + c to cancel.`)
})

export default app

require('babel-polyfill')

import http from 'http'
import path from 'path'
import Koa from 'koa'

import logger from 'koa-logger'
import parser from 'koa-bodyparser'
import serve from 'koa-static'

import errors from './modules/errors.js'
import setupTemplate from './modules/template.js'

import RssService from './rss-service/transport.js'
import endpoint from './rss-service/endpoint.js'

const PORT = process.env.PORT
const app = new Koa()

setupTemplate(app)

app
.use(serve(path.join(__dirname, '..', 'public')))
.use(errors())
// .use(logger())
.use(parser())
.use(endpoint.routes())
.use(endpoint.allowedMethods())

// save the client side primus code so its available
// to the html page
const server = RssService(http.createServer(app.callback()))

server.listen(PORT, () => {
  console.log(`listening to port *:${PORT}.\npress ctrl + c to cancel.`)
})

export default app

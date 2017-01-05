import Koa from 'koa'
import Router from 'koa-router'
import render from 'koa-ejs'
import logger from 'koa-logger'
import parser from 'koa-bodyparser'
import serve from 'koa-static'
import path from 'path'
import co from 'co'
import errors from './modules/errors.js'

import FeedParser from 'feedparser'
import request from 'request' // for fetching the feed

import Primus from 'primus'

const PORT = process.env.PORT
const app = new Koa()
const primus = new Primus(app)

app.use(serve(path.join(__dirname, 'public')))

primus.on('connection', (spark) => {
  primus.write(spark.id + ' connected')
})
// save the client side primus code so its available
// to the html page
primus.save(__dirname + '/public/js/primus.js')

render(app, {
  root: path.join(__dirname, 'view'),
  layout: 'template',
  viewExt: 'html',
  cache: false,
  debug: true
})
app.context.render = co.wrap(app.context.render)
const req = request('http://rss.cnn.com/rss/money_markets.rss')
const feedparser = new FeedParser()

req.on('error', function (error) {
  // handle any request errors
})

req.on('response', function (res) {
  var stream = this // `this` is `req`, which is a stream

  if (res.statusCode !== 200) {
    this.emit('error', new Error('Bad status code'))
  } else {
    stream.pipe(feedparser)
  }
})

feedparser.on('error', function (error) {
  // always handle errors
})

feedparser.on('readable', function () {
  // This is where the action is!
  var stream = this // `this` is `feedparser`, which is a stream
  var meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
  var item

  while (item = stream.read()) {
    console.log(item.title)
    console.log(item.description)
    console.log(item.summary)
    console.log(item.pubdate)
    console.log(item.author)
    console.log(item.image)
    console.log(item.origlink)
  }
})

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

app.listen(PORT, () => {
  console.log(`listening to port *:${PORT}.\npress ctrl + c to cancel.`)
})

export default app


import co from 'co'
import render from 'koa-ejs'
import path from 'path'

export default (app) => {

  render(app, {
    root: path.join(__dirname, '..', '..', 'view'),
    layout: 'template',
    viewExt: 'html',
    cache: false,
    debug: true
  })

  app.context.render = co.wrap(app.context.render)
}

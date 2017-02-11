
import Primus from 'primus'
import Service from './service.js'
// import path from 'path'

const service = Service()

const onDisconnected = (spark) => {
  console.log('Disconnected from primus.js')
}

const onConnected = (spark) => {
  spark.write({
    action: 'connected',
    payload: {
      message: 'connected'
    } 
  })
}

export default (server) => {
  const primus = new Primus(server, { parser: 'JSON' })

  // primus.save(path.join(__dirname, '..', '/public/js/primus.js'))
  primus.on('connection', (spark) => {
    onConnected(spark)

    spark.on('data', ({ action, payload }) => {
      if (action === 'server:subscribe') {
        // Handle request
        const urls = payload.urls
        .map(url => url.trim())
        .filter(url => url)

        service.one(urls[0], (error, response) => {
          if (error) {
            console.log('service:error', error)
            spark.write({
              action: 'client:publish',
              payload: null,
              error: error.message
            })
          } else {
            spark.write({
              action: 'client:publish',
              payload: response
            })
          }
        })
      }
    })
  })

  primus.on('disconnection', onDisconnected)

  return server
}

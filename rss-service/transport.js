
import Primus from 'primus'
import Service from './service.js'

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

  // primus.save(__dirname + '/public/js/primus.js')
  primus.on('connection', (spark) => {
    onConnected(spark)

    spark.on('data', ({ action, payload }) => {
      if (action === 'server:get_all') {
        service.all(payload.urls, (error, response) => {
          if (error) {
            spark.write({
              action: 'client:get_all',
              payload: null,
              error: error 
            })
          } else {
            spark.write({
              action: 'client:get_all',
              payload: {
                feeds: response
              }
            })
          }
        })
      }
    })
  })

  primus.on('disconnection', onDisconnected)

  return server
}


import Primus from 'primus'
import rss from './rss.js'

const onDisconnected = (spark) => {
  console.log('disconnected')
}

const onConnected = (spark) => {
  spark.write({ action: 'connected', message: 'Connected' })
}

const getFeeds = (spark, data) => {
  if (data.action !== 'fetch') return
  data.urls.forEach((url) => {
    rss(url.trim(), (err, item) => {
      if (err) {
        console.log(err)
      }
      spark.write({ results: item, action: 'feed', url: url.trim() })
    })
  })
}

export default (server) => {
  const primus = new Primus(server, { parser: 'JSON' })

// primus.save(__dirname + '/public/js/primus.js')
  primus.on('connection', (spark) => {
    onConnected(spark)
    spark.on('data', (data) => {
      getFeeds(spark, data)
    })
  })

  primus.on('disconnection', onDisconnected)

  return server
}

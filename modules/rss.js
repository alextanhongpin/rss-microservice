// A module to fetch feed results
import FeedParser from 'feedparser'
import request from 'request' // for fetching the feed

const rss = (url, callback) => {
  const req = request(url)
  const feedparser = new FeedParser()

  req.on('error', function (err) {
  // handle any request errors
    callback(err, null)
  })

  req.on('response', function (res) {
    var stream = this // `this` is `req`, which is a stream

    if (res.statusCode !== 200) {
      this.emit('error', new Error('Bad status code'))
    } else {
      stream.pipe(feedparser)
    }
  })

  feedparser.on('error', function (err) {
  // always handle errors
    callback(err, null)
  })

  feedparser.on('readable', function () {
  // This is where the action is!
    var stream = this // `this` is `feedparser`, which is a stream
    var meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
    var item

    while (item = stream.read()) {
      // console.log(item.title)
      // console.log(item.description)
      // console.log(item.summary)
      // console.log(item.pubdate)
      // console.log(item.author)
      // console.log(item.image)
      // console.log(item.origlink)
      callback(null, item)
    }
  })
}

export default rss

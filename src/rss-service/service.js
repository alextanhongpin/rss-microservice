// A module to fetch feed results
import FeedParser from 'feedparser'
import request from 'request' // for fetching the feed

class RssService {
  // Get a rss response
  one (url, callback) {
    let rssRequest = null
    const feed = new FeedParser()
    try {
      rssRequest = request(url)
    } catch (error) {
      return callback(error, null)
    }
    rssRequest.on('error', error => {
      console.log('RequestError', error)
      callback(error, null)
    })
    rssRequest.on('response', function (res) {
      const isSuccess = res.statusCode === 200
      if (!isSuccess) {
        console.log('Error: Unable to fetch feed')
        this.emit('error', new Error('Unable to fetch RSS for' + url))
      } else {
        this.pipe(feed)
      }
    })
    feed.on('error', (error) => callback(error, null))
    feed.on('readable', function () {
      const meta = this.meta
      let item = null

      while (item = this.read()) {
        callback(null, item)
      }
    })
  }
  // Get a list of rss responses
  all (urls, callback) {
    urls.forEach((url) => {
      this.one(url, (error, feed) => {
        if (error) {
          callback(error, null)
        } else {
          callback(null, feed)
        }
      })
    })
  }
}

export default () => {
  return new RssService()
}
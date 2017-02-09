// A module to fetch feed results
import FeedParser from 'feedparser'
import request from 'request' // for fetching the feed

class RssService {
  one (url, callback) {
    const rssRequest = request(url)
    const feed = new FeedParser()

    rssRequest.on('error', error => callback(error, null))
    rssRequest.on('response', function (res) {
      const isSuccess = res.statusCode === 200
      if (!isSuccess) {
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
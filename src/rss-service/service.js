// A module to fetch feed results
import FeedParser from 'feedparser'
import request from 'request'

class RssService {
  // Get a rss response
  one (url, callback) {
    let req = null
    const feed = new FeedParser()
    try {
      // Handle error thrown through invalid url
      req = request(url, { timeout: 10000, pool: false })
    } catch (error) {
      return callback(error, null)
    }
    req.setMaxListeners(50)
    // Some feeds do not respond without user-agent and accept headers.
    req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36')
    req.setHeader('accept', 'text/html,application/xhtml+xml')

    req.on('error', error => callback(error, null))
    req.on('response', function (res) {
      const isSuccess = res.statusCode === 200
      if (!isSuccess) {
        this.emit('error', new Error('Unable to fetch RSS for' + url))
      } else {
        this.pipe(feed)
      }
    })
    feed.on('error', error => callback(error, null))
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
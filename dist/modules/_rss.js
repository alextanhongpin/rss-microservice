'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _feedparser = require('feedparser');

var _feedparser2 = _interopRequireDefault(_feedparser);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// for fetching the feed

// A module to fetch feed results
var rss = function rss(url, callback) {
  var req = (0, _request2.default)(url);
  var feedparser = new _feedparser2.default();

  req.on('error', function (err) {
    // handle any request errors
    callback(err, null);
  });

  req.on('response', function (res) {
    var stream = this; // `this` is `req`, which is a stream

    if (res.statusCode !== 200) {
      this.emit('error', new Error('Bad status code'));
    } else {
      stream.pipe(feedparser);
    }
  });

  feedparser.on('error', function (err) {
    // always handle errors
    callback(err, null);
  });

  feedparser.on('readable', function () {
    // This is where the action is!
    var stream = this; // `this` is `feedparser`, which is a stream
    var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
    var item;

    while (item = stream.read()) {
      // console.log(item.title)
      // console.log(item.description)
      // console.log(item.summary)
      // console.log(item.pubdate)
      // console.log(item.author)
      // console.log(item.image)
      // console.log(item.origlink)
      callback(null, item);
    }
  });
};

exports.default = rss;
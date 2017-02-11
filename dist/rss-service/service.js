'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // A module to fetch feed results


var _feedparser = require('feedparser');

var _feedparser2 = _interopRequireDefault(_feedparser);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RssService = function () {
  function RssService() {
    _classCallCheck(this, RssService);
  }

  _createClass(RssService, [{
    key: 'one',

    // Get a rss response
    value: function one(url, callback) {
      var req = null;
      var feed = new _feedparser2.default();
      try {
        // Handle error thrown through invalid url
        req = (0, _request2.default)(url, { timeout: 10000, pool: false });
      } catch (error) {
        return callback(error, null);
      }
      req.setMaxListeners(50);
      // Some feeds do not respond without user-agent and accept headers.
      req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36');
      req.setHeader('accept', 'text/html,application/xhtml+xml');

      req.on('error', function (error) {
        return callback(error, null);
      });
      req.on('response', function (res) {
        var isSuccess = res.statusCode === 200;
        if (!isSuccess) {
          this.emit('error', new Error('Unable to fetch RSS for' + url));
        } else {
          this.pipe(feed);
        }
      });
      feed.on('error', function (error) {
        return callback(error, null);
      });
      feed.on('readable', function () {
        var meta = this.meta;
        var item = null;

        while (item = this.read()) {
          callback(null, item);
        }
      });
    }
    // Get a list of rss responses

  }, {
    key: 'all',
    value: function all(urls, callback) {
      var _this = this;

      urls.forEach(function (url) {
        _this.one(url, function (error, feed) {
          if (error) {
            callback(error, null);
          } else {
            callback(null, feed);
          }
        });
      });
    }
  }]);

  return RssService;
}();

exports.default = function () {
  return new RssService();
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _primus = require('primus');

var _primus2 = _interopRequireDefault(_primus);

var _rss = require('./rss.js');

var _rss2 = _interopRequireDefault(_rss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var onDisconnected = function onDisconnected(spark) {
  console.log('disconnected');
};

var onConnected = function onConnected(spark) {
  spark.write({ action: 'connected', message: 'Connected' });
};

var getFeeds = function getFeeds(spark, data) {
  if (data.action !== 'fetch') return;
  data.urls.forEach(function (url) {
    (0, _rss2.default)(url.trim(), function (err, item) {
      if (err) {
        console.log(err);
      }
      spark.write({ results: item, action: 'feed', url: url.trim() });
    });
  });
};

exports.default = function (server) {
  var primus = new _primus2.default(server, { parser: 'JSON' });

  // primus.save(__dirname + '/public/js/primus.js')
  primus.on('connection', function (spark) {
    onConnected(spark);
    spark.on('data', function (data) {
      getFeeds(spark, data);
    });
  });

  primus.on('disconnection', onDisconnected);

  return server;
};
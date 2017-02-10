'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _primus = require('primus');

var _primus2 = _interopRequireDefault(_primus);

var _service = require('./service.js');

var _service2 = _interopRequireDefault(_service);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import path from 'path'

var service = (0, _service2.default)();

var onDisconnected = function onDisconnected(spark) {
  console.log('Disconnected from primus.js');
};

var onConnected = function onConnected(spark) {
  spark.write({
    action: 'connected',
    payload: {
      message: 'connected'
    }
  });
};

exports.default = function (server) {
  var primus = new _primus2.default(server, { parser: 'JSON' });

  // primus.save(path.join(__dirname, '..', '/public/js/primus.js'))
  primus.on('connection', function (spark) {
    onConnected(spark);

    spark.on('data', function (_ref) {
      var action = _ref.action,
          payload = _ref.payload;

      if (action === 'server:subscribe') {
        // Handle request
        var urls = payload.urls.map(function (url) {
          return url.trim();
        }).filter(function (url) {
          return url;
        });

        service.one(urls[0], function (error, response) {
          if (error) {
            console.log('service:error', error);
            spark.write({
              action: 'client:publish',
              payload: null,
              error: error.message
            });
          } else {
            spark.write({
              action: 'client:publish',
              payload: {
                rss: response
              }
            });
          }
        });
      }
    });
  });

  primus.on('disconnection', onDisconnected);

  return server;
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaLogger = require('koa-logger');

var _koaLogger2 = _interopRequireDefault(_koaLogger);

var _koaBodyparser = require('koa-bodyparser');

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

var _koaStatic = require('koa-static');

var _koaStatic2 = _interopRequireDefault(_koaStatic);

var _errors = require('./modules/errors.js');

var _errors2 = _interopRequireDefault(_errors);

var _template = require('./modules/template.js');

var _template2 = _interopRequireDefault(_template);

var _transport = require('./rss-service/transport.js');

var _transport2 = _interopRequireDefault(_transport);

var _endpoint = require('./rss-service/endpoint.js');

var _endpoint2 = _interopRequireDefault(_endpoint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('babel-polyfill');


var PORT = process.env.PORT;
var app = new _koa2.default();

(0, _template2.default)(app);

app.use((0, _koaStatic2.default)(_path2.default.join(__dirname, '..', 'public'))).use((0, _errors2.default)())
// .use(logger())
.use((0, _koaBodyparser2.default)()).use(_endpoint2.default.routes()).use(_endpoint2.default.allowedMethods());

// save the client side primus code so its available
// to the html page
var server = (0, _transport2.default)(_http2.default.createServer(app.callback()));

server.listen(PORT, function () {
  console.log('listening to port *:' + PORT + '.\npress ctrl + c to cancel.');
});

exports.default = app;
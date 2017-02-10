'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _koaEjs = require('koa-ejs');

var _koaEjs2 = _interopRequireDefault(_koaEjs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (app) {

  (0, _koaEjs2.default)(app, {
    root: _path2.default.join(__dirname, '..', '..', 'view'),
    layout: 'template',
    viewExt: 'html',
    cache: false,
    debug: true
  });

  app.context.render = _co2.default.wrap(app.context.render);
};
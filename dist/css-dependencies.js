'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = cssDependencies;

var _through2 = require('through2');

var _through22 = _interopRequireDefault(_through2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _dependency_graph = require('./dependency_graph');

var _dependency_graph2 = _interopRequireDefault(_dependency_graph);

var _es6Promisify = require('es6-promisify');

var _es6Promisify2 = _interopRequireDefault(_es6Promisify);

function cssDependencies(whitelist) {
  var _this = this;

  var stream = _through22['default'].obj();

  (function callee$1$0() {
    var dependencies, _iterator, _isArray, _i, _ref, packageJson, cssPath;

    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.prev = 0;
          context$2$0.next = 3;
          return _regeneratorRuntime.awrap(new _dependency_graph2['default'](whitelist).orderedStyleDependencies());

        case 3:
          dependencies = context$2$0.sent;
          _iterator = dependencies, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _getIterator(_iterator);

        case 5:
          if (!_isArray) {
            context$2$0.next = 11;
            break;
          }

          if (!(_i >= _iterator.length)) {
            context$2$0.next = 8;
            break;
          }

          return context$2$0.abrupt('break', 21);

        case 8:
          _ref = _iterator[_i++];
          context$2$0.next = 15;
          break;

        case 11:
          _i = _iterator.next();

          if (!_i.done) {
            context$2$0.next = 14;
            break;
          }

          return context$2$0.abrupt('break', 21);

        case 14:
          _ref = _i.value;

        case 15:
          packageJson = _ref;
          cssPath = _path2['default'].resolve(packageJson.path, packageJson.style);
          context$2$0.next = 19;
          return _regeneratorRuntime.awrap(_es6Promisify2['default'](stream.write.bind(stream))({
            path: cssPath,
            packageName: packageJson.name
          }));

        case 19:
          context$2$0.next = 5;
          break;

        case 21:
          context$2$0.next = 23;
          return _regeneratorRuntime.awrap(_es6Promisify2['default'](stream.end.bind(stream))());

        case 23:
          context$2$0.next = 28;
          break;

        case 25:
          context$2$0.prev = 25;
          context$2$0.t0 = context$2$0['catch'](0);

          console.error(context$2$0.t0.stack);

        case 28:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this, [[0, 25]]);
  })();

  return stream;
}

module.exports = exports['default'];
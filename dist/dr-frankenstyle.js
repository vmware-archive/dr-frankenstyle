//(c) Copyright 2015 Pivotal Software, Inc. All Rights Reserved.
'use strict';

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _through2 = require('through2');

var _through22 = _interopRequireDefault(_through2);

var _log_error = require('./log_error');

var _log_error2 = _interopRequireDefault(_log_error);

var _async = require('./async');

var _list_dependencies = require('./list_dependencies');

var _list_dependencies2 = _interopRequireDefault(_list_dependencies);

var _assets = require('./assets');

var _assets2 = _interopRequireDefault(_assets);

var _strategies = require('./strategies');

function packageTree() {
  return _regeneratorRuntime.async(function packageTree$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return (0, _log_error2['default'])(_async.npm.load({}), '`npm.load` has failed, exiting.');

      case 2:
        context$1$0.next = 4;
        return (0, _log_error2['default'])(_async.npm.commands.ls([], true), '`npm ls` has failed, exiting.');

      case 4:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 5:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

exports['default'] = function (options) {
  var stream = options.stream ? _through22['default'].obj() : null;
  (function callee$1$0() {
    var packages, cssFiles, callback;
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          packages = undefined;
          context$2$0.prev = 1;
          context$2$0.next = 4;
          return packageTree();

        case 4:
          context$2$0.t1 = context$2$0.sent;
          packages = (0, _list_dependencies2['default'])(context$2$0.t1, /.*/);
          context$2$0.next = 13;
          break;

        case 8:
          context$2$0.prev = 8;
          context$2$0.t2 = context$2$0['catch'](1);

          console.error('npm.ls returned an unparsable tree');
          console.error(context$2$0.t2.stack);
          throw context$2$0.t2;

        case 13:
          cssFiles = packages.filter(function (packageJson) {
            return 'style' in packageJson;
          }).map(function (packageJson) {
            return _path2['default'].resolve(packageJson.path, packageJson.style);
          });
          callback = typeof options === 'function' ? options : 'stream' in options ? (0, _strategies.stream)(stream) : 'directory' in options ? (0, _strategies.directory)(options.directory) : null;

          if (callback) {
            context$2$0.next = 17;
            break;
          }

          throw new Error('Please specify either a strategy option or a callback.');

        case 17:

          (0, _assets2['default'])(cssFiles, callback);

        case 18:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this, [[1, 8]]);
  })();
  return stream;
};

module.exports = exports['default'];
//(c) Copyright 2015 Pivotal Software, Inc. All Rights Reserved.
'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

exports.directory = directory;
exports.stream = stream;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _es6Promisify = require('es6-promisify');

var _es6Promisify2 = _interopRequireDefault(_es6Promisify);

var _async = require('./async');

var _log_error = require('./log_error');

var _log_error2 = _interopRequireDefault(_log_error);

function namespaceAssets(file) {
  if (file.path !== 'components.css') {
    var assetPath = _path2['default'].join(_path2['default'].dirname(file.importedBy), file.path);

    var _assetPath$match = assetPath.match(/^.*node_modules\/(.*?)\//);

    var _assetPath$match2 = _slicedToArray(_assetPath$match, 2);

    var packageName = _assetPath$match2[1];

    file.path = _path2['default'].join(packageName, _path2['default'].basename(file.path));
  }
}

function directory(outputDir) {
  return function callee$1$0(file, callback) {
    var filePath;
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          namespaceAssets(file);
          filePath = _path2['default'].join(outputDir, file.path);
          context$2$0.next = 4;
          return (0, _log_error2['default'])((0, _async.mkdir)(_path2['default'].dirname(filePath)));

        case 4:
          context$2$0.next = 6;
          return (0, _log_error2['default'])((0, _async.writeFile)(filePath, file.contents));

        case 6:
          callback(null, file);

        case 7:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  };
}

function stream(stream) {
  return function callee$1$0(file, callback) {
    var originalPath;
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          namespaceAssets(file);
          originalPath = file.path;
          context$2$0.next = 4;
          return (0, _log_error2['default'])((0, _es6Promisify2['default'])(stream.write.bind(stream))(file));

        case 4:
          if (!(originalPath === 'components.css')) {
            context$2$0.next = 7;
            break;
          }

          context$2$0.next = 7;
          return (0, _es6Promisify2['default'])(stream.end.bind(stream))();

        case 7:
          callback(null, file);

        case 8:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  };
}
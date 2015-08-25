'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = copyAssets;

var _vinyl = require('vinyl');

var _vinyl2 = _interopRequireDefault(_vinyl);

var _log_error = require('../log_error');

var _log_error2 = _interopRequireDefault(_log_error);

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _through2 = require('through2');

var _through22 = _interopRequireDefault(_through2);

var _eventStream = require('event-stream');

var _streamReduce = require('stream-reduce');

var _streamReduce2 = _interopRequireDefault(_streamReduce);

function copyAssets() {
  var assetRenameTableStream = _streamReduce2['default'](function (memo, file) {
    if (_path2['default'].basename(file.path) === 'asset-rename-table.json') {
      return JSON.parse(file.contents.toString());
    } else {
      return memo;
    }
  }, null);

  var copyAssetsStream = _through22['default'].obj(function callee$1$0(renameTable, encoding, callback) {
    var _iterator, _isArray, _i, _ref, pkg, _renameTable$pkg, baseAssetDir, assetLocationTranslation, _iterator2, _isArray2, _i2, _ref2, originalUrl, newUrl, existingAssetFileName, contents;

    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          _iterator = _Object$keys(renameTable), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _getIterator(_iterator);

        case 1:
          if (!_isArray) {
            context$2$0.next = 7;
            break;
          }

          if (!(_i >= _iterator.length)) {
            context$2$0.next = 4;
            break;
          }

          return context$2$0.abrupt('break', 37);

        case 4:
          _ref = _iterator[_i++];
          context$2$0.next = 11;
          break;

        case 7:
          _i = _iterator.next();

          if (!_i.done) {
            context$2$0.next = 10;
            break;
          }

          return context$2$0.abrupt('break', 37);

        case 10:
          _ref = _i.value;

        case 11:
          pkg = _ref;
          _renameTable$pkg = renameTable[pkg];
          baseAssetDir = _renameTable$pkg.baseAssetDir;
          assetLocationTranslation = _renameTable$pkg.assetLocationTranslation;
          _iterator2 = _Object$keys(assetLocationTranslation), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _getIterator(_iterator2);

        case 16:
          if (!_isArray2) {
            context$2$0.next = 22;
            break;
          }

          if (!(_i2 >= _iterator2.length)) {
            context$2$0.next = 19;
            break;
          }

          return context$2$0.abrupt('break', 35);

        case 19:
          _ref2 = _iterator2[_i2++];
          context$2$0.next = 26;
          break;

        case 22:
          _i2 = _iterator2.next();

          if (!_i2.done) {
            context$2$0.next = 25;
            break;
          }

          return context$2$0.abrupt('break', 35);

        case 25:
          _ref2 = _i2.value;

        case 26:
          originalUrl = _ref2;
          newUrl = assetLocationTranslation[originalUrl];
          existingAssetFileName = _path2['default'].join(baseAssetDir, originalUrl);
          context$2$0.next = 31;
          return _regeneratorRuntime.awrap(_log_error2['default'](_fsPromise2['default'].readFile(existingAssetFileName), 'Could not read asset file ' + existingAssetFileName));

        case 31:
          contents = context$2$0.sent;

          this.push(new _vinyl2['default']({ path: newUrl, contents: contents }));

        case 33:
          context$2$0.next = 16;
          break;

        case 35:
          context$2$0.next = 1;
          break;

        case 37:

          callback();

        case 38:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  });

  return _eventStream.pipeline(assetRenameTableStream, copyAssetsStream);
}

module.exports = exports['default'];
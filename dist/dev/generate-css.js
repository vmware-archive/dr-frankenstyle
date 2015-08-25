'use strict';

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = generateCss;

var _eventStream = require('event-stream');

var _through2 = require('through2');

var _through22 = _interopRequireDefault(_through2);

var _streamReduce = require('stream-reduce');

var _streamReduce2 = _interopRequireDefault(_streamReduce);

var _updateAssetUrlsAndConcat = require('../update-asset-urls-and-concat');

var _updateAssetUrlsAndConcat2 = _interopRequireDefault(_updateAssetUrlsAndConcat);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function generateCss(cssFileStream) {
  var input = _eventStream.map(function (data, callback) {
    return callback(null, data);
  });

  var renameTableStream = _streamReduce2['default'](function (memo, file) {
    if (_path2['default'].basename(file.path) === 'asset-rename-table.json') {
      return JSON.parse(file.contents.toString());
    } else {
      return memo;
    }
  }, null);

  var cssDependenciesStream = _through22['default'].obj(function (file, encoding, callback) {
    if (_path2['default'].basename(file.path) === 'dependencies-list.json') {
      for (var _iterator = JSON.parse(file.contents.toString()), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _getIterator(_iterator);;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var dependency = _ref;

        this.push(dependency);
      }
    }
    callback();
  });

  var output = _eventStream.merge(input.pipe(cssDependenciesStream).pipe(cssFileStream), input.pipe(renameTableStream)).pipe(_updateAssetUrlsAndConcat2['default']());

  return _eventStream.duplex(input, output);
}

module.exports = exports['default'];
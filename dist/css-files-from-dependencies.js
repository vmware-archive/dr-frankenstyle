'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = cssFilesFromDependencies;

var _vinyl = require('vinyl');

var _vinyl2 = _interopRequireDefault(_vinyl);

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

var _through2 = require('through2');

var _through22 = _interopRequireDefault(_through2);

function cssFilesFromDependencies() {
  return _through22['default'].obj(function (cssInfo, encoding, callback) {
    _fsPromise2['default'].readFile(cssInfo.path).then(function (cssContents) {
      var file = _Object$assign(new _vinyl2['default']({ path: cssInfo.path, contents: cssContents }), { packageName: cssInfo.packageName });
      callback(null, file);
    })['catch'](function (error) {
      console.error(error.stack);
      callback(error, null);
    });
  });
}

module.exports = exports['default'];
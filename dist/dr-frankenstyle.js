'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = drFrankenstyle;

var _eventStream = require('event-stream');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _through2 = require('through2');

var _through22 = _interopRequireDefault(_through2);

var _cssFilesFromDependencies = require('./css-files-from-dependencies');

var _cssFilesFromDependencies2 = _interopRequireDefault(_cssFilesFromDependencies);

var _dev = require('./dev');

function drFrankenstyle() {
  var setupStream = _dev.setup({ cached: false });

  return _eventStream.merge(setupStream.pipe(_dev.copyAssets()), setupStream.pipe(_dev.generateCss(_cssFilesFromDependencies2['default']())));
}

drFrankenstyle.railsUrls = function () {
  return _through22['default'].obj(function (file, encoding, callback) {
    if (_path2['default'].extname(file.path) === '.css') {
      var newContents = file.contents.toString().replace(/url\(/g, 'asset-url(');
      file.contents = new Buffer(newContents);
    }
    callback(null, file);
  });
};
module.exports = exports['default'];
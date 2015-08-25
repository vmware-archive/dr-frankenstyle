'use strict';

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = updateAssetUrlsAndConcat;

var _eventStream = require('event-stream');

var _streamReduce = require('stream-reduce');

var _streamReduce2 = _interopRequireDefault(_streamReduce);

var _vinyl = require('vinyl');

var _vinyl2 = _interopRequireDefault(_vinyl);

function updateAssetUrlsAndConcat() {
  var cssFilesAndRenameTableStream = _streamReduce2['default'](function (result, fileOrRenameTable) {
    if (fileOrRenameTable.contents) {
      result.files.push(fileOrRenameTable);
    } else {
      result.renameTable = fileOrRenameTable;
    }
    return result;
  }, { renameTable: null, files: [] });

  var resultCssFileStream = _eventStream.map(function (_ref2, callback) {
    var renameTable = _ref2.renameTable;
    var files = _ref2.files;

    var concatenatedCss = files.reduce(function (cssContents, file) {
      var assetLocationTranslation = renameTable[file.packageName].assetLocationTranslation;

      var cssWithUpdatedPaths = file.contents.toString();
      for (var _iterator = _Object$keys(assetLocationTranslation), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _getIterator(_iterator);;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var originalUrl = _ref;

        var newUrl = assetLocationTranslation[originalUrl];
        cssWithUpdatedPaths = cssWithUpdatedPaths.replace(originalUrl, newUrl);
      }
      cssContents.push(cssWithUpdatedPaths);
      return cssContents;
    }, []).join('\n');

    callback(null, new _vinyl2['default']({ path: 'components.css', contents: new Buffer(concatenatedCss) }));
  });

  return _eventStream.pipeline(cssFilesAndRenameTableStream, resultCssFileStream);
}

module.exports = exports['default'];
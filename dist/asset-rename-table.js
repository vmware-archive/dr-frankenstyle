'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = assetRenameTable;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _streamReduce = require('stream-reduce');

var _streamReduce2 = _interopRequireDefault(_streamReduce);

function assetRenameTable() {
  return _streamReduce2['default'](function (manifest, cssFile) {
    var baseAssetDir = _path2['default'].dirname(cssFile.path);

    var regex = /url\(\s*(['"]?)(.*?)([#?].*?)?\1\s*\)/g;
    var cssContents = cssFile.contents.toString();
    var assetLocationTranslation = {};
    var match = undefined;
    while (Boolean(match = regex.exec(cssContents))) {
      var _match = match;
      var url = _match[2];

      assetLocationTranslation[url] = _path2['default'].join(cssFile.packageName, _path2['default'].basename(url));
    }

    manifest[cssFile.packageName] = { baseAssetDir: baseAssetDir, assetLocationTranslation: assetLocationTranslation };
    return manifest;
  }, {});
}

module.exports = exports['default'];
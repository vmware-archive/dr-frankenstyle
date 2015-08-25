'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = setupDevelopmentCache;

var _cssDependencies = require('../css-dependencies');

var _cssDependencies2 = _interopRequireDefault(_cssDependencies);

var _cssFilesFromDependencies = require('../css-files-from-dependencies');

var _cssFilesFromDependencies2 = _interopRequireDefault(_cssFilesFromDependencies);

var _assetRenameTable = require('../asset-rename-table');

var _assetRenameTable2 = _interopRequireDefault(_assetRenameTable);

var _eventStream = require('event-stream');

var _streamReduce = require('stream-reduce');

var _streamReduce2 = _interopRequireDefault(_streamReduce);

var _vinyl = require('vinyl');

var _vinyl2 = _interopRequireDefault(_vinyl);

var _vinylFs = require('vinyl-fs');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function setupDevelopmentCache(_ref) {
  var _ref$cached = _ref.cached;
  var cached = _ref$cached === undefined ? false : _ref$cached;

  if (cached) {
    return _vinylFs.src('tmp/*');
  }

  try {
    var _JSON$parse = JSON.parse(_fs2['default'].readFileSync('.drfrankenstylerc'));

    var whitelist = _JSON$parse.whitelist;
  } catch (e) {
    whitelist = null;
    if (e.code !== 'ENOENT') {
      throw e;
    }
  }

  var cssDependenciesStream = _cssDependencies2['default'](whitelist);

  var fileFromDependencyList = _eventStream.pipeline(_streamReduce2['default'](function (memo, dependency) {
    memo.push(dependency);
    return memo;
  }, []), _eventStream.map(function (dependencies, callback) {
    callback(null, new _vinyl2['default']({
      path: 'dependencies-list.json',
      contents: new Buffer(JSON.stringify(dependencies, null, 2))
    }));
  }));

  var fileFromRenameTable = _eventStream.map(function (data, callback) {
    var file = new _vinyl2['default']({ path: 'asset-rename-table.json', contents: new Buffer(JSON.stringify(data, null, 2)) });
    callback(null, file);
  });

  var buildDependencyListFile = cssDependenciesStream.pipe(fileFromDependencyList);

  var buildAssetRenameTableFile = cssDependenciesStream.pipe(_cssFilesFromDependencies2['default']()).pipe(_assetRenameTable2['default']()).pipe(fileFromRenameTable);

  return _eventStream.merge(buildDependencyListFile, buildAssetRenameTableFile).pipe(_vinylFs.dest('tmp/'));
}

module.exports = exports['default'];
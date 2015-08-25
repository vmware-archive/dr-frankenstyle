'use strict';

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _Set = require('babel-runtime/core-js/set')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _Array$from = require('babel-runtime/core-js/array/from')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _eventStream = require('event-stream');

var _eventStream2 = _interopRequireDefault(_eventStream);

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _es6Promisify = require('es6-promisify');

var _es6Promisify2 = _interopRequireDefault(_es6Promisify);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _dagMap = require('dag-map');

var _dagMap2 = _interopRequireDefault(_dagMap);

var glob = _es6Promisify2['default'](_glob2['default']);

var DependencyGraph = (function () {
  function DependencyGraph(whitelist) {
    var rootPackageDir = arguments.length <= 1 || arguments[1] === undefined ? process.cwd() : arguments[1];

    _classCallCheck(this, DependencyGraph);

    this.whitelist = whitelist;
    this.rootPackageDir = rootPackageDir;
  }

  DependencyGraph.prototype.readJson = function readJson() {
    var _this = this;

    for (var _len = arguments.length, paths = Array(_len), _key = 0; _key < _len; _key++) {
      paths[_key] = arguments[_key];
    }

    return new _Promise(function callee$2$0(resolve) {
      var packageJsonPath, packageJson;
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.prev = 0;
            packageJsonPath = _path2['default'].resolve.apply(_path2['default'], [this.rootPackageDir].concat(paths));
            context$3$0.t0 = JSON;
            context$3$0.next = 5;
            return _regeneratorRuntime.awrap(_fsPromise2['default'].readFile(packageJsonPath, 'utf8'));

          case 5:
            context$3$0.t1 = context$3$0.sent;
            packageJson = context$3$0.t0.parse.call(context$3$0.t0, context$3$0.t1);

            packageJson.path = _path2['default'].dirname(packageJsonPath);
            resolve(packageJson);
            context$3$0.next = 14;
            break;

          case 11:
            context$3$0.prev = 11;
            context$3$0.t2 = context$3$0['catch'](0);

            resolve(null);

          case 14:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this, [[0, 11]]);
    });
  };

  DependencyGraph.prototype.installedPackagesLookup = function installedPackagesLookup() {
    var _this2 = this;

    return new _Promise(function callee$2$0(resolve, reject) {
      var packageJsonPaths, readJson, doneFiles, BatchSize;
      return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return _regeneratorRuntime.awrap(glob('**/node_modules/*/package.json', {
              cwd: this.rootPackageDir,

              // To enable dr-frankenstyle to detect npm linked packages
              // Note: we couldn't figure out how to test this
              follow: true
            }));

          case 2:
            packageJsonPaths = context$3$0.sent;
            readJson = this.readJson.bind(this);
            doneFiles = 0;
            BatchSize = 50;

            _eventStream2['default'].readable(function callee$3$0(count, callback) {
              var data;
              return _regeneratorRuntime.async(function callee$3$0$(context$4$0) {
                while (1) switch (context$4$0.prev = context$4$0.next) {
                  case 0:
                    if (!(count >= packageJsonPaths.length)) {
                      context$4$0.next = 4;
                      break;
                    }

                    if (!(doneFiles === packageJsonPaths.length)) {
                      context$4$0.next = 3;
                      break;
                    }

                    return context$4$0.abrupt('return', this.emit('end'));

                  case 3:
                    return context$4$0.abrupt('return', callback());

                  case 4:

                    if (count < doneFiles + BatchSize) {
                      callback();
                    }
                    context$4$0.next = 7;
                    return _regeneratorRuntime.awrap(readJson(packageJsonPaths[count]));

                  case 7:
                    data = context$4$0.sent;

                    this.emit('data', data);
                    doneFiles++;
                    // If you do not wait for the file to read before calling the callback,
                    // you may hit the open file limit on certain machines, like concourse.
                    callback();

                  case 11:
                  case 'end':
                    return context$4$0.stop();
                }
              }, null, this);
            }).pipe(_eventStream2['default'].writeArray(function (err, packageJsons) {
              if (err) reject(err);
              resolve(packageJsons.filter(Boolean).reduce(function (lookupTable, pkg) {
                lookupTable[pkg.name] = pkg;
                return lookupTable;
              }, {}));
            }));

          case 7:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this2);
    });
  };

  DependencyGraph.prototype.dependencies = function dependencies() {
    var rootPackageJson, installedPackagesLookup, pkg, result, packagesToCheck, _iterator, _isArray, _i, _ref, dependencyName, dependency;

    return _regeneratorRuntime.async(function dependencies$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap(this.readJson('package.json'));

        case 2:
          rootPackageJson = context$2$0.sent;
          context$2$0.next = 5;
          return _regeneratorRuntime.awrap(this.installedPackagesLookup());

        case 5:
          installedPackagesLookup = context$2$0.sent;

          if (this.whitelist !== null) {
            for (pkg in rootPackageJson.dependencies) {
              if (!this.whitelist.includes(pkg)) {
                delete rootPackageJson.dependencies[pkg];
              }
            }
          }

          result = new _Set();
          packagesToCheck = [rootPackageJson];

        case 9:
          if (!packagesToCheck.length) {
            context$2$0.next = 35;
            break;
          }

          pkg = packagesToCheck.shift();

          if (pkg) {
            context$2$0.next = 13;
            break;
          }

          return context$2$0.abrupt('continue', 9);

        case 13:
          _iterator = _Object$keys(Object(pkg.dependencies)), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _getIterator(_iterator);

        case 14:
          if (!_isArray) {
            context$2$0.next = 20;
            break;
          }

          if (!(_i >= _iterator.length)) {
            context$2$0.next = 17;
            break;
          }

          return context$2$0.abrupt('break', 33);

        case 17:
          _ref = _iterator[_i++];
          context$2$0.next = 24;
          break;

        case 20:
          _i = _iterator.next();

          if (!_i.done) {
            context$2$0.next = 23;
            break;
          }

          return context$2$0.abrupt('break', 33);

        case 23:
          _ref = _i.value;

        case 24:
          dependencyName = _ref;
          dependency = installedPackagesLookup[dependencyName];

          if (!dependency) console.error('ERROR: missing dependency "' + dependencyName + '"');

          if (!result.has(dependency)) {
            context$2$0.next = 29;
            break;
          }

          return context$2$0.abrupt('continue', 31);

        case 29:
          result.add(dependency);
          packagesToCheck.push(dependency);

        case 31:
          context$2$0.next = 14;
          break;

        case 33:
          context$2$0.next = 9;
          break;

        case 35:
          return context$2$0.abrupt('return', _Array$from(result));

        case 36:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  };

  DependencyGraph.prototype.styleDependencies = function styleDependencies() {
    return _regeneratorRuntime.async(function styleDependencies$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap(this.dependencies());

        case 2:
          context$2$0.t0 = Boolean;

          context$2$0.t1 = function (packageJson) {
            return 'style' in packageJson;
          };

          return context$2$0.abrupt('return', context$2$0.sent.filter(context$2$0.t0).filter(context$2$0.t1));

        case 5:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  };

  DependencyGraph.prototype.styleDependencyLookup = function styleDependencyLookup() {
    var styleDependencies, styleDependencyNames;
    return _regeneratorRuntime.async(function styleDependencyLookup$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _regeneratorRuntime.awrap(this.styleDependencies());

        case 2:
          context$2$0.t0 = Boolean;
          styleDependencies = context$2$0.sent.filter(context$2$0.t0);
          styleDependencyNames = styleDependencies.map(function (pkg) {
            return pkg.name;
          });
          return context$2$0.abrupt('return', styleDependencies.reduce(function (lookupTable, pkg) {
            lookupTable[pkg.name] = _Object$keys(Object(pkg.dependencies)).filter(function (dependencyName) {
              return styleDependencyNames.indexOf(dependencyName) >= 0;
            });
            return lookupTable;
          }, {}));

        case 6:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  };

  DependencyGraph.prototype.orderedStyleDependencies = function orderedStyleDependencies() {
    var dag, installedPackagesLookup, styleDependencyLookup, packageNames, _iterator2, _isArray2, _i2, _ref2, packageName, _iterator3, _isArray3, _i3, _ref3, dependency, result;

    return _regeneratorRuntime.async(function orderedStyleDependencies$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          dag = new _dagMap2['default']();
          context$2$0.next = 3;
          return _regeneratorRuntime.awrap(this.installedPackagesLookup());

        case 3:
          installedPackagesLookup = context$2$0.sent;
          context$2$0.next = 6;
          return _regeneratorRuntime.awrap(this.styleDependencyLookup());

        case 6:
          styleDependencyLookup = context$2$0.sent;
          packageNames = _Object$keys(styleDependencyLookup);
          _iterator2 = packageNames, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _getIterator(_iterator2);

        case 9:
          if (!_isArray2) {
            context$2$0.next = 15;
            break;
          }

          if (!(_i2 >= _iterator2.length)) {
            context$2$0.next = 12;
            break;
          }

          return context$2$0.abrupt('break', 38);

        case 12:
          _ref2 = _iterator2[_i2++];
          context$2$0.next = 19;
          break;

        case 15:
          _i2 = _iterator2.next();

          if (!_i2.done) {
            context$2$0.next = 18;
            break;
          }

          return context$2$0.abrupt('break', 38);

        case 18:
          _ref2 = _i2.value;

        case 19:
          packageName = _ref2;

          dag.add(packageName);
          _iterator3 = styleDependencyLookup[packageName], _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _getIterator(_iterator3);

        case 22:
          if (!_isArray3) {
            context$2$0.next = 28;
            break;
          }

          if (!(_i3 >= _iterator3.length)) {
            context$2$0.next = 25;
            break;
          }

          return context$2$0.abrupt('break', 36);

        case 25:
          _ref3 = _iterator3[_i3++];
          context$2$0.next = 32;
          break;

        case 28:
          _i3 = _iterator3.next();

          if (!_i3.done) {
            context$2$0.next = 31;
            break;
          }

          return context$2$0.abrupt('break', 36);

        case 31:
          _ref3 = _i3.value;

        case 32:
          dependency = _ref3;

          dag.addEdge(dependency, packageName);

        case 34:
          context$2$0.next = 22;
          break;

        case 36:
          context$2$0.next = 9;
          break;

        case 38:
          result = [];

          dag.topsort(function (vertex) {
            return result.push(vertex.name);
          });
          return context$2$0.abrupt('return', result.map(function (packageName) {
            return installedPackagesLookup[packageName];
          }));

        case 41:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  };

  return DependencyGraph;
})();

exports['default'] = DependencyGraph;
module.exports = exports['default'];
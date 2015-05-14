//(c) Copyright 2015 Pivotal Software, Inc. All Rights Reserved.
'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var _debuglog = require('debuglog');

var _debuglog2 = _interopRequireDefault(_debuglog);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _log_error = require('./log_error');

var _log_error2 = _interopRequireDefault(_log_error);

var _es6Promisify = require('es6-promisify');

var _es6Promisify2 = _interopRequireDefault(_es6Promisify);

var _async = require('./async');

var debug = (0, _debuglog2['default'])('dr-frankenstyle');

function scanUrls(decl, updatePath) {
  var tokens, i, token, _token$match, _token$match2, url, queryString, newUrl;

  return _regeneratorRuntime.async(function scanUrls$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        tokens = decl.value.split(/(url\(.*?\))/);

        if (!(tokens.length < 2)) {
          context$1$0.next = 3;
          break;
        }

        return context$1$0.abrupt('return');

      case 3:
        i = 1;

      case 4:
        if (!(i < tokens.length)) {
          context$1$0.next = 17;
          break;
        }

        token = tokens[i];
        _token$match = token.match(/url\(\s*['"]?([^'"?#]*)([^'")]*)/);
        _token$match2 = _slicedToArray(_token$match, 3);
        url = _token$match2[1];
        queryString = _token$match2[2];
        context$1$0.next = 12;
        return updatePath(url);

      case 12:
        newUrl = context$1$0.sent;

        tokens[i] = 'url(\'' + newUrl + '' + queryString + '\')';

      case 14:
        i += 2;
        context$1$0.next = 4;
        break;

      case 17:
        decl.value = tokens.join('');

      case 18:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function decls(root) {
  var decls = [];
  root.eachDecl(function (decl) {
    return decls.push(decl);
  });
  return decls;
}

function updateCssPaths(css, updatePath) {
  var _this = this;

  return (0, _log_error2['default'])((0, _postcss2['default'])([function callee$1$0(root) {
    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _Promise.all(decls(root).map(function (decl) {
            return (0, _log_error2['default'])(scanUrls(decl, updatePath), 'Failed to parse CSS rule ' + decl.value);
          }));

        case 2:
          return context$2$0.abrupt('return', context$2$0.sent);

        case 3:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  }]).process(css), 'PostCSS has failed to parse the CSS. Exiting.');
}

exports['default'] = function callee$0$0(cssFiles, askUserForPath) {
  var updateAsset, concatenatedCss, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, cssFile, css, result;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        updateAsset = function updateAsset(cssFile, assetPath) {
          var asset, _ref, newPath;

          return _regeneratorRuntime.async(function updateAsset$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                debug('Processing asset: ' + assetPath);
                context$2$0.next = 3;
                return (0, _log_error2['default'])((0, _async.readFile)(_path2['default'].resolve(_path2['default'].dirname(cssFile), assetPath)), 'Could not read asset ' + assetPath + ' imported by ' + cssFile);

              case 3:
                asset = context$2$0.sent;
                context$2$0.next = 6;
                return (0, _log_error2['default'])(askUserForPath({ path: assetPath, importedBy: cssFile, contents: asset }));

              case 6:
                _ref = context$2$0.sent;
                newPath = _ref.path;
                return context$2$0.abrupt('return', newPath);

              case 9:
              case 'end':
                return context$2$0.stop();
            }
          }, null, this);
        };

        askUserForPath = (0, _es6Promisify2['default'])(askUserForPath);
        concatenatedCss = '';
        _iteratorNormalCompletion = true;
        _didIteratorError = false;
        _iteratorError = undefined;
        context$1$0.prev = 6;
        _iterator = _getIterator(cssFiles);

      case 8:
        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
          context$1$0.next = 21;
          break;
        }

        cssFile = _step.value;

        debug('Processing css: ' + cssFile);
        context$1$0.next = 13;
        return (0, _log_error2['default'])((0, _async.readFile)(cssFile), 'Could not read CSS file: ' + cssFile + '. Exiting.');

      case 13:
        css = context$1$0.sent;
        context$1$0.next = 16;
        return updateCssPaths(css, updateAsset.bind(null, cssFile));

      case 16:
        result = context$1$0.sent;

        concatenatedCss += '\n' + result.css;

      case 18:
        _iteratorNormalCompletion = true;
        context$1$0.next = 8;
        break;

      case 21:
        context$1$0.next = 27;
        break;

      case 23:
        context$1$0.prev = 23;
        context$1$0.t0 = context$1$0['catch'](6);
        _didIteratorError = true;
        _iteratorError = context$1$0.t0;

      case 27:
        context$1$0.prev = 27;
        context$1$0.prev = 28;

        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }

      case 30:
        context$1$0.prev = 30;

        if (!_didIteratorError) {
          context$1$0.next = 33;
          break;
        }

        throw _iteratorError;

      case 33:
        return context$1$0.finish(30);

      case 34:
        return context$1$0.finish(27);

      case 35:
        context$1$0.next = 37;
        return (0, _log_error2['default'])(askUserForPath({ path: 'components.css', contents: new Buffer(concatenatedCss) }));

      case 37:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[6, 23, 27, 35], [28,, 30, 34]]);
};

module.exports = exports['default'];
//urls will be at odd indices in the resulting array
//no urls
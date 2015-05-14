//(c) Copyright 2015 Pivotal Software, Inc. All Rights Reserved.
'use strict';

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var _lodashUniq = require('lodash.uniq');

var _lodashUniq2 = _interopRequireDefault(_lodashUniq);

exports['default'] = function (dependencyTree, filterRegEx) {
  var result = [];
  var queue = [dependencyTree];
  var node = undefined;
  while (queue.length) {
    node = queue.pop();
    result.unshift(node);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = _getIterator(_Object$keys(node.dependencies)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var packageName = _step.value;

        queue.push(node.dependencies[packageName]);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }
  return (0, _lodashUniq2['default'])(result.slice(1, -1).filter(function (packageJson) {
    return !filterRegEx || filterRegEx.test(packageJson.name);
  }), function (packageJson) {
    return packageJson.name;
  });
};

module.exports = exports['default'];
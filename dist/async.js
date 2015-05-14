//(c) Copyright 2015 Pivotal Software, Inc. All Rights Reserved.
'use strict';

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _npm = require('npm');

var _npmLibLs = require('npm/lib/ls');

var _npmLibLs2 = _interopRequireDefault(_npmLibLs);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _es6Promisify = require('es6-promisify');

var _es6Promisify2 = _interopRequireDefault(_es6Promisify);

var mkdir = (0, _es6Promisify2['default'])(_mkdirp2['default']);
exports.mkdir = mkdir;
var readFile = (0, _es6Promisify2['default'])(_fs2['default'].readFile);
exports.readFile = readFile;
var writeFile = (0, _es6Promisify2['default'])(_fs2['default'].writeFile);

exports.writeFile = writeFile;
var npm = {
  load: (0, _es6Promisify2['default'])(_npm.load),
  commands: {
    ls: (0, _es6Promisify2['default'])(_npmLibLs2['default'])
  }
};
exports.npm = npm;
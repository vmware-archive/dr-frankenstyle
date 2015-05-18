#! /usr/bin/env node
//(c) Copyright 2015 Pivotal Software, Inc. All Rights Reserved.
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _drFrankenstyle = require('./dr-frankenstyle');

var _drFrankenstyle2 = _interopRequireDefault(_drFrankenstyle);

var argv = require('yargs').usage('Usage: dr-frankenstyle <output>').example('dr-frankenstyle my_assets_dir').demand(1, 'must provide an output').argv;

var output = argv._[0];

(0, _drFrankenstyle2['default'])({ directory: output });
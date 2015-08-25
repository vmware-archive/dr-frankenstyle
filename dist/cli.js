'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _vinylFs = require('vinyl-fs');

var _drFrankenstyle = require('./dr-frankenstyle');

var _drFrankenstyle2 = _interopRequireDefault(_drFrankenstyle);

var argv = require('yargs').usage('Usage: dr-frankenstyle [options] <output-dir>').example('dr-frankenstyle my_assets_dir').demand(1, 'Please provide an output directory').boolean('rails').describe('rails', "Use Rails' asset-url helper instead of url in CSS").argv;

var output = argv._[0];

var stream = _drFrankenstyle2['default']();

if (argv.rails) {
  stream = stream.pipe(_drFrankenstyle2['default'].railsUrls());
}

stream.pipe(_vinylFs.dest(output));
import {dest} from 'vinyl-fs';
import drFrankenstyle from './dr-frankenstyle';

const argv = require('yargs')
  .usage('Usage: dr-frankenstyle <output-dir>')
  .example('dr-frankenstyle my_assets_dir')
  .demand(1, 'Please provide an output directory')
  .boolean('rails')
  .argv;

const output = argv._[0];

let stream = drFrankenstyle();

if (argv.rails) {
  stream = stream.pipe(drFrankenstyle.railsUrls());
}

stream
  .pipe(dest(output));

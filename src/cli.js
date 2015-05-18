import drFrankenstyle from './dr-frankenstyle';

var argv = require('yargs')
  .usage('Usage: dr-frankenstyle <output>')
  .example('dr-frankenstyle my_assets_dir')
  .demand(1, 'must provide an output')
  .argv;

var output = argv._[0];

drFrankenstyle({directory: output});

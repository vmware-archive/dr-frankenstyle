import path from 'path';
import through2 from 'through2';
import logError from './log_error';
import {npm} from './async';
import listDeps from './list_dependencies';
import assets from './assets';
import {directory as directoryStrategy, stream as streamStrategy} from './strategies';

async function packageTree() {
  await logError(npm.load({}), '`npm.load` has failed, exiting.');
  return await logError(npm.commands.ls([], true), '`npm ls` has failed, exiting.');
}

export default function(options) {
  let stream = options.stream ? through2.obj() : null;
  (async function() {
    let packages;
    try {
      packages = listDeps(await packageTree(), /.*/);
    } catch(e) {
      console.error('npm.ls returned an unparsable tree');
      console.error(e.stack);
      throw e;
    }

    let cssFiles = packages
      .filter(packageJson => 'style' in packageJson)
      .map(packageJson => path.resolve(packageJson.path, packageJson.style));

    let callback = (
      typeof options === 'function' ? options :
      'stream' in options ? streamStrategy(stream) :
      'directory' in options ? directoryStrategy(options.directory) :
      null
    );
    if (!callback) throw new Error('Please specify either a strategy option or a callback.');

    assets(cssFiles, callback);
  })();
  return stream;
}

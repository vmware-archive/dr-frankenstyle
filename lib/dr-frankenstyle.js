import path from 'path';
import through2 from 'through2';
import {npm} from './async';
import listDeps from './list_dependencies';
import assets from './assets';
import {directory as directoryStrategy} from './strategies';

async function packageTree() {
  await npm.load({});
  return await npm.commands.ls([], true);
}

export default options => {
  let stream = options.stream ? through2.obj() : null;
  (async function() {
    let packages = listDeps(await packageTree(), /.*/);
    let cssFiles = packages
      .filter(packageJson => 'style' in packageJson)
      .map(packageJson => path.resolve(packageJson.path, packageJson.style));

    let callback = (
      typeof options === 'function' ? options :
      'directory' in options ? directoryStrategy(options.directory) :
      null
    );
    if (!callback) throw new Error('Please specify either a strategy option or a callback.');

    assets(cssFiles, callback);
  })();
  return stream;
}

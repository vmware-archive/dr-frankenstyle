import fs from 'fs';
import path from 'path';
import npm from 'npm';
import promisify from 'es6-promisify';
import listDeps from './list_dependencies';
import assets from './assets';
import {directory} from './strategies';

async function packageTree() {
  await promisify(npm.load)({});
  return await promisify(npm.commands.ls)([], true);
}

export default async options => {
  let packages = listDeps(await packageTree(), /.*/);
  let cssFiles = packages
    .filter(packageJson => 'style' in packageJson)
    .map(packageJson => path.resolve(packageJson.path, packageJson.style));

  let callback = (
    typeof options === 'function' ? options :
    'directory' in options ? directory(options.directory) :
    null
  );
  if (callback) {
    assets(cssFiles, callback);
  } else {
    throw new Error('Please specify either a directory to save the css and asset files or a callback.');
  }
};

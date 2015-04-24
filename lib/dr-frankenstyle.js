import fs from 'fs';
import path from 'path';
import npm from 'npm';
import promisify from 'es6-promisify';
import listDeps from './list_dependencies';
import assets from './assets';

export default async callback => {
  await promisify(npm.load)({});
  let packageTree = await promisify(npm.commands.ls)([], true);
  let packages = listDeps(packageTree, /.*/);

  let cssFiles = packages
    .filter(packageJson => 'style' in packageJson)
    .map(packageJson => path.resolve(packageJson.path, packageJson.style));
  assets(cssFiles, callback);
};

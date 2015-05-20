import fs from 'fs-promise';
import path from 'path';
import through2 from 'through2';
import promisify from 'es6-promisify';
import {npm} from './async';
import logError from './log_error';
import listDeps from './list_dependencies';
import modifyAssetPaths from './assets';
import File from 'vinyl';

async function packageTree() {
  await logError(npm.load({}), '`npm.load` has failed, exiting.');
  return await logError(npm.commands.ls([], true), '`npm ls` has failed, exiting.');
}

async function resolveDependencies() {
  try {
    return listDeps(await packageTree(), /.*/);
  } catch(e) {
    console.error('npm.ls returned an unparsable tree');
    console.error(e.stack);
    throw e;
  }
}

function gatherCssFiles() {
  const stream = through2.obj();

  (async () => {
    for (const packageJson of await resolveDependencies()) {
      if (!('style' in packageJson)) { continue; }
      const cssPath = path.resolve(packageJson.path, packageJson.style);
      await promisify(stream.write.bind(stream))(Object.assign(
        new File({path: cssPath, contents: await fs.readFile(cssPath)}),
        {packageName: packageJson.name}
      ));
    }
    await promisify(stream.end.bind(stream))();
  })();

  return stream;
}

export default function drFrankenstyle() {
  return gatherCssFiles()
    .pipe(modifyAssetPaths());
}

drFrankenstyle.railsUrls = function() {
  return through2.obj(function(file, encoding, callback) {
    if (path.extname(file.path) === '.css') {
      var newContents = file.contents.toString().replace(/url\(/g, 'asset-url(');
      file.contents = new Buffer(newContents);
    }
    callback(null, file);
  });
};

import path from 'path';
import through2 from 'through2';
import File from 'vinyl';
import promisify from 'es6-promisify';
import {npm} from './async';
import logError from './log_error';
import listDeps from './list_dependencies';
import assets from './assets';

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

function namespaceAsset(file) {
  const assetPath = path.join(path.dirname(file.importedBy), file.path);
  const [, packageName] = assetPath.match(/^.*node_modules\/(.*?)\//);
  file.path = path.join(packageName, path.basename(file.path));
}

async function streamify(stream) {
  const cssFiles = (await resolveDependencies())
    .filter(packageJson => 'style' in packageJson)
    .map(packageJson => path.resolve(packageJson.path, packageJson.style));

  assets(cssFiles, async (file, callback) => {
    if (file.path !== 'components.css') {
      namespaceAsset(file);
    }

    const originalPath = file.path;
    await logError(promisify(stream.write.bind(stream))(file));
    if (originalPath === 'components.css') await promisify(stream.end.bind(stream))();
    callback(null, file);
  });
}

export default function drFrankenstyle() {
  const stream = through2.obj();
  streamify(stream);
  return stream
    .pipe(through2.obj(function(file, encoding, callback) {
      file.drFrankenstyle = true;
      callback(null, Object.setPrototypeOf(file, new File(file)));
    }));
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

drFrankenstyle.done = function() {
  return through2.obj(function(file, encoding, callback) {
    if (file.drFrankenstyle) {
      var clone = Object.getPrototypeOf(file);
      Object.keys(file).forEach(function(key) {
        clone[key] = file[key];
      });
      file = clone;
    }
    callback(null, file);
  });
};

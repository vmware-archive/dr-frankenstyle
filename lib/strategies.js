import path from 'path';
import promisify from 'es6-promisify';
import {writeFile, mkdir} from './async';

function namespaceAssets(file) {
  if (file.path !== 'components.css') {
    let assetPath = path.join(path.dirname(file.importedBy), file.path);
    let [, packageName] = assetPath.match(/^.*node_modules\/(.*?)\//);
    file.path = path.join(packageName, path.basename(file.path));
  }
}

export function directory(outputDir) {
  return async function(file, callback) {
    namespaceAssets(file);
    let filePath = path.join(outputDir, file.path);
    await mkdir(path.dirname(filePath));
    await writeFile(filePath, file.contents);
    callback(null, file);
  }
}

export function stream(stream) {
  return async function(file, callback) {
    namespaceAssets(file);
    let originalPath = file.path;
    await promisify(stream.write.bind(stream))(file);
    if (originalPath === 'components.css') await promisify(stream.end.bind(stream))();
    callback(null, file);
  }
}

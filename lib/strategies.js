import path from 'path';
import {writeFile, mkdir} from './async';

export function directory(outputDir) {
  return async function(file, callback) {
    if (file.path !== 'components.css') {
      let assetPath = path.join(path.dirname(file.importedBy), file.path);
      let [, packageName] = assetPath.match(/^.*node_modules\/(.*?)\//);
      file.path = path.join(packageName, path.basename(file.path));
    }

    let filePath = path.join(outputDir, file.path);
    await mkdir(path.dirname(filePath));
    await writeFile(filePath, file.contents);
    callback(null, file);
  }
}
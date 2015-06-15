import {merge, map, duplex} from 'event-stream';
import through from 'through2';
import reduce from 'stream-reduce';
import updateAssetUrlsAndConcat from './update-asset-urls-and-concat';
import path from 'path';

export default function generateCss(cssFileStream) {
  const input = map((data, callback) => callback(null, data));

  const renameTableStream = reduce(function (memo, file) {
    if (path.basename(file.path) === 'asset-rename-table.json') {
      return JSON.parse(file.contents.toString());
    }
    else {
      return memo;
    }
  }, null);

  const cssDependenciesStream = through.obj(function(file, encoding, callback) {
    if (path.basename(file.path) === 'dependencies-list.json') {
      for (let dependency of JSON.parse(file.contents.toString())) {
        this.push(dependency);
      }
    }
    callback();
  });

  var output = merge(
    input.pipe(cssDependenciesStream).pipe(cssFileStream),
    input.pipe(renameTableStream)
  ).pipe(updateAssetUrlsAndConcat());

  return duplex(input, output);
}

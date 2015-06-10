import {merge} from 'event-stream';
import path from 'path';
import through from 'through2';
import assetRenameTable from './asset-rename-table';
import copyAssets from './copy-assets';
import cssDependencies from './css-dependencies';
import cssFilesFromDependencies from './css-files-from-dependencies';
import updateAssetUrlsAndConcat from './update-asset-urls-and-concat';

export default function drFrankenstyle() {
  const cssFilesStream = cssDependencies().pipe(cssFilesFromDependencies());
  const renameTableStream = cssFilesStream.pipe(assetRenameTable());

  return merge(
    renameTableStream.pipe(copyAssets()),
    merge(cssFilesStream, renameTableStream).pipe(updateAssetUrlsAndConcat())
  );
}

drFrankenstyle.railsUrls = function() {
  return through.obj(function(file, encoding, callback) {
    if (path.extname(file.path) === '.css') {
      var newContents = file.contents.toString().replace(/url\(/g, 'asset-url(');
      file.contents = new Buffer(newContents);
    }
    callback(null, file);
  });
};

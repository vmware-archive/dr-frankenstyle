import fs from 'fs-promise';
import path from 'path';
import through2 from 'through2';
import modifyAssetPaths from './assets';
import File from 'vinyl';
import cssDependencies from './css-dependencies';

function cssFilesFromPackages() {
  return through2.obj(function(cssInfo, encoding, callback) {
    fs.readFile(cssInfo.path)
      .then(function(cssContents) {
        const file = Object.assign(
          new File({path: cssInfo.path, contents: cssContents}),
          {packageName: cssInfo.packageName}
        );
        callback(null, file);
      }).catch(function (error) {
        console.error(error.stack);
        callback(error, null);
      });
  });
}

export default function drFrankenstyle() {
  return cssDependencies()
    .pipe(cssFilesFromPackages())
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

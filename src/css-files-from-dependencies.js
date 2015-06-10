import File from 'vinyl';
import fs from 'fs-promise';
import through from 'through2';

export default function cssFilesFromDependencies() {
  return through.obj(function(cssInfo, encoding, callback) {
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


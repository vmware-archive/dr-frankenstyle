import debuglog from 'debuglog';
import fs from 'fs-promise';
import path from 'path';
import logError from './log_error';
import File from 'vinyl';
import through2 from 'through2';

const debug = debuglog('dr-frankenstyle');

export default function() {
  let concatenatedCss = '';
  return through2.obj(
    async function(file, encoding, callback) {
      debug(`Processing css: ${file.path}`);

      const assetFilesToAdd = [];
      const cssWithUpdatedPaths = file.contents.toString().replace(/url\(\s*(['"]?)([^?#]*)(.*?)\1\s*\)/g, (_, quote, url, query) => {
        assetFilesToAdd.push({
          readPath: path.join(path.dirname(file.path), url),
          namespacedPath: path.join(file.packageName, path.basename(url))
        });
        return `url('${file.packageName}/${path.basename(url)}${query}')`;
      });

      concatenatedCss += cssWithUpdatedPaths + '\n';
      for (const assetFile of assetFilesToAdd) {
        const contents = await logError(fs.readFile(assetFile.readPath), `Could not read asset file ${assetFile.readPath}`);
        this.push(new File({path: assetFile.namespacedPath, contents}));
      }

      callback(null);
    },
    function(callback) {
      this.push(new File({path: 'components.css', contents: new Buffer(concatenatedCss)}));
      callback();
    }
  );
}

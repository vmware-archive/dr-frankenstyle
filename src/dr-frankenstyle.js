import {merge} from 'event-stream';
import path from 'path';
import through from 'through2';
import cssFilesFromDependencies from './css-files-from-dependencies';

import setup from './setup';
import copyAssets from './copy-assets';
import generateCss from './generate-css';

export default function drFrankenstyle() {
  const setupStream = setup({cached: false});

  return merge(
    setupStream.pipe(copyAssets()),
    setupStream.pipe(generateCss(cssFilesFromDependencies()))
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

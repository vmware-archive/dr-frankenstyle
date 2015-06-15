import File from 'vinyl';
import logError from './log_error';
import fs from 'fs-promise';
import path from 'path';
import through from 'through2';
import {pipeline} from 'event-stream';
import reduce from 'stream-reduce';

export default function copyAssets() {
  const assetRenameTableStream = reduce(function (memo, file) {
    if (path.basename(file.path) === 'asset-rename-table.json') {
      return JSON.parse(file.contents.toString());
    }
    else {
      return memo;
    }
  }, null);

  const copyAssetsStream = through.obj(
    async function(renameTable, encoding, callback) {
      for (let pkg of Object.keys(renameTable)) {
        const {baseAssetDir, assetLocationTranslation} = renameTable[pkg];

        for (let originalUrl of Object.keys(assetLocationTranslation)) {
          const newUrl = assetLocationTranslation[originalUrl];
          const existingAssetFileName = path.join(baseAssetDir, originalUrl);
          const contents = await logError(fs.readFile(existingAssetFileName), `Could not read asset file ${existingAssetFileName}`);
          this.push(new File({path: newUrl, contents}));
        }
      }

      callback();
    }
  );

  return pipeline(assetRenameTableStream, copyAssetsStream);
}

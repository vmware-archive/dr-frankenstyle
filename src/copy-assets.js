import File from 'vinyl';
import logError from './log_error';
import fs from 'fs-promise';
import path from 'path';
import through from 'through2';

export default function copyAssets() {
  return through.obj(
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
}

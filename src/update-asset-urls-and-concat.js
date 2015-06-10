import {map, pipeline} from 'event-stream';
import reduce from 'stream-reduce';
import File from 'vinyl';

export default function updateAssetUrlsAndConcat() {
  const cssFilesAndRenameTableStream = reduce((result, fileOrRenameTable) => {
    if (fileOrRenameTable.contents) {
      result.files.push(fileOrRenameTable);
    } else {
      result.renameTable = fileOrRenameTable;
    }
    return result;
  }, {renameTable: null, files: []});

  const resultCssFileStream = map(function({renameTable, files}, callback) {
    const concatenatedCss = files.reduce((cssContents, file) => {
      const {assetLocationTranslation} = renameTable[file.packageName];
      let cssWithUpdatedPaths = file.contents.toString();
      for (let originalUrl of Object.keys(assetLocationTranslation)) {
        const newUrl = assetLocationTranslation[originalUrl];
        cssWithUpdatedPaths = cssWithUpdatedPaths.replace(originalUrl, newUrl);
      }
      cssContents.push(cssWithUpdatedPaths);
      return cssContents;
    }, []).join('\n');

    callback(null, new File({path: 'components.css', contents: new Buffer(concatenatedCss)}));
  });

  return pipeline(cssFilesAndRenameTableStream, resultCssFileStream);
}

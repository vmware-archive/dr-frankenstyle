import path from 'path';
import reduce from 'stream-reduce';

export default function assetRenameTable() {
  return reduce((manifest, cssFile) => {
    const baseAssetDir = path.dirname(cssFile.path);

    const regex = /url\(\s*(['"]?)(.*?)([#?].*?)?\1\s*\)/g;
    const cssContents = cssFile.contents.toString();
    const assetLocationTranslation = {};
    let match;
    while (Boolean(match = regex.exec(cssContents))) {
      const {2: url} = match;
      assetLocationTranslation[url] = path.join(cssFile.packageName, path.basename(url));
    }

    manifest[cssFile.packageName] = {baseAssetDir, assetLocationTranslation};
    return manifest;
  }, {});
}

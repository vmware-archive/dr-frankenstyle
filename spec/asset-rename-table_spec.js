import {readArray, writeArray} from 'event-stream';
import assetRenameTable from '../src/asset-rename-table';

const files = [
  {
    packageName: 'package-a',
    path: 'node_modules/package-a/style.css',
    contents: new Buffer([
      '.bg-cloud { background: url("path/to/asset-a1.jpg"); }',
      '.bg-sky { background: url(\'path/to/asset-a2.jpg\'); }'
    ].join('\n'))
  },
  {
    packageName: 'package-b',
    path: 'node_modules/package-b/css/style.css',
    contents: new Buffer('.h1 { font-size: 16px; }')
  },
  {
    packageName: 'package-c',
    path: 'node_modules/package-c/style.css',
    contents: new Buffer('.logo { background: url(path/to/asset-c1.jpg); }')
  }
];

describe('assetRenameTable', () => {
  let renameTable;

  beforeEach(done => {
    readArray(files)
      .pipe(assetRenameTable())
      .pipe(writeArray((error, data) => {
        renameTable = data[0];
        done();
      }));
  });

  it('has an entry for each css package', function() {
    expect(Object.keys(renameTable)).toEqual(jasmine.arrayContaining(['package-a', 'package-b', 'package-c']));
    expect(Object.keys(renameTable).length).toEqual(3);
  });

  it('creates an asset location translation table for each css package', function() {
    expect(Object.keys(renameTable['package-a'].assetLocationTranslation).length).toEqual(2);
    expect(renameTable['package-a'].assetLocationTranslation['path/to/asset-a1.jpg']).toEqual('package-a/asset-a1.jpg');
    expect(renameTable['package-a'].assetLocationTranslation['path/to/asset-a2.jpg']).toEqual('package-a/asset-a2.jpg');
    expect(Object.keys(renameTable['package-b'].assetLocationTranslation).length).toEqual(0);
    expect(Object.keys(renameTable['package-c'].assetLocationTranslation).length).toEqual(1);
    expect(renameTable['package-c'].assetLocationTranslation['path/to/asset-c1.jpg']).toEqual('package-c/asset-c1.jpg');
  });

  it('adds the base directory for assets for each css package', function() {
    expect(renameTable['package-a'].baseAssetDir).toEqual('node_modules/package-a');
    expect(renameTable['package-b'].baseAssetDir).toEqual('node_modules/package-b/css');
    expect(renameTable['package-c'].baseAssetDir).toEqual('node_modules/package-c');
  });
});

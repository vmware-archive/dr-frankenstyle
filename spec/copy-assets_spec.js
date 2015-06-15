import {readArray, writeArray} from 'event-stream';
import File from 'vinyl';

const mockContentsLookup = {
  'node_modules/package-a/path/to/asset-a1.jpg': new Buffer('contents for asset-a1'),
  'node_modules/package-a/path/to/asset-a2.jpg': new Buffer('contents for asset-a2'),
  'node_modules/package-a/path/to/asset-a3.jpg': new Buffer('contents for asset-a3'),
  'node_modules/package-c/path/to/asset-c1.jpg': new Buffer('contents for asset-c1')
};

const mockFs = {
  readFile: filename => new Promise((resolve, reject) => {
    const contents = mockContentsLookup[filename];
    contents ? resolve(contents) : reject('could not read file');
  })
};

var proxyquire = require('proxyquire').noPreserveCache();
var copyAssets = proxyquire('../src/copy-assets', {'fs-promise': mockFs});

describe('copyAssets', () => {
  let assetFiles;

  beforeEach(done => {
    const renameTable = {
      'package-a': {
        baseAssetDir: 'node_modules/package-a',
        assetLocationTranslation: {
          'path/to/asset-a1.jpg': 'package-a/asset-a1.jpg',
          'path/to/asset-a2.jpg': 'package-a/asset-a2.jpg',
          'path/to/asset-a3.jpg': 'package-a/asset-a3.jpg'
        }
      },
      'package-b': {
        baseAssetDir: 'node_modules/package-b',
        assetLocationTranslation: {}
      },
      'package-c': {
        baseAssetDir: 'node_modules/package-c',
        assetLocationTranslation: {
          'path/to/asset-c1.jpg': 'package-c/asset-c1.jpg'
        }
      }
    };

    const cssDependencies = [
      {data: 'goes here'}
    ];

    const renameTableFile = new File({
      path: 'asset-rename-table.json',
      contents: new Buffer(JSON.stringify(renameTable, null, 2))
    });

    const cssDependenciesFile = new File({
      path: 'dependencies-list.json',
      contents: new Buffer(JSON.stringify(cssDependencies, null, 2))
    });

    readArray([renameTableFile, cssDependenciesFile])
    .pipe(copyAssets())
    .pipe(writeArray((error, data) => {
      assetFiles = data;
      done();
    }));
  });

  it('returns a stream of all asset files in the rename table with new namespaced paths', () => {
    const assetFileDatas = assetFiles.map(file => {
      return {path: file.path, contents: file.contents.toString()};
    });

    expect(assetFileDatas.length).toEqual(4);

    expect(assetFileDatas).toContain(jasmine.objectContaining({
      path: 'package-a/asset-a1.jpg',
      contents: 'contents for asset-a1'
    }));
    expect(assetFileDatas).toContain(jasmine.objectContaining({
      path: 'package-a/asset-a2.jpg',
      contents: 'contents for asset-a2'
    }));
    expect(assetFileDatas).toContain(jasmine.objectContaining({
      path: 'package-a/asset-a3.jpg',
      contents: 'contents for asset-a3'
    }));
    expect(assetFileDatas).toContain(jasmine.objectContaining({
      path: 'package-c/asset-c1.jpg',
      contents: 'contents for asset-c1'
    }));
  });
});

import {readArray, writeArray} from 'event-stream';
import {toHaveOrder} from './helpers/jasmine_matchers';
import updateAssetUrlsAndConcat from '../src/update-asset-urls-and-concat';

describe('updateAssetUrlsAndConcat', () => {
  let resultFile;

  beforeEach(done => {
    jasmine.addMatchers({toHaveOrder});

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


    const files = [
      {
        packageName: 'package-a',
        contents: new Buffer([
          '.bg-cloud { background: url("path/to/asset-a1.jpg"); }',
          '.bg-sky { background: url(\'path/to/asset-a2.jpg\'); }'
        ].join('\n'))
      },
      {
        packageName: 'package-b',
        contents: new Buffer('.h1 { font-size: 16px; }')
      },
      {
        packageName: 'package-c',
        contents: new Buffer('.logo { background: url(path/to/asset-c1.jpg); }')
      }
    ];

    readArray([...files, renameTable])
      .pipe(updateAssetUrlsAndConcat())
      .pipe(writeArray((error, data) => {
        resultFile = data[0];
        done();
      }));
  });

  it('returns a concatenated css file, where the asset urls are replaced with the new ones defined by the lookup table', () => {
    const css = resultFile.contents.toString();
    expect(resultFile.path).toEqual('components.css');
    expect(css).toContain('.bg-cloud { background: url("package-a/asset-a1.jpg"); }');
    expect(css).toContain('.bg-sky { background: url(\'package-a/asset-a2.jpg\'); }');
    expect(css).toContain('.h1 { font-size: 16px; }');
    expect(css).toContain('.logo { background: url(package-c/asset-c1.jpg); }');
  });

  it('concatenates the css in the supplied order', () => {
    const css = resultFile.contents.toString();
    expect(css).toHaveOrder('.bg-cloud', '.h1');
    expect(css).toHaveOrder('.h1', '.logo');
  });
});

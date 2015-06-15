import {readArray, writeArray, map} from 'event-stream';
import File from 'vinyl';
import generateCss from '../src/generate-css';

describe('generateCss', () => {
  let result;

  beforeEach(done => {
    const inputStream = readArray([
      new File({
        path: 'asset-rename-table.json',
        contents: new Buffer(JSON.stringify({
          'package-a': {
            baseAssetDir: 'node_modules/package-a',
            assetLocationTranslation: {'path/to/asset-a1.jpg': 'package-a/asset-a1.jpg'}
          },
          'package-b': {
            baseAssetDir: 'node_modules/package-b',
            assetLocationTranslation: {}
          }
        }))
      }),
      new File({
        path: 'dependencies-list.json',
        contents: new Buffer(JSON.stringify([
          {path: 'node_modules/package-a/styles.css', packageName: 'package-a'},
          {path: 'node_modules/package-b/styles.css', packageName: 'package-b'}
        ]))
      })
    ]);

    const cssFileStream = map((dependency, callback) => {
      if (dependency.packageName === 'package-a') {
        callback(null, {
          packageName: 'package-a',
          contents: ".the-thing { background: url('path/to/asset-a1.jpg'); }"
        });
      }
      else if (dependency.packageName === 'package-b') {
        callback(null, {
          packageName: 'package-b',
          contents: '.the-thing { background: red; }'
        });
      }
      else {
        callback(`Unknown packageName ${dependency.packageName}`);
      }
    });

    inputStream
      .pipe(generateCss(cssFileStream))
      .pipe(writeArray((error, cssFile) => {
        result = cssFile;
        done();
      }));
  });

  it('generates one css file named components.css', () => {
    expect(result.length).toEqual(1);
    expect(result[0].path).toEqual('components.css');
  });

  it('generates the appropriate css', () => {
    expect(result[0].contents.toString()).toEqual([
      '.the-thing { background: url(\'package-a/asset-a1.jpg\'); }',
      '.the-thing { background: red; }'
    ].join('\n'));
  });
});

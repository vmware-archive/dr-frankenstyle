import path from 'path';
import through2 from 'through2';
import File from 'vinyl';
import assets from '../src/assets';

describe('assets', function() {
  const cssFile1 = Object.assign(
    new File({
      path: 'spec/fixtures/assets_spec/package1/cssFile1.css',
      contents: new Buffer([
        '.table { background: url(   "foo.png?a=b&c=d"); }',
        'h1 { color: blue }',
        '.clouds { background: url(\'clouds.png#1234\'); }'
      ].join('\n'))
    }), {
      packageName: 'package1'
    }
  );
  const cssFile2 = Object.assign(
    new File({
      path: 'spec/fixtures/assets_spec/package2/cssFile2.css',
      contents: new Buffer([
        '@font-face { font-family: "SourceSansPro"; src: url("fonts/sourcesanspro-light-webfont.eot"); src: url("fonts/sourcesanspro-bold-webfont.eot?#iefix"); }',
        'a { cursor: pointer }'
      ].join('\n'))
    }),
    {
      packageName: 'package2'
    }
  );

  let stream;
  let cssFile;
  let assetFiles;

  beforeEach(function(done) {
    assetFiles = [];

    stream = through2.obj();
    stream
      .pipe(assets())
      .pipe(through2.obj(
        function(file, encoding, callback) {
          if (path.extname(file.path) === '.css') {
            cssFile = file;
          } else {
            assetFiles.push(file);
          }
          callback(null, file);
        },
        function(throughDone) {
          throughDone();
          done();
        }
      ));

    stream.write(cssFile1);
    stream.write(cssFile2);
    stream.end();
  });

  it('generates a concatenated css file called "components.css"', function() {
    expect(cssFile.path).toEqual('components.css');
  });

  it('moves any asset file into a subdirectory, stripping any query params', function() {
    const foo = assetFiles.map(assetFile => ({path: assetFile.path, contents: assetFile.contents.toString().trim()}));

    expect(foo.length).toEqual(4);
    expect(foo).toContain({path: 'package1/foo.png', contents: 'foo.png contents'});
    expect(foo).toContain({path: 'package1/clouds.png', contents: 'clouds.png contents'});
    expect(foo).toContain({path: 'package2/sourcesanspro-light-webfont.eot', contents: 'font contents'});
    expect(foo).toContain({path: 'package2/sourcesanspro-bold-webfont.eot', contents: 'font contents'});
  });

  it('does not modify non-url css rules', function() {
    const css = cssFile.contents.toString();
    expect(css).toContain('h1 { color: blue }');
    expect(css).toContain('a { cursor: pointer }');
  });

  it('modifies urls to match the new asset structure', function() {
    const css = cssFile.contents.toString();
    expect(css).toContain(".table { background: url('package1/foo.png?a=b&c=d'); }");
    expect(css).toContain(".clouds { background: url('package1/clouds.png#1234'); }");
    expect(css).toContain("@font-face { font-family: \"SourceSansPro\"; src: url('package2/sourcesanspro-light-webfont.eot'); src: url('package2/sourcesanspro-bold-webfont.eot?#iefix'); }");
  });
});

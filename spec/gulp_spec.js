import through2 from 'through2';
import proxyquire from 'proxyquire';

// In order to test the local Gulp plugin against the local DrFrankenstyle, we have to override
// `require('dr-frankenstyle')` in the Gulp plugin to point to the local DrFrankenstyle instead of
// the npm version
const drFrankenstyle = proxyquire('../gulp', {
  'dr-frankenstyle': require('../')
});

describe('gulp-dr-frankenstyle', function() {
  describe('.railsUrls', function() {
    it('replaces "url(" with "asset-url(" in css files', function(done) {
      const cssInput = ".foo {background: url('bar/foo.png'); color: red;}, .baz {background: url('something/else.png');}";
      const cssOutput = ".foo {background: asset-url('bar/foo.png'); color: red;}, .baz {background: asset-url('something/else.png');}";

      const stream = through2.obj();
      stream
        .pipe(drFrankenstyle.railsUrls())
        .pipe(through2.obj(function(file, encoding, callback) {
          expect(file.contents.toString()).toBe(cssOutput);
          done();
        }));

      stream.write({path: 'components.css', contents: new Buffer(cssInput)});
    });

    it('does nothing to non-css files', function(done) {
      const fileInput = ".foo {background: url('bar/foo.png'); color: red;}, .baz {background: url('something/else.png');}";

      const stream = through2.obj();
      stream
        .pipe(drFrankenstyle.railsUrls())
        .pipe(through2.obj(function(file, encoding, callback) {
          expect(file.contents.toString()).toBe(fileInput);
          done();
        }));

      stream.write({path: 'notCss.png', contents: new Buffer(fileInput)});
    });
  });
});

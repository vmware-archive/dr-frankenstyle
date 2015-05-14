import through2 from 'through2';

// In order to test the local Gulp plugin against the local DrFrankenstyle, we have to
// add dr-frankenstyle as a devDependency of dr-frankenstyle and run `npm install` before running
// jasmine. See the `package.json` for more details.
import drFrankenstyle from '../gulp';

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

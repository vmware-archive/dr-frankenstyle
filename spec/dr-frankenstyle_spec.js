import path from 'path';
import through2 from 'through2';
import {generateProject, cleanupProject} from './helpers/dummy_project';
import {toHaveOrder} from './helpers/jasmine_matchers';
import drFrankenstyle from '../src/dr-frankenstyle';

const originalWorkingDirectory = process.cwd();

describe('dr-frankenstyle', function() {
  beforeEach(function() {
    jasmine.addMatchers({toHaveOrder});
    generateProject(__dirname, 'myApp');
    process.chdir(path.join(__dirname, 'myApp'));
  });

  afterEach(function() {
    cleanupProject(__dirname, 'myApp');
    process.chdir(originalWorkingDirectory);
  });

  describe('.railsUrls', function() {
    it('replaces "url(" with "asset-url(" in css files', function(done) {
      const cssInput = `.foo {background: url('bar/foo.png'); color: red;}, .baz {background: url('something/else.png');}`;
      const cssOutput = `.foo {background: asset-url('bar/foo.png'); color: red;}, .baz {background: asset-url('something/else.png');}`;

      const stream = through2.obj();
      stream
        .pipe(drFrankenstyle.railsUrls())
        .pipe(through2.obj(function(file, encoding, callback) {
          expect(file.contents.toString()).toBe(cssOutput);
          callback(null, file);
          done();
        }));

      stream.write({path: 'components.css', contents: new Buffer(cssInput)});
    });

    it('does nothing to non-css files', function(done) {
      const fileInput = `.foo {background: url('bar/foo.png'); color: red;}, .baz {background: url('something/else.png');}`;

      const stream = through2.obj();
      stream
        .pipe(drFrankenstyle.railsUrls())
        .pipe(through2.obj(function(file, encoding, callback) {
          expect(file.contents.toString()).toBe(fileInput);
          callback(null, file);
          done();
        }));

      stream.write({path: 'notCss.png', contents: new Buffer(fileInput)});
    });
  });
});

import path from 'path';
import {directory} from '../lib/strategies';
import {readFile} from '../lib/async';
import promisify from 'es6-promisify';
import rimraf from 'rimraf';

let rmr = promisify(rimraf);

describe('strategies', function(){
  afterEach(async function(done) {
    await rmr('tmp');
    done();
  });

  describe('#directory', function() {
    it('puts the final css file in the directory', async function(done) {
      let callback = jasmine.createSpy('callback');
      await directory('tmp/foo')({path: 'components.css', contents: new Buffer('bar')}, callback);
      expect(await readFile('tmp/foo/components.css', 'utf8')).toEqual('bar');
      done();
    });

    it('namespaces assets', async function(done) {
      let callback = jasmine.createSpy('callback');
      await directory('tmp')({
        importedBy: 'node_modules/foo_mod/foo.css',
        path: 'image.png',
        contents: new Buffer('foo')
      }, callback);
      expect(await readFile('tmp/foo_mod/image.png', 'utf8')).toEqual('foo');
      expect(callback).toHaveBeenCalledWith(null, jasmine.objectContaining({path: 'foo_mod/image.png'}));

      callback.calls.reset();

      await directory('tmp')({
        importedBy: 'node_modules/foo_mod/node_modules/bar_mod/bar.css',
        path: 'image.png',
        contents: new Buffer('bar')
      }, callback);
      expect(await readFile('tmp/bar_mod/image.png', 'utf8')).toEqual('bar');
      expect(callback).toHaveBeenCalledWith(null, jasmine.objectContaining({path: 'bar_mod/image.png'}));
      done();
    });
  });
});
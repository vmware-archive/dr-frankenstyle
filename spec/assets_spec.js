import path from 'path';
import fs from 'fs';
import assets from '../lib/assets';

let fixturePath = fixtureFile => path.resolve(__dirname, 'fixtures', fixtureFile);
let fixture = fixtureFile => fs.readFileSync(fixturePath(fixtureFile));

class TestPromise extends Promise {
  constructor() {
    let resolve, reject;
    super((...args) => [resolve, reject] = args);
    Object.assign(this, {resolve, reject});
  }
}

describe('assets', function() {
  it('works', async function(done) {
    let files = [];
    let promise = new TestPromise();
    let count = 0;
    assets(
      [
        fixturePath('style1.css'),
        fixturePath('style2.css')
      ],
      (file, callback) => {
        files.push(file);
        file.path = file.path.replace('gif', 'png');
        callback(null, file);
        if (++count === 4) promise.resolve('hello');
      }
    );

    await promise;

    expect(files[0].path).toBe('image1.png');
    expect(files[0].importedBy).toBe(fixturePath('style1.css'));
    expect(files[0].contents.equals(fixture('image1.gif'))).toBe(true);

    expect(files[1].path).toBe('folder/image2.png');
    expect(files[1].importedBy).toBe(fixturePath('style1.css'));
    expect(files[1].contents.equals(fixture('folder/image2.gif'))).toBe(true);

    expect(files[2].path).toBe('folder/image2.png');
    expect(files[2].importedBy).toBe(fixturePath('style2.css'));
    expect(files[2].contents.equals(fixture('folder/image2.gif'))).toBe(true);

    expect(files[3].path).toBe('components.css');
    expect(files[3].contents.toString()).toBe(fixture('expected_output.css').toString());

    done();
  });
});
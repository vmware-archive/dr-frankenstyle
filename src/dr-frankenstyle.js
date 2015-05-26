import fs from 'fs-promise';
import path from 'path';
import through2 from 'through2';
import promisify from 'es6-promisify';
import DependencyGraph from './dependency_graph';
import modifyAssetPaths from './assets';
import File from 'vinyl';

function gatherCssFiles() {
  const stream = through2.obj();

  (async () => {
    try {
      const dependencies = await new DependencyGraph().orderedStyleDependencies();
      for (const packageJson of dependencies) {
        const cssPath = path.resolve(packageJson.path, packageJson.style);
        await promisify(stream.write.bind(stream))(Object.assign(
          new File({path: cssPath, contents: await fs.readFile(cssPath)}),
          {packageName: packageJson.name}
        ));
      }
      await promisify(stream.end.bind(stream))();
    } catch (e) {
      console.log(e.stack);
    }
  })();

  return stream;
}

export default function drFrankenstyle() {
  return gatherCssFiles()
    .pipe(modifyAssetPaths());
}

drFrankenstyle.railsUrls = function() {
  return through2.obj(function(file, encoding, callback) {
    if (path.extname(file.path) === '.css') {
      var newContents = file.contents.toString().replace(/url\(/g, 'asset-url(');
      file.contents = new Buffer(newContents);
    }
    callback(null, file);
  });
};

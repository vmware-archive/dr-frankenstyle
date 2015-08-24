import through2 from 'through2';
import path from 'path';
import DependencyGraph from './dependency_graph';
import promisify from 'es6-promisify';

export default function cssDependencies(whitelist) {
  const stream = through2.obj();

  (async () => {
    try {
      const dependencies = await new DependencyGraph(whitelist).orderedStyleDependencies();
      for (const packageJson of dependencies) {
        const cssPath = path.resolve(packageJson.path, packageJson.style);
        await promisify(stream.write.bind(stream))({
          path: cssPath,
          packageName: packageJson.name
        });
      }
      await promisify(stream.end.bind(stream))();
    } catch (error) {
      console.error(error.stack);
    }
  })();

  return stream;
}

import es from 'event-stream';
import fs from 'fs-promise';
import path from 'path';
import promisify from 'es6-promisify';
import globWithCallback from 'glob';
import DAG from 'dag-map';

const glob = promisify(globWithCallback);

export default class DependencyGraph {
  constructor(rootPackageDir = process.cwd()) {
    this.rootPackageDir = rootPackageDir;
  }

  readJson(...paths) {
    return new Promise(async (resolve) => {
      try {
        const packageJsonPath = path.resolve(this.rootPackageDir, ...paths);
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
        packageJson.path = path.dirname(packageJsonPath);
        resolve(packageJson);
      } catch(e) {
        resolve(null);
      }
    });
  }

  installedPackagesLookup() {
    return new Promise(async (resolve, reject) => {
      const packageJsonPaths = await glob(
        '**/node_modules/*/package.json',
        {
          cwd: this.rootPackageDir,

          // To enable dr-frankenstyle to detect npm linked packages
          // Note: we couldn't figure out how to test this
          follow: true
        }
      );

      var readJson = this.readJson.bind(this);

      var doneFiles = 0;
      const BatchSize = 50;
      es.readable(async function(count, callback) {
          if (count >= packageJsonPaths.length) {
            if(doneFiles === packageJsonPaths.length) {
              return this.emit('end');
            }
            return callback();
          }

          if(count < doneFiles + BatchSize) {
            callback();
          }
          var data = await readJson(packageJsonPaths[count]);
          this.emit('data', data);
          doneFiles++;
          // If you do not wait for the file to read before calling the callback,
          // you may hit the open file limit on certain machines, like concourse.
          callback();
        })
        .pipe(es.writeArray(function(err, packageJsons) {
          if(err) reject(err);
          resolve(packageJsons
            .filter(Boolean)
            .reduce((lookupTable, pkg) => {
              lookupTable[pkg.name] = pkg;
              return lookupTable;
            }, {}));
          }));
    });
  }

  async dependencies() {
    const rootPackageJson = await this.readJson('package.json');
    const installedPackagesLookup = await this.installedPackagesLookup();

    const result = new Set();
    const packagesToCheck = [rootPackageJson];
    while (packagesToCheck.length) {
      const pkg = packagesToCheck.shift();
      if(!pkg) continue;
      for (const dependencyName of Object.keys(Object(pkg.dependencies))) {
        const dependency = installedPackagesLookup[dependencyName];
        if(!dependency) console.error(`ERROR: missing dependency "${dependencyName}"`);
        if (result.has(dependency)) { continue; }
        result.add(dependency);
        packagesToCheck.push(dependency);
      }
    }
    return Array.from(result);
  }

  async styleDependencies() {
    return (await this.dependencies())
      .filter(Boolean)
      .filter(packageJson => 'style' in packageJson);
  }

  async styleDependencyLookup() {
    const styleDependencies = (await this.styleDependencies()).filter(Boolean);
    const styleDependencyNames = styleDependencies.map(pkg => pkg.name);

    return styleDependencies.reduce((lookupTable, pkg) => {
      lookupTable[pkg.name] = Object.keys(Object(pkg.dependencies))
        .filter(dependencyName => styleDependencyNames.indexOf(dependencyName) >= 0);
      return lookupTable;
    }, {});
  }

  async orderedStyleDependencies() {
    const dag = new DAG();
    const installedPackagesLookup = await this.installedPackagesLookup();
    const styleDependencyLookup = await this.styleDependencyLookup();
    const packageNames = Object.keys(styleDependencyLookup);

    for (const packageName of packageNames) {
      dag.add(packageName);
      for (const dependency of styleDependencyLookup[packageName]) {
        dag.addEdge(dependency, packageName);
      }
    }

    const result = [];
    dag.topsort(vertex => result.push(vertex.name));
    return result.map(packageName => installedPackagesLookup[packageName]);
  }
}

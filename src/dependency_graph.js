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

  async readJson(...paths) {
    const packageJsonPath = path.resolve(this.rootPackageDir, ...paths);
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
    packageJson.path = path.dirname(packageJsonPath);
    return packageJson;
  }

  async installedPackagesLookup() {
    const packageJsonPaths = await glob(
      '**/node_modules/*/package.json',
      {cwd: this.rootPackageDir}
    );
    const packageJsons = await* packageJsonPaths
      .map(relativePath => this.readJson(relativePath));

    return packageJsons.reduce((lookupTable, pkg) => {
      lookupTable[pkg.name] = pkg;
      return lookupTable;
    }, {});
  }

  async dependencies() {
    const rootPackageJson = await this.readJson('package.json');
    const installedPackagesLookup = await this.installedPackagesLookup();

    const result = new Set();
    const packagesToCheck = [rootPackageJson];
    while (packagesToCheck.length) {
      const pkg = packagesToCheck.shift();
      for (const dependencyName of Object.keys(Object(pkg.dependencies))) {
        const dependency = installedPackagesLookup[dependencyName];
        if (result.has(dependency)) { continue; }
        result.add(dependency);
        packagesToCheck.push(dependency);
      }
    }
    return Array.from(result);
  }

  async styleDependencies() {
    return (await this.dependencies())
      .filter(packageJson => 'style' in packageJson);
  }

  async styleDependencyLookup() {
    const styleDependencies = await this.styleDependencies();
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

import fs from 'fs-promise';
import path from 'path';
import promisify from 'es6-promisify';
import globWithCallback from 'glob';

const glob = promisify(globWithCallback);

export default class DependencyGraph {
  constructor(rootPackageDir = process.cwd()) {
    this.rootPackageDir = rootPackageDir;
  }

  async readJson(...paths) {
    return JSON.parse(await fs.readFile(path.resolve(this.rootPackageDir, ...paths), 'utf8'));
  }

  async installedPackages() {
    const packageJsonPaths = await glob(
      '**/node_modules/*/package.json',
      {cwd: this.rootPackageDir}
    );
    const packageJsonContents = await* packageJsonPaths
      .map(relativePath => path.resolve(this.rootPackageDir, relativePath))
      .map(absolutePath => fs.readFile(absolutePath, 'utf8'));
    return packageJsonContents.map(contents => JSON.parse(contents));
  }

  async dependencies() {
    const rootPackageJson = await this.readJson('package.json');
    return (await this.installedPackages())
      .filter(packageJson => packageJson.name in rootPackageJson.dependencies);
  }

  async styleDependencies() {
    return (await this.installedPackages())
      .filter(packageJson => 'style' in packageJson);
  }
}

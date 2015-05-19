import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';

const packageJson = {};

function d(name, dependencies) {
  if (!packageJson[name]) {
    packageJson[name] = {
      name: name,
      dependencies: (dependencies || []).reduce((memo, dependency) => {
        memo[dependency.name] = dependency;
        return memo;
      }, {})
    };
  }
  return JSON.parse(JSON.stringify(packageJson[name]));
}

function writePackage(packageJson, directory) {
  let packageDir = path.resolve(directory, packageJson.name);
  fs.mkdirSync(packageDir);
  fs.mkdirSync(path.resolve(packageDir, 'node_modules'));
  fs.writeFileSync(path.resolve(packageDir, 'style.css'), '.' + packageJson.name + ` {background: url('${packageJson.name}.png')}`);
  fs.writeFileSync(path.resolve(packageDir, `${packageJson.name}.png`), '');
  fs.writeFileSync(path.resolve(packageDir, 'package.json'), JSON.stringify({
    name: packageJson.name,
    style: 'style.css',
    dependencies: Object.keys(packageJson.dependencies)
      .reduce((memo, dependencyName) => {
        memo[dependencyName] = '0.0.1';
        return memo;
      }, {})
  }, null, 2));

  Object.keys(packageJson.dependencies).forEach(dependencyName => {
    let nodeModulesDirectory = path.resolve(packageDir, 'node_modules');
    writePackage(packageJson.dependencies[dependencyName], nodeModulesDirectory);
  });
}

export function generateProject(directory, projectName) {
  d('brakes', [d('calipers'), d('drums')]);
  d('delorean', [d('tires'), d('brakes'), d('mr-fusion')]);
  d('timeTravel', [d('delorean'), d('88-mph')]);
  d('focus', [d('tires'), d('brakes')]);
  d('f150', [d('truck-tires'), d('cowboy-hat'), d('truck-bed', [d('gate')])]);
  const dependencyTree = d(projectName, [d('timeTravel'), d('delorean'), d('focus'), d('f150')]);

  writePackage(dependencyTree, directory);
}

export function cleanupProject(directory, projectName) {
  rimraf.sync(path.resolve(directory, projectName));
}

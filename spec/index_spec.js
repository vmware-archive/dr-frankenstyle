import fs from 'fs';
import path from 'path';
import childProcess from 'child_process';
import rimraf from 'rimraf';
import drFrankenstyle from '../index';
import through2 from 'through2';
import {readFile} from '../lib/async';

let packageJson = {};

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
  fs.writeFileSync(path.resolve(packageDir, 'style.css'), '.' + packageJson.name + ' {color: red}');
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

function writeCode(filePath, fn) {
  fs.writeFileSync(filePath, '(' + fn.toString() + ')();');
}

describe('dr-frankenstyle', function() {
  beforeEach(function() {
    jasmine.addMatchers({
      toHaveOrder: () => {
        return {
          compare: (actual, first, second) => {
            let firstIndex = actual.indexOf(first);
            let secondIndex = actual.indexOf(second);
            let pass = firstIndex < secondIndex && (firstIndex !== -1) && (secondIndex !== -1);
            let message = pass ?
              'Expected ' + first + ' not to be before ' + second :
              'Expected ' + first + ' to be before ' + second;
            return {pass, message};
          }
        };
      }
    });

    d('brakes', [d('calipers'), d('drums')]);
    d('delorean', [d('tires'), d('brakes'), d('mr-fusion')]);
    d('timeTravel', [d('delorean'), d('88-mph')]);
    d('focus', [d('tires'), d('brakes')]);
    d('f150', [d('truck-tires'), d('cowboy-hat'), d('truck-bed', [d('gate')])]);
    let dependencyTree = d('myApp', [d('timeTravel'), d('delorean'), d('focus'), d('f150')]);

    writePackage(dependencyTree, __dirname);
  });

  afterEach(function() {
    rimraf.sync(path.resolve(__dirname, 'myApp'));
  });

  describe('without streaming', function() {
    let css;
    beforeEach(function() {
      writeCode(path.resolve(__dirname, 'myApp', 'index.js'), () => {
        require('../../index.js')(function(file, callback) {
          if (file.path === 'components.css') console.log(file.contents.toString());
          callback(null, file);
        });
      });
      css = childProcess.spawnSync('node', ['index.js'], {cwd: path.resolve(__dirname, 'myApp')})
        .stdout.toString();
    });

    it('has no duplicates', function() {
      var rules = css.split('\n').filter(Boolean);
      var expectedPackages = ['tires', 'brakes', 'calipers', 'drums', 'delorean', 'mr-fusion', 'focus', 'f150', 'truck-tires', 'cowboy-hat', 'truck-bed', 'gate', 'timeTravel', '88-mph'];

      for(var i = 0; i < expectedPackages.length; i++) {
        expect(rules).toContain('.' + expectedPackages[i] + ' {color: red}');
      }
      expect(rules.length).toBe(expectedPackages.length);
    });

    it('inlines the css in the right order', function() {
      expect(css).toHaveOrder('drums', 'brakes');
      expect(css).toHaveOrder('calipers', 'brakes');
      expect(css).toHaveOrder('mr-fusion', 'delorean');
      expect(css).toHaveOrder('brakes', 'delorean');
      expect(css).toHaveOrder('brakes', 'focus');
      expect(css).toHaveOrder('gate', 'truck-bed');
      expect(css).toHaveOrder('cowboy-hat', 'f150');
      expect(css).toHaveOrder('truck-bed', 'f150');
      expect(css).toHaveOrder('truck-tires', 'f150');
      expect(css).toHaveOrder('88-mph', 'timeTravel');
      expect(css).toHaveOrder('delorean', 'timeTravel');
    });
  });

  describe('streaming', function() {
    let files;
    beforeEach(function() {
      writeCode(path.resolve(__dirname, 'myApp', 'index.js'), () => {
        require('../../index.js')({stream: true})
          .pipe(require('through2').obj(function(file, encoding, callback){
            console.log(file.path);
            callback(null, file);
        }));
      });
      files = childProcess.spawnSync('node', ['index.js'], {cwd: path.resolve(__dirname, 'myApp')})
        .stdout.toString();
    });

    it('streams all the files', function() {
      expect(files.trim()).toBe('components.css');
    });
  });

  describe('directory', function() {
    beforeEach(function() {
      writeCode(path.resolve(__dirname, 'myApp', 'index.js'), () => {
        require('../../index.js')({directory: 'tmp'})
      });
      childProcess.spawnSync('node', ['index.js'], {cwd: path.resolve(__dirname, 'myApp')});
    });

    it('writes the files', async function(done) {
      var assetDir = path.resolve(__dirname, 'myApp', 'tmp');
      expect(await readFile(path.join(assetDir, 'components.css'), 'utf8')).toContain('{color: red}');
      done();
    });
  });
});
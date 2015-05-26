import path from 'path';
import fs from 'fs-promise';
import {exec} from 'child-process-promise';
import {generateProject, cleanupProject} from './helpers/dummy_project';
import {toHaveOrder, toBeAFile} from './helpers/jasmine_matchers';

import install from 'jasmine-es6/dist/overrides/async';
import {catchError} from 'jasmine-es6';
install();

const command = `babel-node ${path.join(__dirname, '..', 'src', 'cli.js')}`;
const expectedPackages = ['tires', 'brakes', 'calipers', 'drums', 'delorean', 'mr-fusion', 'focus', 'f150', 'truck-tires', 'cowboy-hat', 'truck-bed', 'gate', 'timeTravel', '88-mph'];
const originalWorkingDirectory = process.cwd();

async function cli(args = '') {
  return await exec(`${command} ${args}`);
}

async function readCss() {
  return await fs.readFile(path.resolve('public', 'components.css'), 'utf8');
}

describe('dr-frankenstyle', function() {
  beforeEach(function() {
    jasmine.addMatchers({toHaveOrder, toBeAFile});

    generateProject(__dirname, 'myApp');
    process.chdir(path.resolve(__dirname, 'myApp'));
  });

  afterEach(function() {
    cleanupProject(__dirname, 'myApp');
    process.chdir(originalWorkingDirectory);
  });

  describe('when called with no arguments', function() {
    it('shows an error message', async function() {
      const output = await catchError(cli());
      expect(output).toContain('Please provide an output directory');
    });
  });

  function itProducesTheExpectedOutput() {
    it('writes a css file and all asset files', function() {
      expect(path.join('public', 'components.css')).toBeAFile();

      for (const expectedPackage of expectedPackages) {
        expect(path.join('public', expectedPackage, `${expectedPackage}.png`)).toBeAFile();
      }
    });

    it('inlines the css in the right order', async function() {
      const css = await readCss();
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

    it('has no duplicates', async function() {
      const css = await readCss();
      const rules = css.split('\n').filter(Boolean);
      expect(rules.length).toBe(expectedPackages.length);

      for (const expectedPackage of expectedPackages) {
        expect(rules).toContain(jasmine.stringMatching(`\\.${expectedPackage} \\{`));
      }
    });
  }

  describe('normal use case', async function() {
    beforeEach(async function() {
      const {stdout, stderr} = await cli('public/');
      if (stdout.toString().trim().length) console.log(stdout.toString());
      if (stderr.toString().trim().length) console.log(stderr.toString());
    });

    itProducesTheExpectedOutput();

    it('puts assets in subdirectories', async function() {
      const css = await readCss();
      const rules = css.split('\n').filter(Boolean);

      for (const expectedPackage of expectedPackages) {
        expect(rules).toContain(`.${expectedPackage} {background: url('${expectedPackage}/${expectedPackage}.png')}`);
      }
    });
  });

  describe('with Rails asset-urls', function() {
    beforeEach(async function() {
      await cli('--rails public/');
    });

    itProducesTheExpectedOutput();

    it('puts assets in subdirectories and uses the asset-url helper', async function() {
      const css = await readCss();
      const rules = css.split('\n').filter(Boolean);

      for (const expectedPackage of expectedPackages) {
        expect(rules).toContain(`.${expectedPackage} {background: asset-url('${expectedPackage}/${expectedPackage}.png')}`);
      }
    });
  });
});

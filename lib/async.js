import fs from 'fs';
import {load as npmLoad} from 'npm';
import npmLs from 'npm/lib/ls';
import mkdirp from 'mkdirp';
import promisify from 'es6-promisify';

export const mkdir = promisify(mkdirp);
export const readFile = promisify(fs.readFile);
export const writeFile = promisify(fs.writeFile);

export const npm = {
  load: promisify(npmLoad),
  commands: {
    ls: promisify(npmLs)
  }
};

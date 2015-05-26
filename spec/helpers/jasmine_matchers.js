import fs from 'fs';

export function toHaveOrder() {
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

export function toBeAFile() {
  return {
    compare: filePath => {
      let pass, message;
      try {
        fs.readFileSync(filePath);
        pass = true;
        message = `Expected ${filePath} to not be a file.`;
      } catch (e) {
        pass = false;
        message = `Expected ${filePath} to be a file.`;
      }

      return {pass, message};
    }
  };
}

export function toHavePackages(util, equalityTesters) {
  return {
    compare: function(actualPackages, expectedPackageNames) {
      const result = {};
      const actualPackageNames = actualPackages
        .map(packageJson => packageJson.name);
      result.pass = util.equals(
        actualPackageNames.sort(),
        expectedPackageNames.sort(),
        equalityTesters
      );
      if (!result.pass) {
        const actual = `[${actualPackageNames.join(', ')}]`;
        const expected = `[${expectedPackageNames.join(', ')}]`;
        result.message = `Expected ${actual} to equal ${expected}`;
      }
      return result;
    }
  };
}


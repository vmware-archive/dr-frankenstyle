import path from 'path';
import DependencyGraph from '../src/dependency_graph';

const puiCssDependencies = {
  'pui-css-alerts': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-alignment': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-avatars': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-back-to-top': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-backgrounds': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-bootstrap': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-buttons': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-code': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-collapse': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-colors': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-deprecated': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-dividers': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-dropdowns': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-ellipsis': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-embeds': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-forms': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-grids': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-hoverable': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-iconography': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-images': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-labels': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-links': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-lists': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-google-maps': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-media': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-modals': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-panels': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-panes': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-progress-bars': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-react-animations': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-ribbons': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-spinners': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-tables': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-tabs': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-tooltips': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-typography': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-vertical-alignment': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-whitespace': ['pui-css-bootstrap', 'pui-css-typography']
}
const puiCssPackages = Object.keys(puiCssDependencies);

function toHavePackages(util, equalityTesters) {
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

fdescribe('DependencyGraph', function() {
  beforeEach(function() {
    jasmine.addMatchers({toHavePackages});
  });

  it('reads the package.json of every installed package in the node_modules directory', async function() {
    const graph = new DependencyGraph(path.resolve('spec/fixtures/pivotal-ui'));
    expect(await graph.installedPackages()).toHavePackages(
      puiCssPackages.concat('non-dependency-package', 'no-style-dependency')
    );
  });

  it('reads the package.json of every installed dependency', async function() {
    const graph = new DependencyGraph(path.resolve('spec/fixtures/pivotal-ui'));
    expect(await graph.dependencies()).toHavePackages(
      puiCssPackages.concat('no-style-dependency')
    );
  });

  it('excludes packages that do not have a style attribute in the package.json', async function() {
    const graph = new DependencyGraph(path.resolve('spec/fixtures/pivotal-ui'));
    expect(await graph.styleDependencies())
      .toHavePackages(puiCssPackages);
  });

  xit('reads the package.json of every installed dependency', async function() {
    const graph = new DependencyGraph(path.resolve('spec/fixtures/pivotal-ui'));
    expect(await graph.dependencies()).toEqual({
      'pui-css-alerts': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-alignment': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-avatars': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-back-to-top': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-backgrounds': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-bootstrap': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-buttons': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-code': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-collapse': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-colors': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-deprecated': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-dividers': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-dropdowns': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-ellipsis': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-embeds': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-forms': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-grids': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-hoverable': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-iconography': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-images': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-labels': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-links': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-lists': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-google-maps': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-media': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-modals': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-panels': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-panes': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-progress-bars': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-react-animations': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-ribbons': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-spinners': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-tables': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-tabs': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-tooltips': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-typography': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-vertical-alignment': ['pui-css-bootstrap', 'pui-css-typography'],
      'pui-css-whitespace': ['pui-css-bootstrap', 'pui-css-typography']
    });
  });
});

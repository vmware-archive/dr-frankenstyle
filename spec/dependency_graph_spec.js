import path from 'path';
import {toHavePackages, toHaveOrder} from './helpers/jasmine_matchers';
import DependencyGraph from '../src/dependency_graph';

const puiCssDependencies = {
  'pui-css-alerts': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-alignment': [],
  'pui-css-avatars': ['pui-css-bootstrap'],
  'pui-css-back-to-top': ['pui-css-bootstrap', 'pui-css-links', 'pui-css-iconography'],
  'pui-css-backgrounds': [],
  'pui-css-bootstrap': [],
  'pui-css-buttons': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-code': ['pui-css-iconography'],
  'pui-css-collapse': ['pui-css-bootstrap'],
  'pui-css-colors': [],
  'pui-css-deprecated': [],
  'pui-css-dividers': [],
  'pui-css-dropdowns': ['pui-css-bootstrap'],
  'pui-css-ellipsis': [],
  'pui-css-embeds': ['pui-css-bootstrap'],
  'pui-css-forms': ['pui-css-bootstrap'],
  'pui-css-grids': ['pui-css-bootstrap'],
  'pui-css-hoverable': [],
  'pui-css-iconography': ['pui-css-typography'],
  'pui-css-images': ['pui-css-bootstrap'],
  'pui-css-labels': ['pui-css-bootstrap'],
  'pui-css-links': ['pui-css-bootstrap'],
  'pui-css-lists': ['pui-css-bootstrap', 'pui-css-typography'],
  'pui-css-google-maps': [],
  'pui-css-media': ['pui-css-bootstrap'],
  'pui-css-modals': ['pui-css-bootstrap'],
  'pui-css-panels': ['pui-css-bootstrap'],
  'pui-css-panes': ['pui-css-bootstrap'],
  'pui-css-progress-bars': ['pui-css-bootstrap'],
  'pui-css-react-animations': [],
  'pui-css-ribbons': [],
  'pui-css-spinners': ['pui-css-iconography'],
  'pui-css-tables': ['pui-css-bootstrap'],
  'pui-css-tabs': ['pui-css-bootstrap'],
  'pui-css-tooltips': ['pui-css-typography'],
  'pui-css-typography': ['pui-css-bootstrap'],
  'pui-css-vertical-alignment': [],
  'pui-css-whitespace': []
};
const puiCssPackages = Object.keys(puiCssDependencies);

describe('DependencyGraph', function() {
  beforeEach(function() {
    jasmine.addMatchers({toHavePackages, toHaveOrder});
  });

  it('reads the package.json of every installed package in the node_modules directory', async function() {
    const graph = new DependencyGraph(null, path.resolve('spec/fixtures/pivotal-ui'));
    expect(Object.values(await graph.installedPackagesLookup())).toHavePackages(
      puiCssPackages.concat('non-dependency-package', 'nested-non-dependency-package', 'no-style-dependency')
    );
  });

  it('ignores any package.json files that are not valid JSON', async function() {
    const graph = new DependencyGraph(null, path.resolve('spec/fixtures/project-with-invalid-json'));
    expect(await graph.dependencies()).toHavePackages(['valid-package']);
  });

  it('reads the package.json of every installed dependency', async function() {
    const graph = new DependencyGraph(null, path.resolve('spec/fixtures/pivotal-ui'));
    expect(await graph.dependencies()).toHavePackages(
      puiCssPackages.concat('no-style-dependency')
    );
  });

  it('excludes packages that do not have a style attribute in the package.json', async function() {
    const graph = new DependencyGraph(null, path.resolve('spec/fixtures/pivotal-ui'));
    expect(await graph.styleDependencies())
      .toHavePackages(puiCssPackages);
  });

  it('reads the package.json of every installed dependency', async function() {
    const graph = new DependencyGraph(null, path.resolve('spec/fixtures/pivotal-ui'));
    expect(await graph.styleDependencyLookup()).toEqual(puiCssDependencies);
  });

  it('computes an ordered list of style dependencies', async function() {
    const graph = new DependencyGraph(null, path.resolve('spec/fixtures/pivotal-ui'));
    const orderedStyleDependencyNames = (await graph.orderedStyleDependencies())
      .map(packageJson => packageJson.name);

    expect(orderedStyleDependencyNames.length).toEqual(puiCssPackages.length);

    expect(orderedStyleDependencyNames).toHaveOrder('pui-css-bootstrap', 'pui-css-alerts');
    expect(orderedStyleDependencyNames).toHaveOrder('pui-css-bootstrap', 'pui-css-avatars');
    expect(orderedStyleDependencyNames).toHaveOrder('pui-css-bootstrap', 'pui-css-back-to-top');
    expect(orderedStyleDependencyNames).toHaveOrder('pui-css-bootstrap', 'pui-css-buttons');
    expect(orderedStyleDependencyNames).toHaveOrder('pui-css-bootstrap', 'pui-css-collapse');
    expect(orderedStyleDependencyNames).toHaveOrder('pui-css-bootstrap', 'pui-css-dropdowns');
    expect(orderedStyleDependencyNames).toHaveOrder('pui-css-bootstrap', 'pui-css-embeds');
    expect(orderedStyleDependencyNames).toHaveOrder('pui-css-bootstrap', 'pui-css-forms');
    expect(orderedStyleDependencyNames).toHaveOrder('pui-css-bootstrap', 'pui-css-grids');
    expect(orderedStyleDependencyNames).toHaveOrder('pui-css-bootstrap', 'pui-css-images');
    expect(orderedStyleDependencyNames).toHaveOrder('pui-css-bootstrap', 'pui-css-labels');
    expect(orderedStyleDependencyNames).toHaveOrder('pui-css-bootstrap', 'pui-css-links');
    expect(orderedStyleDependencyNames).toHaveOrder('pui-css-bootstrap', 'pui-css-lists');
    expect(orderedStyleDependencyNames).toHaveOrder('pui-css-bootstrap', 'pui-css-media');
    expect(orderedStyleDependencyNames).toHaveOrder('pui-css-bootstrap', 'pui-css-modals');
    expect(orderedStyleDependencyNames).toHaveOrder('pui-css-bootstrap', 'pui-css-panels');
    expect(orderedStyleDependencyNames).toHaveOrder('pui-css-bootstrap', 'pui-css-panes');
    expect(orderedStyleDependencyNames).toHaveOrder('pui-css-bootstrap', 'pui-css-progress-bars');
    expect(orderedStyleDependencyNames).toHaveOrder('pui-css-bootstrap', 'pui-css-tables');
    expect(orderedStyleDependencyNames).toHaveOrder('pui-css-bootstrap', 'pui-css-tabs');
    expect(orderedStyleDependencyNames).toHaveOrder('pui-css-bootstrap', 'pui-css-typography');
    expect(orderedStyleDependencyNames).toHaveOrder('pui-css-iconography', 'pui-css-back-to-top');
    expect(orderedStyleDependencyNames).toHaveOrder('pui-css-iconography', 'pui-css-code');
    expect(orderedStyleDependencyNames).toHaveOrder('pui-css-iconography', 'pui-css-spinners');
    expect(orderedStyleDependencyNames).toHaveOrder('pui-css-links', 'pui-css-back-to-top');
    expect(orderedStyleDependencyNames).toHaveOrder('pui-css-typography', 'pui-css-alerts');
    expect(orderedStyleDependencyNames).toHaveOrder('pui-css-typography', 'pui-css-buttons');
    expect(orderedStyleDependencyNames).toHaveOrder('pui-css-typography', 'pui-css-iconography');
    expect(orderedStyleDependencyNames).toHaveOrder('pui-css-typography', 'pui-css-lists');
    expect(orderedStyleDependencyNames).toHaveOrder('pui-css-typography', 'pui-css-tooltips');

    expect(orderedStyleDependencyNames).toContain('pui-css-alignment');
    expect(orderedStyleDependencyNames).toContain('pui-css-backgrounds');
    expect(orderedStyleDependencyNames).toContain('pui-css-bootstrap');
    expect(orderedStyleDependencyNames).toContain('pui-css-colors');
    expect(orderedStyleDependencyNames).toContain('pui-css-deprecated');
    expect(orderedStyleDependencyNames).toContain('pui-css-dividers');
    expect(orderedStyleDependencyNames).toContain('pui-css-ellipsis');
    expect(orderedStyleDependencyNames).toContain('pui-css-hoverable');
    expect(orderedStyleDependencyNames).toContain('pui-css-google-maps');
    expect(orderedStyleDependencyNames).toContain('pui-css-react-animations');
    expect(orderedStyleDependencyNames).toContain('pui-css-ribbons');
    expect(orderedStyleDependencyNames).toContain('pui-css-vertical-alignment');
    expect(orderedStyleDependencyNames).toContain('pui-css-whitespace');
  });

  it('adds a path property to each packageJson so that the style path can be resolved', async function(done) {
    const graph = new DependencyGraph(null, path.resolve('spec/fixtures/pivotal-ui'));
    const orderedStyleDependencies = (await graph.orderedStyleDependencies());

    expect(orderedStyleDependencies.find(packageJson => packageJson.name === 'pui-css-alerts'))
      .toEqual(jasmine.objectContaining({
        style: 'alerts.css',
        path: path.resolve('spec/fixtures/pivotal-ui/node_modules/pui-css-alerts')
      }));

    done();
  });
});

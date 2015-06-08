import path from 'path';
import proxyquire from 'proxyquire';
import through from 'through2';

class MockDependencyGraph {
  orderedStyleDependencies() {
    return new Promise((resolve) => {
      resolve([
        { path: 'node_modules/style', style: 'style.css', name: 'style' },
        { path: 'node_modules/other_style', style: 'other_style.css', name: 'other_style' }
      ]);
    });
  }
}

var cssDependencies = proxyquire('../src/css-dependencies', {
  './dependency_graph': MockDependencyGraph
});

describe('cssDependencies', function() {
  let result = [];

  beforeEach(function(jasmineDone) {
    cssDependencies().pipe(through.obj(
      function(cssInfo, encoding, callback) {
        result.push(cssInfo);
        callback();
      },
      function(callback) {
        callback();
        jasmineDone();
      }
    ));
  });

  it('returns css info for every style package in dependency order', function() {
    expect(result).toEqual([
      {path: path.resolve('node_modules/style/style.css'), packageName: 'style'},
      {path: path.resolve('node_modules/other_style/other_style.css'), packageName: 'other_style'}
    ]);
  });
});

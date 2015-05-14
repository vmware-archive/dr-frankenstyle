import uniq from 'lodash.uniq';

export default function(dependencyTree, filterRegEx) {
  let result = [];
  let queue = [dependencyTree];
  let node;
  while (queue.length) {
    node = queue.pop();
    result.unshift(node);
    for (let packageName of Object.keys(node.dependencies)) {
      queue.push(node.dependencies[packageName]);
    }
  }
  return uniq(
    result
      .slice(1, -1)
      .filter((packageJson) => !filterRegEx || filterRegEx.test(packageJson.name)),
    (packageJson) => packageJson.name
  );
}
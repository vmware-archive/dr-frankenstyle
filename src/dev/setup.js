import cssDependencies from '../css-dependencies';
import cssFilesFromDependencies from '../css-files-from-dependencies';
import assetRenameTable from '../asset-rename-table';
import {pipeline, map, merge} from 'event-stream';
import reduce from 'stream-reduce';
import File from 'vinyl';
import {src, dest} from 'vinyl-fs';


export default function setupDevelopmentCache({cached=false}) {
  if (cached) {
    return src('tmp/*');
  }

  const cssDependenciesStream = cssDependencies();

  const fileFromDependencyList = pipeline(
    reduce((memo, dependency) => {
      memo.push(dependency);
      return memo;
    }, []),
    map((dependencies, callback) => {
      callback(null, new File({
        path: 'dependencies-list.json',
        contents: new Buffer(JSON.stringify(dependencies, null, 2))
      }));
    })
  );

  const fileFromRenameTable = map((data, callback) => {
    const file = new File({path: 'asset-rename-table.json', contents: new Buffer(JSON.stringify(data, null, 2))});
    callback(null, file);
  });

  const buildDependencyListFile = cssDependenciesStream
    .pipe(fileFromDependencyList);

  const buildAssetRenameTableFile = cssDependenciesStream
    .pipe(cssFilesFromDependencies())
    .pipe(assetRenameTable())
    .pipe(fileFromRenameTable);

  return merge(
    buildDependencyListFile,
    buildAssetRenameTableFile
  ).pipe(dest('tmp/'));
}


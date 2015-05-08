import path from 'path';
import postcss from 'postcss';
import logError from './log_error';
import promisify from 'es6-promisify';
import {readFile} from './async';

async function scanUrls(decl, updatePath) {
  let tokens = decl.value.split(/(url\(.*?\))/); //urls will be at odd indices in the resulting array
  if (tokens.length < 2) return; //no urls
  for (let i = 1; i < tokens.length; i += 2) {
    let token = tokens[i];
    let [, url, queryString] = token.match(/url\(\s*['"]?([^'"?#]*)([^'")]*)/);
    let newUrl = await updatePath(url);
    tokens[i] = `url('${newUrl}${queryString}')`;
  }
  decl.value = tokens.join('');
}

function decls(root) {
  let decls = [];
  root.eachDecl(decl => decls.push(decl));
  return decls;
}

function updateCssPaths(css, updatePath) {
  return logError(
    postcss([
      async root => await* decls(root).map(decl =>
        logError(scanUrls(decl, updatePath), `Failed to parse CSS rule ${decl.value}`)
      )
    ]).process(css),
    'PostCSS has failed to parse the CSS. Exiting.'
  );
}

export default async (cssFiles, askUserForPath) => {
  askUserForPath = promisify(askUserForPath);
  let concatenatedCss = '';
  for (let cssFile of cssFiles) {
    console.error(`Processing css: ${cssFile}`);
    let css = await logError(readFile(cssFile), `Could not read CSS file: ${cssFile}. Exiting.`);
    let result = await updateCssPaths(css, async assetPath => {
      console.error(`Processing asset: ${assetPath}`);
      let asset = await logError(
        readFile(path.resolve(path.dirname(cssFile), assetPath)),
        `Could not read asset ${assetPath} imported by ${cssFile}`
      );
      let {path: newPath} = await logError(askUserForPath({path: assetPath, importedBy: cssFile, contents: asset}));
      return newPath;
    });
    concatenatedCss += `\n${result.css}`;
  }
  await logError(askUserForPath({path: 'components.css', contents: new Buffer(concatenatedCss)}));
};

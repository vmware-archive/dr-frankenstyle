import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import promisify from 'es6-promisify';

let readFile = promisify(fs.readFile);

async function scanUrls(decl, updatePath) {
  let tokens = decl.value.split(/(url\(.*?\))/); //urls will be at odd indices in the resulting array
  if (tokens.length < 2) return; //no urls
  for (let i = 1; i < tokens.length; i += 2) {
    let token = tokens[i];
    let [, url] = token.match(/url\(\s*['"]([^'"?#]*)/);
    let newUrl = await updatePath(url);
    tokens[i] = `url('${newUrl}')`;
  }
  decl.value = tokens.join('');
}

function decls(root) {
  let decls = [];
  root.eachDecl(decl => decls.push(decl));
  return decls;
}

function updateCssPaths(css, updatePath) {
  return postcss([
    async root => await* decls(root).map(decl => scanUrls(decl, updatePath))
  ]).process(css);
}

export default async (cssFiles, askUserForPath) => {
  let concatenatedCss = '';
  for (let cssFile of cssFiles) {
    let css = await readFile(cssFile);
    let result = await updateCssPaths(css, async assetPath => {
      let asset = await readFile(path.resolve(path.dirname(cssFile), assetPath));
      try {
        let {path: newPath} = await promisify(askUserForPath)({path: assetPath, contents: asset});
        return newPath;
      } catch(e) {
        console.error(e.stack);
        throw(e);
      }
    });
    concatenatedCss += `\n${result.css}`;
  }
  askUserForPath({path: 'components.css', contents: new Buffer(concatenatedCss)}, () => {});
};

### Using the developer API

If you want to iterate on your styles locally without having to publish changes
to NPM, you can use the developer API. This is useful if you're developing
complex components with many dependencies, or if you're developing a component
library.

Dr. Frankenstyle's developer API will produce a ready-to-serve local copy of
your CSS and accompanying assets, while ensuring your styles are present in
dependency order. There are two steps to this process, which are explained
below. Our examples here assume you are using gulp, so you may have to
translate the gulp steps for your particular tooling.

#### Step 1
Step 1 copies any assets referenced by your CSS to the given destination (e.g.
fonts, images, etc.). It also warms up a cache that is used by step 2.
This step only needs to be run once, or when you change your dependecies or add
assets.

```js
var setupDrF = require('dr-frankenstyle/setup');
var copyAssets = require('dr-frankenstyle/copy-assets');
var gulp = require('gulp');

setupDrF({cached: false})
  .pipe(copyAssets())
  .pipe(gulp.dest('<output-dir>'));
```

#### Step 2 (simple)
Step 2 generates ready-to-serve CSS from the latest copy in your development
environment. The CSS will be in dependency order, with all asset urls updated
to point to the location where your assets were copied in step 1. To do this,
you will need to provide some code to tell Dr. F how to find the CSS source
for each package.

Here's the general structure of step 2...

```js
var setupDrF = require('dr-frankenstyle/setup');
var generateCss = require('dr-frankenstyle/generate-css');
var gulp = require('gulp');

setupDrF({cached: true})
  .pipe(generateCss(developmentCssStream))
  .pipe(gulp.dest('<output-dir>'))
```

where `developmentCssStream` is a transform stream that maps package names to CSS
source. The input to this stream will be `cssDependency` objects with a
`packageName` key. The output should be objects with 2 keys: `packageName`
(same as input) and `contents` (the component's css as a string).

Here's a simple example of a transform stream. It assumes that your source css
lives in files with the structure `src/components/<package-name>.css`.

```js
var fs = require('fs');
var es = require('event-stream');

var developmentCssStream = es.map(function(cssDependency, callback) {
  var filename = 'src/components/' + cssDependency.packageName + '.css';
    // e.g. 'src/components/myproject-css-buttons.css'
  fs.readFile(filename, function (contents) {
    callback(null, {packageName: cssDependency.packageName, contents: contents});
  });
});
```

#### Step 2 (converting from SCSS)
And here's a more complex example, where the original files are SCSS files.
(Requires good knowledge of JS streams).

```js
var es = require('event-stream');
var read = require('vinyl-file').read;
var sass = require('gulp-sass');
var path = require('path');

var cssDependencyToScssContent = function(cssDependency, callback) {
  var componentName = cssDependency.packageName.replace(/^myproject-css-/, '');
  read('src/components/' + componentName + '/' + componentName + '.scss', callback);
};

var addPackageName = function(file, callback) {
  callback(null, {
    packageName: 'myproject-css-' + path.basename(file.path, '.css'),
    contents: file.contents.toString()
  });
};

es.pipeline(
  es.map(cssDependencyToScssContent),
  sass(),
  es.map(addPackageName)
);
```

***
 
(c) Copyright 2015 Pivotal Software, Inc. All Rights Reserved.

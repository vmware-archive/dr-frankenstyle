# Dr Frankenstyle

Dr Frankenstyle is a tool that resolves CSS dependencies between node packages. 

For example, if your app needs both buttons and tooltips, install the button and tooltip node modules:

```sh
npm install pui-css-buttons --save
npm install pui-css-tooltips --save
```
You'll notice both have been added to your `package.json`.

Both buttons and tooltips depend on `pui-css-typography`, which depends on `pui-css-bootstrap`.
 
Dr. Frankenstyle will read the dependency tree from `npm list` and find all of the required CSS files
(indicated by packages with the `style` key). It will then create a single CSS file in the correct 
cascade order and without duplication. In the above exmaple, the files would be included in the following order:

1. Bootstrap
1. Typography
1. Buttons
1. Tooltips

## Usage

First, install Dr. Frankenstyle:

```sh
npm install dr-frankenstyle
```

Next, add a `buildCss` gulp task in your `gulpfile.js`:

```js
var gulp = require('gulp');
var fs = require('fs');
var path = require('path');

gulp.task('buildCss', function() {
  var DrFrankenstyle = require('dr-frankenstyle');
  DrFrankenstyle(function(file) {
    fs.writeFile(path.resolve(__dirname, 'public', file.path), file.contents, function() {
        callback(null, file);
    });
  });
});
```

Run the gulp task:

```sh
gulp buildCss
```

This should create a file `public/components.css` (feel free to change the directory).
It will also copy any fonts or images required by the css into the public directory.
If you serve `components.css` and the required fonts and images, you can consume it in your html.

```html
<link rel="stylesheet" type="text/css" href="components.css"/>
```

If you add or remove node modules that require css, 
run `gulp buildCss` again to update the css.

## Customizing Output

To change locations of the compiled css or required assets, you can modifiy the `file.path`

```js
var gulp = require('gulp');
var fs = require('fs');
var path = require('path');

gulp.task('buildCss', function() {
  var DrFrankenstyle = require('dr-frankenstyle');
  DrFrankenstyle(function(file) {
    if (file.path.match(/^fonts/)) {
      file.path = path.join('fonts', path.basename(file.path));
    }
    fs.writeFile(path.resolve(__dirname, 'assets', file.path), file.contents, function() {
        callback(null, file);
    });
  });
});
```

The above example will copy everything into the `assets` folder. It will flatten any font files (`path.basename`)
and then put those in the `assets/fonts` folder. Any changes to fonts or images paths will be reflected in
the generated css.

a.k.a css-resolver, recssolver, pui-builder, monty, css-dependency-resolver, css-buffet, css-builder

(c) Copyright 2015 Pivotal Software, Inc. All Rights Reserved.

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

Run Dr. Frankenstyle:

```js
require('dr-frankenstyle')({directory: 'public'});
```

This should create a file `public/components.css` (feel free to change the directory).
It will also copy any fonts or images required by the css into the public directory.
If you serve `components.css` and the required fonts and images, you can consume it in your html.

```html
<link rel="stylesheet" type="text/css" href="components.css"/>
```

If you add or remove node modules that require css, 
run Dr. Frankenstyle again to update the css.

## Customizing Output

To change locations of the compiled css or required assets, you can modifiy the `file.path`.
Here is an example gulp task that does this:

```js
var gulp = require('gulp');
var path = require('path');
var through2 = require('through2');

gulp.task('buildCss', function() {
  require('dr-frankenstyle')({stream: true})
  .pipe(through2.obj(file, enc, callback){
    if (file.path.match(/^fonts/)) {
      file.path = path.join('fonts', path.basename(file.path));
    }
  })
  .pipe(gulp.dest('assets'));
```

The above example will copy everything into the `assets` folder. It will flatten any font files (`path.basename`)
and then put those in the `assets/fonts` folder. Any changes to fonts or images paths will be reflected in
the generated css.

(c) Copyright 2015 Pivotal Software, Inc. All Rights Reserved.

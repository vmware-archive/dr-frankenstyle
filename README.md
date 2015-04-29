# dr-frankenstyle

[![Build Status](https://travis-ci.org/pivotal-cf/dr-frankenstyle.svg)](https://travis-ci.org/pivotal-cf/dr-frankenstyle)

We like to build small reusable bits of CSS, and include only necessary CSS in our applications. 
[dr-frankenstyle](https://www.npmjs.com/package/dr-frankenstyle) enables us to do just that! It resolves CSS 
dependencies between node packages, carefully respecting the order of our components, so that our final CSS 
cascades correctly.

**We suggest using [gulp-dr-frankenstyle](https://www.npmjs.com/package/gulp-dr-frankenstyle) rather than this 
module.** It is easier to use and allows you to stream into other handy plugins. If you'd still like to install
dr-frankenstyle directly, this is how you do it:

## Installing

```sh
npm install dr-frankenstyle
```

## Basic Usage

In a JavaScript file, for instance `index.js`, paste the following code:

```js
var drFrankenstyle = require('dr-frankenstyle');

drFrankenstyle({directory: 'public'});
```

Assuming that you've installed other npm packages which provide CSS components, for example:

```sh
npm install pui-css-buttons --save
npm install pui-css-tooltips --save
```

running the above file from the command line:

```sh
node index.js
```

will read the dependency tree from `npm list` and find all of the required CSS files
(indicated by packages with the `style` key). It will then create a single `components.css`
file in `public/`with those CSS files concatenated together in order and without duplication:
 
1. Bootstrap
1. Typography
1. Buttons
1. Tooltips

Any assets (images, fonts, etc.) will also be saved to `public/` and referenced via relative path
in `components.css`


## Advanced Usage

dr-frankenstyle provides a callback-based interface in case you require more control over the
file contents or the file paths.

For example, to add the prefix `prefix-` to all files generated by dr-frankenstyle:

```js
var fs = require('fs');
var path = require('path');
var drFrankenstyle = require('dr-frankenstyle');

drFrankenstyle(function(file, callback) {
  file.path = path.join(path.dirname(file.path), 'prefix-' + path.basename(file.path));
  fs.writeFile(file.path, file.contents, function() {
    callback(null, file);
  });
});
```

dr-frankenstyle will call your callback with each asset, allowing you to rename it if desired. It will
call your callback with `components.css` last, which will reference assets using the updated asset paths
you provided.

**We suggest you instead use [gulp-dr-frankenstyle to prefix your asset names](https://www.npmjs.com/package/gulp-dr-frankenstyle#modifying-the-file-name)
or do other complex modifications of file names and directories.**

## Building your own CSS Components

You are probably ready at this point to give your own CSS a go! There are a few important steps to get it working with 
Dr. Frankenstyle.

1. In your package.json, list any dependencies for your CSS. (For example, much of our CSS depends on our typography component).
1. Add a style attribute to your package.json that points to your CSS file.
1. Publish it to npm.

***
 
(c) Copyright 2015 Pivotal Software, Inc. All Rights Reserved.

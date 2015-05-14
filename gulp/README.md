# gulp-dr-frankenstyle

[![Build Status](https://travis-ci.org/pivotal-cf/dr-frankenstyle.svg)](https://travis-ci.org/pivotal-cf/dr-frankenstyle)

[Dr Frankenstyle](https://www.npmjs.com/package/dr-frankenstyle) gulp plugin to resolve CSS dependencies. 

## Install

```sh
npm install gulp-dr-frankenstyle
```

## Basic Usage

Run Dr. Frankenstyle:

```js
var gulp = require('gulp');
var drFrankenstyle = require('gulp-dr-frankenstyle');

gulp.task('assets', function() {
  return drFrankenstyle()
    .pipe(drFrankenstyle.done())
    .pipe(gulp.dest('public'));
});

```

This will create a file `public/components.css`. It will also copy any fonts or images required by the css into the public directory.
If you serve `components.css` and the required fonts and images, you can consume it in your html.

```html
<link rel="stylesheet" type="text/css" href="components.css"/>
```

If you add or remove node modules that require css, rerun Dr. Frankenstyle again to update the css.

## For Rails users

Pipe the Dr. Frankenstyle output through the `railsUrls` helper
to have css that uses Rails' `asset-url` helpers.
(I.e. you want CSS that looks like `background: asset-url('foo/bar.png')`,
 not `background: url('foo/bar.png')`).

```js
var gulp = require('gulp');
var drFrankenstyle = require('gulp-dr-frankenstyle');

gulp.task('assets', function() {
  return drFrankenstyle()
    .pipe(drFrankenstyle.railsUrls())
    .pipe(drFrankenstyle.done())
    .pipe(gulp.dest('public'));
});
```

## Modifying the file name

You may also want to modify the file name. In this case, use [rename](https://www.npmjs.com/package/gulp-rename) with 
gulp-dr-frankenstyle to output exactly the names you want:

```js
var path = require('path');
var gulp = require('gulp');
var drFrankenstyle = require('gulp-dr-frankenstyle');
var rename = require("gulp-rename");

gulp.task('assets', function() {
  return drFrankenstyle()
    .pipe(rename({prefix: 'prefix-'}))
    .pipe(drFrankenstyle.done())
    .pipe(gulp.dest('public'));
});
```

(c) Copyright 2015 Pivotal Software, Inc. All Rights Reserved.

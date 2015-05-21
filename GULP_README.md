# gulp-dr-frankenstyle

[![Build Status](https://travis-ci.org/pivotal-cf/dr-frankenstyle.svg)](https://travis-ci.org/pivotal-cf/dr-frankenstyle)

[Dr Frankenstyle](https://www.npmjs.com/package/dr-frankenstyle) gulp plugin to resolve CSS dependencies. 

## Install

```sh
npm install --save-dev gulp-dr-frankenstyle
```

## Basic Usage

Because Dr. Frankenstyle uses streams and vinyl under the hood, it's super easy to use with Gulp!

```js
var drFrankenstyle = require('dr-frankenstyle');
var gulp = require('gulp');

gulp.task('css', function() {
  return drFrankenstyle()
    .pipe(gulp.dest('<output-dir>'));
});
```

## Options

### Rails URLs

If you have a Rails project and you're using the asset pipeline, you probably want to use Rails' `asset-url` helper.
(I.e. your css would have rules like `background: asset-url('path/to/image.png')` instead of `background: url('path/to/image.png')`.)
Dr. Frankenstyle has an option that will replace all `url`s with `asset-url`s

```js
gulp.task('css', function() {
  return drFrankenstyle()
    .pipe(drFrankenstyle.railsUrls())
    .pipe(gulp.dest('<output-dir>'));
});
```

(c) Copyright 2015 Pivotal Software, Inc. All Rights Reserved.

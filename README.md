# dr-frankenstyle

[![Build Status](https://travis-ci.org/pivotal-cf/dr-frankenstyle.svg)](https://travis-ci.org/pivotal-cf/dr-frankenstyle)

We like to build small reusable bits of CSS, and include only necessary CSS in our applications. 
[dr-frankenstyle](https://www.npmjs.com/package/dr-frankenstyle) enables us to do just that! It resolves CSS 
dependencies between node packages, carefully respecting the order of our components, so that our final CSS 
cascades correctly.

## What does it do?

Dr. Frankenstyle takes the CSS in your node packages and produces nicely packaged, ready-to-serve CSS and assets.

For example, let's say that you needed the styles from the `pui-css-buttons` and `pui-css-tooltips` packages.
Assuming you've installed the npm packages:

```sh
npm install pui-css-buttons --save
npm install pui-css-tooltips --save
```

Dr. Frankenstyle will will read the dependency tree from `npm list` and find all of the required CSS files (indicated by packages with the `style` key).
It will then create a single `components.css` file with those CSS files concatenated together in order and without duplication:

So for our example above, where the dependency tree looks like this:

```sh
├─┬ pui-css-buttons
│ ├── pui-css-bootstrap
└─┬ pui-css-tooltips
  └─┬ pui-css-typography
    └── pui-css-bootstrap
```

The resultant `components.css` looks like this:

```css
/* css for pui-css-bootstrap */
/* css for pui-css-typography */
/* css for pui-css-buttons */
/* css for pui-css-tooltips */
```

Dr. Frankenstyle also copies over any assets specified by these css files (images, fonts, etc.)
to the output directory you specify, and it updates the urls in the css for you.
This makes it easier to serve the assets.

## Installing

There are two ways to use Dr. Frankenstyle: a CLI or an stream-based API.
The CLI is the simplest way to use this tool.
Use the API if you want use Dr. Frankenstyle with a task runner such as gulp.

If you want to use the CLI:

```sh
npm install -g dr-frankenstyle
```

If you want to use the API:

```sh
npm install --save-dev dr-frankenstyle
```

## Using Dr. Frankenstyle

Dr. Frankenstyle works by looking in your `node_modules` folder for modules that define style
(i.e. modules that have a `style` property defined in their `package.json`).
We assume that you've installed other npm packages which provide CSS components.
For example:

### Using the CLI

Run the following command from your project directory.

```sh
dr-frankenstyle <output-dir>
```

`components.css` and the relevant assets will end up in the `<output-dir>` folder (e.g. `public/`).

### Using the API

The stream API returns the concatenated CSS and associated assets as a stream of virtual [Vinyl](https://github.com/wearefractal/vinyl) files.
You probably want to pipe the resultant stream into some sort of vinyl file writer:

```js
var drFrankenstyle = require('dr-frankenstyle');
var fs = require('vinyl-fs');

drFrankenstyle()
  .pipe(fs.dest('<output-dir>'));
```

### Using the API with Gulp

Because Dr. Frankenstyle uses streams and vinyl under the hood, it's super easy to use with Gulp!

```js
var drFrankenstyle = require('dr-frankenstyle');
var gulp = require('gulp');

gulp.task('css', function() {
  return drFrankenstyle()
    .pipe(gulp.dest('<output-dir>'));
});
```

### Using the API with Grunt

Dr. Frankenstyle is easy to use with Grunt as well. Just register a new task:

```js
grunt.registerTask('styles', function() {
  var drFrankenstyle = require('dr-frankenstyle');
  var fs = require('vinyl-fs');
  drFrankenstyle().pipe(fs.dest('<output-dir>')).on('end', this.async());
});

```

## Options

### Rails URLs

If you have a Rails project and you're using the asset pipeline, you probably want to use Rails' `asset-url` helper.
(I.e. your css would have rules like `background: asset-url('path/to/image.png')` instead of `background: url('path/to/image.png')`.)
Dr. Frankenstyle has an option that will replace all `url`s with `asset-url`s

```sh
dr-frankenstyle --rails <output-dir>
```

Or, if you are using the API:

```js
drFrankenstyle()
  .pipe(drFrankenstyle.railsUrls())
  .pipe(fs.dest('<output-dir>'));
```

### Whitelist

If you want Dr. F to only look at specific top level dependencies, you can create a FrankenFile (.drfrankenstylerc).

For example, if you only want to include `pui-css-typography` in your CSS output, you could create this file.

```json
{
  "whitelist": ["pui-css-typography"]
}
```

## Building your own CSS Components

You are probably ready at this point to give your own CSS a go! There are a few important steps to get it working with 
Dr. Frankenstyle.

1. In your package.json, list any dependencies for your CSS. (For example, much of our CSS depends on our typography component).
1. Add a style attribute to your package.json that points to your CSS file.
1. Publish it to npm.

### Using the developer API

If you are developing complicated components, or a component library, you may
want to use our [developer api](https://github.com/pivotal-cf/dr-frankenstyle/blob/master/DEVELOPER_API_README.md)

***
 
(c) Copyright 2015 Pivotal Software, Inc. All Rights Reserved.

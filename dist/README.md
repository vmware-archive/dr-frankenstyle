# dr-frankenstyle

[![Build Status](https://travis-ci.org/pivotal-cf/dr-frankenstyle.svg)](https://travis-ci.org/pivotal-cf/dr-frankenstyle)

We like to build small reusable bits of CSS, and include only necessary CSS in our applications. 
[dr-frankenstyle](https://www.npmjs.com/package/dr-frankenstyle) enables us to do just that! It resolves CSS 
dependencies between node packages, carefully respecting the order of our components, so that our final CSS 
cascades correctly.

**If you are using gulp, we suggest using [gulp-dr-frankenstyle](https://www.npmjs.com/package/gulp-dr-frankenstyle) rather than this
module directly.** It is easier to use and allows you to stream into other handy plugins. If you'd still like to install
dr-frankenstyle directly, this is how you do it:

## Installing

```sh
npm install -g dr-frankenstyle
```

## Basic Usage

Assuming that you've installed other npm packages which provide CSS components, for example:

```sh
npm install pui-css-buttons --save
npm install pui-css-tooltips --save
```

running the following command:

```sh
dr-frankenstyle <output-dir>
```

will read the dependency tree from `npm list` and find all of the required CSS files
(indicated by packages with the `style` key). It will then create a single `components.css`
file in `<output-dir>` (e.g. `public/`) with those CSS files concatenated together in order and without duplication:
 
1. Bootstrap
1. Typography
1. Buttons
1. Tooltips

Any assets (images, fonts, etc.) will also be saved to `<output-dir>` and referenced via relative path
in `components.css`.

## Building your own CSS Components

You are probably ready at this point to give your own CSS a go! There are a few important steps to get it working with 
Dr. Frankenstyle.

1. In your package.json, list any dependencies for your CSS. (For example, much of our CSS depends on our typography component).
1. Add a style attribute to your package.json that points to your CSS file.
1. Publish it to npm.

***
 
(c) Copyright 2015 Pivotal Software, Inc. All Rights Reserved.

var del = require('del');
var gulp = require('gulp');
var highland = require('highland');
var mergeStream = require('merge-stream');
var path = require('path');
var plugins = require('gulp-load-plugins')();

const COPYRIGHT = '//(c) Copyright 2015 Pivotal Software, Inc. All Rights Reserved.\n';

gulp.task('clean', function(callback) {
  del(['dist', 'distGulp'], callback);
});

gulp.task('build', ['clean'], function() {
  return mergeStream(
    highland(gulp.src('src/**/*.js')
      .pipe(plugins.babel())
      .pipe(plugins.header(COPYRIGHT))
    ).map(function(file) {
      if (path.basename(file.path) === 'cli.js') {
        file.contents = new Buffer('#! /usr/bin/env node\n' + file.contents);
        file.stat.mode = '755';
      }
      return file;
    }),
    gulp.src(['LICENSE', 'README.md', 'package.json'])
  ).pipe(gulp.dest('dist'));
});

gulp.task('build-gulp', ['build'], function() {
  highland(gulp.src(['dist/LICENSE', 'GULP_README.md', 'package.json', 'dist/**/!(cli).js']))
    .map(function(file) {
      if (path.basename(file.path) === 'package.json') {
        let newPackageInfo = JSON.parse(file.contents.toString());
        newPackageInfo.name = 'gulp-dr-frankenstyle';
        delete newPackageInfo.preferGlobal;
        delete newPackageInfo.bin;
        file.contents = new Buffer(JSON.stringify(newPackageInfo, null, 2));
      } else if (path.basename(file.path) === 'GULP_README.md') {
        file.path = path.join(path.dirname(file.path), 'README.md');
      }
      return file;
    })
    .pipe(gulp.dest('distGulp'));
});

var del = require('del');
var gulp = require('gulp');
var highland = require('highland');
var mergeStream = require('merge-stream');
var path = require('path');
var plugins = require('gulp-load-plugins')();

const COPYRIGHT = '//(c) Copyright 2015 Pivotal Software, Inc. All Rights Reserved.\n';

gulp.task('clean', function(callback) {
  del('dist', callback);
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

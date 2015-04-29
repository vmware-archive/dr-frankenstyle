var drFrankenstyle = require('dr-frankenstyle');
var through2 = require('through2');
var File = require('vinyl');
var gulp = require('gulp');

var gulpDestTransformCode = 'function saveFile(file, enc, cb) {\n    var basePath;\n    if (typeof outFolder === \'string\') {\n      basePath = path.resolve(cwd, outFolder);\n    }\n    if (typeof outFolder === \'function\') {\n      basePath = path.resolve(cwd, outFolder(file));\n    }\n    var writePath = path.resolve(basePath, file.relative);\n    var writeFolder = path.dirname(writePath);\n\n    // wire up new properties\n    file.stat = file.stat ? file.stat : new fs.Stats();\n    file.stat.mode = (options.mode || file.stat.mode);\n    file.cwd = cwd;\n    file.base = basePath;\n    file.path = writePath;\n\n    // mkdirp the folder the file is going in\n    mkdirp(writeFolder, function(err){\n      if (err) {\n        return cb(err);\n      }\n      writeContents(writePath, file, cb);\n    });\n  }';
function wrapStream(stream) { // Evil monkey patch for a vinyl bug in gulp dest: https://github.com/wearefractal/vinyl-fs/issues/19
  var oldPipe = stream.pipe;
  stream.pipe = function(processor) {
    var isGulpDest = processor._transform.toString() === gulpDestTransformCode;
    if (isGulpDest) {
      var gulpDest = oldPipe.call(this, processor);
      var _transform = gulpDest._transform;
      gulpDest._transform = function(file, encoding, callback) {
        return _transform.call(this, file.clone(), encoding, callback);
      };
      return wrapStream(gulpDest);
    } else {
      return wrapStream(oldPipe.call(this, processor))
    }
  };
  return stream;
}

module.exports = function gulpDrFrankenstyle() {
  return wrapStream(
    drFrankenstyle({stream: true})
      .pipe(through2.obj(function(file, encoding, callback) {
        callback(null, Object.setPrototypeOf(file, new File(file)));
      }))
  );
};

gulp.task('assets', function() {
  drFrankenstyle()
    .pipe(thing())
    .pipe(otherThing())
    .pipe(gulp.dest('public'))
});
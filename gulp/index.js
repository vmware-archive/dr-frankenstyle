var drFrankenstyle = require('dr-frankenstyle');
var through2 = require('through2');
var File = require('vinyl');
module.exports = function gulpDrFrankenstyle() {
  return drFrankenstyle({stream: true})
    .pipe(through2.obj(function(file, encoding, callback) {
      callback(null, new File(file));
    }));
};

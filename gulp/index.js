var drFrankenstyle = require('dr-frankenstyle');
var through2 = require('through2');
var File = require('vinyl');
var namespaceAssets = require('dr-frankenstyle/lib/strategies').namespaceAssets;

module.exports = function() {
  var assetsStream = through2.obj();
  drFrankenstyle(function(file, callback) {
    namespaceAssets(file);
    var vinylFile = Object.setPrototypeOf(file, new File(file));
    vinylFile.drFrankenstyle = true;
    assetsStream.write(vinylFile, function(error) {
      if (file.path === 'components.css') {
        assetsStream.end(function() {
          callback(error, file);
        });
      } else {
        callback(error, file);
      }
    });
  });
  return assetsStream;
};

module.exports.done = function() {
  return through2.obj(function(vinylFile, encoding, callback) {
    if (vinylFile.drFrankenstyle) {
      callback(null, Object.getPrototypeOf(vinylFile));
    } else {
      callback(null, vinylFile);
    }
  });
};

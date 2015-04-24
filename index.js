'use strict';
require('babel/register')({
  stage: 1,
  optional: ['runtime']
});
module.exports = require('./lib/dr-frankenstyle');

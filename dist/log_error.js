//(c) Copyright 2015 Pivotal Software, Inc. All Rights Reserved.
"use strict";

var _Object$defineProperty = require("babel-runtime/core-js/object/define-property")["default"];

var _regeneratorRuntime = require("babel-runtime/regenerator")["default"];

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function callee$0$0(promise, errorText) {
  var result;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        result = undefined;
        context$1$0.prev = 1;
        context$1$0.next = 4;
        return promise;

      case 4:
        result = context$1$0.sent;
        context$1$0.next = 11;
        break;

      case 7:
        context$1$0.prev = 7;
        context$1$0.t3 = context$1$0["catch"](1);

        console.error(errorText || context$1$0.t3.stack);
        throw context$1$0.t3;

      case 11:
        return context$1$0.abrupt("return", result);

      case 12:
      case "end":
        return context$1$0.stop();
    }
  }, null, this, [[1, 7]]);
};

module.exports = exports["default"];
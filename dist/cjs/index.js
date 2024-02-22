"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    BigIntStats: function() {
        return _BigIntStats.default;
    },
    toBigIntStats: function() {
        return _toBigIntStats.default;
    },
    toStats: function() {
        return _toStats.default;
    }
});
var _BigIntStats = /*#__PURE__*/ _interop_require_default(require("./BigIntStats.js"));
var _toBigIntStats = /*#__PURE__*/ _interop_require_default(require("./toBigIntStats.js"));
var _toStats = /*#__PURE__*/ _interop_require_default(require("./toStats.js"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }
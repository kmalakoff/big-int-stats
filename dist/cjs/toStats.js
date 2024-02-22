"use strict";
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
var fs = require("fs");
var JSBI = require("jsbi-compat");
var kNsPerMsBigInt = JSBI.BigInt(Math.pow(10, 6));
module.exports = function toStats(stats) {
    if (_type_of(stats.dev) !== "bigint") return stats;
    return new fs.Stats(Number(stats.dev), Number(stats.mode), Number(stats.nlink), Number(stats.uid), Number(stats.gid), Number(stats.rdev), Number(stats.blksize), Number(stats.ino), Number(stats.size), Number(stats.blocks), Number(stats.atimeNs ? JSBI.divide(stats.atimeNs, kNsPerMsBigInt) : stats.atimeMs), Number(stats.mtimeNs ? JSBI.divide(stats.mtimeNs, kNsPerMsBigInt) : stats.mtimeMs), Number(stats.ctimeNs ? JSBI.divide(stats.ctimeNs, kNsPerMsBigInt) : stats.ctimeMs), Number(stats.birthtimeNs ? JSBI.divide(stats.birthtimeNs, kNsPerMsBigInt) : stats.birthtimeMs));
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }
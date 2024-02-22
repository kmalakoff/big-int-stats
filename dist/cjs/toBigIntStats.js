"use strict";
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
var JSBI = require("jsbi-compat");
var BigIntStats = require("./BigIntStats");
var kNsPerMsBigInt = JSBI.BigInt(Math.pow(10, 6));
module.exports = function toBigIntStats(stats) {
    if (_type_of(stats.dev) === "bigint") return stats;
    return new BigIntStats(JSBI.BigInt(stats.dev), JSBI.BigInt(stats.mode), JSBI.BigInt(stats.nlink), JSBI.BigInt(stats.uid), JSBI.BigInt(stats.gid), JSBI.BigInt(stats.rdev), typeof stats.blksize === "undefined" ? undefined : JSBI.BigInt(stats.blksize), JSBI.BigInt(stats.ino), JSBI.BigInt(stats.size), typeof stats.blocks === "undefined" ? undefined : JSBI.BigInt(stats.blocks), JSBI.multiply(JSBI.BigInt(Math.round(stats.atimeMs)), kNsPerMsBigInt), JSBI.multiply(JSBI.BigInt(Math.round(stats.mtimeMs)), kNsPerMsBigInt), JSBI.multiply(JSBI.BigInt(Math.round(stats.ctimeMs)), kNsPerMsBigInt), stats.birthtimeMs ? JSBI.multiply(JSBI.BigInt(Math.round(stats.birthtimeMs)), kNsPerMsBigInt) : undefined);
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }
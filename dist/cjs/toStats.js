"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return toStats;
    }
});
var _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
var _jsbicompat = /*#__PURE__*/ _interop_require_default(require("jsbi-compat"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
var kNsPerMsBigInt = _jsbicompat.default.BigInt(Math.pow(10, 6));
function toStats(stats) {
    if (_type_of(stats.dev) !== 'bigint') return stats;
    var bigStats = stats;
    // @ts-ignore
    return new _fs.default.Stats(Number(bigStats.dev), Number(bigStats.mode), Number(bigStats.nlink), Number(bigStats.uid), Number(bigStats.gid), Number(bigStats.rdev), Number(bigStats.blksize), Number(bigStats.ino), Number(bigStats.size), Number(bigStats.blocks), Number(bigStats.atimeNs ? _jsbicompat.default.divide(bigStats.atimeNs, kNsPerMsBigInt) : bigStats.atimeMs), Number(bigStats.mtimeNs ? _jsbicompat.default.divide(bigStats.mtimeNs, kNsPerMsBigInt) : bigStats.mtimeMs), Number(bigStats.ctimeNs ? _jsbicompat.default.divide(bigStats.ctimeNs, kNsPerMsBigInt) : bigStats.ctimeMs), Number(bigStats.birthtimeNs ? _jsbicompat.default.divide(bigStats.birthtimeNs, kNsPerMsBigInt) : bigStats.birthtimeMs));
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }
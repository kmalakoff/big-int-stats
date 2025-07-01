"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return toBigIntStats;
    }
});
var _jsbicompat = /*#__PURE__*/ _interop_require_default(require("jsbi-compat"));
var _BigIntStatsts = /*#__PURE__*/ _interop_require_default(require("./BigIntStats.js"));
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
function toBigIntStats(stats) {
    if (_type_of(stats.dev) === 'bigint') return stats;
    var littleStats = stats;
    return new _BigIntStatsts.default(_jsbicompat.default.BigInt(littleStats.dev), _jsbicompat.default.BigInt(littleStats.mode), _jsbicompat.default.BigInt(littleStats.nlink), _jsbicompat.default.BigInt(littleStats.uid), _jsbicompat.default.BigInt(littleStats.gid), _jsbicompat.default.BigInt(littleStats.rdev), typeof littleStats.blksize === 'undefined' ? undefined : _jsbicompat.default.BigInt(littleStats.blksize), _jsbicompat.default.BigInt(littleStats.ino), _jsbicompat.default.BigInt(littleStats.size), typeof littleStats.blocks === 'undefined' ? undefined : _jsbicompat.default.BigInt(littleStats.blocks), _jsbicompat.default.multiply(_jsbicompat.default.BigInt(Math.round(littleStats.atimeMs)), kNsPerMsBigInt), _jsbicompat.default.multiply(_jsbicompat.default.BigInt(Math.round(littleStats.mtimeMs)), kNsPerMsBigInt), _jsbicompat.default.multiply(_jsbicompat.default.BigInt(Math.round(littleStats.ctimeMs)), kNsPerMsBigInt), littleStats.birthtimeMs ? _jsbicompat.default.multiply(_jsbicompat.default.BigInt(Math.round(littleStats.birthtimeMs)), kNsPerMsBigInt) : undefined);
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }
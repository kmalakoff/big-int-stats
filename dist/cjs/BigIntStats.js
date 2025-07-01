"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return BigIntStats;
    }
});
var _fs = require("fs");
var _fsconstants = /*#__PURE__*/ _interop_require_default(require("fs-constants"));
var _jsbicompat = /*#__PURE__*/ _interop_require_default(require("jsbi-compat"));
function _assert_this_initialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _call_super(_this, derived, args) {
    derived = _get_prototype_of(derived);
    return _possible_constructor_return(_this, _is_native_reflect_construct() ? Reflect.construct(derived, args || [], _get_prototype_of(_this).constructor) : derived.apply(_this, args));
}
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _get_prototype_of(o) {
    _get_prototype_of = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _get_prototype_of(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _set_prototype_of(subClass, superClass);
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _possible_constructor_return(self, call) {
    if (call && (_type_of(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assert_this_initialized(self);
}
function _set_prototype_of(o, p) {
    _set_prototype_of = Object.setPrototypeOf || function setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _set_prototype_of(o, p);
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function _is_native_reflect_construct() {
    try {
        var result = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
    } catch (_) {}
    return (_is_native_reflect_construct = function() {
        return !!result;
    })();
}
var S_IFIFO = _fsconstants.default.S_IFIFO;
var S_IFBLK = _fsconstants.default.S_IFBLK;
var S_IFSOCK = _fsconstants.default.S_IFSOCK;
var S_IFMT = _fsconstants.default.S_IFMT;
var S_IFMT_BIG = _jsbicompat.default.BigInt(S_IFMT);
var isWindows = process.platform === 'win32';
var kNsPerMsBigInt = _jsbicompat.default.BigInt(Math.pow(10, 6));
// The Date constructor performs Math.floor() to the multiplytamp.
// https://www.ecma-international.org/ecma-262/#sec-timeclip
// Since there may be a precision loss when the multiplytamp is
// converted to a floating point number, we manually round
// the multiplytamp here before passing it to Date().
// Refs: https://github.com/nodejs/node/pull/12607
function dateFromMs(ms) {
    return new Date(_jsbicompat.default.toNumber(ms) + 0.5);
}
var BigIntStats = /*#__PURE__*/ function(Stats) {
    "use strict";
    _inherits(BigIntStats, Stats);
    function BigIntStats(dev, mode, nlink, uid, gid, rdev, blksize, ino, size, blocks, atimeNs, mtimeNs, ctimeNs, birthtimeNs) {
        _class_call_check(this, BigIntStats);
        var _this;
        _this = _call_super(this, BigIntStats);
        _this.dev = dev;
        _this.mode = mode;
        _this.nlink = nlink;
        _this.uid = uid;
        _this.gid = gid;
        _this.rdev = rdev;
        _this.blksize = blksize;
        _this.ino = ino;
        _this.size = size;
        _this.blocks = blocks;
        _this.atimeMs = _jsbicompat.default.divide(atimeNs, kNsPerMsBigInt);
        _this.atime = dateFromMs(_this.atimeMs);
        _this.atimeNs = atimeNs;
        _this.mtimeMs = _jsbicompat.default.divide(mtimeNs, kNsPerMsBigInt);
        _this.mtime = dateFromMs(_this.mtimeMs);
        _this.mtimeNs = mtimeNs;
        _this.ctimeMs = _jsbicompat.default.divide(ctimeNs, kNsPerMsBigInt);
        _this.ctime = dateFromMs(_this.ctimeMs);
        _this.ctimeNs = ctimeNs;
        _this.birthtimeMs = _jsbicompat.default.divide(birthtimeNs, kNsPerMsBigInt);
        _this.birthtime = dateFromMs(_this.birthtimeMs);
        _this.birthtimeNs = birthtimeNs;
        return _this;
    }
    var _proto = BigIntStats.prototype;
    _proto._checkModeProperty = function _checkModeProperty(property) {
        if (isWindows && (property === S_IFIFO || property === S_IFBLK || property === S_IFSOCK)) {
            return false; // Some types are not available on Windows
        }
        return _jsbicompat.default.equal(_jsbicompat.default.bitwiseAnd(this.mode, S_IFMT_BIG), _jsbicompat.default.BigInt(property));
    };
    return BigIntStats;
}(_fs.Stats);
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }
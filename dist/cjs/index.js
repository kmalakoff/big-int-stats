"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get BigIntStats () {
        return _BigIntStatsts.default;
    },
    get toBigIntStats () {
        return _toBigIntStatsts.default;
    },
    get toStats () {
        return _toStatsts.default;
    }
});
var _BigIntStatsts = /*#__PURE__*/ _interop_require_default(require("./BigIntStats.js"));
var _toBigIntStatsts = /*#__PURE__*/ _interop_require_default(require("./toBigIntStats.js"));
var _toStatsts = /*#__PURE__*/ _interop_require_default(require("./toStats.js"));
_export_star(require("./types.js"), exports);
function _export_star(from, to) {
    Object.keys(from).forEach(function(k) {
        if (k !== "default" && !Object.prototype.hasOwnProperty.call(to, k)) {
            Object.defineProperty(to, k, {
                enumerable: true,
                get: function() {
                    return from[k];
                }
            });
        }
    });
    return from;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }
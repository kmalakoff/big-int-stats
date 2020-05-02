/* eslint-disable */

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || o.prototype;
      };
  return _getPrototypeOf(o);
}

module.exports.createSuper = function _createSuper(Derived) {
  return function () {
    var Super = _getPrototypeOf(Derived);
    var result = Super.apply(this, arguments);
    return result && (typeof result === 'object' || typeof result === 'function') ? result : this;
  };
};

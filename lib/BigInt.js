// eslint-disable-next-line no-undef
if (typeof BigInt !== 'undefined') module.exports = BigInt;
else {
  var BigInteger = require('big-integer');
  module.exports = function BigIntPolyfill(value) {
    return BigInteger(value).value;
  };
}

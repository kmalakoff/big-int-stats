var BigInteger = require('big-integer');
BigInteger.pow = function pow(a, b) {
  return BigInteger(a).pow(BigInteger(b));
};
module.exports = BigInteger;

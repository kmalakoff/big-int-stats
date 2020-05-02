var BigInteger = require('big-integer');

module.exports = function pow(a, b) {
  return BigInteger(a).pow(b).value;
};

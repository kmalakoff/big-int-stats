var BigInt = require('big-integer');

module.exports = function pow(a, b) {
  return BigInt(a).pow(BigInt(b)).value;
};

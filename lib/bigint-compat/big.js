var Big = require('big.js');

function BigInteger(value) {
  return Big(value);
}

BigInteger.isBigInt = function isBigInt(value) {
  return value instanceof Big;
};

BigInteger.eq = function eq(a, b) {
  return a.eq(b);
};

BigInteger.times = function times(a, b) {
  return a.times(b);
};

BigInteger.divide = function divide(n, d) {
  return n.div(d);
};

BigInteger.pow = function pow(n, d) {
  return n.pow(d);
};

BigInteger.bitwiseAnd = function bitwiseAnd(a, b) {
  return BigInteger(parseInt(a) & parseInt(b));
};

module.exports = BigInteger;

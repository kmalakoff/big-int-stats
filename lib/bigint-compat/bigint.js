function BigInteger(value) {
  // eslint-disable-next-line no-undef
  return BigInt(value);
}

BigInteger.isBigInt = function isBigInt(value) {
  return typeof value === 'bigint';
};

BigInteger.eq = function eq(a, b) {
  return a === b;
};

BigInteger.times = function times(a, b) {
  return a * b;
};

BigInteger.divide = function divide(n, d) {
  return n / d;
};

BigInteger.pow = function pow(n, e) {
  return n ** e;
};

BigInteger.bitwiseAnd = function bitwiseAnd(a, b) {
  return a & b;
};

module.exports = BigInteger;

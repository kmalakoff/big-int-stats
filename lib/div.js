var hasBigInt = typeof BigInt !== 'undefined';

module.exports = function div(n, d) {
  return hasBigInt ? n / d : n.div(d);
};

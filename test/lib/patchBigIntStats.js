var BigInteger = require('../../lib/bigint-compat');

var kNsPerMsBigInt = BigInteger(Math.pow(10, 6));

module.exports = function patchBigIntStats(stats) {
  // doesn't need patching
  if (stats.atimeNs || !BigInteger.isBigInt(stats.atimeMs)) return stats;

  stats.atimeNs = BigInteger.times(stats.atimeMs, kNsPerMsBigInt);
  stats.mtimeNs = BigInteger.times(stats.mtimeMs, kNsPerMsBigInt);
  stats.ctimeNs = BigInteger.times(stats.ctimeMs, kNsPerMsBigInt);
  stats.birthtimeNs = BigInteger.times(stats.birthtimeMs, kNsPerMsBigInt);
  return stats;
};

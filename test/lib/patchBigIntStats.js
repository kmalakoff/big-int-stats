var JSBI = require('jsbi-compat');

var kNsPerMsBigInt = JSBI.BigInt(Math.pow(10, 6));

module.exports = function patchBigIntStats(stats) {
  // doesn't need patching
  if (stats.atimeNs || !JSBI.isBigInt(stats.atimeMs)) return stats;

  stats.atimeNs = JSBI.multiply(stats.atimeMs, kNsPerMsBigInt);
  stats.mtimeNs = JSBI.multiply(stats.mtimeMs, kNsPerMsBigInt);
  stats.ctimeNs = JSBI.multiply(stats.ctimeMs, kNsPerMsBigInt);
  stats.birthtimeNs = JSBI.multiply(stats.birthtimeMs, kNsPerMsBigInt);
  return stats;
};

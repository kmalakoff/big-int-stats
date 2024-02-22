var JSBI = require('jsbi-compat');

var BigIntStats = require('./BigIntStats');

var kNsPerMsBigInt = JSBI.BigInt(10 ** 6);

module.exports = function toBigIntStats(stats) {
  if (typeof stats.dev === 'bigint') return stats;
  return new BigIntStats(
    JSBI.BigInt(stats.dev),
    JSBI.BigInt(stats.mode),
    JSBI.BigInt(stats.nlink),
    JSBI.BigInt(stats.uid),
    JSBI.BigInt(stats.gid),
    JSBI.BigInt(stats.rdev),
    typeof stats.blksize === 'undefined' ? undefined : JSBI.BigInt(stats.blksize),
    JSBI.BigInt(stats.ino),
    JSBI.BigInt(stats.size),
    typeof stats.blocks === 'undefined' ? undefined : JSBI.BigInt(stats.blocks),
    JSBI.multiply(JSBI.BigInt(Math.round(stats.atimeMs)), kNsPerMsBigInt),
    JSBI.multiply(JSBI.BigInt(Math.round(stats.mtimeMs)), kNsPerMsBigInt),
    JSBI.multiply(JSBI.BigInt(Math.round(stats.ctimeMs)), kNsPerMsBigInt),
    stats.birthtimeMs ? JSBI.multiply(JSBI.BigInt(Math.round(stats.birthtimeMs)), kNsPerMsBigInt) : undefined
  );
};

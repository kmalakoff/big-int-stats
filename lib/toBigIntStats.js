var JSBI = require('jsbi-compat');

var BigIntStats = require('..');

var kNsPerMsBigInt = JSBI.BigInt(Math.pow(10, 6));

module.exports = function toBigIntStats(stats) {
  if (typeof stats.dev !== 'bigint') {
    return new BigIntStats(
      JSBI.BigInt(stats.dev),
      JSBI.BigInt(stats.mode),
      JSBI.BigInt(stats.nlink),
      JSBI.BigInt(stats.uid),
      JSBI.BigInt(stats.gid),
      JSBI.BigInt(stats.rdev),
      JSBI.BigInt(stats.blksize),
      JSBI.BigInt(stats.ino),
      JSBI.BigInt(stats.size),
      JSBI.BigInt(stats.blocks),
      JSBI.multiply(JSBI.BigInt(Math.round(stats.atimeMs)), kNsPerMsBigInt),
      JSBI.multiply(JSBI.BigInt(Math.round(stats.mtimeMs)), kNsPerMsBigInt),
      JSBI.multiply(JSBI.BigInt(Math.round(stats.ctimeMs)), kNsPerMsBigInt),
      stats.birthtimeMs ? JSBI.multiply(JSBI.BigInt(Math.round(stats.birthtimeMs)), kNsPerMsBigInt) : undefined
    );
  } else {
    return new BigIntStats(
      stats.dev,
      stats.mode,
      stats.nlink,
      stats.uid,
      stats.gid,
      stats.rdev,
      stats.blksize,
      stats.ino,
      stats.size,
      stats.blocks,
      stats.atimeNs,
      stats.mtimeNs,
      stats.ctimeNs,
      stats.birthtimeNs
    );
  }
};

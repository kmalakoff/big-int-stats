var fs = require('fs');
var JSBI = require('jsbi-compat');

var kNsPerMsBigInt = JSBI.BigInt(Math.pow(10, 6));

module.exports = function toStats(stats) {
  if (typeof stats.dev !== 'bigint') {
    return new fs.Stats(
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
      stats.atimeMs,
      stats.mtimeMs,
      stats.ctimeMs,
      stats.birthtimeMs
    );
  } else {
    return new fs.Stats(
      Number(stats.dev),
      Number(stats.mode),
      Number(stats.nlink),
      Number(stats.uid),
      Number(stats.gid),
      Number(stats.rdev),
      Number(stats.blksize),
      Number(stats.ino),
      Number(stats.size),
      Number(stats.blocks),
      Number(JSBI.divide(stats.atimeNs, kNsPerMsBigInt)),
      Number(JSBI.divide(stats.mtimeNs, kNsPerMsBigInt)),
      Number(JSBI.divide(stats.ctimeNs, kNsPerMsBigInt)),
      stats.birthtimeNs ? Number(JSBI.divide(stats.birthtimeNs, kNsPerMsBigInt)) : undefined
    );
  }
};

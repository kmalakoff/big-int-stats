var fs = require('fs');
// eslint-disable-next-line no-undef
var BigInteger = typeof BigInt === 'undefined' ? require('big.js') : BigInt;

// eslint-disable-next-line node/no-deprecated-api
var constants = require('constants');
var S_IFIFO = constants.S_IFIFO;
var S_IFBLK = constants.S_IFBLK;
var S_IFSOCK = constants.S_IFSOCK;
var S_IFMT = constants.S_IFMT;
var S_IFMT_BIG = BigInteger(S_IFMT);

var StatsBase = fs.Stats;
var isWindows = process.platform === 'win32';
var kNsPerMsBigInt = BigInteger(Math.pow(10, 6));
var kNsPerMsInt = Math.pow(10, 6);

function dateFromMs(ms) {
  return new Date(Number(ms) + 0.5);
}

function construct(dev, mode, nlink, uid, gid, rdev, blksize, ino, size, blocks, atimeNs, mtimeNs, ctimeNs, birthtimeNs) {
  StatsBase.call(this, dev, mode, nlink, uid, gid, rdev, blksize, ino, size, blocks, atimeNs, mtimeNs, ctimeNs, birthtimeNs);
  if (this.dev === dev) return;
  this.dev = dev;
  this.mode = mode;
  this.nlink = nlink;
  this.uid = uid;
  this.gid = gid;
  this.rdev = rdev;
  this.blksize = blksize;
  this.ino = ino;
  this.size = size;
  this.blocks = blocks;
  this.atimeNs = atimeNs;
  this.mtimeNs = mtimeNs;
  this.ctimeNs = ctimeNs;
  this.birthtimeNs = birthtimeNs;
}

module.exports = (function () {
  function BigIntStats(dev, mode, nlink, uid, gid, rdev, blksize, ino, size, blocks, atimeNs, mtimeNs, ctimeNs, birthtimeNs) {
    var stats = null;
    if (dev instanceof StatsBase) {
      stats = dev;

      construct.call(
        this,
        BigInteger(stats.dev),
        BigInteger(stats.mode),
        BigInteger(stats.nlink),
        BigInteger(stats.uid),
        BigInteger(stats.gid),
        BigInteger(stats.rdev),
        BigInteger(stats.blksize),
        BigInteger(stats.ino),
        BigInteger(stats.size),
        BigInteger(stats.blocks)
      );
      if (stats.atimeMs) {
        this.atime = dateFromMs(stats.atimeMs);
        this.atimeMs = stats.atimeMs;
        this.atimeNs = BigInteger(Number(this.atimeMs * kNsPerMsInt));
      } else if (stats.atime) {
        this.atime = stats.atime;
        this.atimeMs = stats.atime.valueOf() * 1000;
        this.atimeNs = BigInteger(Number(this.atimeMs * kNsPerMsInt));
      }
      if (stats.mtimeMs) {
        this.mtime = dateFromMs(stats.mtimeMs);
        this.mtimeMs = stats.mtimeMs;
        this.mtimeNs = BigInteger(Number(this.mtimeMs * kNsPerMsInt));
      } else if (stats.mtime) {
        this.mtime = stats.mtime;
        this.mtimeMs = stats.mtime.valueOf() * 1000;
        this.mtimeNs = BigInteger(Number(this.mtimeMs * kNsPerMsInt));
      }
      if (stats.ctimeMs) {
        this.ctime = dateFromMs(stats.ctimeMs);
        this.ctimeMs = stats.ctimeMs;
        this.ctimeNs = BigInteger(Number(this.ctimeMs * kNsPerMsInt));
      } else if (stats.ctime) {
        this.ctime = stats.ctime;
        this.ctimeMs = stats.ctime.valueOf() * 1000;
        this.ctimeNs = BigInteger(Number(this.ctimeMs * kNsPerMsInt));
      }
      if (stats.birthtimeMs) {
        this.birthtime = dateFromMs(stats.birthtimeMs);
        this.birthtimeMs = stats.birthtimeMs;
        this.birthtimeNs = BigInteger(Number(this.birthtimeMs * kNsPerMsInt));
      } else if (stats.birthtime) {
        this.birthtime = stats.birthtime;
        this.birthtimeMs = stats.birthtime.valueOf() * 1000;
        this.birthtimeNs = BigInteger(Number(this.birthtimeMs * kNsPerMsInt));
      }
    } else {
      construct.call(this, dev, mode, nlink, uid, gid, rdev, blksize, ino, size, blocks);
      this.atimeNs = atimeNs;
      this.atimeMs = Number(BigInteger(atimeNs).divide(kNsPerMsBigInt));
      this.atime = dateFromMs(this.atimeMs);

      this.mtimeNs = mtimeNs;
      this.mtimeMs = Number(BigInteger(mtimeNs).divide(kNsPerMsBigInt));
      this.mtime = dateFromMs(this.mtimeMs);

      this.ctimeNs = ctimeNs;
      this.ctimeMs = Number(BigInteger(ctimeNs).divide(kNsPerMsBigInt));
      this.ctime = dateFromMs(this.ctimeMs);

      this.birthtimeNs = birthtimeNs;
      this.birthtimeMs = Number(BigInteger(birthtimeNs).divide(kNsPerMsBigInt));
      this.birthtime = dateFromMs(this.birthtimeMs);
    }

    if (BigInteger.DP && this.mode) this.modeSmall = +this.mode.toFixed();
    return this;
  }
  BigIntStats.prototype = Object.create(StatsBase.prototype);
  BigIntStats.prototype.constructor = BigIntStats;

  BigIntStats.prototype._checkModeProperty = function (property) {
    if (isWindows && (property === S_IFIFO || property === S_IFBLK || property === S_IFSOCK)) {
      return false; // Some types are not available on Windows
    }
    if (this.modeSmall) return (this.modeSmall & S_IFMT) === property;
    else return (this.mode & S_IFMT_BIG) === BigInteger(property);
  };

  return BigIntStats;
})();

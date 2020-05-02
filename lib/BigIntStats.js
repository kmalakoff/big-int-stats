var fs = require('fs');

var BigInteger = require('./BigInteger');

// eslint-disable-next-line node/no-deprecated-api
var constants = require('constants');
var S_IFIFO = constants.S_IFIFO;
var S_IFBLK = constants.S_IFBLK;
var S_IFSOCK = constants.S_IFSOCK;
var S_IFMT = constants.S_IFMT;
var S_IFMT_BIG = BigInteger(S_IFMT).value;

var StatsBase = fs.Stats;
var isWindows = process.platform === 'win32';
var kNsPerMsBigInt = BigInteger.pow(10, 6);
var kNsPerMsInt = Math.pow(10, 6);

function dateFromMs(ms) {
  return new Date(Number(ms) + 0.5);
}

module.exports = (function () {
  function BigIntStats(dev, mode, nlink, uid, gid, rdev, blksize, ino, size, blocks, atimeNs, mtimeNs, ctimeNs, birthtimeNs) {
    var stats = null;
    if (dev instanceof StatsBase) {
      stats = dev;
      StatsBase.call(
        this,
        BigInteger(stats.dev).value,
        BigInteger(stats.mode).value,
        BigInteger(stats.nlink).value,
        BigInteger(stats.uid).value,
        BigInteger(stats.gid).value,
        BigInteger(stats.rdev).value,
        BigInteger(stats.blksize).value,
        BigInteger(stats.ino).value,
        BigInteger(stats.size).value,
        BigInteger(stats.blocks).value
      );
      if (stats.atimeMs) {
        this.atime = dateFromMs(stats.atimeMs);
        this.atimeMs = stats.atimeMs;
        this.atimeNs = BigInteger(Number(this.atimeMs * kNsPerMsInt)).value;
      } else if (stats.atime) {
        this.atime = stats.atime;
        this.atimeMs = stats.atime.valueOf() * 1000;
        this.atimeNs = BigInteger(Number(this.atimeMs * kNsPerMsInt)).value;
      }
      if (stats.mtimeMs) {
        this.mtime = dateFromMs(stats.mtimeMs);
        this.mtimeMs = stats.mtimeMs;
        this.mtimeNs = BigInteger(Number(this.mtimeMs * kNsPerMsInt)).value;
      } else if (stats.mtime) {
        this.mtime = stats.mtime;
        this.mtimeMs = stats.mtime.valueOf() * 1000;
        this.mtimeNs = BigInteger(Number(this.mtimeMs * kNsPerMsInt)).value;
      }
      if (stats.ctimeMs) {
        this.ctime = dateFromMs(stats.ctimeMs);
        this.ctimeMs = stats.ctimeMs;
        this.ctimeNs = BigInteger(Number(this.ctimeMs * kNsPerMsInt)).value;
      } else if (stats.ctime) {
        this.ctime = stats.ctime;
        this.ctimeMs = stats.ctime.valueOf() * 1000;
        this.ctimeNs = BigInteger(Number(this.ctimeMs * kNsPerMsInt)).value;
      }
      if (stats.birthtimeMs) {
        this.birthtime = dateFromMs(stats.birthtimeMs);
        this.birthtimeMs = stats.birthtimeMs;
        this.birthtimeNs = BigInteger(Number(this.birthtimeMs * kNsPerMsInt)).value;
      } else if (stats.birthtime) {
        this.birthtime = stats.birthtime;
        this.birthtimeMs = stats.birthtime.valueOf() * 1000;
        this.birthtimeNs = BigInteger(Number(this.birthtimeMs * kNsPerMsInt)).value;
      }
    } else {
      StatsBase.call(this, dev, mode, nlink, uid, gid, rdev, blksize, ino, size, blocks);
      this.atimeNs = atimeNs;
      this.atimeMs = Number(BigInteger(atimeNs).divide(kNsPerMsBigInt).value);
      this.atime = dateFromMs(this.atimeMs);

      this.mtimeNs = mtimeNs;
      this.mtimeMs = Number(BigInteger(mtimeNs).divide(kNsPerMsBigInt).value);
      this.mtime = dateFromMs(this.mtimeMs);

      this.ctimeNs = ctimeNs;
      this.ctimeMs = Number(BigInteger(ctimeNs).divide(kNsPerMsBigInt).value);
      this.ctime = dateFromMs(this.ctimeMs);

      this.birthtimeNs = birthtimeNs;
      this.birthtimeMs = Number(BigInteger(birthtimeNs).divide(kNsPerMsBigInt).value);
      this.birthtime = dateFromMs(this.birthtimeMs);
    }

    return this;
  }
  BigIntStats.prototype = Object.create(StatsBase.prototype);
  BigIntStats.prototype.constructor = BigIntStats;

  BigIntStats.prototype._checkModeProperty = function (property) {
    if (isWindows && (property === S_IFIFO || property === S_IFBLK || property === S_IFSOCK)) {
      return false; // Some types are not available on Windows
    }
    return (this.mode & S_IFMT_BIG) === BigInteger(property).value;
  };

  return BigIntStats;
})();

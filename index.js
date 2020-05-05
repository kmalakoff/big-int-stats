var fs = require('fs');
var extend = require('legacy-extends');
var BigInteger = require('./lib/bigint-compat');

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

if (!Math.clz32) Math.clz32 = require('clz32');

// The Date constructor performs Math.floor() to the timestamp.
// https://www.ecma-international.org/ecma-262/#sec-timeclip
// Since there may be a precision loss when the timestamp is
// converted to a floating point number, we manually round
// the timestamp here before passing it to Date().
// Refs: https://github.com/nodejs/node/pull/12607
function dateFromMs(ms) {
  return new Date(Number(ms) + 0.5);
}

function BigIntStats(dev, mode, nlink, uid, gid, rdev, blksize, ino, size, blocks, atimeNs, mtimeNs, ctimeNs, birthtimeNs) {
  if (dev instanceof StatsBase) {
    var stats = dev;
    var self = BigIntStats.__super__.construct.call(
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
      self.atime = dateFromMs(stats.atimeMs);
      self.atimeMs = BigInteger(Math.round(stats.atimeMs));
      self.atimeNs = BigInteger.times(self.atimeMs, kNsPerMsBigInt);
    } else if (stats.atime) {
      self.atime = stats.atime;
      self.atimeMs = BigInteger(stats.atime.valueOf() * 1000);
      self.atimeNs = BigInteger.times(self.atimeMs, kNsPerMsBigInt);
    }
    if (stats.mtimeMs) {
      self.mtime = dateFromMs(stats.mtimeMs);
      self.mtimeMs = BigInteger(Math.round(stats.mtimeMs));
      self.mtimeNs = BigInteger.times(self.mtimeMs, kNsPerMsBigInt);
    } else if (stats.mtime) {
      self.mtime = stats.mtime;
      self.mtimeMs = BigInteger(stats.mtime.valueOf() * 1000);
      self.mtimeNs = BigInteger.times(self.mtimeMs, kNsPerMsBigInt);
    }
    if (stats.ctimeMs) {
      self.ctime = dateFromMs(stats.ctimeMs);
      self.ctimeMs = BigInteger(Math.round(stats.ctimeMs));
      self.ctimeNs = BigInteger.times(self.ctimeMs, kNsPerMsBigInt);
    } else if (stats.ctime) {
      self.ctime = stats.ctime;
      self.ctimeMs = BigInteger(stats.ctime.valueOf() * 1000);
      self.ctimeNs = BigInteger.times(self.ctimeMs, kNsPerMsBigInt);
    }
    if (stats.birthtimeMs) {
      self.birthtime = dateFromMs(stats.birthtimeMs);
      self.birthtimeMs = BigInteger(Math.round(stats.birthtimeMs));
      self.birthtimeNs = BigInteger.times(self.birthtimeMs, kNsPerMsBigInt);
    } else if (stats.birthtime) {
      self.birthtime = stats.birthtime;
      self.birthtimeMs = BigInteger(stats.birthtime.valueOf() * 1000);
      self.birthtimeNs = BigInteger.times(self.birthtimeMs, kNsPerMsBigInt);
    }
    return self;
  }

  // eslint-disable-next-line no-redeclare
  var self = BigIntStats.__super__.construct.call(this, dev, mode, nlink, uid, gid, rdev, blksize, ino, size, blocks);
  self.atimeMs = BigInteger.divide(atimeNs, kNsPerMsBigInt);
  self.atime = dateFromMs(self.atimeMs);
  self.atimeNs = atimeNs;

  self.mtimeMs = BigInteger.divide(mtimeNs, kNsPerMsBigInt);
  self.mtime = dateFromMs(self.mtimeMs);
  self.mtimeNs = mtimeNs;

  self.ctimeMs = BigInteger.divide(ctimeNs, kNsPerMsBigInt);
  self.ctime = dateFromMs(self.ctimeMs);
  self.ctimeNs = ctimeNs;

  self.birthtimeMs = BigInteger.divide(birthtimeNs, kNsPerMsBigInt);
  self.birthtime = dateFromMs(self.birthtimeMs);
  self.birthtimeNs = birthtimeNs;
  return self;
}
var argNames = ['dev', 'mode', 'nlink', 'uid', 'gid', 'rdev', 'blksize', 'ino', 'size', 'blocks', 'atimeNs', 'mtimeNs', 'ctimeNs', 'birthtimeNs'];
extend(BigIntStats, StatsBase, argNames);

BigIntStats.prototype._checkModeProperty = function (property) {
  if (isWindows && (property === S_IFIFO || property === S_IFBLK || property === S_IFSOCK)) {
    return false; // Some types are not available on Windows
  }
  return BigInteger.eq(BigInteger.bitwiseAnd(this.mode, S_IFMT_BIG), BigInteger(property));
};

module.exports = BigIntStats;

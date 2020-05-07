var fs = require('fs');
var extend = require('legacy-extends');
var JSBI = require('jsbi-compat');

// eslint-disable-next-line node/no-deprecated-api
var constants = require('constants');
var S_IFIFO = constants.S_IFIFO;
var S_IFBLK = constants.S_IFBLK;
var S_IFSOCK = constants.S_IFSOCK;
var S_IFMT = constants.S_IFMT;
var S_IFMT_BIG = JSBI.BigInt(S_IFMT);

var StatsBase = fs.Stats;
var isWindows = process.platform === 'win32';
var kNsPerMsBigInt = JSBI.BigInt(Math.pow(10, 6));

if (!Math.clz32) Math.clz32 = require('clz32');

// The Date constructor performs Math.floor() to the multiplytamp.
// https://www.ecma-international.org/ecma-262/#sec-timeclip
// Since there may be a precision loss when the multiplytamp is
// converted to a floating point number, we manually round
// the multiplytamp here before passing it to Date().
// Refs: https://github.com/nodejs/node/pull/12607
function dateFromMs(ms) {
  return new Date(Number(ms) + 0.5);
}

function BigIntStats(dev, mode, nlink, uid, gid, rdev, blksize, ino, size, blocks, atimeNs, mtimeNs, ctimeNs, birthtimeNs) {
  if (dev instanceof StatsBase) {
    var stats = dev;
    var self = BigIntStats.__super__.construct.call(
      this,
      JSBI.BigInt(stats.dev),
      JSBI.BigInt(stats.mode),
      JSBI.BigInt(stats.nlink),
      JSBI.BigInt(stats.uid),
      JSBI.BigInt(stats.gid),
      JSBI.BigInt(stats.rdev),
      JSBI.BigInt(stats.blksize),
      JSBI.BigInt(stats.ino),
      JSBI.BigInt(stats.size),
      JSBI.BigInt(stats.blocks)
    );
    if (stats.atimeMs) {
      self.atime = dateFromMs(stats.atimeMs);
      self.atimeMs = JSBI.BigInt(Math.round(stats.atimeMs));
      self.atimeNs = JSBI.multiply(self.atimeMs, kNsPerMsBigInt);
    } else if (stats.atime) {
      self.atime = stats.atime;
      self.atimeMs = JSBI.BigInt(stats.atime.valueOf() * 1000);
      self.atimeNs = JSBI.multiply(self.atimeMs, kNsPerMsBigInt);
    }
    if (stats.mtimeMs) {
      self.mtime = dateFromMs(stats.mtimeMs);
      self.mtimeMs = JSBI.BigInt(Math.round(stats.mtimeMs));
      self.mtimeNs = JSBI.multiply(self.mtimeMs, kNsPerMsBigInt);
    } else if (stats.mtime) {
      self.mtime = stats.mtime;
      self.mtimeMs = JSBI.BigInt(stats.mtime.valueOf() * 1000);
      self.mtimeNs = JSBI.multiply(self.mtimeMs, kNsPerMsBigInt);
    }
    if (stats.ctimeMs) {
      self.ctime = dateFromMs(stats.ctimeMs);
      self.ctimeMs = JSBI.BigInt(Math.round(stats.ctimeMs));
      self.ctimeNs = JSBI.multiply(self.ctimeMs, kNsPerMsBigInt);
    } else if (stats.ctime) {
      self.ctime = stats.ctime;
      self.ctimeMs = JSBI.BigInt(stats.ctime.valueOf() * 1000);
      self.ctimeNs = JSBI.multiply(self.ctimeMs, kNsPerMsBigInt);
    }
    if (stats.birthtimeMs) {
      self.birthtime = dateFromMs(stats.birthtimeMs);
      self.birthtimeMs = JSBI.BigInt(Math.round(stats.birthtimeMs));
      self.birthtimeNs = JSBI.multiply(self.birthtimeMs, kNsPerMsBigInt);
    } else if (stats.birthtime) {
      self.birthtime = stats.birthtime;
      self.birthtimeMs = JSBI.BigInt(stats.birthtime.valueOf() * 1000);
      self.birthtimeNs = JSBI.multiply(self.birthtimeMs, kNsPerMsBigInt);
    }
    return self;
  }

  // eslint-disable-next-line no-redeclare
  var self = BigIntStats.__super__.construct.call(this, dev, mode, nlink, uid, gid, rdev, blksize, ino, size, blocks);
  self.atimeMs = JSBI.divide(atimeNs, kNsPerMsBigInt);
  self.atime = dateFromMs(self.atimeMs);
  self.atimeNs = atimeNs;

  self.mtimeMs = JSBI.divide(mtimeNs, kNsPerMsBigInt);
  self.mtime = dateFromMs(self.mtimeMs);
  self.mtimeNs = mtimeNs;

  self.ctimeMs = JSBI.divide(ctimeNs, kNsPerMsBigInt);
  self.ctime = dateFromMs(self.ctimeMs);
  self.ctimeNs = ctimeNs;

  self.birthtimeMs = JSBI.divide(birthtimeNs, kNsPerMsBigInt);
  self.birthtime = dateFromMs(self.birthtimeMs);
  self.birthtimeNs = birthtimeNs;
  return self;
}
var properties = ['dev', 'mode', 'nlink', 'uid', 'gid', 'rdev', 'blksize', 'ino', 'size', 'blocks', 'atimeNs', 'mtimeNs', 'ctimeNs', 'birthtimeNs'];
extend(BigIntStats, StatsBase, { ensureProperties: properties });

BigIntStats.prototype._checkModeProperty = function (property) {
  if (isWindows && (property === S_IFIFO || property === S_IFBLK || property === S_IFSOCK)) {
    return false; // Some types are not available on Windows
  }
  return JSBI.equal(JSBI.bitwiseAnd(this.mode, S_IFMT_BIG), JSBI.BigInt(property));
};

module.exports = BigIntStats;

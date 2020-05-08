var fs = require('fs');
var JSBI = require('jsbi-compat');
var extend = require('legacy-extends');

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
extend(BigIntStats, StatsBase, { ensureProperties: ['dev', 'mode', 'nlink', 'uid', 'gid', 'rdev', 'blksize', 'ino', 'size', 'blocks'] });

BigIntStats.prototype._checkModeProperty = function (property) {
  if (isWindows && (property === S_IFIFO || property === S_IFBLK || property === S_IFSOCK)) {
    return false; // Some types are not available on Windows
  }
  return JSBI.equal(JSBI.bitwiseAnd(this.mode, S_IFMT_BIG), JSBI.BigInt(property));
};

module.exports = BigIntStats;

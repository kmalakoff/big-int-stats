var fs = require('fs');
var BigInt = require('big-integer');

var pow = require('./pow');

// eslint-disable-next-line node/no-deprecated-api
var constants = require('constants');
var S_IFIFO = constants.S_IFIFO;
var S_IFBLK = constants.S_IFBLK;
var S_IFSOCK = constants.S_IFSOCK;
var S_IFMT = constants.S_IFMT;

var StatsBase = fs.Stats.prototype.constructor.prototype.constructor;
var isWindows = process.platform === 'win32';
var kNsPerMsBigInt = pow(10n, 6n);
var kNsPerMsInt = Math.pow(10, 6);

function dateFromMs(ms) {
  return new Date(Number(ms) + 0.5);
}

module.exports = (function () {
  var createHelpers = require('./createHelpers');
  var _super = createHelpers.createSuper(StatsBase);

  function BigIntStats(dev, mode, nlink, uid, gid, rdev, blksize, ino, size, blocks, atimeNs, mtimeNs, ctimeNs, birthtimeNs) {
    var _this;
    createHelpers.classCallCheck(this, BigIntStats);

    if (dev instanceof fs.Stats) {
      var stats = dev;
      _this = _super.call(
        this,
        BigInt(stats.dev).value,
        BigInt(stats.mode).value,
        BigInt(stats.nlink).value,
        BigInt(stats.uid).value,
        BigInt(stats.gid).value,
        BigInt(stats.rdev).value,
        BigInt(stats.blksize).value,
        BigInt(stats.ino).value,
        BigInt(stats.size).value,
        BigInt(stats.blocks).value
      );

      _this.atimeMs = stats.atimeMs;
      _this.mtimeMs = stats.mtimeMs;
      _this.ctimeMs = stats.ctimeMs;
      _this.birthtimeMs = stats.birthtimeMs;
      atimeNs = BigInt(Number(stats.atimeMs * kNsPerMsInt)).value;
      mtimeNs = BigInt(Number(stats.mtimeMs * kNsPerMsInt)).value;
      ctimeNs = BigInt(Number(stats.ctimeMs * kNsPerMsInt)).value;
      birthtimeNs = BigInt(Number(stats.birthtimeMs * kNsPerMsInt)).value;
    } else {
      _this = _super.call(this, dev, mode, nlink, uid, gid, rdev, blksize, ino, size, blocks);
      _this.atimeMs = atimeNs / kNsPerMsBigInt;
      _this.mtimeMs = mtimeNs / kNsPerMsBigInt;
      _this.ctimeMs = ctimeNs / kNsPerMsBigInt;
      _this.birthtimeMs = birthtimeNs / kNsPerMsBigInt;
    }
    _this.atimeNs = atimeNs;
    _this.mtimeNs = mtimeNs;
    _this.ctimeNs = ctimeNs;
    _this.birthtimeNs = birthtimeNs;
    _this.atime = dateFromMs(_this.atimeMs);
    _this.mtime = dateFromMs(_this.mtimeMs);
    _this.ctime = dateFromMs(_this.ctimeMs);
    _this.birthtime = dateFromMs(_this.birthtimeMs);
    return _this;
  }
  createHelpers.inherits(BigIntStats, StatsBase);

  BigIntStats.prototype._checkModeProperty = function (property) {
    if (isWindows && (property === S_IFIFO || property === S_IFBLK || property === S_IFSOCK)) {
      return false; // Some types are not available on Windows
    }
    return (this.mode & BigInt(S_IFMT).value) === BigInt(property).value;
  };

  return BigIntStats;
})();

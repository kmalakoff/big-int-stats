import { Stats } from 'fs';
import constants from 'fs-constants';
import JSBI from 'jsbi-compat';

var S_IFIFO = constants.S_IFIFO;
var S_IFBLK = constants.S_IFBLK;
var S_IFSOCK = constants.S_IFSOCK;
var S_IFMT = constants.S_IFMT;
var S_IFMT_BIG = JSBI.BigInt(S_IFMT);

var isWindows = process.platform === 'win32';
var kNsPerMsBigInt = JSBI.BigInt(10 ** 6);

// The Date constructor performs Math.floor() to the multiplytamp.
// https://www.ecma-international.org/ecma-262/#sec-timeclip
// Since there may be a precision loss when the multiplytamp is
// converted to a floating point number, we manually round
// the multiplytamp here before passing it to Date().
// Refs: https://github.com/nodejs/node/pull/12607
function dateFromMs(ms) {
  return new Date(JSBI.toNumber(ms) + 0.5);
}

// @ts-ignore
export default class BigIntStats extends Stats {
  atime: Date;
  mtime: Date;
  ctime: Date;
  birthtime: Date;
  atimeNs: bigint;
  mtimeNs: bigint;
  ctimeNs: bigint;
  birthtimeNs: bigint;

  constructor(dev: number, mode: number, nlink: number, uid: number, gid: number, rdev: number, blksize: number, ino: number, size: number, blocks: number, atimeNs: bigint, mtimeNs: bigint, ctimeNs: bigint, birthtimeNs: bigint) {
    super();
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
    this.atimeMs = JSBI.divide(atimeNs, kNsPerMsBigInt);
    this.atime = dateFromMs(this.atimeMs);
    this.atimeNs = atimeNs;

    this.mtimeMs = JSBI.divide(mtimeNs, kNsPerMsBigInt);
    this.mtime = dateFromMs(this.mtimeMs);
    this.mtimeNs = mtimeNs;

    this.ctimeMs = JSBI.divide(ctimeNs, kNsPerMsBigInt);
    this.ctime = dateFromMs(this.ctimeMs);
    this.ctimeNs = ctimeNs;

    this.birthtimeMs = JSBI.divide(birthtimeNs, kNsPerMsBigInt);
    this.birthtime = dateFromMs(this.birthtimeMs);
    this.birthtimeNs = birthtimeNs;
  }

  _checkModeProperty(property) {
    if (isWindows && (property === S_IFIFO || property === S_IFBLK || property === S_IFSOCK)) {
      return false; // Some types are not available on Windows
    }
    return JSBI.equal(JSBI.bitwiseAnd(this.mode, S_IFMT_BIG), JSBI.BigInt(property));
  }
}

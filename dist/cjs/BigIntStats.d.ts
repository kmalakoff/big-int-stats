import { Stats } from 'fs';
export default class BigIntStats extends Stats {
    atime: Date;
    mtime: Date;
    ctime: Date;
    birthtime: Date;
    atimeNs: bigint;
    mtimeNs: bigint;
    ctimeNs: bigint;
    birthtimeNs: bigint;
    constructor(dev: number, mode: number, nlink: number, uid: number, gid: number, rdev: number, blksize: number, ino: number, size: number, blocks: number, atimeNs: bigint, mtimeNs: bigint, ctimeNs: bigint, birthtimeNs: bigint);
    _checkModeProperty(property: any): any;
}

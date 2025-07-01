import fs from 'fs';
import JSBI from 'jsbi-compat';
const kNsPerMsBigInt = JSBI.BigInt(10 ** 6);
export default function toStats(stats) {
    if (typeof stats.dev !== 'bigint') return stats;
    const bigStats = stats;
    // @ts-ignore
    return new fs.Stats(Number(bigStats.dev), Number(bigStats.mode), Number(bigStats.nlink), Number(bigStats.uid), Number(bigStats.gid), Number(bigStats.rdev), Number(bigStats.blksize), Number(bigStats.ino), Number(bigStats.size), Number(bigStats.blocks), Number(bigStats.atimeNs ? JSBI.divide(bigStats.atimeNs, kNsPerMsBigInt) : bigStats.atimeMs), Number(bigStats.mtimeNs ? JSBI.divide(bigStats.mtimeNs, kNsPerMsBigInt) : bigStats.mtimeMs), Number(bigStats.ctimeNs ? JSBI.divide(bigStats.ctimeNs, kNsPerMsBigInt) : bigStats.ctimeMs), Number(bigStats.birthtimeNs ? JSBI.divide(bigStats.birthtimeNs, kNsPerMsBigInt) : bigStats.birthtimeMs));
}

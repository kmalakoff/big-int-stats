import JSBI from 'jsbi-compat';
import BigIntStatsEmulated from './BigIntStats.js';
var kNsPerMsBigInt = JSBI.BigInt(10 ** 6);
export default function toBigIntStats(stats) {
    if (typeof stats.dev === 'bigint') return stats;
    const littleStats = stats;
    return new BigIntStatsEmulated(JSBI.BigInt(littleStats.dev), JSBI.BigInt(littleStats.mode), JSBI.BigInt(littleStats.nlink), JSBI.BigInt(littleStats.uid), JSBI.BigInt(littleStats.gid), JSBI.BigInt(littleStats.rdev), typeof littleStats.blksize === 'undefined' ? undefined : JSBI.BigInt(littleStats.blksize), JSBI.BigInt(littleStats.ino), JSBI.BigInt(littleStats.size), typeof littleStats.blocks === 'undefined' ? undefined : JSBI.BigInt(littleStats.blocks), JSBI.multiply(JSBI.BigInt(Math.round(littleStats.atimeMs)), kNsPerMsBigInt), JSBI.multiply(JSBI.BigInt(Math.round(littleStats.mtimeMs)), kNsPerMsBigInt), JSBI.multiply(JSBI.BigInt(Math.round(littleStats.ctimeMs)), kNsPerMsBigInt), littleStats.birthtimeMs ? JSBI.multiply(JSBI.BigInt(Math.round(littleStats.birthtimeMs)), kNsPerMsBigInt) : undefined);
}

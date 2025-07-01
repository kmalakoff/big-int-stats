import type { BigIntStats, Stats, StatsBase } from 'fs';
import JSBI from 'jsbi-compat';

import BigIntStatsEmulated from './BigIntStats.ts';

var kNsPerMsBigInt = JSBI.BigInt(10 ** 6);

import type { AnyStats } from './types.ts';

export default function toBigIntStats(stats: AnyStats): BigIntStats {
  if (typeof (stats as StatsBase<number>).dev === 'bigint') return stats as BigIntStats;

  const littleStats = stats as Stats;
  return new BigIntStatsEmulated(
    JSBI.BigInt(littleStats.dev),
    JSBI.BigInt(littleStats.mode),
    JSBI.BigInt(littleStats.nlink),
    JSBI.BigInt(littleStats.uid),
    JSBI.BigInt(littleStats.gid),
    JSBI.BigInt(littleStats.rdev),
    typeof littleStats.blksize === 'undefined' ? undefined : JSBI.BigInt(littleStats.blksize),
    JSBI.BigInt(littleStats.ino),
    JSBI.BigInt(littleStats.size),
    typeof littleStats.blocks === 'undefined' ? undefined : JSBI.BigInt(littleStats.blocks),
    JSBI.multiply(JSBI.BigInt(Math.round(littleStats.atimeMs)), kNsPerMsBigInt),
    JSBI.multiply(JSBI.BigInt(Math.round(littleStats.mtimeMs)), kNsPerMsBigInt),
    JSBI.multiply(JSBI.BigInt(Math.round(littleStats.ctimeMs)), kNsPerMsBigInt),
    littleStats.birthtimeMs ? JSBI.multiply(JSBI.BigInt(Math.round(littleStats.birthtimeMs)), kNsPerMsBigInt) : undefined
  ) as unknown as BigIntStats;
}

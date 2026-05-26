import type { BigIntStats, Stats, StatsBase } from 'fs';
import fs from 'fs';
import JSBI from 'jsbi-compat';

const kNsPerMsBigInt = JSBI.BigInt(10 ** 6);
const kNsPerSecBigInt = JSBI.BigInt(10 ** 9);
// Node 26+ changed fs.Stats constructor to take (seconds, subsecond_ns) pairs per timestamp
const major = +process.versions.node.split('.')[0];
const useSecNsFracArgs = major > 24;

import type { AnyStats } from './types.ts';

function getNs(bigStats: BigIntStats, nsKey: string, msKey: string): InstanceType<typeof JSBI> {
  const ns = (bigStats as unknown as Record<string, unknown>)[nsKey];
  if (ns) return ns as InstanceType<typeof JSBI>;
  const ms = (bigStats as unknown as Record<string, unknown>)[msKey];
  return JSBI.multiply(ms as InstanceType<typeof JSBI>, kNsPerMsBigInt);
}

function timeArgs(ns: InstanceType<typeof JSBI>): number[] {
  if (useSecNsFracArgs) {
    return [Number(JSBI.divide(ns, kNsPerSecBigInt)), Number(JSBI.remainder(ns, kNsPerSecBigInt))];
  }
  return [Number(JSBI.divide(ns, kNsPerMsBigInt))];
}

export default function toStats(stats: AnyStats): Stats {
  if (typeof (stats as StatsBase<number>).dev !== 'bigint') return stats as Stats;

  const bigStats = stats as BigIntStats;
  // @ts-expect-error
  return new fs.Stats(
    Number(bigStats.dev),
    Number(bigStats.mode),
    Number(bigStats.nlink),
    Number(bigStats.uid),
    Number(bigStats.gid),
    Number(bigStats.rdev),
    Number(bigStats.blksize),
    Number(bigStats.ino),
    Number(bigStats.size),
    Number(bigStats.blocks),
    ...timeArgs(getNs(bigStats, 'atimeNs', 'atimeMs')),
    ...timeArgs(getNs(bigStats, 'mtimeNs', 'mtimeMs')),
    ...timeArgs(getNs(bigStats, 'ctimeNs', 'ctimeMs')),
    ...timeArgs(getNs(bigStats, 'birthtimeNs', 'birthtimeMs'))
  );
}

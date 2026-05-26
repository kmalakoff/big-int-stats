import assert from 'assert';
import JSBI from 'jsbi-compat';
import isDate from 'lodash.isdate';
import { inspect } from 'util';
import { numberIsSafeInteger, stringEndsWith } from './compat.ts';

const kNsPerMsBigInt = JSBI.BigInt(10 ** 6);

export default function verifyStats(bigintStats: Record<string, unknown>, numStats: Record<string, unknown>, allowableDelta: number) {
  // allowableDelta: It's possible that the file stats are updated between the
  // two stat() calls so allow for a small difference.
  for (const key in numStats) {
    // biome-ignore lint/suspicious/noPrototypeBuiltins: hasOwnProperty
    if (!numStats.hasOwnProperty(key)) continue;
    const val = numStats[key];
    if (isDate(val)) {
      const time = (val as Date).getTime();
      const time2 = (bigintStats[key] as Date).getTime();
      assert(time - time2 <= allowableDelta, `difference of ${key}.getTime() should <= ${allowableDelta}.\nNumber version ${time}, BigInt version ${time2}n`);
    } else if (key === 'mode') {
      assert.ok(JSBI.equal(bigintStats[key] as InstanceType<typeof JSBI>, JSBI.BigInt(val as number)));
      assert.strictEqual((bigintStats.isBlockDevice as () => boolean)(), (numStats.isBlockDevice as () => boolean)());
      assert.strictEqual((bigintStats.isCharacterDevice as () => boolean)(), (numStats.isCharacterDevice as () => boolean)());
      assert.strictEqual((bigintStats.isDirectory as () => boolean)(), (numStats.isDirectory as () => boolean)());
      assert.strictEqual((bigintStats.isFIFO as () => boolean)(), (numStats.isFIFO as () => boolean)());
      assert.strictEqual((bigintStats.isFile as () => boolean)(), (numStats.isFile as () => boolean)());
      assert.strictEqual((bigintStats.isSocket as () => boolean)(), (numStats.isSocket as () => boolean)());
      assert.strictEqual((bigintStats.isSymbolicLink as () => boolean)(), (numStats.isSymbolicLink as () => boolean)());
    } else if (stringEndsWith(key, 'Ms')) {
      const nsKey = key.replace('Ms', 'Ns');
      const msFromBigInt = bigintStats[key] as InstanceType<typeof JSBI>;
      const nsFromBigInt = bigintStats[nsKey] as InstanceType<typeof JSBI>;
      const msFromBigIntNs = JSBI.divide(nsFromBigInt, kNsPerMsBigInt);
      const msFromNum = val as number;

      assert(msFromNum - JSBI.toNumber(msFromBigInt) <= allowableDelta, `msFromBigInt: Number version ${key} = ${msFromNum}, BigInt version ${key} = ${JSBI.toNumber(msFromBigInt)}n, Delta = ${msFromNum - JSBI.toNumber(msFromBigInt)} Allowable delta = ${allowableDelta}`);
      assert(msFromNum - JSBI.toNumber(msFromBigIntNs) <= allowableDelta, `msFromBigIntNs: Number version ${key} = ${msFromNum}, BigInt version ${nsKey} = ${JSBI.toNumber(nsFromBigInt)}n = ${JSBI.toNumber(msFromBigIntNs)}ms, Delta = ${msFromNum - JSBI.toNumber(msFromBigIntNs)}, Allowable delta = ${allowableDelta}`);
    } else if (numberIsSafeInteger(val as number)) {
      assert.ok(JSBI.equal(bigintStats[key] as InstanceType<typeof JSBI>, JSBI.BigInt(val as number)), `${inspect(bigintStats[key])} !== ${inspect(JSBI.BigInt(val as number))}\nkey=${key}, val=${val}`);
    } else {
      typeof bigintStats[key] === 'undefined' || assert(JSBI.toNumber(bigintStats[key] as InstanceType<typeof JSBI>) - (val as number) < 1, `${key} is not a safe integer, difference should < 1.\nNumber version ${val}, BigInt version ${bigintStats[key]}n`);
    }
  }
}

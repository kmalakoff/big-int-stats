import assert from 'assert';
import JSBI from 'jsbi-compat';
import isDate from 'lodash.isdate';
import { inspect } from 'util';
import { numberIsSafeInteger, stringEndsWith } from './compat.ts';

const kNsPerMsBigInt = JSBI.BigInt(10 ** 6);

export default function verifyStats(bigintStats, numStats, allowableDelta) {
  // allowableDelta: It's possible that the file stats are updated between the
  // two stat() calls so allow for a small difference.
  for (const key in numStats) {
    // biome-ignore lint/suspicious/noPrototypeBuiltins: hasOwnProperty
    if (!numStats.hasOwnProperty(key)) continue;
    const val = numStats[key];
    if (isDate(val)) {
      const time = val.getTime();
      const time2 = bigintStats[key].getTime();
      assert(time - time2 <= allowableDelta, `difference of ${key}.getTime() should <= ${allowableDelta}.\nNumber version ${time}, BigInt version ${time2}n`);
    } else if (key === 'mode') {
      assert.ok(JSBI.equal(bigintStats[key], JSBI.BigInt(val)));
      assert.strictEqual(bigintStats.isBlockDevice(), numStats.isBlockDevice());
      assert.strictEqual(bigintStats.isCharacterDevice(), numStats.isCharacterDevice());
      assert.strictEqual(bigintStats.isDirectory(), numStats.isDirectory());
      assert.strictEqual(bigintStats.isFIFO(), numStats.isFIFO());
      assert.strictEqual(bigintStats.isFile(), numStats.isFile());
      assert.strictEqual(bigintStats.isSocket(), numStats.isSocket());
      assert.strictEqual(bigintStats.isSymbolicLink(), numStats.isSymbolicLink());
    } else if (stringEndsWith(key, 'Ms')) {
      const nsKey = key.replace('Ms', 'Ns');
      const msFromBigInt = bigintStats[key];
      const nsFromBigInt = bigintStats[nsKey];
      const msFromBigIntNs = JSBI.divide(nsFromBigInt, kNsPerMsBigInt);
      const msFromNum = numStats[key];

      assert(msFromNum - JSBI.toNumber(msFromBigInt) <= allowableDelta, `Number version ${key} = ${msFromNum}, BigInt version ${key} = ${JSBI.toNumber(msFromBigInt)}n, Allowable delta = ${allowableDelta}`);

      assert(msFromNum - JSBI.toNumber(msFromBigIntNs) <= allowableDelta, `Number version ${key} = ${msFromNum}, BigInt version ${nsKey} = ${JSBI.toNumber(nsFromBigInt)}n = ${JSBI.toNumber(msFromBigIntNs)}ms, Allowable delta = ${allowableDelta}`);
    } else if (numberIsSafeInteger(val)) {
      assert.ok(JSBI.equal(bigintStats[key], JSBI.BigInt(val)), `${inspect(bigintStats[key])} !== ${inspect(JSBI.BigInt(val))}\nkey=${key}, val=${val}`);
    } else {
      typeof bigintStats[key] === 'undefined' || assert(JSBI.toNumber(bigintStats[key]) - val < 1, `${key} is not a safe integer, difference should < 1.\nNumber version ${val}, BigInt version ${bigintStats[key]}n`);
    }
  }
}

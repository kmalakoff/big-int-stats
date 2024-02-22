var assert = require('assert');
var inspect = require('util').inspect;
var isDate = require('lodash.isdate');
var JSBI = require('jsbi-compat');

var kNsPerMsBigInt = JSBI.BigInt(10 ** 6);

module.exports = function verifyStats(bigintStats, numStats, allowableDelta) {
  // allowableDelta: It's possible that the file stats are updated between the
  // two stat() calls so allow for a small difference.
  for (var key in numStats) {
    // biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
    if (!numStats.hasOwnProperty(key)) continue;
    var val = numStats[key];
    if (isDate(val)) {
      var time = val.getTime();
      var time2 = bigintStats[key].getTime();
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
    } else if (key.endsWith('Ms')) {
      var nsKey = key.replace('Ms', 'Ns');
      var msFromBigInt = bigintStats[key];
      var nsFromBigInt = bigintStats[nsKey];
      var msFromBigIntNs = JSBI.divide(nsFromBigInt, kNsPerMsBigInt);
      var msFromNum = numStats[key];

      assert(msFromNum - JSBI.toNumber(msFromBigInt) <= allowableDelta, `Number version ${key} = ${msFromNum}, BigInt version ${key} = ${JSBI.toNumber(msFromBigInt)}n, Allowable delta = ${allowableDelta}`);

      assert(msFromNum - JSBI.toNumber(msFromBigIntNs) <= allowableDelta, `Number version ${key} = ${msFromNum}, BigInt version ${nsKey} = ${JSBI.toNumber(nsFromBigInt)}n = ${JSBI.toNumber(msFromBigIntNs)}ms, Allowable delta = ${allowableDelta}`);
    } else if (Number.isSafeInteger(val)) {
      assert.ok(JSBI.equal(bigintStats[key], JSBI.BigInt(val)), `${inspect(bigintStats[key])} !== ${inspect(JSBI.BigInt(val))}\nkey=${key}, val=${val}`);
    } else {
      typeof bigintStats[key] === 'undefined' || assert(JSBI.toNumber(bigintStats[key]) - val < 1, `${key} is not a safe integer, difference should < 1.\nNumber version ${val}, BigInt version ${bigintStats[key]}n`);
    }
  }
};

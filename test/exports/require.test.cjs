const assert = require('assert');
const { BigIntStats, toBigIntStats, toStats } = require('big-int-stats');

describe('exports .cjs', () => {
  it('exports', () => {
    assert.equal(typeof BigIntStats, 'function');
    assert.equal(typeof toBigIntStats, 'function');
    assert.equal(typeof toStats, 'function');
  });
});

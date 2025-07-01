import assert from 'assert';
import { BigIntStats, toBigIntStats, toStats } from 'big-int-stats';

describe('exports .mjs', () => {
  it('exports', () => {
    assert.equal(typeof BigIntStats, 'function');
    assert.equal(typeof toBigIntStats, 'function');
    assert.equal(typeof toStats, 'function');
  });
});

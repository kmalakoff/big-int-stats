require('../lib/polyfills');

var assert = require('assert');
var generate = require('fs-generate');
var rimraf = require('rimraf');
var path = require('path');
var fs = require('fs');
var statsSpys = require('fs-stats-spys');
var isDate = require('lodash.isdate');
var normalizeStats = require('normalize-stats');

const { toBigIntStats, toStats } = require('big-int-stats');
var verifyStats = require('../lib/verifyStats');

var TEST_DIR = path.resolve(path.join(__dirname, '..', '..', '.tmp', 'test'));
var STRUCTURE = {
  file1: 'a',
  file2: 'b',
  dir1: null,
  'dir2/file1': 'c',
  'dir2/file2': 'd',
  'dir3/dir4/file1': 'e',
  'dir3/dir4/dir5': null,
  filelink1: '~dir3/dir4/file1',
  'dir3/filelink2': '~dir2/file1',
};

var ALLOWABLE_DELTA = 10;

describe('BigIntStats', () => {
  after((done) => {
    rimraf(TEST_DIR, done);
  });
  beforeEach((done) => {
    rimraf(TEST_DIR, () => {
      generate(TEST_DIR, STRUCTURE, done);
    });
  });

  it('should load stats', (done) => {
    var spys = statsSpys();

    fs.readdir(TEST_DIR, (err, names) => {
      assert.ok(!err);

      for (var index in names) {
        var smallStats = normalizeStats(fs.statSync(path.join(TEST_DIR, names[index])));
        var bigStats = toBigIntStats(smallStats);
        verifyStats(bigStats, smallStats, ALLOWABLE_DELTA);
        spys(smallStats);
        spys(bigStats);
      }

      assert.equal(spys.callCount, 12);
      assert.equal(spys.dir.callCount, 6);
      assert.equal(spys.file.callCount, 6);
      assert.equal(spys.link.callCount, 0);
      done();
    });
  });

  typeof BigInt === 'undefined' ||
    it('should initialize from with bigInt option', (done) => {
      var spys = statsSpys();

      fs.readdir(TEST_DIR, { bigint: true }, (err, names) => {
        assert.ok(!err);

        for (var index in names) {
          var bigStats = normalizeStats(fs.lstatSync(path.join(TEST_DIR, names[index]), { bigint: true }));
          var smallStats = toStats(bigStats);

          verifyStats(bigStats, smallStats, ALLOWABLE_DELTA);
          spys(smallStats);
          spys(bigStats);
        }

        assert.equal(spys.callCount, 12);
        assert.equal(spys.dir.callCount, 6);
        assert.equal(spys.file.callCount, 4);
        assert.equal(spys.link.callCount, 2);

        for (var key in bigStats) {
          // biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
          if (!bigStats.hasOwnProperty(key)) continue;

          if (key.endsWith('Ms')) {
            var nsKey = key.replace('Ms', 'Ns');
            if (!bigStats[nsKey]) continue; // in Node 10, Ms had the big ints then they were moved to Ns
          }

          if (isDate(bigStats[key])) {
            var time = bigStats[key].getTime();
            var time2 = bigStats[key].getTime();
            assert(time - time2 <= ALLOWABLE_DELTA, `difference of ${key}.getTime() should <= ${ALLOWABLE_DELTA}.\nNumber version ${time}, BigInt version ${time2}n`);
          } else {
            assert.strictEqual(bigStats[key], bigStats[key], key);
          }
        }

        done();
      });
    });
});

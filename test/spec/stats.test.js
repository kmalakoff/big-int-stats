var assert = require('assert');
var generate = require('fs-generate');
var rimraf = require('rimraf');
var path = require('path');
var fs = require('fs');
var statsSpys = require('fs-stats-spys');
var endsWith = require('end-with');
var isDate = require('lodash.isdate');
var normalizeStats = require('normalize-stats');

var toBigIntStats = require('../../lib/toBigIntStats');
var toStats = require('../../lib/toStats');
var verifyStats = require('../lib/verifyStats');

var DIR = path.resolve(path.join(__dirname, '..', 'data'));
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

describe('BigIntStats', function () {
  after(function (done) {
    rimraf(DIR, done);
  });
  beforeEach(function (done) {
    rimraf(DIR, function () {
      generate(DIR, STRUCTURE, done);
    });
  });

  it('should load stats', function (done) {
    var spys = statsSpys();

    fs.readdir(DIR, function (err, names) {
      assert.ok(!err);

      for (var index in names) {
        var smallStats = normalizeStats(fs.statSync(path.join(DIR, names[index])));

        assert.ok(typeof smallStats.dev !== 'undefined');
        assert.ok(typeof smallStats.mode !== 'undefined');
        assert.ok(typeof smallStats.nlink !== 'undefined');
        assert.ok(typeof smallStats.uid !== 'undefined');
        assert.ok(typeof smallStats.gid !== 'undefined');
        assert.ok(typeof smallStats.rdev !== 'undefined');
        assert.ok(typeof smallStats.blksize !== 'undefined');
        assert.ok(typeof smallStats.ino !== 'undefined');
        assert.ok(typeof smallStats.size !== 'undefined');
        assert.ok(typeof smallStats.blocks !== 'undefined');
        assert.ok(typeof smallStats.atime !== 'undefined');
        assert.ok(typeof smallStats.atimeMs !== 'undefined');
        assert.ok(typeof smallStats.mtime !== 'undefined');
        assert.ok(typeof smallStats.mtimeMs !== 'undefined');
        assert.ok(typeof smallStats.ctime !== 'undefined');
        assert.ok(typeof smallStats.ctimeMs !== 'undefined');
        !smallStats.birthtime || assert.ok(typeof smallStats.birthtimeMs !== 'undefined');

        var testBigStats = toBigIntStats(smallStats);
        verifyStats(testBigStats, smallStats, ALLOWABLE_DELTA);
        spys(smallStats);
        spys(testBigStats);
      }

      assert.equal(spys.callCount, 12);
      assert.equal(spys.dir.callCount, 6);
      assert.equal(spys.file.callCount, 6);
      assert.equal(spys.link.callCount, 0);
      done();
    });
  });

  typeof BigInt === 'undefined' ||
    it('should initialize from with bigInt option', function (done) {
      var spys = statsSpys();

      fs.readdir(DIR, { bigint: true }, function (err, names) {
        assert.ok(!err);

        for (var index in names) {
          var bigStats = fs.lstatSync(path.join(DIR, names[index]), { bigint: true });

          bigStats = normalizeStats(bigStats);
          assert.ok(typeof bigStats.dev !== 'undefined');
          assert.ok(typeof bigStats.mode !== 'undefined');
          assert.ok(typeof bigStats.nlink !== 'undefined');
          assert.ok(typeof bigStats.uid !== 'undefined');
          assert.ok(typeof bigStats.gid !== 'undefined');
          assert.ok(typeof bigStats.rdev !== 'undefined');
          assert.ok(typeof bigStats.blksize !== 'undefined');
          assert.ok(typeof bigStats.ino !== 'undefined');
          assert.ok(typeof bigStats.size !== 'undefined');
          assert.ok(typeof bigStats.blocks !== 'undefined');
          assert.ok(typeof bigStats.atime !== 'undefined');
          assert.ok(typeof bigStats.atimeMs !== 'undefined');
          assert.ok(typeof bigStats.atimeNs !== 'undefined');
          assert.ok(typeof bigStats.mtime !== 'undefined');
          assert.ok(typeof bigStats.mtimeMs !== 'undefined');
          assert.ok(typeof bigStats.mtimeNs !== 'undefined');
          assert.ok(typeof bigStats.ctime !== 'undefined');
          assert.ok(typeof bigStats.ctimeMs !== 'undefined');
          assert.ok(typeof bigStats.birthtimeMs !== 'undefined');
          assert.ok(typeof bigStats.birthtimeNs !== 'undefined');

          var smallStats = toStats(bigStats);
          var testBigStats = toBigIntStats(bigStats);

          verifyStats(testBigStats, smallStats, ALLOWABLE_DELTA);
          spys(smallStats);
          spys(testBigStats);
        }

        assert.equal(spys.callCount, 12);
        assert.equal(spys.dir.callCount, 6);
        assert.equal(spys.file.callCount, 4);
        assert.equal(spys.link.callCount, 2);

        for (var key in bigStats) {
          // eslint-disable-next-line no-prototype-builtins
          if (!bigStats.hasOwnProperty(key)) continue;

          if (endsWith(key, 'Ms')) {
            var nsKey = key.replace('Ms', 'Ns');
            if (!bigStats[nsKey]) continue; // in Node 10, Ms had the big ints then they were moved to Ns
          }

          if (isDate(bigStats[key])) {
            var time = bigStats[key].getTime();
            var time2 = testBigStats[key].getTime();
            assert(
              time - time2 <= ALLOWABLE_DELTA,
              'difference of ' + key + '.getTime() should <= ' + ALLOWABLE_DELTA + '.\n' + 'Number version ' + time + ', BigInt version ' + time2 + 'n'
            );
          } else {
            assert.strictEqual(bigStats[key], testBigStats[key], key);
          }
        }

        done();
      });
    });
});

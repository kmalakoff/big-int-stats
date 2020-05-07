var assert = require('assert');
var generate = require('fs-generate');
var rimraf = require('rimraf');
var path = require('path');
var fs = require('fs');
var statsSpys = require('fs-stats-spys');
var endsWith = require('end-with');
var isDate = require('lodash.isdate');
var JSBI = require('jsbi-compat');

var BigIntStats = require('../..');
var patchBigIntStats = require('../lib/patchBigIntStats');
var verifyStats = require('../lib/verifyStats');

var kNsPerMsBigInt = JSBI.BigInt(Math.pow(10, 6));

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
        var smallStats = fs.statSync(path.join(DIR, names[index]));
        var testBigStats = new BigIntStats(smallStats);
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

      fs.readdir(DIR, function (err, names) {
        assert.ok(!err);

        for (var index in names) {
          var bigStats = fs.lstatSync(path.join(DIR, names[index]), { bigint: true });

          bigStats = patchBigIntStats(bigStats);

          var smallStats = new fs.Stats(
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
            Number(JSBI.divide(bigStats.atimeNs, kNsPerMsBigInt)),
            Number(JSBI.divide(bigStats.mtimeNs, kNsPerMsBigInt)),
            Number(JSBI.divide(bigStats.ctimeNs, kNsPerMsBigInt)),
            Number(JSBI.divide(bigStats.birthtimeNs, kNsPerMsBigInt))
          );
          var testBigStats = new BigIntStats(
            bigStats.dev,
            bigStats.mode,
            bigStats.nlink,
            bigStats.uid,
            bigStats.gid,
            bigStats.rdev,
            bigStats.blksize,
            bigStats.ino,
            bigStats.size,
            bigStats.blocks,
            bigStats.atimeNs,
            bigStats.mtimeNs,
            bigStats.ctimeNs,
            bigStats.birthtimeNs
          );

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

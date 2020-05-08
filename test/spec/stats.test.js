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
    it('should initialize from with bigInt option', function (done) {
      var spys = statsSpys();

      fs.readdir(DIR, { bigint: true }, function (err, names) {
        assert.ok(!err);

        for (var index in names) {
          var bigStats = normalizeStats(fs.lstatSync(path.join(DIR, names[index]), { bigint: true }));
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
          // eslint-disable-next-line no-prototype-builtins
          if (!bigStats.hasOwnProperty(key)) continue;

          if (endsWith(key, 'Ms')) {
            var nsKey = key.replace('Ms', 'Ns');
            if (!bigStats[nsKey]) continue; // in Node 10, Ms had the big ints then they were moved to Ns
          }

          if (isDate(bigStats[key])) {
            var time = bigStats[key].getTime();
            var time2 = bigStats[key].getTime();
            assert(
              time - time2 <= ALLOWABLE_DELTA,
              'difference of ' + key + '.getTime() should <= ' + ALLOWABLE_DELTA + '.\n' + 'Number version ' + time + ', BigInt version ' + time2 + 'n'
            );
          } else {
            assert.strictEqual(bigStats[key], bigStats[key], key);
          }
        }

        done();
      });
    });
});

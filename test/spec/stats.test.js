var assert = require('assert');
var generate = require('fs-generate');
var rimraf = require('rimraf');
var path = require('path');
var fs = require('fs');
var statsSpys = require('fs-stats-spys');

var BigIntStats = require('../..');
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
        const numStats = fs.lstatSync(path.join(DIR, names[index]));
        const bigintStats = new BigIntStats(numStats);
        verifyStats(bigintStats, numStats, 1000);
        spys(numStats);
        spys(bigintStats);
      }

      assert.equal(spys.callCount, 12);
      assert.equal(spys.dir.callCount, 6);
      assert.equal(spys.file.callCount, 4);
      assert.equal(spys.link.callCount, 2);
      done();
    });
  });
});

import '../lib/polyfills.ts';

import assert from 'assert';
import { toBigIntStats, toStats } from 'big-int-stats';
import fs from 'fs';
import generate from 'fs-generate';
import statsSpys from 'fs-stats-spys';
import isDate from 'lodash.isdate';
import normalizeStats from 'normalize-stats';
import path from 'path';
import rimraf2 from 'rimraf2';
import url from 'url';
import verifyStats from '../lib/verifyStats.ts';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
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
    rimraf2(TEST_DIR, { disableGlob: true }, done);
  });
  beforeEach((done) => {
    rimraf2(TEST_DIR, { disableGlob: true }, () => {
      generate(TEST_DIR, STRUCTURE, (): undefined => {
        done();
      });
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

  type ReadDirOptions = {
    encoding: 'buffer';
    withFileTypes: true;
    recursive?: boolean | undefined;
  };

  typeof BigInt === 'undefined' ||
    it('should initialize from with bigInt option', (done) => {
      var spys = statsSpys();

      fs.readdir(TEST_DIR, { bigint: true } as unknown as ReadDirOptions, (err: NodeJS.ErrnoException | null, files: fs.Dirent<Buffer>[]) => {
        assert.ok(!err);

        const names = files as unknown as string[];
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
          // biome-ignore lint/suspicious/noPrototypeBuiltins: hasOwnProperty
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

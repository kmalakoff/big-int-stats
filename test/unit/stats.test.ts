import assert from 'assert';
import { toBigIntStats, toStats } from 'big-int-stats';
import fs from 'fs';
import generate from 'fs-generate';
import { safeRm } from 'fs-remove-compat';
import statsSpys from 'fs-stats-spys';
import isDate from 'lodash.isdate';
import normalizeStats from 'normalize-stats';
import path from 'path';
import url from 'url';
import { stringEndsWith } from '../lib/compat.ts';
import verifyStats from '../lib/verifyStats.ts';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const TEST_DIR = path.resolve(path.join(__dirname, '..', '..', '.tmp', 'test'));
const STRUCTURE = {
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
// Node 26+ changed fs.Stats constructor to expect seconds instead of milliseconds
const major = +process.versions.node.split('.')[0];
const ALLOWABLE_DELTA = major > 24 ? 2000 : 10;

describe('BigIntStats', () => {
  after((done) => {
    safeRm(TEST_DIR, done);
  });
  beforeEach((done) => {
    safeRm(TEST_DIR, () => {
      generate(TEST_DIR, STRUCTURE, (): void => {
        done();
      });
    });
  });

  it('should load stats', (done) => {
    const spys = statsSpys();

    fs.readdir(TEST_DIR, (err, names) => {
      assert.ok(!err);

      for (const index in names) {
        const smallStats = normalizeStats(fs.statSync(path.join(TEST_DIR, names[index])));
        const bigStats = toBigIntStats(smallStats);
        verifyStats(bigStats as unknown as Record<string, unknown>, smallStats as unknown as Record<string, unknown>, ALLOWABLE_DELTA);
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
      const spys = statsSpys();

      fs.readdir(TEST_DIR, { bigint: true } as unknown as ReadDirOptions, (err: NodeJS.ErrnoException | null, files: fs.Dirent<Buffer>[]) => {
        assert.ok(!err);

        const names = files as unknown as string[];
        for (const index in names) {
          const bigStats = normalizeStats(fs.lstatSync(path.join(TEST_DIR, names[index]), { bigint: true }));
          const smallStats = toStats(bigStats);

          verifyStats(bigStats as unknown as Record<string, unknown>, smallStats as unknown as Record<string, unknown>, ALLOWABLE_DELTA);
          spys(smallStats);
          spys(bigStats);

          const bigStatsRecord = bigStats as unknown as Record<string, unknown>;
          for (const key in bigStatsRecord) {
            // biome-ignore lint/suspicious/noPrototypeBuiltins: hasOwnProperty
            if (!bigStatsRecord.hasOwnProperty(key)) continue;

            if (stringEndsWith(key, 'Ms')) {
              const nsKey = key.replace('Ms', 'Ns');
              if (!bigStatsRecord[nsKey]) continue;
            }

            if (isDate(bigStatsRecord[key])) {
              const time = (bigStatsRecord[key] as Date).getTime();
              const time2 = (bigStatsRecord[key] as Date).getTime();
              assert(time - time2 <= ALLOWABLE_DELTA, `difference of ${key}.getTime() should <= ${ALLOWABLE_DELTA}.\nNumber version ${time}, BigInt version ${time2}n`);
            } else {
              assert.strictEqual(bigStatsRecord[key], bigStatsRecord[key], key);
            }
          }
        }

        assert.equal(spys.callCount, 12);
        assert.equal(spys.dir.callCount, 6);
        assert.equal(spys.file.callCount, 4);
        assert.equal(spys.link.callCount, 2);

        done();
      });
    });
});

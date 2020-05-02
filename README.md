## big-int-stats

Create BigIntStats from fs.Stats for compatiblity on earlier versions of Node.js.

```
var assert = require('assert');
var BigIntStats = require('big-int-stats');
var fs = require('fs');

var smallStats = fs.statSync(__dirname);
var testBigStats1 = new BigIntStats(smallStats);

var bigStats = fs.lstatSync(__dirname, { bigint: true });
var testBigStats2 = new BigIntStats(
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

```

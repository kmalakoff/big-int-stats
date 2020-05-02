## big-int-stats

Create BigIntStats from fs.Stats for compatiblity on earlier versions of Node.js.

```
var assert = require('assert');
var BigIntStats = require('big-int-stats');
var fs = require('fs');
var each = require('async-each');

function create(root, name, callback) {
  return fs.lstat(path.join(root, name), function (err, stats) {
    err ? callback(err) : callback(null, new BigIntStats(stats));
  });
}

fs.readdir(__dirname, function (err, names) {
  each(names, create.bind(null, DIR), function (err, stats) {
    for (var index in stats) assert.ok(stats[index] instanceof BigIntStats);
  }
}

```

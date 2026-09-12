# big-int-stats

Create BigInt stats from `fs.Stats` for compatibility with earlier Node.js
versions.

```bash
npm install big-int-stats
```

```js
var BigIntStats = require('big-int-stats').BigIntStats;
var fs = require('fs');

var smallStats = fs.statSync(__dirname);
var testBigStats1 = new BigIntStats(smallStats);

console.log(testBigStats1.isDirectory()); // true
```

The package also exports `toBigIntStats` and `toStats` for converting between regular and BigInt stats objects.

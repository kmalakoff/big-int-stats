// var Stats = require('fs').Stats;

// var BigIntStats = require('./BigIntStats');
// var pow = require('./pow');

// var kNsPerSecBigInt = pow(10, 9);
// var kMsPerSec = Math.pow(10, 3);
// var kNsPerMs = Math.pow(10, 6);

// function msFromTimeSpec(sec, nsec) {
//   return sec * kMsPerSec + nsec / kNsPerMs;
// }

// function nsFromTimeSpecBigInt(sec, nsec) {
//   return sec * kNsPerSecBigInt + nsec;
// }

// var TypedArrayPrototype = Object.getPrototypeOf(Uint8Array.prototype);
// var SymbolToStringTag = Symbol.toStringTag;

// // eslint-disable-next-line camelcase
// var TypedArrayProto_toStringTag = Object.getOwnPropertyDescriptor(TypedArrayPrototype, SymbolToStringTag).get;

// function isBigUint64Array(value) {
//   return TypedArrayProto_toStringTag(value) === 'BigUint64Array';
// }

// module.exports = function getStatsFromBinding(stats, offset) {
//   offset = offset || 0;
//   if (isBigUint64Array(stats)) {
//     return new BigIntStats(
//       stats[0 + offset],
//       stats[1 + offset],
//       stats[2 + offset],
//       stats[3 + offset],
//       stats[4 + offset],
//       stats[5 + offset],
//       stats[6 + offset],
//       stats[7 + offset],
//       stats[8 + offset],
//       stats[9 + offset],
//       nsFromTimeSpecBigInt(stats[10 + offset], stats[11 + offset]),
//       nsFromTimeSpecBigInt(stats[12 + offset], stats[13 + offset]),
//       nsFromTimeSpecBigInt(stats[14 + offset], stats[15 + offset]),
//       nsFromTimeSpecBigInt(stats[16 + offset], stats[17 + offset])
//     );
//   }
//   return new Stats(
//     stats[0 + offset],
//     stats[1 + offset],
//     stats[2 + offset],
//     stats[3 + offset],
//     stats[4 + offset],
//     stats[5 + offset],
//     stats[6 + offset],
//     stats[7 + offset],
//     stats[8 + offset],
//     stats[9 + offset],
//     msFromTimeSpec(stats[10 + offset], stats[11 + offset]),
//     msFromTimeSpec(stats[12 + offset], stats[13 + offset]),
//     msFromTimeSpec(stats[14 + offset], stats[15 + offset]),
//     msFromTimeSpec(stats[16 + offset], stats[17 + offset])
//   );
// };

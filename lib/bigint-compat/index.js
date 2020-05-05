module.exports = typeof BigInt === 'undefined' ? require('./big') : require('./bigint');

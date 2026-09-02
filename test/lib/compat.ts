/**
 * Compatibility Layer for Node.js 0.8+
 * Local to this package - contains only needed functions.
 */

/**
 * String.prototype.endsWith polyfill (ES2015)
 * - Uses native endsWith on Node 4+
 * - Falls back to indexOf-based check on Node 0.8-4
 */
export function stringEndsWith(str: string, search: string): boolean {
  if (typeof str.endsWith === 'function') {
    return str.endsWith(search);
  }
  const pos = str.length - search.length;
  return pos >= 0 && str.indexOf(search, pos) === pos;
}

/**
 * Number.isSafeInteger polyfill (ES2015)
 * - Uses native isSafeInteger on Node 0.12+
 * - Falls back to manual check on Node 0.8-0.10
 */
export function numberIsSafeInteger(value: number): boolean {
  if (typeof Number.isSafeInteger === 'function') {
    return Number.isSafeInteger(value);
  }
  return typeof value === 'number' && Number.isFinite(value) && Math.floor(value) === value && value >= -9007199254740991 && value <= 9007199254740991;
}

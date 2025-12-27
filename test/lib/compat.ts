/**
 * Compatibility Layer for Node.js 0.8+
 * Local to this package - contains only needed functions.
 */

/**
 * String.prototype.endsWith polyfill (ES2015)
 * - Uses native endsWith on Node 4+
 * - Falls back to indexOf-based check on Node 0.8-4
 */
const hasEndsWith = typeof String.prototype.endsWith === 'function';
export function stringEndsWith(str: string, search: string, position?: number): boolean {
  if (hasEndsWith) return str.endsWith(search, position);
  const len = position === undefined ? str.length : position;
  return str.lastIndexOf(search) === len - search.length;
}

/**
 * Number.isSafeInteger polyfill (ES2015)
 * - Uses native isSafeInteger on Node 0.12+
 * - Falls back to manual check on Node 0.8-0.10
 */
const hasIsSafeInteger = typeof Number.isSafeInteger === 'function';
export function numberIsSafeInteger(value: number): boolean {
  if (hasIsSafeInteger) return Number.isSafeInteger(value);
  return typeof value === 'number' && Number.isFinite(value) && Math.floor(value) === value && value >= -9007199254740991 && value <= 9007199254740991;
}

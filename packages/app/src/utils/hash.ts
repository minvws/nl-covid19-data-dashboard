/**
 * Creates a hash for the given data string or buffer. An optional seed can be
 * given as well. Note that these hashes are mainly meant to generate unique
 * keys for the given data (for caching or indentification). Should not be used
 * for any security-related logic.
 *
 * Custom algorithm based on https://stackoverflow.com/a/52171480, which doesn't
 * need any heavy crypto library or API.
 */
export function hash(data: string | Buffer, seed = 0) {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  const isString = typeof data === 'string';
  for (let i = 0, ch; i < data.length; i++) {
    ch = isString ? data.charCodeAt(i) : data[i];
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

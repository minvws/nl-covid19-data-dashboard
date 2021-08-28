import crypto from 'crypto';

/**
 * Creates an md5 ash for the given string
 */
export function hash(input: string) {
  return crypto.createHash('md5').update(input).digest('hex');
}

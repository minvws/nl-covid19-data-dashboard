import crypto from 'crypto';

export function hash(input: string) {
  return crypto.createHash('md5').update(input).digest('hex');
}

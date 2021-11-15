import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { isAbsoluteUrl } from '../is-absolute-url';

const IsAbsoluteUrl = suite('isAbsoluteUrl');

IsAbsoluteUrl('returns true for absolute urls', () => {
  const url = 'https://www.rijksoverheid.nl';
  assert.ok(isAbsoluteUrl(url));
});

IsAbsoluteUrl('returns false for relative urls', () => {
  const url = '/vaccinaties';
  assert.not.ok(isAbsoluteUrl(url));
});

IsAbsoluteUrl.run();

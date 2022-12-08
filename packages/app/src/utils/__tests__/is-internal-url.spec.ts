import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { isInternalUrl } from '../is-internal-url';

const IsInternalUrl = suite('isInternalUrl');

IsInternalUrl('returns false for external absolute urls', () => {
  const url = 'https://www.rijksoverheid.nl';
  assert.not.ok(isInternalUrl(url));
});

IsInternalUrl('returns true for relative urls', () => {
  const url = '/vaccinaties';
  assert.ok(isInternalUrl(url));
});

IsInternalUrl('returns true for Corona Dashboard absolute urls', () => {
  const url = 'https://coronadashboard.rijksoverheid.nl/landelijk/vaccinaties';
  assert.ok(isInternalUrl(url));
});

IsInternalUrl('returns true for Corona Dashboard anchor links', () => {
  const url = '#';
  assert.ok(isInternalUrl(url));
});
IsInternalUrl.run();

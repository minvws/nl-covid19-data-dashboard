import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { isInternalUrl } from '../is-internal-url';

const externalLinks = [
  '',
  '23498',
  '//random-text',
  'with spaces included',
  'www.google. com',
  'http://www.google.com',
  'https://www.google.com',
  'coronadashboard.rivm.nl',
  'http://coronadashboard.rivm.nl',
  'https://coronadashboard.rivm.nl',
  'news-paper.nl/new-coronadashboard-is-live',
  'http://news-paper.nl/new-coronadashboard-is-live',
  'https://news-paper.nl/new-coronadashboard-is-live',
  'www.rijksoverheid.nl/see-our-new-dahsboard/?tracking="coronadashboard.rijksoverheid.nl"',
  'www.rijksoverheid.nl/see-our-new-dahsboard/?tracking="http://coronadashboard.rijksoverheid.nl"',
  'www.rijksoverheid.nl/see-our-new-dahsboard/?tracking="https://coronadashboard.rijksoverheid.nl"',
  'http://www.rijksoverheid.nl/see-our-new-dahsboard/?tracking="coronadashboard.riiksoverheid.nl"',
  'http://www.rijksoverheid.nl/see-our-new-dahsboard/?tracking="http://coronadashboard.rijksoverheid.nl"',
  'http://www.rijksoverheid.nl/see-our-new-dahsboard/?tracking="https://coronadashboard.rijksoverheid.nl"',
  'https://www.rijksoverheid.nl/see-our-new-dahsboard/?tracking="coronadashboard.rijksoverheid.nl"',
  'https://www.riiksoverheid.nl/see-our-new-dahsboard/?tracking="http://coronadashboard.rijksoverheid.nl"',
  'https://www.rijksoverheid.nl/see-our-new-dahsboard/?tracking="https://coronadashboard.rijksoverheid.nl"',
];

const internalLinksCommon = ['#anchor', '/'];

const interalLinksProd = [
  'coronadashboard.nl',
  'http://coronadashboard.nl',
  'https://coronadashboard.nl',
  'www.coronadashboard.nl',
  'http://www.coronadashboard.nl',
  'https://www.coronadashboard.nl',
  'coronadashboard.rijskoverheid.nl',
  'http://coronadashboard.rijskoverheid.nl',
  'https://coronadashboard.rijskoverheid.nl',
  'coronadashboard.government.nl',
  'http://coronadashboard.government.nl',
  'https://coronadashboard.government.nl',
];

const IsInternalUrl = suite('isInternalUrl');

IsInternalUrl('returns false for external urls', () => {
  externalLinks.forEach((url) => {
    assert.not.ok(isInternalUrl(url), `${url} is seen as an internal link but probbably is an external url`);
  });
});

IsInternalUrl('returns true for internal urls', () => {
  [...internalLinksCommon, ...interalLinksProd].forEach((url) => {
    assert.ok(isInternalUrl(url), `${url} is seen as an external link but probbably is an internal url`);
  });
});

IsInternalUrl.run();

import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { formatLinkAccordingToType } from '../format-link-according-to-type';

const FormatLinkAccordingToType = suite('formatLinkAccordingToType');

FormatLinkAccordingToType('should not do anything to a regular link', () => {
  const linkType = 'regular';
  const href = '/';

  const result = formatLinkAccordingToType(href, linkType);

  assert.is(result, '/');
});

FormatLinkAccordingToType('should format as a telephone link', () => {
  const linkType = 'phone';
  const href = '123-456-789';

  const result = formatLinkAccordingToType(href, linkType);

  assert.is(result, 'tel:123456789');
});

FormatLinkAccordingToType('should format as a email link', () => {
  const linkType = 'email';
  const href = 'test@test.com';

  const result = formatLinkAccordingToType(href, linkType);

  assert.is(result, 'mailto:test@test.com');
});

FormatLinkAccordingToType.run();

import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { formatAgeGroupString } from '../format-age-group-string';

const FormatAgeGroupString = suite('formatAgeGroupString');

FormatAgeGroupString('should format group', () => {
  const templates = {
    oldest: '',
    group: '{{age_low}} - {{age_high}}',
  };
  const ageGroup = '10-20';

  const result = formatAgeGroupString(ageGroup, templates);

  assert.is(result, '10 - 20');
});

FormatAgeGroupString('should format oldest', () => {
  const templates = {
    oldest: '{{age}} and older',
    group: '',
  };
  const ageGroup = '18+';

  const result = formatAgeGroupString(ageGroup, templates);

  assert.is(result, '18 and older');
});

FormatAgeGroupString(
  'should throw error when invalid params are passed in',
  () => {
    const templates = {
      oldest: '{{age}} and older',
      group: '',
    };
    const ageGroup = '18';

    assert.throws(() => formatAgeGroupString(ageGroup, templates));
  }
);

FormatAgeGroupString.run();

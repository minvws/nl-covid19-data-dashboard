import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { formatBirthyearRangeString } from '../format-birthyear-range-string';

const FormatBirthyearRangeString = suite('formatBirthyearRangeString');

FormatBirthyearRangeString('Should format birthyear with earlier range', () => {
  const birthyearRange = '-2003';
  const templates = {
    earlier: 'until {{birthyear}}',
    later: '',
    range: '',
  };

  const result = formatBirthyearRangeString(birthyearRange, templates);

  assert.is(result, 'until 2003');
});

FormatBirthyearRangeString('Should format birthyear with later range', () => {
  const birthyearRange = '2003-';
  const templates = {
    earlier: '',
    later: '{{birthyear}} and later',
    range: '',
  };

  const result = formatBirthyearRangeString(birthyearRange, templates);

  assert.is(result, '2003 and later');
});

FormatBirthyearRangeString('Should format birthyear with full range', () => {
  const birthyearRange = '2003-2010';
  const templates = {
    earlier: '',
    later: '',
    range: '{{birthyearStart}} until {{birthyearEnd}}',
  };

  const result = formatBirthyearRangeString(birthyearRange, templates);

  assert.is(result, '2003 until 2010');
});

FormatBirthyearRangeString(
  'Should throw error when invalid birthyear range is passed in',
  () => {
    const birthyearRange = '2003';
    const templates = {
      earlier: '',
      later: '',
      range: '',
    };

    assert.throws(() => formatBirthyearRangeString(birthyearRange, templates));
  }
);

FormatBirthyearRangeString.run();

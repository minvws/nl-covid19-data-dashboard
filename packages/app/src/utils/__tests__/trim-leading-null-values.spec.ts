import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { trimLeadingNullValues } from '../trim-leading-null-values';

const TrimLeadingNullValues = suite('trimleadingNullValues');

TrimLeadingNullValues('should trim null values from an array of objects', () => {
  const data = [{ test: null }, { test: null }, { test: 1 }, { test: 2 }];
  assert.is(trimLeadingNullValues(data, 'test').length, 2);
});

TrimLeadingNullValues('should trim null values from an array of values', () => {
  const data = [null, null, 1, 2];
  assert.is(trimLeadingNullValues(data).length, 2);
});

TrimLeadingNullValues.run();

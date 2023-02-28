import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { trimTrailingNullValues } from '../trim-trailing-null-values';

const TrimTrailingNullValues = suite('trimTrailingNullValues');

TrimTrailingNullValues('should trim null values from an array of objects', () => {
  const data = [{ test: 1 }, { test: 2 }, { test: null }, { test: null }];
  assert.is(trimTrailingNullValues(data, 'test').length, 2);
});

TrimTrailingNullValues('should trim null values from an array of values', () => {
  const data = [1, 2, null, null];
  assert.is(trimTrailingNullValues(data).length, 2);
});

TrimTrailingNullValues.run();

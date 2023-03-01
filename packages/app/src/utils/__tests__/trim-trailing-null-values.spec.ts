import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { trimTrailingNullValues } from '../trim-trailing-null-values';

const TrimTrailingNullValues = suite('trimTrailingNullValues');

TrimTrailingNullValues('should trim trailing null values from an array of objects', () => {
  const data = [{ test: 1 }, { test: 2 }, { test: null }, { test: null }];
  assert.is(trimTrailingNullValues(data, 'test').length, 2);
});

TrimTrailingNullValues('should exclusively trim trailing null values from an array of objects, ignoring in-between null values', () => {
  const data = [{ test: 1 }, { test: null }, { test: 2 }, { test: null }];
  assert.is(trimTrailingNullValues(data, 'test').length, 3);
});

TrimTrailingNullValues('should not trim any trailing null values when absent in an array of objects', () => {
  const data = [{ test: 1 }, { test: 2 }];
  assert.is(trimTrailingNullValues(data, 'test').length, 2);
});

TrimTrailingNullValues('should trim trailing null values from an array of values', () => {
  const data = [1, 2, null, null];
  assert.is(trimTrailingNullValues(data).length, 2);
});

TrimTrailingNullValues('should exclusively trim trailing null values from an array of values, ignoring in-between null values', () => {
  const data = [1, null, 2, null];
  assert.is(trimTrailingNullValues(data).length, 3);
});

TrimTrailingNullValues('should not trim any trailing null values when absent in an array of values', () => {
  const data = [1, 2];
  assert.is(trimTrailingNullValues(data).length, 2);
});

TrimTrailingNullValues.run();

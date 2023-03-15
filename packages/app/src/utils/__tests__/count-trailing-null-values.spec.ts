import { countTrailingNullValues } from '../count-trailing-null-values';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

const CountTrailingNullValues = suite('countTrailingNullValues');

CountTrailingNullValues('should count the amount of trailing null values in an array of objects', () => {
  const data = [{ test: 1 }, { test: 2 }, { test: null }, { test: null }];
  assert.is(countTrailingNullValues(data, 'test'), 2);
});

CountTrailingNullValues('should exclusively count the amount of trailing null values in an array of objects, ignoring in-between null values', () => {
  const data = [{ test: 1 }, { test: null }, { test: 2 }, { test: null }];
  assert.is(countTrailingNullValues(data, 'test'), 1);
});

CountTrailingNullValues('should not count any amount of trailing null values when absent in an array of objects', () => {
  const data = [{ test: 1 }, { test: 2 }];
  assert.is(countTrailingNullValues(data, 'test'), 0);
});

CountTrailingNullValues('should count the amount of trailing null values in an array of values', () => {
  const data = [1, 2, null, null];
  assert.is(countTrailingNullValues(data), 2);
});

CountTrailingNullValues('should exclusively count the amount of trailing null values in an array of values, ignoring in-between null values', () => {
  const data = [null, 1, null];
  assert.is(countTrailingNullValues(data), 1);
});

CountTrailingNullValues('should not count any amount of trailing null values when absent in an array of values', () => {
  const data = [1, 2];
  assert.is(countTrailingNullValues(data), 0);
});

CountTrailingNullValues.run();

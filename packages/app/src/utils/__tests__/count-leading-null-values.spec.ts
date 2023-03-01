import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { countLeadingNullValues } from '../count-leading-null-values';

const CountLeadingNullValues = suite('countLeadingNullValues');

CountLeadingNullValues('should count the amount of leading null values in an array of objects', () => {
  const data = [{ test: null }, { test: null }, { test: 1 }, { test: 2 }];
  assert.is(countLeadingNullValues(data, 'test'), 2);
});

CountLeadingNullValues('should exclusively count the amount of leading null values in an array of objects, ignoring in-between null values', () => {
  const data = [{ test: null }, { test: 1 }, { test: null }, { test: 2 }];
  assert.is(countLeadingNullValues(data, 'test'), 1);
});

CountLeadingNullValues('should not count any amount of leading null values when absent in an array of objects', () => {
  const data = [{ test: 1 }, { test: 2 }];
  assert.is(countLeadingNullValues(data, 'test'), 0);
});

CountLeadingNullValues('should count the amount of leading null values in an array of values', () => {
  const data = [null, null, 1, 2];
  assert.is(countLeadingNullValues(data), 2);
});

CountLeadingNullValues('should exclusively count the amount of leading null values in an array of values, ignoring in-between null values', () => {
  const data = [null, 1, null];
  assert.is(countLeadingNullValues(data), 1);
});

CountLeadingNullValues('should not count any amount of leading null values when absent in an array of values', () => {
  const data = [1, 2];
  assert.is(countLeadingNullValues(data), 0);
});

CountLeadingNullValues.run();

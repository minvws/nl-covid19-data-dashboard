import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { trimLeadingNullValues } from '../trim-leading-null-values';

const TrimLeadingNullValues = suite('trimleadingNullValues');

TrimLeadingNullValues('should trim leading null values from an array of objects', () => {
  const data = [{ test: null }, { test: null }, { test: 1 }, { test: 2 }];
  assert.is(trimLeadingNullValues(data, 'test').length, 2);
});

TrimLeadingNullValues('should exclusively trim leading null values from an array of objects, ignoring in-between null values', () => {
  const data = [{ test: null }, { test: 1 }, { test: null }, { test: 2 }];
  assert.is(trimLeadingNullValues(data, 'test').length, 3);
});

TrimLeadingNullValues('should not trim any leading null values when absent in an array of objects', () => {
  const data = [{ test: 1 }, { test: 2 }];
  assert.is(trimLeadingNullValues(data, 'test').length, 2);
});

TrimLeadingNullValues('should trim leading null values from an array of values', () => {
  const data = [null, null, 1, 2];
  assert.is(trimLeadingNullValues(data).length, 2);
});

TrimLeadingNullValues('should exclusively trim leading null values from an array of values, ignoring in-between null values', () => {
  const data = [null, 1, null, 2];
  assert.is(trimLeadingNullValues(data).length, 3);
});

TrimLeadingNullValues('should not trim any leading null values when absent in an array of values', () => {
  const data = [1, 2];
  assert.is(trimLeadingNullValues(data).length, 2);
});

TrimLeadingNullValues.run();

import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { countLeadingNullValues } from '../count-leading-null-values';

const CountLeadingNullValues = suite('countLeadingNullValues');

CountLeadingNullValues('should count the amount of leading null values in an array of values', () => {
  const data = [{ test: null }, { test: null }, { test: 1 }, { test: 2 }];
  assert.is(countLeadingNullValues(data, 'test'), 2);
});

CountLeadingNullValues('should count the amount of leading null values in an array of objects', () => {
  const data = [null, null, 1, 2];
  assert.is(countLeadingNullValues(data), 2);
});

CountLeadingNullValues.run();

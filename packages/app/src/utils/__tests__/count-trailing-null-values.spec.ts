import { countTrailingNullValues } from '../count-trailing-null-values';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

const CountTrailingNullValues = suite('countTrailingNullValues');

CountTrailingNullValues(
  'should count the amount of trailing null values in an array of values',
  () => {
    const data = [{ test: 1 }, { test: 2 }, { test: null }, { test: null }];
    assert.is(countTrailingNullValues(data, 'test'), 2);
  }
);

CountTrailingNullValues(
  'should count the amount of trailing null values in an array of objects',
  () => {
    const data = [1, 2, null, null];
    assert.is(countTrailingNullValues(data), 2);
  }
);

CountTrailingNullValues.run();

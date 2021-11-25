import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { trimNullValues } from '../trim-null-values';

const TrimNullValues = suite('trimNullValues');

TrimNullValues('should trim null values from an array of objects', () => {
  const data = [{ test: 1 }, { test: 2 }, { test: null }, { test: null }];
  assert.is(trimNullValues(data, 'test').length, 2);
});

TrimNullValues('should trim null values from an array of values', () => {
  const data = [1, 2, null, null];
  assert.is(trimNullValues(data).length, 2);
});

TrimNullValues.run();

import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { getMaximumNumberOfDecimals } from '../get-maximum-number-of-decimals';

const GetMaximumNumberOfDecimals = suite('getMaximumNumberOfDecimals');

GetMaximumNumberOfDecimals('', () => {
  const testValues = [1.21, 1.5, 2, 3.234];
  const result = getMaximumNumberOfDecimals(testValues);
  assert.is(result, 3);
});

GetMaximumNumberOfDecimals.run();

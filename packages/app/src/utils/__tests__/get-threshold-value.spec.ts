import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { getThresholdValue } from '../get-threshold-value';

const GetThresholdValue = suite('getThresholdValue');

GetThresholdValue('should retrieve the threshold for n', () => {
  const n = 20;

  const thresholds = [
    { threshold: 10, color: 'blue' },
    { threshold: 20, color: 'blue' },
    { threshold: 30, color: 'blue' },
    { threshold: 40, color: 'blue' },
    { threshold: 50, color: 'blue' },
  ];

  const result = getThresholdValue(thresholds, n);

  assert.is(result, thresholds[1]);
});

GetThresholdValue.run();

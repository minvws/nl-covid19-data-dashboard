import { suite } from 'uvu';
import { cutValuesFromTimeframe } from '../cut-values-from-timeframe';
import * as assert from 'uvu/assert';

const CutValuesFromTimeframe = suite('cutValuesFromTimeframe');

CutValuesFromTimeframe(
  'should cut values from an array of values according to the given timeframe',
  () => {
    const arr = Array.from({ length: 100 }, (_, i) => i);

    assert.equal(cutValuesFromTimeframe(arr, 'all').length, arr.length);

    assert.equal(
      cutValuesFromTimeframe(arr, '5weeks').length,
      arr.length - (arr.length - 5 * 7)
    );
  }
);

CutValuesFromTimeframe.run();

import { suite } from 'uvu';
import { cutValuesFromTimeframe } from '../cut-values-from-timeframe';
import * as assert from 'uvu/assert';
import { TimeframeOption } from '@corona-dashboard/common';

const CutValuesFromTimeframe = suite('cutValuesFromTimeframe');

CutValuesFromTimeframe(
  'should cut values from an array of values according to the given timeframe',
  () => {
    const arr = Array.from({ length: 100 }, (_, i) => i);

    assert.equal(
      cutValuesFromTimeframe(arr, TimeframeOption.ALL).length,
      arr.length
    );

    assert.equal(
      cutValuesFromTimeframe(arr, TimeframeOption.FIVE_WEEKS).length,
      arr.length - (arr.length - 5 * 7)
    );
  }
);

CutValuesFromTimeframe.run();

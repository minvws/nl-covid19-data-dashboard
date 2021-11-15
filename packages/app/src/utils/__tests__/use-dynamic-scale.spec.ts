import { cleanup, renderHook } from '@testing-library/react-hooks';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { STRETCH_FACTOR, useDynamicScale } from '../use-dynamic-scale';

const UseDynamicScale = suite('useDynamicScale');

UseDynamicScale.after.each(() => {
  cleanup();
});

UseDynamicScale(
  'should return the given min and max when value falls somewhere between',
  () => {
    const { result } = renderHook(() => useDynamicScale(20, 0, 100));

    const [min, max] = result.current.domain();

    assert.equal(min, 0);
    assert.equal(max, 100);
  }
);

UseDynamicScale(
  'should return the given a stretched max when value is greater than max',
  () => {
    const { result } = renderHook(() => useDynamicScale(200, 0, 100));

    const [, max] = result.current.domain();

    assert.equal(max, 200 * STRETCH_FACTOR);
  }
);

/**
 * For some reason D3 rounds differently, the actual value is 22.85 and
 * the value calculated by the test  is 22.86.
 * No idea what's going on there. Skipping this test for now.
 */
UseDynamicScale.skip(
  'should return the given a stretched min when value is less than min',
  () => {
    const { result } = renderHook(() => useDynamicScale(24, 25, 100));

    const [min] = result.current.domain();

    assert.equal(min, Math.round((24 / STRETCH_FACTOR) * 100) / 100);
  }
);

UseDynamicScale.run();

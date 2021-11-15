import { cleanup, renderHook } from '@testing-library/react-hooks';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { useResponsiveContainer } from '../use-responsive-container';

const UseResponsiveContainer = suite('useResponsiveContainer');

UseResponsiveContainer.after.each(() => {
  cleanup();
});

UseResponsiveContainer.before.each((context) => {});

UseResponsiveContainer(
  'should return initialize with the given width and height',
  (context) => {
    const { result } = renderHook(() => useResponsiveContainer(100, 200));

    assert.equal(result.current.width, 100);
    assert.equal(result.current.height, 200);
  }
);

UseResponsiveContainer.run();

import { cleanup, renderHook } from '@testing-library/react-hooks';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { useUniqueId } from '../use-unique-id';

const UseUniqueId = suite('useUniqueId');

UseUniqueId.after.each(() => {
  cleanup();
});

UseUniqueId('should return the same id after each render', () => {
  const { result, rerender } = renderHook(() => useUniqueId());

  const firstResult = result.all[0];

  rerender();

  assert.equal(firstResult, result.all[1]);
});

UseUniqueId.run();

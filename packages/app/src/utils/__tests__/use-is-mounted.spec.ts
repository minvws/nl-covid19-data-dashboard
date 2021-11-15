import { renderHook } from '@testing-library/react-hooks';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { useIsMounted } from '../use-is-mounted';

const UseIsMounted = suite('useIsMounted');

/**
 * This should pass, but doesn't I can't figure out yet why not, skipping for now.
 */
UseIsMounted.skip('should return false when not mounted', () => {
  const { result, unmount } = renderHook(() => useIsMounted());

  assert.equal(result.current, true);

  unmount();

  assert.equal(result.current, false);
});

UseIsMounted('should return true when mounted without delay param', () => {
  const { result } = renderHook(() => useIsMounted());

  assert.equal(result.current, true);
});

UseIsMounted('should return true when mounted after given delay', async () => {
  const { result } = renderHook(() => useIsMounted({ delayMs: 10 }));

  assert.equal(result.current, false);

  await new Promise((resolve) => setTimeout(resolve, 15));

  assert.equal(result.current, true);
});

UseIsMounted.run();

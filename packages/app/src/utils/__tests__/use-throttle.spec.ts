import { cleanup, renderHook } from '@testing-library/react-hooks';
import injectJsDom from 'jsdom-global';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { useThrottle } from '../use-throttle';

const UseThrottle = suite('useThrottle');

UseThrottle.before((context) => {
  context.cleanupJsDom = injectJsDom();
});

UseThrottle.after((context) => {
  context.cleanupJsDom();
});

UseThrottle.after.each(() => {
  cleanup();
  sinon.restore();
});

UseThrottle.before.each((context) => {
  context.timeOutSpy = sinon.spy(window, 'setTimeout');
  context.clearSpy = sinon.spy(window, 'clearTimeout');
});

UseThrottle('should return intial value and add timeout handler', (context) => {
  const { result } = renderHook(() => useThrottle('test', 100));

  const firstResult = result.all[0];

  assert.equal(firstResult, 'test');
  sinon.assert.calledOnce(context.timeOutSpy);
});

UseThrottle('should clear timeout on unmount', (context) => {
  const { unmount } = renderHook(() => useThrottle('test', 100));

  unmount();

  sinon.assert.calledOnce(context.clearSpy);
});

UseThrottle('should not set new value immediately', async () => {
  const { rerender, result, waitForNextUpdate } = renderHook(
    ([newValue, newDelay]: [string, number]) => useThrottle(newValue, newDelay),
    {
      initialProps: ['test', 100],
    }
  );

  const firstResult = result.all[0];

  const promise = waitForNextUpdate().then(() => {
    const secondResult = result.all[1];
    assert.equal(secondResult, 'test');
  });

  assert.equal(firstResult, 'test');

  rerender(['test2', 100]);

  return promise;
});

UseThrottle.run();

import { cleanup, renderHook } from '@testing-library/react-hooks';
import injectJsDom from 'jsdom-global';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { useViewport } from '../use-viewport';

const UseViewport = suite('useViewport');

UseViewport.before((context) => {
  context.cleanupJsDom = injectJsDom();
});

UseViewport.after((context) => {
  context.cleanupJsDom();
});

UseViewport.before.each(() => {
  sinon.spy(window, 'addEventListener');
  sinon.spy(window, 'removeEventListener');
});

UseViewport.after.each(() => {
  cleanup();
  sinon.restore();
});

UseViewport('should initialize with zero width and height', () => {
  const { result } = renderHook(() => useViewport());

  const addListenerArgs = (window.addEventListener as any).getCall(0).args;

  assert.equal(addListenerArgs[0], 'resize');
  assert.equal(result.all[0], { width: 0, height: 0 });
});

UseViewport('should remove window listener', () => {
  const { unmount } = renderHook(() => useViewport());

  unmount();

  const removeListenerArgs = (window.removeEventListener as any).getCall(
    0
  ).args;

  assert.equal(removeListenerArgs[0], 'resize');
});

UseViewport.run();

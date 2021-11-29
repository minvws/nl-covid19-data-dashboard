import { cleanup, renderHook } from '@testing-library/react-hooks';
import injectJsDom from 'jsdom-global';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { useHotkey } from '../use-hotkey';

const UseHotkey = suite('useHotkey');

UseHotkey.before((context) => {
  context.cleanupJsDom = injectJsDom();
});

UseHotkey.after((context) => {
  context.cleanupJsDom();
});

UseHotkey.after.each(() => {
  cleanup();
  sinon.restore();
});

UseHotkey.before.each((context) => {
  context.addEventListenerSpy = sinon.spy(document, 'addEventListener');
  context.removeEventListenerSpy = sinon.spy(document, 'removeEventListener');
});

UseHotkey(
  'should call the handler after the specified key was pressed',
  (context) => {
    const testHandler = sinon.spy();
    renderHook(() => useHotkey('a', testHandler));

    const kbEvent = new KeyboardEvent('keydown', {
      code: '123',
      key: 'a',
    });
    document.dispatchEvent(kbEvent);

    assert.equal(context.addEventListenerSpy.callCount, 1);
    assert.equal(context.removeEventListenerSpy.callCount, 0);
    assert.equal(testHandler.callCount, 1);
  }
);

UseHotkey('should clean the document listener after unmount', (context) => {
  const testHandler = sinon.spy();
  const { unmount } = renderHook(() => useHotkey('a', testHandler));

  unmount();

  assert.equal(context.removeEventListenerSpy.callCount, 1);
});

UseHotkey('should not call the key handler after unmount', (context) => {
  const testHandler = sinon.spy();
  const { unmount } = renderHook(() => useHotkey('a', testHandler));

  unmount();

  const kbEvent = new KeyboardEvent('keydown', {
    code: '123',
    key: 'a',
  });
  document.dispatchEvent(kbEvent);

  assert.equal(testHandler.callCount, 0);
});

UseHotkey.run();

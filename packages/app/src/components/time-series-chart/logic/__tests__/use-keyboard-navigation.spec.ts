import { act, cleanup, renderHook } from '@testing-library/react-hooks';
import injectJsDom from 'jsdom-global';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { useKeyboardNavigation } from '../use-keyboard-navigation';

const UseKeyboardNavigation = suite('useKeyboardNavigation');

UseKeyboardNavigation.before((context) => {
  context.cleanupJsDom = injectJsDom();
});

UseKeyboardNavigation.before.each((context) => {
  context.addEventListenerSpy = sinon.spy(document, 'addEventListener');
});

UseKeyboardNavigation.after((context) => {
  context.cleanupJsDom();
});

UseKeyboardNavigation.after.each(() => {
  cleanup();
  sinon.restore();
});

UseKeyboardNavigation('should move the index with 1', () => {
  const currentIndex = 0;
  let newIndex = 0;

  const spy = sinon.stub().callsFake((x) => {
    newIndex = x(currentIndex);
  });

  const dummyHandlerHandler = sinon.spy();

  const { result } = renderHook(() =>
    useKeyboardNavigation(spy, 10, dummyHandlerHandler)
  );

  act(() => {
    result.current.enable();
  });

  act(() => {
    const kbEvent = new KeyboardEvent('keydown', {
      code: '39',
      key: 'ArrowRight',
    });

    document.dispatchEvent(kbEvent);
  });

  assert.is(newIndex, 1);
});

UseKeyboardNavigation('should disable the keyboard navigation', () => {
  const spy = sinon.spy();
  const dummyHandlerHandler = sinon.spy();

  const { result } = renderHook(() =>
    useKeyboardNavigation(dummyHandlerHandler, 10, spy)
  );

  act(() => {
    result.current.enable();
  });

  act(() => {
    const kbEvent = new KeyboardEvent('keydown', {
      code: '27',
      key: 'Escape',
    });

    document.dispatchEvent(kbEvent);
  });

  assert.is(spy.firstCall.args[0], false);
});

UseKeyboardNavigation.run();

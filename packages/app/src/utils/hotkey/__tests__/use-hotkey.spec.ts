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

    assert.is(context.addEventListenerSpy.callCount, 1);
    assert.is(context.removeEventListenerSpy.callCount, 0);
    assert.is(testHandler.callCount, 1);
  }
);

UseHotkey('should clean the document listener after unmount', (context) => {
  const testHandler = sinon.spy();
  const { unmount } = renderHook(() => useHotkey('a', testHandler));

  unmount();

  assert.is(context.removeEventListenerSpy.callCount, 1);
});

UseHotkey('should not call the key handler after unmount', () => {
  const testHandler = sinon.spy();
  const { unmount } = renderHook(() => useHotkey('a', testHandler));

  unmount();

  const kbEvent = new KeyboardEvent('keydown', {
    code: '123',
    key: 'a',
  });
  document.dispatchEvent(kbEvent);

  assert.is(testHandler.callCount, 0);
});

UseHotkey('should call twice when allowRepeat is true', () => {
  const testHandler = sinon.spy();
  renderHook(() => useHotkey('a', testHandler, { allowRepeat: true }));

  const kbEvent1 = new KeyboardEvent('keydown', {
    code: '123',
    key: 'a',
  });
  document.dispatchEvent(kbEvent1);

  const kbEvent2 = new KeyboardEvent('keydown', {
    code: '123',
    key: 'a',
    repeat: true,
  });
  document.dispatchEvent(kbEvent2);

  assert.is(testHandler.callCount, 2);
});

UseHotkey('should not call twice when allowRepeat is false', () => {
  const testHandler = sinon.spy();
  renderHook(() => useHotkey('a', testHandler, { allowRepeat: false }));

  const kbEvent1 = new KeyboardEvent('keydown', {
    code: '123',
    key: 'a',
  });
  document.dispatchEvent(kbEvent1);

  const kbEvent2 = new KeyboardEvent('keydown', {
    code: '123',
    key: 'a',
    repeat: true,
  });
  document.dispatchEvent(kbEvent2);

  assert.is(testHandler.callCount, 1);
});

UseHotkey('should not be called when disabled', () => {
  const testHandler = sinon.spy();
  renderHook(() => useHotkey('a', testHandler, { isDisabled: true }));

  const kbEvent1 = new KeyboardEvent('keydown', {
    code: '123',
    key: 'a',
  });
  document.dispatchEvent(kbEvent1);

  assert.is(testHandler.callCount, 0);
});

UseHotkey('should prevent default when preventDefault is true', () => {
  const testHandler = sinon.spy();
  renderHook(() => useHotkey('a', testHandler, { preventDefault: true }));

  const kbEvent1 = new KeyboardEvent('keydown', {
    code: '123',
    key: 'a',
  });
  sinon.spy(kbEvent1, 'preventDefault');
  document.dispatchEvent(kbEvent1);

  assert.is((kbEvent1.preventDefault as sinon.SinonSpy).callCount, 1);
});

UseHotkey('should not prevent default when preventDefault is false', () => {
  const testHandler = sinon.spy();
  renderHook(() => useHotkey('a', testHandler, { preventDefault: false }));

  const kbEvent1 = new KeyboardEvent('keydown', {
    code: '123',
    key: 'a',
  });
  sinon.spy(kbEvent1, 'preventDefault');
  document.dispatchEvent(kbEvent1);

  assert.is((kbEvent1.preventDefault as sinon.SinonSpy).callCount, 0);
});

UseHotkey(
  'should not be called when disableTextInputs is true and document active element is textarea',
  () => {
    document.body.innerHTML = `
    <div>
        <textarea id="ta">test</textarea>
    </div>
`;

    const testHandler = sinon.spy();
    renderHook(() => useHotkey('a', testHandler, { disableTextInputs: true }));

    const mockArea = document.getElementById('ta');
    mockArea?.focus();

    const kbEvent1 = new KeyboardEvent('keydown', {
      code: '123',
      key: 'a',
    });
    document.dispatchEvent(kbEvent1);

    assert.is(testHandler.callCount, 0);
  }
);

UseHotkey(
  'should be called when disableTextInputs is false and document active element is textarea',
  () => {
    document.body.innerHTML = `
    <div>
        <textarea id="ta">test</textarea>
    </div>
`;

    const testHandler = sinon.spy();
    renderHook(() => useHotkey('a', testHandler, { disableTextInputs: false }));

    const mockArea = document.getElementById('ta');
    mockArea?.focus();

    const kbEvent1 = new KeyboardEvent('keydown', {
      code: '123',
      key: 'a',
    });
    document.dispatchEvent(kbEvent1);

    assert.is(testHandler.callCount, 1);
  }
);

UseHotkey.run();

import { cleanup, renderHook } from '@testing-library/react-hooks';
import injectJsDom from 'jsdom-global';
import { RefObject } from 'react';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { useOnClickOutside } from '../use-on-click-outside';

const UseOnClickOutside = suite('useOnClickOutside');

UseOnClickOutside.before((context) => {
  context.cleanupJsDom = injectJsDom();
});

UseOnClickOutside.after((context) => {
  context.cleanupJsDom();
});

UseOnClickOutside.after.each(() => {
  cleanup();
  sinon.restore();
});

UseOnClickOutside.before.each((context) => {
  context.addEventListenerSpy = sinon.spy(document, 'addEventListener');
  context.removeEventListener = sinon.spy(document, 'removeEventListener');
});

UseOnClickOutside('should add document listeners on mount', (context) => {
  const mockElement = {
    contains: () => {},
  };

  const mockRef = {
    current: mockElement,
  } as unknown as RefObject<Element>;

  const handler = (_event: MouseEvent | TouchEvent) => {};

  renderHook(() => useOnClickOutside([mockRef], handler));

  assert.equal(context.addEventListenerSpy.callCount, 2);
});

UseOnClickOutside('should remove document listeners on unmount', (context) => {
  const mockElement = {
    contains: () => {},
  };

  const mockRef = {
    current: mockElement,
  } as unknown as RefObject<Element>;

  const handler = (_event: MouseEvent | TouchEvent) => {};

  const { unmount } = renderHook(() => useOnClickOutside([mockRef], handler));

  unmount();

  assert.equal(context.removeEventListener.callCount, 2);
});

UseOnClickOutside(
  'should call handler when click is outside specified element',
  () => {
    const mockElement = {
      contains: () => false,
    };

    const mockRef = {
      current: mockElement,
    } as unknown as RefObject<Element>;

    const handler = sinon.spy();

    renderHook(() => useOnClickOutside([mockRef], handler));

    var event = new Event('mousedown');
    document.dispatchEvent(event);

    assert.equal(handler.callCount, 1);
  }
);

UseOnClickOutside(
  'should call handler when touch is outside specified element',
  () => {
    const mockElement = {
      contains: () => false,
    };

    const mockRef = {
      current: mockElement,
    } as unknown as RefObject<Element>;

    const handler = sinon.spy();

    renderHook(() => useOnClickOutside([mockRef], handler));

    var event = new Event('touchstart');
    document.dispatchEvent(event);

    assert.equal(handler.callCount, 1);
  }
);

UseOnClickOutside(
  'should not call handler when click is inside specified element',
  () => {
    const mockElement = {
      contains: () => true,
    };

    const mockRef = {
      current: mockElement,
    } as unknown as RefObject<Element>;

    const handler = sinon.spy();

    renderHook(() => useOnClickOutside([mockRef], handler));

    var event = new Event('mousedown');
    document.dispatchEvent(event);

    assert.equal(handler.callCount, 0);
  }
);

UseOnClickOutside(
  'should not call handler when touch is inside specified element',
  () => {
    const mockElement = {
      contains: () => true,
    };

    const mockRef = {
      current: mockElement,
    } as unknown as RefObject<Element>;

    const handler = sinon.spy();

    renderHook(() => useOnClickOutside([mockRef], handler));

    var event = new Event('touchstart');
    document.dispatchEvent(event);

    assert.equal(handler.callCount, 0);
  }
);

UseOnClickOutside.run();

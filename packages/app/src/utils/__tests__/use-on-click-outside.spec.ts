import { cleanup, renderHook } from '@testing-library/react-hooks';
import injectJsDom from 'jsdom-global';
import { RefObject } from 'react';
import * as sinon from 'sinon';
import { suite } from 'uvu';
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
  context.removeEventListenerSpy = sinon.spy(document, 'removeEventListener');
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

  sinon.assert.calledTwice(context.addEventListenerSpy);
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

  sinon.assert.calledTwice(context.removeEventListenerSpy);
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

    sinon.assert.calledOnce(handler);
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

    sinon.assert.calledOnce(handler);
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

    sinon.assert.notCalled(handler);
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

    sinon.assert.notCalled(handler);
  }
);

UseOnClickOutside.run();

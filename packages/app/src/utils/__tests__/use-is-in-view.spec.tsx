import { cleanup, render } from '@testing-library/react';
import injectJsDom from 'jsdom-global';
import { useRef } from 'react';
import * as sinon from 'sinon';
import { Context, suite, uvu } from 'uvu';
import * as assert from 'uvu/assert';
import { useViewState } from '../use-view-state';

const UseIsInView = suite('useIsInView');

UseIsInView.before((context) => {
  context.cleanupJsDom = injectJsDom();
});

UseIsInView.after((context) => {
  context.cleanupJsDom();
});

UseIsInView.before.each((context) => {
  cleanup();

  class IntersectionObserverStub {
    constructor(
      callback: IntersectionObserverCallback,
      options?: IntersectionObserverInit
    ) {
      context.callback = callback;
      context.options = options;
      context.observe = this.observe;
      context.unobserve = this.unobserve;
    }

    root = document.documentElement;
    rootMargin = '';
    thresholds = [0];

    disconnect = () => null;
    observe = sinon.spy();
    unobserve = sinon.spy();
    takeRecords = () => [];
  }

  global.IntersectionObserver = IntersectionObserverStub;
  window.IntersectionObserver = IntersectionObserverStub;
});

UseIsInView.after.each(() => {
  cleanup();
});

function TestComponent({ context }: { context: Context & uvu.Crumbs }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useViewState(ref, '100px');

  context.ref = ref;
  context.isInView = isInView;

  return <div ref={ref}></div>;
}

UseIsInView(
  'should create an intersection observer with a callback and the given rootMargin',
  (context) => {
    render(<TestComponent context={context} />);

    assert.ok(context.callback);

    assert.equal(context.options, { rootMargin: '100px' });
  }
);

UseIsInView('should have a default state of false', (context) => {
  render(<TestComponent context={context} />);

  assert.equal(context.isInView, 'outView');
});

UseIsInView('should observe the given element', (context) => {
  render(<TestComponent context={context} />);

  assert.ok(context.observe.called);
  assert.equal(context.observe.args[0][0], context.ref.current);
});

UseIsInView('should set isInView to the correct value', (context) => {
  render(<TestComponent context={context} />);

  assert.equal(context.isInView, 'outView');

  context.callback([{ isIntersecting: true }]);

  assert.equal(context.isInView, 'inView');

  context.callback([{ isIntersecting: false }]);

  assert.equal(context.isInView, 'outView');
});

UseIsInView('should unobserve the element on unmount', (context) => {
  const { unmount } = render(<TestComponent context={context} />);

  assert.ok(context.unobserve.notCalled);

  const element = context.ref.current;

  unmount();

  assert.ok(context.unobserve.called);
  assert.equal(context.unobserve.args[0][0], element);
});

UseIsInView;

UseIsInView.run();

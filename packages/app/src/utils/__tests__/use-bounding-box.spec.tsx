import { cleanup, fireEvent, render } from '@testing-library/react';
import injectJsDom from 'jsdom-global';
import * as sinon from 'sinon';
import { Context, suite, uvu } from 'uvu';
import * as assert from 'uvu/assert';
import { useBoundingBox } from '../use-bounding-box';

const UseBoundingBox = suite('useBoundingBox');

const refElementId = 'testDiv';

const testBoundingBox = {
  x: 100,
  y: 200,
  bottom: 300,
  height: 400,
  left: 500,
  right: 600,
  top: 700,
  width: 800,
};

function TestCase({ context }: { context: Context & uvu.Crumbs }) {
  const [boundingBox, boundingBoxRef] = useBoundingBox<HTMLDivElement>();
  context.boundingBox = boundingBox;
  return <div id={refElementId} ref={boundingBoxRef}></div>;
}

UseBoundingBox.before((context) => {
  context.cleanupJsDom = injectJsDom();
});

UseBoundingBox.after((context) => {
  context.cleanupJsDom();
});

UseBoundingBox.before.each((context) => {
  context.getBoundingClientRect = sinon.stub(
    window.HTMLElement.prototype,
    'getBoundingClientRect'
  );
  context.getBoundingClientRect.returns(testBoundingBox);
});

UseBoundingBox.after.each((context) => {
  context.getBoundingClientRect.restore();
  cleanup();
});

UseBoundingBox(
  'should give the bounding box of the element when the ref is applied',
  (context) => {
    render(<TestCase context={context} />);

    assert.equal(context.boundingBox, testBoundingBox);
  }
);

UseBoundingBox(
  'should update the bounding box on scroll, throttled',
  async (context) => {
    render(<TestCase context={context} />);

    assert.equal(context.boundingBox, testBoundingBox);

    const updatedBoundingBox = { ...testBoundingBox, x: 1234 };

    context.getBoundingClientRect.returns(updatedBoundingBox);

    fireEvent.scroll(window);

    assert.equal(
      context.boundingBox,
      testBoundingBox,
      'onScroll is not throttled'
    );

    await new Promise((resolve) => setTimeout(resolve, 200));

    assert.equal(context.boundingBox, updatedBoundingBox);
  }
);

UseBoundingBox(
  'should update the bounding box on resize, throttled',
  async (context) => {
    render(<TestCase context={context} />);

    assert.equal(context.boundingBox, testBoundingBox);

    const updatedBoundingBox = { ...testBoundingBox, x: 1234 };

    context.getBoundingClientRect.returns(updatedBoundingBox);

    fireEvent.resize(window);

    assert.equal(
      context.boundingBox,
      testBoundingBox,
      'onResize is not throttled'
    );

    await new Promise((resolve) => setTimeout(resolve, 200));

    assert.equal(context.boundingBox, updatedBoundingBox);
  }
);

UseBoundingBox(
  'should stop listening to scroll & resize events when unmounted',
  async (context) => {
    render(<TestCase context={context} />);

    assert.equal(context.boundingBox, testBoundingBox);

    const updatedBoundingBox = { ...testBoundingBox, x: 1234 };

    context.getBoundingClientRect.returns(updatedBoundingBox);

    cleanup();

    fireEvent.resize(window);
    fireEvent.scroll(window);

    await new Promise((resolve) => setTimeout(resolve, 200));

    // This will probably still work if the listeners are not removed,
    // since it seems like React catches you trying to update state of an
    // unmounted component before calling this function. However, you WILL get
    // warnings in the console from React on which we can act.
    assert.is(
      (context.getBoundingClientRect as sinon.SinonStub).calledOnce,
      true
    );
  }
);

UseBoundingBox.run();

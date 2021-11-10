import { cleanup, renderHook } from '@testing-library/react-hooks';
import injectJsDom from 'jsdom-global';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { useMediaQuery } from '../use-media-query';

const UseMediaQuery = suite('useMediaQuery');

UseMediaQuery.before((context) => {
  context.cleanupJsDom = injectJsDom();
});

UseMediaQuery.after((context) => {
  context.cleanupJsDom();
});

UseMediaQuery.after.each(() => {
  cleanup();
  sinon.restore();
});

UseMediaQuery.before.each((context) => {
  (window as any).matchMedia = () => {};

  context.mockMqList = {
    matches: true,
    addListener: sinon.spy(),
    removeListener: sinon.spy(),
  };

  context.matchMediaSpy = sinon
    .stub(window, 'matchMedia')
    .callsFake(() => context.mockMqList);
});

UseMediaQuery('Should initialize the mediaquerylist', (context) => {
  const breakpoint = 'testBreakpoint';
  renderHook(() => useMediaQuery(breakpoint));

  sinon.assert.calledOnce(context.matchMediaSpy);
  sinon.assert.calledOnce(context.mockMqList.addListener);
});

UseMediaQuery('Should cleanup when unmounting', (context) => {
  const breakpoint = 'testBreakpoint';
  const { unmount } = renderHook(() => useMediaQuery(breakpoint));

  unmount();

  sinon.assert.calledOnce(context.mockMqList.removeListener);
});

UseMediaQuery('Should return the matches value', (context) => {
  const breakpoint = 'testBreakpoint';
  const breakpoint2 = 'testBreakpoint2';
  const { result, rerender } = renderHook((br) => useMediaQuery(br), {
    initialProps: breakpoint,
  });

  assert.equal(result.current, true);

  context.mockMqList.matches = false;

  rerender(breakpoint2);

  assert.equal(result.current, false);
});

UseMediaQuery.run();

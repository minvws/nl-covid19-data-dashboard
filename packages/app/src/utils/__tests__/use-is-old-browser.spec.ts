import { renderHook } from '@testing-library/react-hooks';
import injectJsDom from 'jsdom-global';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { useIsOldBrowser } from '../use-is-old-browser';

const UseIsOldBrowser = suite('useIsOldBrowser');

UseIsOldBrowser.before((context) => {
  context.cleanupJsDom = injectJsDom();
  context.userAgent = '';
  context.oldNavigator = window.navigator;

  delete (window as any).navigator;

  (window as any).navigator = {
    get userAgent() {
      return context.userAgent;
    },
  } as any;
});

UseIsOldBrowser.after((context) => {
  (window as any).navigator = context.oldNavigator;
  context.cleanupJsDom();
});

UseIsOldBrowser('should return false when browser is not old', () => {
  const { result } = renderHook(() => useIsOldBrowser());

  assert.equal(result.current, false);
});

UseIsOldBrowser('should return false when browser is new', (context) => {
  context.userAgent = 'test test Trident test__';
  const { result } = renderHook(() => useIsOldBrowser());

  assert.equal(result.current, true);
});

UseIsOldBrowser.run();

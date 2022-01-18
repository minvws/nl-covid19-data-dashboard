import { renderHook, cleanup } from '@testing-library/react-hooks';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import injectJsDom from 'jsdom-global';
import {
  IsTouchDeviceContextProvider,
  useIsTouchDevice,
} from '../use-is-touch-device';

const UseIsTouchDevice = suite('useIsTouchDevice');

UseIsTouchDevice.before.each((context) => {
  context.cleanupJsDom = injectJsDom();
});

UseIsTouchDevice.after.each(() => {
  cleanup();
});

UseIsTouchDevice.after((context) => {
  sinon.restore();
  context.cleanupJsDom();
});

UseIsTouchDevice('it should return false when there is no touch device', () => {
  const { result } = renderHook(() => useIsTouchDevice(), {
    wrapper: ({ children }) => (
      <IsTouchDeviceContextProvider>{children}</IsTouchDeviceContextProvider>
    ),
  });

  assert.equal(result.current, false);
});

UseIsTouchDevice('it should return true when there is a touch device', () => {
  window.window.ontouchstart = () => {};
  const { result } = renderHook(() => useIsTouchDevice(), {
    wrapper: ({ children }) => (
      <IsTouchDeviceContextProvider>{children}</IsTouchDeviceContextProvider>
    ),
  });

  assert.equal(result.current, true);
});

UseIsTouchDevice.run();

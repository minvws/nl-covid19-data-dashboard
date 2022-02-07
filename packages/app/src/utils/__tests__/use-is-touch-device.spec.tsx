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

UseIsTouchDevice.before((context) => {
  context.cleanupJsDom = injectJsDom();
  context.isTouchDevice = false;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  (window as any).matchMedia = () => {};

  sinon.stub(window, 'matchMedia').callsFake((mq: string) => {
    switch (mq) {
      case '(pointer: coarse)': {
        return {
          matches: context.isTouchDevice,
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          addListener: (_callback: any) => {},
        } as MediaQueryList;
      }
      default:
        return {
          matches: false,
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          addListener: (_callback: any) => {},
        } as MediaQueryList;
    }
  });
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

UseIsTouchDevice(
  'it should return true when there is a touch device',
  (context) => {
    context.isTouchDevice = true;

    const { result } = renderHook(() => useIsTouchDevice(), {
      wrapper: ({ children }) => (
        <IsTouchDeviceContextProvider>{children}</IsTouchDeviceContextProvider>
      ),
    });

    assert.equal(result.current, true);
  }
);

UseIsTouchDevice.run();

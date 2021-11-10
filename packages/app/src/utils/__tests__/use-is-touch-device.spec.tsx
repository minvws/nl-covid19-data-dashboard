import { renderHook } from '@testing-library/react-hooks';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import {
  IsTouchDeviceContextProvider,
  useIsTouchDevice,
} from '../use-is-touch-device';

const UseIsTouchDevice = suite('useIsTouchDevice');

UseIsTouchDevice.before((context) => {
  context.isTouchDevice = false;

  (window as any).matchMedia = () => {};

  sinon.stub(window, 'matchMedia').callsFake((mq: string) => {
    switch (mq) {
      case '(hover: none)': {
        return {
          matches: context.isTouchDevice,
          addListener: (callback: any) => {},
        } as MediaQueryList;
      }
      default:
        return {
          matches: false,
          addListener: (callback: any) => {},
        } as MediaQueryList;
    }
  });
});

UseIsTouchDevice.after(() => {
  sinon.restore();
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

    assert.equal(result.current, false);
  }
);

UseIsTouchDevice.run();

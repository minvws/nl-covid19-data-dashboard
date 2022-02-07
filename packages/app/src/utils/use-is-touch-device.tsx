import { createContext, ReactNode, useContext } from 'react';
import { isTouchDevice } from './is-touch-device';

const isTouchDeviceContext = createContext(false);

/**
 * Context that tracks a media query which determines
 * if the current device supports a touch interface
 *
 */
export function IsTouchDeviceContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <isTouchDeviceContext.Provider value={isTouchDevice()}>
      {children}
    </isTouchDeviceContext.Provider>
  );
}

/**
 * This hook returns true if the current device supports a touch interface
 */
export function useIsTouchDevice() {
  return useContext(isTouchDeviceContext);
}

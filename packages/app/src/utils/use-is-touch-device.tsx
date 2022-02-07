import { createContext, ReactNode, useContext } from 'react';
import { isTouchDevice } from './is-touch-device';
import { useMediaQuery } from './use-media-query';

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
  console.log(isTouchDevice());
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

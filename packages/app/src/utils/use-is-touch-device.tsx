import { createContext, ReactNode, useContext } from 'react';
import { isTouch } from './is-touch';

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
  let isTouchDevice = false;

  if (typeof window !== 'undefined') {
    isTouchDevice = isTouch();
  }

  return (
    <isTouchDeviceContext.Provider value={isTouchDevice}>
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

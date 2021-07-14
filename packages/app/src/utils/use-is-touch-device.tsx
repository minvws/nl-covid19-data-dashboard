import { createContext, ReactNode, useContext } from 'react';
import { useMediaQuery } from './use-media-query';

const isTouchDeviceContext = createContext(false);

export function IsTouchDeviceContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const isTouchDevice = useMediaQuery('(hover: none)');

  return (
    <isTouchDeviceContext.Provider value={isTouchDevice}>
      {children}
    </isTouchDeviceContext.Provider>
  );
}

export function useIsTouchDevice() {
  return useContext(isTouchDeviceContext);
}

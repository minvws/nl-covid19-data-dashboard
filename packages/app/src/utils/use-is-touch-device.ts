import { useEffect, useState } from 'react';

/**
 * Subsequential calls to the hook can read this static value for initial
 * touch state
 */
let isTouchRegistered = false;

export function useIsTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(isTouchRegistered);

  useEffect(() => {
    if (isTouchDevice) return;

    const handleTouchStart = () => {
      isTouchRegistered = true;
      setIsTouchDevice(true);
    };

    document.addEventListener('touchstart', handleTouchStart);
    return () => document.removeEventListener('touchstart', handleTouchStart);
  }, [isTouchDevice]);

  return isTouchDevice;
}

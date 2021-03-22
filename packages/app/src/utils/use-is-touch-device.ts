import { useEffect, useState } from 'react';
import { useIsMountedRef } from './use-is-mounted-ref';

/**
 * Subsequential calls to the hook can read this static value for initial
 * touch state
 */
let isTouch = false;

export function useIsTouchDevice() {
  const isMountedRef = useIsMountedRef();
  const [isTouchDevice, setIsTouchDevice] = useState(isTouch);

  useEffect(() => {
    if (isTouchDevice) return;

    const handleTouchStart = () => {
      isTouch = true;
      setIsTouchDevice(true);
    };

    const handleMouseMove = () => {
      isTouch = false;
      setIsTouchDevice(false);
    };

    !isTouchDevice && document.addEventListener('touchstart', handleTouchStart);
    isTouchDevice && document.addEventListener('mousemove', handleMouseMove);

    return () => {
      !isTouchDevice &&
        document.removeEventListener('touchstart', handleTouchStart);
      isTouchDevice &&
        document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMountedRef, isTouchDevice]);

  return isTouchDevice;
}

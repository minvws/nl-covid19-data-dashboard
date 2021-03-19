import { useEffect, useState } from 'react';

/**
 * Subsequential calls to the hook can read this static value for initial
 * touch state
 */
let isTouch = false;

export function useIsTouchDevice() {
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

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isTouchDevice]);

  return isTouchDevice;
}

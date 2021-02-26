import { useEffect, useState } from 'react';

/**
 * Detect Trident layout engine used by IE11
 */
export function useIsIE11(initialValue = false) {
  const [isIE11, setIsIE11] = useState(initialValue);

  useEffect(() => {
    setIsIE11(window.navigator.userAgent.toLowerCase().includes('trident'));
  }, []);

  return isIE11;
}

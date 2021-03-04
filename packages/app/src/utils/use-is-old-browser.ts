import { useEffect, useState } from 'react';

/**
 * Detect old browsers like IE11
 */
export function useIsOldBrowser(initialValue = false) {
  const [isOldBrowser, setIsOldBrowser] = useState(initialValue);

  useEffect(() => {
    const isIe11 = window.navigator.userAgent.toLowerCase().includes('trident');
    setIsOldBrowser(isIe11);
  }, []);

  return isOldBrowser;
}

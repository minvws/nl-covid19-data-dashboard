import { useEffect, useRef } from 'react';

/**
 * Determines if the current component is mounted.
 */
export function useIsMountedRef() {
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return isMountedRef;
}
